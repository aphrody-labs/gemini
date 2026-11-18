---
name: offload-to-sandbox
description: Offload heavy builds, full test suites and parallel experiments from the local machine to Vercel Sandboxes with the `vercel sandbox` CLI. Use when a local machine is overloaded or shared by several agents, when a test suite should be sharded, or when many tasks should run side by side without consuming local CPU, memory or disk.
summary: "Offload heavy work to Vercel Sandboxes: build a base snapshot once (toolchain + deps + baseline build), create one non-persistent sandbox per task from it (`vercel sandbox create --name <task> --non-persistent --snapshot <snap_id> --vcpus 8 --timeout 3h`; Hobby allows 4 vCPUs and 45-minute sessions), push code as a tarball of git-tracked and untracked files while keeping heavy dirs like node_modules, run commands as one quoted `sh -c` string (long jobs use native detach/logs/wait when available, with status-file polling for older CLIs), use standalone `sandbox read`, `write`, and `copy -r` for file transfers when their help confirms support, copy small result files back, shard suites across sandboxes, check failures against an untouched baseline in the same sandbox, and `vercel sandbox remove` every sandbox when done. Older bundled `vercel sandbox exec` versions exit 0 even when the remote command fails; use the documented exit-status fallback."
metadata:
  priority: 5
  docs:
    - "https://vercel.com/docs/sandbox"
    - "https://vercel.com/docs/cli/sandbox"
    - "https://vercel.com/docs/sandbox/cli-reference"
    - "https://vercel.com/docs/sandbox/pricing"
  sitemap: "https://vercel.com/sitemap.xml"
  pathPatterns: []
  importPatterns: []
  bashPatterns:
    - '\b(?:(?:vercel|vc)\s+)?sandbox\s+(?:create|exec|copy|cp|read|cat|write|snapshot|run|fork|commands)\b'
  promptSignals:
    phrases:
      - "offload to a sandbox"
      - "offload to sandbox"
      - "run it in a sandbox"
      - "run the tests in a sandbox"
      - "remote sandbox"
      - "remote sandboxes"
      - "use sandboxes"
      - "shard the test suite"
      - "machine is overloaded"
    allOf:
      - [sandbox, offload]
      - [sandbox, remote]
      - [sandbox, "test suite"]
      - [sandbox, shard]
      - [sandbox, parallel]
      - [sandboxes, agents]
    anyOf:
      - "sandbox"
      - "sandboxes"
      - "offload"
      - "remote"
    noneOf:
      - "iframe sandbox"
      - "sandbox attribute"
      - "codesandbox.io"
    minScore: 6
retrieval:
  aliases:
    - offload work to vercel sandbox
    - remote build machine
    - remote test runner
  intents:
    - offload builds and tests to a sandbox
    - shard a test suite across machines
    - run parallel experiments remotely
  entities:
    - Vercel Sandbox
    - vercel sandbox CLI
    - snapshot
---

# Offloading work to a Vercel Sandbox

A Vercel Sandbox is a Linux microVM (x86_64) you can create in seconds and remove when you're done. That makes it a good remote worker: it keeps heavy builds and long test suites off your laptop and gives every agent or task its own clean machine. This skill covers how to do that efficiently with the `vercel sandbox` CLI. For the `@vercel/sandbox` SDK and running untrusted code, see the `vercel-sandbox` skill.

## When to offload, and what to keep local

Offload:

- Full test suites, especially when they can be sharded.
- Builds that take minutes or need Linux.
- Many tasks at once: one sandbox per task or per agent.
- Anything that fills the local disk (large build trees, many worktrees).

Keep local:

- Editing, `git`, small focused tests, type checks and lint, and orchestration.
- Anything needing local credentials or hardware the sandbox doesn't have.

A good default when several agents share one machine: agents edit locally and run quick focused checks, and everything heavy goes to their own sandboxes.

## Plan limits

| | Hobby | Pro | Enterprise |
|---|---|---|---|
| Max vCPUs (2 GB memory each) | 4 (8 GB) | 8 (16 GB) | 32 (64 GB) |
| Max session duration | 45 minutes | 24 hours | 24 hours |
| Concurrent sandboxes | 10 | 10,000 | 10,000 |

`--vcpus` takes 1 or an even number up to your plan's maximum; the default is 2. The examples below use Pro sizes (`--vcpus 8`, `--timeout 3h`). On Hobby, use `--vcpus 4` and a timeout of `45m` or less. Hobby also includes only 5 hours of Active CPU a month, so heavy offloading realistically needs Pro.

Running sandboxes are billed for Active CPU and provisioned memory. Snapshots are billed as Snapshot Storage per GB-month for as long as they exist.

## Prepare a base snapshot once

