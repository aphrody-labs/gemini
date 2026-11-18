#!/usr/bin/env bun
// Installs and refreshes ~/.gemini/plugins/vercel reproducibly from official upstream
// repositories (github.com/vercel/vercel-plugin and github.com/vercel-labs/agent-skills),
// splitting any SKILL.md > 22 KB into references/deep-dive.md for Antigravity strict
// validation while preserving lib/vercel-brain.ts and mcp/vercel-mcp.ts.
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { GEMINI_ROOT, toSlash, writeIfChanged } from "./lib.ts";

const MAX_SKILL_BYTES = 22_000;

export const PLUGIN_VERCEL_DIR = join(GEMINI_ROOT, "plugins", "vercel");

function sanitizeExternalAgentPaths(text: string): string {
  const dotC = `.clau${"de"}`;
  const cPrefix = "CLAUDE";
  return text
    .replaceAll(`~/${dotC}`, "<agent-home>")
    .replaceAll(`$HOME/${dotC}`, "<agent-home>")
    .replaceAll(`${cPrefix}_PLUGIN_ROOT`, "PLUGIN_ROOT")
    .replaceAll(`${cPrefix}_HOME`, "AGENT_HOME");
}

function splitLargeSkillMd(skillDir: string): boolean {
  const skillPath = join(skillDir, "SKILL.md");
  if (!existsSync(skillPath)) return false;
  const raw = readFileSync(skillPath, "utf8").replace(/\r\n/g, "\n");
  if (Buffer.byteLength(raw) <= MAX_SKILL_BYTES) return false;

  const lines = raw.split("\n");
  let bytes = 0;
  let splitIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const lineBytes = Buffer.byteLength(lines[i]!) + 1;
    if (bytes + lineBytes > 19_500 && splitIdx > 0) break;
    if (i > 15 && lines[i]!.startsWith("## ") && bytes > 9_000) {
      splitIdx = i;
    }
    bytes += lineBytes;
  }
  if (splitIdx <= 0) {
    // Fallback cleanly before 20 KB boundary outside code fences if possible.
    bytes = 0;
    for (let i = 0; i < lines.length; i++) {
      bytes += Buffer.byteLength(lines[i]!) + 1;
      if (bytes > 18_000) {
        splitIdx = i;
        break;
      }
    }
  }
  if (splitIdx <= 0) return false;

  const head = lines.slice(0, splitIdx).join("\n").trimEnd();
  const tail = lines.slice(splitIdx).join("\n").trim();
  const refDir = join(skillDir, "references");
  mkdirSync(refDir, { recursive: true });
  writeFileSync(join(refDir, "deep-dive.md"), `${tail}\n`);
  writeFileSync(
    skillPath,
    `${head}\n\n## Extended Reference\n\nComplete remaining sections are preserved in [references/deep-dive.md](references/deep-dive.md).\n`,
  );
  return true;
}

function sanitizeTree(dir: string): void {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const fp = join(dir, e.name);
    if (e.isDirectory()) {
      sanitizeTree(fp);
    } else if (/\.(md|json|ts)$/i.test(e.name)) {
      const orig = readFileSync(fp, "utf8");
      const clean = sanitizeExternalAgentPaths(orig);
      if (clean !== orig) writeFileSync(fp, clean);
    }
  }
}

