# Cloudflare Edge, FinOps & Sovereign Infrastructure Rules

Authoritative baseline distilled from `cloudflare/skills` (`rules/workers.mdc`, `workers-best-practices`), `cloudflare/security-audit-skill`, `aphrody-labs/.github` (`STANDARD.md` §14), and `aphrody-dev/ay-cf`.

## 1. Documentation & Tool Selection

- **Prefer retrieval over pre-training**: inspect lockfiles, `compatibility_date`, and live Cloudflare docs before asserting runtime flags or APIs.
- **CLI rule**: use `wrangler` (`bun x wrangler ...`) inside projects with `wrangler.{jsonc,json,toml}`; use `cf` (`cf-cli`) for account-level resource/API discovery (`--dry-run` before mutations).
- **Use battle-tested SDKs**: use `cloudflare` (TypeScript/Python SDK), `hono` + `zod` + `@cloudflare/workers-types` (`wrangler types`), `workers-rs`, `pingora`, and `quiche` rather than custom raw `fetch` or HTTP parsing wrappers.

## 2. Workers Paid & Production Defaults

- Keep `compatibility_date` current and regenerate `worker-configuration.d.ts` via `wrangler types` after any binding change.
- Set explicit `limits.cpu_ms` (`50` ms for CDN/proxy/static Workers; `500` ms for API/MCP/compute Workers) to bound Workers Paid CPU overages.
- Enable **both** logs and traces (`observability.enabled = true`, `observability.traces.enabled = true`), with cost-conscious `head_sampling_rate` (`0.1` logs / `0.05` traces on high-RPS CDN Workers, `1.0` logs / `0.1` traces on low-volume control/webhook Workers) to stay inside the 20M free monthly events tier.
- Disable `workers.dev` and preview URLs once a custom domain, route, or Queue consumer serves the Worker.
- Never leave floating promises (`await` or `ctx.waitUntil(...)`), never buffer large bodies in isolate memory (stream via `TransformStream` / `response.body`), and never store request-mutable state in module globals.

## 3. R2 Paid & CDN FinOps

- Serve static public buckets via R2 Custom Domains + Zone Edge Cache rulesets (`immutable`, 30d–1y edge/browser TTL, `serve_stale`), avoiding Worker compute billing for pure static GETs.
- Enforce `One Server per Hostname`: never overlap wildcard Worker routes (`*.domain/*`) over R2 Custom Domains or bind both a Worker Custom Domain and a Worker Route to the same hostname.
- Disable `r2.dev` public URLs once custom domains or Worker bindings are active.
- Enforce 24-hour (`86400`s) aborted multipart upload lifecycle cleanup on every bucket and offload cold archives to self-hosted S3 (e.g., OVH `fr2` Garage).

## 4. Tunnels, Proxy VPS Mesh & Mullvad Split-Tunnel Safety

- Run multi-connector HA `cloudflared` over QUIC with explicit ingress rules matching DNS CNAMEs (no direct unproxied `A` origin exposure).
- Keep bare-metal/Hostinger origins firewalled (`nftables` allowing only WireGuard mesh, outbound `cloudflared`, and operator SSH) behind OVH Anti-DDoS Pingora proxy fronts.
- On cluster hosts running Mullvad WireGuard (`wg-*`), always use UID policy routing (`ip rule add uidrange <uid>-<uid> lookup <table> priority 100`) and dedicated routing tables (`>= 51820`), never mutating the host default route so SSH, WireGuard mesh, and `cloudflared` stay isolated.

## 5. Security & Secret Hygiene

- Keep account IDs, zone IDs, tunnel UUIDs, host IPs, API tokens, and emails out of tracked git files (`.private/`, `*.local.toml`, `wrangler` secret bindings only).
- Audit any Cloudflare Worker or API change with `skills/cloudflare-security-audit/SKILL.md`.
