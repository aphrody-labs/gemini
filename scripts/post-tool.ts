#!/usr/bin/env bun
// Unified PostToolUse hook: fast TypeScript check on edited TS files + autonomous learning capture.
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
  detectHarness,
  emitContext,
  extractFilePath,
  readHookEvent,
  writeEmpty,
} from "./lib.ts";
import { recordEvent } from "./learn.ts";

const harness = detectHarness(Bun.argv[2]);
const event = await readHookEvent();
if (!event) {
  writeEmpty();
  process.exit(0);
}

recordEvent(event, harness);

const filePath = extractFilePath(event);
if (
  !filePath ||
  !/\.(ts|tsx|mts|cts)$/i.test(filePath) ||
  /\/(third_party|node_modules)\//i.test(filePath.replaceAll("\\", "/"))
) {
  writeEmpty();
  process.exit(0);
}

function findTsconfig(startFile: string): string | null {
  let dir = dirname(resolve(startFile));
  for (let i = 0; i < 6; i++) {
    const cfg = join(dir, "tsconfig.json");
    if (existsSync(cfg)) return cfg;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const tsconfig = findTsconfig(filePath);
if (!tsconfig) {
  writeEmpty();
  process.exit(0);
}

const hasBunCheck =
  Bun.spawnSync([process.execPath, "check", "--no-script", "--help"], {
    stdout: "ignore",
    stderr: "ignore",
    stdin: "ignore",
  }).exitCode === 0;

if (!hasBunCheck) {
  writeEmpty();
  process.exit(0);
}

const proc = Bun.spawn(
  [process.execPath, "check", "--no-script", "--no-pretty", filePath],
  {
    cwd: dirname(tsconfig),
    stdout: "pipe",
    stderr: "pipe",
    stdin: "ignore",
  },
);
const timer = setTimeout(() => {
  try {
    proc.kill();
  } catch {
    // Already exited.
  }
}, 8000);

const [out, err, code] = await Promise.all([
  new Response(proc.stdout).text(),
  new Response(proc.stderr).text(),
  proc.exited,
]);
clearTimeout(timer);

if (code !== 0) {
  const lines = `${out}\n${err}`
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter(Boolean)
    .slice(0, 10);
  if (lines.length > 0) {
    emitContext(
      harness,
      "PostToolUse",
      `Typecheck diagnostics (${tsconfig}):\n${lines.join("\n")}`,
    );
    process.exit(0);
  }
}

writeEmpty();
