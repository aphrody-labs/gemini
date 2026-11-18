# Docker MCP Gateway & Toolkit (`github.com/docker/mcp-gateway`)

Canonical CLI plugin (`docker mcp`) orchestrating containerized MCP servers securely with secret injection, OAuth DCR, profiles, and unified client connectivity.

## CLI Commands

- `docker mcp gateway run` — Start the gateway on stdio (`--port 8080 --transport streaming|sse`).
- `docker mcp gateway run --servers s1,s2 --tools s1:* --watch` — Scope enabled servers/tools with hot reload.
- `docker mcp gateway run --profile <name>` — Load named server/tool working set.
- `docker mcp gateway run --secrets=docker-desktop:./.env` — Read Docker Desktop secrets with `.env` fallback.
- `docker mcp server ls|enable|disable|inspect` — Manage configured catalog servers.
- `docker mcp tools ls|inspect|call` — Discover & invoke registered MCP tools.
- `docker mcp catalog bootstrap|ls|show|import` — Manage custom/official MCP catalogs (`desktop.docker.com/mcp/catalog/v2|v3/catalog.yaml`).
- `docker mcp secret set|ls|rm` / `docker mcp profile create|ls` — Secret and profile management.

## Client Config (`.mcp.json` / `mcp_config.json`)

```json
{
  "mcpServers": {
    "MCP_DOCKER": {
      "command": "docker",
      "args": [
        "mcp",
        "gateway",
        "run"
      ]
    }
  }
}
```

## Docker Brain Local Static Auditor (`docker-brain` MCP)

- Works even on hosts without a local Docker Desktop daemon (or targeting remote VPS via `DOCKER_HOST`).
- Tools: `docker_brain_search`, `docker_skills_list`, `docker_dockerfile_audit`, `docker_compose_audit`, `docker_mcp_gateway_info`.

## Upstream Docs Digested (76 files)

- `README.md` — **Docker MCP Plugin and Docker MCP Gateway**
  - **Managing MCP server lifecycle** Each local MCP sever in the catalog runs in an isolated Docker container. npx and uvx servers are granted 
  - **Providing a unified interface** AI models access MCP servers through a single Gateway.
- `docs/catalog.md` — **MCP Catalog Management**
  - Modify to understand the catalog format
  - Use as a foundation for your custom servers
- `docs/config-flow.md` — **Gateway startup**
  - catalog.Servers (this is our catalog)
  - read from catalog.yaml files
- `docs/database/README.md` — **Docker MCP Gateway Database**
  - DAO interface for all database operations
  - Migration management with golang-migrate
- `docs/feature-specs/catalog-management/feature-spec.md` — **User-Managed Catalogs Feature Specification**
  - **Docker Official Catalog**: Hardcoded catalog at `https://desktop.docker.com/mcp/catalog/v2/catalog.yaml`
  - **Catalog Management System**: Full CRUD operations exist but are hidden and unused by gateway runtime
- `docs/feature-specs/catalog-management/implementation-checklist.md` — **User-Managed Catalogs Implementation Checklist**
  - ✅ **Feature Management System**: Full TDD implementation with 8 test cases
  - ✅ **Gateway Enhancement**: Complete flag integration with 5 test cases
- `docs/feature-specs/dynamic_servers.md` — **Dynamic Server Management**
  - `query` (required): Search query to find servers by name or description (case-insensitive)
  - `limit` (optional): Maximum number of results to return (default: 10)
- `docs/feature-specs/embeddings-feature.md` — **Vector Embeddings for MCP Gateway**
  - Vector similarity search for finding relevant MCP servers
  - Feature flag system for opt-in usage
- `docs/generator/reference/mcp.md` — **docker mcp**
- `docs/generator/reference/mcp_catalog.md` — **docker mcp catalog**
- `docs/generator/reference/mcp_catalog_add.md` — **docker mcp catalog add**
- `docs/generator/reference/mcp_catalog_bootstrap.md` — **docker mcp catalog bootstrap**
- `docs/generator/reference/mcp_catalog_create.md` — **docker mcp catalog create**
- `docs/generator/reference/mcp_catalog_export.md` — **docker mcp catalog export**
- `docs/generator/reference/mcp_catalog_fork.md` — **docker mcp catalog fork**
- `docs/generator/reference/mcp_catalog_import.md` — **docker mcp catalog import**
- `docs/generator/reference/mcp_catalog_init.md` — **docker mcp catalog init**
- `docs/generator/reference/mcp_catalog_ls.md` — **docker mcp catalog ls**
- `docs/generator/reference/mcp_catalog_reset.md` — **docker mcp catalog reset**
- `docs/generator/reference/mcp_catalog_rm.md` — **docker mcp catalog rm**
