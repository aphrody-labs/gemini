---
name: repo-independence
description: Every aphrody-dev / aphrody-labs repo must be independent, with coherent non-blocking prefixes, namespaces and scopes
metadata:
  type: project
---

Owner decision 2026-11-17: all repos (local under WORKSPACE_ROOT and on GitHub) are independent: each builds, tests and releases alone from a clean clone; cross-repo use only through published versions or pinned SHAs, always optional; no sibling-checkout or branch coupling; no repo blocks another. Names follow one scheme of prefixes, namespaces and scopes per registry, read from each repo's own manifest, flexible and interchangeable. Scheme and checker live in aphrody-labs/.github `naming/` (NAMING.md, naming.toml, check.ts).

**Why:** cross-repo coupling (submodules at main, shared scripts, hardcoded slugs) made CI fragile and blocked changes.

**How to apply:** before adding a dependency on another of our repos, use a registry version or pinned SHA behind a flag; name new packages from naming.toml. Related: [[ay-hub-source-of-truth]], [[naming-and-privacy]], [[assemble-and-reuse]].