Installing toolchains and dependencies in every new sandbox wastes minutes and money. Do it once, snapshot, and start everything else from the snapshot:

```bash
# 1. Create a builder sandbox from the default image (Ubuntu, Node.js, Python, common tools).
vercel sandbox create --name base-builder --non-persistent --vcpus 8 --timeout 2h --image vercel/sandbox/universal

# 2. Install the pinned toolchain and build the baseline tree once.
vercel sandbox copy ./setup-base.sh base-builder:/vercel/sandbox/setup-base.sh
vercel sandbox exec base-builder -- sh -c 'cd /vercel/sandbox && sh setup-base.sh; echo "exit=$?"'

# 3. Snapshot it (this stops the sandbox). The ID is printed on stderr, not stdout.
vercel sandbox snapshot base-builder --stop --expiration 0 2>&1 | grep -o 'snap_[A-Za-z0-9_-]*' | head -n 1 > BASE_SNAPSHOT
test -s BASE_SNAPSHOT

# 4. The builder is no longer needed. Removing it keeps the snapshot.
vercel sandbox remove base-builder
```

Check that step 2 printed `exit=0` before you snapshot (see [Run commands](#run-commands) for why).

What to put in the base:

- The exact toolchain versions your project pins (compilers, runtimes, package manager).
- An installed and built copy of the main branch at a known commit, as a read-only baseline (for example `/vercel/sandbox/base`).
- Small helper scripts the tasks will reuse (for example a `prepare.sh` that turns a freshly pushed tree into a runnable checkout).

Keep the snapshot ID in a file next to your tooling. `--expiration 0` means the snapshot never expires, so it is billed until you delete it. When the toolchain changes, build a new snapshot and delete the old one with `vercel sandbox snapshots delete <old-id>`. Before a big run, check that `vercel sandbox snapshots get "$(cat BASE_SNAPSHOT)"` still shows the status `created`; a deleted or expired snapshot shows `deleted`.

## Create one sandbox per task

```bash
vercel sandbox create --name exp-parser --non-persistent --snapshot "$(cat BASE_SNAPSHOT)" \
  --vcpus 8 --timeout 3h --tag app=my-project --tag owner=agent-parser --silent
```

- **Name by owner and purpose** (`exp-parser`, `exp-parser-2`) so parallel agents never collide. Names are unique per project and stay taken until the sandbox is removed. Never use another agent's sandbox.
- **Size:** each vCPU comes with 2 GB of memory, and that is the only way to get more memory. Memory-heavy steps (large compiles, big linker jobs) can be killed by the Linux OOM killer. Below your plan's vCPU maximum, size up. At the maximum, lower the step's parallelism (for example fewer build jobs) or run it alone.
- **Tags** (up to 5 per sandbox) make cleanup easy: list and remove everything with your owner tag at the end.

## Lifetime and cleanup

Sandboxes are persistent by default: when a session stops, the filesystem is snapshotted so the sandbox can resume later, and that snapshot is billed as Snapshot Storage. Task sandboxes don't need that, which is why every `create` here passes `--non-persistent`.

- **`--timeout` sets the session length**, not the sandbox's lifetime. The default is 5 minutes. When it runs out, the session stops and everything running in it is killed, detached jobs included. A non-persistent sandbox loses its whole filesystem at that point. Set the timeout for the whole task. `vercel sandbox config timeout <name> <duration>` changes it later, and a higher value also extends the running session.
- **`vercel sandbox remove <name>` when a task is done.** `vercel sandbox stop` only ends the current session: the sandbox keeps its name, and a persistent sandbox keeps billing for its snapshot. Vercel removes sandboxes that can't resume after 14 days of inactivity, so a stopped non-persistent sandbox blocks its name until then unless you remove it.
- Removing a sandbox does not delete snapshots, so the base snapshot survives task cleanup. `--delete-orphan-snapshots` on `remove` also deletes the sandbox's own snapshots that no other sandbox uses. Don't pass it when removing the builder that made your base snapshot.
- **Sweep orphans** from crashed agents with `vercel sandbox list --all --tag owner=<agent>`. `--all` includes stopped sandboxes (the default shows only running ones), and `list` filters by one tag at a time. Remove everything it shows with `vercel sandbox remove <name>...`. Sweep the whole project (`--tag app=my-project`) only when no agent is still working.

## Move code in without reinstalling dependencies

Send source, not build output. Package the files git knows about (tracked plus untracked but not ignored) as one tarball, copy it, and extract it next to the old tree. Then move heavy directories (`node_modules`) from the old tree into the new one so they don't need reinstalling, and swap the two. `sbx push` in the [wrapper script](#wrap-it-in-one-small-script) does exactly this:

```bash
sbx push exp-parser . /vercel/sandbox/cand
```

- Push after every change; it takes seconds. Then run an idempotent prepare step that installs or rebuilds only what changed (for example, install dependencies only when the lockfile changed).
- Build platform-specific artifacts inside the sandbox. Don't copy macOS binaries into a Linux VM.
- Don't push `.git` or dependency directories. If you need git history remotely, push a bundle or `git clone` inside the sandbox.
- A tracked file you deleted but didn't stage makes `tar` fail. Stage the deletion (`git rm`) first.

## Read, write, and copy files directly

The standalone `sandbox` CLI supports file commands in releases containing [vercel/sandbox#380](https://github.com/vercel/sandbox/pull/380). Install or update it with `npm i -g sandbox`, then check the installed commands before using the examples:

```bash
sandbox --version
sandbox read --help
sandbox write --help
sandbox copy --help
```

Confirm that `read` and `write` exist and that `copy --help` lists `--recursive`. If they are unavailable, keep using `vercel sandbox copy` and the `sbx` wrapper below. The Vercel CLI bundles its own Sandbox CLI version, so support in `sandbox` does not establish support in `vercel sandbox`.

Use the same team and project as the existing task sandbox. Set `SBX_SCOPE` and `SBX_PROJECT` as described in [Authentication and scope](#authentication-and-scope); the standalone CLI must also be authenticated.

```bash
name=exp-parser
: "${SBX_SCOPE:?set SBX_SCOPE to your team slug}"
: "${SBX_PROJECT:?set SBX_PROJECT to your project name}"

# Read a sandbox file to stdout without changing its bytes.
sandbox read --scope "$SBX_SCOPE" --project "$SBX_PROJECT" "${name}:/vercel/sandbox/cand/package.json"

# Write a script from stdin and make it executable.
sandbox write --scope "$SBX_SCOPE" --project "$SBX_PROJECT" --mode 755 "${name}:/vercel/sandbox/check.sh" <<'SCRIPT'
#!/bin/sh
cd /vercel/sandbox/cand
npm test
SCRIPT

# Copy a prepared local directory into the sandbox.
sandbox copy -r --scope "$SBX_SCOPE" --project "$SBX_PROJECT" ./task-input "${name}:/vercel/sandbox/task-input"

# Download the result directory after the task has produced it.
sandbox copy -r --scope "$SBX_SCOPE" --project "$SBX_PROJECT" "${name}:/vercel/sandbox/results" ./results
```

`read` (also `cat`) prints file contents to stdout. `write` replaces the destination with stdin; redirect a local file with `< ./script.sh` when you already have one. Both return a non-zero status on failure.

Recursive copy puts the source directory's **contents** inside the destination and preserves empty directories, symlinks, and permissions. Windows downloads reject filenames containing backslashes or colons. It copies every entry, including ignored files, and leaves unrelated destination files in place. Use it for prepared input directories and results. Keep `sbx push` for project updates that need Git-based selection, removal of stale files, and reuse of remote `node_modules`.

## Run commands

```bash
vercel sandbox exec --timeout 2h exp-parser -- sh -c 'cd /vercel/sandbox/cand && npm test -- --shard 1/4; echo "exit=$?"'
```

- Pass the whole command as **one single-quoted string** to `sh -c`. Your local shell otherwise expands `$VARS` and globs before the sandbox sees them. zsh in particular errors on unmatched globs and treats `$var:r`, `$var:h` and similar as modifiers; use `${var}`.
- **Check the bundled CLI's exit behavior.** With `vercel` 64.5.0 (Sandbox CLI 4.4.0), `vercel sandbox exec` exits 0 even when the remote command fails. On that version, end the remote command with `echo "exit=$?"` and read that, or use `sbx exec`, which returns the remote status. The standalone Sandbox CLI (`npm i -g sandbox`, then `sandbox exec ...`) does pass the remote exit code through.
- For anything longer than a line, write a script locally, `vercel sandbox copy` it in, and run it. That is easier to quote, review and rerun.
- `exec --timeout` is optional and has no default. When it expires, the command is killed with SIGKILL and the CLI prints `Command was killed (SIGKILL, exit code 137)`. Without it, a command runs until it finishes or the session times out.
- If you compare timings, run both versions in the same sandbox, because hosts of the same size can differ in speed.

### Run long jobs with the standalone CLI

Use native command management when your installed CLI supports it. With the standalone CLI installed and authenticated as described above, check:

```bash
sandbox --version
sandbox exec --help
sandbox commands --help
```

Confirm that `exec` lists `--detach` and `--stdin`, and that `commands` lists `get`, `logs`, `wait`, and `kill`. Check these independently of the file commands above: CLI releases may support command management before `read`, `write`, and recursive copy. The Vercel CLI bundles its own Sandbox CLI version.

Start the task in the existing sandbox and save its command ID:

```bash
name=exp-parser
: "${SBX_SCOPE:?set SBX_SCOPE to your team slug}"
: "${SBX_PROJECT:?set SBX_PROJECT to your project name}"

command_id=$(sandbox exec --scope "$SBX_SCOPE" --project "$SBX_PROJECT" --detach "$name" -- sh -c 'cd /vercel/sandbox/cand && npm run test:all')
printf '%s\n' "$command_id"

sandbox commands get --scope "$SBX_SCOPE" --project "$SBX_PROJECT" "$name" "$command_id"
sandbox commands logs --scope "$SBX_SCOPE" --project "$SBX_PROJECT" "$name" "$command_id"
sandbox commands wait --scope "$SBX_SCOPE" --project "$SBX_PROJECT" "$name" "$command_id"
```

`get` checks status without waiting. `logs` streams stdout and stderr until the command exits; use it when you want to watch the task. `wait` returns the remote exit status, so use it to decide whether the task passed. Keep the sandbox name and command ID when returning to the job from another terminal.

To cancel a still-running task, use its saved command ID:

```bash
sandbox commands kill --scope "$SBX_SCOPE" --project "$SBX_PROJECT" "$name" "$command_id" --signal SIGTERM
sandbox commands wait --scope "$SBX_SCOPE" --project "$SBX_PROJECT" "$name" "$command_id"
```

Cancellation normally produces a non-zero exit status. Killing a command leaves the sandbox running. Command IDs belong to the current session; collect results before it stops. Detached commands still end when their command timeout or sandbox session timeout expires.

### Pipe input without an interactive terminal

For a command that reads input and then finishes, use `--stdin`:

```bash
printf 'hello\n' | sandbox exec --scope "$SBX_SCOPE" --project "$SBX_PROJECT" --stdin "$name" -- cat
```

This prints `hello`. The CLI forwards input and closes the remote stdin when the local input ends. Use `--stdin` for pipes and scripts; it cannot be combined with `--interactive`. For detached input, `exec --detach --stdin` keeps stdin open for later `commands write` calls; finish with `commands close-stdin` before waiting for a program that needs end-of-input. Wait for each write to finish before starting another. Treat command logs as text; use file transfers for binary artifacts.

### Fall back on older CLI versions

If native command management is unavailable, use the existing `sbx exec` wrapper for exit-status handling. For long jobs, keep the status-file approach below. The sandbox session timeout must cover the whole job:

```bash
vercel sandbox exec exp-parser -- sh -c 'cd /vercel/sandbox/cand && rm -f /tmp/test.status && nohup sh -c "npm run test:all > /tmp/test.log 2>&1; echo \$? > /tmp/test.status" > /dev/null 2>&1 &'
# later, cheap polls:
vercel sandbox exec --timeout 30s exp-parser -- sh -c 'cat /tmp/test.status 2>/dev/null || tail -3 /tmp/test.log'
```

## Get results back

- Have the remote side write compact result files (a summary of failing test names, exit codes, a JSON report) and copy just those back with `vercel sandbox copy exp-parser:/tmp/results.json ./results/results.json`. With the bundled CLI described here, `copy` moves one file per call and needs a full destination file path. For a whole result directory, use [standalone recursive copy](#read-write-and-copy-files-directly) when available.
- On that older bundled CLI, a missing source file makes `copy` print an error without failing, so check that the local file exists afterwards (`sbx get` does).
- Compress large logs remotely and only fetch them when needed. Streaming megabytes of output through `exec` is slow and wastes context when an agent reads it.

## Shard and parallelize

- Split a slow suite across N sandboxes by shard index, with your test runner's sharding or one orchestration script, and run the shards at the same time.
- Give each task its own sandbox. Ten agents each working in their own sandbox beat ten tasks queued on one machine.
- Bound concurrency by budget, not by what the API allows. Every running sandbox costs money.
- Large fan-outs are throttled by how fast you can allocate vCPUs. An idle Pro team starts at 150 vCPUs per minute (18 sandboxes with 8 vCPUs) and ramps up with sustained use; Hobby allows 20 to 40 per minute.

## Separate pre-existing failures from new ones

A remote suite usually has some failures that have nothing to do with your change: environment differences, flaky tests, failures already on main.

- Run the failing tests again on the untouched baseline tree in the same sandbox. Only failures that the baseline doesn't have are yours.
- Keep a short list of known environment-only failures next to your tooling, so nobody chases them again.
- While iterating, run focused checks. Run the full suite on the final candidate, not on every intermediate step.

## Extended Reference

Complete remaining sections are preserved in [references/deep-dive.md](references/deep-dive.md).
