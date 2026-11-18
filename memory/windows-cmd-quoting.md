---
name: Windows cmd /c argument quoting in Antigravity commands
description: Embedded double quotes inside Antigravity statusLine, title, and hook commands break bun on Windows.
type: reference
---

On Windows, Antigravity executes `statusLine.command`, `title.command`, and `hooks.json` `command` strings through `cmd /c` with Go `syscall.EscapeArg`.
Embedded `\"` quotes inside the command string reach `bun` as literal quotes in the filename (`error: File not found ""...""`), causing `statusline_runner.go` to fail 30 times and auto-disable.
Always keep paths in `command` strings unquoted (with no spaces) or use relative paths from `hooks.json`.
