#!/usr/bin/env bun
// Auto-updates the upstream skills vendored into plugins/aphrody/skills: each source is a GitHub repository whose
// `<dir>/<skill>/` folders are copied at the head commit of its default branch, with the upstream LICENSE and an
// UPSTREAM.md (repository, commit, license). The pinned commit per source lives in vendor-skills.lock.json, so a run
// without network keeps the current copy, and a run with network moves to the new head only when it changed.
//   bun scripts/vendor-skills.ts [--check]   (--check reports sources whose head moved, writes nothing)
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import merged from "./merged-skills.json" with { type: "json" };

export interface VendorSource {
  repo: string;
  dir: string;
  license: string;
}

/** Upstream skill collections vendored as-is (edit upstream, not the copies). */
export const SOURCES: VendorSource[] = [{ repo: "docker/skills", dir: "skills", license: "Apache-2.0" }];

/** Skills removed as duplicates of another skill; unify-plugins.ts never copies them back. */
export const SUPERSEDED: Record<string, string> = {
  ...Object.fromEntries(Object.entries(merged).map(([c, p]) => [c, `merged into the ${p} skill (references/${c}.md)`])),
  "vercel-react-best-practices": "react-best-practices (now provided by official plugins/vercel/skills)",
  "ai-sdk": "provided by official ~/.gemini/plugins/vercel/skills/ai-sdk",
  auth: "provided by official ~/.gemini/plugins/vercel/skills/auth",
  "chat-sdk": "provided by official ~/.gemini/plugins/vercel/skills/chat-sdk",
  "react-best-practices": "provided by official ~/.gemini/plugins/vercel/skills/react-best-practices",
  ...Object.fromEntries(
    [
      "agents-sdk",
      "basin",
      "cf-cli",
      "cloudflare",
      "cloudflare-app-bootstrap",
      "cloudflare-email-service",
      "cloudflare-one",
      "cloudflare-one-migrations",
      "durable-objects",
      "frameworks-on-cloudflare",
      "gateway-workers",
      "k2",
      "nextjs-on-cloudflare",
      "sandbox-migrate-to-next",
      "sandbox-next",
      "sandbox-stable",
      "turnstile-spin",
      "web-perf",
      "workers-best-practices",
      "workers-development",
      "workers-profiling",
      "wrangler",
    ].map((name) => [name, "provided by the official cloudflare/skills plugin (~/.gemini/plugins/cloudflare/skills)"]),
  ),
  "cloudflare-platform": "invented Aphrody skill; replaced by the official cloudflare/skills plugin",
  "cloudflare-security-audit": "invented Aphrody skill; replaced by the official cloudflare/skills plugin",
  "ay-cf-finops-infra": "invented Aphrody skill; replaced by the official cloudflare/skills plugin",
  "agy-knlogie": "migrated and renamed to unified ~/.gemini/plugins/fw/skills/agy-knowledge",
  "agy-knowledge": "migrated to unified ~/.gemini/plugins/fw/skills/agy-knowledge",
  learn: "migrated to unified ~/.gemini/plugins/fw/skills/learn",
  "reverse-engineer-anything": "migrated to unified ~/.gemini/plugins/fw/skills/reverse-engineer-anything",
  "binary-analysis": "migrated to unified ~/.gemini/plugins/fw/skills/binary-analysis",
  "tree-sitter": "migrated to unified ~/.gemini/plugins/fw/skills/tree-sitter",
  "static-recompile": "migrated to unified ~/.gemini/plugins/fw/skills/static-recompile",
};

const ROOT = join(import.meta.dir, "..");
export const SKILLS_DIR = join(ROOT, "plugins", "aphrody", "skills");
const LOCK = join(import.meta.dir, "vendor-skills.lock.json");

async function gh(args: string[]): Promise<{ ok: boolean; out: Uint8Array }> {
  if (!Bun.which("gh")) return { ok: false, out: new Uint8Array() };
  const p = Bun.spawn(["gh", ...args], { stdout: "pipe", stderr: "ignore" });
  const out = new Uint8Array(await new Response(p.stdout).arrayBuffer());
  return { ok: (await p.exited) === 0, out };
}

