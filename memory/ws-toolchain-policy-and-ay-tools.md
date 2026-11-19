---
name: toolchain-policy-and-ay-tools
description: "One Rust/cargo-tools/sccache/Bun policy for every repo (aphrody-labs/.github templates/toolchain.toml + tools/toolchain.ts), and the ay-tools repo that merges just, turborepo, bazel, depot_tools in Rust"
metadata:
  node_type: memory
  type: project
  originSessionId: aae12588-4a11-4aae-b28f-f3d886683cbb
  modified: 2026-11-17T13:55:41.378Z
---

The organization toolchain is one file: `aphrody-labs/.github` `templates/toolchain.toml` (Rust channel, 22 cargo tools pinned for `cargo binstall`, sccache, Bun `[install]` policy: isolated linker, global store, exact, 3-day release age) read by `tools/toolchain.ts` (`check`, `apply`, `update`, `host <ssh-host> install|unused <repo>`). Shape follows Zed (zed-industries/zed rust-toolchain.toml, profiles, nextest, typos, sccache); version is the latest stable (1.100.0 on 2026-11-17) where Zed pins 1.98.1.

**Why:** the owner asked to bump every toolchain and align everything on Zed; a measured warm `bun install` with isolated + global store was 29 ms against 460 ms cold.

**How to apply:** change versions only in `templates/toolchain.toml` (or `bun tools/toolchain.ts update`), then `apply` to clean checkouts and verify with `cargo check --workspace` on the build host before committing each repo. Never apply to `bun` (its own tuned profiles), `rosegriffon` (other organization) or a file with uncommitted changes. See [[pc-no-local-builds]].

`aphrody-dev/ay-tools` (Rust workspace, binary `ay`) merges just, Turborepo, Bazel with rules_rust and rules_cc, depot_tools and the Chrome Build Team tools. GitHub upstreams are submodules of aphrody-labs forks (`forks.toml` with `meta.consumer`, managed by rust-mono `tools/add.ts`, `fork.ts`, `submodules.ts`); Chromium sources are pinned references fetched into `.cache/`. First crate `ay-tools-deps` (gclient DEPS) is parity-tested against depot_tools' own `gclient_eval` on Chromium's DEPS.

ay-tools holds no vendor/third_party/submodules: forks are plain folders fetched into the data directory (`tools/home.ts`: AY_TOOLS_HOME, ay-tools.local.toml, then the platform data dir). `tools/chromium.ts` derives every Chromium build-tool pin from the real DEPS of the pinned Chromium (160.0.8166.0) through ay-deps and cross-builds Windows MSVC binaries (Go with GOOS=windows; ninja with clang-cl and thin LTO; ay-deps with cargo-xwin and fat LTO). The `windows` workflow (GitHub, ubuntu runner) does it on every change and every Monday and publishes to R2 bucket `aphrody-chromium`, prefix `ay-tools/`; the downloaded artifact ran on the Windows PC (ninja 1.12.1, ay-deps 195 deps for linux/x64). fr1's cargo-xwin cache is incomplete (no um libs, the download hangs): build C++ for Windows in the workflow, not on fr1. The workers.dev Worker `ay-tools-release` answers 429 (error 1027): the account is on Workers Free and hit the daily request limit (verified 2026-11-17: 170k requests that day, 80% from the `aphrody-github` events Worker); fix the receiver or move to Workers Paid (owner's decision). See ADR-0012 in `ay` and the private `.private/research/cloudflare-inventory.md`.

Secrets live in `C:\data\secrets` (GitHub App key for `aphrody-labs`, already installed into the org secret APHRODY_APP_KEY) and `C:\src\ayvpn\.secrets` (Mullvad account, git-ignored since 2026-11-17). Use them without echoing; never type a real account into a login form; the Mullvad client is already installed and logged in on the PC (`bun tools/setup.ts` in ayvpn sets its options, never connects).
