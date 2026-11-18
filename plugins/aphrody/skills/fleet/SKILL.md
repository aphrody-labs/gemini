---
name: fleet
description: Run a command, schedule builds, deploy or check on the 3 VPS (`fr1` heavy builds, `fr2` tests/lint/edge, `prd` production) while checking live load/disk and coordinating with peer sessions via `relay`. Use for any remote ssh/scp/systemctl/build; never a heavy build on the PC.
---

1. Always check live capacity and peer locks first: inspect `fleet_status` (or `bun run fleet:lb probe --all`) and `relay` `session_list` / `session_inbox` before writing under the shared build dir (`<work>` of the host) or launching heavy Cargo/C++ builds on `fr1`.
2. Bound remote commands and prevent Windows PowerShell `$` interpolation or CRLF failures: pipe single-quoted heredocs through `@' ... '@ | ssh <host> "tr -d '\r' | bash"` (avoid nested `@' ... '@` or `$` inside double quotes).
3. Exit 255 / slow host: `@' ... '@ | ssh <fr1> "tr -d '\r' | bash"` checking `uptime` (and clearing stale processes only when owned by your task/session).
4. Deploy a file: `scp -q <src> <host>:<work>/X/` after ensuring `<work>/X` ownership via heredoc (`<work>` from `assets/os/fleet_cluster.toml` or `ay.toml`).
5. Service: `ssh prd "sudo systemctl restart <svc> && systemctl is-active <svc>"`.
6. Prove a deploy with content, not a status: rendered page or real API response payload check; bare HTTP 200 proves nothing.
7. Never break prod: verify on build/test host before `prd`. Detailed roles: memory fleet-roles.md.
