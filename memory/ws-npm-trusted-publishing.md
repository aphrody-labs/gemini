---
name: npm-trusted-publishing
description: rose-griffon/rosegriffon publishes @rosegriffon/* to npm through trusted publishing (OIDC), no stored token
metadata:
  type: project
---

Since 2026-11-17 rose-griffon/rosegriffon `release.yml` runs `bun scripts/publish.ts` after a green CI on main; npm authenticates the GitHub Actions OIDC identity (trusted publisher, release.yml) and signs provenance. Proof: @rosegriffon/types@1.4.5, `_npmUser` "GitHub Actions" with trustedPublisher id github. The NPM_TOKEN secret is deleted. Trust was configured per package by the owner (`npm trust github` needs interactive 2FA, a GAT that bypasses 2FA is refused). Apps (website, bot) are private and not published.

**Why:** owner wants zero manual, non-fragile publishing; tokens that bypass 2FA are being restricted by npm.

**How to apply:** a new public @rosegriffon package needs one `npm trust github <pkg> --repo rose-griffon/rosegriffon --file release.yml --allow-publish -y` by the owner before its first CI publish; never reintroduce NPM_TOKEN. Related: [[no-security-nags]], [[git-and-workspace-map]].
