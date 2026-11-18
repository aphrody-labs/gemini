## Multi-User and Groups

Create isolated Linux users and shared groups inside a sandbox. This is purely
SDK-side and is useful for isolating multiple agents or workloads within a single
sandbox. Usernames and group names are validated to prevent command injection.

### Creating Users

`createUser` provisions a Linux user with an isolated home directory at
`/home/<username>` and returns a `SandboxUser` whose operations run in that
user's context.

```typescript
const alice = await sandbox.createUser("alice");
alice.username; // "alice"
alice.homeDir; // "/home/alice"

// Commands run as alice; cwd defaults to /home/alice
const whoami = await alice.runCommand("whoami");
await whoami.stdout(); // "alice\n"

// Env vars, custom cwd, sudo escalation, and detached mode all work
await alice.runCommand({
  cmd: "node",
  args: ["-e", "console.log(process.env.SECRET)"],
  env: { SECRET: "hunter2" },
});
await alice.runCommand({
  cmd: "apt-get",
  args: ["update"],
  sudo: true,
});
await alice.runCommand({
  cmd: "apt-get",
  args: ["install", "-y", "git"],
  sudo: true,
});
const server = await alice.runCommand({
  cmd: "node",
  args: ["server.js"],
  detached: true,
});
```

Get a handle to a pre-existing user (e.g. `root`) without creating it:

```typescript
const existing = sandbox.asUser("bob");
await existing.runCommand("whoami");
```

### File Operations Scoped to a User

Relative paths resolve against the user's home directory and files are owned by
that user. Absolute paths are also supported.

```typescript
// Written to /home/alice, owned by alice:alice
await alice.writeFiles([
  { path: "app.js", content: Buffer.from('console.log("hi")') },
  { path: "data/config.json", content: Buffer.from("{}") },
]);

const buf = await alice.readFileToBuffer({ path: "app.js" });
const stream = await alice.readFile({ path: "app.js" });
await alice.mkDir("projects/my-app");
```

Files are isolated between users — one user cannot read, list, or write another
user's home directory (commands return a non-zero exit code with "Permission
denied").

### Groups and Shared Directories

`createGroup` creates a Linux group with a shared directory at
`/shared/<groupname>` (setgid `2770`), so files created inside it automatically
inherit group ownership. Group members can read and write there; non-members
are blocked.

```typescript
const devs = await sandbox.createGroup("devs");
devs.sharedDir; // "/shared/devs"

await sandbox.addUserToGroup("alice", "devs");
await sandbox.addUserToGroup("bob", "devs");

// Or via convenience methods on SandboxUser
await alice.addToGroup("devs");
await alice.removeFromGroup("devs");

await sandbox.removeUserFromGroup("alice", "devs");
```

## Network Policy

### Full Internet Access (Default)

```typescript
const sandbox = await Sandbox.create({
  networkPolicy: "allow-all",
});
```

### No Network Access

```typescript
const sandbox = await Sandbox.create({
  networkPolicy: "deny-all",
});
```

### Restricted Access (Simple Domain List)

```typescript
const sandbox = await Sandbox.create({
  networkPolicy: {
    allow: ["*.npmjs.org", "github.com", "registry.yarnpkg.com"],
    subnets: {
      allow: ["10.0.0.0/8"],
      deny: ["10.1.0.0/16"], // Takes precedence over allowed
    },
  },
});
```

### Restricted Access with Credential Brokering

```typescript
const sandbox = await Sandbox.create({
  networkPolicy: {
    allow: {
      "ai-gateway.vercel.sh": [
        {
          transform: [
            {
              headers: { authorization: "Bearer ..." },
            },
          ],
        },
      ],
      "*": [], // Allow all other domains without transforms
    },
  },
});
```

### L7 Request Matchers

Rules can match on method, path, query string, and headers. All specified
dimensions must match; multiple methods are ORed; multiple header and
query-string matchers are ANDed.

```typescript
const sandbox = await Sandbox.create({
  networkPolicy: {
    allow: {
      "ai-gateway.vercel.sh": [
        {
          match: {
            method: ["POST"],
            path: { startsWith: "/v1/" },
            headers: [
              { key: { exact: "x-api-key" }, value: { exact: "placeholder" } },
            ],
          },
          transform: [{ headers: { authorization: "Bearer ..." } }],
        },
      ],
    },
  },
});
```

Matchers support `exact`, `startsWith`, and `regex` (RE2).

