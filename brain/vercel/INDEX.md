# Vercel Official Knowledge Index

- **Plugin source**: `github.com/vercel/vercel-plugin`
- **Agent skills source**: `github.com/vercel-labs/agent-skills`
- **Live docs index**: `https://vercel.com/llms.txt` (`<url>.md` or `Accept: text/markdown`)
- **CLI docs command**: `bun x vercel docs search "<query>"` & `bun x vercel docs inspect <page>`
- **Official Remote MCP**: `https://mcp.vercel.com` (`bun x vercel mcp`)
- **Local Fast MCP**: `vercel-brain` (`plugins/vercel/mcp/vercel-mcp.ts`)

## Knowledge Modules

- [KNOWLEDGE_GRAPH.md](KNOWLEDGE_GRAPH.md) — Relational Vercel ecosystem graph (platform, CDN, Fluid Compute, Functions, AI SDK, Workflow, Sandbox, Storage, Marketplace, Security, Observability).
- [SKILLS_DIGEST.md](SKILLS_DIGEST.md) — Indexed digest of 39 plugin skills and 9 agent-skills modules.
- [DOCS_DIGEST.md](DOCS_DIGEST.md) — Official Vercel platform, Bun runtime, Build Output API v3, and OOM troubleshooting guides (7 live fetched).
- [COMMANDS.md](COMMANDS.md) — Official plugin specialist agents (`ai-architect`, `deployment-expert`, `performance-optimizer`) and slash command playbooks (`bootstrap`, `deploy`, `env`, `status`).
- [BEST_PRACTICES.md](BEST_PRACTICES.md) — Production invariants: Fluid Compute over legacy Edge, Bun 1.4.x runtime, monorepo `Root Directory` + `--prebuilt` OOM avoidance, Tracing, Zero-secret config.
