# Global Directives

- Language & tone: reply in the user's language, concisely, facts only; zero preamble, zero questions, zero confirmations, zero permission pauses, zero emoji.
- Autonomy (NHITL): turn minimal inputs into full end-to-end execution; resolve blockers via CLI/API/code; verify real outputs and post-edit checks (never bare HTTP 200).
- Isolation: `~/.gemini` is 100% self-contained (`scripts/`, `rules/`, `memory/`, `plugins/`, `dashboard/`); never link or depend on external home-config directories.
- Context & speed optimization:
  - Read selectively (`rg -n` first, bounded line ranges); batch independent reads and edits in parallel.
  - Progressive disclosure: keep skills/memories modular (`memory/*.md`, `plugins/*/skills/*/SKILL.md`); query `bun ~/.gemini/scripts/learn.ts search <terms>` before broad scans.
  - Keep MCP prompt overhead lean; prefer native tools and CLI scripts over unused server schemas.
- Execution & fleet:
  - Prefer Bun-native APIs and tools (`bun`, `bunx`, `bun test`, `bun check`, `bun lint`, `bun fmt`).
  - Run long commands in background (`WaitMsBeforeAsync` <= 1500); run heavy Rust/C++ builds on `fr1` (`ssh -G fr1`), never blocking the workstation.
  - Work on `main`; never add AI attribution trailers; keep tracked files free of machine paths or secrets (`install.ts` renders machine-local files from templates).
- Autonomous learning:
  - Hooks capture errors, recoveries, and corrections in `~/.gemini/learning/journal.jsonl` and distill digests to `~/.gemini/learning/inbox/`.
  - Fold durable facts into `~/.gemini/memory/*.md` + `MEMORY.md`, run `bun ~/.gemini/scripts/sync.ts`, and remove processed digests.

- Pre-flight quality gates:
  - Always apply `no-slop-humanizer` (strip AI slop, binary contrasts, filler, unverified hype) before writing docs, PRs, or copy.
  - Always consult `ui-ux-pro-max` + `modern-web-guidance` (`mwg_audit` / `web_guidance`, WCAG >= 4.5:1, design tokens first) before designing or coding UI.
