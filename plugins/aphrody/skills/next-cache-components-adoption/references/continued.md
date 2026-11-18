## step 1: choose a strategy

Ask the user, in terms of the PRs they want, not the size of the job. Never use the internal labels (Incremental, Direct) when talking to the user — those are your own scaffolding. Ask in terms of PRs and features, e.g.: _"Do you want me to first open a PR that turns on Cache Components and opts every route out of validation, then handle the actual route adoptions feature-by-feature in follow-up PRs? Or do everything on one branch?"_ Even on a tiny app, the incremental path still has value (review-sized PR, revertible, the `// TODO: Cache Components adoption` markers double as your work queue for next session). Don't pick on their behalf.

If there's no user to ask, default to **Incremental** and document the choice.

Honor an explicit choice in the request. If the user asks to migrate incrementally and also asks you to complete the migration, establish and verify the incremental checkpoint before continuing to the remaining routes in the same task. “Complete” sets the stopping point; it does not change the chosen strategy.

- **Incremental** — quiet pre-step + the loop. Run the codemod to opt every page and layout out of validation, get the build passing, stop and check in with the user (see [end of the pre-step](#end-of-the-pre-step-check-in)), then enter [step 2's loop](#step-2-the-inner-loop-remove-opt-outs-one-feature-at-a-time) and ship each feature as a follow-up PR.
- **Direct** — skip the pre-step. Enable `cacheComponents` and go straight to [step 2's loop](#step-2-the-inner-loop-remove-opt-outs-one-feature-at-a-time); the build's blocking routes are the work queue.

### incremental

Before invoking the codemod, grep for `^export const (revalidate|dynamic|fetchCache)` across the app directory and follow the migration guide for every match. Mark routes that use `dynamic = 'force-static'` or `dynamic = 'error'` for full migration in this PR. The codemod does not remove incompatible configs.

The codemod refuses to run on a dirty working tree. Commit or stash unrelated work first, or pass `--force` to let its edits land alongside your WIP. Common false positive: if you recently upgraded Next.js, `package.json` and the lockfile will already be dirty — commit those first.

```bash
npx @next/codemod@latest cache-components-instant-false ./app
```

Pass the app directory you resolved in [requires](#requires). A wrong path is not an error: it reports `0 ok` and exits `0`, so read the file count and treat zero as a failed run, not an adopted app.

Inserts `export const instant = false` (with a `// TODO: Cache Components adoption` comment) into every `{page,layout,default}` file under that directory, skipping files that already declare `instant` and any module marked `"use client"` or `"use server"`. Then set `cacheComponents: true`. The TODO comments are the work queue for the loop.

If the codemod isn't available (older `@next/codemod`, sandboxed environment, offline run), reproduce it by hand: for every `{page,layout,default}.{js,jsx,ts,tsx}` in the app directory that isn't `"use client"` or `"use server"` and doesn't already declare `instant`, insert this after the imports:

```ts
// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false
```

The codemod opts every segment out, not only the root, on purpose. Resolution is top-down, first-explicit-config-wins: the highest `instant = false` decides the whole subtree. With an opt-out on every segment, removing one segment's opt-out validates only that segment; descendants keep their own opt-outs and stay passing. If only the root were opted out, removing it would re-arm validation for the entire app at once.

Because the highest opt-out wins, remove them top-down (root layout first, then descend). Removing a leaf's opt-out does nothing while an ancestor still holds one.

Remove the opt-outs from the previously static routes and any shared segments that mask their validation. Resolve their errors and confirm they still prerender. A cached data call alone does not prove the route remains static.

Next, run `next build` to surface blockers the codemod could not handle. The build is the proof, not the codemod run — a shared layout that calls `new Date()` / `Math.random()` directly still fails regardless of the opt-out (see [background](#background)). If the normal build reports a sync-IO error without locating the call, rerun that route with `next build --debug-prerender --debug-build-paths="app/path/to/page.tsx"`. For each sync-IO error it reports:

1. **Sync-IO at module/render time.** Use the route, originating file and line, and `/docs/messages/` link in the build output to locate the error. If needed, grep the whole repo for `new Date()`, `Date.now()`, `Math.random()`, and `crypto.randomUUID()` (not only `app/**/layout.{js,jsx,ts,tsx}` — the read might live in any component imported by a layout). Do not change unreported matches. Apply the appropriate option from the linked error page, then add this comment above a temporary boundary introduced only to unblock the build:

   ```tsx
   // TODO: Cache Components adoption. Added to unblock the build: remove this boundary to re-trigger the error and review the documented options.
   ```

   It shares the `TODO: Cache Components adoption` prefix with the comments the codemod writes, so the check-in grep finds both. Removing the boundary makes the error fire again with its fix cards — the same motion as removing an opt-out in the loop.

After each fix, rerun the scoped build when available, then run `next build` again to find the next blocker. Repeat until the normal build passes.

After the build passes, confirm every deferred route is still covered by an opt-out and no shared opt-out covers a previously static route. If the app has no previously static routes and the root layout remains deferred, confirm it got an opt-out (`grep -n "export const instant" <app dir>/layout.*`). The root layout renders every route, including framework routes like `/_not-found`, so if it was missed, add `export const instant = false` to it by hand.

Synthetic routes like `/_not-found` have no user file — when they block, fix the root layout's opt-out, not the synthetic route. Client Components (`"use client"`) get no opt-out (it's a build error to export `instant` from them), but they are not a rare blocker. The high-frequency case is a client component in the root layout's nav or header calling `usePathname()`/`useSearchParams()`: it blocks _every_ dynamic route with `blocking-prerender-client-hook`, and static routes pass (the pathname is known at prerender), which masks it until you reach a dynamic segment. It's not an ancestor-data fix — follow the [error's docs page](https://nextjs.org/docs/messages/blocking-prerender-client-hook) for the `<Suspense>` recipe. Only when a client route blocks on _server_ data do you fix that data in its ancestor.

### end of the pre-step: check in

Incremental only. The pre-step is the shippable PR. Record the passing checkpoint before starting step 2. Unless the user already asked you to continue through the full migration in the same task, stop and check in. Talk to the user in their language; don't say "Incremental" or other internal labels; talk about adoption, PRs, and what the app does now. Tell them:

- What you did: turned on Cache Components, ran the codemod, migrated the previously static routes, fixed the remaining blockers, and confirmed the build passes.
- What changed: the previously static routes still prerender. Other pages and layouts keep a `// TODO: Cache Components adoption` opt-out.
- What to sanity-check: the previously static routes stay fully prerendered and prefetchable, and request-specific data on the deferred routes remains request-specific.
- The question: "Want to open this as its own PR before we start adopting Cache Components route by route? Or keep going on this branch?" Wait for the answer.

If the user already asked you to complete the migration, continue after recording this checkpoint instead of asking the same question again.

### direct

Set `cacheComponents: true` and move to [step 2](#step-2-the-inner-loop-remove-opt-outs-one-feature-at-a-time). The build's blocking routes are the work queue.

## step 2: the inner loop, remove opt-outs one feature at a time

A "feature" is a single product surface — `app/settings/profile/**`, `app/posts/[slug]/**` — not a whole top-level app like `app/dashboard/**`. Finish one end-to-end before starting the next.

Within a feature, walk top-down (layouts before pages, root layout first). Removing a layout's opt-out before its descendants exposes the layout's own blocking reads. (Direct: there are no opt-outs to remove — fix each failing route; if a hand-written opt-out on an ancestor shadows it, remove that first.)

A passing build mid-walk doesn't mean the layout is clean. Removing a layout's opt-out while its descendant pages still have theirs keeps the build passing — each page shadows the inherited validation. The layout's actual blocking reads only surface once nothing below it shadows them. Don't call a feature done at the layout boundary.

Use the **with-a-browser** loop unless a browser is genuinely unreachable. The [`next-dev-loop`](#verifying-each-fix-at-runtime) skill is the source of truth for what counts as "browser available" and how to install it.

### the loop, with a browser (preferred)

Per route:

- Remove the opt-out (Incremental) or target the failing route (Direct).
- Reload in dev. Overlay clean? Skip to verify. Overlay still red? Fix.
- Fix — fetch the docs page linked from the error (`https://nextjs.org/docs/messages/<slug>`), apply the recipe from there. The inline overlay text is a summary; the docs page is the source of truth.
- Verify in the browser. Confirm the visible content on first paint is what you intended in the shell — not stuck on a fallback, not silently streaming everything out of an empty shell.
- Re-check siblings if the fix touched shared code (a layout, a sidebar component). A shared-shell change can fix the route you're on and break a sibling.

### the loop, build-only (fallback)

Used when there's no way to drive a browser — CI, sandbox, the user has no `next dev` running and you can't start one. Weaker signal: confirms the build passes and the route prerenders, but not what ended up in the static shell vs streamed.

Per route:

- Remove the opt-out (Incremental) or target the failing route (Direct).
- Rebuild with `--debug-build-paths app/<route>/**` (only that route) or `--debug-prerender` (full build, but past the first failure). Route passing? Move on. Still blocking? Fix.
- Fix — fetch the docs page linked from the error (`https://nextjs.org/docs/messages/<slug>`), apply the recipe from there.
- Re-check siblings if the fix touched shared code.
- Flag the route as build-only-verified when you hand the feature off. Each `◐` route still needs a browser pass before the feature is done.

### loop notes

- The [three blocker classes from background](#background) often get missed when fixing in place. Caching a downstream fetch (`getThing(id)`) doesn't clear an `await params` at the top of the page body — push the param promise into the `<Suspense>`-wrapped child.
- Ambiguous calls are user check-ins, not agent judgment. When you're not sure which fix fits, the blocking code looks security-sensitive, or the user might want to keep the route blocking on purpose — read [references/per-page-decisions.md](./references/per-page-decisions.md) before editing. Show the route while you ask using `next-dev-loop`'s browser handoff, with a screenshot as the fallback. "Should this stay blocking?" is much easier to answer while looking at the page than at a file path.
- Don't narrate the refactor with comments. The only comment the codemod (or you) should leave is `// TODO: Cache Components adoption` on opt-outs, and the user's existing comments. Don't annotate every `<Suspense>` boundary or `"use cache"` call with what it does — the code says that. Drop a comment only when the _why_ isn't clear from the code (e.g. a deliberate Block with a reason).
- For many routes with the same mechanical fix, verify one representative route first. Then batch disjoint route groups using the same recipe, and run the shared build and browser checks together.

Keep a todo list of the feature's routes. When every route in the feature is clean, move to step 3.

## step 3: verify the feature

Checklist before checking in with the user:

- `next build` completes without blocking-route errors.
- No bare TODOs in the feature: `grep -rn "TODO: Cache Components adoption"` finds both the codemod's opt-out comments and the sync-IO unblocks from the pre-step. Any `instant = false` left behind is a deliberate, documented Block — comment rewritten to a reason (see [references/per-page-decisions.md](./references/per-page-decisions.md) → "when to leave a Block in place"). Any `await io()` or `await connection()` left behind has been reviewed and kept on purpose, not left over from the pre-step.
- Each route visited in the browser: confirm the static shell renders first and every `<Suspense>` fallback resolves to its real content. Capture both states if you can — the fallback (mid-stream) and the final paint — so you have a streaming-experience demo to show the user. Throttle the network in the browser if streaming is too fast to observe.
- After populating any new cache whose data can be updated, a mutation check confirms the next read returns the expected data.
- If runtime verification fails, reproduce the same route on the pre-adoption branch or with its opt-out restored. A failure that already exists is an environment or data problem, not an adoption regression.

Then check in with the user. Same rule as the pre-step: speak their language. Don't say "feature-by-feature loop" or other internal labels; talk about the feature you adopted and what the user will see.

- What you did: which routes you touched, and the user-visible result per route (e.g. "the post page now streams the article body behind a skeleton while the layout stays static").
- What changed: opt-outs removed, fallbacks added, caching boundaries introduced.
- Show, don't tell. Follow `next-dev-loop`'s browser handoff and drive the route live so the user sees the static shell → fallback → final content sequence. If live presentation is unavailable, attach the before/after screenshots you captured.
- Give them the click-through: a short table of the feature's routes — the URL to open and what to look for (what renders instantly, which fallbacks appear, what streams in) — so they can verify each one themselves.
- The question: "Want to open this feature as a PR and move on to the next, or stop here?" Wait for the answer.

**Trivial features can skip the check-in.** If adopting a feature only meant removing its `// TODO: Cache Components adoption` opt-out (no `<Suspense>` added, no `'use cache'` introduced, no render order change), the user sees nothing different. Move on to the next feature without stopping; mention it in passing the next time you do check in.

When the loop has run on every feature — every remaining `instant = false` sits under a reason comment, `grep -rln "TODO: Cache Components adoption" app` returns nothing — point the user at [further reading](#further-reading) if they want to push the experience further, or stop and ship.

### route table glyphs

`ƒ` → `◐` is where adoption usually lands. `◐ (Partial Prerender)` means a static shell prerenders and the request-time content streams in — the goal state for any route that reads `cookies()`, `headers()`, `params`, or `searchParams`. Some routes legitimately stay `ƒ` when they do request-time work through a documented escape hatch (e.g. a layout that uses `await connection()`); the page is no longer _opted out_, it's genuinely dynamic. Don't remove the escape hatch only to chase a `◐`. The inverse holds: `instant = false` does not force a route to be `ƒ`. The glyph reflects what the route does at prerender time, not which validation knobs it exports.

`◐` tells you a shell exists, not what's in it. A `<Suspense>` boundary placed too high (e.g. wrapping the entire page body, or `<Suspense fallback={null}>` around the article content) pushes the visible content out of the static shell into the streamed payload; the build still reports `◐` because _some_ shell prerendered (often only `<html><body>` with framework markup). The route table can't tell you what's in the shell; a browser can. If the shell is empty and everything streams, pull the `<Suspense>` boundary down closer to the actual dynamic read.

## further reading

The work below is optional and lives in the docs — link the user to them and let them decide which to take on next. Don't walk these through inside this skill.

- [Sweep for more instant navigations](./references/dev-only-validations.md) — an optional follow-up once adoption is done, never required. A passing build is not the last word, because dev validates every route on each page load (simulating both page loads and client navigations) and catches what the build's first-error exit and descendant shadowing skipped. Offer it as the smaller path to instant navigation for a user who doesn't want to adopt Partial Prefetching. Adopting Partial Prefetching (below) runs the same kind of loop and meets these insights anyway, so recommend both and let the user pick which, or whether. The reference is the loop to execute.
- [`next-partial-prefetching-adoption`](https://github.com/vercel/next.js/tree/canary/skills/next-partial-prefetching-adoption) — the follow-up skill that adopts Partial Prefetching: it enables `partialPrefetching` and audits every `<Link prefetch={true}>` against a decision table (or adopts incrementally with the flag off, driven by the `instant-link-prefetch-partial` insight). It sequences this the same way this skill sequences Cache Components, but the insights are dev-only, so it's a browser click-through, not a build loop. Recommended after instant navigation, since those fixes feed directly into how much of each route the shell can prefetch. Concepts live in the [Adopting Partial Prefetching guide](https://nextjs.org/docs/app/guides/adopting-partial-prefetching).
- [Prevent regressions with e2e tests](https://nextjs.org/docs/app/guides/instant-navigation#prevent-regressions-with-e2e-tests) — the `@next/playwright` [`instant()`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant#testing-instant-navigation) helper asserts on the UI that's available immediately on navigation, so regressions surface in CI. Recommend it once a route is instant: `next-dev-loop` confirms it _now_; an `instant()` test keeps it that way.
- [`next-cache-components-optimizer`](https://github.com/vercel/next.js/tree/canary/skills/next-cache-components-optimizer) — a separate skill that grows each route's static shell so more of the page prerenders and less streams in. Pure optimization, not part of adoption.

