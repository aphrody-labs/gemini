## Reducing ISR cost

- **Prefer tag-based over time-based revalidation.** Replace short `revalidate` intervals with on-demand `revalidateTag` / `invalidateByTag` when content changes — time-based regeneration runs whether or not anything changed. If using Cache Components, check `cacheLife` calls against the Next.js bundled docs (`node_modules/next/dist/docs/`).
- **Scope tags to specific IDs.** Invalidate `blogPost:<id>`, not a generic `blogPost`/`page` tag — one broad invalidate regenerates everything that carries it.
- Tune the revalidate interval where your framework declares it (Next.js `revalidate` / `cacheLife`, SvelteKit `isr`, Nuxt `routeRules`, Astro). For Next.js Cache Components, see the bundled docs or the official `next-cache-components-optimizer` skill (`npx skills add vercel/next.js --skill next-cache-components-optimizer`).
- Use `CDN-Cache-Control` headers to cache dynamic functions.

### Inspect one path

```bash
curl -sSI https://<host>/<path> | grep -iE 'x-vercel-cache|x-matched-path|cache-control|vary|age|set-cookie'
```

This zero-dependency first reach shows the status (`x-vercel-cache`), the cache directives (`Cache-Control` / `CDN-Cache-Control` / `Vercel-CDN-Cache-Control`), and — crucially — **`x-matched-path`**, which reveals rewrites like `/precomputed/exp~.../...` that expose experiment/flag precomputation. `vary` flags personalization (RSC, cookies); `set-cookie` forces `BYPASS`. For a per-phase timing breakdown, `vercel httpstat /some/path` (CLI v48.9.0+; needs the `httpstat` tool installed) adds latency stats. A path that should cache but shows `MISS`/`BYPASS` usually has `private`, `no-store`, `max-age=0`, a per-request input (cookies/headers/`searchParams`), or an uncacheable method (see FAQ).

**Inspect one request.** When metrics or headers give you a request ID, pull its CDN record and the runtime logs it produced:

```bash
vercel logs requests --query 'requestId:"<request-id>"' --since 1h --json   # status, cache result, path
vercel logs --query 'requestId:"<request-id>"' --since 1h --json            # runtime log entries
```

Set `--since`/`--until` to cover when the request happened; the default window is the last 30 minutes. With `--json`, record fields are under `.data` (for example `jq 'select(.type == "request") | .data.cacheResult'`), and the final `summary` line says whether more records matched.

## FAQ

- **What are prerender variant misses?** When a route uses a dynamic param, each distinct cache-key variant is prerendered and cached separately, so each variant misses on its first hit per region and low-traffic ones rarely stay warm. The most common modern cause is **feature-flag / experiment precomputation** — middleware picks a variant per request (`/precomputed/exp~.../...` paths), and flags × routes × PPR segments multiply into thousands of ISR entries (also a middleware-invocation cost). Fix: collapse the variant matrix (retire finished experiments), or accept the cost.
- **Does PPR avoid function invocations?** No — a PPR route has dynamic holes by definition, so the cached shell hit still runs the function to fill them. (A route with _no_ holes is just ISR and serves a pure `prerender` HIT — see Key concepts.)
- **Why are there more function invocations than PPR requests?** PPR requests have a static shell and a dynamic function invocation. When the static shell needs to be regenerated, it incurs a function invocation on top of the dynamic function for the content.

## Related skills

- `vercel-firewall` — manage verified SEO crawlers, block abusive bots, and rate-limit junk BYPASS traffic.
- `runtime-cache` — caching data _between your function and a backend_ (per-region key-value / data cache). A different layer from the CDN/ISR caches; use it to cache an API response or query result inside a function.

## References:

- Caching overview: https://vercel.com/docs/caching
- ISR: https://vercel.com/docs/incremental-static-regeneration
- Partial Prerendering (PPR): https://vercel.com/docs/partial-prerendering
- Cache-Control headers: https://vercel.com/docs/caching/cache-control-headers
- Diagnosing and fixing cache issues (full runbook): https://vercel.com/docs/caching/cdn-cache/debug-cache-issues
- vercel metrics CLI: https://vercel.com/docs/cli/metrics
- vercel logs CLI: https://vercel.com/docs/cli/logs
