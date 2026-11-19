---
name: naming-and-privacy
description: Goal-derived naming via identity.toml and strict runtime discovery over hardcoded identities, host names, accounts, or personal quotes in code
type: feedback
---

- **Coherent naming**: derive CLI, crate (`aphrody-*`), and package (`@aphrody/*`) names from product goals and upstream conventions (`Cargo`, `clig.dev`, POSIX/GNU, `tools/identity.toml`), never ad-hoc agent codenames or filler words.
- **No private/site literals in code**: never commit personal names, account IDs, Windows home directories, VPS hostnames/IPs, internal mesh addresses, or owner quotes inside tracked source or portable configs.
- **Live runtime discovery**: resolve hosts (`ssh -G`), network/mesh, git identity (`git config`, `gh api user`), cloud accounts, and directories dynamically from the environment and identity files (`env-kit` / `scripts/lib.ts`). Run private-data scans from patterns discovered at runtime rather than hardcoded pattern tables.
