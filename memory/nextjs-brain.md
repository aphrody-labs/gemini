# Next.js 16.5+ Knowledge Digest

Authoritative compacted references live in `~/.gemini/brain/nextjs/` (`INDEX.md`, `TYPES_DIGEST.md`, `CONFIG_SCHEMA.md`, `DOCS_DIGEST.md`, `UPSTREAM_APIS.md`) and are FTS5-indexed in `~/.gemini/learning/memory.db`.

## Core Invariants

1. **Request Boundary (`proxy.ts`)**:
   - Use `proxy.ts` exporting `proxy(request: NextRequest, event?: NextFetchEvent)` (`NextProxy`, `ProxyConfig`), never `middleware.ts`. Node.js runtime only (`runtime` export throws; `skipProxyUrlNormalize` replaces `skipMiddlewareUrlNormalize`).
   - Exclude static/image routes via `matcher` and always re-verify auth inside Server Functions and Route Handlers.

2. **Async Request APIs & Typed Routes**:
   - Always `await params`, `await searchParams`, `await cookies()`, `await headers()`, `await draftMode()`, and async `params`/`id` in `opengraph-image`, `icon`, `sitemap`.
   - Use `PageProps<'/route'>`, `LayoutProps<'/route'>`, `RouteContext<'/api/route'>` (`next typegen`), and `next/root-params` in Server Components only.

3. **Cache Components & Revalidation**:
   - Enable top-level `cacheComponents: true` and explicit `partialPrefetching: true` in `next.config.ts`; remove deprecated `experimental.dynamicIO`/`useCache`/`ppr` and segment exports `dynamic`, `revalidate`, `fetchCache`, `runtime`.
   - Pair `'use cache'` with `cacheLife(...)` and `cacheTag(...)`; keep `cookies()`/`headers()`/`searchParams` outside `'use cache'` and pass serializable args (or use `'use cache: private'` / `'use cache: remote'`).
   - Wrap uncached dynamic reads in `<Suspense>` and call `await io()` (`next/cache`) before `Date.now()`, `Math.random()`, `crypto.randomUUID()`, or sync DB reads (`await connection()` when requiring a real HTTP request).
   - Use `revalidateTag(tag, 'max')` (2 args required) for stale-while-revalidate, and `updateTag(tag)` / `refresh()` in Server Actions for immediate read-your-own-writes.

4. **Config, Rewrites, Image Defaults & DevTools**:
   - Route order: `headers` -> `redirects` -> `proxy.ts` -> `rewrites.beforeFiles` -> filesystem (`public/`, `_next/static/`, pages) -> `rewrites.afterFiles` -> dynamic routes -> `rewrites.fallback`. Put host rewrites (`has: [{ type: 'host', value }]`) in `beforeFiles`.
   - `next/image` defaults: `minimumCacheTTL: 14400`, `qualities: [75]`, `maximumRedirects: 3`, `imageSizes` omits `16`, query-string local images need `localPatterns.search`, local IPs require `dangerouslyAllowLocalIP: true`.
   - Turbopack is default; `next lint` is removed; parallel route `@slot` dirs require `default.tsx`; verify live runtime state via `/_next/mcp` (`get_errors`, `get_compilation_issues`, `compile_route`, `get_routes`) or `bunx next-devtools-mcp@latest`.

## Commands

- Refresh brain & FTS5 index: `bun ~/.gemini/scripts/import-nextjs-brain.ts --src <path-to-next> --live && bun ~/.gemini/scripts/sync.ts`
- Search offline memory: `bun ~/.gemini/scripts/learn.ts search "<terms>"`
