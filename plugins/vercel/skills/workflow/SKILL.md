---
name: workflow
description: Vercel Workflow SDK expert guidance. Use when building durable workflows, long-running tasks, API routes or agents that need pause/resume, retries, step-based execution, or crash-safe orchestration with Vercel Workflow.
metadata:
  priority: 9
  docs:
    - "https://vercel.com/docs/workflows"
    - "https://workflow-sdk.dev"
  sitemap: "https://vercel.com/sitemap.xml"
  pathPatterns:
    - 'lib/workflow/**'
    - 'src/lib/workflow/**'
    - 'lib/workflow.*'
    - 'src/lib/workflow.*'
    - 'workflow.*'
    - '*workflow*'
  importPatterns:
    - 'workflow'
    - '@workflow/*'
    - '*workflow*'
  bashPatterns:
    - '\bnpm\s+(install|i|add)\s+[^\n]*\bworkflow\b'
    - '\bpnpm\s+(install|i|add)\s+[^\n]*\bworkflow\b'
    - '\bbun\s+(install|i|add)\s+[^\n]*\bworkflow\b'
    - '\byarn\s+add\s+[^\n]*\bworkflow\b'
    - '\bnpm\s+(install|i|add)\s+[^\n]*@workflow/'
    - '\bpnpm\s+(install|i|add)\s+[^\n]*@workflow/'
    - '\bbun\s+(install|i|add)\s+[^\n]*@workflow/'
    - '\byarn\s+add\s+[^\n]*@workflow/'
    - '\bnpx\s+workflow(?:@latest)?\b'
    - '\bbunx\s+workflow(?:@latest)?\b'
  promptSignals:
    phrases:
      # Direct workflow mentions
      - "vercel workflow"
      - "workflow sdk"
      # Legacy product name retained only as an input matcher.
      - "workflow devkit"
      - "durable workflow"
      - "durable execution"
      - "durable function"
      - "durable pipeline"
      - "durable process"
      - "durable agent"
      - "durable chat"
      - "step function"
      - "step functions"
      - "use workflow"
      - "use step"
      # Pipeline / multi-step language (the BIG gap — natural product prompts)
      - "multi-step pipeline"
      - "multi step pipeline"
      - "multi-step process"
      - "multi step process"
      - "multi-step creation"
      - "multi-step generation"
      - "processing pipeline"
      - "creation pipeline"
      - "generation pipeline"
      - "content pipeline"
      - "production pipeline"
      - "approval pipeline"
      - "ingestion pipeline"
      - "streams progress"
      - "stream progress"
      - "streams each phase"
      - "streams each step"
      - "streams each"
      - "stream each"
      # Reliability / durability language (missed in customer-support eval)
      - "survive page reload"
      - "survive page reloads"
      - "survive a crash"
      - "survive crashes"
      - "survive network"
      - "fault-tolerant"
      - "fault tolerant"
      - "crash-safe"
      - "crash safe"
      - "automatically retry"
      - "auto retry"
      - "retry on failure"
      - "retry on error"
      - "reliable and retry"
      - "reliable processing"
      - "individually reliable"
      - "each step reliable"
      - "each step should be reliable"
      - "steps should be reliable"
      - "reliable with automatic retry"
      - "reliable with retry"
      - "retry on transient"
      - "transient failures"
      - "session persistence"
      - "session should persist"
      - "session survives"
      - "reconnect automatically"
      - "auto reconnect"
      - "reconnect if the network"
      - "reconnect on disconnect"
      - "resume after failure"
      - "resume after crash"
      - "resume on reconnect"
      # Human-in-the-loop / approval patterns
      - "human-in-the-loop"
      - "human in the loop"
      - "wait for approval"
      - "approval step"
      - "approval before"
      - "editorial approval"
      - "manual approval"
      - "wait for user"
      - "pause until"
      - "wait for response"
      - "callback url"
      - "webhook callback"
      # Conversational AI with durability
      - "chat should survive"
      - "chat survives"
      - "conversation should persist"
      - "conversation persists"
      - "conversation should survive"
      # Sequential / chain / trigger orchestration language
      - "sequential chain"
      - "email chain"
      - "chain of emails"
      - "chain of steps"
      - "chain engine"
      - "chain with triggers"
      - "trigger chain"
      - "triggered chain"
      - "webhook chain"
      - "webhook pipeline"
      - "webhook orchestration"
      - "multi-service trigger"
      - "cross-service trigger"
      - "various triggers"
      - "different triggers"
      - "triggers from different"
      - "triggers from various"
      - "sequential steps"
      - "sequential pipeline"
      - "sequential process"
      - "sequential emails"
      - "escalation chain"
      - "escalation pipeline"
      - "state machine"
      - "step-based"
      - "step based"
      - "delay between steps"
      - "delay between emails"
      - "delayed steps"
      - "conditional steps"
      - "skip steps"
      - "branch based on"
      - "wait for webhook"
      - "wait for trigger"
      - "wait for event"
      - "orchestrate emails"
      - "orchestrate webhooks"
      - "orchestrate services"
      - "chain across services"
      # Debugging
      - "workflow stuck"
      - "workflow hung"
      - "workflow hanging"
      - "workflow waiting"
      - "workflow failing"
      - "workflow timeout"
      - "workflow not running"
      - "workflow error"
      - "check workflow"
      - "workflow logs"
      - "workflow run status"
      - "debug workflow"
      - "workflow not finishing"
      - "workflow not responding"
      - "workflow stalled"
      - "workflow pending"
      - "step is stuck"
      - "step is hanging"
      - "why is my workflow"
      - "workflow run"
      - "step failed"
      - "run status"
      - "run failed"
      - "run logs"
      - "workflow run failed"
      - "workflow step failed"
    allOf:
      - [workflow, durable]
      - [workflow, retry]
      - [workflow, resume]
      - [pause, resume]
      - [survive, crash]
      - [survive, reload]
      - [survive, disconnect]
      - [pipeline, stream]
      - [pipeline, step]
      - [pipeline, durable]
      - [pipeline, reliable]
      - [pipeline, retry]
      - [multi-step, stream]
      - [multi-step, reliable]
      - [generation, pipeline]
      - [creation, pipeline]
      - [process, stream]
      - [process, reliable]
      - [process, retry]
      - [retry, failure]
      - [retry, error]
      - [retry, automatically]
      - [retry, transient]
      - [reliable, retry]
      - [individually, reliable]
      - [steps, reliable]
      - [sandbox, reliable]
      - [sandbox, retry]
      - [reconnect, network]
      - [reconnect, drop]
      - [reconnect, disconnect]
      - [session, persist]
      - [session, survive]
      - [session, reload]
      - [session, reconnect]
      - [chat, survive]
      - [chat, persist]
      - [chat, reconnect]
      - [chat, durable]
      - [chat, fault]
      - [conversation, persist]
      - [conversation, survive]
      - [approval, wait]
      - [approval, human]
      - [each, step]
      - [each, phase]
      - [each, stage]
      - [step, reliable]
      - [step, retry]
      # Chain / trigger / sequential orchestration
      - [chain, trigger]
      - [chain, sequential]
      - [chain, email]
      - [chain, webhook]
      - [chain, delay]
      - [chain, step]
      - [chain, escalat]
      - [sequential, trigger]
      - [sequential, email]
      - [sequential, step]
      - [sequential, webhook]
      - [trigger, orchestrat]
      - [trigger, service]
      - [trigger, delay]
      - [trigger, sequential]
      - [webhook, chain]
      - [webhook, orchestrat]
      - [webhook, pipeline]
      - [webhook, sequential]
      - [email, trigger]
      - [email, pipeline]
      - [email, sequential]
      - [email, delay]
      - [email, escalat]
      - [escalat, trigger]
      - [escalat, step]
      - [escalat, email]
      - [state, machine]
      - [conditional, step]
      - [conditional, skip]
      - [branch, condition]
      - [wait, webhook]
      - [wait, trigger]
      - [wait, event]
      - [workflow, stuck]
      - [workflow, hung]
      - [workflow, timeout]
      - [workflow, error]
      - [workflow, logs]
      - [workflow, debug]
      - [workflow, check]
      - [workflow, failing]
      - [workflow, status]
      - [run, status]
      - [step, failed]
      - [step, stuck]
      - [step, timeout]
      - [workflow, run]
      - [run, logs]
    anyOf:
      - "long-running"
      - "long running"
      - "multi-step"
      - "multi step"
      - "pipeline"
      - "orchestration"
      - "step-by-step"
      - "step by step"
      - "each piece"
      - "each step"
      - "each phase"
      - "each stage"
      - "phase"
      - "phases"
      - "stage"
      - "stages"
      - "durable"
      - "reliable"
      - "fault-tolerant"
      - "retry"
      - "reconnect"
      - "survive"
      - "persist"
      - "approval"
      - "chain"
      - "sequential"
      - "trigger"
      - "webhook"
      - "escalation"
      - "state machine"
      - "orchestrate"
      - "orchestration"
    noneOf:
      - "github actions"
      - ".github/workflows"
      - "ci workflow"
      - "aws step functions"
    minScore: 4
