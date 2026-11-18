---
name: ay-cf-finops-infra
description: Sovereign FinOps and hybrid infrastructure runbook for Cloudflare Workers Paid, R2 Paid, HA cloudflared tunnels, OVH Pingora proxy VPS, Hostinger origin firewalling, and Mullvad UID policy routing in ay-cf.
---

# Sovereign FinOps, Hybrid Cluster Proxy & Mullvad VPN Runbook

Use this skill when optimizing Cloudflare Paid billing, consolidating Workers/R2/Cache rulesets, hardening `cloudflared` tunnels, generating OVH/Hostinger WireGuard proxy configs, or managing pure-Rust reusable R2 media/3D catalogs in `aphrody-dev/ay-cf`.

## Workers Paid & R2 Paid Cost Optimization

1. **Observability Budget (20M events/mo included)**:
   - Never leave high-RPS CDN/router Workers at `logs.head_sampling_rate = 1.0`. Set `0.1` for CDN/router Workers and `0.05` for traces (`enabled = true`), reserving `1.0` logs strictly for low-volume webhook/gateway/API Workers.
2. **Compute & Subrequest Bounding**:
   - Set `[limits] cpu_ms = 50` on CDN/asset routers and `500` on API/MCP Workers.
   - Offload static GET delivery from Workers to **R2 Custom Domains + Zone Cache Rules** (`Cache Everything` / `respect_origin`, 30d–1y edge TTL) so each cached hit avoids both Worker invocation billing and R2 Class B operation fees.
   - Remove wildcard Worker routes (`*.zone/*`) that intercept R2 Custom Domains, and remove dual custom-domain + route assignments on the same hostname.
3. **R2 Storage Hygiene (~68.5 GB -> <10 GB hot + self-hosted cold archive)**:
   - Enforce `86400`s (1-day) incomplete multipart upload abort lifecycle rules on every bucket.
   - Keep hot reusable immutable assets (`v1/<kind>/<blake3>.<ext>`, icons, `.glb`, `.ktx2`, Lottie JSON, `.mp4`) in `aphrody-assets` / `aphrody-video`; tier large build caches, Chromium snapshots, and historical backups to cold self-hosted S3 (`Garage` on OVH `fr2`) over the WireGuard mesh.
4. **Exposure & Dead-Route Cleanup**:
   - Disable `workers.dev`, `previews_enabled`, and `r2.dev` on production resources.
   - Remove CNAMEs pointing to decommissioned tunnel UUIDs and replace exposed direct `A` origin records with proxied `cfargotunnel.com` CNAMEs.

## Hybrid Cluster Topology (OVH Build + OVH Proxy + Hostinger Origin + Mullvad)

| Role | Provider | Responsibilities |
| :--- | :--- | :--- |
| `build` | OVH #1 | 12-core Rust/C++/Bazel/Bun CI runner, `sccache`, NativeLink CAS/Scheduler |
| `edge-proxy` | OVH #2 | Anti-DDoS L4/L7 **Pingora** + Nginx proxy, Garage S3 cold storage, Valkey cache |
| `origin` | Hostinger | Production app/DB containers (`dragonballfr.com`, `rosegriffon.fr`) firewalled via `nftables` to WireGuard mesh + `cloudflared` QUIC |

- **Mullvad UID Policy Routing**: Run outbound region-pinned tasks (crawlers in Tokyo `uid 2002` table `51822`, US APIs in Ashburn `uid 2001` table `51821`, EU checks in Paris `uid 2003` table `51823`) via `ip rule add uidrange`. Never alter `table main` or hijack `10.200.77.0/24` / `cloudflared` QUIC UDP 7844.

## Tooling Entry Points in `ay-cf`

```sh
just finops         # Workers Paid + R2 Paid cost model and savings delta
just reconcile      # Diff declarative ay-cf.toml vs live Cloudflare API (dry-run by default)
just tunnels        # Verify cloudflared ingress <-> DNS CNAME parity
just cluster-proxy  # Generate Pingora, nftables, Mullvad UID, and cloudflared configs
just r2-catalog     # Verify pure-Rust BLAKE3 + SPDX R2 reusable asset catalog
just check          # Full polyglot verification (Bun, Wrangler, Rust, Clang/Bazel, Python/uv/ruff)
```
