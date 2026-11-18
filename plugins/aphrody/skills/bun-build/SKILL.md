---
name: bun-build
description: "Build, run and lint the Aphrody runtime (aphrody-labs/bun) from a checkout: `bun bd`, the 92 package.json scripts (gn, gn:vendor, vendor:audit, vendor:setup, depots_tools, depot_tools, chromium, factory, ...), build profiles, Windows/Linux toolchains, codegen and vendored dependencies."
---

# Building the Aphrody runtime

- VPS factory layout (Google style, see `docs/project/vps-factory.md`):
  `~/depot_tools` (daily `depot-tools-update.timer`), checkouts in
  `~/src/<project>` (chromium, chromiumos, cef, brave-core, bun), GN outputs in
  `~/build/out/<project>/<config>`, shared caches in
  `~/build/google/cache`, services in `~/apps`. Drive it with
  `bun factory sync|gen|build|all <target>`, which takes free build slots
  (multi-build mode, `bun factory slots`); `bun factory run -- <command>` runs
  any other heavy command, such as `bun bd`, in a slot.
- `/home` on `vps` is a single btrfs volume (subvolume `@home`, about 805 GiB
  over two disks); `/` stays on its own disk. Put heavy outputs, caches,
  downloads, toolchains and transient files under `~/build`, never
  on `/`. Check free space on `/` and `/home` before a large build.
- The existing Bun checkout is `~/src/bun`; do not resurrect the
  absent `~/builds/bun-os-factory/sources/bun` checkout. The factory
  policy lives in `tools/config/fusion-factory.json` and uses directories under `~/build`.
- Run `aphrody infra ssh exec` from `~` with
  `APHRODY_INFRA_ROOT=~` so `var/runs` receipts use the root
  filesystem. Changing the working directory alone does not relocate receipts.
  This root override is qualified for SSH execution; do not apply it globally
  to unrelated Infra commands. Plan before apply and verify the host through
  the native Infra catalog each time.
- Host budgets are independent: `dbfr` has 6 CPUs and about 11.40 GiB RAM and
  serves production. Never apply the VPS's 45.93 GiB budget to it.
- Use the Aphrody Bun fork for JavaScript, TypeScript and Python tooling.
  Check provenance with `bun agent-plugin doctor --json`.
- Build and execute checkout changes with `bun bd [command]`; test with
  `bun bd test <file>`. Installed Bun does not include checkout changes.
- Run type checking, lint, formatting and migration through the native commands
  `bun check`, `bun lint`, `bun fmt` and `bun n2b`. Do not delegate these commands
  to subprocess backends, standalone Oxc tools, tsgo/tsc or external n2b.
  Qualify checkout changes with `bun bd check`, `bun bd lint`, `bun bd fmt` and
  `bun bd n2b`; fix native failures instead of selecting an external fallback.
  Package scripts may expose these native commands, but must not replace them
  with wrappers or external backends.
- Build scripts accept trailing execution arguments. Put build flags before them;
  see `scripts/build.ts`. Do not invoke the debug executable directly.
- Run long builds asynchronously; keep user updates responsive. Do not impose
  a build timeout on `bun bd`.
- Declaration-only changes need no native build:
  `bun test test/integration/bun-types/bun-types.test.ts`.
- For platform changes, use `bun run rust:check-all`; gated code needs its target built.
- Debug logging: `BUN_DEBUG_QUIET_LOGS=1` or `BUN_DEBUG_<SCOPE>=1`.
- JSC exception checks: `BUN_JSC_validateExceptionChecks=1` and
  `BUN_JSC_dumpSimulatedThrows=1`.

## package.json scripts

Common targets: `bun run bd` (`scripts/build.ts --profile=debug --quiet`), `bun run build:release`, `bun run rust:check-all`, `bun run typecheck`, `bun run codegen:verify`, `bun run factory`.
See [bun-build-scripts](references/bun-build-scripts.md) for the complete 92-script inventory.

See also `scripts/build/CLAUDE.md` (build system internals and gotchas).

## References

Read the one that matches the task (`references/<name>.md`):

- [bun-build-scripts](references/bun-build-scripts.md): Complete 92-entry package.json script catalog (factory, chromium, build profiles, rust, codegen, buv, media)
- [bun-build-alpine](references/bun-build-alpine.md): Bun OS native Linux build owners, GNU and musl targets, pinned toolchains and separate release gates
- [bun-build-ci](references/bun-build-ci.md): Bun CI — Buildkite pipeline (.buildkite/ci.ts), build/test platforms, commit-subject tags, artifacts, test runner, ci:* / pr:comments scripts, GitHub Actions workflows
- [bun-build-codegen](references/bun-build-codegen.md): Every Bun codegen step (src/codegen/*) — inputs, scripts, outputs in build/<profile>/codegen, how Rust/C++ consume them (.classes.ts.bind.ts.bindv2.ts, ErrorCode.ts, src/js, LUTs, cppbind, HOST_EXPORT, string maps)
- [bun-build-commands](references/bun-build-commands.md): How to build/run/test Bun from <bun> — package.json scripts, `bun bd` arg routing, profiles, build dirs, exe names, ninja passthrough, clean
- [bun-build-deps-vendor](references/bun-build-deps-vendor.md): Vendored native deps (scripts/build/deps/*.ts, vendor/), allDeps order, BuildSpec kinds, WebKit prebuilt/local, version pins (LLVM, nightly, node), --local-deps, bump workflows
- [bun-build-lint-format](references/bun-build-lint-format.md): Rust workspace layout (Cargo.toml, rust-toolchain, profiles, workspace lints, clippy.toml bans), rustfmt, mordant, hawk, miri, rust:check-all, oxlint, prettier, clang-format, source-lints
- [bun-build-system-internals](references/bun-build-system-internals.md): Architecture of scripts/build/** (TS → build.ninja): phases, module inventory, Rust-per-crate ninja graph, flags tables, toolchain checks, how to add a flag/profile/config field/rule/workaround
- [bun-build-tooling-misc](references/bun-build-tooling-misc.md): Bun auxiliary tooling — tools/dev (lldb printers, completions, unicode tables), bench/, packages/, tools/hawk, and the scripts/ helpers (orderfile, verify-baseline, binary-size, debug-coredump, gamble, trace, sync-_, update-_)
- [bun-build-windows](references/bun-build-windows.md): Building Bun natively on this Windows machine (<bun>) — prerequisites, MSVC env via `bun msvc sync` (ex vs-shell.ps1), tool discovery, local state (build/debug/bun-debug.exe, caches), Windows-specific gotchas, cross-compiling Windows from Linux
