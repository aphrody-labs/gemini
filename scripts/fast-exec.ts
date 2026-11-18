#!/usr/bin/env bun
// Unified non-blocking PreToolUse hook for run_command / run_shell_command:
// 1. Rewrites Node/npm/yarn/pnpm to Bun-native commands.
// 2. Auto-backgrounds heavy build/test/clone commands (WaitMsBeforeAsync: 1500 for agy).
import {
  allowPreTool,
  detectHarness,
  extractCommand,
  extractCwd,
  extractToolArgs,
  extractToolName,
  readHookEvent,
} from "./lib.ts";
import { hasAphrodyBun, isBunCheckout, rewriteCommand } from "./rewrite.ts";

const HEAVY_RE =
  /\b(cargo\s+(build|test|check|clippy|doc|bench)|bun\s+(test|build|x\b)|rustc\b|autoninja|ninja\b|cmake\s+--build|gradle\w*\b|docker\s+(build|compose)|pytest\b|git\s+(clone|fetch\s+--all))\b/;

const harness = detectHarness(Bun.argv[2]);
const event = await readHookEvent();
if (!event) {
  allowPreTool(harness);
  process.exit(0);
}

const tool = extractToolName(event);
const input = extractToolArgs(event);
const cmd = extractCommand(event);
const isShell =
  tool === "run_command" || tool === "run_shell_command" || tool === "Bash" || tool === "";

if (!isShell || !cmd) {
  allowPreTool(harness);
  process.exit(0);
}

const cmdKey =
  typeof input.CommandLine === "string"
    ? "CommandLine"
    : typeof input.command === "string"
      ? "command"
      : "cmd";

const rewritten = rewriteCommand(cmd, {
  bunCheckout: isBunCheckout(extractCwd(event)),
  aphrody: hasAphrodyBun(),
});
const finalCmd = rewritten?.command ?? cmd;
const updated: Record<string, unknown> = { ...input };
let changed = false;
const notes: string[] = [];

if (rewritten) {
  updated[cmdKey] = rewritten.command;
  changed = true;
  notes.push(`Bun rewrite: ${rewritten.changes.join(", ")}`);
}

if (HEAVY_RE.test(finalCmd) && harness === "agy") {
  const waitMs =
    typeof input.WaitMsBeforeAsync === "number" ? input.WaitMsBeforeAsync : 0;
  if (input.IsDaemon !== true && (waitMs === 0 || waitMs > 1500)) {
    updated.WaitMsBeforeAsync = 1500;
    changed = true;
  }
}

if (!changed) {
  allowPreTool(harness);
} else {
  allowPreTool(harness, updated, notes.length ? notes.join("; ") : undefined);
}
