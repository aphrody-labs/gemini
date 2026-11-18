---
name: Standalone .gemini architecture and learning loop
description: Self-contained ~/.gemini layout, reproducible install/check gates, and autonomous learning.
type: project
---

`~/.gemini` is self-contained with zero dependencies on any external home-config directory:
- `scripts/install.ts`: renders `settings.json`, `antigravity-cli/settings.json`, `antigravity-cli/hooks.json`, `config/hooks.json`, `config/mcp_config.json`, `dashboard/.cargo/config.toml`, copies `plugins/` to `config/plugins/`, and updates `GEMINI.md` + SQLite FTS5 index.
- `scripts/learn.ts`: captures errors, recoveries, and user corrections to `~/.gemini/learning/journal.jsonl`, distills digests into `learning/inbox/`, and indexes `GEMINI.md`, `rules/`, `memory/`, `plugins/` into `learning/memory.db`.
- `scripts/check.ts`: runs `bun test`, `bun check`, `agy plugin validate --strict`, and asserts zero external home-config references or quoted Windows hook commands.
