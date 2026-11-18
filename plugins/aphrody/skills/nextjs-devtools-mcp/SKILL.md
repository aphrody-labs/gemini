---
name: nextjs-devtools-mcp
description: Connect to Next.js 16.5+ runtime MCP (/_next/mcp), vercel/next-devtools-mcp, and offline nextjs-brain MCP tools to inspect routes, compilation issues, errors, logs, types, and config schemas.
---

# Next.js DevTools & Brain MCP

Next.js 16+ exposes two complementary MCP layers:
1. **Offline Knowledge (`nextjs-brain` plugin MCP)**: `plugins/nextjs/mcp/nextjs-mcp.ts` exposes `nextjs_brain_search`, `nextjs_types_lookup`, `nextjs_config_lookup`, and `nextjs_docs_lookup` backed by `~/.gemini/brain/nextjs/` and local `node_modules/next/dist/docs/`.
2. **Live Dev Server (`vercel/next-devtools-mcp` -> `/_next/mcp`)**: connects to running `next dev` servers on `http://localhost:<port>/_next/mcp` without adding always-on global startup overhead to `config/mcp_config.template.json`.

## Using `vercel/next-devtools-mcp` On Demand

- Configure per-project in `<project>/.mcp.json` or run directly when debugging a live `next dev` instance:
  ```json
  {
    "mcpServers": {
      "next-devtools": {
        "command": "bunx",
        "args": ["next-devtools-mcp@latest"]
      }
    }
  }
  ```
- Tools provided by `next-devtools-mcp`:
  - `nextjs_index({ port? })` — discovers running Next.js 16+ dev servers and lists their `/_next/mcp` tools.
  - `nextjs_call({ port, toolName, arguments? })` — forwards tool calls to the discovered dev server.
  - `nextjs_docs({ topic?, project_path? })` — points to project-local `node_modules/next/dist/docs/`.
  - `browser_eval({ task? })` — points to `agent-browser` CLI for live DOM, console, network, and React fiber checks.

## Built-in `/_next/mcp` Runtime Tools

Enabled by default in Next.js 16+ (`experimental.mcpServer: true`):
- `get_project_metadata` — project root, dev server URL, bundler (`turbopack` / `webpack`).
- `get_routes` — filesystem scan of `appRouter` and `pagesRouter` entrypoints (no browser session needed).
- `get_compilation_issues` — builds module graph across routes and returns resolve/transform/missing-module errors without running `next build` (Turbopack only).
- `compile_route` — compiles a single `routeSpecifier` or `path` on demand (Turbopack only).
- `get_errors` — runtime, config validation, build, and forwarded browser errors (requires at least one browser navigation).
- `get_page_metadata` — active segment trie and router type for open browser pages.
- `get_logs` — returns path to the unified dev server + browser console log file.
- `get_server_action_by_id` — resolves hashed Server Action IDs to file + export name.
- `get_request_insights` — recent App Router request, fetch, and cache timelines (requires `experimental.requestInsights: true`).

## Direct HTTP/SSE Probe (Without `next-devtools-mcp`)

If `next-devtools-mcp` is not loaded, query `http://localhost:3000/_next/mcp` directly via HTTP POST (`Accept: application/json, text/event-stream`), parsing `data:` SSE JSON lines, and cross-check UI behavior with headless browser snapshots/screenshots rather than HTTP status codes alone.
