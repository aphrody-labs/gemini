---
name: learn
description: "Continuous recursive self-learning across Claude, Antigravity, and Gemini: inspect captured journal entries, distill non-duplicate rules into project memory, and keep SQLite/Markdown memory synchronized."
---

# Continuous Self-Learning Loop

Use this skill to inspect pending failures/recoveries/corrections captured by hooks and distill durable rules automatically without human intervention.

## Journal & State

- Raw events: `~/.gemini/learning/journal.jsonl` (secret-redacted)
- Distilled digests: `~/.gemini/learning/inbox/`
- Canonical memory: `~/.gemini/memory/*.md` + `MEMORY.md`
- Indexed stores: `~/.agent/memory.sqlite` and `~/.bun/agent/memory.db`

## Commands

- Search memory and past sessions first: `bun ~/.gemini/scripts/learn.ts search <words>` (or the `memory_search` MCP tool).
- Inspect pending status: `bun ~/.gemini/scripts/learn.ts status`
- Distill unreviewed journal entries into inbox digest: `bun ~/.gemini/scripts/learn.ts distill`
- Sync Markdown memories to SQLite and clean stale clutter: `bun ~/.gemini/scripts/sync.ts`

## Rules for Distilling Memories

1. One durable fact per focused topic file (no bloated catch-all ledgers).
2. Check existing `MEMORY.md` entries first: merge into an existing topic file instead of creating duplicates or contradictions.
3. After merging a digest into memory, delete the digest from `~/.gemini/learning/inbox/` (session start announces pending digests until the inbox is empty).
4. Delete or update obsolete entries whenever codebase/runtime facts change, then rebuild `MEMORY.md` and run `bun ~/.gemini/scripts/sync.ts`.
