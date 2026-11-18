#!/usr/bin/env bun
// Extracts Next.js types, configuration schemas, bundled docs (`dist/docs/` or `docs/`),
// and upstream metadata (`vercel/next.js`, `vercel/next-devtools-mcp`, `vercel-labs/next-skills`)
// into compacted, FTS5-indexable Markdown digests in ~/.gemini/brain/nextjs/.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { discoverWorkspaces, GEMINI_ROOT, toSlash, userEnv, writeIfChanged } from "./lib.ts";

export const BRAIN_NEXTJS_DIR = join(GEMINI_ROOT, "brain", "nextjs");

export interface DocFrontmatter {
  title?: string;
  navTitle?: string;
  description?: string;
  version?: string;
  body: string;
}

export interface DocPageSummary {
  relPath: string;
  section: string;
  title: string;
  description: string;
  version?: string;
  headings: string[];
  keyPoints: string[];
  snippet?: string;
  versionHistory: string[];
}

export interface ConfigField {
  name: string;
  optional: boolean;
  type: string;
  summary: string;
  defaultVal?: string;
  deprecated?: string;
}

export interface ExportSymbol {
  entrypoint: string;
  kind: string;
  name: string;
  signature: string;
  summary: string;
  sourceFile: string;
}

export interface NextUpstreamMetadata {
  fetchedAt: string;
  nextLatest?: string;
  nextCanary?: string;
  nextjsCanarySha?: string;
  nextjsCanaryDate?: string;
  devtoolsMcpVersion?: string;
  devtoolsMcpSha?: string;
  devtoolsMcpDate?: string;
  nextSkillsSha?: string;
  nextSkillsDate?: string;
  officialSkills: string[];
  devtoolsTools: string[];
  runtimeMcpTools: string[];
}

export interface NextjsImportOptions {
  srcRoot?: string;
  outDir?: string;
  write?: boolean;
  live?: boolean;
  upstreamMeta?: NextUpstreamMetadata;
}

export interface NextjsImportSummary {
  skipped: boolean;
  reason?: string;
  srcRoot?: string;
  outDir: string;
  version?: string;
  sourceBytes: number;
  outputBytes: number;
  compressionRatio: number;
  filesWritten: string[];
  counts: {
    docsTotal: number;
    appDocs: number;
    pagesDocs: number;
    archDocs: number;
    dtsEntrypoints: number;
    dtsResolvedFiles: number;
    exportedSymbols: number;
    topConfigFields: number;
    experimentalFields: number;
    imageFields: number;
  };
}

function isValidNextPackageDir(dir: string): boolean {
  const pkgPath = join(dir, "package.json");
  if (!existsSync(pkgPath)) return false;
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { name?: string };
    if (pkg.name && pkg.name !== "next") return false;
  } catch {
    return false;
  }
  return existsSync(join(dir, "dist", "docs")) || existsSync(join(dir, "docs"));
}

function resolveCandidateNextDir(raw: string): string | null {
  const abs = toSlash(resolve(raw));
  if (isValidNextPackageDir(abs)) return abs;
  const subCandidates = [
    join(abs, "node_modules", "next"),
    join(abs, "packages", "next"),
  ];
  for (const sub of subCandidates) {
    const norm = toSlash(resolve(sub));
    if (isValidNextPackageDir(norm)) return norm;
  }
  return null;
}

export function discoverNextRoot(explicit?: string): string | null {
  if (explicit !== undefined) {
    return resolveCandidateNextDir(explicit);
  }
  const envCandidates = [
    process.env.NEXTJS_ROOT,
    userEnv("NEXTJS_ROOT"),
    process.env.NEXT_SRC_ROOT,
    userEnv("NEXT_SRC_ROOT"),
    process.cwd(),
  ].filter((v): v is string => Boolean(v));

  for (const cand of envCandidates) {
    const found = resolveCandidateNextDir(cand);
    if (found) return found;
  }

  for (const ws of Object.keys(discoverWorkspaces())) {
    const direct = resolveCandidateNextDir(ws);
    if (direct) return direct;
    const appsDir = join(ws, "apps");
    if (existsSync(appsDir)) {
      try {
        for (const entry of readdirSync(appsDir, { withFileTypes: true })) {
          if (!entry.isDirectory()) continue;
          const found = resolveCandidateNextDir(join(appsDir, entry.name));
          if (found) return found;
        }
      } catch {
        // Ignore unreadable app directories.
      }
    }
  }
  return null;
}

export function parseMarkdownFrontmatter(raw: string): DocFrontmatter {
  const norm = raw.replace(/\r\n/g, "\n");
  if (!norm.startsWith("---\n")) {
    return { body: norm.trim() };
  }
  const end = norm.indexOf("\n---\n", 4);
  if (end === -1) return { body: norm.trim() };
  const fmText = norm.slice(4, end);
  const body = norm.slice(end + 5).trim();
  const out: DocFrontmatter = { body };
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
    else if (key === "nav_title") out.navTitle = val;
    else if (key === "description") out.description = val;
    else if (key === "version") out.version = val;
  }
  return out;
}

export function stripNextDocsMdx(body: string): string {
  return body
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<FixCardGrid>[\s\S]*?<\/FixCardGrid>/g, "")
    .replace(/<Image\b[^>]*\/>/g, "")
    .replace(/<\/?(?:AppOnly|PagesOnly|details|summary|span)[^>]*>/g, "")
    .replace(/\[([^\]]+)\]\((?:\/docs\/[^)]+|https?:\/\/nextjs\.org\/docs\/[^)]+|#[^)]+)\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function summarizeComment(commentBlock: string): { summary: string; defaultVal?: string; deprecated?: string } {
  const lines = commentBlock
    .trim()
    .replace(/^\/\*\*?/, "")
    .replace(/\*\/$/, "")
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*\*+\s?/, "").trim());

  let defaultVal: string | undefined;
  let deprecated: string | undefined;
  const textLines: string[] = [];
  let inExample = false;

  for (const l of lines) {
    if (!l) continue;
    if (l.startsWith("```")) {
      inExample = !inExample;
      continue;
    }
    if (inExample) continue;
    const defM = l.match(/^@default(?:Value)?\s+(.+)$/);
    if (defM) {
      defaultVal = defM[1]!.replace(/`/g, "").trim().slice(0, 60);
      continue;
    }
    const depM = l.match(/^@deprecated\s*(.*)$/);
    if (depM) {
      deprecated = depM[1]!.trim() || "deprecated";
      continue;
    }
    if (l.startsWith("@") || l.startsWith("|") || l.startsWith("- ")) continue;
    textLines.push(l);
  }

  const summary = textLines
    .join(" ")
    .replace(/\{@link\s+([^}\s]+)[^}]*\}/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 150);

  return { summary, defaultVal, deprecated };
}

function collapseLongUnions(code: string): string {
  const lines = code.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (/^\s*(?:export\s+)?type\s+[A-Za-z0-9_]+\s*=/.test(line) && !line.trimEnd().endsWith(";")) {
      const members: string[] = [];
      let j = i + 1;
      while (j < lines.length && /^\s*(?:\|\s*["'`][^"'`]+["'`]\s*;?)$/.test(lines[j]!)) {
        members.push(lines[j]!.trim());
        j++;
      }
      if (members.length > 8) {
        const head = members.slice(0, 4).map((m) => m.replace(/;$/, ""));
        out.push(`${line.trimEnd()} ${head.join(" ")} | ... (+${members.length - 4} literals);`);
        i = j;
        continue;
      }
    }
    out.push(line);
    i++;
  }
  return out.join("\n");
}

