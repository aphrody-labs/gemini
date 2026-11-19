---
name: agent-policy
description: Recursive parallelism, cheap subagent model selection, coordinator diffing against literal requests, and clean writer coordination
type: feedback
---

- Independent work runs in parallel across parallel tool calls, background jobs, and nested subagents that delegate recursively.
- Only spawn subagents when work is independent and substantial enough to warrant a separate brief; run small or sequential steps inline.
- Default subagents to cheap fast models (`sonnet` medium effort or `haiku`) unless high reasoning is strictly needed.
- Always act as coordinator on shared trees: scope writing subagents to disjoint files, commit cleanly without affecting sibling changes, and keep browser/authenticated UI checks in a session with browser access.
- Before reporting a subagent's result, diff every deliverable against the literal request (`done`, `substituted`, or `missing`). Never silently substitute your own architecture for the request; measure and report contradictions explicitly while delivering what was asked.
- Check host disk space (`fr1` / `fr2`) before launching heavy remote runs or clones.
- **An inventory is not a delivery** (my reading of the 2026-11-17 session review, not the owner's words). The owner's requests are build requests ("full", "end to end", "craft", "fix tout"); for about ten of them I answered with a research `.toml`/`.md` and a long summary (NT/NTFS tooling, search stack, Rust AI stack, W3C libraries, org comparisons, Dioxus). A research file closes a request only when the request was a question. Otherwise the first line of the report says "inventory only, nothing built", and the build (forks created, submodules added, code wired, proof) becomes a task that is carried until done or explicitly dropped by the owner.
- **Keep a request ledger in the task list**: one task per owner request, created when the request arrives, closed only on proof. In the 2026-11-17 session 66 owner messages produced 19 tasks; the rest lived only in chat and were lost at each compaction.
