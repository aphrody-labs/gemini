---
name: assemble-and-reuse
description: Upstream-first assembly, reusing existing work/registries before coding, continuous deduplication, and measured performance
type: feedback
---

- **Reuse before writing**: search `docs/project/restore-inventory.json`, git history (`git log --all -S`), published crates/npm packages under the org, `third_party/`, and VPS containers before building any new unit.
- **Upstream-first assembly**: locate the highest-signal active upstream library/framework per domain (GitHub API, Context7, package registries) and absorb, flatten, optimize, or wire it rather than reinventing custom glue.
- **First-party audit**: honor `docs/audit/first-party.md` / `first-party.jsonl` consolidation decisions (`delete`/`merge`/`replace`/`move`), verifying consumers before deleting.
- **Measure performance**: back architecture, compression/archive, and XFS/filesystem optimizations with real before/after benchmarks (`hyperfine`, `cargo timings`, size diffs) run on `fr1`/`fr2`. Delete dead code directly; history lives in git.
