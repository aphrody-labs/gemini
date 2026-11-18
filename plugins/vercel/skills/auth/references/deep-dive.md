## Auth0

Auth0 provides a mature authentication platform with extensive identity provider support.

### SDK Setup

```bash
npm install @auth0/nextjs-auth0
```

### Configuration

```ts
// lib/auth0.ts
import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client();
```

Required environment variables:

```env
AUTH0_SECRET=<random-secret>
APP_BASE_URL=http://localhost:3000   # optional: omit on Vercel previews and the SDK infers it from the request host
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=<client-id>
AUTH0_CLIENT_SECRET=<client-secret>
```

### Proxy

```ts
// proxy.ts
import { auth0 } from "@/lib/auth0";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

### Access Session Data

```tsx
// Server component
import { auth0 } from "@/lib/auth0";

export default async function Page() {
  const session = await auth0.getSession();
  return session ? (
    <p>Hello, {session.user.name}</p>
  ) : (
    <a href="/auth/login">Log in</a>
  );
}
```

## Vercel-Native Identity Primitives

These are not replacements for Clerk, Descope, or Auth0. They cover cases where the identity comes from Vercel itself or where you need Vercel to hold the keys.

### Sign in with Vercel

Let users log in with their Vercel account. Vercel's Identity Provider implements OAuth 2.0 and OpenID Connect: register an App in the dashboard, redirect to `https://vercel.com/oauth/authorize` with PKCE (`code_challenge_method: 'S256'`), `state`, and `nonce`, then exchange the `code` at `https://api.vercel.com/login/oauth/token`. Access tokens last 1 hour; refresh tokens last 30 days and rotate on use. Never hand-roll the token exchange without PKCE, state, and nonce checks. Docs: https://vercel.com/docs/sign-in-with-vercel/getting-started

### Vercel Passport (deployment protection)

Passport protects whole deployments behind your own OIDC identity provider (Okta, Microsoft Entra ID, Auth0, or any OIDC-compatible provider). Vercel Connect stores the OAuth application configuration, and Vercel redirects unauthenticated visitors before any request reaches your code. Use it for internal tools and previews instead of application-level auth. Your app can read the verified visitor identity server-side or verify a forwarded Passport token as a JWT. Enterprise plan; GA since July 2026. Docs: https://vercel.com/docs/passport

### Vercel KMS (managed signing keys)

KMS signs JWTs and messages with keys that never leave Vercel. Create an issuer in the team's Key Management settings, install `@vercel/kms`, and call `signJWT({ issuerId, claims, ttl })` (resolves to `{ token, keyId, algorithm, fingerprint }`; `@vercel/kms` 0.3.0+, `signToken` is deprecated) inside a route handler or Server Component; the function's OIDC token authorizes the request automatically. Relying parties verify against the published JWKS at `https://kms.vercel.com/<issuerId>/jwks.json`. Use it instead of storing private signing keys in environment variables. Docs: https://vercel.com/docs/kms

## Decision Matrix

| Need | Recommended | Why |
|------|------------|-----|
| Fastest setup on Vercel | Clerk | Native Marketplace, auto-provisioned env vars |
| Passwordless / social login flows | Descope | Visual flow builder, Marketplace native |
| Enterprise SSO / SAML / multi-tenant | Auth0 | Deep enterprise identity support |
| Pre-built UI components | Clerk | Drop-in `<SignIn />`, `<UserButton />` |
| Vercel unified billing | Clerk or Descope | Both are native Marketplace integrations |
| Auth in your own database, no hosted vendor | Better Auth | Runs in your app, data in your own database, no vendor dashboard to configure |
| Not Next.js (SvelteKit, Nuxt, Hono, Expo, plain Node) | Better Auth | Framework-agnostic handler + client adapters |
| Orgs, 2FA, passkeys, SSO, Stripe as code | Better Auth | Plugin system with generated schema |
| "Log in with Vercel" for a developer tool | Sign in with Vercel | Vercel is the identity provider |
| Restrict a deployment to employees behind Okta/Entra | Vercel Passport | Platform-level, no app code |
| Sign JWTs without storing private keys | Vercel KMS | Managed keys, OIDC-authorized signing |

## Clerk Core 3 Breaking Changes (March 2026)

Clerk provides an upgrade CLI that scans your codebase and applies codemods: `npx @clerk/upgrade`. Requires **Node.js 20.9.0+**.

- **`SignedIn`/`SignedOut`/`Protect` replaced by `Show`** — e.g. `<Protect role="admin">` → `<Show when={{ role: 'admin' }}>`
- **Package renames** — `@clerk/clerk-react` → `@clerk/react`, `@clerk/clerk-expo` → `@clerk/expo`
- **`ClerkProvider` must be inside `<body>`, not wrapping `<html>`** — the CLI handles this automatically
- **`@clerk/types` removed** — import types from the SDK's own `/types` entry point, or `@clerk/shared/types` for framework-agnostic code
- **Redirect props renamed** — `afterSignInUrl`/`afterSignUpUrl`/`redirectUrl` → `fallbackRedirectUrl`/`signUpFallbackRedirectUrl`/`forceRedirectUrl`
- **Minimum Next.js version: 15.2.8 (or 16.0.10 on Next.js 16)** — later 15.x minors need their patched releases too (15.3.8+, 15.4.10+, 15.5.9+); Next.js 13 and 14 are no longer supported
- **Satellite domains** — apps no longer auto-redirect on first visit; set `satelliteAutoSync: true` in middleware and `ClerkProvider` to restore Core 2 behavior
- **`getToken()` throws `ClerkOfflineError` when offline** — previously returned `null`; still returns `null` when signed out

## Cross-References

- **Marketplace install and env var provisioning** → `⤳ skill: marketplace`
- **Proxy and Routing Middleware patterns** → `⤳ skill: routing-middleware`
- **Accessing protected deployments from CLI or tests** → `⤳ skill: access-protected-vercel-deployment`
- **Environment variable management** → `⤳ skill: env-vars`
- **Neon Postgres / Upstash Redis for Better Auth** → `⤳ skill: vercel-storage`
- **Sign-in through a Vercel Connect connector with Better Auth (`@vercel/connect/betterauth`); provider API tokens use `getToken()`** → `⤳ skill: vercel-connect`

## Official Documentation

- [Better Auth Docs](https://better-auth.com/docs) · [Next.js integration](https://better-auth.com/docs/integrations/next) · [Sign in with Vercel](https://better-auth.com/docs/authentication/vercel)
- [Better Auth agent skills](https://github.com/better-auth/skills)
- [Clerk + Vercel Marketplace](https://clerk.com/docs/deployments/vercel)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Descope Next.js SDK](https://docs.descope.com/getting-started/nextjs)
- [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Sign in with Vercel](https://vercel.com/docs/sign-in-with-vercel)
- [Vercel Passport](https://vercel.com/docs/passport)
- [Vercel KMS](https://vercel.com/docs/kms)
