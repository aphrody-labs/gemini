import { afterAll, describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { binaryKind, redirect } from "./binary-read.ts";

const dir = mkdtempSync(join(tmpdir(), "binary-read-"));
const cache = join(dir, "cache");
afterAll(() => rmSync(dir, { recursive: true, force: true }));
const file = (name: string, bytes: Uint8Array | string) => {
  const path = join(dir, name);
  writeFileSync(path, bytes);
  return path;
};

describe("binary-read", () => {
  test("recognizes binaries by magic number, NUL byte and invalid UTF-8, and leaves text alone", () => {
    expect(binaryKind(new TextEncoder().encode("%PDF-1.4\n..."))).toBe("PDF");
    expect(binaryKind(new Uint8Array([1, 2, 0, 3]))).toBe("binary data");
    expect(binaryKind(new Uint8Array([0x61, 0xff, 0xfe, 0x62]))).toBe("data that is not valid UTF-8");
    expect(binaryKind(new TextEncoder().encode("# title\nsome text with accents: é à 漢字\n"))).toBeUndefined();
  });

  test("a sample cut inside a multi-byte character is still text", () => {
    const cut = new TextEncoder().encode("abc漢").subarray(0, 5);
    expect(binaryKind(cut, true)).toBeUndefined();
    expect(binaryKind(cut, false)).toBe("data that is not valid UTF-8");
  });

  test("a mislabeled PDF is redirected to a note that names the real file", () => {
    const pdf = file("evals.md", "%PDF-1.4\n\u0000\u0001binary");
    const target = redirect(pdf, cache);
    expect(target).toBeDefined();
    expect(target).not.toBe(pdf);
    const text = readFileSync(target!, "utf8");
    expect(text).toContain(pdf);
    expect(text).toContain("PDF");
    expect(text).toContain("INVALID_ARGUMENT");
  });

  test("text, empty and missing files are read as they are", () => {
    expect(redirect(file("a.md", "# hello\n"), cache)).toBeUndefined();
    expect(redirect(file("empty.md", ""), cache)).toBeUndefined();
    expect(redirect(join(dir, "missing.md"), cache)).toBeUndefined();
    expect(redirect("", cache)).toBeUndefined();
  });

  test("the hook rewrites only the path argument and always allows", async () => {
    const pdf = file("b.md", "%PDF-1.7\u0000");
    const run = async (args: Record<string, unknown>) => {
      const process_ = Bun.spawn([process.execPath, join(import.meta.dir, "binary-read.ts"), "agy"], {
        stdin: new TextEncoder().encode(JSON.stringify({ toolCall: { name: "read_file", args } })),
        stdout: "pipe",
        env: { ...Bun.env, USERPROFILE: dir, HOME: dir },
      });
      return JSON.parse(await new Response(process_.stdout).text());
    };
    const rewritten = await run({ Path: pdf, StartLine: 1, EndLine: 450 });
    expect(rewritten.decision).toBe("allow");
    expect(Object.keys(rewritten.overwrite)).toEqual(["Path"]);
    expect(rewritten.overwrite.Path).not.toBe(pdf);
    const untouched = await run({ Path: file("c.md", "plain text\n") });
    expect(untouched).toEqual({ decision: "allow" });
    expect(await run({})).toEqual({ decision: "allow" });
  });
});
