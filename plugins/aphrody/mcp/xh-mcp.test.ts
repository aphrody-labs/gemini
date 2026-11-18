import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { respond, xhTools } from "./xh-mcp.ts";

describe("aphrody plugin xh MCP", () => {
  test("exposes all 6 xh tools with readOnly hints", () => {
    const tools = xhTools();
    expect(tools.map((t) => t.name)).toEqual([
      "xh_docs",
      "xh_code_graph",
      "xh_use_cases",
      "xh_translate_curl",
      "xh_build_request",
      "xh_request",
    ]);
  });

  test("knowledge tools serve docs, graph, and use cases", async () => {
    const res = await respond(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name: "xh_code_graph", arguments: { view: "summary" } },
      }),
    );
    expect(res?.result).toBeDefined();
    const text = (res as any).result.content[0].text;
    const parsed = JSON.parse(text);
    expect(parsed.summary.nodes).toBe(3826);
  });

  test("stdio initialize handshake works", async () => {
    const proc = Bun.spawn([process.execPath, join(import.meta.dir, "xh-mcp.ts")], {
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
    });
    proc.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} })}\n`);
    proc.stdin.end();
    const out = await new Response(proc.stdout).text();
    const msg = JSON.parse(out.trim());
    expect(msg.result.serverInfo.name).toBe("aphrody-xh");
    expect(await proc.exited).toBe(0);
  });
});
