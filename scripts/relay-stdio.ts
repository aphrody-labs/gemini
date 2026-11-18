#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { discoverWorkspaceRoot, HOME, userEnv } from "./lib.ts";

const workspace = discoverWorkspaceRoot();
const candidates = [
  process.env.AI_OS_ROOT,
  userEnv("AI_OS_ROOT"),
  join(workspace, "ai-os"),
  process.env.SRC_ROOT && join(dirname(process.env.SRC_ROOT), "ai-os"),
  join(HOME, "src", "ai-os"),
  join(HOME, "ai-os"),
].filter((x): x is string => Boolean(x));

const git = Bun.which("git");
function trusted(dir: string): boolean {
  const abs = resolve(dir).replaceAll("\\", "/");
  if (abs === HOME || dirname(abs) === abs || !git) return false;
  const r = Bun.spawnSync([git, "-C", abs, "remote", "get-url", "origin"], {
    stdout: "pipe",
    stderr: "ignore",
    stdin: "ignore",
  });
  return /[/:]aphrody-dev\/ai-os(\.git)?$/i.test(r.stdout.toString().trim());
}

const rel = ["frameworks", "ai-os", "src", "relay", "cli.ts"] as const;
const target = candidates.find(
  (c) => existsSync(join(c, ...rel)) && trusted(c),
);
if (!target) {
  console.error(
    "relay-stdio: no trusted aphrody-dev/ai-os checkout with frameworks/ai-os/src/relay/cli.ts",
  );
  process.exit(1);
}

const child = Bun.spawn([process.execPath, join(target, ...rel), "mcp-stdio"], {
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
  env: process.env,
});
process.exit(await child.exited);
