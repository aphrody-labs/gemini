# Official Vercel Plugin Rules

- **Verify current docs & schema first**: run `bun x vercel docs search "<query>"`, `bun x vercel docs inspect <page>`, or `vercel_brain_search` before guessing `vercel.json` keys or runtime flags.
- **Compute & Runtime**: default to Node.js (`24.x`) or Bun (`bun1.4.x`) with Fluid Compute; reserve legacy Edge runtime only for minimal header/rewrite handlers.
- **Monorepo & OOM Safety**: set `Root Directory` only in Vercel Project Settings (never `vercel.json`), pin `bunVersion: "1.4.x"` with `bun.lock` v2, and use `NODE_OPTIONS=--max-old-space-size=6144` or prebuilt (`vercel pull` + `vercel build --prod` + `vercel deploy --prebuilt --prod`) if the 7 GB container OOMs (`BUILD_UTILS_SPAWN_137`).
- **Verification & Secrets**: verify protected deployments via `vercel curl` plus real rendered content checks on public URLs; keep all tokens in Vercel env / `.vercel/` (gitignored).
