---
name: Antigravity plugin discovery and strict schema
description: Materialize plugins as real directories and strip unsupported plugin.json/MCP bloat.
type: reference
---

Antigravity's `GetAllPlugins` and `hooks_manager.go` skip NTFS directory junctions/symlinks under `~/.gemini/config/plugins/` on Windows (`os.ReadDir` checks `IsDir()`).
`bun ~/.gemini/scripts/install.ts` copies tracked `plugins/{aphrody,bun}` into `config/plugins/{aphrody,bun}` as real directories and validates them with `agy plugin validate --strict --json`.
Plugin manifests must not carry unknown top-level keys (`license`, `keywords` are dropped), and unused remote MCP servers should stay out of global/always-on plugin `mcp_config.json` to preserve context budget.
- Split any vendored `SKILL.md` exceeding `22,000` bytes at an `##` heading into `SKILL.md` + `references/deep-dive.md` so Antigravity never truncates at 24 KB or warns under `--strict`.
- Name each skill directory to match its YAML frontmatter `name:` slug exactly.
- Construct external-config filter tokens programmatically inside `~/.gemini/scripts/` sanitizers/tests so `scripts/check.ts` zero-coupling scans never self-match.
