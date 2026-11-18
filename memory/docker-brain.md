# Docker Official Knowledge Digest (`github.com/orgs/docker`)

Authoritative compacted references live in `~/.gemini/brain/docker/` (`INDEX.md`, `DOCS_DIGEST.md`, `SKILLS_DIGEST.md`, `MCP_GATEWAY.md`, `BEST_PRACTICES.md`) and are FTS5-indexed in `~/.gemini/learning/memory.db`.

## Core Invariants

1. **Builds & Bake (`docker/buildx` + `docker-bake.hcl`)**:
   - Start every Dockerfile with `# syntax=docker/dockerfile:1.12`.
   - Use `docker-bake.hcl` (`docker buildx bake`) for reproducible multi-target builds (`default`, `prod`, `tools`), OCI labels, and BuildKit cache configuration.
   - Use multi-stage named builds (`manifests`, `build`, `runtime`), `--mount=type=cache` / `--mount=type=bind` / `--mount=type=secret` (never pass credentials via `ARG`, `ENV`, or `COPY`), pin base tags, keep `.dockerignore` strict, and run runtimes as non-root (`USER 1000:1000` / `USER bun`).

2. **Compose & Runtime Hardening (`docker/compose` + `docker/docker-bench-security`)**:
   - Use `compose.yaml` (never `docker-compose.yml`), `restart: unless-stopped`, explicit `deploy.resources.limits.memory`, `security_opt: ["no-new-privileges:true"]`, and `depends_on` with `condition: service_healthy`.
   - Bind host proxies/DBs strictly to `127.0.0.1` or private WireGuard mesh (`RG_MESH_IP`), never `0.0.0.0`.

3. **MCP Gateway & Guardrails (`docker/mcp-gateway` + `docker/skills`)**:
   - Use `docker mcp gateway run` for containerized MCP servers (`stdio`, `streaming`, `sse`), `--secrets=docker-desktop:./.env`, and `--profile <name>`.
   - Apply `docker-destructive-guardrails`: inspect `du -sh` and running dependents first; never run unscoped `docker system prune -a --volumes` or touch sibling project containers/volumes (e.g. `shenron*`).

## Commands

- Refresh brain & FTS5 index: `bun ~/.gemini/scripts/import-docker-brain.ts && bun ~/.gemini/scripts/install.ts`
- Search offline memory: `bun ~/.gemini/scripts/learn.ts search "<terms>"`
