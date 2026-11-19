---
name: code-quality-and-design
description: Code-first verification, Google eng-practices bar, design baseline, newest dependencies, and real proof requirements
type: feedback
---

- **Code before docs**: measure manifests, dependencies, files, builds, and live APIs first. A README or doc page is a lead, never proof. Contradict assumptions cleanly when code evidence disagrees.
- **Google engineering bar**: follow `eng-practices` (design, complexity, simple targeted tests in the same change, why-not-what comments) and developer style (active voice, concise headings, no filler or pre-announcements).
- **UI design & zero regression**: follow strict order for UI changes: written plan -> live upstream docs -> design baseline (Figma or the project's own design source) -> capture "before" screenshots + feature checklist -> build -> visual/functional diff -> deploy only on zero regression. Keep working features alive alongside replacements until parity.
- **Newest versions & complete delivery**: ship each item in one pass following `docs/native/ROADMAP.md` / `docs/games/PLAN.md` using latest canary/nightly/rc releases; fix compatibility breaks at source in the same pass rather than downgrading.
- **Proof requirement**: HTTP 200 or green build is never proof. Inspect actual rendered browser screenshots (`chrome-devtools` / `claude-in-chrome`), assert DOM content and real interactions, or inspect native screenshots (`agent-desktop`). Run final checks after final edits.