export function compressNextDts(content: string): string {
  const norm = content.replace(/\r\n/g, "\n");
  const withoutBlockComments = norm.replace(/\/\*[\s\S]*?\*\//g, "");
  const filtered = withoutBlockComments
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      if (!t) return false;
      if (t.startsWith("///")) return true;
      if (t.startsWith("//")) return false;
      return true;
    })
    .join("\n");
  return collapseLongUnions(filtered)
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/g, ""))
    .filter((l) => l.length > 0)
    .join("\n");
}

export function extractConfigInterfaceFields(
  dtsSource: string,
  targetName: string,
  defaultsMap: Record<string, string> = {},
): ConfigField[] {
  const norm = dtsSource.replace(/\r\n/g, "\n");
  const lines = norm.split("\n");
  const startRe = new RegExp(`^export\\s+(?:interface|type)\\s+${targetName}\\b(?:\\s*=)?\\s*\\{`);
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (startRe.test(lines[i]!.trim())) {
      startIdx = i;
      break;
    }
  }
  if (startIdx === -1) return [];

  const fields: ConfigField[] = [];
  let depth = 0;
  let inComment = false;
  let commentBuf: string[] = [];
  let lastMeta: { summary: string; defaultVal?: string; deprecated?: string } = { summary: "" };

  for (let i = startIdx; i < lines.length; i++) {
    const rawLine = lines[i]!;
    const trimmed = rawLine.trim();

    if (i === startIdx) {
      depth = (rawLine.match(/\{/g)?.length ?? 0) - (rawLine.match(/\}/g)?.length ?? 0);
      continue;
    }

    if (inComment) {
      commentBuf.push(rawLine);
      if (trimmed.includes("*/")) {
        inComment = false;
        lastMeta = summarizeComment(commentBuf.join("\n"));
        commentBuf = [];
      }
      continue;
    }

    if (depth === 1 && trimmed.startsWith("/**")) {
      if (trimmed.includes("*/")) {
        lastMeta = summarizeComment(rawLine);
      } else {
        inComment = true;
        commentBuf = [rawLine];
      }
      continue;
    }

    if (depth === 1 && !trimmed.startsWith("//") && !trimmed.startsWith("/*")) {
      const fieldM = rawLine.match(/^\s{4}([A-Za-z0-9_]+)(\??):\s*(.*)$/);
      if (fieldM) {
        const name = fieldM[1]!;
        const optional = fieldM[2] === "?";
        const initialPart = (fieldM[3] ?? "").replace(/\/\*[\s\S]*?\*\//g, "").trim();
        let typeBuf = initialPart;
        let fieldDepth = (rawLine.match(/\{/g)?.length ?? 0) - (rawLine.match(/\}/g)?.length ?? 0);
        let parens = (rawLine.match(/\(/g)?.length ?? 0) - (rawLine.match(/\)/g)?.length ?? 0);
        let inFieldComment = false;
        let j = i;
        while ((fieldDepth > 0 || parens > 0 || !typeBuf.trimEnd().endsWith(";")) && j + 1 < lines.length && j - i < 160) {
          j++;
          const nextLine = lines[j]!;
          const nt = nextLine.trim();
          if (inFieldComment) {
            if (nt.includes("*/")) inFieldComment = false;
            continue;
          }
          if (nt.startsWith("/*")) {
            if (!nt.includes("*/")) inFieldComment = true;
            continue;
          }
          if (nt.startsWith("//") || nt.startsWith("*")) continue;
          const cleanPart = nt.replace(/\/\*[\s\S]*?\*\//g, "").trim();
          fieldDepth += (cleanPart.match(/\{/g)?.length ?? 0) - (cleanPart.match(/\}/g)?.length ?? 0);
          parens += (cleanPart.match(/\(/g)?.length ?? 0) - (cleanPart.match(/\)/g)?.length ?? 0);
          if (cleanPart && typeBuf.length < 220) {
            typeBuf += " " + cleanPart;
          }
          if (fieldDepth <= 0 && parens <= 0 && cleanPart.endsWith(";")) break;
        }
        const compactType = typeBuf
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\s+/g, " ")
          .replace(/;\s*$/, "")
          .trim()
          .slice(0, 140);

        fields.push({
          name,
          optional,
          type: compactType || "unknown",
          summary: lastMeta.summary,
          defaultVal: defaultsMap[name] ?? lastMeta.defaultVal,
          deprecated: lastMeta.deprecated,
        });
        lastMeta = { summary: "" };
        i = j;
        continue;
      }
    }

    depth += (rawLine.match(/\{/g)?.length ?? 0) - (rawLine.match(/\}/g)?.length ?? 0);
    if (depth <= 0) break;
  }

  return fields;
}

export function extractDefaultConfigMap(dtsSource: string): {
  top: Record<string, string>;
  experimental: Record<string, string>;
  cacheLife: Record<string, Record<string, string>>;
} {
  const norm = dtsSource.replace(/\r\n/g, "\n");
  const lines = norm.split("\n");
  const top: Record<string, string> = {};
  const experimental: Record<string, string> = {};
  const cacheLife: Record<string, Record<string, string>> = {};

  const startIdx = lines.findIndex((l) => /^export\s+declare\s+const\s+defaultConfig:\s*Readonly<\{/.test(l.trim()));
  if (startIdx === -1) return { top, experimental, cacheLife };

  let depth = 0;
  let section: "" | "experimental" | "cacheLife" = "";
  let currentProfile = "";

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i]!;
    const trimmed = line.trim();
    if (i === startIdx) {
      depth = (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0);
      continue;
    }

    if (depth === 1) {
      if (trimmed.startsWith("experimental:")) {
        section = "experimental";
      } else if (trimmed.startsWith("cacheLife:")) {
        section = "cacheLife";
      } else {
        section = "";
        const m = trimmed.match(/^([A-Za-z0-9_]+):\s*(.+?);$/);
        if (m && !m[2]!.startsWith("{")) {
          top[m[1]!] = m[2]!.replace(/\s+/g, " ").slice(0, 60);
        } else if (trimmed.endsWith("{")) {
          const km = trimmed.match(/^([A-Za-z0-9_]+):/);
          if (km) top[km[1]!] = "{ ... }";
        }
      }
    } else if (depth === 2 && section === "experimental") {
      const m = trimmed.match(/^([A-Za-z0-9_]+):\s*(.+?);$/);
      if (m && !m[2]!.startsWith("{")) {
        experimental[m[1]!] = m[2]!.replace(/\s+/g, " ").slice(0, 60);
      } else if (trimmed.endsWith("{")) {
        const km = trimmed.match(/^([A-Za-z0-9_]+):/);
        if (km) experimental[km[1]!] = "{ ... }";
      }
    } else if (depth === 2 && section === "cacheLife") {
      const pm = trimmed.match(/^([A-Za-z0-9_]+):\s*\{$/);
      if (pm) {
        currentProfile = pm[1]!;
        cacheLife[currentProfile] = {};
      }
    } else if (depth === 3 && section === "cacheLife" && currentProfile) {
      const vm = trimmed.match(/^([A-Za-z0-9_]+):\s*(.+?);$/);
      if (vm) cacheLife[currentProfile]![vm[1]!] = vm[2]!;
    }

    depth += (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0);
    if (depth <= 0) break;
  }

  return { top, experimental, cacheLife };
}

function isBlockStartLine(line: string): boolean {
  const t = line.trim();
  return (
    t.startsWith("/**") ||
    t.startsWith("/*") ||
    t.startsWith("//") ||
    t === "}" ||
    /^(?:export|declare|import|type|interface|function|const|let|var|class|namespace)\b/.test(t)
  );
}

