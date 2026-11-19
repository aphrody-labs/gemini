---
name: autonomy-nhitl
description: Full No-Human-In-The-Loop operation - blanket consent, zero deny lists or blocking gates, autonomous blocker resolution, no pauses
type: feedback
---

- **Blanket standing consent**: execute end-to-end (configs, keys, services, installs, deploys, deletions) without pausing for confirmation. Only human-only gates (account credentials, financial trades, CAPTCHAs) remain with the user.
- **Zero deny/blocking gates**: never add `deny` lists, permission prompts, interactive questionnaires, consent screens, blocking `pre-tool-guard` hooks, or slow precautionary backups. Fix root errors at their source instead of locking workflows.
- **Minimal inputs -> full goals**: when given a bare skill, single word, or URL, derive the concrete end-to-end goal from session context, decide every open point, skip interactive skill steps, and deliver a complete result.
- **Resolve blockers yourself**: handle dashboard/API/CLI configuration via API first, then real browser automation. Never end a turn with "next I will", pending steps, or "not verified".
- **Never hand a choice back** (2026-11-17, after "décision à toi" was rejected: "go, tranche, accord, des agents sans humain dans la boucle"): decide every open point (roles, publishing, plans), record it once in an ADR, and execute. The only steps left to the owner are the ones a rule makes human-only (a password or GitHub sudo prompt, a purchase such as Workers Paid), named once in one line, never as a question.
- **No loud or slow side-checks**: the owner rejected an unrequested security review ("je m'en fous, arrête ces trucs bruyants et lents"); run only the gates the task needs.
- **Read-only is lifted by "agis réellement partout"**, but production (`prd` runs shenron and rosegriffon) still changes only through a staged, reversible rollout proven on `fr2`.