export async function headCommit(repo: string): Promise<string | null> {
  const r = await gh(["api", `repos/${repo}/commits/HEAD`, "--jq", ".sha"]);
  const sha = new TextDecoder().decode(r.out).trim();
  return r.ok && /^[0-9a-f]{40}$/.test(sha) ? sha : null;
}

async function readLock(): Promise<Record<string, string>> {
  return existsSync(LOCK) ? ((await Bun.file(LOCK).json()) as Record<string, string>) : {};
}

export async function vendor(src: VendorSource, sha: string, skillsDir = SKILLS_DIR): Promise<string[]> {
  const tmp = mkdtempSync(join(tmpdir(), "vendor-skills-"));
  try {
    const tar = await gh(["api", `repos/${src.repo}/tarball/${sha}`]);
    if (!tar.ok) throw new Error(`tarball ${src.repo}@${sha}`);
    await Bun.write(join(tmp, "src.tgz"), tar.out);
    const x = Bun.spawnSync(["tar", "-xzf", join(tmp, "src.tgz"), "-C", tmp]);
    if (x.exitCode !== 0) throw new Error(`untar ${src.repo}`);
    const top = readdirSync(tmp, { withFileTypes: true }).find((e) => e.isDirectory());
    if (!top) throw new Error(`empty tarball ${src.repo}`);
    const base = join(tmp, top.name);
    const from = join(base, src.dir);
    const names: string[] = [];
    mkdirSync(skillsDir, { recursive: true });
    for (const e of readdirSync(from, { withFileTypes: true })) {
      if (!e.isDirectory() || !existsSync(join(from, e.name, "SKILL.md")) || e.name in SUPERSEDED) continue;
      const dst = join(skillsDir, e.name);
      rmSync(dst, { recursive: true, force: true });
      cpSync(join(from, e.name), dst, { recursive: true });
      if (existsSync(join(base, "LICENSE"))) cpSync(join(base, "LICENSE"), join(dst, "LICENSE"));
      writeFileSync(
        join(dst, "UPSTREAM.md"),
        `Vendored from https://github.com/${src.repo}/tree/${sha}/${src.dir}/${e.name} (${src.license}). ` +
          "Refreshed by scripts/vendor-skills.ts; edit upstream, not here.\n",
      );
      names.push(e.name);
    }
    return names;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** Removes superseded duplicates from the plugin. */
export function dropSuperseded(skillsDir = SKILLS_DIR): string[] {
  const dropped: string[] = [];
  for (const name of Object.keys(SUPERSEDED))
    if (existsSync(join(skillsDir, name))) {
      rmSync(join(skillsDir, name), { recursive: true, force: true });
      dropped.push(name);
    }
  return dropped;
}

export async function updateVendoredSkills(check = false): Promise<Record<string, unknown>> {
  const lock = await readLock();
  const report: Record<string, unknown> = { dropped: check ? [] : dropSuperseded() };
  for (const src of SOURCES) {
    const head = await headCommit(src.repo);
    if (!head) {
      report[src.repo] = { status: "offline", pinned: lock[src.repo] ?? null };
      continue;
    }
    if (lock[src.repo] === head) {
      report[src.repo] = { status: "current", sha: head.slice(0, 12) };
      continue;
    }
    if (check) {
      report[src.repo] = { status: "behind", pinned: lock[src.repo]?.slice(0, 12) ?? null, head: head.slice(0, 12) };
      continue;
    }
    const skills = await vendor(src, head);
    lock[src.repo] = head;
    report[src.repo] = { status: "updated", sha: head.slice(0, 12), skills: skills.length };
  }
  if (!check) writeFileSync(LOCK, `${JSON.stringify(lock, null, 2)}\n`);
  return report;
}

if (import.meta.main) console.log(JSON.stringify(await updateVendoredSkills(Bun.argv.includes("--check"))));
