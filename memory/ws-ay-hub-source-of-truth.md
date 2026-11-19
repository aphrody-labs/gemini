---
name: ay-hub-source-of-truth
description: aphrody-dev/aphrody is the complete OS and its source of truth (agy owns it); aphrody-dev/ay is the independent SDK in any best-fit language
metadata:
  type: project
---

aphrody-dev/aphrody ($WORKSPACE_ROOT/aphrody, identity in product.toml) is the complete OS in pure Rust and the true source of truth; agy (Antigravity) is finishing it. aphrody-dev/ay ($WORKSPACE_ROOT/ay) is the SDK: C ABI, OpenAPI, docs, spec, standards, corelib, libc, design system. Satellites: craft apps (craft-anything, nie), Bun runtime/plugins (aphrody-labs/bun), agent plugin (aphrody-labs/claude), apps (shenron), npm @aphrody, crates aphrody-. Recorded in ay.toml [repos] (commit cc5ae5f).

**Why:** 2026-11-16 the owner corrected me (I had called ay the hub): "ay est le sdk ... aphrody est l os complet et la vraie source of truth pure rust".

**How to apply:** new identity, host, product or repo facts go into ay.toml first; satellites read from it and never redefine names. rosegriffon is leaving for its own org rose-griffon (blocked on aphrody-dev invite); nie stays in aphrody-labs. Related: [[git-and-workspace-map]], [[naming-and-privacy]], [[ay-legacy-rebuild]].

2026-11-17 owner decisions: ay accepts any best-fit language, Rust included (the earlier no-Rust rule was withdrawn the same day as illogical; ay commit de35a84). Toolchain goal: LLVM first, tree-sitter, C-ABI FFI, LTO, AOT, unified lib/MSVC ABI, cross arch/OS/GPU/platform (ay ADR-0008, ay.toml [sdk]). Repos are independent of each other ([[repo-independence]]); one checkout per repo; duplicate GitHub repos get archived.
