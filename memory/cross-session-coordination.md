# Cross-Session Coordination (`relay` Mailbox, Sibling Repos & Shared VPS Builds)

- Before mutating shared remote build directories (`/srv/xbuild/...`), sibling workspaces, or shared GitHub forks (`aphrody-labs/*`), inspect active Antigravity sessions via `relay` `session_list` (plus `C:\Users\aphro\.gemini\antigravity-cli\conversation_summaries.db` if needed) and register the current session (`session_register` with unique `name`, `id`, `kind: "agy"`, `cwd`).
- Never abort merges, reset branches, push forks, or overwrite remote build scratch dirs owned by another live `agy` session; agree on non-overlapping write boundaries and handoff SHAs via `session_send`.
- `relay` `session_send` messages do **not** wake `swarm_wait`: whenever resuming from `swarm_wait`, immediately call `session_inbox` (`peek: false`) alongside `read_board`.
- Before scheduling heavy remote builds, probe live load/disk (`fleet_status` or `bun run fleet:lb probe --all`) rather than assuming `fr1` is free when another session is actively compiling there.
