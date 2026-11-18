import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { handleRpcRequest, MCP_TOOLS } from "./bun-mcp.ts";

let tmp: string;
let projectDir: string;
const SERVER = join(import.meta.dir, "bun-mcp.ts");

beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), "bun-mcp-test-"));
  projectDir = join(tmp, "sample-node-app");
  mkdirSync(join(projectDir, "src"), { recursive: true });
  writeFileSync(
    join(projectDir, "package.json"),
    JSON.stringify({
      name: "sample-node-app",
      scripts: { test: "npm run lint && tsx src/index.ts", build: "pnpm run compile" },
      dependencies: { "better-sqlite3": "^11.0.0", "node-fetch": "^3.0.0", dotenv: "^16.0.0" },
    }),
  );
  writeFileSync(
    join(projectDir, "src", "index.ts"),
    'import fs from "fs";\nimport fetch from "node-fetch";\nconst txt = fs.readFileSync("a.txt", "utf8");\n',
  );
  writeFileSync(join(projectDir, "Dockerfile"), "FROM node:20-alpine\nRUN npm ci\n");
});

afterAll(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe("bun-mcp.ts", () => {
  test("unit RPC: initialize, tools/list, and all 5 tools return valid responses", () => {
    const init = handleRpcRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-03-26" },
    });
    expect(init?.result).toMatchObject({
      protocolVersion: "2025-03-26",
      serverInfo: { name: "bun-brain" },
    });

    const list = handleRpcRequest({ jsonrpc: "2.0", id: 2, method: "tools/list" });
    const tools = (list?.result as { tools: typeof MCP_TOOLS }).tools;
    expect(tools.map((t) => t.name)).toEqual([
      "bun_brain_search",
      "bun_types_lookup",
      "bun_api_matrix",
      "bun_legacy_scan",
      "bun_migrate_plan",
    ]);

    const searchRes = handleRpcRequest({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "bun_brain_search", arguments: { query: "Bun.serve websocket", limit: 3 } },
    });
    const searchPayload = JSON.parse(
      ((searchRes?.result as { content: Array<{ text: string }> }).content[0]?.text) ?? "{}",
    );
    expect(searchPayload.count).toBeGreaterThan(0);

    const typesRes = handleRpcRequest({
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: { name: "bun_types_lookup", arguments: { symbol: "serve", module: "bun" } },
    });
    const typesPayload = JSON.parse(
      ((typesRes?.result as { content: Array<{ text: string }> }).content[0]?.text) ?? "{}",
    );
    expect(typesPayload.hits.some((h: { name: string }) => h.name === "Bun.serve")).toBe(true);

    const matrixRes = handleRpcRequest({
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: { name: "bun_api_matrix", arguments: { kind: "node", topic: "sqlite" } },
    });
    const matrixPayload = JSON.parse(
      ((matrixRes?.result as { content: Array<{ text: string }> }).content[0]?.text) ?? "{}",
    );
    expect(matrixPayload.nodeCompat.some((n: { name: string }) => n.name === "node:sqlite")).toBe(true);

    const scanRes = handleRpcRequest({
      jsonrpc: "2.0",
      id: 6,
      method: "tools/call",
      params: { name: "bun_legacy_scan", arguments: { path: projectDir, fix: true } },
    });
    const scanPayload = JSON.parse(
      ((scanRes?.result as { content: Array<{ text: string }> }).content[0]?.text) ?? "{}",
    );
    expect(scanPayload.filesScanned).toBe(3);
    expect(scanPayload.findingCount).toBeGreaterThanOrEqual(5);

    const planRes = handleRpcRequest({
      jsonrpc: "2.0",
      id: 7,
      method: "tools/call",
      params: { name: "bun_migrate_plan", arguments: { root: projectDir, target: "rust" } },
    });
    const planPayload = JSON.parse(
      ((planRes?.result as { content: Array<{ text: string }> }).content[0]?.text) ?? "{}",
    );
    expect(planPayload.summary.safeAutofixCount).toBeGreaterThanOrEqual(2);
    expect(planPayload.summary.replacePackagesCandidates).toContain("node-fetch");
    expect(planPayload.rustTarget).toBeDefined();
  });

  test("live stdio JSON-RPC handshake over Bun.spawn", async () => {
    const requests = [
      { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26" } },
      { jsonrpc: "2.0", method: "notifications/initialized" },
      { jsonrpc: "2.0", id: 2, method: "tools/list" },
      {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "bun_legacy_scan",
          arguments: { code: 'import fs from "fs";\nconst d = fs.readFileSync("x.txt", "utf8");', filename: "a.ts", aggressive: true },
        },
      },
    ];
    const input = requests.map((r) => JSON.stringify(r)).join("\n") + "\n";
    const proc = Bun.spawn([process.execPath, "--no-install", "--no-env-file", SERVER], {
      stdin: new TextEncoder().encode(input),
      stdout: "pipe",
      stderr: "pipe",
    });
    const out = await new Response(proc.stdout).text();
    const err = await new Response(proc.stderr).text();
    const code = await proc.exited;
    expect(err).toBe("");
    expect(code).toBe(0);

    const lines = out
      .trim()
      .split(/\r?\n/)
      .map((l) => JSON.parse(l) as { id: number; result?: Record<string, unknown> });
    expect(lines).toHaveLength(3);
    expect(lines[0]?.id).toBe(1);
    expect(lines[1]?.id).toBe(2);
    expect((lines[1]?.result?.tools as unknown[]).length).toBe(5);
    expect(lines[2]?.id).toBe(3);
    const callText = ((lines[2]?.result?.content as Array<{ text: string }>)[0]?.text) ?? "";
    const callJson = JSON.parse(callText) as { changed: boolean; preview: string };
    expect(callJson.changed).toBe(true);
    expect(callJson.preview).toContain('import fs from "node:fs"');
    expect(callJson.preview).toContain("await Bun.file");
  });
});