function readBalancedDeclSignature(lines: string[], startIdx: number): string {
  const first = lines[startIdx]!.trim();
  if (/^(?:export\s+)?(?:declare\s+)?(?:interface|class|namespace)\b/.test(first)) {
    return first.replace(/\s*\{[\s\S]*$/, "").replace(/\s+/g, " ");
  }
  if (first.endsWith(";")) return first.replace(/\s+/g, " ").slice(0, 220);
  let buf = first;
  let parens = (first.match(/\(/g)?.length ?? 0) - (first.match(/\)/g)?.length ?? 0);
  let braces = (first.match(/\{/g)?.length ?? 0) - (first.match(/\}/g)?.length ?? 0);
  let inBlock = false;
  for (let i = startIdx + 1; i < Math.min(lines.length, startIdx + 18); i++) {
    const raw = lines[i]!.trim();
    if (!raw) {
      if (parens <= 0 && braces <= 0) break;
      continue;
    }
    if (inBlock) {
      if (raw.includes("*/")) inBlock = false;
      continue;
    }
    if (raw.startsWith("/*")) {
      if (parens <= 0 && braces <= 0) break;
      if (!raw.includes("*/")) inBlock = true;
      continue;
    }
    if (raw.startsWith("//") || raw.startsWith("*")) continue;
    if (parens <= 0 && braces <= 0 && isBlockStartLine(raw)) break;
    const t = raw.replace(/\/\*[\s\S]*?\*\//g, "").trim();
    if (!t) continue;
    buf += " " + t;
    parens += (t.match(/\(/g)?.length ?? 0) - (t.match(/\)/g)?.length ?? 0);
    braces += (t.match(/\{/g)?.length ?? 0) - (t.match(/\}/g)?.length ?? 0);
    if (t.endsWith(";") && parens <= 0 && braces <= 0) break;
    if (buf.length > 210) break;
  }
  return buf.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*\{\s*$/, "").slice(0, 220);
}

export function extractSymbolsFromDts(
  content: string,
  entrypoint: string,
  sourceFile: string,
): ExportSymbol[] {
  const norm = content.replace(/\r\n/g, "\n");
  const lines = norm.split("\n");
  const out: ExportSymbol[] = [];
  let inComment = false;
  let commentBuf: string[] = [];
  let lastSummary = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const trimmed = line.trim();

    if (inComment) {
      commentBuf.push(line);
      if (trimmed.includes("*/")) {
        inComment = false;
        lastSummary = summarizeComment(commentBuf.join("\n")).summary;
        commentBuf = [];
      }
      continue;
    }
    if (trimmed.startsWith("/*")) {
      if (trimmed.includes("*/")) {
        lastSummary = summarizeComment(line).summary;
      } else {
        inComment = true;
        commentBuf = [line];
      }
      continue;
    }

    const declM = line.match(
      /^(?:export\s+)?(?:declare\s+)?(function|const|class|interface|type|namespace)\s+([$A-Za-z0-9_]+)/,
    );
    if (declM) {
      const kind = declM[1]!;
      const name = declM[2]!;
      if (!name.startsWith("__") && name !== "default") {
        out.push({
          entrypoint,
          kind,
          name,
          signature: readBalancedDeclSignature(lines, i),
          summary: lastSummary,
          sourceFile,
        });
      }
      lastSummary = "";
      continue;
    }

    const reExportM = line.match(/^export\s+(?:type\s+)?\{([^}]+)\}(?:\s+from\s+['"][^'"]+['"])?/);
    if (reExportM) {
      const names = reExportM[1]!
        .split(",")
        .map((s) => s.trim().split(/\s+as\s+/).pop()?.trim())
        .filter((s): s is string => Boolean(s && /^[A-Za-z0-9_$]+$/.test(s)));
      for (const name of names) {
        out.push({
          entrypoint,
          kind: "export",
          name,
          signature: `export { ${name} } (${entrypoint})`,
          summary: lastSummary,
          sourceFile,
        });
      }
      lastSummary = "";
      continue;
    }

    const modM = line.match(/^declare\s+module\s+['"]([^'"]+)['"]/);
    if (modM) {
      out.push({
        entrypoint,
        kind: "module",
        name: modM[1]!,
        signature: `declare module '${modM[1]!}'`,
        summary: lastSummary,
        sourceFile,
      });
      lastSummary = "";
      continue;
    }

    if (trimmed && !trimmed.startsWith("//") && !trimmed.startsWith("///")) {
      lastSummary = "";
    }
  }
  return out;
}

function resolveDtsTarget(nextRoot: string, fromFile: string, spec: string): string | null {
  let baseDir = dirname(fromFile);
  let target = spec;
  if (spec.startsWith("next/")) {
    baseDir = nextRoot;
    target = spec.slice("next/".length);
  } else if (!spec.startsWith(".")) {
    return null;
  }
  const cand = resolve(baseDir, target);
  const attempts = [cand, `${cand}.d.ts`, join(cand, "index.d.ts")];
  for (const a of attempts) {
    if (existsSync(a) && statSync(a).isFile()) return toSlash(a);
  }
  return null;
}

function collectPublicDtsFiles(nextRoot: string): {
  entrypointFiles: Array<{ entrypoint: string; relPath: string; absPath: string }>;
  resolvedFiles: Array<{ entrypoint: string; relPath: string; absPath: string }>;
} {
  const staticEntrypoints: Array<[string, string]> = [
    ["next", "index.d.ts"],
    ["next/types", "types.d.ts"],
    ["next/cache", "cache.d.ts"],
    ["next/server", "server.d.ts"],
    ["next/navigation", "navigation.d.ts"],
    ["next/headers", "headers.d.ts"],
    ["next/image", "image.d.ts"],
    ["next/link", "link.d.ts"],
    ["next/form", "form.d.ts"],
    ["next/og", "og.d.ts"],
    ["next/error", "error.d.ts"],
    ["next/offline", "offline.d.ts"],
    ["next/script", "script.d.ts"],
    ["next/dynamic", "dynamic.d.ts"],
    ["next/constants", "constants.d.ts"],
    ["next/root-params", "root-params.d.ts"],
    ["next/web-vitals", "web-vitals.d.ts"],
    ["next/font", "font/index.d.ts"],
    ["next/font/google", "font/google/index.d.ts"],
    ["next/font/local", "font/local/index.d.ts"],
    ["next/types/global", "types/global.d.ts"],
    ["next/types/compiled", "types/compiled.d.ts"],
    ["next/image-types/global", "image-types/global.d.ts"],
    ["next/experimental/testing/server", "experimental/testing/server.d.ts"],
    ["next/dist/build/segment-config/app/app-segment-config", "dist/build/segment-config/app/app-segment-config.d.ts"],
    ["next/dist/build/segment-config/middleware/middleware-config", "dist/build/segment-config/middleware/middleware-config.d.ts"],
    ["next/dist/lib/metadata/types/metadata-interface", "dist/lib/metadata/types/metadata-interface.d.ts"],
    ["next/dist/shared/lib/image-config", "dist/shared/lib/image-config.d.ts"],
    ["next/dist/lib/load-custom-routes", "dist/lib/load-custom-routes.d.ts"],
  ];

  const entrypointFiles: Array<{ entrypoint: string; relPath: string; absPath: string }> = [];
  const resolvedFiles: Array<{ entrypoint: string; relPath: string; absPath: string }> = [];
  const seenResolved = new Set<string>();

  for (const [ep, rel] of staticEntrypoints) {
    const abs = toSlash(join(nextRoot, rel));
    if (!existsSync(abs)) continue;
    entrypointFiles.push({ entrypoint: ep, relPath: rel, absPath: abs });
    if (!seenResolved.has(abs)) {
      seenResolved.add(abs);
      resolvedFiles.push({ entrypoint: ep, relPath: rel, absPath: abs });
    }
    const raw = readFileSync(abs, "utf8");
    for (const m of raw.matchAll(/(?:from|import)\s+['"]([^'"]+)['"]/g)) {
      const target = resolveDtsTarget(nextRoot, abs, m[1]!);
      if (target && !seenResolved.has(target)) {
        seenResolved.add(target);
        resolvedFiles.push({
          entrypoint: ep,
          relPath: toSlash(relative(nextRoot, target)),
          absPath: target,
        });
      }
    }
  }

  return { entrypointFiles, resolvedFiles };
}

