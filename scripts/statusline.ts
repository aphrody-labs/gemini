#!/usr/bin/env bun
// Status line for Antigravity CLI: model, workspace, branch, mode, context %, cost. Zero subprocesses.
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

interface Session {
  model?: { display_name?: string; id?: string; effort?: string } | null;
  workspace?: { current_dir?: string; project_dir?: string };
  cwd?: string;
  agent?: { name?: string };
  agent_state?: string;
  cycle_mode?: string;
  sandbox?: { enabled?: boolean };
  task_count?: number;
  pending_input_count?: number;
  context_window?: { used_percentage?: number | null };
  cost?: { total_cost_usd?: number; total_usd?: number };
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

let s: Session = {};
try {
  s = JSON.parse(await Bun.stdin.text()) as Session;
} catch {
  // Empty/invalid stdin still emits a minimal line.
}
const dir =
  s.workspace?.project_dir ??
  s.workspace?.current_dir ??
  s.cwd ??
  process.cwd();
const used = s.context_window?.used_percentage;
const cost = s.cost?.total_usd ?? s.cost?.total_cost_usd;
const branch = branchOf(dir);
const parts = [
  s.model?.display_name ?? s.model?.id ?? "agy",
  `${basename(dir) || dir}${branch ? ` (${branch})` : ""}`,
  s.cycle_mode ? `[${s.cycle_mode}${s.sandbox?.enabled ? "+sbx" : ""}]` : "",
  s.agent?.name ? `@${s.agent.name}` : "",
  s.agent_state && s.agent_state !== "idle" ? s.agent_state : "",
  s.task_count ? `${s.task_count}t` : "",
  s.pending_input_count ? `${s.pending_input_count}q` : "",
  used == null ? "" : `ctx ${Math.round(used)}%`,
  cost ? `$${cost.toFixed(2)}` : "",
];
process.stdout.write(parts.filter(Boolean).join(" | "));
