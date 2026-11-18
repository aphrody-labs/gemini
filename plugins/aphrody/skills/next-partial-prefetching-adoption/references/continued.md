## step 5: sweep for URL-data insights (after enabling)

This is a dev-only second pass. The shell check runs only with the flag on, fires at navigation time, and never blocks the build, so it can happen any time after step 4. Build the route queue from a concrete source (the last `next build` route table, or the `app/` tree) and keep it as a todo list.

Sweep feature by feature. A feature is a single product surface — `app/settings/**`, `app/posts/[slug]/**` — not a whole top-level area. Finish one end-to-end before starting the next: load its routes in `next dev` and resolve their insights. The insight never blocks the build and each route is independent, so a partial sweep leaves a working app, and each feature is a self-contained change the user can review or ship on its own.

If the environment can't finish the whole sweep (slow first compiles, a dev server that falls over under load, no browser at all), take the browser-free work as far as it goes before handing off. Adopt every route you can statically: apply the fix from [`URL data`](https://nextjs.org/docs/messages/instant-shell-url-data) up to a new `<Suspense>` boundary, gating on type-check. Work the whole queue in one pass — a larger refactor isn't a reason to defer, and asking whether to continue to the next route or tier isn't a checkpoint; keep going. Stop only for a genuine judgment call, and batch those into the single hand-off report: the routes you statically adopted, the ones still needing a live shell check, and the queue.