function walkDocs(docsDir: string): string[] {
  if (!existsSync(docsDir)) return [];
  const out: string[] = [];
  const walk = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && /\.(md|mdx)$/i.test(e.name)) out.push(p);
    }
  };
  walk(docsDir);
  return out.sort((a, b) => a.localeCompare(b));
}

export function summarizeDocPage(filePath: string, docsDir: string): DocPageSummary {
  const relPath = toSlash(relative(docsDir, filePath));
  const raw = readFileSync(filePath, "utf8");
  const fm = parseMarkdownFrontmatter(raw);
  const cleaned = stripNextDocsMdx(fm.body);
  const lines = cleaned.split("\n");

  const headings: string[] = [];
  const keyPoints: string[] = [];
  const versionHistory: string[] = [];
  let snippet: string | undefined;
  let inCode = false;
  let codeLang = "";
  let codeBuf: string[] = [];
  let inVersionHistory = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim().split(/\s+/)[0] ?? "";
        codeBuf = [];
      } else {
        inCode = false;
        const candidate = codeBuf.join("\n").trim();
        if (
          !snippet &&
          candidate &&
          candidate.length <= 220 &&
          !/return\s*\}/.test(candidate) &&
          /^(ts|tsx|js|jsx|bash|sh|go|json)$/i.test(codeLang)
        ) {
          snippet = candidate;
        }
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }

    const hm = line.match(/^(#{2,3})\s+(.+)$/);
    if (hm) {
      const hText = hm[2]!.replace(/`/g, "").trim();
      if (/^Version History$/i.test(hText)) {
        inVersionHistory = true;
      } else {
        if (hm[1] === "##") inVersionHistory = false;
        if (!/^Examples?$/i.test(hText) && headings.length < 8) {
          headings.push(hText);
        }
      }
      continue;
    }

    if (inVersionHistory && line.startsWith("|")) {
      const cols = line
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      if (cols.length >= 2 && cols[0] !== "Version" && !cols[0]!.startsWith("---")) {
        versionHistory.push(`${cols[0]!.replace(/`/g, "")}: ${cols[1]!.slice(0, 120)}`);
      }
      continue;
    }

    const t = line.trim();
    if (
      t &&
      !t.startsWith("|") &&
      !t.startsWith("---") &&
      !t.startsWith("<") &&
      t.length > 20 &&
      keyPoints.length < 2
    ) {
      const cleanLine = t.replace(/^>\s*/, "").replace(/\s+/g, " ").slice(0, 180);
      keyPoints.push(cleanLine);
    }
  }

  const section = relPath.split("/")[0] ?? "root";
  return {
    relPath,
    section,
    title: fm.title ?? fm.navTitle ?? basename(relPath, ".md"),
    description: (fm.description ?? "").replace(/\s+/g, " ").trim(),
    version: fm.version,
    headings,
    keyPoints,
    snippet,
    versionHistory: versionHistory.slice(0, 4),
  };
}

function buildTypesDigestMd(
  nextRoot: string,
  version: string,
): { content: string; entrypointCount: number; resolvedCount: number; symbolCount: number } {
  const { entrypointFiles, resolvedFiles } = collectPublicDtsFiles(nextRoot);
  const allSymbols: ExportSymbol[] = [];

  for (const f of resolvedFiles) {
    const raw = readFileSync(f.absPath, "utf8");
    const syms = extractSymbolsFromDts(raw, f.entrypoint, f.relPath);
    allSymbols.push(...syms);
  }

  const deduped = new Map<string, ExportSymbol>();
  for (const s of allSymbols) {
    const key = `${s.entrypoint}:${s.name}:${s.signature}`;
    if (!deduped.has(key)) deduped.set(key, s);
  }

  const lines: string[] = [
    `# Next.js ${version} Public TypeScript Declarations Digest`,
    "",
    `Extracted from ${entrypointFiles.length} public \`next/*\` entrypoints and ${resolvedFiles.length} resolved declaration files.`,
    "",
    "## Public Entrypoints & Exported Symbols",
    "",
  ];

  const byEntrypoint = new Map<string, ExportSymbol[]>();
  for (const sym of deduped.values()) {
    const list = byEntrypoint.get(sym.entrypoint) ?? [];
    list.push(sym);
    byEntrypoint.set(sym.entrypoint, list);
  }

  for (const ep of [...byEntrypoint.keys()].sort((a, b) => a.localeCompare(b))) {
    const syms = byEntrypoint.get(ep)!;
    lines.push(`### \`${ep}\` (${syms.length} symbols)`);
    for (const s of syms.slice(0, 45)) {
      const note = s.summary ? ` — ${s.summary}` : "";
      lines.push(`- \`${s.signature}\` (\`${s.sourceFile}\`)${note}`);
    }
    if (syms.length > 45) {
      lines.push(`- _(+${syms.length - 45} more declarations in \`${ep}\`)_`);
    }
    lines.push("");
  }

  const coreDtsSnippets: string[] = [
    "index.d.ts",
    "cache.d.ts",
    "server.d.ts",
    "navigation.d.ts",
    "headers.d.ts",
    "error.d.ts",
    "offline.d.ts",
    "root-params.d.ts",
    "types/global.d.ts",
    "types/compiled.d.ts",
    "dist/server/request/cookies.d.ts",
    "dist/server/request/headers.d.ts",
    "dist/server/request/draft-mode.d.ts",
    "dist/server/request/io.d.ts",
    "dist/server/request/connection.d.ts",
    "dist/server/request/cache-stages.d.ts",
    "dist/server/web/spec-extension/revalidate.d.ts",
    "dist/server/web/types.d.ts",
    "dist/build/segment-config/app/app-segment-config.d.ts",
    "dist/build/segment-config/middleware/middleware-config.d.ts",
    "dist/lib/metadata/types/metadata-interface.d.ts",
  ];

  lines.push("## Compressed Core Declaration Files", "");
  for (const rel of coreDtsSnippets) {
    const abs = join(nextRoot, rel);
    if (!existsSync(abs)) continue;
    const raw = readFileSync(abs, "utf8");
    const compressed = compressNextDts(raw);
    const compressedLines = compressed.split("\n");
    const clipped = compressedLines.slice(0, 140);
    lines.push(`### \`${rel}\` (${raw.split(/\r?\n/).length} -> ${clipped.length} lines)`);
    lines.push("```ts");
    lines.push(...clipped);
    if (compressedLines.length > 140) {
      lines.push(`// ... (+${compressedLines.length - 140} lines in ${rel})`);
    }
    lines.push("```", "");
  }

  return {
    content: lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n",
    entrypointCount: entrypointFiles.length,
    resolvedCount: resolvedFiles.length,
    symbolCount: deduped.size,
  };
}

function formatConfigTable(fields: ConfigField[]): string[] {
  if (fields.length === 0) return ["_None extracted._"];
  const rows = [
    "| Option | Type | Default | Summary |",
    "| :--- | :--- | :--- | :--- |",
  ];
  for (const f of fields) {
    const name = `${f.name}${f.optional ? "?" : ""}`;
    const type = f.type.replace(/\|/g, "\\|");
    const def = f.defaultVal ? `\`${f.defaultVal.replace(/\|/g, "\\|").replace(/`/g, "'")}\`` : "-";
    const depPrefix = f.deprecated ? `[DEPRECATED: ${f.deprecated}] ` : "";
    const sum = `${depPrefix}${f.summary}`.replace(/\|/g, "\\|").trim() || "-";
    rows.push(`| \`${name}\` | \`${type}\` | ${def} | ${sum} |`);
  }
  return rows;
}

