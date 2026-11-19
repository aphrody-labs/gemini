---
name: code-standard-unified
description: "Unified code/commit/PR/review standard lives in aphrody-labs/.github docs/standards (2026-11-17); tools, decisions, how to refresh sources"
metadata:
  node_type: memory
  type: project
  originSessionId: aae12588-4a11-4aae-b28f-f3d886683cbb
  modified: 2026-11-17T06:12:11.028Z
---

Unified standard (TS on Bun, Rust userland/kernel-facing/browser-facing, tests, comments, commits, PRs, reviews) is in `aphrody-labs/.github`: `docs/standards/code-style.md` (rule rows with source tag + status), `conflicts.md` (C-01..C-30), `sources.toml` (70 sources with rev/date/sha256, plus the Jarred-Sumner PR measurement), `commit-format.md`; templates in `templates/` (gitmessage, REVIEW.md, bunfig.standard.toml, rustfmt*.toml, rust-lints.toml, clippy.toml); STANDARD.md section 19; `[code_style]` and `[[files.templates]]` in standard.toml.

Tools (run with bun in that repo): `tools/check-commit.ts` (commit-msg, `--title`, `--range`), `tools/lint-code-style.ts`, `tools/standards-sources.ts check|refresh|verify`, `tools/bun-practice.ts`, `tools/code-style-survey.ts`.

**Why:** owner asked for one standard built from Bun/Jarred Sumner practice, Google guides, Rust for Linux, Rust for Chromium and the Rust style guide; Bun's `bun fmt`/`bun lint` output wins for Bun-run code.

**How to apply:** when writing or reviewing commits/PRs/Rust/TS, follow code-style.md; subject `type(scope): imperative`, 72 chars, no AI trailers; rustfmt stable baseline, warn lints + `-D warnings` in CI. Rust config validation runs only on fr1/fr2 (never the PC). Refresh sources with `bun tools/standards-sources.ts refresh`.
