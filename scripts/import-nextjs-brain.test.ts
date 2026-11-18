import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  compressNextDts,
  extractConfigInterfaceFields,
  extractDefaultConfigFromJs,
  extractDefaultConfigMap,
  extractSymbolsFromDts,
  importNextjsBrain,
  parseMarkdownFrontmatter,
  stripNextDocsMdx,
} from "./import-nextjs-brain.ts";

let tmp: string;
beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), "gemini-nextjs-brain-test-"));
});
afterAll(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe("import-nextjs-brain.ts", () => {
  test("parseMarkdownFrontmatter and stripNextDocsMdx clean Next.js MDX docs", () => {
    const raw = `---
title: Proxy
nav_title: ProxyNav
description: Request boundary in Next 16.
version: experimental
---

{/* internal comment */}
<AppOnly>
Use \`proxy.ts\`. See [Proxy](/docs/app/api-reference/file-conventions/proxy).
</AppOnly>
`;
    const fm = parseMarkdownFrontmatter(raw);
    expect(fm.title).toBe("Proxy");
    expect(fm.navTitle).toBe("ProxyNav");
    expect(fm.version).toBe("experimental");
    const clean = stripNextDocsMdx(fm.body);
    expect(clean).not.toContain("<AppOnly>");
    expect(clean).not.toContain("internal comment");
    expect(clean).toContain("Use `proxy.ts`. See Proxy.");
  });

  test("compressNextDts and extractSymbolsFromDts handle no-semicolon overloads", () => {
    const dts = `/** Cache for default profile */
export function cacheLife(profile: 'default'): void
/** Cache for hours profile */
export function cacheLife(profile: 'hours'): void
export type UnionMany =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j";
`;
    const compressed = compressNextDts(dts);
    expect(compressed).toContain("(+6 literals)");
    expect(compressed).not.toContain("Cache for default profile");

    const syms = extractSymbolsFromDts(dts, "next/cache", "cache.d.ts");
    const calls = syms.filter((s) => s.name === "cacheLife");
    expect(calls).toHaveLength(2);
    expect(calls[0]?.signature).toBe("export function cacheLife(profile: 'default'): void");
    expect(calls[1]?.signature).toBe("export function cacheLife(profile: 'hours'): void");
  });

  test("extractConfigInterfaceFields and extractDefaultConfigFromJs parse nested NextConfig and arrays", () => {
    const dts = `export interface NextConfig {
    /** Compiler transforms */
    compiler?: {
        removeConsole?: boolean | {
            exclude?: string[];
        };
        runAfterProductionCompile?: (meta: {
            projectDir: string;
        }) => Promise<void>;
    };
    /** Enable Cache Components */
    cacheComponents?: boolean;
}
export declare const defaultConfig: Readonly<{
    cacheComponents: false;
    experimental: {
        mcpServer: true;
    };
    cacheLife: {
        hours: {
            stale: number;
            revalidate: number;
            expire: number;
        };
    };
}>;`;
    const js = `const imageConfigDefault = {
    imageSizes: [
        32,
        48,
        64
    ],
    minimumCacheTTL: 14400
};`;
    const defaults = extractDefaultConfigMap(dts);
    expect(defaults.top.cacheComponents).toBe("false");
    expect(defaults.experimental.mcpServer).toBe("true");
    const imgDefaults = extractDefaultConfigFromJs(js, /^const\s+imageConfigDefault\s*=\s*\{/);
    expect(imgDefaults.imageSizes).toBe("[ 32 48 64 ]");
    expect(imgDefaults.minimumCacheTTL).toBe("14400");

    const fields = extractConfigInterfaceFields(dts, "NextConfig", defaults.top);
    expect(fields.map((f) => f.name)).toEqual(["compiler", "cacheComponents"]);
    expect(fields[1]).toMatchObject({
      name: "cacheComponents",
      type: "boolean",
      defaultVal: "false",
    });
  });

  test("importNextjsBrain creates all 5 digests deterministically and skips when missing", async () => {
    const missing = await importNextjsBrain({ srcRoot: join(tmp, "absent"), outDir: join(tmp, "unused") });
    expect(missing.skipped).toBe(true);

    const fakeNext = join(tmp, "fake-next");
    const outDir = join(tmp, "out-nextjs-brain");
    mkdirSync(join(fakeNext, "dist", "docs", "01-app", "01-getting-started"), { recursive: true });
    mkdirSync(join(fakeNext, "dist", "server", "request"), { recursive: true });
    mkdirSync(join(fakeNext, "dist", "server", "web", "spec-extension"), { recursive: true });
    mkdirSync(join(fakeNext, "dist", "server", "mcp", "tools"), { recursive: true });
    mkdirSync(join(fakeNext, "dist", "shared", "lib"), { recursive: true });
    mkdirSync(join(fakeNext, "dist", "lib"), { recursive: true });
    mkdirSync(join(fakeNext, "dist", "build", "segment-config", "app"), { recursive: true });
    mkdirSync(join(fakeNext, "dist", "build", "segment-config", "middleware"), { recursive: true });

    writeFileSync(join(fakeNext, "package.json"), JSON.stringify({ name: "next", version: "16.5.0-test.1" }));
    writeFileSync(join(fakeNext, "AGENTS.md"), "<!-- BEGIN:nextjs-agent-rules -->\nRead `dist/docs/`.\n<!-- END:nextjs-agent-rules -->\n");
    writeFileSync(join(fakeNext, "index.d.ts"), "export { default } from './types';\n");
    writeFileSync(join(fakeNext, "types.d.ts"), "export type Route<T = any> = string & {};\n");
    writeFileSync(join(fakeNext, "cache.d.ts"), "export function cacheLife(profile: 'max'): void\n");
    writeFileSync(join(fakeNext, "server.d.ts"), "export type NextProxy = (req: Request) => Response;\n");
    writeFileSync(join(fakeNext, "dist", "server", "mcp", "tools", "get-errors.d.ts"), "export {};\n");
    writeFileSync(
      join(fakeNext, "dist", "server", "config-shared.d.ts"),
      "export interface NextConfig {\n    cacheComponents?: boolean;\n}\nexport interface ExperimentalConfig {\n    goRoutes?: boolean;\n}\n",
    );
    writeFileSync(
      join(fakeNext, "dist", "server", "config-shared.js"),
      "const defaultConfig = Object.freeze({\n  cacheComponents: false,\n  experimental: {\n    goRoutes: false\n  }\n});\n",
    );
    writeFileSync(
      join(fakeNext, "dist", "shared", "lib", "image-config.d.ts"),
      "export type ImageConfigComplete = {\n    minimumCacheTTL: number;\n};\n",
    );
    writeFileSync(
      join(fakeNext, "dist", "shared", "lib", "image-config.js"),
      "const imageConfigDefault = {\n  minimumCacheTTL: 14400\n};\n",
    );
    writeFileSync(join(fakeNext, "dist", "lib", "load-custom-routes.d.ts"), "export type Rewrite = { source: string; destination: string; };\n");
    writeFileSync(
      join(fakeNext, "dist", "build", "segment-config", "app", "app-segment-config.d.ts"),
      "export type AppSegmentConfig = {\n    instant?: boolean;\n};\n",
    );
    writeFileSync(
      join(fakeNext, "dist", "build", "segment-config", "middleware", "middleware-config.d.ts"),
      "export type MiddlewareConfigInput = {\n    matcher?: string;\n};\n",
    );
    writeFileSync(
      join(fakeNext, "dist", "docs", "01-app", "01-getting-started", "16-proxy.md"),
      "---\ntitle: Proxy\ndescription: Proxy boundary\n---\n## Convention\nUse `proxy.ts`.\n",
    );

    const first = await importNextjsBrain({ srcRoot: fakeNext, outDir });
    expect(first.skipped).toBe(false);
    expect(first.filesWritten.sort()).toEqual([
      "CONFIG_SCHEMA.md",
      "DOCS_DIGEST.md",
      "INDEX.md",
      "TYPES_DIGEST.md",
      "UPSTREAM_APIS.md",
    ]);
    for (const file of first.filesWritten) {
      expect(existsSync(join(outDir, file))).toBe(true);
    }
    expect(readFileSync(join(outDir, "CONFIG_SCHEMA.md"), "utf8")).toContain("cacheComponents");
    expect(readFileSync(join(outDir, "TYPES_DIGEST.md"), "utf8")).toContain("NextProxy");
    expect(readFileSync(join(outDir, "UPSTREAM_APIS.md"), "utf8")).toContain("get_errors");

    const second = await importNextjsBrain({ srcRoot: fakeNext, outDir });
    expect(second.filesWritten).toEqual([]);
  });
});
