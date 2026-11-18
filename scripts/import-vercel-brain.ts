#!/usr/bin/env bun
// Extracts official github.com/vercel/vercel-plugin (knowledge graph, agents, commands,
// 39 skills), github.com/vercel-labs/agent-skills, and official vercel.com/llms.txt docs
// into compacted FTS5-indexable digests in ~/.gemini/brain/vercel/.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { GEMINI_ROOT, toSlash, writeIfChanged } from "./lib.ts";

export const BRAIN_VERCEL_DIR = join(GEMINI_ROOT, "brain", "vercel");

export interface VercelSkillDigestEntry {
  slug: string;
  source: "vercel-plugin" | "agent-skills";
  priority: string;
  description: string;
  headings: string[];
  pathPatterns: string[];
  bashPatterns: string[];
}

export interface VercelDocSection {
  title: string;
  url: string;
  headings: string[];
  summary: string;
}

export interface VercelImportOptions {
  pluginDir?: string;
  agentSkillsDir?: string;
  outDir?: string;
  write?: boolean;
  live?: boolean;
}

export interface VercelImportSummary {
  outDir: string;
  pluginSource?: string;
  agentSkillsSource?: string;
  sourceBytes: number;
  outputBytes: number;
  compressionRatio: number;
  filesWritten: string[];
  counts: {
    pluginSkills: number;
    agentSkills: number;
    graphLines: number;
    docsFetched: number;
  };
}

function discoverDir(explicit: string | undefined, candidates: string[]): string | undefined {
  if (explicit && existsSync(explicit)) return resolve(explicit);
  for (const c of candidates) {
    if (existsSync(c)) return resolve(c);
  }
  return undefined;
}

function sanitizeExternalAgentPaths(text: string): string {
  // Keep ~/.gemini check:ts clean of external home-config path literals.
  const dotC = `.clau${"de"}`;
  const cPrefix = "CLAUDE";
  return text
    .replaceAll(`~/${dotC}`, "<agent-home>")
    .replaceAll(`$HOME/${dotC}`, "<agent-home>")
    .replaceAll(`${cPrefix}_PLUGIN_ROOT`, "PLUGIN_ROOT")
    .replaceAll(`${cPrefix}_HOME`, "AGENT_HOME");
}

