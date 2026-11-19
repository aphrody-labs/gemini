#!/usr/bin/env bun
// Reproducible standalone setup for ~/.gemini (zero .claude dependencies, zero symlinks in plugins).
// Usage: bun scripts/install.ts [--dry-run]
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  CLI_DIR,
  CONFIG_DIR,
  discoverAphrodyRoot,
  discoverWorkspaces,
  GEMINI_ROOT,
  syncRealDir,
  templateVars,
  renderTemplate,
  writeIfChanged,
} from "./lib.ts";
import { syncAll } from "./sync.ts";
import { exportCrossAgentConfigs } from "./unify-plugins.ts";
import { updateVendoredSkills } from "./vendor-skills.ts";

const dry = Bun.argv.includes("--dry-run");
const vars = templateVars();

const templatePairs: Array<[string, string]> = [
  ["settings.template.json", "settings.json"],
  ["config/hooks.template.json", "config/hooks.json"],
  ["config/mcp_config.template.json", "config/mcp_config.json"],
  ["antigravity-cli/hooks.template.json", "antigravity-cli/hooks.json"],
];

for (const [srcRel, dstRel] of templatePairs) {
  const src = join(GEMINI_ROOT, srcRel);
  if (!existsSync(src)) continue;
  const rendered = renderTemplate(readFileSync(src, "utf8"), vars, true);
  console.log(`${dry ? "would render" : "render"} ${dstRel}`);
  if (!dry) writeIfChanged(join(GEMINI_ROOT, dstRel), rendered);
}

// Render antigravity-cli/settings.json while preserving active model/voice and merging discovered workspaces.
const agySrc = join(CLI_DIR, "settings.template.json");
const agyDst = join(CLI_DIR, "settings.json");
if (existsSync(agySrc)) {
  const desired = JSON.parse(
    renderTemplate(readFileSync(agySrc, "utf8"), vars, true),
  ) as Record<string, unknown>;
  let current: Record<string, unknown> = {};
  if (existsSync(agyDst)) {
    try {
      current = JSON.parse(readFileSync(agyDst, "utf8")) as Record<string, unknown>;
    } catch {
      current = {};
    }
  }
  const discoveredWin = Object.keys(discoverWorkspaces()).map((p) =>
    p.replaceAll("/", "\\"),
  );
  const oldWs = Array.isArray(current.trustedWorkspaces)
    ? (current.trustedWorkspaces as string[])
    : [];
  const wantedWs = Array.isArray(desired.trustedWorkspaces)
    ? (desired.trustedWorkspaces as string[])
    : [];
  const seen = new Set<string>();
  const cleanWs: string[] = [];
  for (const raw of [...wantedWs, ...discoveredWin, ...oldWs]) {
    const win = raw.replaceAll("/", "\\");
    const key = win.toLowerCase();
    if (!existsSync(win) || seen.has(key)) continue;
    seen.add(key);
    cleanWs.push(win);
  }
  const merged: Record<string, unknown> = {
    ...current,
    ...desired,
    trustedWorkspaces: cleanWs,
  };
  if (typeof current.model === "string" && current.model) {
    merged.model = current.model;
  }
  if (current.voice && typeof current.voice === "object") {
    merged.voice = current.voice;
  }
  console.log(`${dry ? "would render" : "render"} antigravity-cli/settings.json`);
  if (!dry) {
    writeIfChanged(agyDst, `${JSON.stringify(merged, null, 2)}\n`);
  }
}

// Refresh vendored upstream skills (docker/skills, ...) to their head commit and drop superseded duplicates.
if (!dry) console.log(`vendored skills: ${JSON.stringify(await updateVendoredSkills())}`);

