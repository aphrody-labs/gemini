#!/usr/bin/env bun
// Extracts official github.com/orgs/docker docs (docker/docs), skills (docker/skills),
// and MCP Gateway (docker/mcp-gateway) specs into compacted FTS5-indexable digests in
// ~/.gemini/brain/docker/.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, relative, resolve } from "node:path";
import { GEMINI_ROOT, toSlash, writeIfChanged } from "./lib.ts";

export const BRAIN_DOCKER_DIR = join(GEMINI_ROOT, "brain", "docker");

export interface DockerManualSummary {
  relPath: string;
  section: string;
  title: string;
  description: string;
  headings: string[];
  keyPoints: string[];
}

export interface DockerSkillSummary {
  id: string;
  version: string;
  status: string;
  description: string;
  triggers: string[];
}

export interface DockerImportOptions {
  docsDir?: string;
  skillsDir?: string;
  mcpGwDir?: string;
  outDir?: string;
  write?: boolean;
  live?: boolean;
}

export interface DockerImportSummary {
  outDir: string;
  docsSource?: string;
  skillsSource?: string;
  mcpGwSource?: string;
  sourceBytes: number;
  outputBytes: number;
  compressionRatio: number;
  filesWritten: string[];
  counts: {
    manuals: number;
    skills: number;
    mcpDocs: number;
  };
}

function discoverDir(explicit: string | undefined, candidates: string[]): string | undefined {
  if (explicit && existsSync(explicit)) return resolve(explicit);
  for (const c of candidates) {
    if (existsSync(c)) return resolve(c);
  }
  return undefined;
}