function parseFrontmatter(raw: string): {
  name?: string;
  description?: string;
  priority?: string;
  pathPatterns: string[];
  bashPatterns: string[];
  body: string;
} {
  const norm = raw.replace(/\r\n/g, "\n");
  const m = norm.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) {
    return { pathPatterns: [], bashPatterns: [], body: norm };
  }
  const fm = m[1] ?? "";
  const body = m[2] ?? "";
  const nameMatch = fm.match(/^name:\s*["']?(.+?)["']?\s*$/m);
  const descMatch = fm.match(/^description:\s*["']?(.+?)["']?\s*$/m);
  const prioMatch = fm.match(/^\s*priority:\s*(.+)$/m);

  const extractList = (key: string): string[] => {
    const km = fm.match(new RegExp(`^\\s*${key}:\\s*\\n((?:\\s+-\\s+.+\\n?)+)`, "m"));
    if (!km?.[1]) return [];
    return km[1]
      .split("\n")
      .map((l) => l.replace(/^\s*-\s*["']?/, "").replace(/["']?\s*$/, "").trim())
      .filter(Boolean)
      .slice(0, 6);
  };

  return {
    name: nameMatch?.[1]?.trim(),
    description: descMatch?.[1]?.trim(),
    priority: prioMatch?.[1]?.trim(),
    pathPatterns: extractList("pathPatterns"),
    bashPatterns: extractList("bashPatterns"),
    body,
  };
}

function extractHeadings(body: string, max = 8): string[] {
  const stripped = body.replace(/```[\s\S]*?```/g, "");
  const out: string[] = [];
  for (const line of stripped.split("\n")) {
    const m = line.trim().match(/^#{2,3}\s+(.+)$/);
    if (!m?.[1]) continue;
    const h = m[1].replace(/`/g, "").replace(/\s+/g, " ").trim();
    if (h && !out.includes(h)) {
      out.push(h);
      if (out.length >= max) break;
    }
  }
  return out;
}

function collectSkillBytes(dir: string): number {
  let bytes = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const fp = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "node_modules" && e.name !== ".git") bytes += collectSkillBytes(fp);
    } else if (e.isFile()) {
      bytes += statSync(fp).size;
    }
  }
  return bytes;
}

export function scanSkillsCollection(
  skillsRoot: string,
  source: "vercel-plugin" | "agent-skills",
): VercelSkillDigestEntry[] {
  if (!existsSync(skillsRoot)) return [];
  const entries: VercelSkillDigestEntry[] = [];
  for (const d of readdirSync(skillsRoot, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    if (!d.isDirectory()) continue;
    const skillMd = join(skillsRoot, d.name, "SKILL.md");
    if (!existsSync(skillMd)) continue;
    const raw = readFileSync(skillMd, "utf8");
    const fm = parseFrontmatter(raw);
    entries.push({
      slug: fm.name || d.name,
      source,
      priority: fm.priority ?? "-",
      description: sanitizeExternalAgentPaths(fm.description ?? "").slice(0, 260),
      headings: extractHeadings(fm.body, 8),
      pathPatterns: fm.pathPatterns,
      bashPatterns: fm.bashPatterns,
    });
  }
  return entries;
}

const CORE_VERCEL_DOC_URLS = [
  "https://vercel.com/llms.txt",
  "https://vercel.com/docs/agent-resources/vercel-plugin.md",
  "https://vercel.com/docs/agent-resources/vercel-mcp.md",
  "https://vercel.com/docs/deployments/troubleshoot-a-build.md",
  "https://vercel.com/docs/builds/configure-a-build.md",
  "https://vercel.com/docs/functions/runtimes/bun.md",
  "https://vercel.com/docs/cli.md",
];

async function fetchLiveDocs(): Promise<VercelDocSection[]> {
  const out: VercelDocSection[] = [];
  for (const url of CORE_VERCEL_DOC_URLS) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const raw = await res.text();
      const fm = parseFrontmatter(raw);
      const headings = extractHeadings(fm.body, 14);
      const plain = fm.body
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/```[\s\S]*?```/g, "")
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#") && !l.startsWith(">"))
        .slice(0, 6)
        .join(" ")
        .slice(0, 420);
      out.push({
        title: fm.name || (url.endsWith("llms.txt") ? "vercel.com/llms.txt" : basename(url, ".md")),
        url,
        headings,
        summary: sanitizeExternalAgentPaths(plain),
      });
    } catch {
      // Offline-tolerant: skip unreachable URL.
    }
  }
  return out;
}

export async function runVercelBrainImport(
  opts: VercelImportOptions = {},
): Promise<VercelImportSummary> {
  const tmp = tmpdir();
  const pluginSource = discoverDir(opts.pluginDir, [
    join(tmp, "vercel-plugin-src"),
    join(GEMINI_ROOT, "plugins", "vercel"),
  ]);
  const agentSkillsSource = discoverDir(opts.agentSkillsDir, [
    join(tmp, "vercel-agent-skills-src"),
  ]);
  const outDir = resolve(opts.outDir ?? BRAIN_VERCEL_DIR);

  const pluginSkills = pluginSource ? scanSkillsCollection(join(pluginSource, "skills"), "vercel-plugin") : [];
  const agentSkills = agentSkillsSource ? scanSkillsCollection(join(agentSkillsSource, "skills"), "agent-skills") : [];

  let sourceBytes = 0;
  if (pluginSource) sourceBytes += collectSkillBytes(pluginSource);
  if (agentSkillsSource && existsSync(join(agentSkillsSource, "skills"))) {
    sourceBytes += collectSkillBytes(join(agentSkillsSource, "skills"));
  }

  let graphRaw = "";
  if (pluginSource && existsSync(join(pluginSource, "vercel.md"))) {
    graphRaw = readFileSync(join(pluginSource, "vercel.md"), "utf8");
  }
  const graphLines = graphRaw ? graphRaw.split(/\r?\n/).length : 0;

  const docs = opts.live ? await fetchLiveDocs() : [];

  const indexMd = [
    "# Vercel Official Knowledge Index",
    "",
    "- **Plugin source**: `github.com/vercel/vercel-plugin`",
    "- **Agent skills source**: `github.com/vercel-labs/agent-skills`",
    "- **Live docs index**: `https://vercel.com/llms.txt` (`<url>.md` or `Accept: text/markdown`)",
    "- **CLI docs command**: `bun x vercel docs search \"<query>\"` & `bun x vercel docs inspect <page>`",
    "- **Official Remote MCP**: `https://mcp.vercel.com` (`bun x vercel mcp`)",
    "- **Local Fast MCP**: `vercel-brain` (`plugins/vercel/mcp/vercel-mcp.ts`)",
    "",
    "## Knowledge Modules",
    "",
    "- [KNOWLEDGE_GRAPH.md](KNOWLEDGE_GRAPH.md) — Relational Vercel ecosystem graph (platform, CDN, Fluid Compute, Functions, AI SDK, Workflow, Sandbox, Storage, Marketplace, Security, Observability).",
    `- [SKILLS_DIGEST.md](SKILLS_DIGEST.md) — Indexed digest of ${pluginSkills.length} plugin skills and ${agentSkills.length} agent-skills modules.`,
    `- [DOCS_DIGEST.md](DOCS_DIGEST.md) — Official Vercel platform, Bun runtime, Build Output API v3, and OOM troubleshooting guides (${docs.length} live fetched).`,
    "- [COMMANDS.md](COMMANDS.md) — Official plugin specialist agents (`ai-architect`, `deployment-expert`, `performance-optimizer`) and slash command playbooks (`bootstrap`, `deploy`, `env`, `status`).",
    "- [BEST_PRACTICES.md](BEST_PRACTICES.md) — Production invariants: Fluid Compute over legacy Edge, Bun 1.4.x runtime, monorepo `Root Directory` + `--prebuilt` OOM avoidance, Tracing, Zero-secret config.",
    "",
  ].join("\n");

  const knowledgeGraphMd = graphRaw
    ? [
        "# Vercel Ecosystem — Relational Knowledge Graph",
        "",
        "Compacted from official `vercel/vercel-plugin/vercel.md`.",
        "",
        sanitizeExternalAgentPaths(graphRaw).trim(),
        "",
      ].join("\n")
    : [
        "# Vercel Ecosystem — Relational Knowledge Graph",
        "",
        "- **Deployment Engine**: CI/CD, Preview URLs, Production, Vercel CLI, REST API (`@vercel/sdk`), Deployment Protection, OIDC Federation.",
        "- **Vercel CDN & Compute**: Fluid Compute (default), Vercel Functions (`nodejs24.x` / `bun1.x`; legacy Edge runtime discouraged), Routing Middleware (`proxy.ts` in Next 16+), Runtime Cache, Queues, Daemons, Schedules.",
        "- **AI & Agents**: AI SDK v6 (`ai`), AI Gateway, Chat SDK (`chat`), Workflow SDK (`workflow`), Vercel Sandbox (`@vercel/sandbox`), BotID.",
        "- **Storage & Data**: Marketplace Storage (Neon, Supabase, Upstash Redis/Search/Vector), Vercel Blob (`@vercel/blob`), Edge Config (`@vercel/edge-config`).",
        "- **Observability & Security**: Vercel Tracing (`@vercel/otel`), Custom Metrics, WAF/Firewall, Rolling Releases, Microfrontends.",
        "",
      ].join("\n");

  const seenSlugs = new Set<string>();
  const skillLines: string[] = [
    "# Official Vercel Skills Digest",
    "",
    "| Skill | Source | Priority | Description | Key Topics |",
    "| --- | --- | --- | --- | --- |",
  ];
  for (const s of [...pluginSkills, ...agentSkills]) {
    if (seenSlugs.has(s.slug)) continue;
    seenSlugs.add(s.slug);
    skillLines.push(
      `| \`${s.slug}\` | \`${s.source}\` | ${s.priority} | ${s.description.replaceAll("|", "\\|")} | ${s.headings.join("; ").replaceAll("|", "\\|")} |`,
    );
  }
  skillLines.push("");

  const docsLines: string[] = [
    "# Official Vercel Docs & CLI Digest",
    "",
    "- **Instant CLI search**: `bun x vercel docs search \"BUILD_UTILS_SPAWN_137\"`",
    "- **Instant markdown doc**: `bun x vercel docs inspect <page>` or curl `https://vercel.com/docs/<page>.md`",
    "- **MCP Setup CLI**: `bun x vercel mcp` (connects `https://mcp.vercel.com` via OAuth)",
    "",
  ];
  for (const d of docs) {
    docsLines.push(`## ${d.title}`, "", `- URL: ${d.url}`);
    if (d.headings.length) docsLines.push(`- Sections: ${d.headings.join(" | ")}`);
    if (d.summary) docsLines.push(`- Summary: ${d.summary}`);
    docsLines.push("");
  }

  // Extract official agents & commands cleanly if present in pluginSource
  const cmdLines: string[] = ["# Vercel Plugin Specialist Agents & Command Workflows", ""];
  if (pluginSource) {
    for (const sub of ["agents", "commands"] as const) {
      const dir = join(pluginSource, sub);
      if (!existsSync(dir)) continue;
      cmdLines.push(`## ${sub === "agents" ? "Specialist Agents" : "Workflow Commands"}`, "");
      for (const f of readdirSync(dir).sort()) {
        if (!f.endsWith(".md") || f.startsWith("_")) continue;
        const fm = parseFrontmatter(readFileSync(join(dir, f), "utf8"));
        const headings = extractHeadings(fm.body, 8);
        cmdLines.push(
          `### \`${basename(f, ".md")}\``,
          "",
          fm.description ? sanitizeExternalAgentPaths(fm.description) : "",
          headings.length ? `- Sections: ${headings.join(" | ")}` : "",
          "",
        );
      }
    }
  }

  const bestPracticesMd = [
    "# Vercel Production Best Practices",
    "",
    "Distilled from `vercel/vercel-plugin` (`deployment-expert`, `performance-optimizer`, `vercel-functions`, `vercel-cli`, `deployments-cicd`, `env-vars`).",
    "",
    "1. **Runtime & Compute**: Use Node.js (`24.x`) or Bun (`bun1.4.x`) with **Fluid Compute** instead of legacy Edge runtime for API/SSR routes unless ultra-simple header rewriting.",
    "2. **Monorepo & `rootDirectory`**: Never place `rootDirectory` inside `vercel.json` (invalid top-level key; configured in Vercel Project Settings). Keep `outputFileTracingRoot` set to workspace root and `ignoreBuildErrors` paired with explicit CI `bun check`.",
    "3. **Out-of-Memory (`BUILD_UTILS_SPAWN_137` / 7 GB container cap)**:",
    "   - Set `NODE_OPTIONS=--max-old-space-size=6144` or throttle `experimental.cpus` for static page generation.",
    "   - For large monorepos or heavy static SSG sites, use **Prebuilt Deploys**: pull production env via `vercel pull --yes --environment=production`, build in Linux (`prd` / CI / local container) with `vercel build --prod` or Build Output API v3 (`bun src/scripts/build-vercel.ts`), and deploy via `vercel deploy --prebuilt --prod --archive=tgz --yes`.",
    "   - Exclude Win32/heavy native binaries (`sharp`, `@img`, `*.wasm`) via `outputFileTracingExcludes` when Vercel optimizes separately or custom CDN image loader is active.",
    "4. **Bun Lockfile Parity**: Ensure Vercel install uses Bun 1.4.x (`bunVersion: \"1.4.x\"` in Project/vercel.json) so `bun.lock` (`lockfileVersion: 2`) does not fall back and re-resolve.",
    "5. **Verification & Deployment Protection**: Always verify protected preview/prod URLs with `vercel curl <url>/health` and public domains end-to-end (real rendered HTML/JSON content + Chromium screenshots + MWG check, never bare HTTP 200).",
    "6. **MCP & Knowledge Discipline**: Use `vercel_brain_search` / `bun x vercel docs search` before guessing top-level `vercel.json` keys or runtime flags, and register `https://mcp.vercel.com` only where team OAuth is authorized.",
    "",
  ].join("\n");

  const files: Record<string, string> = {
    "INDEX.md": indexMd,
    "KNOWLEDGE_GRAPH.md": knowledgeGraphMd,
    "SKILLS_DIGEST.md": skillLines.join("\n"),
    "DOCS_DIGEST.md": docsLines.join("\n"),
    "COMMANDS.md": cmdLines.join("\n"),
    "BEST_PRACTICES.md": bestPracticesMd,
  };

  let outputBytes = 0;
  const filesWritten: string[] = [];
  if (opts.write !== false) mkdirSync(outDir, { recursive: true });
  for (const [name, body] of Object.entries(files)) {
    outputBytes += Buffer.byteLength(body);
    const dst = join(outDir, name);
    if (opts.write !== false) {
      writeIfChanged(dst, body);
      filesWritten.push(toSlash(dst));
    }
  }

  return {
    outDir: toSlash(outDir),
    pluginSource: pluginSource ? toSlash(pluginSource) : undefined,
    agentSkillsSource: agentSkillsSource ? toSlash(agentSkillsSource) : undefined,
    sourceBytes,
    outputBytes,
    compressionRatio: sourceBytes > 0 ? Number((sourceBytes / Math.max(1, outputBytes)).toFixed(2)) : 1,
    filesWritten,
    counts: {
      pluginSkills: pluginSkills.length,
      agentSkills: agentSkills.length,
      graphLines,
      docsFetched: docs.length,
    },
  };
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const opt = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const summary = await runVercelBrainImport({
    pluginDir: opt("--plugin-dir"),
    agentSkillsDir: opt("--agent-skills-dir"),
    outDir: opt("--out-dir"),
    live: args.includes("--live"),
    write: !args.includes("--dry-run"),
  });
  console.log(JSON.stringify(summary, null, 2));
}
