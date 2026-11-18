import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { handleRpcRequest, MCP_TOOLS } from "./nextjs-mcp.ts";

let tmp: string;
let fakeProject: string;
const SERVER = join(import.meta.dir, "nextjs-mcp.ts");

beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), "nextjs-mcp-test-"));
  fakeProject = join(tmp, "sample-next-app");
  mkdirSync(join(fakeProject, "node_modules", "next", "dist", "docs", "01-app", "01-getting-started"), {
    recursive: true,
  });
  writeFileSync(
    join(fakeProject, "node_modules", "next", "dist", "docs", "01-app", "01-getting-started", "16-proxy.md"),
    "# Proxy\nUse proxy.ts in Next.js 16+.\n",
  );
});

afterAll(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe("nextjs-mcp.ts", () => {
  test("unit RPC: initialize, tools/list, notifications, and all 4 tools return valid responses", () => {
    const init = handleRpcRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-03-26" },
    });
    expect(init?.result).toMatchObject({
      protocolVersion: "2025-03-26",
      serverInfo: { name: "nextjs-brain", version: "16.5.0" },
    });

    expect(
      handleRpcRequest({ jsonrpc: "2.0", method: "notifications/initialized" }),
    ).toBeNull();

    const list = handleRpcRequest({ jsonrpc: "2.0", id: 2, method: "tools/list" });
    const tools = (list?.result as { tools: typeof MCP_TOOLS }).tools;
    expect(tools.map((t) => t.name)).toEqual([
      "nextjs_brain_search",
      "nextjs_types_lookup",
      "nextjs_config_lookup",
      "nextjs_docs_lookup",
    ]);
    for (const t of tools) {
      expect(t.annotations.readOnlyHint).toBe(true);
    }

    const searchRes = handleRpcRequest({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "nextjs_brain_search", arguments: { query: "proxy NextProxy", limit: 4 } },
    });
    const searchPayload = JSON.parse(
      ((searchRes?.result as { content: Array<{ text: string }> }).content[0]?.text) ?? "{}",
    );
    expect(searchPayload.count).toBeGreaterThan(0);

    const typesRes = handleRpcRequest({
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: { name: "nextjs_types_lookup", arguments: { symbol: "revalidateTag", module: "next/cache" } },
    });
    const typesPayload = JSON.parse(
      ((typesRes?.result as { content: Array<{ text: string }> }).content[0]?.text) ?? "{}",
    );
    expect(typesPayload.hits.some((h: { name: string }) => h.name === "revalidateTag")).toBe(true);

    const cfgRes = handleRpcRequest({
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: { name: "nextjs_config_lookup", arguments: { option: "cacheComponents", section: "top" } },
    });
    const cfgPayload = JSON.parse(
      ((cfgRes?.result as { content: Array<{ text: string }> }).content[0]?.text) ?? "{}",
    );
    expect(cfgPayload.matches.some((m: { option: string }) => m.option.startsWith("cacheComponents"))).toBe(true);

    const routeOrderRes = handleRpcRequest({
      jsonrpc: "2.0",
      id: 6,
      method: "tools/call",
      params: { name: "nextjs_config_lookup", arguments: { option: "beforeFiles", section: "routes" } },
    });
    const routeOrderPayload = JSON.parse(
      ((routeOrderRes?.result as { content: Array<{ text: string }> }).content[0]?.text) ?? "{}",
    );
    expect(routeOrderPayload.routingOrder.length).toBeGreaterThanOrEqual(7);

    const docsRes = handleRpcRequest({
      jsonrpc: "2.0",
      id: 7,
      method: "tools/call",
      params: {
        name: "nextjs_docs_lookup",
        arguments: { topic: "proxy", router: "app", projectPath: fakeProject, readLocal: true },
      },
    });
    const docsPayload = JSON.parse(
      ((docsRes?.result as { content: Array<{ text: string }> }).content[0]?.text) ?? "{}",
    );
    expect(docsPayload.count).toBeGreaterThan(0);
    expect(docsPayload.localDocsDir).toContain("node_modules/next/dist/docs");
    expect(
      docsPayload.hits.some((h: { localExcerpt?: string }) => h.localExcerpt?.includes("proxy.ts")),
    ).toBe(true);
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
          name: "nextjs_config_lookup",
          arguments: { option: "minimumCacheTTL", section: "images" },
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
    expect((lines[1]?.result?.tools as unknown[]).length).toBe(4);
    expect(lines[2]?.id).toBe(3);
    const callText = ((lines[2]?.result?.content as Array<{ text: string }>)[0]?.text) ?? "";
    const callJson = JSON.parse(callText) as { matches: Array<{ option: string; defaultVal: string }> };
    expect(callJson.matches[0]?.option).toBe("minimumCacheTTL");
    expect(callJson.matches[0]?.defaultVal).toBe("14400");
  });
});
