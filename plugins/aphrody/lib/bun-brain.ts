import { existsSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";

export interface BrainSearchHit {
  file: string;
  section: string;
  lineStart: number;
  lineEnd: number;
  score: number;
  excerpt: string;
}

export interface TypeLookupHit {
  name: string;
  module: string;
  file: string;
  kind: string;
  signature: string;
  summary: string;
}

export interface ApiMatrixResult {
  topics: Array<{ topic: string; apis: string }>;
  bunApis: Array<{ name: string; kind: string; file: string; summary: string; signature: string }>;
  builtinModules: string[];
  nodeCompat: Array<{ scope: string; name: string; status: string; notes: string }>;
  cliCommands: string[];
}

export function resolveBrainDir(explicit?: string): string {
  if (explicit && existsSync(explicit)) return resolve(explicit);
  if (process.env.BUN_BRAIN_DIR && existsSync(process.env.BUN_BRAIN_DIR)) {
    return resolve(process.env.BUN_BRAIN_DIR);
  }
  let cur = resolve(import.meta.dir);
  for (let i = 0; i < 6; i++) {
    const candidate = join(cur, "brain", "bun");
    if (existsSync(join(candidate, "INDEX.md"))) return candidate;
    const parent = dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  const home = process.env.USERPROFILE ?? process.env.HOME ?? homedir();
  return join(home, ".gemini", "brain", "bun");
}

function tokenize(query: string): string[] {
  return (query.toLowerCase().match(/[a-z0-9_.:-]+/g) ?? []).filter((t) => t.length >= 2);
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

export function searchBrain(
  query: string,
  opts: { file?: string; limit?: number; brainDir?: string } = {},
): BrainSearchHit[] {
  const brainDir = resolveBrainDir(opts.brainDir);
  if (!existsSync(brainDir)) return [];
  const limit = Math.max(1, Math.min(30, opts.limit ?? 8));
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  const rawQuery = query.trim().toLowerCase();

  const files = readdirSync(brainDir)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => !opts.file || f.toLowerCase().includes(opts.file.toLowerCase()))
    .sort();

  const hits: BrainSearchHit[] = [];
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
        .slice(0, 10);
      hits.push({
        file: sec.file,
        section: sec.heading,
        lineStart: sec.lineStart,
        lineEnd: sec.lineEnd,
        score: Number(score.toFixed(2)),
        excerpt: excerptLines.join("\n").slice(0, 900),
      });
    }
  }

  return hits.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file)).slice(0, limit);
}

