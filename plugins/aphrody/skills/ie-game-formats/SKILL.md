---
name: ie-game-formats
description: Read, decode, serve and reverse Inazuma Eleven Victory Road through its two real artifacts only - the game binary nie.exe and its data VFS (CPK) - with the nie CLI, nie mcp and nie serve.
---

# Inazuma Eleven Victory Road: nie.exe and the VFS

Two artifacts of the installation the user owns are the only sources of truth:

- **`nie.exe`**: the game executable (`nie_eacpatched.exe` once EAC is patched). Reverse engineering
  works on it: `nie index`, `rtti`, `pdata`, `disasm`, `rebuild`, `recover`, `strings`, `coverage`,
  `mem` (live memory), `live` (launch under Proton).
- **The VFS**: `data/cpk_list.cfg.bin` and 936 CRI CPK archives, 255 628 files under
  `data/common/{action, camera, chr, craft, effect, event, event_cfg, font, gamedata, input, map,
  menu, movie, property, script, sound, sound_asset, system, text}` and
  `data/dx11/{chr, effect, event, font, map, menu, movie, shader, text}`.

Everything else (docs, typed JSON, PNG/GLB/WAV/MP4 exports, wiki rows, HTTP routes, MCP tools) is
derived from those two, never authored beside them. Repository: `aphrody-labs/nie` (`C:\src\nie`);
iecode (`iecode/dotnet`, `iecode/cpp` submodules) consumes nie's VFS through the C ABI. Never copy
or commit a game file.

## Pointing at the game

`NIE_GAME_SOURCE` (or `--game-dir`) accepts a local path, `ssh://host/path`, `r2://`, `gdrive://`,
`rclone://` or `https://`; only the CPK tables and the requested byte ranges move. Production
install: `ssh://prd/srv/rosegriffon/game/ievr`. Heavy builds and runs go to `ssh fr1`
(`/srv/xbuild/nie`, binaries in `target/release`).

## Commands (`nie --help` is authoritative)

```sh
nie info                          # what this installation is: binary, VFS, coverage
nie vfs ls data/common/menu       # folder view of the VFS
nie vfs find --ext g4tx dx11/menu # search internal paths
nie vfs stat <path>               # size, container CPK, detected format
nie vfs cat <path>                # structured decode by format, hexdump fallback
nie vfs extract --out <dir> <path|prefix>
nie vfs stats                     # extension histogram of the whole VFS
nie vfs formats                   # decoder coverage of the VFS
nie vfs chara <name|hash|code>    # characters straight from the VFS (vfs waza: skills)
nie format <file|dir>             # detect, write nothing
nie decode <file|dir>             # cfg.bin and data -> JSON, G4TX -> PNG
nie convert <asset>               # exchange formats
```

`nie vfs formats` reports which of the VFS formats nie decodes today; read it instead of assuming.

## Services

- `nie mcp` (stdio, bin `nie-mcp`): one `cli_*` tool per CLI command plus `vfs_*`, `asset_get`,
  `re_*`, `explorer_*`. Configured in `C:\src\nie\.mcp.json`.
- `nie serve` and `nie-model-serve` on port 8790, images `ghcr.io/aphrody-labs/nie` and
  `ghcr.io/aphrody-labs/nie-model-serve` (private), routes in `docs/serve.md`. `/health` is JSON
  with `vfsReady`. The CDN origin for `cdn.rosegriffon.fr/dx11/**` is nie-model-serve `/tex/dx11/**`.
- C ABI: `crates/nie-ffi` (`libiecode.so` / `iecode.dll`), plan in `docs/ffi-unification.md`.

## Known gaps

The iecode .NET and C++ decoders fail on this game build's `data/cpk_list.cfg.bin`; nie reads it.
Route iecode through nie's VFS, do not fix the duplicate decoders in place.
