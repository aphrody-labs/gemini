---
name: bun-guide
description: "Master guide and router for Bun 1.4+ development in Antigravity: navigates ~/.gemini/brain/bun/ knowledge digests, bun-brain MCP tools, bun-lsp diagnostics/hover, and native Bun CLI tooling (check, lint, fmt, test, build, pm)."
---

# Bun 1.4+ Master Guide

Use this skill as the entry point for Bun API lookups, CLI flags, TypeScript 7 checking, linting, formatting, testing, bundling, and legacy migration.

## Knowledge Brain (`~/.gemini/brain/bun/`)

All upstream Mintlify docs, `packages/bun-types` declarations, repo dev skills, and `src/migrate/registry` rules are compacted in `~/.gemini/brain/bun/` and indexed in `~/.gemini/learning/memory.db`:

| File | Scope |
| :--- | :--- |
| `~/.gemini/brain/bun/INDEX.md` | Full `docs/docs.json` sitemap and quick CLI/API lookup table |
| `~/.gemini/brain/bun/RUNTIME_APIS.md` | `Bun.*` namespace signatures, `bun:*` built-in modules, globals, `node:*` compatibility matrix |
| `~/.gemini/brain/bun/TYPES_DIGEST.md` | Compressed TypeScript declarations from all `packages/bun-types/*.d.ts` + `ts7.1/` |
| `~/.gemini/brain/bun/CLI_TOOLING.md` | `run`, `test`, `build`, `compile`, `install`/`pm`, `check`, `lint`, `fmt`, `migrate`, `bunfig.toml` |
| `~/.gemini/brain/bun/GUIDES_SKILLS_DIGEST.md` | Distilled Mintlify `docs/guides/` and upstream Bun dev skills |
| `~/.gemini/brain/bun/LEGACY_REPLACEMENT.md` | Complete Node/npm/CI/Docker/Rust replacement matrix |

Refresh the brain from a local Bun checkout anytime with:
```sh
bun ~/.gemini/scripts/import-bun-brain.ts && bun ~/.gemini/scripts/sync.ts
```

## Plugin Tools (`plugins/bun/`)

- **MCP server (`plugins/bun/mcp_config.json` -> `mcp/bun-mcp.ts`)**: stdio JSON-RPC 2.0 server `bun-brain` exposing:
  - `bun_brain_search` — search ranked sections across `~/.gemini/brain/bun/*.md`
  - `bun_types_lookup` — lookup `Bun.*` / `bun:*` / `ts7.1` TypeScript declarations
  - `bun_api_matrix` — query topic overview, `bun:*` modules, `node:*` compat, or CLI sections
  - `bun_legacy_scan` — scan files/directories/code for legacy patterns + preview rewrites
  - `bun_migrate_plan` — generate phased Bun or Rust-target migration plan
- **LSP server (`plugins/bun/lsp/bun-lsp.ts`)**: standalone stdio LSP 3.17 server combining `Bun.Transpiler` syntax checks, `bun check --no-script --no-pretty` TypeScript 7 diagnostics, `bun-legacy` hints, hover docs, `Bun.`/`bun:` completions, and document symbols.
- **SQLite FTS5 search**: `bun ~/.gemini/scripts/learn.ts search <terms>` searches `brain/bun/`, `memory/`, `rules/`, and `plugins/` offline in milliseconds.

## Verification Baseline

Run Bun's built-in tools directly (pass `--no-script` in repos with conflicting `package.json` script names):
```sh
bun check --no-script
bun lint --no-script
bun fmt --check --no-script
bun test
```

## Task Routing

- **Writing/reviewing Bun code**: `bun-native`, `bun-runtime`, `bun-apis`
- **Curated frameworks & libraries**: `bun-awesome`
- **Migrating from Node/npm/Yarn/pnpm**: `bun-legacy-replace`, `n2b`
- **Tests / Bundler / Compiler**: `bun-tests`, `bun-build`, `bun-docs`
- **Working inside a Bun checkout**: `bun-crates`, `cpp-bun`, `win32`, `linux-kernel`, `webkit`, `work`