// Materialize plugins as real directories (Go os.ReadDir skips NTFS junctions on Windows).
const pluginsSrcRoot = join(GEMINI_ROOT, "plugins");
const pluginsDstRoot = join(CONFIG_DIR, "plugins");
const activePlugins = new Set<string>();
if (existsSync(pluginsSrcRoot)) {
  for (const entry of readdirSync(pluginsSrcRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    activePlugins.add(entry.name);
    const src = join(pluginsSrcRoot, entry.name);
    const dst = join(pluginsDstRoot, entry.name);
    console.log(`${dry ? "would sync" : "sync"} config/plugins/${entry.name}`);
    if (!dry) syncRealDir(src, dst);
  }
}
if (existsSync(pluginsDstRoot) && !dry) {
  for (const entry of readdirSync(pluginsDstRoot, { withFileTypes: true })) {
    if (!activePlugins.has(entry.name)) {
      try {
        rmSync(join(pluginsDstRoot, entry.name), { recursive: true, force: true });
      } catch {
        // Locked by an active MCP process on Windows; will be removed on next install.
      }
    }
  }
}

// Re-point Gemini CLI extension install metadata to unified plugin and clean stale extensions.
for (const name of ["bun", "nextjs"]) {
  const staleExt = join(GEMINI_ROOT, "extensions", name);
  if (existsSync(staleExt) && !dry) rmSync(staleExt, { recursive: true, force: true });
}
for (const name of activePlugins) {
  const extDir = join(GEMINI_ROOT, "extensions", name);
  const manifest = join(extDir, ".gemini-extension-install.json");
  const target = join(pluginsSrcRoot, name);
  if (!existsSync(target)) continue;
  if (!dry) {
    mkdirSync(extDir, { recursive: true });
    writeIfChanged(
      manifest,
      `${JSON.stringify({ source: target.replaceAll("/", "\\"), type: "link" }, null, 2)}\n`,
    );
  }
}

// Clean legacy .claude link remnants if present.
const legacyBridge = join(CONFIG_DIR, "plugins", "aphrody-skills");
if (existsSync(legacyBridge) && !dry) {
  rmSync(legacyBridge, { recursive: true, force: true });
}

// Write machine-local dashboard/.cargo/config.toml pointing to discovered aphrody GPUI crates.
const aphrodyRoot = discoverAphrodyRoot();
const dashboardCargoDir = join(GEMINI_ROOT, "dashboard", ".cargo");
if (aphrodyRoot && existsSync(join(GEMINI_ROOT, "dashboard", "Cargo.toml"))) {
  const aphrodySlash = aphrodyRoot.replaceAll("\\", "/");
  const drive = (process.env.SystemDrive ?? "").replaceAll("\\", "/");
  const winCache = process.platform === "win32" && drive ? `${drive}/data/cache/cargo-target` : "";
  const cargoTargetDir = (process.env.CARGO_TARGET_DIR || (winCache && existsSync(winCache) ? winCache : "")).replaceAll("\\", "/");
  const patchLines = [
    "# Generated by ~/.gemini/scripts/install.ts (untracked machine-local path patch).",
    ...(cargoTargetDir ? ["[build]", `target-dir = "${cargoTargetDir}"`, ""] : []),
    `[patch."https://github.com/aphrody-labs/aphrody.git"]`,
    `gpui = { path = "${aphrodySlash}/crates/gpui" }`,
    `gpui_platform = { path = "${aphrodySlash}/crates/gpui_platform" }`,
    `gpui_windows = { path = "${aphrodySlash}/crates/gpui_windows" }`,
    `gpui_wgpu = { path = "${aphrodySlash}/crates/gpui_wgpu" }`,
    `gpui_macros = { path = "${aphrodySlash}/crates/gpui_macros" }`,
    `gpui_shared_string = { path = "${aphrodySlash}/crates/gpui_shared_string" }`,
    `gpui_util = { path = "${aphrodySlash}/crates/gpui_util" }`,
    "",
    `[patch."https://github.com/aphrody-labs/wry.git"]`,
    `wry = { path = "${aphrodySlash}/vendor/tauri/wry" }`,
    "",
  ].join("\n");
  console.log(`${dry ? "would write" : "write"} dashboard/.cargo/config.toml`);
  if (!dry) {
    mkdirSync(dashboardCargoDir, { recursive: true });
    writeIfChanged(join(dashboardCargoDir, "config.toml"), patchLines);
  }
}

if (!dry) {
  const exp = exportCrossAgentConfigs();
  const syncRes = syncAll();
  console.log(
    `Install complete (GEMINI.md ${syncRes.changed ? "updated" : "current"}, indexed ${syncRes.indexedFiles} file(s), exported ${exp.targets.length} cross-agent targets).`,
  );
}
