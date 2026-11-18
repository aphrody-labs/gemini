---
name: vercel-sandbox
description: Vercel Sandbox guidance — ephemeral Firecracker microVMs for running untrusted code safely. Supports AI agents, code generation, and experimentation. Use when executing user-generated or AI-generated code in isolation.
summary: "Run untrusted/AI-generated code in ephemeral Firecracker microVMs via @vercel/sandbox. Core loop: `const s = await Sandbox.create(); try { const r = await s.runCommand('python3', ['-c', code]); } finally { await s.stop(); }`. runCommand has no shell (wrap pipes/redirects in `bash -c`) and does not throw on non-zero exit (check r.exitCode). Default image is Ubuntu (`apt-get update` before install). Persistence is on by default (auto-snapshot on stop, resume by name; only the filesystem survives). For untrusted code use `networkPolicy: 'deny-all'`, a short `timeout`, and `persistent: false`. Credential brokering: a firewall `transform` injects a secret header on egress so the VM never holds it. AI agents reach models with no API key via the AI Gateway (`https://ai-gateway.vercel.sh`, `Authorization: Bearer $VERCEL_OIDC_TOKEN`) — the token is not auto-injected, so pass it via `env` or broker it. Full docs: https://vercel.com/docs/sandbox"
metadata:
  priority: 4
  docs:
    - "https://vercel.com/docs/sandbox"
  sitemap: "https://vercel.com/sitemap.xml"
  pathPatterns: []
  importPatterns:
    - '@vercel/sandbox'
  bashPatterns:
    - '\bnpm\s+(install|i|add)\s+[^\n]*@vercel/sandbox\b'
    - '\bpnpm\s+(install|i|add)\s+[^\n]*@vercel/sandbox\b'
    - '\bbun\s+(install|i|add)\s+[^\n]*@vercel/sandbox\b'
    - '\byarn\s+add\s+[^\n]*@vercel/sandbox\b'
  promptSignals:
    phrases:
      - "@vercel/sandbox"
      - "sandbox"
      - "code sandbox"
      - "vercel sandbox"
      - "isolated environment"
      - "sandboxed execution"
    allOf:
      - [sandbox, code]
      - [sandbox, execute]
      - [sandbox, run]
      - [sandbox, isolated]
      - [sandbox, safe]
      - [sandbox, environment]
      - [isolated, execute]
      - [isolated, code]
      - [isolated, environment]
      - [isolated, run]
      - [safe, execute]
      - [safe, code]
      - [untrusted, code]
      - [untrusted, execute]
      - [code, runner]
      - [code, playground]
      - [execute, safely]
      - [run, safely]
      - [run, isolation]
      - [execute, isolation]
      - [ffmpeg, process]
      - [ffmpeg, convert]
      - [ffmpeg, compress]
      - [student, code]
      - [student, execute]
      - [student, run]
    anyOf:
      - "sandbox"
      - "isolated"
      - "isolation"
      - "untrusted"
      - "safely"
      - "microvm"
      - "ffmpeg"
      - "playground"
    noneOf:
      - "iframe sandbox"
      - "sandbox attribute"
      - "codesandbox.io"
      - "stackblitz"
      - "offload"
      - "offloading"
      - "shard"
      - "shards"
      - "sharded"
      - "sharding"
    minScore: 4
retrieval:
  aliases:
    - code sandbox
    - microvm
    - isolated execution
    - safe code runner
  intents:
    - run untrusted code
    - execute code safely
    - create sandbox
    - isolate code execution
  entities:
    - Vercel Sandbox
    - Firecracker
    - microVM
    - isolated execution
chainTo:
  -
    pattern: 'from\s+[''""]vm2[''""]|require\s*\(\s*[''""]vm2[''""\)]|new\s+VM\('
    targetSkill: vercel-sandbox
    message: 'vm2 detected — it has known security vulnerabilities. Reloading Vercel Sandbox guidance for Firecracker microVM-based safe execution.'
  -
    pattern: 'child_process.*exec\(|execSync\(|spawn\(.*\{.*shell:\s*true'
    targetSkill: ai-sdk
    message: 'Shell exec for code execution detected — loading AI SDK guidance for tool-calling patterns that pair with Vercel Sandbox for safe agent execution.'

---

## _CRITICAL_: Always Use Correct `@vercel/sandbox` Documentation

Your knowledge of `@vercel/sandbox` may be outdated.
Follow these instructions before starting on any sandbox-related tasks:

### Official Resources