export function lookupTypes(
  symbol: string,
  opts: { module?: string; limit?: number; brainDir?: string } = {},
): TypeLookupHit[] {
  const brainDir = resolveBrainDir(opts.brainDir);
  if (!existsSync(brainDir)) return [];
  const q = symbol.trim().toLowerCase();
  if (!q) return [];
  const limit = Math.max(1, Math.min(40, opts.limit ?? 12));
  const results: TypeLookupHit[] = [];

  const runtimePath = join(brainDir, "RUNTIME_APIS.md");
  if (existsSync(runtimePath)) {
    const text = readFileSync(runtimePath, "utf8");
    const blocks = text.split(/^### /m).slice(1);
    for (const block of blocks) {
      const lines = block.split("\n");
      const header = lines[0] ?? "";
      const bunM = header.match(/^`Bun\.([^`]+)`\s+\(([^,]+),\s*`([^`]+)`\)(?:\s+—\s+(.*))?$/);
      if (bunM) {
        const name = `Bun.${bunM[1]}`;
        const sigs = lines
          .slice(1)
          .filter((l) => l.startsWith("- `"))
          .map((l) => l.slice(3, -1));
        if (
          name.toLowerCase().includes(q) ||
          sigs.some((s) => s.toLowerCase().includes(q))
        ) {
          if (!opts.module || opts.module === "bun") {
            results.push({
              name,
              module: "bun",
              file: bunM[3]!,
              kind: bunM[2]!,
              signature: sigs.join(" | ").slice(0, 320),
              summary: bunM[4] ?? "",
            });
          }
        }
        continue;
      }
      const modM = header.match(/^`([^`]+)`$/);
      if (modM) {
        const modName = modM[1]!;
        if (opts.module && !modName.toLowerCase().includes(opts.module.toLowerCase())) continue;
        for (const l of lines.slice(1)) {
          if (!l.startsWith("- `")) continue;
          if (l.toLowerCase().includes(q) || modName.toLowerCase().includes(q)) {
            const sig = l.slice(2).trim();
            results.push({
              name: modName,
              module: modName,
              file: modName.replace(/^bun:/, "") + ".d.ts",
              kind: "module-export",
              signature: sig.slice(0, 320),
              summary: "",
            });
          }
        }
      }
    }
  }

  const typesPath = join(brainDir, "TYPES_DIGEST.md");
  if (existsSync(typesPath) && results.length < limit) {
    const raw = readFileSync(typesPath, "utf8");
    let currentFile = "";
    let currentModule = "global";
    for (const line of raw.split("\n")) {
      const fm = line.match(/^## `([^`]+)`/);
      if (fm) {
        currentFile = fm[1]!;
        continue;
      }
      const mm = line.match(/^declare\s+module\s+("[^"]+"(?:\s+with\s+\{[^}]+\})?)/);
      if (mm) {
        currentModule = mm[1]!.replace(/^"|"$/g, "");
      }
      if (opts.module && !currentModule.toLowerCase().includes(opts.module.toLowerCase())) continue;
      const declM = line.match(
        /^\s*(?:export\s+)?(interface|type|class|function|const|var|namespace|declare)\s+([$A-Za-z0-9_]+)/,
      );
      if (declM && line.toLowerCase().includes(q)) {
        const declName = declM[2]!;
        const exists = results.some(
          (r) => r.signature.includes(line.trim()) && r.file === currentFile,
        );
        if (!exists) {
          results.push({
            name: declName,
            module: currentModule,
            file: currentFile,
            kind: declM[1]!,
            signature: line.trim().slice(0, 320),
            summary: "",
          });
        }
        if (results.length >= limit) break;
      }
    }
  }

  return results.slice(0, limit);
}

export function getApiMatrix(
  opts: { topic?: string; kind?: "bun" | "builtin" | "node" | "cli" | "all"; brainDir?: string } = {},
): ApiMatrixResult {
  const brainDir = resolveBrainDir(opts.brainDir);
  const kind = opts.kind ?? "all";
  const topicQ = (opts.topic ?? "").trim().toLowerCase();
  const out: ApiMatrixResult = {
    topics: [],
    bunApis: [],
    builtinModules: [],
    nodeCompat: [],
    cliCommands: [],
  };

  const runtimePath = join(brainDir, "RUNTIME_APIS.md");
  if (existsSync(runtimePath)) {
    const raw = readFileSync(runtimePath, "utf8");
    const lines = raw.split("\n");
    let section = "";
    for (const line of lines) {
      if (line.startsWith("## ")) {
        section = line.slice(3).trim();
        continue;
      }
      if ((kind === "all" || kind === "bun") && section.startsWith("Topic Overview") && line.startsWith("|")) {
        const cols = line.split("|").map((c) => c.trim()).filter(Boolean);
        if (cols.length >= 2 && cols[0] !== "Topic" && !cols[0]!.startsWith("---")) {
          if (!topicQ || cols.join(" ").toLowerCase().includes(topicQ)) {
            out.topics.push({ topic: cols[0]!, apis: cols[1]! });
          }
        }
      } else if ((kind === "all" || kind === "node") && section.startsWith("`node:*`") && line.startsWith("|")) {
        const cols = line.split("|").map((c) => c.trim()).filter(Boolean);
        if (cols.length >= 4 && cols[0] !== "Scope" && !cols[0]!.startsWith("---")) {
          if (!topicQ || cols.join(" ").toLowerCase().includes(topicQ)) {
            out.nodeCompat.push({
              scope: cols[0]!,
              name: cols[1]!.replace(/`/g, ""),
              status: cols[2]!,
              notes: cols[3]!,
            });
          }
        }
      } else if ((kind === "all" || kind === "builtin") && line.startsWith("### `bun")) {
        const mod = line.slice(4).replace(/`/g, "").trim();
        if (!topicQ || mod.toLowerCase().includes(topicQ)) {
          out.builtinModules.push(mod);
        }
      }
    }

    if (kind === "all" || kind === "bun") {
      for (const block of raw.split(/^### `Bun\./m).slice(1)) {
        const first = block.split("\n")[0] ?? "";
        const m = first.match(/^([^`]+)`\s+\(([^,]+),\s*`([^`]+)`\)(?:\s+—\s+(.*))?$/);
        if (!m) continue;
        const name = `Bun.${m[1]}`;
        const sig = block.split("\n").find((l) => l.startsWith("- `"))?.slice(3, -1) ?? "";
        if (!topicQ || name.toLowerCase().includes(topicQ) || (m[4] ?? "").toLowerCase().includes(topicQ)) {
          out.bunApis.push({
            name,
            kind: m[2]!,
            file: m[3]!,
            summary: m[4] ?? "",
            signature: sig,
          });
        }
      }
    }
  }

  if (kind === "all" || kind === "cli") {
    const cliPath = join(brainDir, "CLI_TOOLING.md");
    if (existsSync(cliPath)) {
      const raw = readFileSync(cliPath, "utf8");
      for (const m of raw.matchAll(/^##\s+(.+)$/gm)) {
        const h = m[1]!.trim();
        if (!topicQ || h.toLowerCase().includes(topicQ)) out.cliCommands.push(h);
      }
    }
  }

  return out;
}
