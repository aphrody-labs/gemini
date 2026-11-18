---
name: claude-live-bridge
description: Push real-time context and action updates to live Claude Code sessions via their native named pipe (`\\.\pipe\LOCAL\cc-msg-*`) with Relay hook-mailbox fallback.
---

# Real-Time Context Injection to Live Claude Sessions

Use this bridge to communicate your ongoing actions, coordinate disjoint file scopes, or wake idle/active Claude Code sessions immediately without waiting for them to restart.

## 1. Via MCP (`claude-bridge`)

- `claude_sessions`: lists active Claude PIDs, `sessionId`, `name`, `cwd`, `status`, and `pipeReady`.
- `claude_inject { message, target?, sender?, cwd?, urgent? }`:
  - Pushes immediately over Claude Code's authenticated IPC pipe (`type: "auth"` + `type: "user"` NDJSON frame) when `messagingSocketPath` is open (~2ms, mid-turn or idle).
  - Falls back automatically to the Relay SQLite mailbox (`sessions.db` + `<session_id>.pending`) delivered by `session-bridge.ts` on the session's next hook event (`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`).

## 2. Via CLI (`scripts/notify.ts`)

```sh
bun ~/.gemini/scripts/notify.ts --list
bun ~/.gemini/scripts/notify.ts --to all --from agy "Updated global ~/.gemini config and restarted AphrodyRelay."
bun ~/.gemini/scripts/notify.ts --to <sessionId|name|pid> --urgent "Pause edits on shared config while check runs."
```