### Forward Matching Requests to a Proxy

Use `forwardURL` to redirect any matching request through an HTTPS proxy you
control. The proxy receives the original request along with sandbox metadata in
forwarded headers.

```typescript
const sandbox = await Sandbox.create({
  networkPolicy: {
    allow: {
      "api.example.com": [
        {
          match: { path: { startsWith: "/secure/" } },
          forwardURL: "https://my-proxy.example.com",
        },
      ],
    },
  },
});
```

Implement the proxy handler with `defineSandboxProxy`, using the Web `Request` & `Response` objects — it verifies the
sandbox OIDC token and extracts metadata about the source sandbox:

```typescript
// app/api/sandbox-proxy/route.ts
import { defineSandboxProxy } from "@vercel/sandbox/proxy";

const handler = defineSandboxProxy(async (request, meta) => {
  // meta: { host, teamId, projectId, sandboxId, sandboxName }
  console.log("Proxied from sandbox", meta.sandboxName);
  return fetch(request);
});

// Sandboxes forward requests using their original method, so the handler
// must be exposed under every verb the network policy can route.
export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
```

### Updating Network Policy at Runtime

Use `sandbox.update` (preferred). `updateNetworkPolicy` is deprecated but still
works.

```typescript
await sandbox.update({ networkPolicy: { allow: ["api.openai.com"] } });
```

## Updating Sandbox Configuration

`sandbox.update` replaces individual update helpers and accepts any of the
mutable parameters. When `ports` is provided, it is treated as the **full**
desired port list — any currently exposed port not present in the array is
deregistered.

```typescript
await sandbox.update({
  resources: { vcpus: 4 }, // Memory auto-scales to 2048 MB per vCPU
  timeout: ms("30m"),
  networkPolicy: "deny-all",
  ports: [3000, 8000],
  tags: { env: "prod" },
  persistent: false,
  snapshotExpiration: ms("14d"),
  keepLastSnapshots: { count: 1 },
  currentSnapshotId: "snap_xyz", // Rollback to a previous snapshot
  region: "sfo1", // Applies to the next session
  failoverRegions: ["cle1"], // Replaces the list; pass [] to remove them
});
```

`region` and `failoverRegions` can be updated independently, but `failoverRegions` must not include the configured `region`.

## Deleting a Sandbox

```typescript
// Permanently remove a sandbox. Its snapshots are kept until they expire.
await sandbox.delete();

// Also delete the snapshots that no other sandbox uses.
await sandbox.delete({ deleteOrphanSnapshots: true });
```

## Stopping a Sandbox

`stop()` is synchronous: it blocks until the VM is fully stopped and returns
the final session state, including the snapshot created during shutdown (when
`persistent: true`).

```typescript
const result = await sandbox.stop();
console.log(result.snapshot?.id);
console.log(result.activeCpuUsageMs);
console.log(result.networkTransfer); // { ingress, egress }
```

## Tags

Sandboxes support up to 5 key-value tags. Tags can be set at creation, updated
via `sandbox.update({ tags })`, and used as filters when listing.

```typescript
await Sandbox.create({ tags: { env: "staging", team: "infra" } });

const result = await Sandbox.list({ tags: { env: "staging" } });
```

## Listing Sandboxes, Sessions, and Snapshots

All list APIs use **cursor-based pagination** and return an async-iterable that
auto-paginates through every page. You can also iterate page-by-page or
collect all items at once.

### `Sandbox.list`

```typescript
const result = await Sandbox.list({
  namePrefix: "ci-", // Filter by name prefix
  tags: { env: "staging" }, // Filter by tags
  sortBy: "createdAt", // "createdAt" (default), "name", or "statusUpdatedAt"
  sortOrder: "desc", // "asc" or "desc" (default)
  limit: 50,
});

// Per-item async iteration (auto-paginates)
for await (const sandbox of result) {
  console.log(sandbox.name);
}

// Per-page iteration
for await (const page of result.pages()) {
  console.log(page.sandboxes.length);
}

// Collect everything
const all = await result.toArray();

// Or use the cursor directly
const next = result.pagination.next;
```

### `sandbox.listSessions` and `sandbox.listSnapshots`

```typescript
// List all VM sessions for this sandbox
const sessions = await sandbox.listSessions();
for await (const session of sessions) {
  console.log(session.sessionId, session.status);
}

// List snapshots belonging to this sandbox
const snapshots = await sandbox.listSnapshots();
for await (const snapshot of snapshots) {
  console.log(snapshot.snapshotId, snapshot.status);
}
```

