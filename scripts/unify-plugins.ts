#!/usr/bin/env bun
// Unify all skills, MCP servers, LSPs, rules, and plugins into a single versioned
// cross-agent / cross-provider / cross-OS plugin at ~/.gemini/plugins/aphrody.
import { SUPERSEDED } from "./vendor-skills.ts";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CONFIG_DIR, discoverAphrodyRoot, GEMINI_ROOT, writeIfChanged } from "./lib.ts";

const UNIFIED_VERSION = "2.0.0";
const PLUGINS_DIR = join(GEMINI_ROOT, "plugins");
const TARGET_PLUGIN = join(PLUGINS_DIR, "aphrody");
const LEGACY_PLUGINS = ["bun", "cloudflare", "nextjs"] as const;

function copyMissingSkills(srcSkillsDir: string, dstSkillsDir: string): number {
  if (!existsSync(srcSkillsDir)) return 0;
  mkdirSync(dstSkillsDir, { recursive: true });
  let copied = 0;
  for (const entry of readdirSync(srcSkillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name in SUPERSEDED) continue;
    const src = join(srcSkillsDir, entry.name);
    const dst = join(dstSkillsDir, entry.name);
    if (!existsSync(dst)) {
      cpSync(src, dst, { recursive: true, force: true });
      copied++;
    }
  }
  return copied;
}

function rewriteFile(src: string, dst: string, replacements: Array<[string, string]>): void {
  if (!existsSync(src)) return;
  let content = readFileSync(src, "utf8");
  for (const [from, to] of replacements) {
    content = content.replaceAll(from, to);
  }
  writeIfChanged(dst, content);
}

