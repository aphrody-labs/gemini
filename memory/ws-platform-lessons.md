---
name: platform-lessons
description: Reproducible host toolchain fixes, Rust/workspace dependency hygiene, full-platform integration scope, and safe multi-harness sync
type: feedback
---

- **Reproducible host fixes**: never say a machine lacks an SDK or CLI; diagnose the root cause (shadowed Windows SDKs, stale service env, missing binary), fix it reproducibly in setup scripts/manifests (`dsc`/`toolchain`/`setup.ts`), and proceed natively.
- **Workspace hygiene**: never add a git dependency pointing at the entire monorepo (long submodule paths break Windows builds); keep shared primitives in focused crates (`c-abi`, `core`) and runnable apps under `apps/`.
- **Platform-complete integrations**: when asked to integrate a service (such as Hugging Face Hub/Spaces/Xet/Inference or Google Cloud), wire the underlying platform API/OpenAPI specification natively rather than thin single-purpose wrappers, and never commit scraped third-party site dumps to public repos.
- **Continuous refactoring**: fix every legacy error at its root cause when touched, preserve every requested feature, and validate across Claude, Antigravity, Gemini CLI, and Bun cleanly.
