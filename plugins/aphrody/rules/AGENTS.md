# Aphrody Autonomous Engineering

- Execute end-to-end without approval pauses or verbose narration.
- Schedule heavy Rust/C++ builds via `fleet_status` / `fleet-lb` (`fr1` primary builder when idle) and coordinate via `relay` (`session_register` / `session_list` / `session_inbox`) if another session uses `/srv/xbuild` or shared forks; verify real outputs and UI proof.
- Run `bun "$HOME/.gemini/scripts/learn.ts" search <terms>` before broad directory scans.

<!-- merged-rules:bun -->
# Bun-Native Baseline

- Always use `bun`, `bunx`, `bun test`, `bun check`, `bun lint`, `bun fmt`, `bun uv` instead of node/npm/npx/yarn/pnpm/pip/python/tsc/eslint/prettier.
- Prefer `Bun.serve`, `Bun.file`/`Bun.write`, `bun:sqlite`, `Bun.spawn`, `Bun.Glob`, `bun:test` over Node stdlib or npm wrappers.


<!-- merged-rules:cloudflare -->
# Cloudflare Edge, FinOps & Sovereign Infrastructure Rules

Authoritative baseline distilled from `cloudflare/skills` (`rules/workers.mdc`, `workers-best-practices`), `cloudflare/security-audit-skill`, `aphrody-labs/.github` (`STANDARD.md` §14), and `aphrody-dev/ay-cf`.

## 1. Documentation & Tool Selection

- **Prefer retrieval over pre-training**: inspect lockfiles, `compatibility_date`, and live Cloudflare docs before asserting runtime flags or APIs.
- **CLI rule**: use `wrangler` (`bun x wrangler ...`) inside projects with `wrangler.{jsonc,json,toml}`; use `cf` (`cf-cli`) for account-level resource/API discovery (`--dry-run` before mutations).
- **Use battle-tested SDKs**: use `cloudflare` (TypeScript/Python SDK), `hono` + `zod` + `@cloudflare/workers-types` (`wrangler types`), `workers-rs`, `pingora`, and `quiche` rather than custom raw `fetch` or HTTP parsing wrappers.

## 2. Workers Paid & Production Defaults

- Keep `compatibility_date` current and regenerate `worker-configuration.d.ts` via `wrangler types` after any binding change.
- Set explicit `limits.cpu_ms` (`50` ms for CDN/proxy/static Workers; `500` ms for API/MCP/compute Workers) to bound Workers Paid CPU overages.
- Enable **both** logs and traces (`observability.enabled = true`, `observability.traces.enabled = true`), with cost-conscious `head_sampling_rate` (`0.1` logs / `0.05` traces on high-RPS CDN Workers, `1.0` logs / `0.1` traces on low-volume control/webhook Workers) to stay inside the 20M free monthly events tier.
- Disable `workers.dev` and preview URLs once a custom domain, route, or Queue consumer serves the Worker.
- Never leave floating promises (`await` or `ctx.waitUntil(...)`), never buffer large bodies in isolate memory (stream via `TransformStream` / `response.body`), and never store request-mutable state in module globals.

## 3. R2 Paid & CDN FinOps

- Serve static public buckets via R2 Custom Domains + Zone Edge Cache rulesets (`immutable`, 30d–1y edge/browser TTL, `serve_stale`), avoiding Worker compute billing for pure static GETs.
- Enforce `One Server per Hostname`: never overlap wildcard Worker routes (`*.domain/*`) over R2 Custom Domains or bind both a Worker Custom Domain and a Worker Route to the same hostname.
- Disable `r2.dev` public URLs once custom domains or Worker bindings are active.
- Enforce 24-hour (`86400`s) aborted multipart upload lifecycle cleanup on every bucket and offload cold archives to self-hosted S3 (e.g., OVH `fr2` Garage).

## 4. Tunnels, Proxy VPS Mesh & Mullvad Split-Tunnel Safety

- Run multi-connector HA `cloudflared` over QUIC with explicit ingress rules matching DNS CNAMEs (no direct unproxied `A` origin exposure).
- Keep bare-metal/Hostinger origins firewalled (`nftables` allowing only WireGuard mesh, outbound `cloudflared`, and operator SSH) behind OVH Anti-DDoS Pingora proxy fronts.
- On cluster hosts running Mullvad WireGuard (`wg-*`), always use UID policy routing (`ip rule add uidrange <uid>-<uid> lookup <table> priority 100`) and dedicated routing tables (`>= 51820`), never mutating the host default route so SSH, WireGuard mesh, and `cloudflared` stay isolated.

## 5. Security & Secret Hygiene

- Keep account IDs, zone IDs, tunnel UUIDs, host IPs, API tokens, and emails out of tracked git files (`.private/`, `*.local.toml`, `wrangler` secret bindings only).
- Audit any Cloudflare Worker or API change with `skills/cloudflare-security-audit/SKILL.md`.
- **Single-level hostnames only**: Never create proxied two-level subdomains (`*.*.domain.tld`) under Cloudflare Universal SSL; use hyphenated single-level names (`api-achillea.domain.tld`, `api-azalee.domain.tld`).
- **Loopback Real-IP behind `cloudflared`**: Include `set_real_ip_from 127.0.0.1;` and `set_real_ip_from ::1;` in host nginx server snippets receiving local `cloudflared` tunnel traffic so `CF-Connecting-IP` is restored without touching sibling host configs.
- **R2 CORS & Edge Redirects**: Configure read-only CORS (`GET, HEAD`, `ExposeHeaders: ETag/Content-Length/Content-Range`) on public R2 buckets serving fonts/media, and enforce canonical `www.` -> apex redirects via Zone Dynamic Redirect Rulesets (`http_request_dynamic_redirect`) rather than origin hops.
- **Wrangler types & dry-run**: After any `wrangler.jsonc` binding/var edit, run `wrangler types`, format generated `worker-configuration.d.ts` if covered by repo formatting, and validate with `wrangler deploy --dry-run` before deploying.


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