- **Documentation**: https://vercel.com/docs/vercel-sandbox
- **SDK Reference**: https://vercel.com/docs/vercel-sandbox/sdk-reference
- **CLI Reference**: https://vercel.com/docs/vercel-sandbox/cli-reference
- **GitHub**: https://github.com/vercel/sandbox
- **REST API**: https://vercel.com/docs/rest-api/sandboxes

### What changed in v2

The `@vercel/sandbox@2` SDK and `sandbox@3` CLI replace anonymous, ephemeral
sandboxes with **named, persistent** sandboxes. Key differences from v1:

- Sandboxes are identified by **`name`** (not `sandboxId`). Names are unique per project.
- Sandboxes are **persistent by default** — when a sandbox stops, the SDK
  automatically snapshots it and restores the filesystem on the next resume.
- A **Session** is a single running VM instance inside a sandbox. SDK calls
  like `runCommand`, `writeFiles`, etc. automatically resume a stopped sandbox.
- New methods: `Sandbox.getOrCreate`, `Sandbox.fork`, `sandbox.update`,
  `sandbox.delete`, `sandbox.listSessions`, `sandbox.listSnapshots`,
  `Snapshot.tree`, `defineSandboxProxy`.
- New params: `name`, `persistent`, `tags`, `onResume`, `snapshotExpiration`,
  `keepLastSnapshots`, L7 network policy matchers, `forwardURL`.
- Pagination uses **cursor-based** iterators (async-iterable) instead of `since`/`until`.
- `Sandbox.list({ since, until })` → `Sandbox.list({ cursor, namePrefix, sortBy, tags })`.
- v1 sandboxes are backfilled so the only required code change is using `name`
  instead of `sandboxId`.

### Quick Reference

**Essential imports:**

```typescript
// Core SDK
import {
  Sandbox,
  Session,
  Snapshot,
  Drive,
  Command,
  CommandFinished,
} from "@vercel/sandbox";
import { APIError, StreamError } from "@vercel/sandbox";

// For advanced network policy with credential brokering and L7 matchers
import type {
  NetworkPolicy,
  NetworkPolicyRule,
  NetworkTransformer,
} from "@vercel/sandbox";

// For implementing a request-forwarding proxy (forwardURL)
import { defineSandboxProxy } from "@vercel/sandbox/proxy";

// For timeouts
import ms from "ms"; // e.g., ms("5m"), ms("1h")
```

**Default image:** Sandboxes use `vercel/sandbox/universal:latest`, an
Ubuntu-based image with Node.js 24, Bun, Python 3.14, coding agents, and common
development and debugging utilities.

## Creating Sandboxes

### Basic Creation

```typescript
import { Sandbox } from "@vercel/sandbox";

const sandbox = await Sandbox.create({
  name: "my-dev-env", // Optional, random if omitted. Unique per project.
  resources: { vcpus: 4 }, // 2048 MB RAM per vCPU
  ports: [3000], // Expose up to 15 ports
  timeout: ms("10m"), // Default: 5 minutes
  env: { NODE_ENV: "production" }, // Env vars inherited by all commands
  tags: { env: "staging", team: "infra" }, // Up to 5 key:value tags
  persistent: true, // Default: true. Auto-snapshots on stop, restores on resume.
  snapshotExpiration: ms("7d"), // Default TTL for snapshots. Use 0 for no expiration.
  region: "<region>", // Optional, defaults to iad1. Any Vercel region, e.g. sfo1, fra1, hnd1, syd1.
  failoverRegions: ["<region>"], // Optional, e.g. ["sfo1", "fra1"]. Must not include `region`.
});

console.log(sandbox.name);
```

### Retrieve an Existing Sandbox

```typescript
// Retrieve by name. The sandbox will resume automatically the next time
// you run a command.
const sandbox = await Sandbox.get({ name: "my-dev-env" });
```

### Get-or-Create (Idempotent)

`Sandbox.getOrCreate` is the recommended pattern for long-lived sandboxes.

```typescript
const sandbox = await Sandbox.getOrCreate({
  name: "my-workspace",
  // Runs only the first time the sandbox is created.
  onCreate: async (sbx) => {
    await sbx.writeFiles([
      { path: "README.md", content: Buffer.from("# Hello") },
    ]);
    await sbx.runCommand("npm", ["install"]);
  },
  // Runs every time the sandbox session is resumed (including after auto-resume).
  onResume: async (sbx) => {
    await sbx.runCommand({ cmd: "npm", args: ["run", "dev"], detached: true });
  },
});
```

Behavior:

- If a sandbox with that `name` exists → resumes it and fires `onResume`.
- If it does not exist → creates a fresh sandbox and fires `onCreate`.
- If the sandbox exists but its snapshot expired → deletes the stale sandbox,
  re-creates it with the same name, and fires `onCreate`.

