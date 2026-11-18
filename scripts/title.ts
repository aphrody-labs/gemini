#!/usr/bin/env bun
// Terminal window title for Antigravity CLI (single plain line, zero ANSI per spec).
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

interface TitlePayload {
  cwd?: string;
  workspace?: { current_dir?: string; project_dir?: string };
  conversation_title?: string;
  agent_state?: string;
}

function branchOf(dir: string): string {
  for (let d = dir; ; d = dirname(d)) {
    const head = join(d, ".git", "HEAD");
    if (existsSync(head)) {
      const ref = readFileSync(head, "utf8").trim();
      return ref.startsWith("ref: refs/heads/")
        ? ref.slice(16)
        : ref.slice(0, 7);
    }
    if (dirname(d) === d) return "";
  }
}

let s: TitlePayload = {};
try {
  s = JSON.parse(await Bun.stdin.text()) as TitlePayload;
} catch {
  // Fallback when invoked empty.
}
const dir =
  s.workspace?.project_dir ??
  s.workspace?.current_dir ??
  s.cwd ??
  process.cwd();
const folder = basename(dir) || dir;
const branch = branchOf(dir);
const state = s.agent_state ? `[${s.agent_state}] ` : "";
const title = s.conversation_title ? ` - ${s.conversation_title}` : "";
process.stdout.write(
  `${state}agy ${folder}${branch ? ` (${branch})` : ""}${title}`.slice(0, 100),
);
