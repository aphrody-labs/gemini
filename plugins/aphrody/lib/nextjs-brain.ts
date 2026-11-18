import { existsSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";

export interface NextBrainSearchHit {
  file: string;
  section: string;
  lineStart: number;
  lineEnd: number;
  score: number;
  excerpt: string;
}

export interface NextTypeLookupHit {
  name: string;
  entrypoint: string;
  sourceFile: string;
  kind: string;
  signature: string;
  summary: string;
}

export interface NextConfigLookupHit {
  section: string;
  option: string;
  type: string;
  defaultVal: string;
  summary: string;
}

export interface NextDocLookupHit {
  relPath: string;
  title: string;
  router: "app" | "pages" | "architecture" | "upstream";
  score: number;
  summary: string;
  localPath?: string;
  localExcerpt?: string;
}

export function resolveNextBrainDir(explicit?: string): string {
  if (explicit && existsSync(explicit)) return resolve(explicit);
  if (process.env.NEXTJS_BRAIN_DIR && existsSync(process.env.NEXTJS_BRAIN_DIR)) {
    return resolve(process.env.NEXTJS_BRAIN_DIR);
  }
  let cur = resolve(import.meta.dir);
  for (let i = 0; i < 6; i++) {
    const candidate = join(cur, "brain", "nextjs");
    if (existsSync(join(candidate, "INDEX.md"))) return candidate;
    const parent = dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  const home = process.env.USERPROFILE ?? process.env.HOME ?? homedir();
  return join(home, ".gemini", "brain", "nextjs");
}

function tokenize(query: string): string[] {
  return (query.toLowerCase().match(/[a-z0-9_.:/-]+/g) ?? []).filter((t) => t.length >= 2);
}

interface Section {
  file: string;
  heading: string;
  lineStart: number;
  lineEnd: number;
  text: string;
}

function splitMarkdownSections(file: string, raw: string): Section[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const sections: Section[] = [];
  let heading = basename(file, ".md");
  let start = 1;
  let buf: string[] = [];

  const flush = (endLine: number) => {
    const text = buf.join("\n").trim();
    if (text) {
      sections.push({ file, heading, lineStart: start, lineEnd: endLine, text });
    }
    buf = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const hm = line.match(/^#{1,3}\s+(.+)$/);
    if (hm) {
      flush(i);
      heading = hm[1]!.replace(/`/g, "").trim();
      start = i + 1;
    } else {
      buf.push(line);
    }
  }
  flush(lines.length);
  return sections;
}

export function searchNextBrain(
  query: string,
  opts: { file?: string; limit?: number; brainDir?: string } = {},
): NextBrainSearchHit[] {
  const brainDir = resolveNextBrainDir(opts.brainDir);
  if (!existsSync(brainDir)) return [];
  const limit = Math.max(1, Math.min(30, opts.limit ?? 8));
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  const rawQuery = query.trim().toLowerCase();

  const files = readdirSync(brainDir)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => !opts.file || f.toLowerCase().includes(opts.file.toLowerCase()))
    .sort();

  const hits: NextBrainSearchHit[] = [];
  for (const file of files) {
    const raw = readFileSync(join(brainDir, file), "utf8");
    const sections = splitMarkdownSections(file, raw);
    for (const sec of sections) {
      const hLower = sec.heading.toLowerCase();
      const bLower = sec.text.toLowerCase();
      let score = 0;
      let matchedTerms = 0;
      if (hLower.includes(rawQuery)) score += 25;
      else if (bLower.includes(rawQuery)) score += 10;

      for (const term of terms) {
        let termMatched = false;
        if (hLower.includes(term)) {
          score += 8;
          termMatched = true;
        }
        if (bLower.includes(term)) {
          const occ = bLower.split(term).length - 1;
          score += Math.min(6, occ * 1.5);
          termMatched = true;
        }
        if (termMatched) matchedTerms++;
      }
      if (matchedTerms === 0) continue;
      if (matchedTerms === terms.length) score += 6;

      const excerptLines = sec.text
        .split("\n")
        .filter((l) => l.trim())
        .slice(0, 12);
      hits.push({
        file: sec.file,
        section: sec.heading,
        lineStart: sec.lineStart,
        lineEnd: sec.lineEnd,
        score: Number(score.toFixed(2)),
        excerpt: excerptLines.join("\n").slice(0, 950),
      });
    }
  }

  return hits.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file)).slice(0, limit);
}

export function lookupNextTypes(
  symbol: string,
  opts: { module?: string; limit?: number; brainDir?: string } = {},
): NextTypeLookupHit[] {
  const brainDir = resolveNextBrainDir(opts.brainDir);
  const typesPath = join(brainDir, "TYPES_DIGEST.md");
  if (!existsSync(typesPath)) return [];
  const q = symbol.trim().toLowerCase();
  if (!q) return [];
  const modFilter = opts.module?.trim().toLowerCase();
  const limit = Math.max(1, Math.min(40, opts.limit ?? 12));

  const raw = readFileSync(typesPath, "utf8").replace(/\r\n/g, "\n");
  const lines = raw.split("\n");
  const scored: Array<{ score: number; hit: NextTypeLookupHit }> = [];
  const seen = new Set<string>();

  let inCompressed = false;
  let currentEntrypoint = "next";
  let currentFile = "";

  for (const line of lines) {
    if (line.startsWith("## Compressed Core Declaration Files")) {
      inCompressed = true;
      continue;
    }
    const h3 = line.match(/^### `([^`]+)`/);
    if (h3) {
      if (inCompressed) currentFile = h3[1]!;
      else currentEntrypoint = h3[1]!;
      continue;
    }

    if (!inCompressed && line.startsWith("- `")) {
      if (modFilter && !currentEntrypoint.toLowerCase().includes(modFilter)) continue;
      const m = line.match(/^- `([^`]+)`\s+\(`([^`]+)`\)(?:\s+—\s+(.*))?$/);
      if (!m) continue;
      const sig = m[1]!;
      const sourceFile = m[2]!;
      const summary = m[3] ?? "";
      const declM = sig.match(
        /^(?:export\s+)?(?:declare\s+)?(function|const|class|interface|type|namespace|module)\s+([$A-Za-z0-9_']+)/,
      );
      const reExportM = sig.match(/^export\s+\{\s*([^}]+?)\s*\}/);
      const name = declM?.[2] ?? reExportM?.[1]?.trim() ?? sig.slice(0, 40);
      const kind = declM?.[1] ?? (reExportM ? "export" : "symbol");
      const hay = `${name} ${sig} ${summary}`.toLowerCase();
      if (!hay.includes(q)) continue;

      const key = `${currentEntrypoint}:${sig}`;
      if (seen.has(key)) continue;
      seen.add(key);

      let score = 1;
      if (name.toLowerCase() === q) score = 20;
      else if (name.toLowerCase().startsWith(q)) score = 12;
      else if (sig.toLowerCase().includes(q)) score = 6;

      scored.push({
        score,
        hit: {
          name,
          entrypoint: currentEntrypoint,
          sourceFile,
          kind,
          signature: sig.slice(0, 320),
          summary,
        },
      });
    } else if (inCompressed) {
      if (modFilter && !currentFile.toLowerCase().includes(modFilter)) continue;
      const declM = line.match(
        /^\s*(?:export\s+)?(?:declare\s+)?(function|const|class|interface|type|namespace)\s+([$A-Za-z0-9_]+)/,
      );
      if (!declM) continue;
      const name = declM[2]!;
      if (!name.toLowerCase().includes(q) && !line.toLowerCase().includes(q)) continue;
      const sig = line.trim().slice(0, 320);
      const key = `${currentFile}:${sig}`;
      if (seen.has(key)) continue;
      seen.add(key);

      let score = name.toLowerCase() === q ? 16 : name.toLowerCase().startsWith(q) ? 10 : 4;
      scored.push({
        score,
        hit: {
          name,
          entrypoint: currentFile,
          sourceFile: currentFile,
          kind: declM[1]!,
          signature: sig,
          summary: "",
        },
      });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score || a.hit.name.localeCompare(b.hit.name))
    .slice(0, limit)
    .map((x) => x.hit);
}

export type ConfigSectionFilter =
  | "top"
  | "experimental"
  | "images"
  | "segment"
  | "proxy"
  | "routes"
  | "cacheLife"
  | "all";

function mapSectionHeading(heading: string): ConfigSectionFilter | "other" {
  const h = heading.toLowerCase();
  if (h.includes("top-level")) return "top";
  if (h.includes("experimentalconfig")) return "experimental";
  if (h.includes("imageconfig")) return "images";
  if (h.includes("app route segment")) return "segment";
  if (h.includes("proxy segment")) return "proxy";
  if (h.includes("routing execution order")) return "routes";
  if (h.includes("cachelife")) return "cacheLife";
  return "other";
}

export function lookupNextConfig(
  option: string,
  opts: { section?: ConfigSectionFilter; limit?: number; brainDir?: string } = {},
): { matches: NextConfigLookupHit[]; routingOrder?: string[] } {
  const brainDir = resolveNextBrainDir(opts.brainDir);
  const cfgPath = join(brainDir, "CONFIG_SCHEMA.md");
  if (!existsSync(cfgPath)) return { matches: [] };
  const q = option.trim().toLowerCase();
  const secFilter = opts.section ?? "all";
  const limit = Math.max(1, Math.min(50, opts.limit ?? 15));

  const lines = readFileSync(cfgPath, "utf8").replace(/\r\n/g, "\n").split("\n");
  let currentHeading = "";
  let currentKind: ConfigSectionFilter | "other" = "other";
  const scored: Array<{ score: number; hit: NextConfigLookupHit }> = [];
  const routingOrder: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      currentHeading = line.slice(3).trim();
      currentKind = mapSectionHeading(currentHeading);
      continue;
    }

    if (currentKind === "routes" && /^\d+\.\s+/.test(line.trim())) {
      routingOrder.push(line.trim());
    }

    if (!line.startsWith("|")) continue;
    if (secFilter !== "all" && currentKind !== secFilter) continue;

    const cols = line
      .replace(/\\\|/g, "\u0000")
      .split("|")
      .map((c) => c.trim().replace(/\u0000/g, "|"))
      .filter((c, idx, arr) => !(idx === 0 && c === "") && !(idx === arr.length - 1 && c === ""));

    if (cols.length < 3) continue;
    const col0 = cols[0]!.replace(/^`|`$/g, "");
    if (col0 === "Option" || col0 === "Profile" || col0.startsWith(":---") || col0.startsWith("---")) continue;

    const cleanOption = col0;
    const typeOrStale = (cols[1] ?? "").replace(/^`|`$/g, "");
    const defOrRev = (cols[2] ?? "").replace(/^`|`$/g, "");
    const summaryOrExp = (cols[3] ?? "").replace(/^`|`$/g, "");

    const hay = `${cleanOption} ${typeOrStale} ${defOrRev} ${summaryOrExp}`.toLowerCase();
    if (q && !hay.includes(q)) continue;

    const bareName = cleanOption.replace(/\?$/, "").toLowerCase();
    let score = 1;
    if (!q) score = 2;
    else if (bareName === q) score = 30;
    else if (bareName.startsWith(q)) score = 18;
    else if (bareName.includes(q)) score = 12;

    scored.push({
      score,
      hit: {
        section: currentHeading,
        option: cleanOption,
        type: typeOrStale,
        defaultVal: defOrRev,
        summary: summaryOrExp,
      },
    });
  }

  const result: { matches: NextConfigLookupHit[]; routingOrder?: string[] } = {
    matches: scored
      .sort((a, b) => b.score - a.score || a.hit.option.localeCompare(b.hit.option))
      .slice(0, limit)
      .map((x) => x.hit),
  };
  if (secFilter === "routes" || q.includes("rewrite") || q.includes("beforefiles") || q.includes("order")) {
    result.routingOrder = routingOrder;
  }
  return result;
}

export function lookupNextDocs(
  topic: string,
  opts: {
    router?: "app" | "pages" | "architecture" | "all";
    projectPath?: string;
    readLocal?: boolean;
    limit?: number;
    brainDir?: string;
  } = {},
): { localDocsDir?: string; hits: NextDocLookupHit[] } {
  const brainDir = resolveNextBrainDir(opts.brainDir);
  const docsDigestPath = join(brainDir, "DOCS_DIGEST.md");
  const upstreamPath = join(brainDir, "UPSTREAM_APIS.md");
  const terms = tokenize(topic);
  if (terms.length === 0) return { hits: [] };

  const routerFilter = opts.router ?? "all";
  const limit = Math.max(1, Math.min(25, opts.limit ?? 8));
  const rawQuery = topic.trim().toLowerCase();

  const projRoot = resolve(opts.projectPath?.trim() || process.cwd());
  const localDocsCandidate = join(projRoot, "node_modules", "next", "dist", "docs");
  const localDocsDir = existsSync(localDocsCandidate) ? localDocsCandidate.replaceAll("\\", "/") : undefined;

  const hits: NextDocLookupHit[] = [];

  if (existsSync(docsDigestPath)) {
    const sections = splitMarkdownSections("DOCS_DIGEST.md", readFileSync(docsDigestPath, "utf8"));
    for (const sec of sections) {
      const m = sec.heading.match(/^([^\s]+)\s+—\s+(.+)$/);
      if (!m) continue;
      const relPath = m[1]!;
      const title = m[2]!;
      const router: NextDocLookupHit["router"] = relPath.startsWith("01-app/")
        ? "app"
        : relPath.startsWith("02-pages/")
          ? "pages"
          : "architecture";
      if (routerFilter !== "all" && router !== routerFilter) continue;

      const hLower = `${relPath} ${title}`.toLowerCase();
      const bLower = sec.text.toLowerCase();
      let score = 0;
      let matched = 0;
      if (hLower.includes(rawQuery)) score += 28;
      else if (bLower.includes(rawQuery)) score += 10;

      for (const t of terms) {
        let hitT = false;
        if (hLower.includes(t)) {
          score += 9;
          hitT = true;
        }
        if (bLower.includes(t)) {
          score += Math.min(5, (bLower.split(t).length - 1) * 1.5);
          hitT = true;
        }
        if (hitT) matched++;
      }
      if (matched === 0) continue;
      if (matched === terms.length) score += 6;

      let localPath: string | undefined;
      let localExcerpt: string | undefined;
      if (localDocsDir) {
        const full = join(localDocsCandidate, relPath);
        if (existsSync(full)) {
          localPath = full.replaceAll("\\", "/");
          if (opts.readLocal) {
            localExcerpt = readFileSync(full, "utf8").replace(/\r\n/g, "\n").slice(0, 1400);
          }
        }
      }

      hits.push({
        relPath,
        title,
        router,
        score: Number(score.toFixed(2)),
        summary: sec.text.split("\n").slice(0, 6).join("\n").slice(0, 550),
        ...(localPath ? { localPath } : {}),
        ...(localExcerpt ? { localExcerpt } : {}),
      });
    }
  }

  if (routerFilter === "all" && existsSync(upstreamPath)) {
    const sections = splitMarkdownSections("UPSTREAM_APIS.md", readFileSync(upstreamPath, "utf8"));
    for (const sec of sections) {
      const hLower = sec.heading.toLowerCase();
      const bLower = sec.text.toLowerCase();
      let score = 0;
      let matched = 0;
      for (const t of terms) {
        if (hLower.includes(t)) {
          score += 7;
          matched++;
        } else if (bLower.includes(t)) {
          score += 2;
          matched++;
        }
      }
      if (matched === 0) continue;
      if (matched === terms.length) score += 4;
      hits.push({
        relPath: "UPSTREAM_APIS.md",
        title: sec.heading,
        router: "upstream",
        score: Number(score.toFixed(2)),
        summary: sec.text.split("\n").slice(0, 6).join("\n").slice(0, 550),
      });
    }
  }

  return {
    ...(localDocsDir ? { localDocsDir } : {}),
    hits: hits.sort((a, b) => b.score - a.score || a.relPath.localeCompare(b.relPath)).slice(0, limit),
  };
}
