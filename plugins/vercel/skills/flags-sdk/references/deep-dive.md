## Bulk evaluation

To evaluate **multiple** flags at once, call `evaluate()` (from `flags/next`) instead of awaiting flags one at a time or using `Promise.all()`. To evaluate a **single** flag, just call it: `await myFlag()`.

```ts
import { evaluate } from 'flags/next';
import { flagA, flagB } from '../flags';

// avoid: each await blocks the next, so the flags resolve sequentially
const a = await flagA();
const b = await flagB();

// avoid: parallel, but each flag is evaluated in isolation
const [a, b] = await Promise.all([flagA(), flagB()]);

// prefer: shares work across the batch
const [a, b] = await evaluate([flagA, flagB]);
```

`evaluate()` is faster than both approaches. Awaiting flags one at a time makes total latency the sum of every flag's evaluation instead of the slowest single flag, while `Promise.all()` runs them in parallel but evaluates each in isolation. `evaluate()` pre-reads headers, cookies, and overrides once for the whole batch and lets adapters resolve a group in a single call, which reduces the number of parallel promises the runtime manages and leaves less room for the async work to be interrupted by other microtasks.

It accepts either an **array** (positional results) or an **object** (keyed results):

```ts
const [a, b] = await evaluate([flagA, flagB]);
const { a, b } = await evaluate({ a: flagA, b: flagB });
```

Outside App Router (Pages Router `getServerSideProps`/API routes, or routing middleware), pass the request as the second argument: `await evaluate([flagA, flagB], request)`.

`evaluate()` always evaluates flags at request time. It is not for reading [precomputed](#precompute-pattern) (static) values — for those, use `getPrecomputed` (or call the flag with the code, `await myFlag(code, flagGroup)`).

Adapters can opt into batching by implementing the optional `bulkDecide` hook. The Vercel adapter (`@flags-sdk/vercel`) implements it — roughly a 10x reduction in evaluation time when resolving hundreds of flags. See [references/providers.md — Custom Adapters](references/providers.md#custom-adapters) for implementing `bulkDecide`, and [references/api.md — `evaluate`](references/api.md#evaluate) for the full signature.

## Flags Explorer setup

### Next.js (App Router)

```ts
// app/.well-known/vercel/flags/route.ts
import { createFlagsDiscoveryEndpoint } from 'flags/next';
import { getProviderData } from '@flags-sdk/vercel';
import * as flags from '../../../../flags'; // adjust if flags live under lib/ or src/

export const GET = createFlagsDiscoveryEndpoint(async () => {
  return getProviderData(flags);
});
```

### With external provider data

When using a third-party provider alongside Vercel Flags, combine their data with `mergeProviderData`. Each provider adapter exports its own `getProviderData` — see the provider-specific examples in [references/providers.md](references/providers.md).

### SvelteKit

```ts
// src/hooks.server.ts
import { createHandle } from 'flags/sveltekit';
import { FLAGS_SECRET } from '$env/static/private';
import * as flags from '$lib/flags';

export const handle = createHandle({ secret: FLAGS_SECRET, flags });
```

## FLAGS_SECRET

Required for precompute and Flags Explorer. Vercel Flags activation creates a value per environment. Preserve existing values; do not rotate them during ordinary SDK setup. A missing local value does not mean the remote value is missing: check the target environment first, then follow [Pull environment variables](#pull-environment-variables) for Development.

Only generate a secret for an environment where it is absent. Use 32 cryptographically random bytes, base64-encoded, with a distinct value per environment. Mark Preview and Production values Sensitive. Send generated values directly to storage, such as stdin for `vercel env add`; do not print them to terminal output, logs, or chat, or embed them in command arguments.

## Precompute pattern

Use precompute to keep pages static while using feature flags. Middleware evaluates flags and encodes results into the URL via rewrite. The page reads precomputed values instead of re-evaluating.

High-level flow:
1. Declare flags and group them in an array
2. Call `precompute(flagGroup)` in middleware, get a `code` string
3. Rewrite request to `/${code}/original-path`
4. Page reads flag values from `code`: `await myFlag(code, flagGroup)`

For full implementation details, see framework-specific references:
- **Next.js**: See [references/nextjs.md](references/nextjs.md) — covers proxy middleware, precompute setup, ISR, generatePermutations, multiple groups
- **SvelteKit**: See [references/sveltekit.md](references/sveltekit.md) — covers reroute hook, middleware, precompute setup, ISR, prerendering

## Custom adapters

Create an adapter factory that returns an object with `origin` and `decide`. For the full pattern (including default adapter and singleton client examples), see [references/providers.md](references/providers.md#custom-adapters).

## Encryption functions

For keeping flag data confidential in the browser (used by Flags Explorer):

| Function                   | Purpose                             |
| -------------------------- | ----------------------------------- |
| `encryptFlagValues`        | Encrypt resolved flag values        |
| `decryptFlagValues`        | Decrypt flag values                 |
| `encryptFlagDefinitions`   | Encrypt flag definitions/metadata   |
| `decryptFlagDefinitions`   | Decrypt flag definitions            |
| `encryptOverrides`         | Encrypt toolbar overrides           |
| `decryptOverrides`         | Decrypt toolbar overrides           |

All use `FLAGS_SECRET` by default. Example:

```tsx
import { encryptFlagValues } from 'flags';
import { FlagValues } from 'flags/react';

async function ConfidentialFlags({ values }) {
  const encrypted = await encryptFlagValues(values);
  return <FlagValues values={encrypted} />;
}
```

## React components

```tsx
import { FlagValues, FlagDefinitions } from 'flags/react';

// Renders script tag with flag values for Flags Explorer
<FlagValues values={{ myFlag: true }} />

// Renders script tag with flag definitions for Flags Explorer
<FlagDefinitions definitions={{ myFlag: { options: [...], description: '...' } }} />
```

## References

Detailed framework and provider guides are in separate files to keep context lean:

- **[references/nextjs.md](references/nextjs.md)**: Next.js quickstart, toolbar, App Router, Pages Router, middleware/proxy, precompute, dedupe, dashboard pages, marketing pages, suspense fallbacks
- **[references/sveltekit.md](references/sveltekit.md)**: SvelteKit quickstart, toolbar, hooks setup, precompute with reroute + middleware, dashboard pages, marketing pages
- **[references/providers.md](references/providers.md)**: All provider adapters — Vercel, Global Config, Statsig, LaunchDarkly, PostHog, GrowthBook, Flagsmith, Reflag, Split, Optimizely, OpenFeature, and custom adapters
- **[references/api.md](references/api.md)**: Full API reference for `flags`, `flags/react`, `flags/next`, and `flags/sveltekit`