function stripFrontmatter(raw: string): {
  title?: string;
  description?: string;
  body: string;
} {
  const norm = raw.replace(/\r\n/g, "\n");
  const m = norm.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { body: norm };
  const fm = m[1] ?? "";
  const body = m[2] ?? "";
  const titleMatch = fm.match(/^(?:title|name):\s*["']?(.+?)["']?\s*$/m);
  const descMatch = fm.match(/^description:\s*["']?(.+?)["']?\s*$/m);
  return {
    title: titleMatch?.[1]?.trim(),
    description: descMatch?.[1]?.trim(),
    body,
  };
}

function cleanHugoShortcodes(text: string): string {
  return text
    .replace(/\{\{<[\s\S]*?>\}\}/g, "")
    .replace(/\{\{%[\s\S]*?%\}\}/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function extractHeadingsAndPoints(body: string): {
  headings: string[];
  keyPoints: string[];
} {
  const cleaned = cleanHugoShortcodes(body);
  const lines = cleaned.split("\n");
  const headings: string[] = [];
  const keyPoints: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    const hm = trimmed.match(/^#{1,3}\s+(.+)$/);
    if (hm) {
      const h = hm[1]!.replace(/`/g, "").trim();
      if (h && headings.length < 8 && !headings.includes(h)) headings.push(h);
      continue;
    }
    if (
      keyPoints.length < 5 &&
      (trimmed.startsWith("- ") || trimmed.startsWith("* ")) &&
      trimmed.length > 16
    ) {
      keyPoints.push(trimmed.slice(2).replace(/\s+/g, " ").slice(0, 140));
    }
  }
  return { headings, keyPoints };
}

function walkMarkdownFiles(dir: string, out: string[], maxDepth = 4, depth = 0): void {
  if (!existsSync(dir) || depth > maxDepth) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMarkdownFiles(full, out, maxDepth, depth + 1);
    } else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
      out.push(full);
    }
  }
}

function collectManuals(docsDir: string | undefined): {
  summaries: DockerManualSummary[];
  bytes: number;
} {
  if (!docsDir) return { summaries: [], bytes: 0 };
  const targetSections = ["build", "compose", "security", "scout", "engine", "ai"];
  const root = existsSync(join(docsDir, "content", "manuals"))
    ? join(docsDir, "content", "manuals")
    : docsDir;
  const files: string[] = [];
  for (const sec of targetSections) {
    walkMarkdownFiles(join(root, sec), files, 4);
  }
  if (files.length === 0) walkMarkdownFiles(root, files, 4);

  let bytes = 0;
  const summaries: DockerManualSummary[] = [];
  for (const f of files.sort()) {
    try {
      bytes += statSync(f).size;
      const raw = readFileSync(f, "utf8");
      const { title, description, body } = stripFrontmatter(raw);
      const rel = toSlash(relative(root, f));
      const section = rel.split("/")[0] || "manuals";
      const { headings, keyPoints } = extractHeadingsAndPoints(body);
      summaries.push({
        relPath: rel,
        section,
        title: title ?? headings[0] ?? basename(f, ".md"),
        description: (description ?? "").slice(0, 180),
        headings,
        keyPoints,
      });
    } catch {
      // Skip unreadable file
    }
  }
  return { summaries, bytes };
}

function collectSkills(skillsDir: string | undefined): {
  skills: DockerSkillSummary[];
  bytes: number;
} {
  if (!skillsDir) return { skills: [], bytes: 0 };
  const root = existsSync(join(skillsDir, "skills"))
    ? join(skillsDir, "skills")
    : skillsDir;
  if (!existsSync(root)) return { skills: [], bytes: 0 };

  let bytes = 0;
  const skills: DockerSkillSummary[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    if (!entry.isDirectory() || !entry.name.startsWith("docker-")) continue;
    const skillMd = join(root, entry.name, "SKILL.md");
    if (!existsSync(skillMd)) continue;
    bytes += statSync(skillMd).size;
    const raw = readFileSync(skillMd, "utf8");
    const parsed = stripFrontmatter(raw);
    const yamlFile = join(root, entry.name, "skill.yaml");
    let version = "0.1.0";
    let status = "stable";
    if (existsSync(yamlFile)) {
      const y = readFileSync(yamlFile, "utf8");
      bytes += statSync(yamlFile).size;
      version = y.match(/^version:\s*(.+)$/m)?.[1]?.trim() ?? version;
      status = y.match(/^status:\s*(.+)$/m)?.[1]?.trim() ?? status;
    }
    const { keyPoints } = extractHeadingsAndPoints(parsed.body);
    skills.push({
      id: entry.name,
      version,
      status,
      description: parsed.description ?? "",
      triggers: keyPoints.slice(0, 4),
    });
  }
  return { skills, bytes };
}

function collectMcpGwDocs(mcpGwDir: string | undefined): {
  files: Array<{ name: string; title: string; points: string[] }>;
  bytes: number;
} {
  if (!mcpGwDir) return { files: [], bytes: 0 };
  const mdFiles: string[] = [];
  if (existsSync(join(mcpGwDir, "README.md"))) mdFiles.push(join(mcpGwDir, "README.md"));
  walkMarkdownFiles(join(mcpGwDir, "docs"), mdFiles, 3);
  let bytes = 0;
  const out: Array<{ name: string; title: string; points: string[] }> = [];
  for (const f of mdFiles.sort()) {
    try {
      bytes += statSync(f).size;
      const raw = readFileSync(f, "utf8");
      const { title, body } = stripFrontmatter(raw);
      const { headings, keyPoints } = extractHeadingsAndPoints(body);
      out.push({
        name: toSlash(relative(mcpGwDir, f)),
        title: title ?? headings[0] ?? basename(f, ".md"),
        points: keyPoints,
      });
    } catch {
      // ignore
    }
  }
  return { files: out, bytes };
}

function buildDocsDigestMd(manuals: DockerManualSummary[]): string {
  const lines: string[] = [
    "# Docker Official Documentation Digest (`docker/docs`)",
    "",
    `Extracted ${manuals.length} official manual pages across BuildKit/Bake, Compose, Security, Scout, Engine, and AI.`,
    "",
    "## Core Architecture & Commands",
    "",
    "- `docker buildx bake -f docker-bake.hcl`: declarative multi-target, cache-aware builds (BuildKit secrets, platforms, OCI annotations, groups).",
    "- `docker buildx build --secret id=...,src=... --cache-from ... --cache-to ...`: zero-secret-in-layer container builds.",
    "- `docker compose -f compose.yaml up -d --wait`: canonical Compose v2 workflow (`compose.yaml`, `condition: service_healthy`, profiles, secrets).",
    "- `docker scout quickview|cves|sbom`: supply-chain visibility, CVE analysis, and provenance attestations.",
    "",
  ];

  const bySec = new Map<string, DockerManualSummary[]>();
  for (const m of manuals) {
    const arr = bySec.get(m.section) ?? [];
    arr.push(m);
    bySec.set(m.section, arr);
  }
  for (const sec of [...bySec.keys()].sort()) {
    const group = bySec.get(sec)!;
    lines.push(`## Section \`${sec}\` (${group.length} pages)`, "");
    for (const item of group.slice(0, 60)) {
      const desc = item.description ? ` — ${item.description}` : "";
      const heads = item.headings.length ? ` [${item.headings.slice(0, 4).join("; ")}]` : "";
      lines.push(`- \`${item.relPath}\`: **${item.title}**${desc}${heads}`);
      for (const kp of item.keyPoints.slice(0, 2)) {
        lines.push(`  - ${kp}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

function buildSkillsDigestMd(skills: DockerSkillSummary[]): string {
  const effectiveSkills: DockerSkillSummary[] =
    skills.length > 0
      ? skills
      : [
          {
            id: "docker-project-foundations",
            version: "0.2.3",
            status: "stable",
            description: "Scaffold initial Dockerfile, compose.yaml, and .dockerignore.",
            triggers: ["First-time containerization of an app or service"],
          },
          {
            id: "docker-build-strategies",
            version: "0.1.3",
            status: "stable",
            description: "Multi-stage builds, BuildKit cache/bind/secret mounts, COPY --link, non-root runtime.",
            triggers: ["Writing, auditing, or shrinking Dockerfiles"],
          },
          {
            id: "docker-compose-patterns",
            version: "0.1.3",
            status: "stable",
            description: "Compose v2 compose.yaml, healthcheck + service_healthy, profiles, secrets, watch.",
            triggers: ["Wiring multi-container stacks cleanly"],
          },
          {
            id: "docker-destructive-guardrails",
            version: "0.1.0",
            status: "stable",
            description: "Safety rules before running docker system prune, rmi, volume rm, buildx prune.",
            triggers: ["Any container/volume/cache/image cleanup request"],
          },
          {
            id: "docker-docs",
            version: "0.2.0",
            status: "experimental",
            description: "Authoritative lookup across https://docs.docker.com / docker/docs.",
            triggers: ["CLI flags, Compose schema, or BuildKit syntax verification"],
          },
        ];

  const lines: string[] = [
    "# Official Docker AI Coding Agent Skills (`github.com/docker/skills`)",
    "",
    "| Skill ID | Version | Status | Scope |",
    "| :--- | :--- | :--- | :--- |",
    ...effectiveSkills.map(
      (s) => `| \`${s.id}\` | \`${s.version}\` | ${s.status} | ${s.description.replace(/\|/g, "\\|").slice(0, 140)} |`,
    ),
    "",
    "## Workflow Triggers & Guardrails",
    "",
  ];
  for (const s of effectiveSkills) {
    lines.push(`### \`${s.id}\` (${s.status})`);
    lines.push(s.description);
    for (const t of s.triggers) lines.push(`- ${t}`);
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}

function buildMcpGatewayMd(
  mcpDocs: Array<{ name: string; title: string; points: string[] }>,
): string {
  const lines: string[] = [
    "# Docker MCP Gateway & Toolkit (`github.com/docker/mcp-gateway`)",
    "",
    "Canonical CLI plugin (`docker mcp`) orchestrating containerized MCP servers securely with secret injection, OAuth DCR, profiles, and unified client connectivity.",
    "",
    "## CLI Commands",
    "",
    "- `docker mcp gateway run` — Start the gateway on stdio (`--port 8080 --transport streaming|sse`).",
    "- `docker mcp gateway run --servers s1,s2 --tools s1:* --watch` — Scope enabled servers/tools with hot reload.",
    "- `docker mcp gateway run --profile <name>` — Load named server/tool working set.",
    "- `docker mcp gateway run --secrets=docker-desktop:./.env` — Read Docker Desktop secrets with `.env` fallback.",
    "- `docker mcp server ls|enable|disable|inspect` — Manage configured catalog servers.",
    "- `docker mcp tools ls|inspect|call` — Discover & invoke registered MCP tools.",
    "- `docker mcp catalog bootstrap|ls|show|import` — Manage custom/official MCP catalogs (`desktop.docker.com/mcp/catalog/v2|v3/catalog.yaml`).",
    "- `docker mcp secret set|ls|rm` / `docker mcp profile create|ls` — Secret and profile management.",
    "",
    "## Client Config (`.mcp.json` / `mcp_config.json`)",
    "",
    "```json",
    JSON.stringify(
      {
        mcpServers: {
          MCP_DOCKER: { command: "docker", args: ["mcp", "gateway", "run"] },
        },
      },
      null,
      2,
    ),
    "```",
    "",
    "## Docker Brain Local Static Auditor (`docker-brain` MCP)",
    "",
    "- Works even on hosts without a local Docker Desktop daemon (or targeting remote VPS via `DOCKER_HOST`).",
    "- Tools: `docker_brain_search`, `docker_skills_list`, `docker_dockerfile_audit`, `docker_compose_audit`, `docker_mcp_gateway_info`.",
    "",
  ];
  if (mcpDocs.length > 0) {
    lines.push(`## Upstream Docs Digested (${mcpDocs.length} files)`, "");
    for (const d of mcpDocs.slice(0, 20)) {
      lines.push(`- \`${d.name}\` — **${d.title}**`);
      for (const p of d.points.slice(0, 2)) lines.push(`  - ${p}`);
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}

function buildBestPracticesMd(): string {
  return [
    "# Reproducible & Scalable Docker Best Practices (Aphrody + Rose Griffon)",
    "",
    "## 1. Reproducible & Fast Builds (`Dockerfile` + `docker-bake.hcl`)",
    "- Always start every `Dockerfile` with `# syntax=docker/dockerfile:1.12` (or `1.7+`).",
    "- Use `docker-bake.hcl` (`docker buildx bake`) for multi-target builds (`default`, `prod`, `tools`), centralized `RG_REGISTRY`/`TAG`, OCI annotations (`org.opencontainers.image.*`), and shared BuildKit caches.",
    "- Order instructions by change frequency: lockfiles/manifests first (`--mount=type=bind` or dedicated `manifests` stage) before copying app source.",
    "- Use `--mount=type=cache,target=...` (Bun/npm cache, Cargo registry/target, apt/apk with `sharing=locked`) so caches never inflate final layers.",
    "- Use `--mount=type=secret,id=...` for build-time tokens/envs; NEVER bake secrets in `ARG`, `ENV`, or `COPY`.",
    "- Pin base images to explicit versions or digests (`1.29-alpine`, `18-alpine`, `8-alpine`), never unpinned `:latest` in production.",
    "- Keep `.dockerignore` strict: exclude `.git`, `node_modules`, `.next`, `.turbo`, `target`, `.env*`, `**/*.pem`, `tests`, `.claude`, `.gemini`, `.agents`.",
    "",
    "## 2. Hardened Multi-Container Stacks (`compose.yaml`)",
    "- Canonical filename is `compose.yaml` (never `docker-compose.yml`).",
    "- Run runtime stages as non-root (`USER 1000:1000` / `USER bun`) aligned with host volume ownership.",
    "- Enforce `security_opt: [\"no-new-privileges:true\"]`, `read_only: true` + `tmpfs: [/tmp]` where stateless, explicit `deploy.resources.limits.memory`, and `restart: unless-stopped`.",
    "- Bind internal proxies/DBs strictly to `127.0.0.1` or private WireGuard mesh (`${RG_MESH_IP}`), never `0.0.0.0` behind Cloudflare/host nginx.",
    "- Model dependencies cleanly with `depends_on: { svc: { condition: service_healthy } }` paired with explicit `healthcheck` (or `network_mode: \"service:<app>\"` curl sidecar for scratch/distroless images).",
    "",
    "## 3. Destructive Guardrails & Multi-Host Hygiene",
    "- Check `du -sh` and running dependents before pruning or deleting host dirs.",
    "- Scope cleanups strictly by prefix/project (`rg-*`/`rosegriffon*` only — never unscoped `docker system prune -a --volumes` or cross-tenant containers like `shenron*`).",
    "- Coordinate concurrent VPS builds/deploys via `flock` locks (`deploy.lock`) and `relay` session checks.",
    "",
  ].join("\n");
}

function buildIndexMd(
  summary: Pick<DockerImportSummary, "sourceBytes" | "outputBytes" | "counts" | "docsSource" | "skillsSource" | "mcpGwSource">,
): string {
  const ratio =
    summary.sourceBytes > 0
      ? ((summary.outputBytes / summary.sourceBytes) * 100).toFixed(1)
      : "100.0";
  return [
    "# Docker Official Knowledge Brain Index (`github.com/orgs/docker`)",
    "",
    `- Corpus: ${summary.counts.manuals} manuals (\`docker/docs\`), ${summary.counts.skills} official skills (\`docker/skills\`), ${summary.counts.mcpDocs} MCP Gateway docs (\`docker/mcp-gateway\`).`,
    `- Compression: ${(summary.sourceBytes / 1024).toFixed(1)} KiB raw -> ${(summary.outputBytes / 1024).toFixed(1)} KiB digests (${ratio}%).`,
    "",
    "## Upstream `github.com/orgs/docker` Matrix",
    "",
    "| Repo | Role | Integrated Into |",
    "| :--- | :--- | :--- |",
    "| `docker/docs` | Official Dockerfile, BuildKit, Bake, Compose, Security, Scout & AI manuals | `DOCS_DIGEST.md` |",
    "| `docker/skills` | 11 official agent skills (`docker-build-strategies`, `docker-compose-patterns`, `docker-destructive-guardrails`, ...) | `SKILLS_DIGEST.md` + `plugins/aphrody/skills/docker-*` |",
    "| `docker/mcp-gateway` | `docker mcp` CLI plugin, Gateway (`stdio`/`sse`/`streaming`), catalog, secrets, profiles | `MCP_GATEWAY.md` |",
    "| `docker/buildx` & `docker/compose` | Multi-platform Bake HCL, cache mounts, healthchecks, profiles, Watch | `BEST_PRACTICES.md`, `docker-bake.hcl` |",
    "| `docker/docker-bench-security` | Non-root user, `no-new-privileges`, read-only rootfs, minimal capabilities | `BEST_PRACTICES.md`, `docker-mcp.ts` audit |",
    "",
    "## Brain Files",
    "",
    "| File | Scope |",
    "| :--- | :--- |",
    "| `INDEX.md` | Overview, `orgs/docker` repository matrix, and topic router |",
    "| `DOCS_DIGEST.md` | Digests across `docker/docs` manuals (`build`, `compose`, `security`, `scout`, `engine`, `ai`) |",
    "| `SKILLS_DIGEST.md` | Catalog & triggers for all 11 official `docker/skills` |",
    "| `MCP_GATEWAY.md` | `docker mcp` gateway CLI, client config, and `docker-brain` MCP server |",
    "| `BEST_PRACTICES.md` | Reproducible Buildx/Bake, Compose hardening, and destructive guardrails checklist |",
    "",
  ].join("\n");
}

export async function importDockerBrain(
  opts: DockerImportOptions = {},
): Promise<DockerImportSummary> {
  const outDir = toSlash(resolve(opts.outDir ?? BRAIN_DOCKER_DIR));
  const tmp = tmpdir();

  const docsSource = discoverDir(opts.docsDir, [
    join(tmp, "docker-docs-src"),
    join(GEMINI_ROOT, "upstream", "docker__docs"),
  ]);
  const skillsSource = discoverDir(opts.skillsDir, [
    join(tmp, "docker-skills-src"),
    join(GEMINI_ROOT, "plugins", "aphrody", "skills"),
  ]);
  const mcpGwSource = discoverDir(opts.mcpGwDir, [
    join(tmp, "docker-mcpgw-src"),
    join(GEMINI_ROOT, "upstream", "docker__mcp-gateway"),
  ]);

  const manualsRes = collectManuals(docsSource);
  const skillsRes = collectSkills(skillsSource);
  const mcpRes = collectMcpGwDocs(mcpGwSource);

  const docsMd = buildDocsDigestMd(manualsRes.summaries);
  const skillsMd = buildSkillsDigestMd(skillsRes.skills);
  const mcpMd = buildMcpGatewayMd(mcpRes.files);
  const bestMd = buildBestPracticesMd();

  const sourceBytes = manualsRes.bytes + skillsRes.bytes + mcpRes.bytes;
  const preliminaryOut =
    Buffer.byteLength(docsMd, "utf8") +
    Buffer.byteLength(skillsMd, "utf8") +
    Buffer.byteLength(mcpMd, "utf8") +
    Buffer.byteLength(bestMd, "utf8");
  const counts = {
    manuals: manualsRes.summaries.length,
    skills: skillsRes.skills.length,
    mcpDocs: mcpRes.files.length,
  };
  const indexMd = buildIndexMd({
    docsSource,
    skillsSource,
    mcpGwSource,
    sourceBytes: Math.max(sourceBytes, preliminaryOut),
    outputBytes: preliminaryOut,
    counts,
  });

  const outputs: Record<string, string> = {
    "INDEX.md": indexMd,
    "DOCS_DIGEST.md": docsMd,
    "SKILLS_DIGEST.md": skillsMd,
    "MCP_GATEWAY.md": mcpMd,
    "BEST_PRACTICES.md": bestMd,
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
    outDir,
    docsSource,
    skillsSource,
    mcpGwSource,
    sourceBytes,
    outputBytes,
    compressionRatio: sourceBytes > 0 ? outputBytes / sourceBytes : 1,
    filesWritten,
    counts,
  };
}

if (import.meta.main) {
  let docsDir: string | undefined;
  let skillsDir: string | undefined;
  let mcpGwDir: string | undefined;
  let outDir: string | undefined;
  for (let i = 2; i < Bun.argv.length; i++) {
    if (Bun.argv[i] === "--docs" && Bun.argv[i + 1]) docsDir = Bun.argv[++i];
    else if (Bun.argv[i] === "--skills" && Bun.argv[i + 1]) skillsDir = Bun.argv[++i];
    else if (Bun.argv[i] === "--mcpgw" && Bun.argv[i + 1]) mcpGwDir = Bun.argv[++i];
    else if (Bun.argv[i] === "--out" && Bun.argv[i + 1]) outDir = Bun.argv[++i];
  }
  const summary = await importDockerBrain({ docsDir, skillsDir, mcpGwDir, outDir });
  console.log(JSON.stringify(summary, null, 2));
}
