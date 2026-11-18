#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { discoverWorkspaceRoot, HOME, userEnv } from "./lib.ts";

const workspace = discoverWorkspaceRoot();
const candidates = [
  process.env.AY_ROOT,
  userEnv("AY_ROOT"),
  join(workspace, "ay"),
  process.env.SRC_ROOT && join(dirname(process.env.SRC_ROOT), "ay"),
  join(HOME, "src", "ay"),
  join(HOME, "ay"),
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
  return /[/:]aphrody-(?:labs|dev)\/ay(\.git)?$/i.test(r.stdout.toString().trim());
}

const rel = ["packages", "ai-os", "src", "server", "cli.ts"] as const;
const target = candidates.find(
  (c) => existsSync(join(c, ...rel)) && trusted(c),
);
if (!target) {
  console.error(
    "relay-stdio: no trusted aphrody-labs/ay checkout with packages/ai-os/src/server/cli.ts",
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