### `Snapshot.list`

```typescript
const snapshots = await Snapshot.list({
  name: "my-dev-env", // Filter by sandbox name
  sortOrder: "desc",
  limit: 50,
});
for await (const snapshot of snapshots) {
  console.log(snapshot.snapshotId, snapshot.status);
}
```

## Sessions

A **Session** is a single running VM instance inside a sandbox. You typically
do not interact with sessions directly — the SDK creates and resumes them for
you — but you can inspect the current one.

```typescript
const session = sandbox.currentSession();
console.log(session.sessionId);
console.log(session.status); // "pending" | "running" | "stopping" | "stopped" | ...
```

## Snapshots

Snapshots save the entire sandbox filesystem to be reused later, for any
number of sandboxes.

Snapshots are stored in the sandbox's region; all regions where a snapshot is
available are listed in `snapshot.regions`. Creating a sandbox from a snapshot
in a region where the snapshot is not available fails with a
`snapshot_region_mismatch` error.

### Create a Snapshot

```typescript
const sandbox = await Sandbox.create();
await sandbox.runCommand("npm", ["install"]);

// Create snapshot (stops the sandbox)
const snapshot = await sandbox.snapshot({
  expiration: ms("14d"), // Default: 30 days, use 0 for no expiration
});
console.log("Snapshot ID:", snapshot.snapshotId);
```

### Default Snapshot Expiration and Retention

Configure default expiration and retention policy per sandbox:

```typescript
await Sandbox.create({
  name: "my-app",
  snapshotExpiration: ms("7d"), // Default TTL for any snapshot of this sandbox
  keepLastSnapshots: {
    count: 1, // Keep only the most recent snapshot (1-10)
    expiration: ms("30d"), // Override expiration for kept snapshots
    deleteEvicted: true, // Delete evicted snapshots immediately (default)
  },
});
```

`keepLastSnapshots: { count: 1 }` is the recommended setting when you only
care about the latest snapshot — it lets the SDK keep snapshot storage costs flat.

### List, Get, and Delete

```typescript
// List all snapshots in the project (auto-paginates)
const snapshots = await Snapshot.list();
for await (const snapshot of snapshots) {
  console.log(snapshot.snapshotId, snapshot.status);
}

// Get a specific snapshot
const snapshot = await Snapshot.get({ snapshotId: "snap_abc123" });

// Delete a snapshot
await snapshot.delete();
```

### Snapshot Tree

Snapshots form a tree: any sandbox created from another snapshot inherits a
parent → child relationship. Walk that tree to see ancestors or descendants of
a given snapshot.

```typescript
// Walk ancestors (default direction)
const ancestors = await Snapshot.tree({
  snapshotId: "snap_abc",
  sortOrder: "desc",
});
for await (const node of ancestors) {
  console.log(node.snapshotId, node.parentId);
}

// Walk descendants
const descendants = await Snapshot.tree({
  snapshotId: "snap_abc",
  sortOrder: "asc",
});
```

### Snapshot Rollback

Point an existing sandbox at a previous snapshot by updating
`currentSnapshotId`. New sessions will resume from that snapshot.

```typescript
await sandbox.update({ currentSnapshotId: "snap_previous" });
```

## Exposed Ports

```typescript
const sandbox = await Sandbox.create({ ports: [3000, 8000] });

// Get public URL for a port
const url = sandbox.domain(3000);
// Returns: https://subdomain.vercel.run
```

Replace the exposed port list at runtime with `sandbox.update({ ports })`. Any
currently exposed port not present in the new array is deregistered.

```typescript
await sandbox.update({ ports: [3000, 8443] });
```

## Timeout Management

```typescript
const sandbox = await Sandbox.create({
  timeout: ms("10m"), // Initial timeout, default of 5 minutes
});

// Extend timeout by 5 more minutes
await sandbox.extendTimeout(ms("5m"));
// New total: 15 minutes
```

## Authentication

### Vercel OIDC Token (Recommended)

```bash
# Pull development credentials
vercel link
vercel env pull
```

The SDK automatically uses `VERCEL_OIDC_TOKEN` from environment.

### Access Token (Alternative)

```typescript
const sandbox = await Sandbox.create({
  teamId: process.env.VERCEL_TEAM_ID!,
  projectId: process.env.VERCEL_PROJECT_ID!,
  token: process.env.VERCEL_TOKEN!,
  // ... other options
});
```

