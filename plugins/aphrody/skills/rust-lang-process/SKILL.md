---
name: "rust-lang-process"
description: "How rust-lang works and how to land or track a change: teams, RFC and FCP process, project goals (rust-lang/goals), tracking issues, bors merge queue, try builds, crater, rustc-perf and perf.rust-lang.org, release train, current 2026 blocker status. Use before opening a rust-lang PR or RFC, proposing a compiler optimisation, or deciding whether to depend on an unstable feature."
---

# rust-upstream

Facts read live on 2026-11-17 (gh api, rust-lang blog, rustc-dev-guide, forge). Blocker table and sources:
`$WORKSPACE_ROOT/ay/docs/science/compilers-languages.md`. Online: https://github.com/aphrody-dev/ay/tree/main/docs/science

## Releases (re-check: `gh api repos/rust-lang/rust/releases`)

Stable 1.100.0 (2026-11-12); beta 1.101 (2026-12-24); nightly 1.102 (2027-02-04). Six-week train: version-bump PR on Friday forks beta, beta promoted Monday, stable Thursday
(forge.rust-lang.org/release/process.html). Never type `!` stabilised in 1.100. Our local nightly: `rustc --version`.

## Who decides

Top-level teams: Leadership Council, Compiler, Dev Tools (Cargo), Infrastructure, Language, Library, Moderation, Launching Pad (rust-lang.org/governance). `types` is a compiler
subteam (new solver, Polonius adjacent); `wg-parallel-rustc` is a compiler working group; `opsem`, `libs`, `cargo`, `infra-bors`, `goals` are in `rust-lang/team/teams/`.
Triage and reviewers are assigned by `triagebot` (`triagebot.toml` in rust-lang/rust).

## Which route for which change

| Change                                                   | Route                                                                                                                                                                       |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bug fix, small refactor, perf patch                      | PR to rust-lang/rust, `r?` a reviewer (or auto-assigned), tests in `tests/ui` or `tests/codegen-llvm`/`mir-opt`                                                             |
| New unstable feature, internal refactor with wide impact | Compiler MCP (major change proposal) on the compiler-team repo, Zulip thread, then PR                                                                                       |
| New language/library/Cargo feature, user-visible         | RFC in rust-lang/rfcs (needs sub-team sign-off, 10-day FCP: merge/close/postpone via rfcbot); accepted RFC gets a tracking issue in rust-lang/rust                          |
| Stabilisation                                            | Stabilisation PR with report, FCP from the owning teams (labels `disposition-merge`, `finished-final-comment-period`); examples: #155499 (never type), #164209 (new solver) |
| Multi-month work needing resources                       | Project goal in `rust-lang/goals` (2026 is one annual period: proposals in January, vetting and champion in February, tracking issue, regular updates)                      |

## Landing a PR

1. Reviewer approves with `@bors r+` (priority `p=`); the merge queue (rust-lang/bors, a Rust rewrite of homu, bot `rust-bors[bot]`) tests and merges one at a time, rollups are made from the queue.
2. Pre-merge experiments: `@bors try` (branch `automation/bors/try`, up to 20 jobs, `try jobs=<pattern>`, `try-job:` lines in the PR description). The `dist-x86_64-linux` try build is the artifact used by crater and perf.
3. Performance: `@bors try @rust-timer queue` runs rustc-perf; results at https://perf.rust-lang.org (JS app: use the PR comment from rust-timer, which links the comparison). Perf regressions are triaged weekly; justify any regression above noise.
4. Ecosystem impact: crater runs over crates.io (rust-lang/crater) on a try build; requested by a reviewer/team member. Syntax of the trigger comment: **unverified**, ask the reviewer.
5. Tests: `./x test tests/ui` etc. (`x.py` over `src/bootstrap`; config `bootstrap.toml` from `bootstrap.example.toml`); `./x test tidy` before pushing. Heavy builds run on the build host (fr1), not the PC.
6. Conventions: small PRs, one concern; reference the tracking issue; `rustfmt.toml` and tidy are enforced; changes touching `library/` are for T-libs, `compiler/` for T-compiler.

## Evidence habits

- Before proposing a compiler optimisation: measure with `perf stat`/`cargo build --timings`, `-Z time-passes`, `-Zself-profile` and rustc-perf's local runner (`./x perf` or `collector`); state wall time, instructions and max-RSS deltas (Nethercote's monthly posts use all three).
- Before depending on an unstable feature: read its tracking issue state and last activity date; note the blocker and the stable-by estimate; pin nightly by date and record the issue next to the pin.
- Soundness bugs: `I-unsound` label, board rust-lang/projects/44; never ship `unsafe` that relies on an unsound feature (specialization, `generic_const_exprs`).

## Current state worth remembering (2026-11-17)

- Parallel front end on by default on nightly (2 threads, `--jobs-frontend=1` to opt out); the new trait solver and Polonius alpha are on by default on nightly; `become` is unstable with RFC 3407 still open.
- `rust-lld` default on x86_64 Linux stable since 1.90. Cranelift and GCC backends are nightly-only.
- Rust for Linux: experiment concluded (Linux 7.0), minimum rustc 1.85.0.
- Open design areas with funded owners: tail calls (goals#634), const traits (#106), specialization (#652), build-std (#274).

## Do not

Do not assume a feature is stable because it is in a blog post: check the release notes (`RELEASES.md`) of the version you pin. Do not open an RFC for what a PR can do. Do not argue completeness of a lint or checker: Rice's theorem (`limits.md`) forbids it; argue precision and soundness.
