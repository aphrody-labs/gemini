## Authentication and scope

- **Token:** `vercel sandbox` uses `--token`, then `VERCEL_AUTH_TOKEN`, then `VERCEL_TOKEN`, then your `vercel login` session. It falls back to a `VERCEL_OIDC_TOKEN` environment variable only when none of those is available. For CI or long-running automation, set `VERCEL_TOKEN`.
- The standalone `sandbox` CLI reads `VERCEL_AUTH_TOKEN` but not `VERCEL_TOKEN`, and it loads `.env` files from the current directory. A `VERCEL_OIDC_TOKEN` pulled into `.env.local` therefore takes precedence over your login there, and its project becomes the default scope.
- **Team and project:** sandboxes and their names belong to one project. `--scope` (or `--team`) and `--project` set it. Without them, the CLI uses the project in the token when it is an OIDC token, then the `.vercel/project.json` in the current directory (from `vercel link`), then your default team and a project named `vercel-sandbox-default-project`, which it creates if needed.
- Pass `--scope` and `--project` explicitly in scripts. Otherwise a script run from another directory works in a different project and can't see, reuse or clean up your sandboxes.

## Wrap it in one small script

A thin wrapper removes most mistakes and keeps agent instructions short. Save this as `sbx`, make it executable, and set `SBX_SCOPE`, `SBX_PROJECT` and `SBX_OWNER` (and `SBX_VCPUS=4 SBX_TIMEOUT=45m` on Hobby):

```sh
#!/bin/sh
# sbx: offload work to Vercel Sandboxes through `vercel sandbox`.
#   sbx create <name>                         new task sandbox from the base snapshot
#   sbx push <name> <local-dir> <remote-dir>  sync git-tracked and untracked files, keep node_modules
#   sbx exec <name> <script>                  run a shell script remotely, exit with its status
#   sbx get <name> <remote-file> <local-file>
#   sbx put <name> <local-file> <remote-file>
#   sbx rm <name>...                          permanently remove sandboxes
#   sbx clean                                 remove every sandbox tagged with your owner tag
# shellcheck disable=SC2016 # single-quoted scripts are expanded by the remote shell
set -eu

: "${SBX_SCOPE:?set SBX_SCOPE to your team slug}"
: "${SBX_PROJECT:?set SBX_PROJECT to your project name}"
owner=${SBX_OWNER:-${USER:-agent}}
vcpus=${SBX_VCPUS:-8}              # Pro maximum; Hobby allows 4
timeout=${SBX_TIMEOUT:-3h}         # session length; Hobby allows 45m
exec_timeout=${SBX_EXEC_TIMEOUT:-2h}

sb() { # sb <subcommand> [args...]
  sub=$1
  shift
  vercel sandbox "$sub" --scope "$SBX_SCOPE" --project "$SBX_PROJECT" "$@"
}

# `vercel sandbox exec` exits 0 even when the remote command fails, so the
# remote shell prints the script's exit status and remote() returns it.
remote() { # remote <name> <script> [args...]
  name=$1
  script=$2
  shift 2
  log=$(mktemp)
  sb exec --timeout "$exec_timeout" "$name" -- \
    sh -c 'sh -c "$0" sh "$@"; echo "__sbx_exit=$?"' "$script" "$@" | tee "$log"
  code=$(sed -n 's/^__sbx_exit=//p' "$log" | tail -n 1)
  rm -f "$log"
  return "${code:-1}"
}

push() { # push <name> <local-dir> <remote-dir>
  git -C "$2" rev-parse --is-inside-work-tree > /dev/null
  tgz=$(mktemp)
  (cd "$2" && git ls-files -z --cached --others --exclude-standard |
    COPYFILE_DISABLE=1 tar -czf "$tgz" --null -T -)
  sb copy "$tgz" "$1:$3.tgz"
  rm -f "$tgz"
  remote "$1" '
    set -e
    dest=$1
    rm -rf "$dest.new"
    mkdir -p "$dest.new"
    tar -xzf "$dest.tgz" -C "$dest.new"
    rm -f "$dest.tgz"
    if [ -d "$dest" ]; then
      (cd "$dest" && find . -maxdepth 4 -type d -name node_modules -prune -print) > "$dest.keep"
      while IFS= read -r keep; do
        [ -e "$dest.new/$keep" ] && continue
        mkdir -p "$(dirname "$dest.new/$keep")"
        mv "$dest/$keep" "$dest.new/$keep"
      done < "$dest.keep"
      rm -rf "$dest" "$dest.keep"
    fi
    mv "$dest.new" "$dest"' "$3" > /dev/null
}

cmd=${1:?usage: sbx create|push|exec|get|put|rm|clean ...}
shift
case "$cmd" in
  create)
    name=${1:?usage: sbx create <name>}
    snapshot=${SBX_SNAPSHOT:-$(cat BASE_SNAPSHOT)}
    sb create --name "$name" --non-persistent --snapshot "$snapshot" \
      --vcpus "$vcpus" --timeout "$timeout" \
      --tag "app=$SBX_PROJECT" --tag "owner=$owner" --silent
    echo "$name"
    ;;
  push)
    push "${1:?name}" "${2:?local dir}" "${3:?remote dir}"
    ;;
  exec)
    name=${1:?usage: sbx exec <name> <script>}
    shift
    remote "$name" "$*"
    ;;
  get)
    rm -f "${3:?local file}"
    sb copy "${1:?name}:${2:?remote file}" "$3"
    [ -f "$3" ] || { echo "sbx: could not copy $1:$2" >&2; exit 1; }
    ;;
  put)
    [ -f "${2:?local file}" ] || { echo "sbx: no such file: $2" >&2; exit 1; }
    sb copy "$2" "${1:?name}:${3:?remote file}"
    ;;
  rm)
    : "${1:?usage: sbx rm <name>...}"
    sb remove "$@"
    ;;
  clean)
    # `list` shows 50 sandboxes per page; run `sbx clean` again if more remain.
    names=$(sb list --all --tag "owner=$owner" | awk 'NR > 1 && NF && $1 != "More" { print $1 }')
    # shellcheck disable=SC2086 # one word per sandbox name
    if [ -n "$names" ]; then sb remove $names; fi
    ;;
  *)
    echo "usage: sbx create|push|exec|get|put|rm|clean ..." >&2
    exit 2
    ;;
esac
```

