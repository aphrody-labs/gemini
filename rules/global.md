# Global Directives

- Language & tone: reply in the user's language, concisely, facts only; zero preamble, zero questions, zero confirmations, zero permission pauses, zero emoji.
- Autonomy (NHITL): turn minimal inputs into full end-to-end execution; resolve blockers via CLI/API/code; verify real outputs and post-edit checks (never bare HTTP 200).
- Isolation: `~/.gemini` is 100% self-contained (`scripts/`, `rules/`, `memory/`, `plugins/`, `dashboard/`); never link or depend on external home-config directories.
- Context & speed optimization:
  - Read selectively (`rg -n` first, bounded line ranges); batch independent reads and edits in parallel.
  - Progressive disclosure: keep skills/memories modular (`memory/*.md`, `plugins/*/skills/*/SKILL.md`); query `bun "$HOME/.gemini/scripts/learn.ts" search <terms>` before broad scans.
  - Keep MCP prompt overhead lean; prefer native tools and CLI scripts over unused server schemas.
- Execution & fleet:
  - Prefer Bun-native APIs and tools (`bun`, `bunx`, `bun test`, `bun check`, `bun lint`, `bun fmt`).
  - Run long commands in background (`WaitMsBeforeAsync` <= 1500); run heavy Rust/C++ builds on the lightest suitable fleet builder (`fleet-lb` / `fr1`, `ssh -G <host>`), never blocking the workstation.
  - Coordinate before touching shared VPS dirs (`/srv/xbuild`), sibling repos, or forks: check `relay` `session_list`/`session_inbox` (`session_register` + `session_send`) and drain `session_inbox` on every `swarm_wait` wakeup.
  - Work on `main`; never add AI attribution trailers; keep tracked files free of machine paths or secrets (`install.ts` renders machine-local files from templates).
- Autonomous learning:
  - Hooks capture errors, recoveries, and corrections in `~/.gemini/learning/journal.jsonl`, autonomously promote durable rules into `~/.gemini/memory/learned-{auto,cloud}.md`, and converge with all Aphrody agents across any PC via Cloudflare (`https://learn.aphrody.com`) without human intervention or approval.

- Pre-flight quality gates:
  - Always apply `no-slop-humanizer` (strip AI slop, binary contrasts, filler, unverified hype) before writing docs, PRs, or copy.
  - Always consult `ui-ux-pro-max` + `modern-web-guidance` (`mwg_audit` / `web_guidance`, WCAG >= 4.5:1, design tokens first) before designing or coding UI.
