#!/usr/bin/env bun
// Copies the machine-specific Gemini files into the nested private repository at local/ and commits them when they changed.
//   bun scripts/local-sync.ts
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const local = join(root, "local");
if (!existsSync(join(local, ".git"))) (console.error("local/ is not a git repository (gemini-local)"), process.exit(1));
for (const rel of ["trustedFolders.json", "projects.json", "config/projects"]) {
  const from = join(root, rel);
  if (!existsSync(from)) continue;
  mkdirSync(dirname(join(local, rel)), { recursive: true });
  cpSync(from, join(local, rel), { recursive: true });
}
const git = (...a: string[]) => Bun.spawnSync(["git", "-C", local, ...a], { stdout: "pipe", stderr: "pipe" });
git("add", "-A");
if (git("diff", "--cached", "--quiet").exitCode === 0) console.log("nothing changed");
else (git("commit", "-q", "-m", "local: refresh machine-specific Gemini files"), git("push", "-q", "origin", "main"), console.log("committed"));
