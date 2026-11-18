# Exact `edit_file` Target & Cross-Session Memory Sync

- Always read exact line ranges with `read_file` immediately before calling `edit_file` so leading indentation, blank lines, and CRLF/LF boundaries match byte-for-byte.
- When `SRC_ROOT` is exported by `aysh` to the parent workspace directory (`C:\src`), individual extracted repositories (`ai-os`, `ay`) must verify marker files (`extract.toml`, `ay.toml`) before trusting `SRC_ROOT` as their own repository root.
- Always call `stmt.finalize()` before `db.close()` in `bun:sqlite` on Windows so temporary directories can be removed cleanly without `EBUSY`.
