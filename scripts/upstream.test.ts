import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { OUT, cleanText, loadSources, rulesOf, slug, wanted } from "./upstream.ts";
import { skillMeta } from "./upstream-index.ts";

const rules = rulesOf({ repo: "o/r", kind: "extension" });

describe("upstream", () => {
  test("keeps skills, manifests, docs and licenses; drops binaries, dependency trees, tests and lockfiles", () => {
    for (const path of ["skills/x/SKILL.md", "gemini-extension.json", "commands/a.toml", "docs/guide.md", "LICENSE", "NOTICE.txt", "README.md"]) expect(wanted(path, 1000, rules)).toBe(true);
    for (const path of ["logo.png", "node_modules/a/index.md", "src/tests/a.json", "package-lock.json", "CHANGELOG.md", ".github/workflows/ci.yml", "dist/a.json", "x.exe", "pnpm-lock.yaml"]) expect(wanted(path, 1000, rules)).toBe(false);
  });

  test("a file over the size limit is dropped, and take and skip narrow the selection", () => {
    expect(wanted("docs/big.md", 300 * 1024, rules)).toBe(false);
    const narrow = rulesOf({ repo: "o/r", kind: "cli", take: ["^docs/"], skip: ["^docs/internal/"] });
    expect(wanted("docs/a.md", 10, narrow)).toBe(true);
    expect(wanted("docs/internal/a.md", 10, narrow)).toBe(false);
    expect(wanted("src/a.md", 10, narrow)).toBe(false);
    expect(wanted("LICENSE", 10, narrow)).toBe(true);
  });

  test("only clean UTF-8 text is stored: NUL bytes and invalid sequences are refused, BOM and CRLF are normalized", () => {
    expect(cleanText(new TextEncoder().encode("a\u0000b"))).toBeUndefined();
    expect(cleanText(new Uint8Array([0x61, 0xff]))).toBeUndefined();
    expect(cleanText(new TextEncoder().encode("﻿line1\r\nline2\r\n"))).toBe("line1\nline2\n");
  });

  test("skill metadata is read as YAML and survives an unquoted colon", () => {
    expect(skillMeta('---\nname: a\ndescription: "Use x: y"\n---\nbody')).toEqual({ name: "a", description: "Use x: y" });
    expect(skillMeta("---\nname: b\ndescription: Use `just`: runner\n---\n")).toEqual({ name: "b", description: "Use `just`: runner" });
    expect(skillMeta("no frontmatter")).toEqual({});
  });

  test("the registry is unique and every vendored source carries its license", () => {
    const sources = loadSources();
    expect(new Set(sources.map((s) => s.repo)).size).toBe(sources.length);
    for (const source of sources) {
      const dir = join(OUT, slug(source.repo));
      if (!existsSync(dir)) continue;
      expect(Bun.file(join(dir, "LICENSE")).size + Bun.file(join(dir, "LICENSE.txt")).size + Bun.file(join(dir, "LICENSE.md")).size).toBeGreaterThan(0);
    }
    expect(readFileSync(join(OUT, "upstream.toml"), "utf8")).not.toContain("antigravity-cli\"\nkind");
  });
});
