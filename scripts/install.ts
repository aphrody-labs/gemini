#!/usr/bin/env bun
// Renders the machine-specific Gemini files from their templates and creates the plugin links, so the repository stores no path and no junction.
//   bun scripts/install.ts [--dry-run]
// settings.template.json  -> settings.json            ({{HOME}} becomes this user's home directory, forward slashes)
// config/mcp_config.template.json -> config/mcp_config.json
// config/plugins/<name>   -> ~/.claude/packages/<name> (junction on Windows, symlink elsewhere), when the target exists and the link does not
import { existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const home = homedir().replaceAll("\\", "/");
const dry = process.argv.includes("--dry-run");

for (const [from, to] of [["settings.template.json", "settings.json"], ["config/mcp_config.template.json", "config/mcp_config.json"]] as const) {
  const text = readFileSync(join(root, from), "utf8").replaceAll("{{HOME}}", home);
  console.log(`${dry ? "would render" : "render"} ${to}`);
  if (!dry) writeFileSync(join(root, to), text);
}
for (const name of ["aphrody", "bun"]) {
  const target = join(homedir(), ".claude", "packages", name);
  const link = join(root, "config", "plugins", name);
  if (!existsSync(target) || existsSync(link)) continue;
  console.log(`${dry ? "would link" : "link"} config/plugins/${name}`);
  if (!dry) {
    mkdirSync(dirname(link), { recursive: true });
    symlinkSync(target, link, process.platform === "win32" ? "junction" : "dir");
  }
}