Watch the Insights tab and the dev log for `Next.js encountered … data` lines. The signal this step adds is [`URL data`](https://nextjs.org/docs/messages/instant-shell-url-data): a `params` or `searchParams` read too high in the suspended subtree ties the shared shell to one URL. This insight is narrow; it most reliably appears on a `generateStaticParams` route where `params` is already under `<Suspense>`, but still awaited before the URL-specific leaf boundary. If a `blocking-prerender-*` error fires instead, apply the same structural fix.

Loading a route with the flag on prerenders its App Shell, which validates more of the route than the Cache Components build did. So a route that built cleanly under Cache Components (every route `◐`, no errors) can still surface a `blocking-prerender-*` error here the first time its shell is prerendered — [`runtime data`](https://nextjs.org/docs/messages/blocking-prerender-runtime) (`cookies()`/`headers()`), [`uncached data`](https://nextjs.org/docs/messages/blocking-prerender-dynamic) (an uncached `fetch`/DB call), or sync IO like `Date.now()`/`new Date()`. This doesn't mean the Cache Components adoption was incomplete; it's new validation reaching a path the build never exercised. These aren't Partial Prefetching insights — fix each one the same way you would any blocking-prerender error.

These fixes rarely involve the user — each insight names the offending read and its docs page has the fix, so apply it and keep sweeping. Collect the rare exceptions for one batched question at the end: a page that is entirely one URL-dependent region (wrapping it all leaves an empty shell), or a route that should arguably stay opted out. Don't narrate the refactor with comments — the `<Suspense>` boundaries speak for themselves.

## step 6: verify

Checklist before checking in with the user:

- **An empty sweep is expected when Cache Components adoption finished cleanly.** A quiet log is success, not a missing signal. If you deliberately probe the validation path, use a `generateStaticParams` route with `params` read inside `<Suspense>` but before the URL-specific leaf boundary; other shapes may surface `blocking-prerender-*` instead.
- The App Shells are real: for each route you changed, confirm the first paint after a navigation shows the intended shared content, not an empty shell or a stuck fallback. A `<Suspense>` around the whole page body passes validation with an empty shell, which defeats the point.
- The insights validate shell _structure_, not that a prefetch actually happened. Confirm on the production run (automatic prefetching runs only in production) that navigating a changed link lands on the shared shell instantly.
- For test-backed preservation, every locked `instant()` test for an audited `<Link prefetch={true}>` passes against the production run. For manual preservation, the before/after inventory and any deferred test follow-ups are recorded.
- After populating any new or expanded cache whose data can be updated, a mutation check verifies the next read through an applicable existing test suite or a recorded manual check when the project has no such coverage.
- **If the app prefetches imperatively**, the insight sweep does not cover it, so an empty sweep is not proof the prefetch survived the flag. Verify the call under `next start`: compare the `_rsc` prefetch response or resource timing before/after, and make sure any intentionally preserved full prefetch still carries the data the old call was warming. If it now returns only the App Shell, migrate that call site using the same decision as the nearest `<Link prefetch={true}>` destination — cache the data, or move per-link-prefetch behavior to a docs-supported `<Link prefetch={true}>`.
- **Before blaming a broken route on the flag, reproduce it with `partialPrefetching` off** (or on the pre-flag branch). The flag surfaces existing issues — a fragile request-time auth gate, a rewrite, deployment skew — earlier and more visibly, but rarely causes them. If it breaks flag-off too, it isn't a Partial Prefetching problem; fix it there, not here.
- `next build` still passes.

Then check in with the user. Speak their language — no insight slugs or step labels.

- What you did: which links you audited, which destinations you adopted, and what each link now prefetches.
- What changed: dropped props, `use cache` boundaries added, and which routes carry a `TODO(per-link-prefetch)` marker for later.
- Demo against a production run. Automatic prefetching runs only in production, so `next dev` won't show the result — run `next build` and `next start`, and hand the user that URL. That run needs the app's real environment (database, auth, secrets), and a partial or stale install or leftover generated artifacts can fail the build for reasons unrelated to the adoption. Set the expectation up front that verification is a complete, credentialed production run, not a quick check.
- Show, don't tell: drive one link live in the headed browser against the production server, so they see the shared App Shell paint instantly and the URL-specific region stream in. Attach before/after screenshots only when a live browser isn't possible.
- Give them the click-through: a table of each changed route — the link to click, and what to expect after the click (what paints instantly, what streams in) — so they can verify each result themselves.
- The question: "Want to commit this (or open the PR) before we look at which routes should also prefetch their URL-specific content?" Wait for the answer — adoption and per-link prefetching read best as their own changes.

## step 7: per-link prefetching (optional)

The audit marked candidates beyond the already-preserved legacy contract instead of deciding them. Grep for `TODO(per-link-prefetch)` and walk the list with the user in one conversation. The question per route is whether they want the additional URL-dependent content prefetched ahead of the click, or streaming in after navigation is fine. A per-link prefetch costs a server invocation per prefetchable link — the guide's [trade-offs](https://nextjs.org/docs/app/guides/optimizing-prefetching#trade-offs) section is the checklist. Don't make these calls alone.

Where the answer is no, delete the marker and leave the route on the App Shell default. Where the answer is yes, follow the [Optimizing prefetching guide](https://nextjs.org/docs/app/guides/optimizing-prefetching), confirm the opted-in link against a production run, and delete the marker when the selected result is verified.

No `TODO(per-link-prefetch)` marker survives the finished step. Per-link optimization remains a separate commit or PR from adoption.

Finally, show any effective `prefetch={false}` links in a concise `Navigation | Why it may no longer be needed` table. Explain that `false` disables all prefetching, while Partial Prefetching's default `auto` behavior prefetches only the shared App Shell, so opt-outs added to avoid legacy full-route prefetching may now be unnecessary. Invite the user to revisit them separately.

## further reading

- [Instant navigation](https://nextjs.org/docs/app/guides/instant-navigation) — the broader validation model and loading-state tooling.
- [Prevent regressions with e2e tests](https://nextjs.org/docs/app/guides/instant-navigation#prevent-regressions-with-e2e-tests) — use the `@next/playwright` `instant()` helper to build the flag-off baseline suite, then keep it as the CI regression guard.
- [`next-cache-components-optimizer`](https://github.com/vercel/next.js/tree/canary/skills/next-cache-components-optimizer) — grows each route's static shell so the App Shell carries more.

