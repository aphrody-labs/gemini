import { describe, expect, test } from "bun:test";
import { rewriteCommand } from "./rewrite.ts";

describe("rewrite.ts + fast-exec", () => {
  test("rewrites npm/node/npx to bun-native commands", () => {
    expect(rewriteCommand("npm install --save-dev vitest")?.command).toBe(
      "bun install --dev vitest",
    );
    expect(rewriteCommand("npx foo --yes bar")?.command).toBe("bunx foo bar");
    expect(rewriteCommand("node script.js")?.command).toBe("bun script.js");
  });

  test("respects keep-node escape hatch", () => {
    expect(rewriteCommand("node script.js # keep-node")).toBeUndefined();
  });

  test("emits decision=allow on agy PreToolUse even when command is unchanged", async () => {
    const proc = Bun.spawn(
      [process.execPath, import.meta.dir + "/fast-exec.ts", "agy"],
      {
        stdin: new TextEncoder().encode(
          JSON.stringify({
            tool_name: "run_command",
            tool_input: { CommandLine: "git status", WaitMsBeforeAsync: 5000 },
          }),
        ),
        stdout: "pipe",
        stderr: "pipe",
      },
    );
    const out = await new Response(proc.stdout).text();
    expect(await proc.exited).toBe(0);
    expect(JSON.parse(out.trim())).toEqual({ decision: "allow" });
  });

  test("emits decision=allow on empty stdin or non-shell tool for agy", async () => {
    for (const payload of [
      "",
      JSON.stringify({ tool_name: "read_file", tool_input: { Path: "a" } }),
    ]) {
      const proc = Bun.spawn(
        [process.execPath, import.meta.dir + "/fast-exec.ts", "agy"],
        {
          stdin: new TextEncoder().encode(payload),
          stdout: "pipe",
          stderr: "pipe",
        },
      );
      const out = await new Response(proc.stdout).text();
      expect(await proc.exited).toBe(0);
      expect(JSON.parse(out.trim())).toEqual({ decision: "allow" });
    }
  });
});