export function extractDefaultConfigFromJs(jsSource: string, startRegex: RegExp): Record<string, string> {
  const norm = jsSource.replace(/\r\n/g, "\n");
  const lines = norm.split("\n");
  const startIdx = lines.findIndex((l) => startRegex.test(l.trim()));
  if (startIdx === -1) return {};
  const out: Record<string, string> = {};
  let braceDepth = 0;
  let bracketDepth = 0;
  let keyName = "";
  let buf = "";

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i]!;
    const trimmed = line.trim();
    if (i === startIdx) {
      braceDepth = (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0);
      bracketDepth = (line.match(/\[/g)?.length ?? 0) - (line.match(/\]/g)?.length ?? 0);
      continue;
    }
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) continue;

    if (braceDepth === 1 && bracketDepth === 0 && !keyName) {
      const m = trimmed.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
      if (m) {
        keyName = m[1]!;
        buf = m[2]!.replace(/,\s*$/, "");
      }
    } else if (keyName) {
      buf += " " + trimmed.replace(/,\s*$/, "");
    }

    braceDepth += (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0);
    bracketDepth += (line.match(/\[/g)?.length ?? 0) - (line.match(/\]/g)?.length ?? 0);

    if (keyName && braceDepth === 1 && bracketDepth === 0) {
      out[keyName] = buf.replace(/\s+/g, " ").trim().slice(0, 70);
      keyName = "";
      buf = "";
    }
    if (braceDepth <= 0) break;
  }
  return out;
}