Typical agent session:

```sh
sbx create exp-parser
sbx push exp-parser . /vercel/sandbox/cand
sbx exec exp-parser 'cd /vercel/sandbox/cand && sh /vercel/sandbox/prepare.sh && npm test'
sbx get exp-parser /tmp/results.json ./results.json
sbx rm exp-parser
```

Document the workflow next to the wrapper (a short `SANDBOX.md`): the snapshot ID, what the base contains, the prepare step, how to run the suite, and the known environment-only failures. Point every agent's instructions at that file.

## Pitfalls

- **False success:** `vercel sandbox exec` exits 0 when the remote command fails. Read the printed exit status, or use `sbx exec`.
- **OOM:** big compiles can be killed. A remote exit status of 137 means the process got SIGKILL, usually from the OOM killer. Size up within your plan, or lower parallelism at the maximum, rather than retrying blindly.
- **Lost work at the session timeout:** a non-persistent sandbox discards its filesystem when the session stops. Copy results out before the timeout, and set the timeout for the whole task.
- **Leftover sandboxes:** `stop` doesn't free a sandbox's name or delete it. Use `remove`, and sweep with `list --all`.
- **Stale snapshot:** tasks that start from an old base can hit toolchain-version mismatches. Rebuild the snapshot, or refresh the tools in the task sandbox, when versions change.
- **Shared sandboxes:** two agents in one sandbox corrupt each other's trees. One owner per sandbox.
- **Quotas mid-run:** on Hobby, sandbox creation pauses once the monthly allotment is used up, and on Pro a Spend Management limit can pause projects. Commit work in small steps, write results to disk as you go, and keep scripts idempotent, so a replacement agent can resume instead of starting over.