validate:
  -
    pattern: setTimeout|setInterval
    message: 'setTimeout/setInterval are not available in workflow sandbox scope — use sleep() from "workflow" for delays'
    severity: error
    skipIfFileContains: "use step"
  -
    pattern: context\.run\s*\(
    message: 'context.run() is not a Workflow SDK pattern — use "use step" directive for retryable, observable steps'
    severity: error
    upgradeToSkill: workflow
    upgradeWhy: 'Guides migration from context.run() to the "use step" directive for durable, retryable workflow steps.'
  -
    pattern: \brequire\s*\(
    message: 'require() is not available in workflow sandbox scope — use ESM imports and move Node.js logic into "use step" functions'
    severity: error
    skipIfFileContains: "use step"
  -
    pattern: getWritable\(\)
    message: 'getWritable() streams cannot be written in workflow sandbox scope — pass the stream to a "use step" function or call getWritable() inside the step'
    severity: recommended
    skipIfFileContains: "use step"
  -
    pattern: streamObject\s*\(
    message: 'streamObject() is deprecated since AI SDK 6 — use streamText() with output: Output.object() instead'
    severity: error
    upgradeToSkill: ai-sdk
    upgradeWhy: 'Guides migration from streamObject to streamText + Output.object() with correct v6 streaming patterns.'
  -
    pattern: await\s+\w+Workflow\s*\(
    message: 'Do not call workflow functions directly — use start() from "workflow/api" to register the run and get a runId'
    severity: recommended
    skipIfFileContains: "use workflow"
  -
    pattern: \bfetch\s*\(
    message: 'Native fetch() is not available in workflow sandbox scope — import fetch from "workflow" or move the call into a "use step" function'
    severity: recommended
    skipIfFileContains: "use step"
  -
    pattern: '"use step"'
    message: "Workflow steps should include console.log or structured logging for observability — add logging at step entry/exit to debug hangs"
    severity: warn
    skipIfFileContains: "console\\.(log|warn|error|info)"
  -
    pattern: '"use workflow"'
    message: "Workflow files should import and use logging — add console.log or a logger at key execution points for debugging"
    severity: warn
    skipIfFileContains: "console\\.(log|warn|error|info)"
chainTo:
  -
    pattern: 'DurableAgent|@workflow/ai'
    targetSkill: ai-sdk
    message: 'Workflow 5 (workflow@latest) deprecates DurableAgent (@workflow/ai) in favor of WorkflowAgent from @ai-sdk/workflow 2.x, which requires Workflow 5; the Workflow 4 docs (workflow@4) use DurableAgent. Loading AI SDK guidance for tool calling, the Agent class, and model configuration.'
    skipIfFileContains: 'from\s+[''"]ai[''"]|@ai-sdk/|streamText|generateText'
  -
    pattern: 'process\.env\.(OPENAI_API_KEY|ANTHROPIC_API_KEY)|from\s+[''"]@ai-sdk/(anthropic|openai)[''""]'
    targetSkill: ai-gateway
    message: 'Direct provider API key in workflow — loading AI Gateway guidance for OIDC auth (plain "provider/model" strings use AI Gateway; provider packages with their own API key, e.g. OPENAI_API_KEY, also work).'
    skipIfFileContains: 'gateway\(|@ai-sdk/gateway|VERCEL_OIDC'
  -
    pattern: 'setTimeout\s*\(|setInterval\s*\('
    targetSkill: vercel-functions
    message: 'Timer-based delay in workflow code — use sleep() from "workflow" instead of setTimeout/setInterval. Loading Vercel Functions guidance.'
    skipIfFileContains: 'from\s+[''"]workflow[''"].*sleep|sleep\s*\('
retrieval:
  aliases:
    - durable workflow
    - long running task
    - step function
    - orchestration
  intents:
    - build workflow
    - add retry logic
    - create durable task
    - implement step function
  entities:
    - Workflow SDK
    # Legacy product names retained only as retrieval aliases.
    - Workflow DevKit
    - WDK
    - step
    - pause/resume
    - durable
---

## *Critical*: Always use correct `workflow` documentation

Your knowledge of `workflow` is outdated.

The `workflow` documentation outlined below matches the installed version of the Workflow SDK.
Follow these instructions before starting on any `workflow`-related tasks:

Search the bundled documentation in `node_modules/workflow/docs/`:

1. **Find docs**: `glob "node_modules/workflow/docs/**/*.mdx"`
2. **Search content**: `grep "your query" node_modules/workflow/docs/`

Documentation structure in `node_modules/workflow/docs/`:

- `getting-started/` - Framework setup (next.mdx, express.mdx, hono.mdx, etc.)
- `foundations/` - Core concepts (workflows-and-steps.mdx, hooks.mdx, streaming.mdx, etc.)
- `api-reference/workflow/` - API docs (sleep.mdx, create-hook.mdx, fatal-error.mdx, etc.)
- `api-reference/workflow-api/` - Client API (start.mdx, get-run.mdx, resume-hook.mdx, etc.)
- `api-reference/workflow-runtime/` - Runtime API (get-world.mdx) and `world/` World SDK (storage.mdx, streams.mdx, queue.mdx)
- `api-reference/workflow-observability/` - Hydration and name parsing utilities (hydrate-resource-io.mdx, parse-workflow-name.mdx, etc.)
- `ai/`: AI SDK integration docs
- `errors/` - Error code documentation
- `worlds/` - Per-World behavior and limits (vercel.mdx, local.mdx, postgres.mdx). Other pages link these as `/worlds/<name>`.

Related packages also include bundled docs:

- `@ai-sdk/workflow`: `node_modules/ai/docs/` - WorkflowAgent and AI SDK integration
- `@workflow/ai`: `node_modules/@workflow/ai/docs/` - deprecated DurableAgent APIs for existing applications
- `@workflow/core`: `node_modules/@workflow/core/docs/` - Core runtime (foundations, how-it-works)
- `@workflow/next`: `node_modules/@workflow/next/docs/` - Next.js integration

**When in doubt, update to the latest version of the Workflow SDK.**

### Official resources

- **Website**: https://workflow-sdk.dev
- **GitHub**: https://github.com/vercel/workflow

### Quick reference

**Directives:**

```typescript
"use workflow";  // First line - makes async function durable
"use step";      // First line - makes function a cached, retryable unit
```

**Essential imports:**

```typescript
// Workflow primitives
import { sleep, fetch, createHook, createWebhook, getWritable } from "workflow";
import { FatalError, RetryableError } from "workflow";
import { getWorkflowMetadata, getStepMetadata } from "workflow";

// API operations
import { start, getRun, resumeHook, resumeWebhook } from "workflow/api";

// Observability & data hydration
import { hydrateResourceIO, observabilityRevivers, parseStepName, parseWorkflowName } from "workflow/observability";

// Framework integrations
import { withWorkflow } from "workflow/next";
import { workflow } from "workflow/vite";
import { workflow } from "workflow/astro";
// Or use modules: ["workflow/nitro"] for Nitro/Nuxt

// AI agent (Workflow 5)
import { WorkflowAgent, type ModelCallStreamPart } from "@ai-sdk/workflow";
```

## Prefer step functions to avoid sandbox errors

`"use workflow"` functions run in a sandboxed VM. `"use step"` functions have **full Node.js access**. Put your logic in steps and use the workflow function purely for orchestration.

```typescript
// Steps have full Node.js and npm access
async function fetchUserData(userId: string) {
  "use step";
  const response = await fetch(`https://api.example.com/users/${userId}`);
  return response.json();
}

async function processWithAI(data: any) {
  "use step";
  // AI SDK works in steps without workarounds
  return await generateText({
    model: "spacexai/grok-4.6",
    prompt: `Process: ${JSON.stringify(data)}`,
  });
}

// Workflow orchestrates steps - no sandbox issues
export async function dataProcessingWorkflow(userId: string) {
  "use workflow";
  const data = await fetchUserData(userId);
  const processed = await processWithAI(data);
  return { success: true, processed };
}
```

**Benefits:** Steps have automatic retry, results are persisted for replay, and no sandbox restrictions.

## Workflow sandbox limitations

When you need logic directly in a workflow function (not in a step), these restrictions apply:

| Limitation | Workaround |
|------------|------------|
| No `fetch()` | Make the request (and AI SDK calls) in a step function |
| No `setTimeout`/`setInterval` | Use `sleep("5s")` from `"workflow"` |
| No Node.js modules (fs, crypto, etc.) | Move to a step function |

**Example - AI SDK call in a workflow:**

```typescript
import { generateText } from "ai";

async function summarize(text: string) {
  "use step";
  const { text: summary } = await generateText({
    model: "spacexai/grok-4.6",
    prompt: `Summarize: ${text}`,
  });
  return summary;
}

export async function myWorkflow(text: string) {
  "use workflow";
  return await summarize(text);
}
```

For agents, use `WorkflowAgent` (below).

**Note:** Plain `"provider/model"` strings use Vercel AI Gateway. Do not construct a direct provider instance unless the user explicitly needs a provider-only feature.

## Extended Reference

Complete remaining sections are preserved in [references/deep-dive.md](references/deep-dive.md).
