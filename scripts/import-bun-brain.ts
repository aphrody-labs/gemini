#!/usr/bin/env bun
// Parses a local Bun checkout (docs/, packages/bun-types/, .claude/skills/, src/migrate/)
// into compacted, deterministic Markdown digests in ~/.gemini/brain/bun/.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { discoverWorkspaceRoot, GEMINI_ROOT, toSlash, userEnv, writeIfChanged } from "./lib.ts";

export const BRAIN_BUN_DIR = join(GEMINI_ROOT, "brain", "bun");

export interface Frontmatter {
  title?: string;
  sidebarTitle?: string;
  description?: string;
  body: string;
}

export interface DocsNavGroup {
  group: string;
  pages: string[];
}

export interface DocsNavTab {
  tab: string;
  href?: string;
  groups: DocsNavGroup[];
  pages: string[];
}

export interface ParamFlag {
  flag: string;
  type?: string;
  defaultVal?: string;
  description: string;
}

export interface ApiSignature {
  name: string;
  kind: "function" | "const" | "var" | "class" | "namespace" | "interface" | "type";
  signature: string;
  summary: string;
  module: string;
  file: string;
}

export interface NodeCompatEntry {
  section: "module" | "global";
  name: string;
  status: "full" | "partial" | "none";
  statusLabel: string;
  notes: string;
}

export interface MigrateRecord {
  [key: string]: string | boolean | string[] | undefined;
}

export interface ReplaceSpec {
  id: string;
  packages: string[];
  to: string;
}

export interface ImportOptions {
  srcRoot?: string;
  outDir?: string;
  write?: boolean;
}

export interface ImportSummary {
  skipped: boolean;
  reason?: string;
  srcRoot?: string;
  outDir: string;
  head?: string;
  sourceBytes: number;
  outputBytes: number;
  compressionRatio: number;
  filesWritten: string[];
  counts: {
    docsNavPages: number;
    mdxTotal: number;
    dtsFiles: number;
    skills: number;
    migrateRules: number;
  };
}

export function discoverBunSrcRoot(explicit?: string): string | null {
  if (explicit !== undefined) {
    const abs = toSlash(resolve(explicit));
    return existsSync(join(abs, "docs", "docs.json")) &&
      existsSync(join(abs, "packages", "bun-types", "index.d.ts"))
      ? abs
      : null;
  }
  const sysDrive = process.env.SystemDrive ?? "C:";
  const ws = discoverWorkspaceRoot();
  const candidates = [
    process.env.BUN_SRC_ROOT,
    userEnv("BUN_SRC_ROOT"),
    `${ws}/bun`,
    `${sysDrive}/src/bun`,
    "/src/bun",
  ].filter((v): v is string => Boolean(v));
  for (const cand of candidates) {
    const abs = toSlash(resolve(cand));
    if (
      existsSync(join(abs, "docs", "docs.json")) &&
      existsSync(join(abs, "packages", "bun-types", "index.d.ts"))
    ) {
      return abs;
    }
  }
  return null;
}

export function parseFrontmatter(raw: string): Frontmatter {
  const norm = raw.replace(/\r\n/g, "\n");
  if (!norm.startsWith("---\n")) {
    return { body: norm.trim() };
  }
  const end = norm.indexOf("\n---\n", 4);
  if (end === -1) return { body: norm.trim() };
  const fmText = norm.slice(4, end);
  const body = norm.slice(end + 5).trim();
  const out: Frontmatter = { body };
  for (const line of fmText.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.+)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2]!.trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key === "title") out.title = val;
    else if (key === "sidebarTitle") out.sidebarTitle = val;
    else if (key === "description") out.description = val;
  }
  return out;
}

export function extractParamFields(mdxBody: string): ParamFlag[] {
  const flags: ParamFlag[] = [];
  const re = /<ParamField\s+([^>]+)>([\s\S]*?)<\/ParamField>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(mdxBody)) !== null) {
    const attrs = m[1] ?? "";
    const inner = (m[2] ?? "")
      .replace(/\{\s*["']\s*["']\s*\}/g, " ")
      .replace(/<code>([^<]*)<\/code>/g, "`$1`")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const pathM = attrs.match(/path="([^"]+)"/);
    const typeM = attrs.match(/type="([^"]+)"/);
    const defM = attrs.match(/default="([^"]+)"/);
    if (pathM?.[1]) {
      flags.push({
        flag: pathM[1],
        type: typeM?.[1],
        defaultVal: defM?.[1],
        description: inner,
      });
    }
  }
  return flags;
}

