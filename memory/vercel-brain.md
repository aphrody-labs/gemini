# Vercel Official Knowledge Digest (`vercel/vercel-plugin` + `vercel-labs/agent-skills`)

Authoritative compacted references live in `~/.gemini/brain/vercel/` (`INDEX.md`, `KNOWLEDGE_GRAPH.md`, `SKILLS_DIGEST.md`, `DOCS_DIGEST.md`, `COMMANDS.md`, `BEST_PRACTICES.md`) and are FTS5-indexed in `~/.gemini/learning/memory.db`. Official plugin installed at `~/.gemini/plugins/vercel/` (`config/plugins/vercel/`).

## Core Invariants

1. **Compute, Runtime & Ecosystem Graph (`vercel/vercel-plugin`)**:
   - Prefer **Node.js (`24.x`) / Bun (`bun1.4.x`) on Fluid Compute** over legacy Edge runtime; use Routing Middleware (`proxy.ts` in Next.js 16+), Runtime Cache tags, Queues, Schedules (replacing Cron Jobs), and `@vercel/otel` tracing.
   - Check live official markdown docs anytime via `bun x vercel docs search "<query>"`, `bun x vercel docs inspect <page>`, `https://vercel.com/llms.txt`, or `vercel-brain` MCP (`vercel_brain_search`, `vercel_graph_lookup`, `vercel_project_audit`) + official OAuth MCP at `https://mcp.vercel.com`.

2. **Monorepo Builds & OOM Mitigation (`BUILD_UTILS_SPAWN_137`)**:
   - Never put `rootDirectory` inside `vercel.json` / `vercel.ts` — configure it in Vercel Project Settings.
   - Pin `bunVersion: "1.4.x"` when `bun.lock` (`lockfileVersion: 2`) is present so remote builds do not fall back to Bun 1.3.
   - When remote 7 GB build containers hit OOM during static generation, use `NODE_OPTIONS=--max-old-space-size=6144` or build cleanly via `--prebuilt` (`vercel pull --yes --environment=production` + `vercel build --prod` on Linux / `bun src/scripts/build-vercel.ts` + `vercel deploy --prebuilt --prod --archive=tgz --yes`).

## Commands

- Refresh brain & FTS5 index: `bun ~/.gemini/scripts/import-vercel-brain.ts --live && bun ~/.gemini/scripts/install.ts`
- Refresh official plugin from upstream: `bun ~/.gemini/scripts/install-vercel-plugin.ts --fetch && bun ~/.gemini/scripts/install.ts`
- Search offline memory: `bun ~/.gemini/scripts/learn.ts search "<terms>"`
