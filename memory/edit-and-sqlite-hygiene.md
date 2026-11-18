# Exact `edit_file` Target & Cross-Session Memory Sync

- Always read exact line ranges with `read_file` immediately before calling `edit_file` so leading indentation, blank lines, and CRLF/LF boundaries match byte-for-byte.
- When `SRC_ROOT` is exported by `aysh` to the parent workspace directory (`C:\src`), individual extracted repositories (`ai-os`, `ay`) must verify marker files (`extract.toml`, `ay.toml`) before trusting `SRC_ROOT` as their own repository root.
- Always call `stmt.finalize()` before `db.close()` in `bun:sqlite` on Windows so temporary directories can be removed cleanly without `EBUSY`.
- In Antigravity `Orchestrator` Plan Mode, the pre-tool hook blocks `write_file` even for `<Artifact Directory>` files (`implementation_plan.md`, `learning_proposal.md`); finish read-only research first and hand off artifact creation via `exit_plan_mode`.
- Stage new files (`git add`) before running `check:paths` (`git ls-files --cached` skips untracked files), and avoid `/srv/` or drive-like regexes (`b:\s`) in tracked docs and `paths.allow` comments.
- Exclude `.agents/skills/` in root `bunfig.toml` `[lint] ignorePatterns` so vendored skill scripts do not break repo CI lint.
- Execute multi-statement Postgres SQL migrations (`BEGIN`/`COMMIT`) with `new SQL({ url, max: 1 })` in `Bun.SQL` to avoid `ERR_POSTGRES_UNSAFE_TRANSACTION`.
- If `systemctl reload nginx` fails with `226/NAMESPACE`, verify with `nginx -t` and reload the running master directly via `nginx -s reload`.
