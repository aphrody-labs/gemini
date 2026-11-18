---
name: learn
description: "Continuous autonomous serverless self-learning across Antigravity, Claude, Codex, and all Aphrody Labs agents via Cloudflare (`https://learn.aphrody.com`): zero human approval, automatic distillation, promotion, FTS5 indexing, and cross-PC bundle convergence."
---

# Continuous Autonomous Serverless Self-Learning Loop

Hooks, local distillers, and the Cloudflare `aphrody-learn` Cron worker run completely autonomously with **zero human approval or manual curation**.

## Journal, Local & Serverless Hub

- Raw events: `~/.gemini/learning/journal.jsonl` (secret-redacted)
- Auto-promoted memory: `~/.gemini/memory/learned-auto.md` & `~/.gemini/memory/learned-cloud.md`
- Indexed stores: `~/.gemini/learning/memory.db` (FTS5)
- Serverless hub: `https://learn.aphrody.com` (`/api/learn/events`, `/api/learn/distill`, `/api/learn/manifest.json`, `/api/learn/bundle.json`)
- Cross-agent convergence CLI: `bun run learn:sync cycle` (`tooling/bun/learn-cloud.ts`)

## Commands

- Search memory and past sessions first: `bun ~/.gemini/scripts/learn.ts search <words>` (or `memory_search` MCP tool).
- Run local + cloud autonomous cycle: `bun ~/.gemini/scripts/learn.ts distill-quiet` or `bun ~/.gemini/scripts/learn.ts cloud-sync`
- Synchronize `agy` + `claude` + `codex` + `.agents` on any PC: `bun run learn:sync cycle`
- Rebuild local rules/plugin/FTS5 index: `bun ~/.gemini/scripts/sync.ts && bun ~/.gemini/scripts/install.ts`
