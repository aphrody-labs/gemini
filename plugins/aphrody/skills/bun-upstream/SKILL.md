---
name: "bun-upstream"
description: "How to contribute to and optimise oven-sh/bun (and our fork aphrody-labs/bun): current Rust+C++ source layout, build (bun bd), tests, benchmarks (mitata), BuildKite CI, PR and AI-policy rules, open issue classes, JSC/WebKit pin. Use before changing Bun source, filing or fixing an upstream issue, or benchmarking Bun."
---

# bun-upstream

Facts read live on 2026-11-17 (re-check anything that drives a decision: `gh api repos/oven-sh/bun/releases/latest`).
Blocker classes and numbers: `$WORKSPACE_ROOT/ay/docs/science/compilers-languages.md` (Bun section). Online: https://github.com/aphrody-dev/ay/tree/main/docs/science

## State of upstream

- Bun is no longer Zig. PR oven-sh/bun#30412 "Rewrite Bun in Rust" closed 2026-05-14; v1.3.14 (2026-05-13) still had `src/main.zig`, v1.4.0 (2026-08-20) does not.
  `gh api repos/oven-sh/bun/languages`: Rust 88.6 MB, C++ 14.4 MB, TypeScript 10.6 MB, C 1.1 MB.
- Latest release `bun-v1.4.4` (2026-10-22). Rust is pinned in `rust-toolchain.toml` (`nightly-2026-11-14` in our checkout); edition 2024; LLVM 23.1.1 enforced.
- Tree: one Cargo workspace whose members are `src/*` (about 134 crates in our checkout; no `crates/` dir), `src/codegen/*.ts` (bindgen, cppbind, bundle-modules),
  C++ JSC bindings in `src/jsc/bindings`, `packages/`, `test/`, `bench/`, `scripts/build/` (TypeScript build generating ninja; `scripts/build/deps/*.ts` recipes fetch vendored deps).
- JSC comes from `oven-sh/WebKit` (pin in `scripts/build/deps/webkit.ts`, `WEBKIT_VERSION`); local JSC: clone into `vendor/WebKit`, `bun sync-webkit-source`, `bun run build:local`.
- Our fork `aphrody-labs/bun` keeps upstream's layout so merges stay mechanical; fork-only files (`naming.toml`, `paths.allow`, `aphrody-windows.yml`) are additive.

## Workflow

1. Search first: `gh search issues --repo oven-sh/bun "<words>"`; duplicates are closed. Reproduce on the latest canary (`bun upgrade --canary`) before filing.
2. Build: `bun run build` (debug, `build/debug/bun-debug`, ASan on by default on Linux/macOS); `bun bd <args>` builds and runs, e.g. `bun bd test test/js/bun/foo.test.ts`, `bun bd ./repro.ts`.
   Fast Rust check: `cargo check -p <crate>` or `bun run rust:check`. Heavy builds go to the build host (fr1), not the PC.
3. Test: put the test where the area lives (`test/js`, `test/cli`, `test/bundler`, `test/regression`, `test/napi`, `test/bake`); `bun bd test <file>`. The new test must fail without the fix (run it with the system `bun`, it should fail).
4. Verify with the debug binary end to end, not by reading code. For crashes capture the panic text and the exact Bun version.
5. Benchmark (perf claims): `bench/` has its own `package.json` (`bun install` there; mitata 1.0.20); `bun run <name>` from `bench/`, `BUN=path/to/bun` picks the binary. There is no `bun bench` subcommand.
   Use a release build (`bun run build:release`), compare against the system Bun and Node on the same script, report mean and spread (skill `perf-math`).
6. PR: template asks "What does this PR do?" and "How did you verify your code works?". Answer both with commands and output.
7. CI is BuildKite (`.buildkite/ci.mjs`); helpers `bun run ci:status|errors|logs` need `bk` and `BUILDKITE_API_TOKEN`. GitHub Actions only lint, format, release and dependency bumps.
8. Docs voice (`docs/project/contributing.mdx`): active voice, present tense, every example run.

## AI policy (enforced by `.github/workflows/on-slop.yml`)

A PR labelled `slop` is auto-closed. Causes: the problem was not verified to exist, the fix was not tested, wrong assumptions about the codebase, incomplete or misleading text.
AI-written PRs are accepted when they pass those four tests. So: reproduce, test, read the surrounding code, say what was run.

## Open issue classes (snapshot 2026-11-17, `is:issue is:open`)

3,831 open issues and 5,946 open PRs. By label: bug 1,900; needs triage 525; bun install 330; bundler 258; confirmed bug 203; crash 190; bun:test 160; windows 141;
needs investigate 95; performance 89; linux 82; bun:serve 69; macOS 68; jsc 66; single-file-executable 51; node:fs 36; regression 36; web:fetch 32; node:http 29; bun:sqlite 29;
sql 27; napi 26; memory usage 24. 510 issues opened and 207 closed in the 30 days before: the backlog grows. Recent crash families: JSC GC write barriers and B3 register
allocation (`jsc`), AOT checker panics, Windows file-lock errors. Best contribution targets: `good first issue` (29), `confirmed bug` with a repro, `performance`, `regression`.
Query form: `gh api -X GET search/issues -f q='repo:oven-sh/bun is:issue is:open label:"performance"' -f per_page=1 --jq .total_count`.

## Optimisation entry points

Hot paths: HTTP server (`bun:serve`, uWebSockets in `packages/bun-usockets`), `node:http`/`node:fs` compat, bundler/transpiler (`js_parser`), install, streams, SQLite/SQL, JSC startup
and the AOT work in `oven-sh/WebKit` (most active area of open PRs on 2026-11-17). Model first (`async-design`, `perf-math`), profile second (`perf`, ETW, `--cpu-prof`), change last.
