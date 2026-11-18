# Docker Official Knowledge Brain Index (`github.com/orgs/docker`)

- Corpus: 387 manuals (`docker/docs`), 11 official skills (`docker/skills`), 76 MCP Gateway docs (`docker/mcp-gateway`).
- Compression: 2853.6 KiB raw -> 94.7 KiB digests (3.3%).

## Upstream `github.com/orgs/docker` Matrix

| Repo | Role | Integrated Into |
| :--- | :--- | :--- |
| `docker/docs` | Official Dockerfile, BuildKit, Bake, Compose, Security, Scout & AI manuals | `DOCS_DIGEST.md` |
| `docker/skills` | 11 official agent skills (`docker-build-strategies`, `docker-compose-patterns`, `docker-destructive-guardrails`, ...) | `SKILLS_DIGEST.md` + `plugins/aphrody/skills/docker-*` |
| `docker/mcp-gateway` | `docker mcp` CLI plugin, Gateway (`stdio`/`sse`/`streaming`), catalog, secrets, profiles | `MCP_GATEWAY.md` |
| `docker/buildx` & `docker/compose` | Multi-platform Bake HCL, cache mounts, healthchecks, profiles, Watch | `BEST_PRACTICES.md`, `docker-bake.hcl` |
| `docker/docker-bench-security` | Non-root user, `no-new-privileges`, read-only rootfs, minimal capabilities | `BEST_PRACTICES.md`, `docker-mcp.ts` audit |

## Brain Files

| File | Scope |
| :--- | :--- |
| `INDEX.md` | Overview, `orgs/docker` repository matrix, and topic router |
| `DOCS_DIGEST.md` | Digests across `docker/docs` manuals (`build`, `compose`, `security`, `scout`, `engine`, `ai`) |
| `SKILLS_DIGEST.md` | Catalog & triggers for all 11 official `docker/skills` |
| `MCP_GATEWAY.md` | `docker mcp` gateway CLI, client config, and `docker-brain` MCP server |
| `BEST_PRACTICES.md` | Reproducible Buildx/Bake, Compose hardening, and destructive guardrails checklist |
