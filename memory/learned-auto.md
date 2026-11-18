# Autonomous Self-Learned Rules & Recoveries

Folded without human intervention from hook telemetry.
- [error] edit_file => target content not found in the file; the Target must exactly match existing file text, including whitespace
- [recovery] Recovered from [edit_file] via [edit_file]
- [recovery] Recovered from [edit_file] via [bun scripts/cargo.ts test --manifest-path apps/ui/Cargo.toml]
- [recovery] Recovered from [edit_file] via [write_file]
- [recovery] Recovered from [edit_file] via [Remove-Item -Force -ErrorAction SilentlyContinue "apps/rg-website/public/notfound.png.webp", "apps/rg-website/public/images/noise.svg", "apps/rg-website/public/Super Cartoon.ttf", ]
- [recovery] Recovered from [edit_file] via [rg -n "DISCORD_PUBLIC_KEY|interactions/execute|static/rg/public|NEXT_PUBLIC_CDN_ORIGIN|ROSEGRIFFON_CDN_BASE" apps packages infra scripts]
- [recovery] Recovered from [edit_file] via [@' import { readFileSync } from "node:fs"; for (const [p, needle] of [ ["crates/gpui-base/src/scroll_bounce.rs", "#[cfg(not(feature = \"gpui-fast"))]"], ["crates/gpui-base/src/scro]
- [recovery] Recovered from [edit_file] via [rg -n "seed_hex" assets/os/ product.toml rg -n "fn contrast_ratio" crates/nsh-core/src crates/gpui/src rg -n "#[cfg.*gpui-fast" crates/]
- [recovery] Recovered from [edit_file] via [Remove-Item -Recurse -Force 'apps/rg-website/src/app/(sousdossiers)/a-propos/contact', 'apps/rg-website/src/app/(auth)/login/_components/social-icons.tsx' -ErrorAction SilentlyCont]
- [recovery] Recovered from [edit_file] via [rg -n -C 5 "TOOLS =|AVAILABLE COMMANDS|Unknown command|rg_search" apps/cli/src/index.ts apps/mcp/src/index.ts]
- [recovery] Recovered from [write_file] via [write_file]
- [rule] Offload heavy Rust/C++ builds to `fr1`/`fr2` under `/srv/` only; never run heavy builds on the local workstation or create work directories in `/home/ubuntu`.
- [rule] In Windows PowerShell, chain commands with `;` (never `&&`) and call `curl.exe` (never `curl` alias).
- [rule] Parallelize independent tool calls (`fr1`, `fr2`, `gh`, `bun`, `browser`) and never pause passively when actionable work remains.
- [rule] Read MCP schema JSON before calling (`relay/hub_tools` uses `query`, not `search`) and report only counts, statuses, and paths directly observed in tool output.