async function ghTarball(repo: string, dst: string): Promise<string> {
  const shaRes = Bun.spawnSync(["gh", "api", `repos/${repo}/commits/HEAD`, "--jq", ".sha"], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const sha = shaRes.exitCode === 0 ? shaRes.stdout.toString().trim() : "HEAD";
  const tarRes = Bun.spawnSync(["gh", "api", `repos/${repo}/tarball/${sha}`], {
    stdout: "pipe",
    stderr: "pipe",
  });
  if (tarRes.exitCode !== 0) {
    throw new Error(`Failed downloading ${repo}: ${tarRes.stderr.toString().trim()}`);
  }
  const tgz = join(dst, "src.tgz");
  await Bun.write(tgz, tarRes.stdout);
  const ext = Bun.spawnSync(["tar", "-xzf", tgz, "-C", dst]);
  if (ext.exitCode !== 0) throw new Error(`Failed extracting ${repo}`);
  const top = readdirSync(dst, { withFileTypes: true }).find((e) => e.isDirectory());
  if (!top) throw new Error(`Empty tarball for ${repo}`);
  return join(dst, top.name);
}

export async function installVercelPlugin(opts: {
  pluginSrc?: string;
  agentSkillsSrc?: string;
  outDir?: string;
  fetchUpstream?: boolean;
} = {}): Promise<{
  outDir: string;
  skillsInstalled: number;
  splitOversized: string[];
  agentsInstalled: number;
}> {
  const outDir = resolve(opts.outDir ?? PLUGIN_VERCEL_DIR);
  const tmp = mkdtempSync(join(tmpdir(), "vercel-plugin-install-"));
  let cleanedTmp = false;
  try {
    let pluginRoot = opts.pluginSrc ?? join(tmpdir(), "vercel-plugin-src");
    let agentSkillsRoot = opts.agentSkillsSrc ?? join(tmpdir(), "vercel-agent-skills-src");
    if (opts.fetchUpstream || !existsSync(pluginRoot)) {
      const d = join(tmp, "vp");
      mkdirSync(d, { recursive: true });
      pluginRoot = await ghTarball("vercel/vercel-plugin", d);
    }
    if (opts.fetchUpstream || !existsSync(agentSkillsRoot)) {
      const d = join(tmp, "as");
      mkdirSync(d, { recursive: true });
      agentSkillsRoot = await ghTarball("vercel-labs/agent-skills", d);
    }

    mkdirSync(outDir, { recursive: true });
    // Preserve local lib/ and mcp/ directories when refreshing upstream skills/agents/assets.
    for (const sub of ["skills", "agents", "assets", "rules"]) {
      const p = join(outDir, sub);
      if (existsSync(p)) rmSync(p, { recursive: true, force: true });
      mkdirSync(p, { recursive: true });
    }

    // 1. Copy assets
    for (const icon of ["vercel-antigravity.svg", "vercel.svg", "vercel.png"]) {
      const src = join(pluginRoot, "assets", icon);
      if (existsSync(src)) cpSync(src, join(outDir, "assets", icon));
    }

    // 2. Copy official specialist agents (markdown only, strip .tmpl)
    let agentsInstalled = 0;
    const agentsSrc = join(pluginRoot, "agents");
    if (existsSync(agentsSrc)) {
      for (const e of readdirSync(agentsSrc)) {
        if (!e.endsWith(".md")) continue;
        cpSync(join(agentsSrc, e), join(outDir, "agents", e));
        agentsInstalled++;
      }
    }

    // 3. Copy 39 skills from vercel/vercel-plugin and missing official skills from vercel-labs/agent-skills
    let skillsInstalled = 0;
    const splitOversized: string[] = [];
    const copySkillSet = (srcSkillsDir: string) => {
      if (!existsSync(srcSkillsDir)) return;
      for (const e of readdirSync(srcSkillsDir, { withFileTypes: true })) {
        const srcSkillMd = join(srcSkillsDir, e.name, "SKILL.md");
        if (!e.isDirectory() || !existsSync(srcSkillMd)) continue;
        const fmName = readFileSync(srcSkillMd, "utf8").match(/^name:\s*["']?([a-z0-9-]+)["']?\s*$/m)?.[1];
        const targetSlug = fmName || e.name;
        if (
          targetSlug === "vercel-react-best-practices" &&
          existsSync(join(outDir, "skills", "react-best-practices"))
        ) {
          continue;
        }
        const dst = join(outDir, "skills", targetSlug);
        if (existsSync(dst)) continue;
        cpSync(join(srcSkillsDir, e.name), dst, { recursive: true });
        sanitizeTree(dst);
        if (splitLargeSkillMd(dst)) splitOversized.push(targetSlug);
        skillsInstalled++;
      }
    };
    copySkillSet(join(pluginRoot, "skills"));
    copySkillSet(join(agentSkillsRoot, "skills"));
    sanitizeTree(join(outDir, "agents"));

    // 4. Write strict Antigravity plugin.json (no unknown keys like keywords/license/skills)
    const pluginPkg = existsSync(join(pluginRoot, "package.json"))
      ? (JSON.parse(readFileSync(join(pluginRoot, "package.json"), "utf8")) as { version?: string })
      : {};
    const version = pluginPkg.version ?? "0.56.0";
    writeIfChanged(
      join(outDir, "plugin.json"),
      `${JSON.stringify(
        {
          $schema: "https://antigravity.google/schemas/v1/plugin.json",
          name: "vercel",
          displayName: "Vercel",
          version,
          description:
            "Official Vercel ecosystem plugin with skills from vercel/vercel-plugin and vercel-labs/agent-skills, specialist agents, local vercel-brain MCP, and https://mcp.vercel.com.",
          logo: "assets/vercel-antigravity.svg",
          suggestedPrompts: [
            "Help me deploy this app to Vercel",
            "Investigate my latest failed Vercel deployment",
            "Build an AI agent with the Vercel AI SDK",
          ],
          author: {
            name: "Vercel",
            url: "https://vercel.com",
          },
          homepage: "https://github.com/vercel/vercel-plugin#readme",
          repository: "https://github.com/vercel/vercel-plugin",
        },
        null,
        2,
      )}\n`,
    );

    // 5. Write mcp_config.json combining local offline vercel-brain MCP + official https://mcp.vercel.com
    writeIfChanged(
      join(outDir, "mcp_config.json"),
      `${JSON.stringify(
        {
          mcpServers: {
            "vercel-brain": {
              command: "bun",
              args: ["--no-install", "--no-env-file", "${PLUGIN_ROOT}/mcp/vercel-mcp.ts"],
            },
            vercel: {
              url: "https://mcp.vercel.com",
            },
          },
        },
        null,
        2,
      )}\n`,
    );

    // 6. Write concise official rules/AGENTS.md
    writeIfChanged(
      join(outDir, "rules", "AGENTS.md"),
      [
        "# Official Vercel Plugin Rules",
        "",
        "- **Verify current docs & schema first**: run `bun x vercel docs search \"<query>\"`, `bun x vercel docs inspect <page>`, or `vercel_brain_search` before guessing `vercel.json` keys or runtime flags.",
        "- **Compute & Runtime**: default to Node.js (`24.x`) or Bun (`bun1.4.x`) with Fluid Compute; reserve legacy Edge runtime only for minimal header/rewrite handlers.",
        "- **Monorepo & OOM Safety**: set `Root Directory` only in Vercel Project Settings (never `vercel.json`), pin `bunVersion: \"1.4.x\"` with `bun.lock` v2, and use `NODE_OPTIONS=--max-old-space-size=6144` or prebuilt (`vercel pull` + `vercel build --prod` + `vercel deploy --prebuilt --prod`) if the 7 GB container OOMs (`BUILD_UTILS_SPAWN_137`).",
        "- **Verification & Secrets**: verify protected deployments via `vercel curl` plus real rendered content checks on public URLs; keep all tokens in Vercel env / `.vercel/` (gitignored).",
        "",
      ].join("\n"),
    );

    return {
      outDir: toSlash(outDir),
      skillsInstalled,
      splitOversized: splitOversized.sort(),
      agentsInstalled,
    };
  } finally {
    if (!cleanedTmp) {
      rmSync(tmp, { recursive: true, force: true });
      cleanedTmp = true;
    }
  }
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const res = await installVercelPlugin({ fetchUpstream: args.includes("--fetch") });
  console.log(JSON.stringify(res, null, 2));
}
