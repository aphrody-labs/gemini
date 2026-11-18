# Vercel Production Best Practices

Distilled from `vercel/vercel-plugin` (`deployment-expert`, `performance-optimizer`, `vercel-functions`, `vercel-cli`, `deployments-cicd`, `env-vars`).

1. **Runtime & Compute**: Use Node.js (`24.x`) or Bun (`bun1.4.x`) with **Fluid Compute** instead of legacy Edge runtime for API/SSR routes unless ultra-simple header rewriting.
2. **Monorepo & `rootDirectory`**: Never place `rootDirectory` inside `vercel.json` (invalid top-level key; configured in Vercel Project Settings). Keep `outputFileTracingRoot` set to workspace root and `ignoreBuildErrors` paired with explicit CI `bun check`.
3. **Out-of-Memory (`BUILD_UTILS_SPAWN_137` / 7 GB container cap)**:
   - Set `NODE_OPTIONS=--max-old-space-size=6144` or throttle `experimental.cpus` for static page generation.
   - For large monorepos or heavy static SSG sites, use **Prebuilt Deploys**: pull production env via `vercel pull --yes --environment=production`, build in Linux (`prd` / CI / local container) with `vercel build --prod` or Build Output API v3 (`bun src/scripts/build-vercel.ts`), and deploy via `vercel deploy --prebuilt --prod --archive=tgz --yes`.
   - Exclude Win32/heavy native binaries (`sharp`, `@img`, `*.wasm`) via `outputFileTracingExcludes` when Vercel optimizes separately or custom CDN image loader is active.
4. **Bun Lockfile Parity**: Ensure Vercel install uses Bun 1.4.x (`bunVersion: "1.4.x"` in Project/vercel.json) so `bun.lock` (`lockfileVersion: 2`) does not fall back and re-resolve.
5. **Verification & Deployment Protection**: Always verify protected preview/prod URLs with `vercel curl <url>/health` and public domains end-to-end (real rendered HTML/JSON content + Chromium screenshots + MWG check, never bare HTTP 200).
6. **MCP & Knowledge Discipline**: Use `vercel_brain_search` / `bun x vercel docs search` before guessing top-level `vercel.json` keys or runtime flags, and register `https://mcp.vercel.com` only where team OAuth is authorized.
