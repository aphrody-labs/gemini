## Framework adapters

Choose the adapter by job:

- `@vercel/connect/ai-sdk` and `@vercel/connect/mcp`: use `connectAuthProvider()` to authenticate MCP clients and coordinate consent. Provider consent and AI SDK tool approval are separate decisions.
- `@vercel/connect/tanstack-ai`: use its Connect transport and consent helpers with TanStack AI.
- `@vercel/connect/chat`: supply credentials for supported Chat SDK adapters. Connect-trigger OIDC verification applies to Slack, Discord, Microsoft Teams, GitHub, and Linear. Notion and Telegram use their native inbound mechanisms.
- `@vercel/connect/eve`: authorize eve connections, supply channel credentials, and authenticate inbound OAuth routes.
- `@vercel/connect/betterauth` and `@vercel/connect/authjs`: sign users into your application through a Connect OAuth provider.

### Better Auth and Auth.js

These adapters sign users into the application. They do not return a provider API token. If the app also needs to call the provider API, use the root SDK's `getToken()` with the appropriate subject and scopes.

#### Better Auth: `@vercel/connect/betterauth`

Optional peer dependency: `better-auth`. Pass the connector through Better Auth's `genericOAuth` plugin. Connector UIDs can contain a `/` (e.g. `linear/myagent`), and Better Auth additionally requires a `providerId`:

```typescript
import { genericOAuth } from "better-auth/plugins/generic-oauth";
import { connect } from "@vercel/connect/betterauth";

genericOAuth({
  config: [connect({ providerId: "linear", connector: "linear/myagent" })],
});
```

#### Auth.js: `@vercel/connect/authjs`

Optional peer dependency: `@auth/core`. Use the connector as an `OAuth2Config` provider. Connector UIDs can contain a `/` (e.g. `linear/myagent`), and Auth.js additionally requires an `id` and a `name`:

```typescript
import { connect } from "@vercel/connect/authjs";

const providers = [
  connect({ id: "linear", name: "Linear", connector: "linear/myagent" }),
];
```

## Project links, installations, and environments

- `vercel connect attach <connector>` grants the linked project access in selected environments. Use `detach` to remove that link.
- Project links authorize token requests. They do not isolate a connector's provider installations. Use separate connectors when production and non-production must be isolated at the provider level.
- Installation-backed connectors may require `installationId`. Never guess one when multiple installations are available.
- Custom Environments and branch targeting are configured through project-link and trigger options. Inspect current CLI help before changing them.

## Triggers and observability

Triggers are opt-in destinations that forward supported provider events to an application. Connect signs forwarded requests, retries documented 5xx failures, and limits the number of destinations per connector. Configure trigger paths and environment or branch targeting explicitly rather than assuming connector creation adds them.

Use connector event history, correlation IDs, and configured drains when diagnosing token, installation, authorization, or trigger failures. Do not log raw provider tokens.

## Recommended workflow

1. Link the local directory with `vercel link`, then pull a development OIDC token with `vercel env pull`.
2. Run `vercel connect list` and, when needed, `vercel connect list --all-projects`.
3. If no suitable connector exists, inspect `vercel connect create <service> --help`, create it, and capture the returned UID or ID.
4. Attach the connector to the consuming project and required environments.
5. For CLI token requests, choose the narrowest practical subject, installation, and scopes. In SDK code, also use `audience`, `resources`, or `authorizationDetails` when the provider requires them.
6. If user consent or provider installation is required, surface the authorization URL or typed error and wait for completion.
7. Call the provider with the short-lived credential. In SDK code, request it at use time and let the cache refresh it.
8. Configure triggers separately when inbound events are required, then verify delivery with event history and correlation IDs.

## Sources of truth

Vercel Connect changes quickly. Before generating commands or framework code, consult:

- [Vercel Connect docs](https://vercel.com/docs/connect)
- [CLI reference](https://vercel.com/docs/cli/connect)
- [TypeScript SDK reference](https://vercel.com/docs/connect/ts-sdk-reference)
- [Frameworks and adapters](https://vercel.com/docs/connect/frameworks)
- [Connector catalog](https://vercel.com/connect/browse)
