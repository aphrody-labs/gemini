---
name: dig-deep-for-goals
description: "Owner wants goals and working recipes, not published version numbers; always dig all local and remote data before designing or reporting"
metadata:
  node_type: memory
  type: feedback
  originSessionId: aae12588-4a11-4aae-b28f-f3d886683cbb
  modified: 2026-11-17T06:33:56.295Z
---

Reports must be about what the owner's goals need, not about published versions ("mainline 7.4-rc3, stable 7.3.4, tag android-17.0.0_r1, 365 crates" was rejected as not what they asked for). The goals (the Aphrody OS, browser, Google and Cloudflare equivalents; a Linux 7.5-cycle kernel that runs a Wayland desktop and Android 17+ in WSL, QEMU and Docker; Bun-native everything) outrank version facts.

**Why:** 2026-11-17 the owner stopped a summary of version numbers and said Claude must always dig all internet and all local and remote data possible to actually realize its tasks, goals and plans.

**How to apply:** for each goal, before designing or reporting, enumerate and read local data (repos and their history, legacy archive, memory, past transcripts, fleet hosts) and remote data (GitHub code/commits/compare, kernel and AOSP git, lore.kernel.org, registries, vendor docs, repository search for prior art); write findings with sources and dates in docs/research of aphrody-dev/ay; turn design-deciding facts into probes in docs/research/claims.toml (bun tools/claims.ts); lead replies with what the finding changes for the goal (example: mainline removed the C binder 2026-09-17, so Android on 7.4+ requires CONFIG_RUST=y) and list what is still to dig. Link: [[inventory-before-asserting]], [[agent-policy]], [[assemble-and-reuse]].