## Error Handling

```typescript
import { APIError, StreamError } from "@vercel/sandbox";

try {
  const sandbox = await Sandbox.create();
} catch (error) {
  if (error instanceof APIError) {
    console.error("API Error:", error.message, error.response.status);
  } else if (error instanceof StreamError) {
    console.error("Stream Error:", error.message);
  }
  throw error;
}
```

## Cancellation with AbortSignal

```typescript
const controller = new AbortController();

// Cancel after 30 seconds
setTimeout(() => controller.abort(), 30000);

const sandbox = await Sandbox.create({
  signal: controller.signal,
});

const result = await sandbox.runCommand({
  cmd: "npm",
  args: ["test"],
  signal: controller.signal,
});
```

## Limitations

| Limitation      | Details                                                                         |
| --------------- | ------------------------------------------------------------------------------- |
| Max vCPUs       | 4 vCPUs on Hobby, 8 vCPUs on Pro, 32 vCPUs on Enterprise (2048 MB RAM per vCPU) |
| Max ports       | 15 exposed ports                                                                |
| Max tags        | 5 key-value tags per sandbox                                                    |
| Max timeout     | 24 hours (Pro/Enterprise), 45 minutes (Hobby)                                   |
| Default timeout | 5 minutes                                                                       |
| Base system     | Ubuntu 26.04                                                                    |
| User context    | `ubuntu` user                                                                   |
| Writable paths  | `/vercel/sandbox` and read-write drive mount paths                              |
| Regions         | One primary region per sandbox, plus optional failover regions. All 19 Vercel regions are supported (`iad1` default, `sfo1`, `cle1`, `cdg1`, `fra1`, `arn1`, `sin1`, `pdx1`, `lhr1`, `icn1`, `bom1`, `cpt1`, `dub1`, `gru1`, `hkg1`, `syd1`, `yul1`, `hnd1`, `kix1`). Snapshots restore only in regions where they are available. |

## System Packages

The default image includes Node.js 24, Bun, Python 3.14, pnpm, uv, Git, GitHub
CLI, coding agents, and common development and debugging utilities.

Install additional packages with sudo:

```typescript
await sandbox.runCommand({
  cmd: "apt-get",
  args: ["update"],
  sudo: true,
});
await sandbox.runCommand({
  cmd: "apt-get",
  args: ["install", "-y", "package-name"],
  sudo: true,
});
```

