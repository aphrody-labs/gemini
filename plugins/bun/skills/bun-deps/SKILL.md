---
name: bun-deps
description: "Inspect installed npm/Cargo/vendor dependency trees, metadata, and docs offline at their exact installed versions using bun pm ls/why/info, relay core_ingest/core_query, and local node_modules/Cargo sources instead of guessing from web searches."
---

## Inspecting Installed Dependencies Offline

Check exact installed versions and docs directly on disk instead of fetching external web docs:

- **List & inspect npm dependencies**: `bun pm ls [--all]`, `bun pm why <pkg>`, `bun info <pkg>`, and read `node_modules/<pkg>/{package.json,README.md,*.d.ts}`.
- **Repository & dependency ingestion**: when the `relay` MCP server is active, use `core_ingest`, `core_query`, `core_symbols`, and `core_graph_query` to index and query installed package/crate trees; use `bun_brain_search` and `bun_types_lookup` (`plugins/bun/mcp/bun-mcp.ts`) for Bun runtime APIs and `bun-types` declarations.
- **Cargo crates**: inspect `Cargo.lock` and local `~/.cargo/registry/src/` / `vendor/` sources directly with bounded line reads (`rg -n` first).
