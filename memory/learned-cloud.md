# Aphrody Cloud Memory (rev 8)

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
- [recovery] Recovered from [edit_file] via [edit_file]
- [recovery] Recovered from [edit_file] via [bun scripts/cargo.ts test --manifest-path apps/ui/Cargo.toml]
- [recovery] Recovered from [edit_file] via [write_file]

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
- [recovery] Recovered from [bun check -p tools 2>&1 | tail -2 && bun fmt --check tools/acceptance.ts tools/acceptance/store.ts tools/acceptance/net.ts tools/acceptance/serve.ts tools/acceptance/deploy.ts tool] via [git add -A -- too
- [recovery] Recovered from [for h in fr1 fr2; do tar cf - tools build/engines/build.sh bunfig.toml package.json 2>/dev/null | ssh -o BatchMode=yes $h 'rm -rf /tmp/acc2 && mkdir -p /tmp/acc2 && tar xf - -C /tm] via [tail -4 "C:/Users
- [recovery] Recovered from [bun -e ' const lock = await Bun.file("tools/upstreams.lock.json").json(); const imported = Object.entries(lock).filter(([n]) => n !== "bun").flatMap(([n, v]) => Object.values(v.cra] via [bun -e ' const lo
- [recovery] Recovered from [git status --short | head -3; mkdir -p "$TEMP/layout/tools" && bun -e ' let s = await Bun.file("tools/flatten.py").text(); const rep = (a, b) => { if (!s.includes(a)) throw new Err] via [cat > "$TEMP/layo
- [recovery] Recovered from [ssh prd 'checkupdates 2>&1 | head -20; echo rc=$?; checkupdates 2>&1 | wc -l; ls -d /tmp/checkup*'] via [cat > /c/Users/aphro/AppData/Local/Temp/inv/edit5.ts <<'EOF' const f = "C:/src/bun/tools/mirror/mir
- [recovery] Recovered from [cd /tmp/n2breg.OOHa/x/*/ && wc -l registry/*.toml; cat README.md | head -40; cat src/schema.rs | head -150; head -40 registry/apis.toml; head -30 registry/modules.toml; head -20 re] via [echo "== bun fork
- [recovery] Recovered from [mkdir -p /tmp/std && cd /tmp/std && gh pr list -R oven-sh/bun --author Jarred-Sumner --state merged --limit 100 --json number,title,body,additions,deletions,changedFiles,mergedAt,c] via [cd /c/src/bun/pac
- [recovery] Recovered from [D=$(cygpath -m "$TEMP")/stdsrc; mkdir -p $D; echo $D; cd $D && gh pr list -R oven-sh/bun --author Jarred-Sumner --state merged --limit 100 --json number,title,body,additions,deleti] via [ls /c/src/ay/node
- [recovery] Recovered from [cd /c/src/aphrody/tooling/kernel-watch && sed -i 's#^ls -l "\$dst"#chown "${HOST_UID:-1000}" "$dst"/*\nls -l "$dst"#' lane/assemble.sh && sed -i 's#{ ID: k.id, SOURCE: source, PACK] via [cd /c/src/ay/tool
- [recovery] Recovered from [cd /c/src/browser/third_party/agent-browser/packages/@agent-browser/sandbox/test && for f in mcp shared vercel; do bun /tmp/codemod/assert2expect.ts $f.test.mjs $f.test.ts; done; r] via [cd /c/src/browser

## Autonomous Execution & Recovery
Autonomous learnings for Autonomous Execution & Recovery.
- [recovery] Recovered from [cd "$TEMP/layout" && tar cf - layout.ts layout.toml tools third_party-README.md AGENTS.md README.md ARCHITECTURE.md i18n.toml .gitignore build tools/acceptance.toml tools/upstreams] via [ls "$TEMP/layout"
- [correction] idiot je vise linux 7.5 full optimisé et wayland et android 17/18 qui boot nativement dans wsl , qemu , docker donc arrete de contredire et hallluciner et regarde TOUT ce qui existe deja partout idiott de merde gemini fa
- [recovery] Recovered from [cat > /tmp/edit_up.py <<'EOF' p = "tools/import.py" s = open(p).read() s = s.replace('''usage: import.py <monorepo> <workdir> <name>... (names from tools/upstreams.toml) ''', '''us] via [M="/c/Users/aphro
- [recovery] Recovered from [cd /c/src/aphrody-labs-github && cat standard.toml | head -120; ls templates tools docs 2>/dev/null] via [cd /c/src/aphrody-labs-github && sed -n 120,400p standard.toml; ls -R templates tools i18n naming
- [error] cd /c/src/aphrody/tooling/kernel-watch && sed -i 's/kselftest_targets = \[.*\]/kselftest_targets = ["exec", "membarrier", "clone3", "kcmp", "mincore", "sigaltstack", "mqueue"]/' la => Exit code 1 53:kselftest_targets = [
- [recovery] Recovered from [Agent] via [cd /c/src/browser/third_party/agent-browser && grep -E 'agent-browser/(docs|examples|packages|benchmarks|evals)' /tmp/lint_before.txt | grep -o 'file="[^"]*" line="[0-9]*" column="]
- [recovery] Recovered from [cd /c/src/aphrody/tooling/kernel-watch && sed -i 's/kselftest_targets = \["exec", "membarrier", "futex", "clone3", "pidfd"\]/kselftest_targets = ["exec", "membarrier", "futex", "cl] via [Write]
- [recovery] Recovered from [mkdir -p /c/tmp/proto && cd /c/tmp/proto && cat > t.ts <<'EOF' import { posix } from "node:path"; const sources = new Map<string,string>([["a/b.ts", `import {x} from "./c"; import ] via [cd /c/tmp/proto &
- [recovery] Recovered from [cd $(cygpath -m "$TEMP")/stdcache; grep -n -i "private field\|#private\|private identifiers\|\`#\`" g.txt | head -5; grep -v "^\s*$" linux-rust-testing | cut -c1-180 | sed -n 1,40p] via [cd /c/src/ay && g
- [error] Read => File does not exist. Note: your current working directory is C:\src\ay.

## Multi-VPS Fleet & SSH Transport
Autonomous learnings for Multi-VPS Fleet & SSH Transport.
- [recovery] Recovered from [ssh fr1 'cd /srv/xbuild/scratch/browser-hyperfine && git log --oneline -1 && ls && cat AGENTS.md third_party/README.md tools/layout.toml | head -150'] via [gh api repos/aphrody-labs/browser/contents/.gith
- [recovery] Recovered from [ssh fr1 'cd /srv/xbuild/scratch/browser-hyperfine && cat tools/import.py'] via [ssh fr1 'cd /srv/xbuild/scratch/browser-hyperfine && git status --short | head -3; git log --oneline -1; cat AGENTS.md | hea
- [recovery] Recovered from [ssh fr1 'cd /srv/xbuild/scratch/browser-hyperfine && sleep 20; tail -3 ../hf-build.log | cut -c1-100; target/release/hyperfine --version; target/release/hyperfine -N --runs 5 true ] via [ssh fr1 'cd /srv/
- [recovery] Recovered from [ssh fr1 'docker top lane-asm -eo pid,etime,args | head; ls /srv/xbuild/kernel-lane/work/arch-baseline/; du -sh /srv/xbuild/kernel-lane/work/arch-baseline/root 2>/dev/null'] via [cd /c/src/aphrody-labs-git
- [recovery] Recovered from [Read] via [timeout 118 bash -c 'until ssh fr1 "grep -q \"arch-baseline \(pass\|fail\)\|rror\" /srv/xbuild/kernel-lane/logs/run-baseline.log"; do sleep 8; done'; ssh fr1 'tail -2 /srv/xbuild/k]
- [recovery] Recovered from [cd /c/src/browser; mkdir -p "$TEMP/judge-chromium160"; tar cf "$TEMP/judge-chromium160/readmes.tar" third_party/*/README.chromium; scp -q "$TEMP/judge-chromium160/readmes.tar" fr1:] via [cd /c/src/browser
- [recovery] Recovered from [ssh fr1 'python3 - <<EOF import sqlite3, json for db in ["/tmp/acc/acc.db","/tmp/acc3/acc.db"]: c=sqlite3.connect("file:%s?mode=ro"%db,uri=True) print("==",db, [r for r in c.execut] via [ssh fr1 'python3
- [recovery] Recovered from [sleep 1; cat "C:/Users/aphro/AppData/Local/Temp/claude/11a3666990aa5a36/5df9f4d2-f83d-4f37-8bf9-8a2759709d32/tasks/bps6a221v.output" 2>/dev/null | tail -15; ls /c/src/browser/.loca] via [cd /c/src/browser
- [recovery] Recovered from [cd /c/src/browser; tar cf - third_party/*/README.chromium 2>/dev/null | ssh -o BatchMode=yes fr1 'rm -rf /tmp/rc && mkdir /tmp/rc && tar xf - -C /tmp/rc && cd /tmp/rc && python3 - ] via [ssh -o BatchMode=
- [recovery] Recovered from [cd /c/src/aphrody/tooling/kernel-watch/wsl && cat > boot-test.sh <<'EOF' #!/bin/bash # Direct kernel boot of a built WSL2 kernel in QEMU with a tiny busybox initramfs: shows the gu] via [cd /c/src/aphrody

## Git & Submodule Hygiene
Autonomous learnings for Git & Submodule Hygiene.
- [recovery] Recovered from [gh api repos/aphrody-labs/hyperfine/commits/v1.19.0 --jq '.sha+" "+.commit.message' | head -2; gh api repos/aphrody-labs/hyperfine/commits/v1.0.0 --jq '.sha' 2>&1 | head -1; gh api] via [gh api repos/shar
- [recovery] Recovered from [cd /c/src/aphrody/tooling/kernel-watch && sed -i 's/kselftest_targets = \[.*\]/kselftest_targets = ["exec", "membarrier", "clone3", "kcmp", "mincore", "sigaltstack", "mqueue"]/' la] via [which rg; rg --ve
- [recovery] Recovered from [cd /c/src/aphrody-labs-github && sed -i 's#/c/src/aphrody-labs-github/tools/check-commit.ts#C:/src/aphrody-labs-github/tools/check-commit.ts#; s#loadConfig("/c/src/aphrody-labs-git] via [cd /c/src/aphrody
- [recovery] Recovered from [git fetch -q origin && git rev-parse --short HEAD origin/main && git log --oneline -1 origin/main] via [git rev-parse --short HEAD; git rev-parse --short origin/main; git status -sb | head -2]
- [recovery] Recovered from [cd C:/src/shenron; tail -3 "C:/Users/aphro/AppData/Local/Temp/claude/24efa98171efcd26/aae12588-4a11-4aae-b28f-f3d886683cbb/tasks/bjjsz9fy6.output"; for i in 1 2 3 4 5 6 7; do echo ] via [cd /c/src/rosegri
- [recovery] Recovered from [for b in master devel bash-5.3-testing; do gh api repos/aphrody-labs/bash/commits/$b --jq '"'$b' \(.sha[:10]) \(.commit.committer.date) \(.commit.message|split("\n")[0]|.[:70])"'; ] via [echo "--- psmux";
- [correction] <cross-session-message from-name="anu-monorepo-plan"> Sync from session anu-monorepo-plan (2026-11-17), owner decisions now in force: 1. Rust is allowed everywhere again, ay included (ay commit de35a84 withdrew the no-Ru

## MCP Budget & Context Hygiene
Autonomous learnings for MCP Budget & Context Hygiene.
- [correction] optimise mieux ton setup claude versionné de ce prrojet ❯ ◯ claude.ai Claude Docs ✔ claude.ai Figma 44 tools ◯ claude.ai Gmail ◯ claude.ai Google Calendar ◯ claude.ai Google Docs ✔ claude.ai Google Drive 14 tools ◯ claud
- [recovery] Recovered from [edit_file] via [rg -n -C 5 "TOOLS =|AVAILABLE COMMANDS|Unknown command|rg_search" apps/cli/src/index.ts apps/mcp/src/index.ts]
- [correction] disclade all claude.ai ❯ ✔ claude.ai Claude Docs 8 tools ✔ claude.ai Figma 44 tools ✔ claude.ai Gmail 24 tools ✔ claude.ai Google Calendar 9 tools ✔ claude.ai Google Docs 2 tools ✔ claude.ai Google Drive 14 tools ✔ claud

## Rust, GPUI & WGPU Build Pipeline
Autonomous learnings for Rust, GPUI & WGPU Build Pipeline.
- [recovery] Recovered from [edit_file] via [@' import { readFileSync } from "node:fs"; for (const [p, needle] of [ ["crates/gpui-base/src/scroll_bounce.rs", "#[cfg(not(feature = \"gpui-fast"))]"], ["crates/gpui-base/src/scro]
- [recovery] Recovered from [edit_file] via [rg -n "seed_hex" assets/os/ product.toml rg -n "fn contrast_ratio" crates/nsh-core/src crates/gpui/src rg -n "#[cfg.*gpui-fast" crates/]

## Cloudflare Workers & Wrangler Edge
Autonomous learnings for Cloudflare Workers & Wrangler Edge.
- [recovery] Recovered from [cd /c/src/ay && cat > /tmp/edit_ay.ts <<'EOF' import { readFileSync, writeFileSync } from "node:fs"; const p = process.argv[2]!; let t = readFileSync(p, "utf8"); const rep = (a: st] via [A=$CLOUDFLARE_ACC

## Cross-Session & Relay Coordination
Autonomous learnings for Cross-Session & Relay Coordination.
