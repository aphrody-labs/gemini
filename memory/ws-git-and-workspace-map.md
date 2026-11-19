---
name: git-and-workspace-map
description: Checkouts under workspace root, GitHub repos, shared-tree git discipline, relative submodule junctions, and product repository split
type: project
---

- **Active checkouts under `$WORKSPACE_ROOT`** (derive dynamically via `WORKSPACE_ROOT` (the parent directory of the checkouts; `SRC_ROOT` is the aphrody checkout) / discovery):
  - `ay` -> `aphrody-dev/ay` (product-first rebuild, 2026-11-16; the old monorepo is `aphrody-labs/legacy`, not checked out)
  - `aphrody` -> `aphrody-dev/aphrody` (unified Zed/GPUI/taffy/wgpu OS UI fork)
  - `aphrody-git` -> `aphrody-labs/aphrody-git` (Git stack, `aphrody-labs/git` lineage)
  - `browser` -> `aphrody-labs/browser` (Bun + Servo + Obscura + agent-browser)
  - `bun` -> `aphrody-labs/bun`
  - `nie` -> `aphrody-labs/nie` (Rust tooling driven only by the game's `nie.exe` and its data VFS; private iecode submodules; see the `ie-game-formats` skill)
  - `rosegriffon` -> `aphrody-labs/rosegriffon` (full-TypeScript Bun cloud app; Achillea web UI)
  - `shenron` -> `aphrody-labs/shenron`
- **Product & monorepo ownership**:
  - `aphrody.com` (`apps/web`) = marketing/vitrine; `aphrody.app` (`aphrody-app`) = full-Rust apps & Bevy/wgpu game launcher.
  - Submodules use relative URLs and sibling checkouts via directory junctions (never duplicate nested clones).
- **Shared-tree git safety**: always work on `main`; never run `git stash`, `git stash pop`, `git reset --hard`, or branch switches on shared `$WORKSPACE_ROOT` trees; make path-scoped commits and push directly.
- `aphrody-dev` is a user account, not an organization: `orgs/aphrody-dev/...` API routes return 404; use `users/aphrody-dev/repos` or `gh repo list aphrody-dev`. The handle `rosegriffon` no longer resolves on GitHub (the organization is `rose-griffon`).
- rosegriffon moved 2026-11-17 to GitHub org `rose-griffon` (rose-griffon/rosegriffon), owned by the old account `aphrody-code` (token in Windows Credential Manager target `gh:github.com:aphrody-code`; scopes repo, read:org, no admin:org). aphrody-dev has repo admin, not org membership. rosegriffon also has its own Gmail and OVH accounts.