export function stripMdxBoilerplate(body: string): string {
  return body
    .replace(/^import\s+[^\n]+$/gm, "")
    .replace(/\{\s*["']\s*["']\s*\}/g, " ")
    .replace(/<\/?(?:Steps|Step|Tabs|Tab|CodeGroup|Frame|Note|Warning|Info|Tip|AccordionGroup|Accordion|CardGroup|Card)[^>]*>/g, "")
    .replace(/<ParamField\s+path="([^"]+)"[^>]*>([\s\S]*?)<\/ParamField>/g, (_full, p: string, inner: string) => {
      const clean = inner
        .replace(/\{\s*["']\s*["']\s*\}/g, " ")
        .replace(/<code>([^<]*)<\/code>/g, "`$1`")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return `- \`${p}\`: ${clean}`;
    })
    .replace(/<code>([^<]*)<\/code>/g, "`$1`")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function parseDocsJson(docsDir: string): DocsNavTab[] {
  const raw = readFileSync(join(docsDir, "docs.json"), "utf8");
  const parsed = JSON.parse(raw) as {
    navigation?: {
      tabs?: Array<{
        tab?: string;
        href?: string;
        groups?: Array<{ group?: string; pages?: string[] }>;
        pages?: string[];
      }>;
    };
  };
  const tabs: DocsNavTab[] = [];
  for (const t of parsed.navigation?.tabs ?? []) {
    tabs.push({
      tab: t.tab ?? "Docs",
      href: t.href,
      groups: (t.groups ?? []).map((g) => ({
        group: g.group ?? "",
        pages: (g.pages ?? []).map((p) => p.replace(/^\//, "")),
      })),
      pages: (t.pages ?? []).map((p) => p.replace(/^\//, "")),
    });
  }
  return tabs;
}

function summarizeComment(commentBlock: string): string {
  const cleaned = commentBlock
    .trim()
    .replace(/^\/\*\*?/, "")
    .replace(/\*\/$/, "")
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*\*+\s?/, "").trim())
    .filter((l) => l && !l.startsWith("@") && !l.startsWith("```") && !l.startsWith("|"));
  return (cleaned[0] ?? "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\{@link\s+([^}]+)\}/g, "`$1`")
    .replace(/\s+/g, " ")
    .slice(0, 140);
}

function collapseLongLiteralUnions(code: string): string {
  const lines = code.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (/^\s*(?:export\s+)?type\s+[A-Za-z0-9_]+\s*=\s*$/.test(line)) {
      const members: string[] = [];
      let j = i + 1;
      while (j < lines.length && /^\s*(?:\/\/.*|\|\s*["'`][^"'`]+["'`]\s*;?)$/.test(lines[j]!)) {
        const trimmed = lines[j]!.trim();
        if (trimmed.startsWith("|")) members.push(trimmed);
        j++;
      }
      if (members.length > 10) {
        const head = members.slice(0, 5).map((m) => m.replace(/;$/, ""));
        out.push(`${line.trimEnd()} ${head.join(" ")} | ... (+${members.length - 5} literals);`);
        i = j;
        continue;
      }
    }
    out.push(line);
    i++;
  }
  return out.join("\n");
}

export function compressDts(content: string): string {
  const norm = content.replace(/\r\n/g, "\n");
  const withoutComments = norm
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      if (t.startsWith("///")) return true;
      if (t.startsWith("//")) return false;
      return true;
    })
    .join("\n");
  const collapsed = collapseLongLiteralUnions(withoutComments);
  return collapsed
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/g, ""))
    .filter((l) => l.length > 0)
    .join("\n");
}

function readBalancedSignature(lines: string[], startIdx: number): string {
  const first = lines[startIdx]!.trim();
  if (/^(?:export\s+)?(?:interface|class|namespace)\b/.test(first)) {
    return first.replace(/\s*\{[\s\S]*$/, "").replace(/\s+/g, " ");
  }
  if (first.endsWith(";")) return first.replace(/\s+/g, " ");
  let buf = first;
  let parens = (first.match(/\(/g)?.length ?? 0) - (first.match(/\)/g)?.length ?? 0);
  let braces = (first.match(/\{/g)?.length ?? 0) - (first.match(/\}/g)?.length ?? 0);
  let inComment = false;
  for (let i = startIdx + 1; i < Math.min(lines.length, startIdx + 24); i++) {
    let t = lines[i]!.trim();
    if (!t) continue;
    if (inComment) {
      if (t.includes("*/")) inComment = false;
      continue;
    }
    if (t.startsWith("/*")) {
      if (!t.includes("*/")) inComment = true;
      continue;
    }
    if (t.startsWith("//") || t.startsWith("*")) continue;
    t = t.replace(/\/\*[\s\S]*?\*\//g, "").trim();
    if (!t) continue;
    buf += " " + t;
    parens += (t.match(/\(/g)?.length ?? 0) - (t.match(/\)/g)?.length ?? 0);
    braces += (t.match(/\{/g)?.length ?? 0) - (t.match(/\}/g)?.length ?? 0);
    if (t.endsWith(";") && parens <= 0 && braces <= 0) break;
    if (buf.length > 210) break;
  }
  return buf.replace(/\s+/g, " ").replace(/\s*\{\s*$/, "").slice(0, 220);
}

export function extractApisFromDts(content: string, relFile: string): {
  modules: string[];
  apis: ApiSignature[];
} {
  const norm = content.replace(/\r\n/g, "\n");
  const lines = norm.split("\n");
  const modules: string[] = [];
  const apis: ApiSignature[] = [];
  let currentModule = "global";
  let lastComment = "";
  let inBlockComment = false;
  let commentBuf: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]!;
    const trimmed = rawLine.trim();

    if (inBlockComment) {
      commentBuf.push(rawLine);
      if (trimmed.includes("*/")) {
        inBlockComment = false;
        lastComment = summarizeComment(commentBuf.join("\n"));
        commentBuf = [];
      }
      continue;
    }
    if (trimmed.startsWith("/*")) {
      if (trimmed.includes("*/")) {
        lastComment = summarizeComment(rawLine);
      } else {
        inBlockComment = true;
        commentBuf = [rawLine];
      }
      continue;
    }

    const modMatch = rawLine.match(/^declare\s+module\s+("[^"]+"(?:\s+with\s+\{[^}]+\})?)\s*\{?/);
    if (modMatch) {
      currentModule = modMatch[1]!.replace(/^"|"$/g, "");
      if (!modules.includes(currentModule)) modules.push(currentModule);
      lastComment = "";
      continue;
    }
    if (rawLine === "}") {
      currentModule = "global";
      lastComment = "";
      continue;
    }

    const indent = rawLine.search(/\S/);
    if (indent === 2 && currentModule !== "global") {
      const declM = rawLine.match(
        /^\s*(?:export\s+)?(function|const|var|class|namespace|interface|type)\s+([$A-Za-z0-9_]+)/,
      );
      if (declM && declM[2] !== "__internal") {
        const kind = declM[1] as ApiSignature["kind"];
        const name = declM[2]!;
        const signature = readBalancedSignature(lines, i);
        apis.push({
          name,
          kind,
          signature,
          summary: lastComment,
          module: currentModule,
          file: relFile,
        });
        lastComment = "";
      } else if (trimmed && !trimmed.startsWith("//")) {
        lastComment = "";
      }
    } else if (indent === 0) {
      const topDecl = rawLine.match(
        /^declare\s+(class|var|const|function|namespace)\s+([$A-Za-z0-9_]+)/,
      );
      if (topDecl) {
        apis.push({
          name: topDecl[2]!,
          kind: topDecl[1] as ApiSignature["kind"],
          signature: readBalancedSignature(lines, i),
          summary: lastComment,
          module: "global",
          file: relFile,
        });
        lastComment = "";
      }
    }
  }
  return { modules, apis };
}

export function parseNodeCompatMdx(raw: string): NodeCompatEntry[] {
  const { body } = parseFrontmatter(raw);
  const lines = body.split("\n");
  const out: NodeCompatEntry[] = [];
  let section: "module" | "global" = "module";
  let curName = "";
  let curBuf: string[] = [];

  const flush = () => {
    if (!curName) return;
    const text = curBuf.join(" ").replace(/\s+/g, " ").trim();
    let status: NodeCompatEntry["status"] = "partial";
    let statusLabel = "Partial";
    if (text.includes("🟢")) {
      status = "full";
      statusLabel = "Full";
    } else if (text.includes("🔴")) {
      status = "none";
      statusLabel = "Not implemented";
    } else if (text.includes("🟡")) {
      status = "partial";
      statusLabel = "Partial";
    }
    const cleanNotes = text
      .replace(/[🟢🟡🔴]\s*/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .slice(0, 220);
    out.push({ section, name: curName, status, statusLabel, notes: cleanNotes });
    curName = "";
    curBuf = [];
  };

  for (const line of lines) {
    if (/^##\s+Node\.js globals/i.test(line)) {
      flush();
      section = "global";
      continue;
    }
    const h3 = line.match(/^###\s+(?:\[`?([^\`\]\(]+)`?\]\([^)]+\)|`?([^`\n]+)`?)/);
    if (h3) {
      flush();
      curName = (h3[1] ?? h3[2] ?? "").trim();
      continue;
    }
    if (curName && line.trim()) {
      curBuf.push(line.trim());
    }
  }
  flush();
  return out;
}

function unescapeTomlStr(raw: string, quote: string): string {
  if (quote === "'") return raw;
  return raw
    .replace(/\\x([0-9A-Fa-f]{2})/g, (_m, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

export function parseMigrateToml(raw: string): Record<string, MigrateRecord[]> {
  const sections: Record<string, MigrateRecord[]> = {};
  let current = "";
  for (const rawLine of raw.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const secM = line.match(/^\[([A-Za-z0-9_.-]+)\]$/);
    if (secM) {
      current = secM[1]!;
      sections[current] ??= [];
      continue;
    }
    if (!current || !line.startsWith("{") || !line.endsWith("}")) continue;
    const inner = line.slice(1, -1);
    const rec: MigrateRecord = {};
    let idx = 0;
    while (idx < inner.length) {
      while (idx < inner.length && /[\s,]/.test(inner[idx]!)) idx++;
      if (idx >= inner.length) break;
      const eq = inner.indexOf("=", idx);
      if (eq === -1) break;
      const key = inner.slice(idx, eq).trim();
      idx = eq + 1;
      while (idx < inner.length && /\s/.test(inner[idx]!)) idx++;
      const ch = inner[idx];
      if (ch === '"' || ch === "'") {
        idx++;
        let val = "";
        while (idx < inner.length) {
          const c = inner[idx]!;
          if (ch === '"' && c === "\\") {
            val += c + (inner[idx + 1] ?? "");
            idx += 2;
            continue;
          }
          if (c === ch) {
            idx++;
            break;
          }
          val += c;
          idx++;
        }
        rec[key] = unescapeTomlStr(val, ch);
      } else if (ch === "[") {
        idx++;
        const items: string[] = [];
        while (idx < inner.length && inner[idx] !== "]") {
          while (idx < inner.length && /[\s,]/.test(inner[idx]!)) idx++;
          if (inner[idx] === "]") break;
          const q = inner[idx];
          if (q === '"' || q === "'") {
            idx++;
            let item = "";
            while (idx < inner.length) {
              const c = inner[idx]!;
              if (q === '"' && c === "\\") {
                item += c + (inner[idx + 1] ?? "");
                idx += 2;
                continue;
              }
              if (c === q) {
                idx++;
                break;
              }
              item += c;
              idx++;
            }
            items.push(unescapeTomlStr(item, q));
          } else {
            const start = idx;
            while (idx < inner.length && inner[idx] !== "," && inner[idx] !== "]") idx++;
            const tok = inner.slice(start, idx).trim();
            if (tok) items.push(tok);
          }
        }
        if (inner[idx] === "]") idx++;
        rec[key] = items;
      } else {
        const start = idx;
        while (idx < inner.length && inner[idx] !== ",") idx++;
        const tok = inner.slice(start, idx).trim();
        if (tok === "true") rec[key] = true;
        else if (tok === "false") rec[key] = false;
        else rec[key] = tok;
      }
    }
    sections[current]!.push(rec);
  }
  return sections;
}

export function parseReplacePackageSpecs(rsText: string): ReplaceSpec[] {
  const specs: ReplaceSpec[] = [];
  const re =
    /Spec\s*\{\s*rule:\s*Rule::\w+,\s*id:\s*"([^"]+)",\s*packages:\s*&\[([^\]]+)\],\s*to:\s*"([^"]+)"\s*\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rsText)) !== null) {
    const pkgs = [...m[2]!.matchAll(/"([^"]+)"/g)].map((x) => x[1]!);
    specs.push({ id: m[1]!, packages: pkgs, to: m[3]! });
  }
  return specs;
}

function listFilesSorted(dir: string, suffix: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(suffix))
    .sort((a, b) => a.localeCompare(b));
}

function cleanMarkdownInline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeMdxPage(filePath: string): {
  title: string;
  description: string;
  headings: string[];
  params: ParamFlag[];
  codeSnippets: string[];
  keyLines: string[];
} {
  const raw = readFileSync(filePath, "utf8");
  const fm = parseFrontmatter(raw);
  const clean = stripMdxBoilerplate(fm.body);
  const lines = clean.split("\n");
  const headings: string[] = [];
  const codeSnippets: string[] = [];
  const keyLines: string[] = [];
  let inCode = false;
  let codeBuf: string[] = [];
  for (const line of lines) {
    if (line.startsWith("```")) {
      if (!inCode) {
        inCode = true;
        codeBuf = [];
      } else {
        inCode = false;
        const snippet = codeBuf.join("\n").trim();
        if (snippet && codeSnippets.length < 2 && snippet.length <= 240) {
          codeSnippets.push(snippet);
        }
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    const h = line.match(/^#{2,3}\s+(.+)$/);
    if (h) {
      headings.push(h[1]!.replace(/`/g, "").trim());
    } else if (
      line.trim() &&
      !line.startsWith("|") &&
      !line.startsWith("---") &&
      keyLines.length < 3 &&
      line.trim().length > 20
    ) {
      keyLines.push(cleanMarkdownInline(line).slice(0, 180));
    }
  }
  return {
    title: fm.title ?? fm.sidebarTitle ?? basename(filePath, ".mdx"),
    description: fm.description ? cleanMarkdownInline(fm.description) : "",
    headings: headings.slice(0, 8),
    params: extractParamFields(fm.body),
    codeSnippets,
    keyLines,
  };
}

function buildIndexMd(
  head: string,
  tabs: DocsNavTab[],
  docsDir: string,
  sourceBytes: number,
  counts: ImportSummary["counts"],
): string {
  const lines: string[] = [
    "# Bun Knowledge Brain Index",
    "",
    `- Source revision: \`${head}\``,
    `- Corpus: ${counts.mdxTotal} MDX docs (${counts.docsNavPages} nav pages), ${counts.dtsFiles} \`bun-types\` declaration files, ${counts.skills} repo dev skills, ${counts.migrateRules} migration rules (${(sourceBytes / 1024 / 1024).toFixed(2)} MiB raw).`,
    "",
    "## Brain Files",
    "",
    "| File | Contents |",
    "| :--- | :--- |",
    "| `INDEX.md` | Sitemap from `docs.json`, CLI quick reference, topic router |",
    "| `RUNTIME_APIS.md` | `Bun.*` global APIs + signatures, `bun:*` built-in modules, Web/Node globals, `node:*` compat matrix |",
    "| `TYPES_DIGEST.md` | Compressed TypeScript declarations from all `packages/bun-types/*.d.ts` + `ts7.1/` |",
    "| `CLI_TOOLING.md` | `run`, `test`, `build`, `compile`, `install`/`pm`, `check`, `lint`, `fmt`, `migrate` + `bunfig.toml` |",
    "| `GUIDES_SKILLS_DIGEST.md` | Mintlify guides summary + upstream runtime dev skills (`verify`, bundler/HMR tests, JSC, `bun_sys`) |",
    "| `LEGACY_REPLACEMENT.md` | Legacy JS/TS/npm/CI/Docker/Rust replacement matrix from `src/migrate/registry/*.toml` + `replace_packages.rs` |",
    "",
    "## Quick CLI & API Lookup",
    "",
    "| Task / Domain | Canonical Bun Command / API | Brain File |",
    "| :--- | :--- | :--- |",
    "| Run TS/JS / scripts | `bun run`, `bun --watch`, `bun --hot`, `bun --check` | `CLI_TOOLING.md` |",
    "| Type check (TS 7) | `bun check` (`--no-script`, `-p`, `-b`, `--aot`) | `CLI_TOOLING.md` |",
    "| Lint / Format | `bun lint` (`--fix`, `--type-aware`), `bun fmt` (`--check`) | `CLI_TOOLING.md` |",
    "| Test runner | `bun test`, `import { test, expect, mock } from \"bun:test\"` | `CLI_TOOLING.md`, `RUNTIME_APIS.md` |",
    "| Bundle / Compile | `bun build`, `Bun.build()`, `bun build --compile`, `bun compile` | `CLI_TOOLING.md` |",
    "| Package manager | `bun install`, `bun add`, `bun remove`, `bunx`, `bun pm` | `CLI_TOOLING.md` |",
    "| Node migration | `bun migrate` (`--write`, `--aggressive`, `--replace-packages`, `--target rust`), `bun pm migrate` | `LEGACY_REPLACEMENT.md`, `CLI_TOOLING.md` |",
    "| HTTP / WebSocket | `Bun.serve({ routes, fetch, websocket })` | `RUNTIME_APIS.md` |",
    "| File I/O / Glob | `Bun.file()`, `Bun.write()`, `new Bun.Glob()` | `RUNTIME_APIS.md` |",
    "| Shell / Subprocess | ``Bun.$`...` ``, `Bun.spawn()`, `Bun.spawnSync()` | `RUNTIME_APIS.md` |",
    "| SQL / SQLite / Redis / S3 | `bun:sqlite`, `Bun.sql`/`Bun.SQL`, `Bun.redis`/`Bun.RedisClient`, `Bun.s3`/`Bun.S3Client` | `RUNTIME_APIS.md`, `TYPES_DIGEST.md` |",
    "| Hashing / Crypto / Passwords | `Bun.password`, `Bun.hash`, `Bun.CryptoHasher`, `Bun.CSRF` | `RUNTIME_APIS.md` |",
    "| Parsers / Text / Binary | `Bun.YAML`, `Bun.TOML`, `Bun.JSON5`, `Bun.JSONC`, `Bun.JSONL`, `Bun.XML`, `Bun.markdown`, `HTMLRewriter` | `RUNTIME_APIS.md` |",
    "| FFI / Workers / WebView | `bun:ffi`, `new Worker()`, `Bun.WebView`, `Bun.Archive`, `Bun.cron` | `RUNTIME_APIS.md`, `TYPES_DIGEST.md` |",
    "",
    "## Docs Sitemap (`docs/docs.json`)",
    "",
  ];

  for (const tab of tabs) {
    lines.push(`### ${tab.tab}`);
    if (tab.href) {
      lines.push(`- External: ${tab.href}`);
    }
    for (const p of tab.pages) {
      const mdxPath = join(docsDir, `${p}.mdx`);
      const info = existsSync(mdxPath) ? summarizeMdxPage(mdxPath) : null;
      lines.push(`- \`${p}\`${info ? ` — **${info.title}**: ${info.description}` : ""}`);
    }
    for (const g of tab.groups) {
      lines.push(`#### ${g.group}`);
      for (const p of g.pages) {
        const mdxPath = join(docsDir, `${p}.mdx`);
        const info = existsSync(mdxPath) ? summarizeMdxPage(mdxPath) : null;
        const desc = info?.description ? `: ${info.description}` : "";
        lines.push(`- \`${p}\`${info ? ` — **${info.title}**${desc}` : ""}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function buildRuntimeApisMd(
  typesDir: string,
  docsDir: string,
): { content: string; bunApiCount: number; builtinModules: string[]; nodeCompatCount: number } {
  const files = [
    ...listFilesSorted(typesDir, ".d.ts"),
    ...listFilesSorted(join(typesDir, "ts7.1"), ".d.ts").map((f) => `ts7.1/${f}`),
  ];

  const allApis: ApiSignature[] = [];
  const allModules = new Set<string>();
  for (const rel of files) {
    const text = readFileSync(join(typesDir, rel), "utf8");
    const parsed = extractApisFromDts(text, rel);
    for (const m of parsed.modules) allModules.add(m);
    allApis.push(...parsed.apis);
  }

  const bunExports = new Map<string, ApiSignature[]>();
  const modExports = new Map<string, ApiSignature[]>();
  const globalDecls: ApiSignature[] = [];

  for (const api of allApis) {
    if (api.module === "bun") {
      if (api.kind === "interface" || api.kind === "type") continue;
      const list = bunExports.get(api.name) ?? [];
      list.push(api);
      bunExports.set(api.name, list);
    } else if (api.module === "global") {
      globalDecls.push(api);
    } else {
      if (api.kind === "interface" || api.kind === "type") continue;
      const list = modExports.get(api.module) ?? [];
      list.push(api);
      modExports.set(api.module, list);
    }
  }

  const compatPath = join(docsDir, "runtime", "nodejs-compat.mdx");
  const compatRows = existsSync(compatPath)
    ? parseNodeCompatMdx(readFileSync(compatPath, "utf8"))
    : [];

  const globalsPath = join(docsDir, "runtime", "globals.mdx");
  const globalsLines = existsSync(globalsPath)
    ? parseFrontmatter(readFileSync(globalsPath, "utf8"))
        .body.split("\n")
        .filter((l) => l.startsWith("|"))
    : [];

  const bunApisDocPath = join(docsDir, "runtime", "bun-apis.mdx");
  const bunApisTable = existsSync(bunApisDocPath)
    ? parseFrontmatter(readFileSync(bunApisDocPath, "utf8"))
        .body.split("\n")
        .filter((l) => l.startsWith("|"))
    : [];

  const lines: string[] = [
    "# Bun Runtime APIs & Compatibility",
    "",
    "Extracted from `packages/bun-types/*.d.ts` and `docs/runtime/{bun-apis,globals,nodejs-compat}.mdx`.",
    "",
    "## Topic Overview (`docs/runtime/bun-apis.mdx`)",
    "",
    ...bunApisTable,
    "",
    "## `Bun.*` Global Namespace Signatures (`declare module \"bun\"`)",
    "",
  ];

  const sortedBunNames = [...bunExports.keys()].sort((a, b) => a.localeCompare(b));
  for (const name of sortedBunNames) {
    const entries = bunExports.get(name)!;
    const primary = entries[0]!;
    const summary = primary.summary ? ` — ${primary.summary}` : "";
    lines.push(`### \`Bun.${name}\` (${primary.kind}, \`${primary.file}\`)${summary}`);
    for (const e of entries.slice(0, 4)) {
      lines.push(`- \`${e.signature}\``);
    }
    if (entries.length > 4) {
      lines.push(`- _(+${entries.length - 4} additional overloads in \`${primary.file}\`)_`);
    }
  }

  lines.push("", "## Built-in `bun:*` & Ambient Modules", "");
  const builtinList = [...allModules].filter((m) => m.startsWith("bun")).sort();
  for (const mod of [...modExports.keys()].sort()) {
    const entries = modExports.get(mod)!.slice(0, 25);
    lines.push(`### \`${mod}\``);
    for (const e of entries) {
      lines.push(`- \`${e.signature}\`${e.summary ? ` — ${e.summary}` : ""}`);
    }
  }
  const otherMods = [...allModules].filter((m) => !m.startsWith("bun") && !modExports.has(m)).sort();
  if (otherMods.length > 0) {
    lines.push("", "### Ambient / Module Overrides", "");
    for (const m of otherMods) lines.push(`- \`${m}\``);
  }

  lines.push("", "## Global Declarations (`bun-types`)", "");
  for (const g of globalDecls) {
    lines.push(`- \`${g.signature}\` (\`${g.file}\`)`);
  }

  if (globalsLines.length > 0) {
    lines.push("", "## Runtime Globals (`docs/runtime/globals.mdx`)", "", ...globalsLines);
  }

  lines.push(
    "",
    "## `node:*` Compatibility Matrix (`docs/runtime/nodejs-compat.mdx`)",
    "",
    "| Scope | Name | Status | Key Notes |",
    "| :--- | :--- | :--- | :--- |",
  );
  for (const row of compatRows) {
    const notes = row.notes.replace(/\|/g, "\\|");
    lines.push(`| ${row.section} | \`${row.name}\` | ${row.statusLabel} | ${notes} |`);
  }

  return {
    content: lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n",
    bunApiCount: sortedBunNames.length,
    builtinModules: builtinList,
    nodeCompatCount: compatRows.length,
  };
}

function buildTypesDigestMd(typesDir: string): { content: string; dtsCount: number } {
  const rootFiles = listFilesSorted(typesDir, ".d.ts");
  const ts71Files = listFilesSorted(join(typesDir, "ts7.1"), ".d.ts").map((f) => `ts7.1/${f}`);
  const allFiles = [...rootFiles, ...ts71Files];

  const lines: string[] = [
    "# Bun Types Digest (`packages/bun-types`)",
    "",
    `Covers ${allFiles.length} declaration files (${rootFiles.length} root \`*.d.ts\` + ${ts71Files.length} \`ts7.1/*.d.ts\`). Comments and long literal unions compressed for dense lookup.`,
    "",
  ];

  for (const rel of allFiles) {
    const raw = readFileSync(join(typesDir, rel), "utf8");
    const condensed = compressDts(raw);
    const rawLines = raw.split(/\r?\n/).length;
    const outLines = condensed.split("\n");
    const headerLines: string[] = [];
    let skipped = 0;
    let inInternalBlock = false;
    let internalDepth = 0;
    for (const l of outLines) {
      if (inInternalBlock) {
        internalDepth += (l.match(/\{/g)?.length ?? 0) - (l.match(/\}/g)?.length ?? 0);
        skipped++;
        if (internalDepth <= 0) inInternalBlock = false;
        continue;
      }
      if (/^\s*namespace\s+__internal\b/.test(l)) {
        inInternalBlock = true;
        internalDepth = (l.match(/\{/g)?.length ?? 0) - (l.match(/\}/g)?.length ?? 0);
        skipped++;
        continue;
      }
      const indent = l.search(/\S/);
      const isBalancedBrace = /^\s*[}\]]+;?$/.test(l);
      if (indent <= 4 || (isBalancedBrace && indent <= 4)) {
        headerLines.push(l);
      } else {
        skipped++;
      }
    }
    lines.push(`## \`${rel}\` (${rawLines} lines -> ${headerLines.length} lines${skipped ? `, ${skipped} nested lines elided` : ""})`);
    lines.push("");
    lines.push("```ts");
    lines.push(...headerLines);
    lines.push("```");
    lines.push("");
  }

  return {
    content: lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n",
    dtsCount: allFiles.length,
  };
}

function renderCliSection(title: string, mdxPaths: string[], snippetPath?: string): string[] {
  const out: string[] = [`## ${title}`, ""];
  for (const p of mdxPaths) {
    if (!existsSync(p)) continue;
    const s = summarizeMdxPage(p);
    out.push(`### ${s.title}${s.description ? ` — ${s.description}` : ""}`);
    if (s.headings.length > 0) out.push(`- Sections: ${s.headings.join(" · ")}`);
    for (const kl of s.keyLines.slice(0, 2)) out.push(`- ${kl}`);
    if (s.codeSnippets[0]) {
      out.push("```sh", s.codeSnippets[0], "```");
    }
  }
  if (snippetPath && existsSync(snippetPath)) {
    const params = extractParamFields(readFileSync(snippetPath, "utf8"));
    if (params.length > 0) {
      out.push("", `### CLI Flags (\`${basename(snippetPath)}\`)`, "", "| Flag | Type | Default | Description |", "| :--- | :--- | :--- | :--- |");
      for (const f of params) {
        out.push(
          `| \`${f.flag}\` | ${f.type ?? "-"} | ${f.defaultVal ? `\`${f.defaultVal}\`` : "-"} | ${f.description.replace(/\|/g, "\\|")} |`,
        );
      }
    }
  }
  out.push("");
  return out;
}

function buildCliToolingMd(docsDir: string): string {
  const lintRuleCounts = new Map<string, number>();
  const lintRulesDir = join(docsDir, "lint", "rules");
  if (existsSync(lintRulesDir)) {
    for (const entry of readdirSync(lintRulesDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const count = listFilesSorted(join(lintRulesDir, entry.name), ".mdx").length;
        lintRuleCounts.set(entry.name, count);
      }
    }
  }

  const lines: string[] = [
    "# Bun CLI & Tooling Reference",
    "",
    "Distilled from `docs/{runtime,test,bundler,compiler,pm,lint,format}` and `docs/snippets/cli/*.mdx`.",
    "",
    ...renderCliSection(
      "`bun run` & Runtime Flags",
      [
        join(docsDir, "runtime", "index.mdx"),
        join(docsDir, "runtime", "watch-mode.mdx"),
        join(docsDir, "runtime", "bunfig.mdx"),
        join(docsDir, "runtime", "debugger.mdx"),
        join(docsDir, "runtime", "repl.mdx"),
      ],
      join(docsDir, "snippets", "cli", "run.mdx"),
    ),
    ...renderCliSection(
      "`bun test` (Test Runner)",
      [
        join(docsDir, "test", "index.mdx"),
        join(docsDir, "test", "writing-tests.mdx"),
        join(docsDir, "test", "configuration.mdx"),
        join(docsDir, "test", "mocks.mdx"),
        join(docsDir, "test", "snapshots.mdx"),
        join(docsDir, "test", "code-coverage.mdx"),
        join(docsDir, "test", "dom.mdx"),
      ],
      join(docsDir, "snippets", "cli", "test.mdx"),
    ),
    ...renderCliSection(
      "`bun build` & `bun compile` (Bundler & Compiler)",
      [
        join(docsDir, "bundler", "index.mdx"),
        join(docsDir, "bundler", "fullstack.mdx"),
        join(docsDir, "bundler", "plugins.mdx"),
        join(docsDir, "bundler", "macros.mdx"),
        join(docsDir, "compiler", "index.mdx"),
        join(docsDir, "compiler", "executables.mdx"),
        join(docsDir, "compiler", "aot.mdx"),
      ],
      join(docsDir, "snippets", "cli", "build.mdx"),
    ),
    ...renderCliSection(
      "`bun install` / `add` / `remove` / `update` / `pm` / `bunx`",
      [
        join(docsDir, "pm", "cli", "install.mdx"),
        join(docsDir, "pm", "cli", "add.mdx"),
        join(docsDir, "pm", "cli", "remove.mdx"),
        join(docsDir, "pm", "cli", "update.mdx"),
        join(docsDir, "pm", "workspaces.mdx"),
        join(docsDir, "pm", "catalogs.mdx"),
        join(docsDir, "pm", "lockfile.mdx"),
        join(docsDir, "pm", "isolated-installs.mdx"),
        join(docsDir, "pm", "cli", "pm.mdx"),
        join(docsDir, "pm", "bunx.mdx"),
      ],
      join(docsDir, "snippets", "cli", "install.mdx"),
    ),
    ...renderCliSection(
      "`bun check` (Native TypeScript 7 Type Checker)",
      [
        join(docsDir, "runtime", "check.mdx"),
        join(docsDir, "typescript.mdx"),
        join(docsDir, "typescript-6.mdx"),
      ],
    ),
    ...renderCliSection(
      "`bun lint` (Native Linter)",
      [
        join(docsDir, "lint", "index.mdx"),
        join(docsDir, "lint", "plugins.mdx"),
        join(docsDir, "guides", "lint", "migrate-from-eslint.mdx"),
        join(docsDir, "guides", "lint", "migrate-from-oxlint.mdx"),
      ],
      join(docsDir, "snippets", "cli", "lint.mdx"),
    ),
  ];

  if (lintRuleCounts.size > 0) {
    lines.push("### Built-in Lint Rule Categories (`docs/lint/rules/`)", "", "| Plugin / Group | Rule Docs |", "| :--- | ---: |");
    for (const [grp, cnt] of [...lintRuleCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      lines.push(`| \`${grp}\` | ${cnt} |`);
    }
    lines.push("");
  }

  lines.push(
    ...renderCliSection(
      "`bun fmt` (Native Formatter)",
      [
        join(docsDir, "format", "index.mdx"),
        join(docsDir, "guides", "format", "migrate-from-prettier.mdx"),
        join(docsDir, "guides", "format", "migrate-from-oxfmt.mdx"),
      ],
      join(docsDir, "snippets", "cli", "format.mdx"),
    ),
    ...renderCliSection(
      "`bun migrate` & `bun pm migrate`",
      [join(docsDir, "pm", "cli", "migrate.mdx")],
    ),
  );

  lines.push(
    "- **Important CLI nuance**: `bun pm migrate` (available in all Bun 1.4+ builds) migrates `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` into `bun.lock`. Full source/script migration (`bun migrate` backed by `src/migrate` / `bun_migrate`) requires a build including `migrate_command.rs`; otherwise use `plugins/bun/skills/bun-legacy-replace/scripts/legacy-scan.ts` or the `bun_legacy_scan` / `bun_migrate_plan` MCP tools.",
    "",
  );

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function buildGuidesSkillsDigestMd(
  docsDir: string,
  skillsDir: string,
): { content: string; skillCount: number } {
  const lines: string[] = [
    "# Bun Guides & Dev Skills Digest",
    "",
    "Compacted from `docs/guides/**/*.mdx` and upstream repo dev skills.",
    "",
    "## Mintlify Guides (`docs/guides/`)",
    "",
  ];

  const guidesDir = join(docsDir, "guides");
  if (existsSync(guidesDir)) {
    const categories = readdirSync(guidesDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b));
    for (const cat of categories) {
      const catDir = join(guidesDir, cat);
      const files = listFilesSorted(catDir, ".mdx");
      if (files.length === 0) continue;
      lines.push(`### ${cat} (${files.length})`);
      for (const f of files) {
        const s = summarizeMdxPage(join(catDir, f));
        const desc = s.description || s.keyLines[0] || "";
        const snippet = s.codeSnippets[0]
          ? ` — \`${s.codeSnippets[0].split("\n")[0]!.slice(0, 90)}\``
          : "";
        lines.push(`- **${cat}/${basename(f, ".mdx")}** (${s.title})${desc ? `: ${desc.slice(0, 140)}` : ""}${snippet}`);
      }
      lines.push("");
    }
  }

  lines.push("## Upstream Bun Dev Skills", "");
  let skillCount = 0;
  if (existsSync(skillsDir)) {
    const entries = readdirSync(skillsDir, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    for (const entry of entries) {
      const skillFile = entry.isDirectory()
        ? join(skillsDir, entry.name, "SKILL.md")
        : entry.name.endsWith(".md")
          ? join(skillsDir, entry.name)
          : null;
      if (!skillFile || !existsSync(skillFile)) continue;
      skillCount++;
      const raw = readFileSync(skillFile, "utf8");
      const fm = parseFrontmatter(raw);
      const name = entry.isDirectory() ? entry.name : basename(entry.name, ".md");
      const headings: string[] = [];
      const cmds: string[] = [];
      const bullets: string[] = [];
      let inCode = false;
      for (const line of fm.body.split("\n")) {
        if (line.startsWith("```")) {
          inCode = !inCode;
          continue;
        }
        if (inCode) {
          if (cmds.length < 4 && line.trim() && !line.trim().startsWith("#")) {
            cmds.push(line.trim().slice(0, 110));
          }
          continue;
        }
        const h = line.match(/^#{2,3}\s+(.+)$/);
        if (h) headings.push(h[1]!.replace(/`/g, "").trim());
        else if (/^[-*]\s+/.test(line) && bullets.length < 5) {
          bullets.push(line.trim().replace(/\s+/g, " ").slice(0, 160));
        }
      }
      lines.push(`### \`${name}\``);
      if (fm.description) lines.push(`- Purpose: ${fm.description}`);
      if (headings.length > 0) lines.push(`- Sections: ${headings.slice(0, 8).join(" · ")}`);
      for (const b of bullets) lines.push(b);
      if (cmds.length > 0) lines.push(`- Key commands: ${cmds.map((c) => `\`${c}\``).join("; ")}`);
      lines.push("");
    }
  }

  return {
    content: lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n",
    skillCount,
  };
}

function buildLegacyReplacementMd(
  srcRoot: string,
  bunApiNames: Set<string>,
): { content: string; ruleCount: number } {
  const regDir = join(srcRoot, "src", "migrate", "registry");
  const scriptsToml = existsSync(join(regDir, "scripts.toml"))
    ? parseMigrateToml(readFileSync(join(regDir, "scripts.toml"), "utf8"))
    : {};
  const filesToml = existsSync(join(regDir, "files.toml"))
    ? parseMigrateToml(readFileSync(join(regDir, "files.toml"), "utf8"))
    : {};
  const apisToml = existsSync(join(regDir, "apis.toml"))
    ? parseMigrateToml(readFileSync(join(regDir, "apis.toml"), "utf8"))
    : {};
  const jsonToml = existsSync(join(regDir, "json.toml"))
    ? parseMigrateToml(readFileSync(join(regDir, "json.toml"), "utf8"))
    : {};
  const packagesToml = existsSync(join(regDir, "packages.toml"))
    ? parseMigrateToml(readFileSync(join(regDir, "packages.toml"), "utf8"))
    : {};
  const rustToml = existsSync(join(regDir, "rust.toml"))
    ? parseMigrateToml(readFileSync(join(regDir, "rust.toml"), "utf8"))
    : {};
  const replaceRsPath = join(srcRoot, "src", "migrate", "replace_packages.rs");
  const replaceSpecs = existsSync(replaceRsPath)
    ? parseReplacePackageSpecs(readFileSync(replaceRsPath, "utf8"))
    : [];

  const textRules = [
    ...(scriptsToml.text ?? []),
    ...(filesToml.text ?? []),
    ...(apisToml.text ?? []),
  ];
  const jsonRules = jsonToml.json ?? [];
  const pkgRules = packagesToml.packages ?? [];
  const rustCrates = rustToml.crate ?? [];
  const rustAddons = rustToml.addon ?? [];
  const rustHot = rustToml.hot ?? [];
  const rustTools = rustToml.tool ?? [];

  const ruleCount =
    textRules.length +
    jsonRules.length +
    pkgRules.length +
    replaceSpecs.length +
    rustHot.length +
    rustTools.length +
    2; // built-in scan.rs rules: imports/node-prefix, manifest/package-manager

  const verifyBunSymbol = (text: string): string => {
    const matches = [...text.matchAll(/\bBun\.([A-Za-z0-9_$]+)/g)].map((m) => m[1]!);
    if (matches.length === 0) return "built-in";
    const verified = [...new Set(matches)].map((sym) =>
      bunApiNames.has(sym) ? `\`Bun.${sym}\` (in bun-types)` : `\`Bun.${sym}\``,
    );
    return verified.join(", ");
  };

  const lines: string[] = [
    "# Legacy JS/TS/Node -> Bun Replacement Matrix",
    "",
    "Generated from `src/migrate/registry/*.toml`, `src/migrate/replace_packages.rs`, `src/migrate/scan.rs`, and verified against `packages/bun-types`.",
    "",
    "## 1. Auto-Rewritable npm Packages (`--replace-packages` in `replace_packages.rs`)",
    "",
    "| Rule ID | npm Packages | Bun Replacement | Notes |",
    "| :--- | :--- | :--- | :--- |",
  ];

  for (const s of replaceSpecs) {
    const note = s.id === "replace/del" ? "Manual rewrite required (globs)" : "AST/call-safe full file rewrite + package.json cleanup";
    lines.push(`| \`${s.id}\` | ${s.packages.map((p) => `\`${p}\``).join(", ")} | \`${s.to}\` | ${note} |`);
  }

  lines.push(
    "",
    "## 2. Package Replacements (`packages.toml` + `bun-types` Verification)",
    "",
    "| Rule ID | Legacy npm Packages | Bun Replacement | `bun-types` Check |",
    "| :--- | :--- | :--- | :--- |",
  );
  for (const r of pkgRules) {
    const pkgs = Array.isArray(r.packages) ? r.packages.map((p) => `\`${p}\``).join(", ") : "";
    const repl = String(r.replacement ?? "").replace(/\|/g, "\\|");
    lines.push(`| \`${r.id}\` | ${pkgs} | ${repl} | ${verifyBunSymbol(repl)} |`);
  }

  lines.push(
    "",
    "## 3. Source API & Global Rewrites (`apis.toml`, `files.toml`, `scan.rs`)",
    "",
    "| Rule ID | Pattern | Replacement | Mode | Message |",
    "| :--- | :--- | :--- | :--- | :--- |",
    "| `imports/node-prefix` | Bare Node core module (`fs`, `path`, ...) | `node:<mod>` | safe autofix | Node.js core modules are imported with the `node:` prefix |",
    "| `manifest/package-manager` | `packageManager` field in `package.json` | remove field | aggressive autofix | `packageManager` selects another package manager through Corepack |",
  );
  for (const r of [...(apisToml.text ?? []), ...(filesToml.text ?? []).filter((x) => String(x.id).startsWith("globals/") || String(x.id).startsWith("shebang/"))]) {
    const mode = r.autofix ? (r.aggressive ? "aggressive autofix" : "safe autofix") : "advisory";
    const repl = r.replace !== undefined ? `\`${String(r.replace).replace(/\|/g, "\\|")}\`` : "_manual_";
    const pat = String(r.pattern ?? "").replace(/\|/g, "\\|").slice(0, 80);
    const msg = String(r.message ?? "").replace(/\|/g, "\\|");
    lines.push(`| \`${r.id}\` | \`${pat}\` | ${repl} | ${mode} | ${msg} |`);
  }

  lines.push(
    "",
    "## 4. CLI, Scripts, Docker, CI, & JSON Rewrites (`scripts.toml`, `files.toml`, `json.toml`)",
    "",
    "| Rule ID | Scope / Files | Replacement | Mode | Message |",
    "| :--- | :--- | :--- | :--- | :--- |",
  );
  for (const r of scriptsToml.text ?? []) {
    const kinds = Array.isArray(r.kinds) ? r.kinds.join(",") : "*";
    const mode = r.autofix ? (r.aggressive ? "aggressive autofix" : "safe autofix") : "advisory";
    const repl = r.replace !== undefined ? `\`${String(r.replace).replace(/\|/g, "\\|")}\`` : "_manual_";
    const msg = String(r.message ?? "").replace(/\|/g, "\\|");
    lines.push(`| \`${r.id}\` | ${kinds} | ${repl} | ${mode} | ${msg} |`);
  }
  for (const r of (filesToml.text ?? []).filter((x) => !String(x.id).startsWith("globals/") && !String(x.id).startsWith("shebang/"))) {
    const kinds = Array.isArray(r.kinds) ? r.kinds.join(",") : "*";
    const mode = r.autofix ? (r.aggressive ? "aggressive autofix" : "safe autofix") : "advisory";
    const repl = r.replace !== undefined ? `\`${String(r.replace).replace(/\|/g, "\\|")}\`` : "_manual_";
    const msg = String(r.message ?? "").replace(/\|/g, "\\|");
    lines.push(`| \`${r.id}\` | ${kinds} | ${repl} | ${mode} | ${msg} |`);
  }
  for (const r of jsonRules) {
    const files = Array.isArray(r.files) ? r.files.join(",") : "*";
    const msg = String(r.message ?? "").replace(/\|/g, "\\|");
    lines.push(`| \`${r.id}\` | ${files} (\`${r.path}\`) | see message | advisory | ${msg} |`);
  }

  lines.push(
    "",
    "## 5. Rust Porting Target (`--target rust` from `rust.toml`)",
    "",
    "### Crates",
    "",
    "| Crate | Upstream Repo |",
    "| :--- | :--- |",
  );
  for (const c of rustCrates) lines.push(`| \`${c.name}\` | \`${c.repo}\` |`);

  lines.push("", "### Native Addon Loaders (`binding.gyp` / `node-gyp` -> Rust cdylib via `bun:ffi`)", "");
  for (const a of rustAddons) {
    const pkgs = Array.isArray(a.packages) ? a.packages.map((p) => `\`${p}\``).join(", ") : "";
    lines.push(`- ${pkgs}`);
  }

  lines.push("", "### CPU-Bound Hot Packages -> Rust Crates", "", "| Area | npm Packages | Rust Crate |", "| :--- | :--- | :--- |");
  for (const h of rustHot) {
    const pkgs = Array.isArray(h.packages) ? h.packages.map((p) => `\`${p}\``).join(", ") : "";
    lines.push(`| ${h.area} | ${pkgs} | \`${h.crate}\` |`);
  }

  lines.push("", "### JS CLI Tools -> Native Commands / Rust Tools", "", "| Tool | Target | Crate | Notes |", "| :--- | :--- | :--- | :--- |");
  for (const t of rustTools) {
    lines.push(`| \`${t.name}\` | \`${t.to}\` | ${t.crate ? `\`${t.crate}\`` : "(built into bun)"} | ${String(t.note ?? "").replace(/\|/g, "\\|")} |`);
  }

  return {
    content: lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n",
    ruleCount,
  };
}

function measureDirBytes(dir: string, exts: Set<string>): { count: number; bytes: number } {
  if (!existsSync(dir)) return { count: 0, bytes: 0 };
  let count = 0;
  let bytes = 0;
  const walk = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) {
        const dot = e.name.lastIndexOf(".");
        const ext = dot >= 0 ? e.name.slice(dot).toLowerCase() : "";
        if (exts.has(ext)) {
          count++;
          bytes += statSync(p).size;
        }
      }
    }
  };
  walk(dir);
  return { count, bytes };
}

export async function importBunBrain(opts: ImportOptions = {}): Promise<ImportSummary> {
  const outDir = resolve(opts.outDir ?? BRAIN_BUN_DIR);
  const srcRoot = discoverBunSrcRoot(opts.srcRoot);
  if (!srcRoot) {
    return {
      skipped: true,
      reason: "Bun source checkout not found; keeping existing brain/bun/ output intact.",
      outDir,
      sourceBytes: 0,
      outputBytes: 0,
      compressionRatio: 1,
      filesWritten: [],
      counts: { docsNavPages: 0, mdxTotal: 0, dtsFiles: 0, skills: 0, migrateRules: 0 },
    };
  }

  const docsDir = join(srcRoot, "docs");
  const typesDir = join(srcRoot, "packages", "bun-types");
  const skillsDir = join(srcRoot, ".claude", "skills");
  const regDir = join(srcRoot, "src", "migrate", "registry");

  let head = "bun-local";
  if (existsSync(join(srcRoot, ".git"))) {
    const gitRes = Bun.spawnSync(["git", "-C", srcRoot, "rev-parse", "--short=9", "HEAD"], {
      stdout: "pipe",
      stderr: "ignore",
      stdin: "ignore",
    });
    if (gitRes.exitCode === 0) head = gitRes.stdout.toString().trim() || head;
  }

  const docsStats = measureDirBytes(docsDir, new Set([".mdx", ".md", ".json"]));
  const typesStats = measureDirBytes(typesDir, new Set([".ts"]));
  const skillsStats = measureDirBytes(skillsDir, new Set([".md"]));
  const regStats = measureDirBytes(regDir, new Set([".toml"]));
  const sourceBytes = docsStats.bytes + typesStats.bytes + skillsStats.bytes + regStats.bytes;

  const tabs = parseDocsJson(docsDir);
  const navPages = new Set<string>();
  for (const t of tabs) {
    for (const p of t.pages) navPages.add(p);
    for (const g of t.groups) for (const p of g.pages) navPages.add(p);
  }

  const runtimeRes = buildRuntimeApisMd(typesDir, docsDir);
  const typesRes = buildTypesDigestMd(typesDir);
  const cliMd = buildCliToolingMd(docsDir);
  const guidesRes = buildGuidesSkillsDigestMd(docsDir, skillsDir);

  const bunApiNames = new Set<string>();
  for (const m of runtimeRes.content.matchAll(/^### `Bun\.([^`]+)`/gm)) {
    bunApiNames.add(m[1]!);
  }
  const legacyRes = buildLegacyReplacementMd(srcRoot, bunApiNames);

  const counts: ImportSummary["counts"] = {
    docsNavPages: navPages.size,
    mdxTotal: docsStats.count,
    dtsFiles: typesRes.dtsCount,
    skills: guidesRes.skillCount,
    migrateRules: legacyRes.ruleCount,
  };

  const indexMd = buildIndexMd(head, tabs, docsDir, sourceBytes, counts);

  const outputs: Record<string, string> = {
    "INDEX.md": indexMd,
    "RUNTIME_APIS.md": runtimeRes.content,
    "TYPES_DIGEST.md": typesRes.content,
    "CLI_TOOLING.md": cliMd,
    "GUIDES_SKILLS_DIGEST.md": guidesRes.content,
    "LEGACY_REPLACEMENT.md": legacyRes.content,
  };

  let outputBytes = 0;
  const filesWritten: string[] = [];
  const shouldWrite = opts.write ?? true;
  if (shouldWrite) mkdirSync(outDir, { recursive: true });
  for (const [name, content] of Object.entries(outputs)) {
    outputBytes += Buffer.byteLength(content, "utf8");
    if (shouldWrite) {
      if (writeIfChanged(join(outDir, name), content)) {
        filesWritten.push(name);
      }
    }
  }

  return {
    skipped: false,
    srcRoot,
    outDir,
    head,
    sourceBytes,
    outputBytes,
    compressionRatio: sourceBytes > 0 ? outputBytes / sourceBytes : 0,
    filesWritten,
    counts,
  };
}

if (import.meta.main) {
  let explicitSrc: string | undefined;
  let explicitOut: string | undefined;
  for (let i = 2; i < Bun.argv.length; i++) {
    if (Bun.argv[i] === "--src" && Bun.argv[i + 1]) explicitSrc = Bun.argv[++i];
    else if (Bun.argv[i] === "--out" && Bun.argv[i + 1]) explicitOut = Bun.argv[++i];
  }
  const summary = await importBunBrain({ srcRoot: explicitSrc, outDir: explicitOut });
  console.log(JSON.stringify(summary, null, 2));
}