function buildConfigSchemaMd(
  nextRoot: string,
  version: string,
): { content: string; topCount: number; expCount: number; imgCount: number } {
  const configSharedPath = join(nextRoot, "dist", "server", "config-shared.d.ts");
  const configShared = existsSync(configSharedPath) ? readFileSync(configSharedPath, "utf8") : "";
  const configSharedJsPath = join(nextRoot, "dist", "server", "config-shared.js");
  const configSharedJs = existsSync(configSharedJsPath) ? readFileSync(configSharedJsPath, "utf8") : "";
  const imageConfigPath = join(nextRoot, "dist", "shared", "lib", "image-config.d.ts");
  const imageConfig = existsSync(imageConfigPath) ? readFileSync(imageConfigPath, "utf8") : "";
  const imageConfigJsPath = join(nextRoot, "dist", "shared", "lib", "image-config.js");
  const imageConfigJs = existsSync(imageConfigJsPath) ? readFileSync(imageConfigJsPath, "utf8") : "";
  const customRoutesPath = join(nextRoot, "dist", "lib", "load-custom-routes.d.ts");
  const customRoutes = existsSync(customRoutesPath) ? readFileSync(customRoutesPath, "utf8") : "";
  const appSegPath = join(nextRoot, "dist", "build", "segment-config", "app", "app-segment-config.d.ts");
  const appSeg = existsSync(appSegPath) ? readFileSync(appSegPath, "utf8") : "";
  const proxySegPath = join(nextRoot, "dist", "build", "segment-config", "middleware", "middleware-config.d.ts");
  const proxySeg = existsSync(proxySegPath) ? readFileSync(proxySegPath, "utf8") : "";

  const dtsDefaults = extractDefaultConfigMap(configShared);
  const jsTopDefaults = configSharedJs
    ? extractDefaultConfigFromJs(configSharedJs, /^const\s+defaultConfig\s*=\s*Object\.freeze\(\{/)
    : {};
  const jsExpDefaults = configSharedJs
    ? extractDefaultConfigFromJs(configSharedJs, /^experimental:\s*\{/)
    : {};
  const jsImgDefaults = imageConfigJs
    ? extractDefaultConfigFromJs(imageConfigJs, /^const\s+imageConfigDefault\s*=\s*\{/)
    : {};

  const mergedTop = { ...dtsDefaults.top, ...jsTopDefaults };
  const mergedExp = { ...dtsDefaults.experimental, ...jsExpDefaults };
  const defaults = dtsDefaults;
  const topFields = extractConfigInterfaceFields(configShared, "NextConfig", mergedTop);
  const expFields = extractConfigInterfaceFields(configShared, "ExperimentalConfig", mergedExp);
  const imgFields = extractConfigInterfaceFields(imageConfig, "ImageConfigComplete", jsImgDefaults);
  const segFields = extractConfigInterfaceFields(appSeg, "AppSegmentConfig");
  const proxyFields = extractConfigInterfaceFields(proxySeg, "MiddlewareConfigInput");

  const lines: string[] = [
    `# Next.js ${version} Configuration & Schema Reference`,
    "",
    "Extracted from `dist/server/config-shared.d.ts`, `dist/shared/lib/image-config.d.ts`, `dist/lib/load-custom-routes.d.ts`, and segment configs.",
    "",
    `## Top-Level \`NextConfig\` Options (${topFields.length})`,
    "",
    ...formatConfigTable(topFields),
    "",
    `## \`ExperimentalConfig\` Options (${expFields.length})`,
    "",
    ...formatConfigTable(expFields),
    "",
    `## \`ImageConfigComplete\` Options (${imgFields.length})`,
    "",
    "Next.js 16 breaking defaults: `minimumCacheTTL = 14400` (4h), `qualities = [75]` (unsupported `?q=` returns 400), `imageSizes` omits `16`, `maximumRedirects = 3`, query-string local images require `localPatterns.search`, local IPs blocked unless `dangerouslyAllowLocalIP: true`.",
    "",
    ...formatConfigTable(imgFields),
    "",
    "## Routing Execution Order & `rewrites` / `redirects` / `headers`",
    "",
    "1. `headers` (`next.config.ts`)",
    "2. `redirects` (`next.config.ts`)",
    "3. `proxy.ts` (`NextProxy` / `ProxyConfig`, Node.js runtime only)",
    "4. `rewrites.beforeFiles` (evaluated before `public/`, `_next/static/`, and page files — ideal for `has: [{ type: 'host', value: '...' }]` host rewrites)",
    "5. Filesystem routes (`public/`, `_next/static/`, static pages)",
    "6. `rewrites.afterFiles` (evaluated before dynamic routes)",
    "7. Dynamic routes (`/blog/[slug]`)",
    "8. `rewrites.fallback` (evaluated before 404)",
    "",
    "```ts",
    compressNextDts(customRoutes),
    "```",
    "",
    `## App Route Segment Config (\`AppSegmentConfig\`, ${segFields.length})`,
    "",
    "Note: `cacheComponents: true` rejects legacy segment exports `dynamic`, `revalidate`, `fetchCache`, and `runtime`.",
    "",
    ...formatConfigTable(segFields),
    "",
    `## Proxy Segment Config (\`ProxyConfig\`, ${proxyFields.length})`,
    "",
    ...formatConfigTable(proxyFields),
    "",
    "## Built-in `cacheLife` Profiles (`defaultConfig.cacheLife`)",
    "",
    "| Profile | `stale` | `revalidate` | `expire` |",
    "| :--- | :--- | :--- | :--- |",
  ];

  const profileDocsFallback: Record<string, { stale: string; revalidate: string; expire: string }> = {
    default: { stale: "300s (5m)", revalidate: "900s (15m)", expire: "never" },
    seconds: { stale: "30s", revalidate: "1s", expire: "60s" },
    minutes: { stale: "300s (5m)", revalidate: "60s (1m)", expire: "3600s (1h)" },
    hours: { stale: "300s (5m)", revalidate: "3600s (1h)", expire: "86400s (1d)" },
    days: { stale: "300s (5m)", revalidate: "86400s (1d)", expire: "604800s (1w)" },
    weeks: { stale: "300s (5m)", revalidate: "604800s (1w)", expire: "2592000s (30d)" },
    max: { stale: "300s (5m)", revalidate: "2592000s (30d)", expire: "31536000s / never" },
  };

  for (const name of Object.keys(profileDocsFallback)) {
    const parsed = defaults.cacheLife[name];
    const fb = profileDocsFallback[name]!;
    lines.push(
      `| \`${name}\` | \`${parsed?.stale ?? fb.stale}\` | \`${parsed?.revalidate ?? fb.revalidate}\` | \`${parsed?.expire ?? fb.expire}\` |`,
    );
  }

  return {
    content: lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n",
    topCount: topFields.length,
    expCount: expFields.length,
    imgCount: imgFields.length,
  };
}

function buildDocsDigestMd(
  docsDir: string,
  version: string,
): {
  content: string;
  summaries: DocPageSummary[];
  appDocs: number;
  pagesDocs: number;
  archDocs: number;
} {
  const files = walkDocs(docsDir);
  const summaries = files.map((f) => summarizeDocPage(f, docsDir));
  const appDocs = summaries.filter((s) => s.relPath.startsWith("01-app/")).length;
  const pagesDocs = summaries.filter((s) => s.relPath.startsWith("02-pages/")).length;
  const archDocs = summaries.filter((s) => s.relPath.startsWith("03-architecture/") || s.relPath.startsWith("04-community/")).length;

  const lines: string[] = [
    `# Next.js ${version} Bundled Documentation Digest`,
    "",
    `Compacted from ${summaries.length} markdown files in \`node_modules/next/dist/docs/\` (${appDocs} App Router, ${pagesDocs} Pages Router, ${archDocs} Architecture/Community).`,
    "",
  ];

  const grouped = new Map<string, DocPageSummary[]>();
  for (const s of summaries) {
    const parts = s.relPath.split("/");
    const groupKey = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : parts[0]!;
    const list = grouped.get(groupKey) ?? [];
    list.push(s);
    grouped.set(groupKey, list);
  }

  for (const grp of [...grouped.keys()].sort((a, b) => a.localeCompare(b))) {
    const items = grouped.get(grp)!;
    lines.push(`## \`${grp}\` (${items.length} docs)`, "");
    for (const s of items) {
      const verBadge = s.version ? ` [${s.version}]` : "";
      lines.push(`### \`${s.relPath}\` — ${s.title}${verBadge}`);
      if (s.description) lines.push(`- ${s.description}`);
      if (s.headings.length > 0) lines.push(`- Sections: ${s.headings.join(" · ")}`);
      for (const kp of s.keyPoints) lines.push(`- ${kp}`);
      if (s.versionHistory.length > 0) {
        lines.push(`- History: ${s.versionHistory.join("; ")}`);
      }
      if (s.snippet) {
        lines.push(`- Example: \`${s.snippet.replace(/\s+/g, " ").slice(0, 160)}\``);
      }
      lines.push("");
    }
  }

  return {
    content: lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n",
    summaries,
    appDocs,
    pagesDocs,
    archDocs,
  };
}

export async function fetchLiveUpstreamMetadata(): Promise<NextUpstreamMetadata> {
  const ghJson = <T>(endpoint: string): T | null => {
    const res = Bun.spawnSync(["gh", "api", endpoint], { stdout: "pipe", stderr: "pipe", stdin: "ignore" });
    if (res.exitCode !== 0) return null;
    try {
      return JSON.parse(res.stdout.toString()) as T;
    } catch {
      return null;
    }
  };
  const npmTags = (pkg: string): Record<string, string> => {
    const res = Bun.spawnSync([process.execPath, "pm", "view", pkg, "dist-tags", "--json"], {
      stdout: "pipe",
      stderr: "pipe",
      stdin: "ignore",
    });
    if (res.exitCode !== 0) return {};
    try {
      return JSON.parse(res.stdout.toString()) as Record<string, string>;
    } catch {
      return {};
    }
  };

  const nextCanary = ghJson<{ sha?: string; commit?: { committer?: { date?: string } } }>("repos/vercel/next.js/commits/canary");
  const devtoolsHead = ghJson<{ sha?: string; commit?: { committer?: { date?: string } } }>("repos/vercel/next-devtools-mcp/commits/HEAD");
  const skillsHead = ghJson<{ sha?: string; commit?: { committer?: { date?: string } } }>("repos/vercel-labs/next-skills/commits/HEAD");
  const skillsDir = ghJson<Array<{ name?: string; type?: string }>>("repos/vercel/next.js/contents/skills?ref=canary");
  const nextDistTags = npmTags("next");
  const devtoolsTags = npmTags("next-devtools-mcp");

  return {
    fetchedAt: new Date().toISOString(),
    nextLatest: nextDistTags.latest,
    nextCanary: nextDistTags.canary,
    nextjsCanarySha: nextCanary?.sha,
    nextjsCanaryDate: nextCanary?.commit?.committer?.date,
    devtoolsMcpVersion: devtoolsTags.latest,
    devtoolsMcpSha: devtoolsHead?.sha,
    devtoolsMcpDate: devtoolsHead?.commit?.committer?.date,
    nextSkillsSha: skillsHead?.sha,
    nextSkillsDate: skillsHead?.commit?.committer?.date,
    officialSkills: (skillsDir ?? [])
      .filter((e) => e.type === "dir" && e.name && !e.name.startsWith("."))
      .map((e) => e.name!),
    devtoolsTools: ["nextjs_index", "nextjs_call", "nextjs_docs", "browser_eval"],
    runtimeMcpTools: [
      "get_errors",
      "get_logs",
      "get_page_metadata",
      "get_project_metadata",
      "get_routes",
      "get_server_action_by_id",
      "get_compilation_issues",
      "compile_route",
      "get_request_insights",
    ],
  };
}

function discoverRuntimeMcpTools(nextRoot: string): string[] {
  const toolsDir = join(nextRoot, "dist", "server", "mcp", "tools");
  if (!existsSync(toolsDir)) return [];
  const tools: string[] = [];
  for (const e of readdirSync(toolsDir, { withFileTypes: true })) {
    if (!e.isFile() || !e.name.endsWith(".d.ts")) continue;
    const stem = basename(e.name, ".d.ts");
    if (stem === "next-instance-error-state") continue;
    tools.push(stem.replace(/-/g, "_"));
  }
  return tools.sort();
}

function buildUpstreamApisMd(
  nextRoot: string,
  version: string,
  meta?: NextUpstreamMetadata,
): string {
  const runtimeTools = meta?.runtimeMcpTools?.length
    ? meta.runtimeMcpTools
    : discoverRuntimeMcpTools(nextRoot);
  const officialSkills = meta?.officialSkills?.length
    ? meta.officialSkills
    : [
        "next-bundle-optimizer",
        "next-cache-components-adoption",
        "next-cache-components-optimizer",
        "next-dev-loop",
        "next-partial-prefetching-adoption",
        "next-partial-prefetching-optimizer",
      ];
  const devtoolsTools = meta?.devtoolsTools?.length
    ? meta.devtoolsTools
    : ["nextjs_index", "nextjs_call", "nextjs_docs", "browser_eval"];

  const agentsPath = join(nextRoot, "AGENTS.md");
  const agentsRule = existsSync(agentsPath) ? readFileSync(agentsPath, "utf8").trim() : "";

  const lines: string[] = [
    `# Next.js ${version} Upstream Repositories, Skills & Breaking APIs`,
    "",
    "## Upstream Sources & Versions",
    "",
    "| Repository / Package | Version / Pin | License | Role |",
    "| :--- | :--- | :--- | :--- |",
    `| \`next\` (local installed) | \`${version}\` | MIT | Bundled types (\`*.d.ts\`) and 479+ docs (\`dist/docs/\`) |`,
    `| \`vercel/next.js\` (\`canary\`) | ${meta?.nextjsCanarySha ? `\`${meta.nextjsCanarySha.slice(0, 12)}\` (${meta.nextjsCanaryDate ?? ""})` : "canary"}${meta?.nextCanary ? ` / npm \`${meta.nextCanary}\`` : ""}${meta?.nextLatest ? ` / latest \`${meta.nextLatest}\`` : ""} | MIT | Core framework, \`skills/\`, \`packages/next\` |`,
    `| \`vercel/next-devtools-mcp\` | ${meta?.devtoolsMcpVersion ? `v${meta.devtoolsMcpVersion}` : "0.4.x"}${meta?.devtoolsMcpSha ? ` (\`${meta.devtoolsMcpSha.slice(0, 12)}\`)` : ""} | MIT | Thin stdio MCP connector to running \`/_next/mcp\` dev server |`,
    `| \`vercel-labs/next-skills\` | ${meta?.nextSkillsSha ? `\`${meta.nextSkillsSha.slice(0, 12)}\`` : "archived/moved"} | MIT | Moved to \`vercel/next.js/tree/canary/skills\`; reference docs moved into \`next/dist/docs/\` |`,
    "",
    "## `next-devtools-mcp` & Built-in `/_next/mcp` Endpoint",
    "",
    "- Connect on demand without adding always-on global MCP startup overhead: `bunx next-devtools-mcp@latest` (or project `.mcp.json`).",
    `- \`next-devtools-mcp\` stdio tools: ${devtoolsTools.map((t) => `\`${t}\``).join(", ")}.`,
    `- Built-in Next.js 16+ \`/_next/mcp\` runtime tools (${runtimeTools.length}): ${runtimeTools.map((t) => `\`${t}\``).join(", ")}.`,
    "- `get_compilation_issues` and `compile_route` require Turbopack; `get_request_insights` requires `experimental.requestInsights: true`.",
    "- `get_errors` and `get_page_metadata` require at least one active browser navigation.",
    "",
    "## Official Next.js Workflow Skills (`vercel/next.js/skills/`)",
    "",
    ...officialSkills.map((s) => `- \`${s}\``),
    "",
    "## Next.js 16.0 - 16.5 Breaking Changes & Canonical Replacements",
    "",
    "| Legacy Pattern (<= 15) | Next.js 16.5+ Canonical API | Notes |",
    "| :--- | :--- | :--- |",
    "| `middleware.ts` / `export function middleware` | `proxy.ts` / `export function proxy` (`NextProxy`, `ProxyConfig`) | Node.js runtime only (`runtime` export forbidden); `skipProxyUrlNormalize` replaces `skipMiddlewareUrlNormalize` |",
    "| Sync `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` | `await params`, `await searchParams`, `await cookies()`, `await headers()`, `await draftMode()` | Sync compatibility fully removed in v16; also async `params`/`id` in `opengraph-image`, `icon`, `sitemap` |",
    "| Untyped page/layout props | `PageProps<'/route'>`, `LayoutProps<'/route'>`, `RouteContext<'/api/route'>` | Generated by `next typegen` / `next dev` / `next build`; root layout params via `next/root-params` |",
    "| `experimental.dynamicIO` / `experimental.useCache` / `experimental.ppr` | Top-level `cacheComponents: true` + `partialPrefetching: true` | Incompatible with segment exports `dynamic`, `revalidate`, `fetchCache`, `runtime` |",
    "| Single-arg `revalidateTag('tag')` | `revalidateTag('tag', 'max')` or `updateTag('tag')` | 2nd arg (`cacheLife` profile or `{ expire }`) required; `updateTag` & `refresh()` are Server Action only |",
    "| `connection()` for any random/time read | `await io()` from `next/cache` | Works inside `'use cache'` scopes too; reserve `connection()` for real HTTP request deferral |",
    "| Ad-hoc static/prefetch validation | `export const instant`, `export const prefetch`, `export const ensureStatic` + `prefetch()` / `navigation()` | Segment-level & stage-level controls under `cacheComponents` |",
    "| Parallel routes without `default.tsx` | Explicit `default.tsx` in every `@slot` | Build fails without `default.tsx` in Next.js 16+ |",
    "| `next lint` & `next.config` `eslint` key | Direct ESLint Flat Config (`eslint-config-next@16+`) or Biome | `next lint` removed from Next.js 16 |",
    "| `serverRuntimeConfig` / `publicRuntimeConfig` | `process.env.*` (server), `NEXT_PUBLIC_*` (client), `await connection()` / `await io()` | `next/config` runtime config removed |",
    "| `images.domains`, `minimumCacheTTL: 60`, `qualities` all | `images.remotePatterns`, `localPatterns.search`, `minimumCacheTTL: 14400`, `qualities: [75]`, `maximumRedirects: 3` | Local IPs blocked unless `dangerouslyAllowLocalIP: true` |",
    "",
  ];

  if (agentsRule) {
    lines.push("## Bundled `node_modules/next/AGENTS.md`", "", "```md", agentsRule, "```", "");
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function buildIndexMd(
  version: string,
  sourceBytes: number,
  outputBytes: number,
  counts: NextjsImportSummary["counts"],
  summaries: DocPageSummary[],
): string {
  const ratio = sourceBytes > 0 ? ((outputBytes / sourceBytes) * 100).toFixed(1) : "0.0";
  const lines: string[] = [
    `# Next.js ${version} Knowledge Brain Index`,
    "",
    `- Installed / source version: \`${version}\``,
    `- Corpus: ${counts.docsTotal} docs (${counts.appDocs} App Router, ${counts.pagesDocs} Pages Router, ${counts.archDocs} Arch/Community), ${counts.dtsEntrypoints} public entrypoints (${counts.dtsResolvedFiles} resolved \`.d.ts\`, ${counts.exportedSymbols} symbols), ${counts.topConfigFields} \`NextConfig\` + ${counts.experimentalFields} \`ExperimentalConfig\` + ${counts.imageFields} \`ImageConfig\` fields.`,
    `- Compression: ${(sourceBytes / 1024 / 1024).toFixed(2)} MiB raw -> ${(outputBytes / 1024).toFixed(1)} KiB digests (${ratio}%).`,
    "",
    "## Brain Files",
    "",
    "| File | Scope |",
    "| :--- | :--- |",
    "| `INDEX.md` | Sitemap from `dist/docs/`, topic router, corpus stats |",
    "| `TYPES_DIGEST.md` | Public `next/*` entrypoint exports and compressed core `.d.ts` declarations |",
    "| `CONFIG_SCHEMA.md` | `NextConfig`, `ExperimentalConfig`, `ImageConfigComplete`, `AppSegmentConfig`, `ProxyConfig`, `rewrites` order, `cacheLife` profiles |",
    "| `DOCS_DIGEST.md` | Compacted digests for all bundled App Router, Pages Router, and Architecture docs |",
    "| `UPSTREAM_APIS.md` | Upstream `vercel/next.js`, `vercel/next-devtools-mcp`, `/_next/mcp` tools, official skills, Next 16.0-16.5 breaking changes |",
    "",
    "## Quick Topic Router",
    "",
    "| Area / Task | Canonical Next.js 16.5+ Surface | Brain File |",
    "| :--- | :--- | :--- |",
    "| Network boundary / proxy | `proxy.ts`, `NextProxy`, `ProxyConfig`, `skipProxyUrlNormalize` | `UPSTREAM_APIS.md`, `DOCS_DIGEST.md` |",
    "| Async request APIs | `await params`, `await searchParams`, `await cookies()`, `await headers()`, `next/root-params` | `TYPES_DIGEST.md`, `DOCS_DIGEST.md` |",
    "| Route-aware types | `PageProps<'/route'>`, `LayoutProps<'/route'>`, `RouteContext<'/api'>` (`next typegen`) | `TYPES_DIGEST.md`, `UPSTREAM_APIS.md` |",
    "| Cache Components & PPR | `cacheComponents: true`, `partialPrefetching: true`, `'use cache'`, `cacheLife`, `cacheTag` | `CONFIG_SCHEMA.md`, `DOCS_DIGEST.md` |",
    "| On-demand revalidation | `revalidateTag(tag, 'max')`, `updateTag(tag)`, `refresh()`, `revalidatePath()` | `TYPES_DIGEST.md`, `DOCS_DIGEST.md` |",
    "| Stage & static contracts | `io()`, `prefetch()`, `navigation()`, `connection()`, `instant`, `ensureStatic` | `CONFIG_SCHEMA.md`, `TYPES_DIGEST.md` |",
    "| Config & rewrites | `next.config.ts`, `rewrites` (`beforeFiles` host match, `afterFiles`, `fallback`), `images` | `CONFIG_SCHEMA.md` |",
    "| Error handling & offline | `catchError` (`next/error`), `error.tsx`, `useOffline` (`next/offline`) | `TYPES_DIGEST.md`, `DOCS_DIGEST.md` |",
    "| Runtime MCP inspection | `/_next/mcp` (`get_errors`, `get_compilation_issues`, `compile_route`, `get_routes`) + `next-devtools-mcp` | `UPSTREAM_APIS.md` |",
    "",
    "## Docs Sitemap (`dist/docs/`)",
    "",
  ];

  const byTop = new Map<string, DocPageSummary[]>();
  for (const s of summaries) {
    const list = byTop.get(s.section) ?? [];
    list.push(s);
    byTop.set(s.section, list);
  }
  for (const sec of [...byTop.keys()].sort((a, b) => a.localeCompare(b))) {
    const items = byTop.get(sec)!;
    lines.push(`### \`${sec}\` (${items.length})`);
    for (const s of items) {
      lines.push(`- \`${s.relPath}\` — **${s.title}**${s.description ? `: ${s.description.slice(0, 120)}` : ""}`);
    }
    lines.push("");
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function measureFiles(dir: string, ext: string): { count: number; bytes: number } {
  if (!existsSync(dir)) return { count: 0, bytes: 0 };
  let count = 0;
  let bytes = 0;
  const walk = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile() && e.name.endsWith(ext)) {
        count++;
        bytes += statSync(p).size;
      }
    }
  };
  walk(dir);
  return { count, bytes };
}