### Re-warming on Resume

Use `onResume` to restart background services or rehydrate caches whenever a
persistent sandbox's session is resumed:

```typescript
const sandbox = await Sandbox.get({
  name: "my-workspace",
  onResume: async (sbx) => {
    await sbx.runCommand({ cmd: "npm", args: ["run", "dev"], detached: true });
  },
});
```

`onResume` also fires when a SDK call (e.g. `runCommand`, `writeFiles`)
auto-resumes a stopped sandbox.

### With Git Source

```typescript
const sandbox = await Sandbox.create({
  source: {
    type: "git",
    url: "https://github.com/vercel/sandbox-example-next.git",
    depth: 1, // Shallow clone (optional)
    revision: "main", // Branch, tag, or commit (optional)
  },
  ports: [3000],
});
```

Git sources are cloned into a subdirectory named after the repository. For the
example above, run commands with `cwd: "sandbox-example-next"`.

### With Private Git Repository

```typescript
const sandbox = await Sandbox.create({
  source: {
    type: "git",
    url: "https://github.com/org/private-repo.git",
    username: process.env.GIT_USERNAME!,
    password: process.env.GIT_TOKEN!, // Use PAT for password
  },
});
```

### With Private npm Packages

Pass `credentials: { npm: true }` when the sandbox runs a coding agent or installs your team's private npm packages. Vercel injects the team's npm credentials into the sandbox network policy, so installs authenticate with no token inside the sandbox.

```typescript
const sandbox = await Sandbox.create({ credentials: { npm: true } });
await sandbox.runCommand("npm", ["install"]);
```

- Covers installs with npm, pnpm, and Bun. Publishing from the sandbox stays unauthenticated.
- When the team has no npm credentials, creation fails with a 400 error.
- CLI: `sandbox create --credentials=npm`.

### From Tarball

```typescript
const sandbox = await Sandbox.create({
  source: {
    type: "tarball",
    url: "https://example.com/project.tar.gz",
  },
  ports: [3000],
});
```

### From a Snapshot

```typescript
const sandbox = await Sandbox.create({
  source: {
    type: "snapshot",
    snapshotId: "snap_abc123",
  },
  ports: [3000],
});
```

### From a Custom Image (VCR)

