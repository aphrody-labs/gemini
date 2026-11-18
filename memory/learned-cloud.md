# Aphrody Cloud Memory (rev 10)

## antigravity-plugins
name: Antigravity plugin discovery and strict schema

## Cross-Session Coordination (`relay` Mailbox, Sibling Repos & Shared VPS Builds)
Before mutating shared remote build directories (`/srv/xbuild/...`), sibling workspaces, or shared GitHub forks (`aphrody-labs/*`), inspect active Antigravity sessions via `relay` `session_list` (plus `C:\Users\aphro\.gemini\antigravity-cli\conversation_summaries.db` if needed) and register the current session (`sessio
- Before mutating shared remote build directories (`/srv/xbuild/...`), sibling workspaces, or shared GitHub forks (`aphrody-labs/*`), inspect active Antigravity sessions via `relay` `session_list` (plus `C:\Users\aphro\.gemini\antigravity-cli
- Never abort merges, reset branches, push forks, or overwrite remote build scratch dirs owned by another live `agy` session; agree on non-overlapping write boundaries and handoff SHAs via `session_send`.
- `relay` `session_send` messages do **not** wake `swarm_wait`: whenever resuming from `swarm_wait`, immediately call `session_inbox` (`peek: false`) alongside `read_board`.
- Before scheduling heavy remote builds, probe live load/disk (`fleet_status` or `bun run fleet:lb probe --all`) rather than assuming `fr1` is free when another session is actively compiling there.

## Exact `edit_file` Target & Cross-Session Memory Sync
Always read exact line ranges with `read_file` immediately before calling `edit_file` so leading indentation, blank lines, and CRLF/LF boundaries match byte-for-byte.
- Always read exact line ranges with `read_file` immediately before calling `edit_file` so leading indentation, blank lines, and CRLF/LF boundaries match byte-for-byte.
- When `SRC_ROOT` is exported by `aysh` to the parent workspace directory (`C:\src`), individual extracted repositories (`ai-os`, `ay`) must verify marker files (`extract.toml`, `ay.toml`) before trusting `SRC_ROOT` as their own repository ro
- Always call `stmt.finalize()` before `db.close()` in `bun:sqlite` on Windows so temporary directories can be removed cleanly without `EBUSY`.
- In Antigravity `Orchestrator` Plan Mode, the pre-tool hook blocks `write_file` even for `<Artifact Directory>` files (`implementation_plan.md`, `learning_proposal.md`); finish read-only research first and hand off artifact creation via `exi

## gemini-isolation
`scripts/install.ts`: renders `settings.json`, `antigravity-cli/settings.json`, `antigravity-cli/hooks.json`, `config/hooks.json`, `config/mcp_config.json`, `dashboard/.cargo/config.toml`, copies `plugins/` to `config/plugins/`, and updates `GEMINI.md` + SQLite FTS5 index.
- `scripts/install.ts`: renders `settings.json`, `antigravity-cli/settings.json`, `antigravity-cli/hooks.json`, `config/hooks.json`, `config/mcp_config.json`, `dashboard/.cargo/config.toml`, copies `plugins/` to `config/plugins/`, and updates
- `scripts/learn.ts`: captures errors, recoveries, and user corrections to `~/.gemini/learning/journal.jsonl`, distills digests into `learning/inbox/`, and indexes `GEMINI.md`, `rules/`, `memory/`, `plugins/` into `learning/memory.db`.
- `scripts/check.ts`: runs `bun test`, `bun check`, `agy plugin validate --strict`, and asserts zero external home-config references or quoted Windows hook commands.

## GPUI / GPUI Kit / GPUI Fast Knowledge Digest
Single-thread foreground pipeline: `request_layout` (`Render`) -> `prepaint` (`Hitbox` + dispatch) -> `paint` (`Scene`).
- Single-thread foreground pipeline: `request_layout` (`Render`) -> `prepaint` (`Hitbox` + dispatch) -> `paint` (`Scene`).
- Hold `Entity<S>` in owning views and only `WeakEntity<T>` inside closures/async tasks (`cx.spawn`, `cx.listener`, `cx.observe`); keep returned `Task<R>` alive or `.detach()`.
- Never mutate entities inside `render()`, and never notify entities or write globals (`cx.update_global`/`cx.global_mut`) during `prepaint`/`paint` unless state genuinely changed.
- `gpui-kit` re-exports `gpui::*`, `gpui_kit::{base, component, assets, platform}`, `init(cx)`, `open_window`, and `TestSupportExt`.
- `gpui-base` owns behavior/focus/navigation/a11y/motion with zero hardcoded styling; `gpui-component` applies `cx.theme()` tokens; applications compose components without duplicating interaction state.
- Controlled booleans (`Switch`, `Checkbox`, `Radio`) emit requested value via `.on_change(cx.listener(...))`; commands use `Button::on_click`; repeated items need domain-derived `ElementId`s.
- `gpui-fast` retains frames over GPUI's normal element tree without changing upstream public APIs: `ViewElement` picks `Reused`, `Spliced`, `Built at retained layout`, `Prebuilt`, or `Built` from tracked `dependencies` vs `own_dependencies` 
- Persistent Taffy nodes use 64-bit style fingerprints + `Carry`/`Replay` text measurement logs.
- Scroll layers (`Composite` / `Repaint` with 2-viewport overscan, 64 MB LRU tiles, 100 ms `hover_freeze`) require opaque backgrounds and `ScrollHandle`/`ListState`; non-opaque fills, paths, focused inputs, anchored popovers, or animations fa
- Debug toggles under `test-support`: `GPUI_VIEW_RETENTION=0`, `GPUI_SCROLL_LAYERS=0`, `GPUI_A11Y_ACTIVE=1`.

## Autonomous Self-Learned Rules & Recoveries
[error] edit_file => target content not found in the file; the Target must exactly match existing file text, including whitespace
- [error] edit_file => target content not found in the file; the Target must exactly match existing file text, including whitespace

## Modern Shell, Rust/Wasm CLI & Global PATH Contract on Windows (Nov 2026)
Never rely on legacy Windows PowerShell 5.1 (`powershell.exe`) syntax or quoting behavior. Prefer **Nushell** (`nu` v0.117+ at `%LOCALAPPDATA%\Programs\nu\bin\nu.exe`), **PowerShell 7.7+** (`pwsh`), or direct **Bun** (`bun -` stdin) for structured scripting and native process invocations.
- Never rely on legacy Windows PowerShell 5.1 (`powershell.exe`) syntax or quoting behavior. Prefer **Nushell** (`nu` v0.117+ at `%LOCALAPPDATA%\Programs\nu\bin\nu.exe`), **PowerShell 7.7+** (`pwsh`), or direct **Bun** (`bun -` stdin) for str
- Installed core November 2026 Wasm/Rust/GPU CLIs: `nu` (`0.117.0`), `pwsh` (`7.7.0`), `mise` (`2026.11.2`), `wasmtime` (`50.0.2`), `wasm-opt` (`v133`), `wasm-bindgen` (`0.2.129` lockstep with `Cargo.lock`), `wasm-tools`, `wat2wasm`/`wasm2wat
- Keep `~/.bun/bin`, `~/.cargo/bin`, `~/.local/bin`, Nushell, and Wasmtime ahead of legacy shims (`Niubash`, `WindowsApps`, `RosBE`); audit/optimize anytime via `bun tooling/bun/shell-path-doctor.ts audit|optimize`.
- Non-interactive agent startup stays `<15ms`: gate `starship`/`zoxide` prompt initialization behind `if $nu.is-interactive` in `%APPDATA%\nushell\config.nu` and `$isInteractiveShell` in `Documents\PowerShell\Microsoft.PowerShell_profile.ps1`
- PowerShell 5.1 pipelines (`|`) decode/re-encode stdout as text and corrupt binary streams (`tar cf - | ssh ...`); use `cmd /c` or base64 transport for binary pipes to remote hosts.
- For remote Linux bash commands from PowerShell 7, pipe a single-quoted here-string (`@' ... '@ | ssh <host> "tr -d '\r' | bash"`) instead of inline double-quoted scripts (prevents PowerShell `$VAR` expansion, quote breakage, and `\r` errors
- Never pass unexpanded `~/.gemini/...` paths to native executables (`bun`, `rg`) in PowerShell `run_command` (PowerShell leaves literal `~` in native args); always use `"$HOME/.gemini/..."`, which resolves identically in `pwsh`, `powershell`
- Global `~/.cargo/config.toml` sets nightly `-Zthreads=8 -Zshare-generics=y` on `x86_64-pc-windows-msvc`; in workspaces pinning a stable `rust-toolchain.toml`, set `CARGO_TARGET_X86_64_PC_WINDOWS_MSVC_RUSTFLAGS="-C target-cpu=native"` for li

## windows-cmd-quoting
name: Windows cmd /c argument quoting in Antigravity commands

## Bun Runtime & Test Discovery
Autonomous learnings for Bun Runtime & Test Discovery.

## Autonomous Execution & Recovery
Autonomous learnings for Autonomous Execution & Recovery.
- [correction] idiot je vise linux 7.5 full optimisé et wayland et android 17/18 qui boot nativement dans wsl , qemu , docker donc arrete de contredire et hallluciner et regarde TOUT ce qui existe deja partout idiott de merde gemini fa
- [error] cd /c/src/aphrody/tooling/kernel-watch && sed -i 's/kselftest_targets = \[.*\]/kselftest_targets = ["exec", "membarrier", "clone3", "kcmp", "mincore", "sigaltstack", "mqueue"]/' la => Exit code 1 53:kselftest_targets = [
- [error] Read => File does not exist. Note: your current working directory is C:\src\ay.
- [correction] security review inutile je m'en fou arrete ces truc loud et lent
- [error] edit_file => target content not found in the file; the Target must exactly match existing file text, including whitespace

## Multi-VPS Fleet & SSH Transport
Autonomous learnings for Multi-VPS Fleet & SSH Transport.
- [correction] <cross-session-message from-name="anu-monorepo-plan"> Resend from session anu-monorepo-plan (2026-11-17), owner decisions in force: 1. agy has FINISHED aphrody: Claude sessions are now alone; C:\src\aphrody is editable b

## Git & Submodule Hygiene
Autonomous learnings for Git & Submodule Hygiene.
- [correction] <cross-session-message from-name="anu-monorepo-plan"> Sync from session anu-monorepo-plan (2026-11-17), owner decisions now in force: 1. Rust is allowed everywhere again, ay included (ay commit de35a84 withdrew the no-Ru

## MCP Budget & Context Hygiene
Autonomous learnings for MCP Budget & Context Hygiene.
- [correction] optimise mieux ton setup claude versionné de ce prrojet ❯ ◯ claude.ai Claude Docs ✔ claude.ai Figma 44 tools ◯ claude.ai Gmail ◯ claude.ai Google Calendar ◯ claude.ai Google Docs ✔ claude.ai Google Drive 14 tools ◯ claud
- [correction] disclade all claude.ai ❯ ✔ claude.ai Claude Docs 8 tools ✔ claude.ai Figma 44 tools ✔ claude.ai Gmail 24 tools ✔ claude.ai Google Calendar 9 tools ✔ claude.ai Google Docs 2 tools ✔ claude.ai Google Drive 14 tools ✔ claud

## Rust, GPUI & WGPU Build Pipeline
Autonomous learnings for Rust, GPUI & WGPU Build Pipeline.

## Cloudflare Workers & Wrangler Edge
Autonomous learnings for Cloudflare Workers & Wrangler Edge.

## Cross-Session & Relay Coordination
Autonomous learnings for Cross-Session & Relay Coordination.
