---
name: nextjs-app-router
description: Next.js 16.5+ App Router architecture covering proxy.ts, async Request APIs, PageProps/LayoutProps/RouteContext, next/root-params, RSC vs Client boundaries, useSyncExternalStore, catchError, Parallel Routes default.tsx, and route.go.
---

# Next.js 16.5+ App Router

Use this skill when building or refactoring Next.js App Router routes, layouts, proxy handlers, Server Actions, or Client/Server component boundaries.

## Lookup Order

1. Project-local docs: `node_modules/next/dist/docs/01-app/` (exact match to installed Next.js).
2. Compacted brain: `nextjs_brain_search`, `nextjs_types_lookup`, `nextjs_docs_lookup` (`nextjs-brain` MCP) or `bun ~/.gemini/scripts/learn.ts search "<terms>"`.

## Request Boundary (`proxy.ts`)

- Rename `middleware.ts` -> `proxy.ts` and export `proxy(request: NextRequest, event?: NextFetchEvent)` (or type as `NextProxy`). Export `config: ProxyConfig` (`matcher` constants only).
- `proxy.ts` runs on the **Node.js runtime** only; exporting `runtime` throws.
- Exclude static and metadata paths in `matcher`: `'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'`. Note that `/_next/data/*` still invokes Proxy even if excluded.
- Set upstream request headers with `NextResponse.next({ request: { headers } })`, never `{ headers }` (which sets response headers).
- Do not rely on Proxy alone for security: Server Functions run as `POST` to the page path, so changing `matcher` or moving a component can bypass Proxy. Re-verify auth and permissions inside every Server Function and Route Handler.

## Async Request APIs & Route Typing

- Synchronous compatibility was removed in Next.js 16. Always `await`:
  - `const { slug } = await props.params` (`PageProps<'/blog/[slug]'>`)
  - `const query = await props.searchParams`
  - `const cookieStore = await cookies()` / `const h = await headers()` / `const { isEnabled } = await draftMode()` (`next/headers`)
  - `params` and `id` in `opengraph-image`, `twitter-image`, `icon`, `apple-icon`, and `sitemap({ id })`
- Run `bunx next typegen` (or `next dev`) to generate `PageProps<'/...'>`, `LayoutProps<'/...'>`, `RouteContext<'/...'>`, and typed `next/root-params` getters.
- Use `next/root-params` (`import { lang } from 'next/root-params'`) to read dynamic segments above the root layout from any Server Component or server helper without prop drilling. Never import `next/root-params` in Client Components, Server Actions, Route Handlers, or `unstable_cache`, and avoid kebab-case root folder names (`[post-slug]`).

## RSC vs Client Boundaries & React 19

- Layouts and pages are Server Components by default. Keep `'use client'` at leaf interactive components.
- Never import server modules (`fs`, DB pools, secrets) into Client Modules; guard server-only helpers with `import 'server-only'` and browser-only helpers with `import 'client-only'`.
- Interleave Server Components inside Client Components by passing them as `children` or JSX props rather than importing them directly inside a `'use client'` file.
- Render React Context Providers as deep as possible in the tree (around `{children}` rather than wrapping `<html>`).
- Subscribe to external/browser stores (`matchMedia`, `localStorage`, online status, external mutable state) with `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` rather than `useEffect` + `setState` to prevent hydration flashes and extra render passes.
- Under Next 16.5 (`reactCompiler: true` + React 19.2), avoid effect-driven derived state; use `useEffectEvent` for non-reactive callbacks inside Effects, `<Activity>` for preserved hidden UI state, and `useOffline()` (`next/offline` with `experimental.useOffline: true`) for connectivity status.

## Parallel Routes, Errors & Offline

- Every parallel route `@slot` requires an explicit `default.tsx` returning `null` or calling `notFound()`, or `next build` fails.
- Use `catchError` from `next/error` (`catchError((props, { error, retry, reset }) => ...)`) in `'use client'` wrappers for component-level error recovery (`retry()` re-fetches RSC payloads inside a Transition without losing sibling client state). Reserve `error.tsx` / `global-error.tsx` for segment-level boundaries.
- Experimental Go Route Handlers (`app/**/route.go`) require `experimental.goRoutes: true`, Turbopack, and Go 1.24+; they execute dynamically (`GET`/`POST`/etc. taking `http.ResponseWriter, *http.Request`) with `ParamValues(r, name)` and `r.PathValue(...)`.
