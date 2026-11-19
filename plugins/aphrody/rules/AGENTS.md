# Aphrody Autonomous Engineering

- Execute end-to-end without approval pauses or verbose narration.
- Schedule heavy Rust/C++ builds via `fleet_status` / `fleet-lb` (`fr1` primary builder when idle) and coordinate via `relay` (`session_register` / `session_list` / `session_inbox`) if another session uses `/srv/xbuild` or shared forks; verify real outputs and UI proof.
- Run `bun "$HOME/.gemini/scripts/learn.ts" search <terms>` before broad directory scans.

<!-- merged-rules:bun -->
# Bun-Native Baseline

- Always use `bun`, `bunx`, `bun test`, `bun check`, `bun lint`, `bun fmt`, `bun uv` instead of node/npm/npx/yarn/pnpm/pip/python/tsc/eslint/prettier.
- Prefer `Bun.serve`, `Bun.file`/`Bun.write`, `bun:sqlite`, `Bun.spawn`, `Bun.Glob`, `bun:test` over Node stdlib or npm wrappers.


<!-- merged-rules:cloudflare -->
# Cloudflare at Aphrody

Generic Cloudflare guidance (Workers, wrangler, cf, D1, R2, KV, Durable Objects, Agents SDK, Cloudflare One, security review) comes from the official `cloudflare/skills` plugin and its Cloudflare MCP server (`https://mcp.cloudflare.com/mcp`); load its skills instead of restating them here. Only Aphrody-specific facts live below.

- Keep account IDs, zone IDs, tunnel UUIDs, host IPs, API tokens, and emails out of tracked git files (`.private/`, `*.local.toml`, `wrangler` secret bindings only).
- **Single-level hostnames only**: never create proxied two-level subdomains (`*.*.domain.tld`) under Cloudflare Universal SSL; use hyphenated single-level names (`api-achillea.domain.tld`, `api-azalee.domain.tld`).
- **Loopback Real-IP behind `cloudflared`**: include `set_real_ip_from 127.0.0.1;` and `set_real_ip_from ::1;` in host nginx server snippets receiving local `cloudflared` tunnel traffic so `CF-Connecting-IP` is restored without touching sibling host configs.
- **R2 CORS and redirects**: read-only CORS (`GET, HEAD`, `ExposeHeaders: ETag/Content-Length/Content-Range`) on public R2 buckets serving fonts/media; canonical `www.` to apex redirects via Zone Dynamic Redirect Rulesets (`http_request_dynamic_redirect`) rather than origin hops.
- On cluster hosts running Mullvad WireGuard (`wg-*`), use UID policy routing (`ip rule add uidrange <uid>-<uid> lookup <table> priority 100`) and dedicated routing tables (`>= 51820`); never mutate the host default route so SSH, the WireGuard mesh, and `cloudflared` stay isolated.

<!-- merged-rules:nextjs -->
# Next.js 16.5+ Directives

- Check version-matched docs first (`node_modules/next/dist/docs/`, `~/.gemini/brain/nextjs/`, `nextjs-brain` MCP, or `bun ~/.gemini/scripts/learn.ts search nextjs <terms>`); never guess pre-16 APIs from memory.
- Use `proxy.ts` (`export function proxy(request: NextRequest, event?: NextFetchEvent)` / `NextProxy` / `ProxyConfig`), never `middleware.ts`; Proxy runs on Node.js only (`runtime` export throws, `skipProxyUrlNormalize` replaces `skipMiddlewareUrlNormalize`). Keep `matcher` excluding static/image assets and always re-verify auth inside Server Functions and Route Handlers.
- Await all Request APIs (sync compatibility was removed in Next.js 16): `await params`, `await searchParams`, `await cookies()`, `await headers()`, `await draftMode()`, and async `params`/`id` in `opengraph-image`, `icon`, `sitemap`.
- Type pages, layouts, and route handlers with generated `PageProps<'/route'>`, `LayoutProps<'/route'>`, `RouteContext<'/api/route'>` (`next typegen`), and read shared root layout params in Server Components via `next/root-params`.
- For Cache Components, set top-level `cacheComponents: true` and explicit `partialPrefetching: true` in `next.config.ts`; remove deprecated `experimental.dynamicIO`/`useCache`/`ppr` and incompatible segment exports (`dynamic`, `revalidate`, `fetchCache`, `runtime`).
- Pair `'use cache'` with `cacheLife(...)` and `cacheTag(...)`. Keep `cookies()`, `headers()`, and `searchParams` outside `'use cache'` and pass plain/serializable arguments (or use `'use cache: private'` / `'use cache: remote'`). Wrap dynamic/runtime reads in `<Suspense>` and call `await io()` before `Date.now()`, `Math.random()`, `crypto.randomUUID()`, or sync DB queries (`await connection()` only when requiring a real HTTP request).
- Revalidate tags with two arguments: `revalidateTag(tag, 'max')` (or `{ expire }`) for stale-while-revalidate; use `updateTag(tag)` or `refresh()` inside Server Actions for immediate read-your-own-writes.
- Respect route order: `headers` -> `redirects` -> `proxy.ts` -> `rewrites.beforeFiles` -> filesystem (`public/`, `_next/static/`, pages) -> `rewrites.afterFiles` -> dynamic routes -> `rewrites.fallback`. Put host-matched multi-tenant rewrites (`has: [{ type: 'host', value }]`) in `beforeFiles`.
- Keep `'use client'` at leaf interactive components, pass Server Components via `children`/slots, guard modules with `'server-only'` / `'client-only'`, and prefer `useSyncExternalStore` (with server snapshot) over `useEffect` + `setState` for external/browser stores.
- Account for Next.js 16+ defaults: Turbopack is default; `next lint` is removed (use Biome or ESLint flat config); parallel route `@slot` dirs require `default.tsx`; `images.minimumCacheTTL` is `14400`, `images.qualities` is `[75]`, `images.maximumRedirects` is `3`, `images.imageSizes` drops `16`, query-string local images need `images.localPatterns.search`, and local IPs require `images.dangerouslyAllowLocalIP: true`.
- Verify changes against `/_next/mcp` (`get_errors`, `get_compilation_issues`, `compile_route`, `get_routes`) and a real headless browser render, never HTTP 200 alone.
