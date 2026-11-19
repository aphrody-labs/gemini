---
name: agent-fanout-budget
description: Owner wants limited sub-agent fan-out and careful context-window and weekly-limit use
metadata:
  node_type: memory
  type: feedback
  originSessionId: aae12588-4a11-4aae-b28f-f3d886683cbb
  modified: 2026-11-16T21:05:33.303Z
---

Keep sub-agent fan-out small: at most ~3 concurrent background agents. Do cheap checks (CI watch, one-file fixes, gh run list) inline instead of spawning, and stop agents whose value is low (e.g. fixing a repo about to be archived). Keep context lean: grep/head logs, never dump full logs or transcripts.

**Why:** 2026-11-16 the owner said "limite le fan out d'agent et gere mieux ta context window et tes weekly limits" after I ran 6-7 agents at once across repos.

**How to apply:** before spawning, count running agents; queue extra work rather than launching it; prefer one agent per user request, not per repo, when repos' fixes are small. Related: [[agent-policy]], [[push-checks-and-shared-writers]].

Finished background agents keep firing stale wait-timer notifications; once the final report is in, stop the agent with TaskStop.

**Repeated 2026-11-17, with a cost.** I had 8 background agents running when the Claude Code process ended. All of them stopped mid-work: uncommitted edits in 6 repos (ay, ai-os, browser, nie, rosegriffon, aphrody-labs-github), unpushed commits in shenron (5) and ai-os (1), half-applied security fixes in ay `crates/ay-svg`, and a red ay CI from an agent push that skipped `bun run check`.

- The cap is 3, counted before every spawn. A new owner request while 3 run is queued as a task, not spawned.
- Every agent brief says: commit by path and push after each verified unit; never hold more than one unit uncommitted; run the repo's check before each push.
- First action of a session that follows a restart: `git status -sb` and the last CI run of every repo under `$WORKSPACE_ROOT`, then resume the interrupted agents with SendMessage (their transcripts survive) before taking new work.