This is fine for one-offs. For reproducible dependencies or a different base
environment, use a [custom image](#from-a-custom-image-vcr) instead.

## CLI Quick Reference

```bash
# Install CLI
pnpm i -g sandbox

# Login / Logout
sandbox login
sandbox logout

# Create and connect
sandbox create --connect
sandbox create --name my-app
sandbox create --image my-repo:v1            # Boot from a VCR image
sandbox create --non-persistent              # Disable filesystem persistence
sandbox create --snapshot-expiration 7d      # Default snapshot TTL
sandbox create --keep-last-snapshots 1       # Retention policy
sandbox create --tag env=staging             # Repeatable
sandbox create --region <region>             # Defaults to iad1; any Vercel region, e.g. sfo1, fra1, hnd1, syd1
sandbox create --failover-regions <region>,<region>  # Comma-separated
sandbox create --failover-regions none               # No failover, overrides the project default

# Start a coding agent (interactive terminal required)
sandbox create opencode
sandbox create pi
sandbox create claude
sandbox create codex
sandbox create fx

# Fork an existing sandbox (inherits config, incl. env; --env replaces it)
sandbox fork <source>
sandbox fork <source> --name my-fork --vcpus 4 --env FOO=1
sandbox fork <source> --region <region>      # Override the region copied from the source

# List sandboxes (paginated, filterable)
sandbox ls
sandbox ls --name-prefix ci- --sort-by name
sandbox ls --tag env=staging --limit 100 --cursor <token>

# Run a command in a new sandbox (create + exec in one step)
sandbox run -- node -e "console.log('hello')"
sandbox run --name my-app -- npm test        # Resumes existing sandbox if present
sandbox run --stop -- npm build              # Stop the session when the command exits
sandbox run --rm -- npm build                # DELETES the sandbox after running

# Execute command in an existing sandbox
sandbox exec <name> -- npm install
sandbox exec <name> -- npm build
sandbox stop <name>

# Start an interactive shell
sandbox connect <name>

# Copy files
sandbox cp local-file.txt <name>:/vercel/sandbox/local-file.txt
sandbox cp -r ./my-app <name>:/vercel/sandbox/app    # Directory: contents of ./my-app land in /app
sandbox cp -r <name>:/vercel/sandbox/dist ./dist     # And back
# Recursive copies preserve empty directories, symlinks, and permissions.
# Windows downloads reject filenames containing backslashes or colons.

# Read and write single files (handy for coding agents)
sandbox read <name> /vercel/sandbox/package.json     # Raw bytes to stdout
sandbox write <name> /vercel/sandbox/index.js < ./index.js
sandbox write --mode 755 <name> /vercel/sandbox/run.sh <<'EOF'
#!/bin/sh
npm test
EOF

# Start a command and retrieve its ID for later inspection
sandbox exec --detach <name> -- npm run dev
sandbox commands get <name> <command-id>
sandbox commands logs <name> <command-id>
sandbox commands wait <name> <command-id>
sandbox commands kill <name> <command-id> --signal SIGTERM  # Also SIGKILL, SIGINT, SIGHUP, SIGQUIT

# Pipe local input into a command and stream its output in one invocation
printf 'hello\n' | sandbox exec --stdin <name> -- cat

# --stdin cannot be combined with --interactive

# Keep stdin open when later processes need to write to a detached command
# Wait for each write to finish before another process writes to the same command
command_id=$(sandbox exec --detach --stdin <name> -- cat)
printf 'hello\n' | sandbox commands write <name> "$command_id"
sandbox commands close-stdin <name> "$command_id"
# output waits for exit; use commands logs to stream while running
# CLI output is text and does not preserve arbitrary binary bytes
sandbox commands output <name> "$command_id" --stream stdout  # Also accepts stderr or both

# Get the public URL for a published port in the running session
sandbox domain <name> 3000

# Create a Linux user and shared group, then run a command as that user
sandbox users create <name> alice
sandbox groups create <name> devs
sandbox groups add-user <name> devs alice
sandbox users exec <name> alice -- id
sandbox groups remove-user <name> devs alice

# Add time to the current running session without changing future defaults
sandbox extend <name> <duration>

# Stop sandbox (synchronous; reports snapshot + usage)
sandbox stop <name>

# Permanently delete sandbox; its snapshots are kept until they expire
sandbox remove <name>
sandbox remove <name> --delete-orphan-snapshots  # Also delete snapshots no other sandbox uses

# Sessions
sandbox sessions list <name>

# Snapshots
sandbox snapshot <name>
sandbox snapshots list --name <name>
sandbox snapshots get <snapshot-id>
sandbox snapshots remove <snapshot-id>
sandbox snapshots tree <name>                # Walk the tree from the sandbox's current snapshot
sandbox snapshots tree <name> --cursor <snapshot-id> --sort-order asc

# Create or retrieve a drive; size is fixed at creation
sandbox drives get-or-create workspace --max-size 200GiB
sandbox drives get-or-create archive --max-size 2TiB
sandbox drives get-or-create workspace --max-size 214748364800  # Raw bytes

# Config (view + update any sandbox parameter)
sandbox config list <name>
sandbox config vcpus <name> <count>
sandbox config timeout <name> <duration>  # Total runtime; a higher value also extends the running session
sandbox config persistent <name> <true|false>
sandbox config region <name> <region>
sandbox config failover-regions <name> <region,...|none>
sandbox config snapshot-expiration <name> <duration|none>
sandbox config keep-last-snapshots <name> <count>
sandbox config keep-last-snapshots-for <name> <duration|none>
sandbox config delete-evicted-snapshots <name> <true|false>
sandbox config current-snapshot <name> <snapshot-id>
sandbox config network-policy <name> --network-policy deny-all
sandbox config network-policy <name> --allowed-domain '*' --request-header api.example.com:x-source=ci  # domain:header=value
API_AUTH="Bearer $API_TOKEN" sandbox config network-policy <name> --allowed-domain '*' --request-header-from-env api.example.com:authorization=API_AUTH  # Secret value read from $API_AUTH
sandbox config network-policy <name> --network-policy-file policy.json  # Whole policy as SDK NetworkPolicy JSON; use - for stdin
sandbox config network-policy <name> --network-policy-file - <<EOF  # A heredoc keeps $NPM_TOKEN out of the command line
{"allow": {"*": [], "registry.npmjs.org": [{"match": {"method": ["GET", "HEAD"]}, "transform": [{"headers": {"authorization": "Bearer $NPM_TOKEN"}}]}]}}
EOF
sandbox config tags <name> --tag env=prod
```

Drive sizes accept bytes or units such as `GiB` and `TiB`. Unit names are
case-insensitive; `GB` and `TB` are aliases for the binary units. Omitting
`--max-size` retrieves the existing size or uses the plan default for a new
drive. The output includes a reminder that size is fixed at creation.

Agent shortcuts use the universal image and require an interactive terminal.
Do not combine them with `--image`, `--runtime`, or `--snapshot`. Configure
authentication for the agent separately from `sandbox login`.

For fx, choose a sign-in option on first launch or pass an exported AI Gateway
API key with `sandbox create fx --env AI_GATEWAY_API_KEY`. The shortcut preserves
fx's default permissions. fx can update itself inside the sandbox, so its version
may change between sessions. Its reconnect command uses `fx -c` to continue the
conversation. If you supplied `--env`, export the same values locally before
reconnecting; the hint includes names only.

Exiting the agent leaves the sandbox running. Unless you pass `--silent`, the CLI
prints reconnect and stop commands. Follow any environment-variable reminder
printed with the reconnect command.

## Common Patterns

### Dev Server Pattern (Persistent)

```typescript
const sandbox = await Sandbox.getOrCreate({
  name: "my-dev-env",
  source: { type: "git", url: "https://github.com/org/repo.git" },
  ports: [3000],
  timeout: ms("30m"),
  onCreate: async (sbx) => {
    await sbx.runCommand({ cmd: "npm", args: ["install"], cwd: "repo" });
  },
  onResume: async (sbx) => {
    await sbx.runCommand({
      cmd: "npm",
      args: ["run", "dev"],
      cwd: "repo",
      detached: true,
    });
  },
});

console.log("App running at:", sandbox.domain(3000));
```

### Build and Test Pattern (Ephemeral)

```typescript
const repoUrl = "https://github.com/org/repo.git";
const repoDir = "repo";

await using sandbox = await Sandbox.create({
  source: { type: "git", url: repoUrl },
  persistent: false, // Skip snapshotting on shutdown
  snapshotExpiration: ms("1d"), // Short TTL for any incidental snapshot
});

const install = await sandbox.runCommand({
  cmd: "npm",
  args: ["ci"],
  cwd: repoDir,
});
if (install.exitCode !== 0) throw new Error("Install failed");

const build = await sandbox.runCommand({
  cmd: "npm",
  args: ["run", "build"],
  cwd: repoDir,
});
if (build.exitCode !== 0) throw new Error("Build failed");

const test = await sandbox.runCommand({
  cmd: "npm",
  args: ["test"],
  cwd: repoDir,
});
process.exit(test.exitCode);
```

### Base Sandbox + Forks Pattern

Maintain a single "base" sandbox with dependencies installed, and spawn fresh
children from it with `Sandbox.fork`. Each fork inherits the base's config
and is seeded from its current snapshot — no need to store snapshot IDs in
your code. New base snapshots are picked up automatically on the next fork.

```typescript
// Once: bootstrap the base sandbox
await Sandbox.getOrCreate({
  name: "my-base",
  keepLastSnapshots: { count: 5 }, // Keep storage flat
  onCreate: async (sbx) => {
    await sbx.runCommand("npm", ["install", "-g", "typescript", "tsx"]);
  },
});

// On every run: fork the base sandbox
async function runFromBase(code: string) {
  await using sandbox = await Sandbox.fork({
    sourceSandbox: "my-base",
    persistent: false,
  });
  await sandbox.writeFiles([
    { path: "/vercel/sandbox/index.ts", content: Buffer.from(code) },
  ]);
  return sandbox.runCommand("tsx", ["index.ts"]);
}
```

### Long-Lived Workspace Pattern

```typescript
// Idempotent: first call creates, subsequent calls resume
const sandbox = await Sandbox.getOrCreate({
  name: `workspace-${userId}`,
  keepLastSnapshots: { count: 1, expiration: ms("5d") },
  onCreate: async (sbx) => {
    await sbx.runCommand("git", ["clone", repoUrl, "."]);
    await sbx.runCommand("npm", ["install"]);
  },
});

// Use the sandbox — auto-resumes if it was stopped
await sandbox.runCommand("git", ["pull"]);
```
