---
name: bun-runtime
description: "How the Aphrody runtime works and is documented: Bun APIs, CLI commands, built-in JS modules, node:* compatibility, Bun.serve, fetch and streams, HTTP/SQL/Valkey, the shell, the test runner and the package manager (bun install, lockfile, linkers)."
---

# The Bun runtime

Use native `bun check`, `bun lint`, `bun fmt`, and `bun migrate` (or `bun pm migrate` / `bun-legacy-replace`) directly. Checkout qualification uses `bun bd check`, `bun bd lint`, `bun bd fmt`; no subprocess or external backend may replace `bun check`/`lint`/`fmt`. Package scripts may expose these native commands but must not wrap or replace them; `bunx` is reserved for unrelated packages.

## Runtime documentation pages (docs/)

See [bun-runtime-docs-index](references/bun-runtime-docs-index.md) and `~/.gemini/brain/bun/INDEX.md` for the complete `docs/runtime/` catalog (`init`, `check`, `lint`, `fmt`, `migrate`, `serve`, `sql`, `s3`, `redis`, etc.).

## References

Read the one that matches the task (`references/<name>.md`):

- [bun-runtime-docs-index](references/bun-runtime-docs-index.md): Full `docs/runtime/` page directory map

- [bun-graph-call-paths](references/bun-graph-call-paths.md): Verified end-to-end call chains (file:line) for bun run, Bun.serve, bun install and bun build, found via the aphrody graph + source, plus the graph node ids to explain them
- [bun-install-architecture](references/bun-install-architecture.md): Bun package manager core architecture — crates, PackageManager singleton, install pipeline, tasks/threads, registry/manifest cache, global cache dirs
- [bun-install-cli-map](references/bun-install-cli-map.md): Map of bun package-manager CLI subcommands (install/add/remove/update/pm/publish/pack/audit/why/link/patch/info/bunx...) to source files, plus bunfig [install] keys.npmrc, flags
- [bun-install-linkers-workspaces](references/bun-install-linkers-workspaces.md): Bun install node_modules linkers (hoisted vs isolated), workspaces, catalogs, overrides, patches, lifecycle scripts/trust, security scanner, minimum release age
- [bun-install-lockfile](references/bun-install-lockfile.md): Bun lockfile internals — Lockfile struct, text bun.lock (v0..v3) format/parser, binary bun.lockb, migration from npm/yarn/pnpm, load/save paths
- [bun-runtime-builtin-js-modules](references/bun-runtime-builtin-js-modules.md): src/js builtin modules — directory layout, preprocessor special syntax ($ intrinsics, $ERR_*, $rust/$cpp/$newRustFunction/$bindgenFn, $debug/$assert), require/export rules, numeric module IDs, codegen pipeline
- [bun-runtime-bun-apis](references/bun-runtime-bun-apis.md): globalThis.Bun object — full property table, C++ vs Rust owners, lazy-prop/callback export macros.classes.ts codegen classes and where each Bun.* API lives
- [bun-runtime-cli-commands](references/bun-runtime-cli-commands.md): Bun CLI dispatch — argv[0]/first-arg routing to Command Tag, every subcommand + alias and the Rust file implementing it
- [bun-runtime-http-sql-valkey](references/bun-runtime-http-sql-valkey.md): Network/database crates — bun_http client (HTTP/1.1, h2_client, h3_client, proxy, TLS session cache), WebSocket client (http_jsc), Bun.SQL (postgres/mysql/sqlite adapters), Valkey/Redis, DNS, S3 signing
- [bun-runtime-node-compat](references/bun-runtime-node-compat.md): Node.js compatibility layer map — which node:* modules are JS (src/js/node), native C++ (src/jsc/modules), or Rust bindings (src/runtime/node); fs/path/process/Buffer/net/http/crypto/child_process owners and compat review rules
- [bun-runtime-server](references/bun-runtime-server.md): Bun.serve internals — NewServer<SSL,DEBUG>, ServerConfig, routes (AnyRoute), RequestContext, ServerWebSocket, node:http bridge (NodeHTTPResponse), H2/H3, HTML bundles and Bun.listen sockets
- [bun-runtime-shell](references/bun-runtime-shell.md): Bun Shell ($ template) — JS wrapper builtins/shell.ts, bun_shell_parser lexer/parser/AST, runtime interpreter (NodeId arena state machine, builtins), plus process spawning (Bun.spawn, bun_spawn/bun_spawn_sys, Subprocess, Terminal PTY)
- [bun-runtime-test-runner](references/bun-runtime-test-runner.md): bun test implementation — CLI driver (test_command.rs, scanner, --parallel workers, sharding, --changed, reporters, coverage) and bun:test runtime (Collection/Order/Execution phases, ScopeFunctions, expect matchers, snapshots, mocks, fake timers)
- [bun-runtime-webcore-fetch-streams](references/bun-runtime-webcore-fetch-streams.md): Web APIs in src/runtime/webcore — fetch pipeline (fetch_impl -> FetchTasklet -> AsyncHTTP), Request/Response/Body.Value, Blob/Bun.file Store, ReadableStream native sources, JSSink sinks, S3, encoding