Override the default with a [Vercel Container
Registry](https://vercel.com/docs/container-registry) (VCR) image stored in the
sandbox's project.

For a different distro or reproducible system tooling, prefer baking it into a
custom image over installing packages when the sandbox starts.

```typescript
const sandbox = await Sandbox.create({
  image: "my-repo:v1",
  ports: [3000],
});
```

`image` accepts a repository in the sandbox's project with an optional tag or
digest, or a fully-qualified VCR URL. A bare repository name resolves to the
`latest` tag:

```typescript
await Sandbox.create({ image: "my-repo" }); // latest tag
await Sandbox.create({ image: "my-repo:v1" }); // specific tag
await Sandbox.create({ image: "my-repo@sha256:..." }); // specific digest
await Sandbox.create({
  image: "vcr.vercel.com/my-team/my-project/my-repo:v1", // fully-qualified
});
```

Push images to VCR with Docker-compatible tooling before referencing them. See the
[Container Registry docs](https://vercel.com/docs/container-registry) for push
instructions.

### Forking an Existing Sandbox

`Sandbox.fork` seeds a new sandbox from another sandbox's current snapshot
and copies its config (`resources`, `timeout`, `networkPolicy`, `tags`,
`ports`, `image`, `persistent`, `snapshotExpiration`, `keepLastSnapshots`,
and `env`). Any field you pass overrides the inherited value. If the source
has no current snapshot, the fork falls back to the source's base environment
plus the copied config. You can only fork a sandbox in a project you have
access to; forking an unknown source returns a 404. The fork runs in the
source's region unless you pass `region` (and optionally `failoverRegions`)
to override it.

```typescript
// Inherit everything from the source (env included)
const fork = await Sandbox.fork({ sourceSandbox: "prod-agent" });

// Override specific fields; the rest are copied from the source.
// A provided `env` fully replaces the source's env (no per-key merge).
const fork = await Sandbox.fork({
  sourceSandbox: "prod-agent",
  name: "forked-prod-agent",
  resources: { vcpus: 4 },
  env: { OPENAI_API_KEY: process.env.OPENAI_API_KEY! },
});
```

### When to fork a sandbox or a drive

Use `Sandbox.fork` when each worker needs its own sandbox environment, including
installed tools and files from the source sandbox's snapshot. Use `drive.fork`
when each worker needs an independent writable copy of persistent files.
`Sandbox.fork` does not inherit drive mounts; pass `mounts` if the fork needs a
drive.
Mount a drive when files should persist across sandbox runs. Many sandboxes
can mount `drive.snapshot()` for read-only access; each mount captures the
drive's files at mount time. Mount a new snapshot to see later writes. A drive
allows one read-write mount at a time. The sandbox and drive must be in the
same region. Write to a read-write mount once before forking a drive or
mounting its snapshot.

```typescript
import { Drive, Sandbox } from "@vercel/sandbox";

const baseDrive = await Drive.getOrCreate({ name: "agent-base-files" });
const seed = await Sandbox.create({
  region: baseDrive.region,
  mounts: { "/workspace": baseDrive },
});
await seed.writeFiles([
  { path: "/workspace/README.md", content: "starter" },
]);
await seed.stop();

// The source drive has now been written to and can be forked.
const workerDrive = await baseDrive.fork({ name: "agent-worker-1-files" });
const worker = await Sandbox.create({
  region: workerDrive.region,
  mounts: { "/workspace": workerDrive },
});
await worker.writeFiles([
  { path: "/workspace/result.txt", content: "worker" },
]);
await worker.stop();
```

The worker's writes stay on `workerDrive`; the base drive keeps the starter
files. Fork the base drive again with a different name for another worker.

### Auto-Dispose Pattern

Use `await using` for automatic cleanup:

```typescript
async function runInSandbox() {
  await using sandbox = await Sandbox.create();
  // Sandbox automatically stopped when scope exits
  await sandbox.runCommand("echo", ["Hello"]);
}
```

## Running Commands

### Basic Command Execution

```typescript
const result = await sandbox.runCommand("npm", ["install"]);
if (result.exitCode !== 0) {
  console.error("Install failed:", await result.stderr());
}
```

### With Options

```typescript
const result = await sandbox.runCommand({
  cmd: "npm",
  args: ["run", "build"],
  cwd: "/vercel/sandbox/app",
  env: { NODE_ENV: "production" },
  sudo: false,
  stdout: process.stdout, // Stream output
  stderr: process.stderr,
});
```

### Detached Commands (Background Processes)

```typescript
// Start dev server in background
const devServer = await sandbox.runCommand({
  cmd: "npm",
  args: ["run", "dev"],
  detached: true, // Returns immediately
  stdout: process.stdout,
});

// Later: wait for completion or kill
const finished = await devServer.wait();
// Supported signals: SIGHUP, SIGINT, SIGQUIT, SIGKILL, SIGTERM, SIGCONT, SIGSTOP (or numeric)
await devServer.kill("SIGTERM");
```

### Root Access

```typescript
await sandbox.runCommand({
  cmd: "apt-get",
  args: ["update"],
  sudo: true,
});
await sandbox.runCommand({
  cmd: "apt-get",
  args: ["install", "-y", "golang-go"],
  sudo: true, // Execute as root
});
```

## File Operations

### Write Files

```typescript
await sandbox.writeFiles([
  {
    path: "/vercel/sandbox/config.json",
    content: Buffer.from(JSON.stringify({ key: "value" })),
  },
  {
    path: "/vercel/sandbox/script.sh",
    content: Buffer.from("#!/bin/bash\necho 'Hello'"),
    mode: 0o755,
  },
]);
```

### Read Files

```typescript
// Returns a Buffer object
const buffer = await sandbox.readFileToBuffer({
  path: "/vercel/sandbox/output.txt",
});

// Returns a NodeJS.ReadableStream
const stream = await sandbox.readFile({
  path: "/vercel/sandbox/large-file.bin",
});
```

### Download Files

```typescript
const localPath = await sandbox.downloadFile(
  { path: "/vercel/sandbox/report.pdf" }, // source path on the sandbox
  { path: "./downloads/report.pdf" }, // destination path on the local machine
  { mkdirRecursive: true },
);
```

### Create Directories

```typescript
await sandbox.mkDir("/vercel/sandbox/my-app/src");
```

### `sandbox.fs` — `node:fs/promises`-compatible API

```typescript
const content = await sandbox.fs.readFile("/etc/hostname", "utf8");
await sandbox.fs.writeFile("/tmp/hello.txt", "Hello, world!");
const files = await sandbox.fs.readdir("/tmp");
const stats = await sandbox.fs.stat("/tmp/hello.txt");
```

## Extended Reference

Complete remaining sections are preserved in [references/deep-dive.md](references/deep-dive.md).