export function unifyPlugins(): {
  version: string;
  skillsMerged: number;
  totalSkills: number;
  mcps: string[];
  removedPlugins: string[];
} {
  const dstSkills = join(TARGET_PLUGIN, "skills");
  const dstLib = join(TARGET_PLUGIN, "lib");
  const dstMcp = join(TARGET_PLUGIN, "mcp");
  const dstLsp = join(TARGET_PLUGIN, "lsp");
  mkdirSync(dstSkills, { recursive: true });
  mkdirSync(dstLib, { recursive: true });
  mkdirSync(dstMcp, { recursive: true });
  mkdirSync(dstLsp, { recursive: true });

  let skillsMerged = 0;

  // 1. Merge skills from legacy plugins (bun, cloudflare, nextjs) and repo .agents/plugins/aphrody.
  for (const name of LEGACY_PLUGINS) {
    skillsMerged += copyMissingSkills(join(PLUGINS_DIR, name, "skills"), dstSkills);
  }
  const aphrodyRoot = discoverAphrodyRoot();
  if (aphrodyRoot) {
    skillsMerged += copyMissingSkills(
      join(aphrodyRoot, ".agents", "plugins", "aphrody", "skills"),
      dstSkills,
    );
  }

  // 2. Relocate Bun & Next.js MCPs, LSPs, and brain libraries into plugins/aphrody.
  const bunRoot = join(PLUGINS_DIR, "bun");
  if (existsSync(bunRoot)) {
    rewriteFile(join(bunRoot, "lib", "brain.ts"), join(dstLib, "bun-brain.ts"), []);
    rewriteFile(join(bunRoot, "lib", "legacy-scanner.ts"), join(dstLib, "bun-legacy-scanner.ts"), []);
    const bunReps: Array<[string, string]> = [
      ["../lib/brain.ts", "../lib/bun-brain.ts"],
      ["../lib/legacy-scanner.ts", "../lib/bun-legacy-scanner.ts"],
    ];
    rewriteFile(join(bunRoot, "mcp", "bun-mcp.ts"), join(dstMcp, "bun-mcp.ts"), bunReps);
    rewriteFile(join(bunRoot, "mcp", "bun-mcp.test.ts"), join(dstMcp, "bun-mcp.test.ts"), bunReps);
    rewriteFile(join(bunRoot, "lsp", "bun-lsp.ts"), join(dstLsp, "bun-lsp.ts"), bunReps);
    rewriteFile(join(bunRoot, "lsp", "bun-lsp.test.ts"), join(dstLsp, "bun-lsp.test.ts"), bunReps);
  }

  const nextRoot = join(PLUGINS_DIR, "nextjs");
  if (existsSync(nextRoot)) {
    rewriteFile(join(nextRoot, "lib", "brain.ts"), join(dstLib, "nextjs-brain.ts"), []);
    const nextReps: Array<[string, string]> = [["../lib/brain.ts", "../lib/nextjs-brain.ts"]];
    rewriteFile(join(nextRoot, "mcp", "nextjs-mcp.ts"), join(dstMcp, "nextjs-mcp.ts"), nextReps);
    rewriteFile(
      join(nextRoot, "mcp", "nextjs-mcp.test.ts"),
      join(dstMcp, "nextjs-mcp.test.ts"),
      nextReps,
    );
  }

  // 3. Merge rules/AGENTS.md idempotently.
  const targetRulesPath = join(TARGET_PLUGIN, "rules", "AGENTS.md");
  let mergedRules = existsSync(targetRulesPath) ? readFileSync(targetRulesPath, "utf8").trimEnd() : "";
  for (const name of LEGACY_PLUGINS) {
    const rulePath = join(PLUGINS_DIR, name, "rules", "AGENTS.md");
    if (!existsSync(rulePath)) continue;
    const marker = `<!-- merged-rules:${name} -->`;
    if (mergedRules.includes(marker)) continue;
    const body = readFileSync(rulePath, "utf8").trim();
    mergedRules += `\n\n${marker}\n${body}\n`;
  }
  writeIfChanged(targetRulesPath, `${mergedRules.trimEnd()}\n`);

  // 4. Write unified mcp_config.json (cross-OS via ${PLUGIN_ROOT} + bun).
  const mcpConfig = {
    mcpServers: {
      "os-craft": {
        command: "bun",
        args: ["${PLUGIN_ROOT}/scripts/os-craft-mcp.ts"],
      },
      "bun-brain": {
        command: "bun",
        args: ["--no-install", "--no-env-file", "${PLUGIN_ROOT}/mcp/bun-mcp.ts"],
      },
      "nextjs-brain": {
        command: "bun",
        args: ["--no-install", "--no-env-file", "${PLUGIN_ROOT}/mcp/nextjs-mcp.ts"],
      },
      "docker-brain": {
        command: "bun",
        args: ["--no-install", "--no-env-file", "${PLUGIN_ROOT}/mcp/docker-mcp.ts"],
      },
    },
  };
  writeIfChanged(
    join(TARGET_PLUGIN, "mcp_config.json"),
    `${JSON.stringify(mcpConfig, null, 2)}\n`,
  );

  // 5. Bump plugins/aphrody/plugin.json to unified v2.0.0 (strict Antigravity schema).
  const pluginJson = {
    $schema: "https://antigravity.google/schemas/v1/plugin.json",
    name: "aphrody",
    displayName: "Aphrody Unified",
    version: UNIFIED_VERSION,
    description:
      "Single versioned cross-agent, cross-provider, cross-OS plugin unifying all Aphrody, Bun, Cloudflare, Next.js, GPUI, WGPU, and reverse-engineering skills, MCPs, LSPs, and rules.",
    logo: "assets/logo.svg",
    suggestedPrompts: [
      "Audit workspace conformance, toolchain health, and open blockers cleanly",
      "Run parallel verification across Rust, TypeScript, and browser checks",
      "Distill pending learning digests into durable Gemini memory",
    ],
    author: {
      name: "aphrody-labs",
      url: "https://github.com/aphrody-labs",
    },
    homepage: "https://github.com/aphrody-labs/gemini",
    repository: "https://github.com/aphrody-labs/gemini",
  };
  writeIfChanged(
    join(TARGET_PLUGIN, "plugin.json"),
    `${JSON.stringify(pluginJson, null, 2)}\n`,
  );

  // 6. Remove fragmented legacy plugin directories and materialized copies.
  const removedPlugins: string[] = [];
  for (const name of LEGACY_PLUGINS) {
    for (const dir of [
      join(PLUGINS_DIR, name),
      join(CONFIG_DIR, "plugins", name),
      join(GEMINI_ROOT, "extensions", name),
    ]) {
      if (existsSync(dir)) {
        try {
          rmSync(dir, { recursive: true, force: true });
          if (dir === join(PLUGINS_DIR, name)) removedPlugins.push(name);
        } catch {
          // Directory may be locked by a running MCP process on Windows; retry on next install.
        }
      }
    }
  }

  const totalSkills = readdirSync(dstSkills, { withFileTypes: true }).filter((e) =>
    e.isDirectory(),
  ).length;

  return {
    version: UNIFIED_VERSION,
    skillsMerged,
    totalSkills,
    mcps: Object.keys(mcpConfig.mcpServers),
    removedPlugins,
  };
}

