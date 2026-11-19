---
name: budget-and-hosting
description: Infrastructure cost tracking sheet, Cloudflare-first hosting, and Vercel usage policy
type: reference
---

- **Budget tracking**: Google Sheet `"Aphrody - Budget infra 2026"` (`1y5EOYT30gXCEtasrl4V1NfHDS03XRoR-BoSOmXznqiA`, tabs `Lignes` and `Synthese`). Append a row with measured before/after USD/month costs and proof command/commit after infrastructure cost changes.
- **Cloudflare & VPS primary**: prefer Cloudflare (Workers, Pages, R2, D1, KV) and the fleet VPS hosts (`prd` for production like `shenron-site`/`dbfr`; migrating `rpbey.fr` off `fr1` to `fr2`/`prd`) per `docs/infra/FR2-CLOUDFLARE.md`.
- **Vercel**: team `aphrody-dev` (`team_xCw3WGJLNTrufDRMc53z4rwl`, hobby) softBlock was lifted on 2026-11-15 (`vercel api` works; Vercel MCP may return 403 on hobby). Keep at $0/month as redundant host only.
