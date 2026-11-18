import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  compressDts,
  extractApisFromDts,
  extractParamFields,
  importBunBrain,
  parseFrontmatter,
  parseMigrateToml,
  parseNodeCompatMdx,
  parseReplacePackageSpecs,
} from "./import-bun-brain.ts";

let tmp: string;
beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), "gemini-bun-brain-test-"));
});
afterAll(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe("import-bun-brain.ts", () => {
  test("parseFrontmatter extracts metadata and strips body", () => {
    const res = parseFrontmatter('---\ntitle: "Bun Test"\ndescription: "Fast test runner"\n---\n\n# Body\nHello');
    expect(res.title).toBe("Bun Test");
    expect(res.description).toBe("Fast test runner");
    expect(res.body).toBe("# Body\nHello");
  });

  test("extractParamFields parses Mintlify ParamField flags", () => {
    const flags = extractParamFields(
      '<ParamField path="--check" type="boolean" default="false">\n  Type check using <code>bun check</code>\n</ParamField>',
    );
    expect(flags).toEqual([
      {
        flag: "--check",
        type: "boolean",
        defaultVal: "false",
        description: "Type check using `bun check`",
      },
    ]);
  });

  test("compressDts strips comments and collapses huge literal unions", () => {
    const unionLines = Array.from({ length: 14 }, (_, i) => `  | "enc-${i}"`).join("\n") + ";";
    const sample = `/** Huge doc */\ndeclare module "bun" {\n  // line comment\n  type Encoding =\n${unionLines}\n  function sleep(ms: number): Promise<void>;\n}`;
    const out = compressDts(sample);
    expect(out).not.toContain("Huge doc");
    expect(out).not.toContain("line comment");
    expect(out).toContain("(+9 literals)");
    expect(out).toContain("function sleep(ms: number): Promise<void>;");
  });

  test("extractApisFromDts collects Bun exports and bun:* modules", () => {
    const dts = `declare module "bun" {\n  /** Serve HTTP */\n  function serve(opts: unknown): unknown;\n}\ndeclare module "bun:sqlite" {\n  export class Database {}\n}`;
    const parsed = extractApisFromDts(dts, "test.d.ts");
    expect(parsed.modules).toEqual(["bun", "bun:sqlite"]);
    expect(parsed.apis.some((a) => a.module === "bun" && a.name === "serve" && a.summary === "Serve HTTP")).toBe(true);
    expect(parsed.apis.some((a) => a.module === "bun:sqlite" && a.name === "Database")).toBe(true);
  });

  test("parseNodeCompatMdx extracts module and global compatibility rows", () => {
    const mdx = `---\ntitle: compat\n---\n## Built-in Node.js modules\n### [\`node:fs\`](https://nodejs.org)\n🟢 Fully implemented.\n## Node.js globals\n### [\`Storage\`](https://mdn)\n🔴 Not implemented.\n`;
    const rows = parseNodeCompatMdx(mdx);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ section: "module", name: "node:fs", status: "full" });
    expect(rows[1]).toMatchObject({ section: "global", name: "Storage", status: "none" });
  });

  test("parseMigrateToml and parseReplacePackageSpecs parse Bun migrate formats", () => {
    const toml = `# comment\n[text]\n{ id = "api/sleep", kinds = ["source"], pattern = '\\bsleep\\(', replace = "Bun.sleep($1)", autofix = true, aggressive = true }\n[packages]\n{ id = "bun/yaml", packages = ["js-yaml", "yaml"], replacement = "Bun.YAML" }\n`;
    const parsed = parseMigrateToml(toml);
    expect(parsed.text?.[0]?.id).toBe("api/sleep");
    expect(parsed.text?.[0]?.aggressive).toBe(true);
    expect(parsed.packages?.[0]?.packages).toEqual(["js-yaml", "yaml"]);

    const specs = parseReplacePackageSpecs(
      'const SPECS = [ Spec { rule: Rule::Glob, id: "replace/glob", packages: &["glob", "fast-glob"], to: "Bun.Glob" } ];',
    );
    expect(specs).toEqual([{ id: "replace/glob", packages: ["glob", "fast-glob"], to: "Bun.Glob" }]);
  });

  test("importBunBrain generates all 6 deterministic digests and skips cleanly when source missing", async () => {
    const fakeSrc = join(tmp, "fake-bun");
    const outDir = join(tmp, "out-brain");
    mkdirSync(join(fakeSrc, "docs", "runtime"), { recursive: true });
    mkdirSync(join(fakeSrc, "docs", "guides", "http"), { recursive: true });
    mkdirSync(join(fakeSrc, "docs", "pm", "cli"), { recursive: true });
    mkdirSync(join(fakeSrc, "packages", "bun-types", "ts7.1"), { recursive: true });
    mkdirSync(join(fakeSrc, ".claude", "skills", "verify"), { recursive: true });
    mkdirSync(join(fakeSrc, "src", "migrate", "registry"), { recursive: true });

    writeFileSync(
      join(fakeSrc, "docs", "docs.json"),
      JSON.stringify({
        navigation: {
          tabs: [{ tab: "Runtime", groups: [{ group: "Core", pages: ["/runtime/index"] }] }],
        },
      }),
    );
    writeFileSync(
      join(fakeSrc, "docs", "runtime", "index.mdx"),
      '---\ntitle: "Bun Runtime"\ndescription: "Fast JS/TS runtime"\n---\nUse `bun run`.\n',
    );
    writeFileSync(
      join(fakeSrc, "docs", "runtime", "nodejs-compat.mdx"),
      "---\ntitle: compat\n---\n## Built-in Node.js modules\n### `node:fs`\n🟢 Fully implemented.\n",
    );
    writeFileSync(
      join(fakeSrc, "docs", "guides", "http", "server.mdx"),
      '---\ntitle: "HTTP Server"\ndescription: "Serve HTTP"\n---\n```ts\nBun.serve({ fetch: () => new Response("ok") });\n```\n',
    );
    writeFileSync(
      join(fakeSrc, "docs", "pm", "cli", "migrate.mdx"),
      '---\ntitle: "bun migrate"\ndescription: "Migrate Node repo"\n---\nRun `bun migrate`.\n',
    );
    writeFileSync(join(fakeSrc, "packages", "bun-types", "index.d.ts"), '/// <reference path="./bun.d.ts" />\n');
    writeFileSync(
      join(fakeSrc, "packages", "bun-types", "bun.d.ts"),
      'declare module "bun" {\n  /** Serve HTTP */\n  function serve(opts: unknown): unknown;\n  function sleep(ms: number): Promise<void>;\n}\n',
    );
    writeFileSync(
      join(fakeSrc, "packages", "bun-types", "ts7.1", "import-attributes.d.ts"),
      'declare module "*" with { type: "text" } {\n  var text: string;\n  export = text;\n}\n',
    );
    writeFileSync(
      join(fakeSrc, ".claude", "skills", "verify", "SKILL.md"),
      '---\nname: verify\ndescription: Verify runtime\n---\n## Steps\n- Run `bun bd -e "1"`\n',
    );
    writeFileSync(
      join(fakeSrc, "src", "migrate", "registry", "packages.toml"),
      '[packages]\n{ id = "bun/yaml", packages = ["yaml"], replacement = "Bun.YAML" }\n',
    );
    writeFileSync(
      join(fakeSrc, "src", "migrate", "replace_packages.rs"),
      'Spec { rule: Rule::Glob, id: "replace/glob", packages: &["glob"], to: "Bun.Glob" }',
    );

    const first = await importBunBrain({ srcRoot: fakeSrc, outDir });
    expect(first.skipped).toBe(false);
    expect(first.filesWritten.sort()).toEqual([
      "CLI_TOOLING.md",
      "GUIDES_SKILLS_DIGEST.md",
      "INDEX.md",
      "LEGACY_REPLACEMENT.md",
      "RUNTIME_APIS.md",
      "TYPES_DIGEST.md",
    ]);
    for (const f of first.filesWritten) {
      expect(existsSync(join(outDir, f))).toBe(true);
    }
    expect(readFileSync(join(outDir, "RUNTIME_APIS.md"), "utf8")).toContain("Bun.serve");
    expect(readFileSync(join(outDir, "TYPES_DIGEST.md"), "utf8")).toContain("ts7.1/import-attributes.d.ts");
    expect(readFileSync(join(outDir, "LEGACY_REPLACEMENT.md"), "utf8")).toContain("bun/yaml");

    const second = await importBunBrain({ srcRoot: fakeSrc, outDir });
    expect(second.skipped).toBe(false);
    expect(second.filesWritten).toEqual([]);

    const missing = await importBunBrain({ srcRoot: join(tmp, "does-not-exist"), outDir });
    expect(missing.skipped).toBe(true);
    expect(existsSync(join(outDir, "INDEX.md"))).toBe(true);
  });
});
