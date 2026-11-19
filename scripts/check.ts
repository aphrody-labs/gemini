#!/usr/bin/env bun
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { CLI_DIR, CONFIG_DIR, GEMINI_ROOT, runCmd } from "./lib.ts";

let failed = 0;

// Plugins installed unmodified from their upstream (`agy plugin install`): validated without --strict and skipped by the coupling scan.
const UPSTREAM_PLUGINS = new Set(["cloudflare"]);

function step(label: string, cmd: string[]): void {
  const res = runCmd(cmd);
  if (!res.ok) {
    failed++;
    console.error(`FAIL [${label}]:\n${res.out}\n${res.err}`);
  } else {
    console.log(`PASS [${label}]`);
  }
}

// 1. Run Bun unit tests.
step("bun test", [process.execPath, "test", "scripts"]);

// 2. Typecheck if `bun check` is available.
if (
  Bun.spawnSync([process.execPath, "check", "--no-script", "--help"], {
    stdout: "ignore",
    stderr: "ignore",
    stdin: "ignore",
  }).exitCode === 0
) {
  step("bun check", [process.execPath, "check", "--no-script"]);
}

// 3. Validate materialized Antigravity plugins cleanly.
if (Bun.which("agy")) {
  const pluginsSrcDir = join(GEMINI_ROOT, "plugins");
  const pluginsDir = join(CONFIG_DIR, "plugins");
  if (existsSync(pluginsSrcDir) && existsSync(pluginsDir)) {
    for (const entry of readdirSync(pluginsSrcDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dst = join(pluginsDir, entry.name);
      if (!existsSync(dst)) {
        failed++;
        console.error(`FAIL [plugin ${entry.name}]: missing materialized directory`);
        continue;
      }
      step(`agy plugin validate ${entry.name}${UPSTREAM_PLUGINS.has(entry.name) ? "" : " --strict"}`, [
        "agy",
        "plugin",
        "validate",
        dst,
        ...(UPSTREAM_PLUGINS.has(entry.name) ? [] : ["--strict"]),
        "--json",
      ]);
    }
  }
}

// 4. Verify zero .claude coupling and zero embedded double-quote Windows command traps.
const SCAN_DIRS = [
  "scripts",
  "rules",
  "memory",
  "plugins",
  "settings.template.json",
  "antigravity-cli/settings.template.json",
  "antigravity-cli/hooks.template.json",
  "config/hooks.template.json",
  "config/mcp_config.template.json",
  "GEMINI.md",
  "settings.json",
  "antigravity-cli/settings.json",
  "config/hooks.json",
  "config/mcp_config.json",
];

function walkFiles(p: string, out: string[]): void {
  if (!existsSync(p)) return;
  const st = statSync(p);
  if (st.isFile()) {
    if (/\.(ts|json|md|toml|rs)$/i.test(p)) out.push(p);
    return;
  }
  for (const e of readdirSync(p)) {
    if (e === "node_modules" || e === ".git" || e === "target") continue;
    walkFiles(join(p, e), out);
  }
}

const files: string[] = [];
for (const rel of SCAN_DIRS) walkFiles(join(GEMINI_ROOT, rel), files);

let couplingHits = 0;
for (const f of files) {
  const rel = relative(GEMINI_ROOT, f).replaceAll("\\", "/");
  if (rel === "scripts/check.ts") continue;
  if ([...UPSTREAM_PLUGINS].some((n) => rel.startsWith(`plugins/${n}/`))) continue;
  const text = readFileSync(f, "utf8");
  if (/(?:~|HOME|\$HOME|%USERPROFILE%)[/\\]\.claude\b|Users[/\\][^/\\]+[/\\]\.claude\b|CLAUDE_HOME|CLAUDE_PLUGIN_ROOT/i.test(text)) {
    couplingHits++;
    failed++;
    console.error(`FAIL [separation]: found .claude reference in ${rel}`);
  }
}
if (couplingHits === 0) console.log("PASS [zero .claude coupling]");

// 5. Verify no quoted script paths remain in live Antigravity command hooks/statusLine/title.
for (const cfgPath of [
  join(CLI_DIR, "settings.json"),
  join(CONFIG_DIR, "hooks.json"),
  join(GEMINI_ROOT, "settings.json"),
]) {
  if (!existsSync(cfgPath)) continue;
  const raw = readFileSync(cfgPath, "utf8");
  if (/"command":\s*"[^"]*\\"/m.test(raw)) {
    failed++;
    console.error(
      `FAIL [win-cmd-quoting]: embedded escaped quote in ${relative(GEMINI_ROOT, cfgPath)}`,
    );
  }
}

if (failed > 0) {
  console.error(`\nChecks failed: ${failed}`);
  process.exit(1);
}
console.log("\nAll .gemini checks passed.");
