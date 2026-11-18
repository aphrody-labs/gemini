---
name: nextjs-config-caching
description: Next.js 16.5+ next.config.ts schema, rewrites (beforeFiles host matching, afterFiles, fallback), image defaults, Turbopack config, Cache Components ('use cache', cacheLife, cacheTag, revalidateTag, updateTag, io, prefetch, navigation, instant, ensureStatic).
---

# Next.js 16.5+ Config & Cache Components

Use this skill when editing `next.config.ts`, configuring host/path `rewrites` or `images`, or designing caching, prerendering, and prefetching boundaries.

## Config Lookup

Query `nextjs_config_lookup` (`nextjs-brain` MCP) or inspect `~/.gemini/brain/nextjs/CONFIG_SCHEMA.md` for exact `NextConfig`, `ExperimentalConfig`, `ImageConfigComplete`, `AppSegmentConfig`, and `ProxyConfig` field types and defaults.

## `next.config.ts` & Routing Order

Execution order on every request:
1. `headers()` from `next.config.ts`
2. `redirects()` from `next.config.ts`
3. `proxy.ts`
4. `rewrites.beforeFiles` (runs before `public/`, `_next/static/`, and page files)
5. Filesystem routes (`public/`, `_next/static/`, static pages)
6. `rewrites.afterFiles` (runs before dynamic routes)
7. Dynamic routes (`/blog/[slug]`)
8. `rewrites.fallback` (runs before 404)

- Put multi-tenant / subdomain host rewrites (`has: [{ type: 'host', value: '(?<sub>[^.]+)\\.example\\.com' }]`) in `rewrites.beforeFiles` so root or static paths resolve to tenant routes before filesystem matching.
- Turbopack is default (`next dev`, `next build`). Use top-level `turbopack: { resolveAlias, rules, root, debugIds }`, not deprecated `experimental.turbopack`.
- `next lint` and `eslint` config key are removed; configure ESLint Flat Config (`eslint-config-next@16+`) or Biome directly. `serverRuntimeConfig` and `publicRuntimeConfig` are removed; read `process.env` dynamically after `await connection()` or `await io()`.

## `next/image` 16.x Breaking Defaults

- `minimumCacheTTL`: `14400` (4h, up from `60`s).
- `qualities`: `[75]` (requests with unlisted `?q=` return `400`; declare all needed levels explicitly).
- `imageSizes`: `[32, 48, 64, 96, 128, 256, 384]` (`16` removed).
- `maximumRedirects`: `3` (was unlimited).
- Local images with query strings fail unless `images.localPatterns` explicitly lists `search` (e.g. `search: '?v=1'`).
- Local/private IPs are blocked by default; set `dangerouslyAllowLocalIP: true` only for trusted private networks.
- Prefer `images.remotePatterns` (`images.domains` is deprecated).

## Cache Components (`cacheComponents: true`)

- Enable both top-level flags in `next.config.ts`:
  ```ts
  const nextConfig: NextConfig = {
    cacheComponents: true,
    partialPrefetching: true,
  }
  ```
- Remove deprecated `experimental.dynamicIO`, `experimental.useCache`, `experimental.ppr`, and route segment exports `dynamic`, `revalidate`, `fetchCache`, and `runtime` (all error when `cacheComponents: true`).
- Mark cacheable async functions, components, or files with `'use cache'`. Always pair with `cacheLife('<profile>')` (`default`, `seconds`, `minutes`, `hours`, `days`, `weeks`, `max`, or custom `{ stale, revalidate, expire }`) and `cacheTag('...')`.
- Never read `cookies()`, `headers()`, or `searchParams` inside `'use cache'` (`next-request-in-use-cache`). Read them outside, extract serializable values, and pass as arguments — or use `'use cache: private'` (browser-prefetched per session) / `'use cache: remote'` (shared durable `cacheHandlers`).
- Wrap request-time reads (`cookies()`, `headers()`, `params`, `searchParams`, uncached `fetch`) inside `<Suspense>` as low in the tree as possible so layouts and fallbacks stay in the static shell. Forward `params`/`searchParams` Promises into `<Suspense>` children instead of awaiting at page/layout top.
- Call `await io()` (`next/cache`) before `Date.now()`, `Math.random()`, `crypto.randomUUID()`, or sync DB queries (`better-sqlite3`, `node:sqlite`) when fresh per-request values are needed; unlike `connection()`, `io()` is safe inside `'use cache'` scopes too.
- Stage & static contracts:
  - `await prefetch()` (`next/cache`): exclude subtree from App Shell, defer to per-link `<Link prefetch={true}>` or navigation.
  - `await navigation()` (`next/cache`): exclude subtree from runtime prefetch, defer to actual navigation.
  - `export const instant = true | false` (or `{ level: 'warning' }`): validate instant navigation UI.
  - `export const prefetch = 'partial' | 'force-disabled'`: cap per-segment prefetch scope.
  - `export const ensureStatic = 'auto' | 'shell' | 'prefetch' | 'navigation' | false`: enforce static output per navigation stage.

## On-Demand Revalidation

- `revalidateTag(tag, 'max')` (two arguments required; single-arg form is deprecated): stale-while-revalidate in Server Actions or Route Handlers. Use `{ expire: 0 }` from webhooks/Route Handlers when immediate purge is needed.
- `updateTag(tag)` (Server Actions only): immediate expiration + client refresh for read-your-own-writes.
- `refresh()` (Server Actions only): refreshes client router state without full cache invalidation.
- `revalidatePath(path, 'page' | 'layout')`: fallback when tags are unavailable.
