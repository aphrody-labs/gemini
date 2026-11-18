import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  computeCompletions,
  computeDocumentSymbols,
  computeHover,
  diagnoseDocument,
  encodeLspMessage,
  extractLspFrames,
  LspMessage,
  LspServer,
} from "./bun-lsp.ts";

let tmp: string;
const LSP_SCRIPT = join(import.meta.dir, "bun-lsp.ts");

beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), "bun-lsp-test-"));
  writeFileSync(
    join(tmp, "tsconfig.json"),
    JSON.stringify({ compilerOptions: { strict: true, noEmit: true, types: [] } }),
  );
});

afterAll(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe("bun-lsp.ts", () => {
  test("diagnoseDocument catches syntax errors, TS 7 type errors, and Bun legacy hints", () => {
    const badSyntax = diagnoseDocument("file:///demo.ts", "const x = ;", { runTypeCheck: false });
    expect(badSyntax.some((d) => d.severity === 1 && d.source === "bun transpiler")).toBe(true);

    const filePath = join(tmp, "bad.ts");
    const code = 'import fs from "fs";\nconst num: number = "oops";\nexport { fs, num };\n';
    writeFileSync(filePath, code);
    const diags = diagnoseDocument(pathToFileURL(filePath).href, code);
    expect(diags.some((d) => d.source === "bun check" && d.code === "TS2322")).toBe(true);
    expect(diags.some((d) => d.source === "bun-legacy" && d.code === "imports/node-prefix")).toBe(true);
  });

  test("computeHover, computeCompletions, and computeDocumentSymbols work against brain/bun", () => {
    const code = [
      'import { Database } from "bun:sqlite";',
      "export function startServer() {",
      "  return Bun.serve({ fetch: () => new Response('ok') });",
      "}",
      "const x = Bun.",
      'import y from "bun:',
    ].join("\n");

    const hoverServe = computeHover(code, { line: 2, character: 15 });
    expect(hoverServe?.contents.value).toContain("Bun.serve");

    const compsBun = computeCompletions(code, { line: 4, character: 14 });
    expect(compsBun.some((c) => c.label === "serve")).toBe(true);

    const compsMod = computeCompletions(code, { line: 5, character: 19 });
    expect(compsMod.some((c) => c.label === "bun:sqlite")).toBe(true);

    const syms = computeDocumentSymbols(code);
    expect(syms.map((s) => s.name)).toContain("startServer");
  });

  test("LspServer unit flow and Content-Length framing", () => {
    const sent: LspMessage[] = [];
    const srv = new LspServer((m) => sent.push(m));
    srv.handleMessage({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} });
    expect(sent[0]?.result).toMatchObject({ serverInfo: { name: "bun-lsp" } });

    const buf = Buffer.concat([
      Buffer.from(encodeLspMessage({ jsonrpc: "2.0", id: 1, method: "ping" })),
      Buffer.from(encodeLspMessage({ jsonrpc: "2.0", id: 2, method: "shutdown" })),
    ]);
    const parsed = extractLspFrames(buf);
    expect(parsed.frames).toHaveLength(2);
    expect(parsed.rest.length).toBe(0);
  });

  test("live stdio Content-Length LSP session via Bun.spawn", async () => {
    const badPath = join(tmp, "live.ts");
    const badCode = 'const n: number = "bad";\nBun.serve({ fetch: () => new Response("hi") });\n';
    writeFileSync(badPath, badCode);
    const uri = pathToFileURL(badPath).href;

    const input = Buffer.concat([
      Buffer.from(encodeLspMessage({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} })),
      Buffer.from(encodeLspMessage({ jsonrpc: "2.0", method: "notifications/initialized", params: {} })),
      Buffer.from(
        encodeLspMessage({
          jsonrpc: "2.0",
          method: "textDocument/didOpen",
          params: { textDocument: { uri, languageId: "typescript", version: 1, text: badCode } },
        }),
      ),
      Buffer.from(
        encodeLspMessage({
          jsonrpc: "2.0",
          id: 2,
          method: "textDocument/hover",
          params: { textDocument: { uri }, position: { line: 1, character: 6 } },
        }),
      ),
      Buffer.from(encodeLspMessage({ jsonrpc: "2.0", id: 3, method: "shutdown" })),
      Buffer.from(encodeLspMessage({ jsonrpc: "2.0", method: "exit" })),
    ]);

    const proc = Bun.spawn([process.execPath, "--no-install", "--no-env-file", LSP_SCRIPT], {
      stdin: input,
      stdout: "pipe",
      stderr: "pipe",
    });
    const out = Buffer.from(await new Response(proc.stdout).arrayBuffer());
    const err = await new Response(proc.stderr).text();
    const exitCode = await proc.exited;
    expect(err).toBe("");
    expect(exitCode).toBe(0);

    const { frames } = extractLspFrames(out);
    expect(frames.some((f) => f.id === 1 && Boolean(f.result))).toBe(true);
    const pub = frames.find((f) => f.method === "textDocument/publishDiagnostics");
    const diags = (pub?.params?.diagnostics as Array<{ code?: string }>) ?? [];
    expect(diags.some((d) => d.code === "TS2322")).toBe(true);
    const hover = frames.find((f) => f.id === 2);
    expect((hover?.result as { contents?: { value: string } })?.contents?.value).toContain("Bun.serve");
  });
});
