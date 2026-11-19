# Antigravity (agy) specifics

- Isolation: `~/.gemini` is 100% self-contained (`scripts/`, `rules/`, `memory/`, `plugins/`, `dashboard/`); never link or depend on external home-config directories.
- Context & speed optimization:
  - Read selectively (`rg -n` first, bounded line ranges); batch independent reads and edits in parallel.
  - Progressive disclosure: keep skills/memories modular (`memory/*.md`, `plugins/*/skills/*/SKILL.md`); query `bun "$HOME/.gemini/scripts/learn.ts" search <terms>` before broad scans.
  - Keep MCP prompt overhead lean; prefer native tools and CLI scripts over unused server schemas.
- Execution & fleet:
  - Prefer reproducible, use-case-optimal Rust/Bun CLIs & libs over bash/pwsh text pipelines: `rg`/`fd`/`ast-grep` (search/AST), `jaq`/`nu`/`bun -` (JSON/scripts), `xh`/`curl.exe` (HTTP), `difft`/`delta` (diff), `dust`/`procs`/`hyperfine`/`tokei`/`duckdb` (telemetry/SQL), `just`/`mise`/`flake.nix` (reproducible tasks/envs), `uv`/`bun` (Python/JS), `sccache`+`mold`/`wild` (Rust builds).
  - Run long remote commands (`fr1`/`fr2`/`prd`) directly inside detached `tmux` sessions via `bun "$HOME/.gemini/scripts/tmux-run.ts" start <host> <job> "<cmd>"` (never block on long SSH pipelines); background long local commands (`WaitMsBeforeAsync` <= 1500) and offload heavy Rust/C++ builds to `fr1`/`fr2`, never blocking the workstation.
  - Coordinate before touching shared VPS dirs (`/srv/xbuild`), sibling repos, or forks: check `relay` `session_list`/`session_inbox` (`session_register` + `session_send`) and drain `session_inbox` on every `swarm_wait` wakeup.
- Autonomous learning:
  - Hooks capture errors, recoveries, and corrections in `~/.gemini/learning/journal.jsonl`, autonomously promote durable rules into `~/.gemini/memory/learned-{auto,cloud}.md`, and converge with all Aphrody agents across any PC via Cloudflare (`https://learn.aphrody.com`) without human intervention or approval.

- Pre-flight quality gates:
  - Initial hypothesis grounding: BEFORE forming or acting on any initial hypothesis, explicitly load relevant `SKILL.md` files via `read_file` and the right MCP/CLI tools, and verify against real FS/VFS/FTS5 (`learn.ts search`) and live web/GitHub API sources so every decision rests on proven facts, never half-explored assumptions.
  - Zero false completion & exact-read-before-edit: verify every user requirement against real tool output before reporting done; always `read_file` exact lines before `edit_file`, pass `Overwrite: true` on existing `write_file` targets, and use `@' ... '@ | bun -` + `curl.exe` + `;` on Windows PowerShell.
  - Always apply `no-slop-humanizer` (strip AI slop, binary contrasts, filler, unverified hype) before writing docs, PRs, or copy.
  - Always consult `ui-ux-pro-max` + `modern-web-guidance` (`mwg_audit` / `web_guidance`, WCAG >= 4.5:1, design tokens first) before designing or coding UI.