export async function importNextjsBrain(opts: NextjsImportOptions = {}): Promise<NextjsImportSummary> {
  const outDir = toSlash(resolve(opts.outDir ?? BRAIN_NEXTJS_DIR));
  const srcRoot = discoverNextRoot(opts.srcRoot);
  if (!srcRoot) {
    return {
      skipped: true,
      reason: "Next.js package/checkout not found; keeping existing brain/nextjs/ output intact.",
      outDir,
      sourceBytes: 0,
      outputBytes: 0,
      compressionRatio: 1,
      filesWritten: [],
      counts: {
        docsTotal: 0,
        appDocs: 0,
        pagesDocs: 0,
        archDocs: 0,
        dtsEntrypoints: 0,
        dtsResolvedFiles: 0,
        exportedSymbols: 0,
        topConfigFields: 0,
        experimentalFields: 0,
        imageFields: 0,
      },
    };
  }

  const pkg = JSON.parse(readFileSync(join(srcRoot, "package.json"), "utf8")) as { version?: string };
  const version = pkg.version ?? "16.5.0";
  const docsDir = existsSync(join(srcRoot, "dist", "docs"))
    ? join(srcRoot, "dist", "docs")
    : join(srcRoot, "docs");

  const docsStats = measureFiles(docsDir, ".md");
  const mdxStats = measureFiles(docsDir, ".mdx");
  const dtsStats = measureFiles(srcRoot, ".d.ts");
  const sourceBytes = docsStats.bytes + mdxStats.bytes + dtsStats.bytes;

  const upstreamMeta = opts.upstreamMeta ?? (opts.live ? await fetchLiveUpstreamMetadata() : undefined);

  const typesRes = buildTypesDigestMd(srcRoot, version);
  const configRes = buildConfigSchemaMd(srcRoot, version);
  const docsRes = buildDocsDigestMd(docsDir, version);
  const upstreamMd = buildUpstreamApisMd(srcRoot, version, upstreamMeta);

  const counts: NextjsImportSummary["counts"] = {
    docsTotal: docsRes.summaries.length,
    appDocs: docsRes.appDocs,
    pagesDocs: docsRes.pagesDocs,
    archDocs: docsRes.archDocs,
    dtsEntrypoints: typesRes.entrypointCount,
    dtsResolvedFiles: typesRes.resolvedCount,
    exportedSymbols: typesRes.symbolCount,
    topConfigFields: configRes.topCount,
    experimentalFields: configRes.expCount,
    imageFields: configRes.imgCount,
  };

  const preliminaryOutputBytes =
    Buffer.byteLength(typesRes.content, "utf8") +
    Buffer.byteLength(configRes.content, "utf8") +
    Buffer.byteLength(docsRes.content, "utf8") +
    Buffer.byteLength(upstreamMd, "utf8");
  const indexMd = buildIndexMd(version, sourceBytes, preliminaryOutputBytes, counts, docsRes.summaries);

  const outputs: Record<string, string> = {
    "INDEX.md": indexMd,
    "TYPES_DIGEST.md": typesRes.content,
    "CONFIG_SCHEMA.md": configRes.content,
    "DOCS_DIGEST.md": docsRes.content,
    "UPSTREAM_APIS.md": upstreamMd,
  };

  let outputBytes = 0;
  const filesWritten: string[] = [];
  const shouldWrite = opts.write ?? true;
  if (shouldWrite) mkdirSync(outDir, { recursive: true });
  for (const [name, content] of Object.entries(outputs)) {
    outputBytes += Buffer.byteLength(content, "utf8");
    if (shouldWrite && writeIfChanged(join(outDir, name), content)) {
      filesWritten.push(name);
    }
  }

  return {
    skipped: false,
    srcRoot,
    outDir,
    version,
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
  let live = false;
  for (let i = 2; i < Bun.argv.length; i++) {
    if (Bun.argv[i] === "--src" && Bun.argv[i + 1]) explicitSrc = Bun.argv[++i];
    else if (Bun.argv[i] === "--out" && Bun.argv[i + 1]) explicitOut = Bun.argv[++i];
    else if (Bun.argv[i] === "--live") live = true;
  }
  const summary = await importNextjsBrain({ srcRoot: explicitSrc, outDir: explicitOut, live });
  console.log(JSON.stringify(summary, null, 2));
}