export function exportCrossAgentConfigs(): { outDir: string; targets: string[] } {
  const pluginRootSlash = join(GEMINI_ROOT, "plugins", "aphrody").replaceAll("\\", "/");
  const vercelPluginRootSlash = join(GEMINI_ROOT, "plugins", "vercel").replaceAll("\\", "/");
  const relayScript = join(GEMINI_ROOT, "scripts", "relay-stdio.ts").replaceAll("\\", "/");
  const outDir = join(GEMINI_ROOT, "dist", "cross-agent");
  mkdirSync(outDir, { recursive: true });

  const servers: Record<string, { command: string; args: string[] }> = {
    relay: { command: "bun", args: [relayScript] },
    "os-craft": { command: "bun", args: [`${pluginRootSlash}/scripts/os-craft-mcp.ts`] },
    "bun-brain": {
      command: "bun",
      args: ["--no-install", "--no-env-file", `${pluginRootSlash}/mcp/bun-mcp.ts`],
    },
    "nextjs-brain": {
      command: "bun",
      args: ["--no-install", "--no-env-file", `${pluginRootSlash}/mcp/nextjs-mcp.ts`],
    },
    "docker-brain": {
      command: "bun",
      args: ["--no-install", "--no-env-file", `${pluginRootSlash}/mcp/docker-mcp.ts`],
    },
    "vercel-brain": {
      command: "bun",
      args: ["--no-install", "--no-env-file", `${vercelPluginRootSlash}/mcp/vercel-mcp.ts`],
    },
  };

  // Standard MCP JSON (Cursor, Windsurf, Claude Desktop, OpenCode, Generic MCP).
  writeIfChanged(
    join(outDir, "mcp.json"),
    `${JSON.stringify({ mcpServers: servers }, null, 2)}\n`,
  );

  // Zed context_servers format.
  const zedServers: Record<string, unknown> = {};
  for (const [name, cfg] of Object.entries(servers)) {
    zedServers[name] = {
      source: "custom",
      command: { path: cfg.command, args: cfg.args, env: {} },
    };
  }
  writeIfChanged(
    join(outDir, "zed-context-servers.json"),
    `${JSON.stringify({ context_servers: zedServers }, null, 2)}\n`,
  );

  // Codex CLI TOML format.
  const codexLines = [
    `# Generated by ~/.gemini/scripts/unify-plugins.ts (Aphrody Unified v${UNIFIED_VERSION})`,
  ];
  for (const [name, cfg] of Object.entries(servers)) {
    codexLines.push(
      `[mcp_servers."${name}"]`,
      `command = "${cfg.command}"`,
      `args = [${cfg.args.map((a) => `"${a}"`).join(", ")}]`,
      "",
    );
  }
  writeIfChanged(join(outDir, "codex-mcp.toml"), `${codexLines.join("\n")}\n`);

  // Versioned cross-agent / cross-provider / cross-OS manifest at repo root.
  const skillsDir = join(TARGET_PLUGIN, "skills");
  const skills = existsSync(skillsDir)
    ? readdirSync(skillsDir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
        .sort()
    : [];

  const manifest = {
    name: "aphrody-unified",
    version: UNIFIED_VERSION,
    repository: "https://github.com/aphrody-labs/gemini",
    pluginRoot: "plugins/aphrody",
    platforms: ["windows", "linux", "macos"],
    agents: [
      "antigravity",
      "gemini-cli",
      "claude-code",
      "cursor",
      "windsurf",
      "codex",
      "opencode",
      "zed",
    ],
    providers: ["google", "anthropic", "openai", "openrouter", "local"],
    mcpServers: Object.keys(servers),
    lspServers: ["bun-lsp"],
    skillCount: skills.length,
    skills,
  };
  writeIfChanged(
    join(GEMINI_ROOT, "unified-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  return {
    outDir,
    targets: ["mcp.json", "zed-context-servers.json", "codex-mcp.toml", "unified-manifest.json"],
  };
}

if (import.meta.main) {
  const res = unifyPlugins();
  const exp = exportCrossAgentConfigs();
  console.log(JSON.stringify({ unified: res, exported: exp }, null, 2));
}
