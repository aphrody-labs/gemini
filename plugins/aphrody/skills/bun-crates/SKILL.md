---
name: bun-crates
description: "Navigate the Rust side of the Aphrody runtime (aphrody-labs/bun): the 137 workspace crates of the Cargo workspace (bun_core, bun_sys, bun_jsc, bun_runtime, js_parser, bundler, install...), Rust idioms, JSC bindings, GC lifetimes, event loop, parser, printer, resolver, bundler and CSS."
---

# The crates of the Aphrody runtime

## Workspace members

Key crate domains: `bun_core`, `bun_sys`, `bun_alloc`, `bun_jsc`, `bun_event_loop`, `bun_bundler`, `bun_browser*`, `bun_format`, `bun_sema`, `bun_host`, `bun_graph`, `bun_cosmic`, `bun_coreutils`.
See [workspace-members-core.md](references/workspace-members-core.md) (top 99 core crates) and [workspace-members.md](references/workspace-members.md) (remaining workspace crates).

## References

Read the one that matches the task (`references/<name>.md`):

- [bun-core-classes-ts-bindings](references/bun-core-classes-ts-bindings.md): The .classes.ts → generate-classes.ts → ZigGeneratedClasses.cpp + generated_classes.rs pipeline, #[JsClass] Rust side, generated symbol names, and two end-to-end examples (Glob, CronJob); plus hand-written C++ class pattern
- [bun-core-crate-map](references/bun-core-crate-map.md): Map of Bun's Rust foundation crates (bun_core, bun_alloc, bun_sys, paths, collections, threading, ptr, safety, jsc, event_loop, io, uws_sys), their tiers and the lints and disallowed-std rules that govern them
- [bun-core-event-loop](references/bun-core-event-loop.md): Bun's event loop in Rust — VirtualMachine access, jsc::EventLoop tick/run_callback/Stopped, Task/TaskTag/Taskable/ConcurrentTask, hoisted dispatch in bun_runtime, AnyEventLoop/EventLoopHandle/MiniEventLoop, timers, KeepAlive, uSockets/libuv
- [bun-core-gc-lifetimes](references/bun-core-gc-lifetimes.md): Keeping JS values and native objects alive correctly in Bun Rust — Strong/StrongOptional/Weak/JsRef, refcount types (RefPtr, CellRefCounted, ThreadSafeRefCount), BackRef/JsCell/ThisPtr, JSC GC rules (write barriers, extra memory, pending activity), threading affinity
- [bun-core-idioms](references/bun-core-idioms.md): Zig→Rust port heritage and house idioms in Bun's Rust code — naming, Zig-to-Rust mappings, unsafe/SAFETY discipline, error propagation, review rules from REVIEW.md and src/CLAUDE.md, common traits/macros
- [bun-core-jsc-rust-api](references/bun-core-jsc-rust-api.md): bun_jsc Rust API for touching JavaScriptCore — JSValue, JSGlobalObject, CallFrame, JsResult/JsError, host_fn adapters & ABI, exception scopes, cpp.rs ZIG_EXPORT bindings, ErrorCode/$ERR_* pipeline
- [bun-core-strings-fmt-output](references/bun-core-strings-fmt-output.md): bun_core String/ZStr/Utf8Bytes ownership rules, strings SIMD helpers, fmt helpers, scoped debug logging (declare_scope!/scoped_log!), pretty output macros, env_var and feature flags
- [bun-core-sys-syscalls](references/bun-core-sys-syscalls.md): bun_sys syscall layer (Maybe<T>, sys::Error/Tag, Fd encoding, File RAII, FdExt, platform modules), bun_alloc allocators/arenas, and sys_jsc conversion traits
- [bun-toolchain-bake](references/bun-toolchain-bake.md): Bake (src/runtime/bake) - DevServer for Bun.serve HTML routes/app, IncrementalGraph HMR, HMR websocket protocol, framework API, FrameworkRouter, bun build --app production, client/server HMR runtimes
- [bun-toolchain-bundler](references/bun-toolchain-bundler.md): Bun bundler (src/bundler) - BundleV2 scan/parse phase, LinkerContext link pipeline (esbuild linker.go port), tree shaking, chunking, codegen, plugins, loaders, HTML/CSS, bytecode, Bun.build and --compile
- [bun-toolchain-check-sema](references/bun-toolchain-check-sema.md): bun check / --check type checker - crate bun_sema (typescript-go port in src/sema), driver, standalone bun-sema CLI, baselines, parser SEMA mode (js_parser/sema), CLI check_command.rs, tests test/cli/check
- [bun-toolchain-css-parsers](references/bun-toolchain-css-parsers.md): Bun CSS crate (Lightning CSS port), data-format parsers (src/parsers - SIMD JSON/JSONC, JSON5, TOML, YAML, XML), markdown (src/md), and Bun.FileSystemRouter (src/router)
- [bun-toolchain-parser](references/bun-toolchain-parser.md): Bun JS/TS parser (src/js_parser) — lexer, P struct, parse/visit passes, TS/JSX, macros, lowering, React Refresh/Compiler hooks, sema mode; esbuild js_parser.go heritage
- [bun-toolchain-printer-ast](references/bun-toolchain-printer-ast.md): Bun AST crate (src/ast: Ref packing, Expr/Stmt, Part, Ast, Loader/Target), js_printer + renamer/minifier, and sourcemap crates (VLQ, InternalSourceMap)
- [bun-toolchain-transpiler-resolver](references/bun-toolchain-transpiler-resolver.md): Bun Transpiler struct (runtime single-file transpile path, RuntimeTranspilerCache, Bun.Transpiler) and the module resolver (src/resolver - node_modules, exports/imports, tsconfig paths, browser map, DirInfo caches)
