---
name: bun-docs
description: "Find the right page of the Aphrody runtime's documentation (docs/, 406 pages: runtime, bundler, package manager, test runner, guides, project) and the packages in packages/."
---

# The documentation of the Aphrody runtime

`docs/docs.json` is the navigation; each page is `docs/<path>.mdx`.

## Get Started

- `docs/index.mdx`: Welcome to Bun (Bun is an all-in-one toolkit for developing modern JavaScript/TypeScript applications.)
- `docs/installation.mdx`: Installation (Install the Aphrody runtime with the install script, npm, or a release archive.)
- `docs/quickstart.mdx`: Quickstart (Build your first app with Bun)
- `docs/typescript.mdx`: TypeScript (Using TypeScript with Bun, including type definitions and compiler options)
- `docs/typescript-6.mdx`: TypeScript 6 and 7 (How to configure Bun's type definitions for TypeScript 6.0 and 7.0, which no longer auto-discover @types packages. Fix 'Cannot find name Bun' and other missing type errors after upgrading TypeScript.)
- `docs/runtime/templating/init.mdx`: bun init (Scaffold an empty Bun project with the interactive `bun init` command)
- `docs/runtime/templating/create.mdx`: bun create (Create a new Bun project from a React component, a `create-<template>` npm package, a GitHub repo, or a local template)

## Core Runtime

- `docs/runtime/index.mdx`: Bun Runtime (Execute JavaScript/TypeScript files, package.json scripts, and executable packages with Bun's fast runtime.)
- `docs/runtime/watch-mode.mdx`: Watch Mode (Automatic reloading in Bun with --watch and --hot modes)
- `docs/runtime/check.mdx`: Type checking (Type check your TypeScript project with bun check)
- `docs/runtime/lint.mdx`: Linting (Lint JavaScript and TypeScript with Bun's embedded oxlint engine)
- `docs/runtime/fmt.mdx`: Formatting (Format source with Bun's embedded native OXC core)
- `docs/runtime/lsp.mdx`: Language server (One language server for TypeScript, JavaScript, Python, Rust, C, C++ and C# with bun lsp)
- `docs/runtime/n2b.mdx`: Migrate from Node.js (Find and rewrite Node.js APIs that have a Bun equivalent with bun n2b, and migrate a project with bun migrate)
- `docs/runtime/just.mdx`: Recipes with bun just (Run justfile recipes with Bun's embedded task runner.)
- `docs/runtime/mcp.mdx`: MCP server (bun mcp is a Model Context Protocol server built into Bun, for coding agents)
- `docs/runtime/host.mdx`: Host inventory (Collect the CPU, RAM, GPU, disks, kernel and OS of a machine, and share them between machines with bun host)
- `docs/runtime/debugger.mdx`: Debugging (Debug your Bun code with an interactive debugger using WebKit Inspector Protocol)
- `docs/runtime/repl.mdx`: REPL (An interactive JavaScript and TypeScript REPL with syntax highlighting, history, and tab completion)
- `docs/runtime/bunfig.mdx`: bunfig.toml (Configure Bun's behavior using its configuration file bunfig.toml)
- `docs/runtime/code-generation-from-strings.mdx`: Code generation from strings (Make eval(), new Function() and every other way a string becomes code throw, for the whole process, with --disallow-code-generation-from-strings.)

## File & Module System

- `docs/runtime/file-types.mdx`: File Types (File types and loaders supported by Bun's bundler and runtime)
- `docs/runtime/module-resolution.mdx`: Module Resolution (How Bun resolves modules and handles imports in JavaScript and TypeScript)
- `docs/runtime/jsx.mdx`: JSX (Built-in JSX and TSX support in Bun with configurable transpilation options)
- `docs/runtime/auto-install.mdx`: Auto-install (Bun's automatic package installation feature for standalone script execution)
- `docs/runtime/plugins.mdx`: Plugins (Universal plugin API for extending Bun's runtime and bundler)
- `docs/runtime/file-system-router.mdx`: File System Router (Bun provides a fast API for resolving routes against file-system paths)

## HTTP server

- `docs/runtime/http/server.mdx`: Server (Use `Bun.serve` to start a high-performance HTTP server in Bun)
- `docs/runtime/http/routing.mdx`: Routing (Define routes in `Bun.serve` using static paths, parameters, and wildcards)
- `docs/runtime/http/cookies.mdx`: Cookies (Work with cookies in HTTP requests and responses using Bun's built-in Cookie API.)
- `docs/runtime/http/tls.mdx`: TLS (Enable TLS in Bun.serve)
- `docs/runtime/http/error-handling.mdx`: Error Handling (Learn how to handle errors in Bun's development server)
- `docs/runtime/http/metrics.mdx`: Metrics (Monitor server activity with built-in metrics)

## Networking

- `docs/runtime/networking/fetch.mdx`: Fetch (Send HTTP requests with Bun's fetch API)
- `docs/runtime/http/websockets.mdx`: WebSockets (Server-side WebSockets in Bun)
- `docs/runtime/networking/tcp.mdx`: TCP (Use Bun's native TCP API to implement performance-sensitive systems like database clients, game servers, or anything that needs to communicate over TCP (instead of HTTP))
- `docs/runtime/networking/udp.mdx`: UDP (Use Bun's UDP API to implement services with advanced real-time requirements, such as voice chat.)
- `docs/runtime/networking/dns.mdx`: DNS (Use Bun's DNS module to resolve DNS records)

## VPN

- `docs/vpn/index.mdx`: Native VPN (Use Bun's embedded Mullvad daemon and native VPN management client)

## Data & Storage

- `docs/runtime/cookies.mdx`: Cookies (Use Bun's native APIs for working with HTTP cookies)
- `docs/runtime/file-io.mdx`: File I/O (Bun provides a set of optimized APIs for reading and writing files.)
- `docs/runtime/streams.mdx`: Streams (Use Bun's streams API to work with binary data without loading it all into memory at once)
- `docs/runtime/binary-data.mdx`: Binary Data (Working with binary data in JavaScript)
- `docs/runtime/archive.mdx`: Archive (Create and extract tar and zip archives with Bun's fast native implementation)
- `docs/runtime/sql.mdx`: SQL (Bun provides native bindings for working with SQL databases through a unified Promise-based API that supports PostgreSQL, MySQL, and SQLite.)
- `docs/runtime/sqlite.mdx`: SQLite (Bun natively implements a high-performance SQLite3 driver.)
- `docs/runtime/s3.mdx`: S3 (Bun provides fast, native bindings for interacting with S3-compatible object storage services.)
- `docs/runtime/redis.mdx`: Redis (Use Bun's native Redis client with a Promise-based API)

## Concurrency

- `docs/runtime/workers.mdx`: Workers (Use Bun's Workers API to create and communicate with a new JavaScript instance running on a separate thread while sharing I/O resources with the main thread)
- `docs/runtime/module-graph.mdx`: ModuleGraph (Run many instances of one app in a single process with Bun.ModuleGraph. Each instance gets fresh module state and its own timers and I/O; compiled code is shared.)
- `docs/runtime/graph.mdx`: Native code graph (Extract source graphs and export scoped snapshot evidence)

## Process & System

- `docs/runtime/environment-variables.mdx`: Environment Variables (Read and configure environment variables in Bun, including automatic .env file support)
- `docs/runtime/shell.mdx`: Shell (Use Bun's shell scripting API to run shell commands from JavaScript)
- `docs/runtime/buv.mdx`: /runtime/buv (Native JavaScriptCore and UV runtime with the PyJS language surface)
- `docs/runtime/python.mdx`: Python (Run Python files and the python CLI through a CPython host, embed CPython in the JavaScript process with bun:python, and compile Python with bun compile)
- `docs/runtime/cuda-torch.mdx`: PyTorch CUDA (Install PyTorch with the CUDA build matching the NVIDIA driver in a uv virtual environment and check it from bun python)
- `docs/runtime/terminal.mdx`: Terminal APIs (Run interactive processes with Bun.Terminal or parse terminal output with Bun's headless terminal screens.)
- `docs/runtime/child-process.mdx`: Spawn (Spawn child processes with `Bun.spawn` or `Bun.spawnSync`)
- `docs/runtime/webview.mdx`: WebView (Control a headless browser from Bun for automation, testing, and scraping — zero dependencies on macOS, Chrome DevTools Protocol everywhere else)
- `docs/runtime/cron.mdx`: Cron (Schedule and parse cron jobs with Bun)

## Interop & Tooling

- `docs/runtime/node-api.mdx`: Node-API (Use Bun's Node-API module to build native add-ons to Node.js)
- `docs/runtime/ffi.mdx`: FFI (Use Bun's FFI module to efficiently call native libraries from JavaScript)
- `docs/runtime/linux.mdx`: Linux (Call Linux kernel interfaces directly from JavaScript with bun:linux)
- `docs/runtime/windows.mdx`: Windows (Call Windows interfaces directly from JavaScript with bun:windows)
- `docs/runtime/winrt.mdx`: Windows Runtime (Call Windows Runtime (WinRT) APIs from Bun with bun:winrt, with namespaces projected on demand and async operations as Promises)
- `docs/runtime/winui.mdx`: WinUI 3 (Open native WinUI 3 windows from Bun with bun:winui, load XAML, handle control events on the JS thread, and theme them with Fluent 2 tokens)
- `docs/runtime/msvc.mdx`: MSVC & Windows metadata (Resolve, set up and cache Visual Studio, MSVC and the Windows SDK without vswhere or vcvarsall, cross-compile for Windows from Linux and macOS, and generate Rust or bun:ffi bindings from .winmd metadata)
- `docs/runtime/dotnet.mdx`: .NET (Run the .NET SDK inside Bun, install and resolve .NET without scripts, run C# files, and call .NET assemblies from JavaScript with bun:dotnet)
- `docs/aphrody/iecode-runtime-capabilities.mdx`: Bun fork capabilities in IECODE (Export every registered Bun module, scoped package and native library owner, then qualify the shared NIE, .NET and Inagle consumers.)
- `docs/runtime/cosmic.mdx`: COSMIC (Use the COSMIC desktop from JavaScript with bun:cosmic)
- `docs/runtime/c-compiler.mdx`: C Compiler (Compile and run C from JavaScript with low overhead)
- `docs/runtime/transpiler.mdx`: Transpiler (Use Bun's transpiler to transpile JavaScript and TypeScript code)

## Utilities

- `docs/runtime/csrf.mdx`: CSRF Protection (Generate and verify CSRF tokens with Bun's built-in API)
- `docs/runtime/secrets.mdx`: Secrets (Use Bun's Secrets API to store and retrieve sensitive credentials securely)
- `docs/runtime/console.mdx`: Console (The console object in Bun)
- `docs/runtime/toml.mdx`: TOML (Use Bun's built-in support for TOML files through both runtime APIs and bundler integration)
- `docs/runtime/yaml.mdx`: YAML (Use Bun's built-in support for YAML files through both runtime APIs and bundler integration)
- `docs/runtime/markdown.mdx`: Markdown (Parse and render Markdown with Bun's built-in Markdown API, supporting GFM extensions and custom rendering callbacks)
- `docs/runtime/json5.mdx`: JSON5 (Use Bun's built-in support for JSON5 files through both runtime APIs and bundler integration)
- `docs/runtime/xml.mdx`: XML (Use Bun's built-in support for XML through both runtime APIs and bundler integration)
- `docs/runtime/jsonl.mdx`: JSONL (Parse newline-delimited JSON (JSONL) with Bun's built-in streaming parser)
- `docs/runtime/html-rewriter.mdx`: HTMLRewriter (Use Bun's HTMLRewriter to transform HTML documents with CSS selectors)
- `docs/runtime/readability.mdx`: Readability (Extract the main article of an HTML page and read attributes with CSS selectors)
- `docs/runtime/image.mdx`: Image (Decode, transform, and encode images with a fast native pipeline)
- `docs/runtime/video.mdx`: Bun.Video (Native video metadata, thumbnails, frame batches, audio, GIF and MP4 remux in TypeScript)
- `docs/runtime/yolo.mdx`: /runtime/yolo (Bun's internal typed decision capability, native Rust validation and explicit application providers)
- `docs/runtime/decisions.mdx`: /runtime/decisions (Bun's native decision validator, confidence, abstention and supervised Python bridge)
- `docs/runtime/adblock.mdx`: Adblock (Match network requests and cosmetic filters with Brave's adblock-rust engine, built into Bun.)
- `docs/runtime/nginx.mdx`: NGINX (Own a native NGINX process and its Rust module with Bun, with explicit source and ABI qualification.)
- `docs/runtime/hashing.mdx`: Hashing (Utility functions for hashing and verifying passwords with various cryptographically secure algorithms)
- `docs/runtime/privacy.mdx`: Privacy cryptography (STAR threshold aggregation, Privacy Pass tokens and OPAQUE password authentication in bun:privacy)
- `docs/runtime/glob.mdx`: Glob (Use Bun's fast native implementation of file globbing)
- `docs/runtime/semver.mdx`: Semver (Use Bun's semantic versioning API)
- `docs/runtime/color.mdx`: Color (Format colors as CSS, ANSI, numbers, hex strings, and more)
- `docs/runtime/utils.mdx`: Utils (Use Bun's utility functions to work with the runtime)
- `docs/guides/util/upgrade.mdx`: Upgrade Bun to the latest version
- `docs/guides/util/detect-bun.mdx`: Detect when code is executed with Bun
- `docs/guides/util/version.mdx`: Get the current Bun version
- `docs/guides/util/hash-a-password.mdx`: Hash a password
- `docs/guides/util/javascript-uuid.mdx`: Generate a UUID
- `docs/guides/util/base64.mdx`: Encode and decode base64 data
- `docs/guides/util/gzip.mdx`: Compress and decompress data with gzip
- `docs/guides/util/deflate.mdx`: Compress and decompress data with DEFLATE
- `docs/guides/util/escape-html.mdx`: Escape an HTML string
- `docs/guides/util/deep-equals.mdx`: Check if two objects are deeply equal
- `docs/guides/util/sleep.mdx`: Sleep for a fixed number of milliseconds
- `docs/guides/util/file-url-to-path.mdx`: Convert a file URL to an absolute path
- `docs/guides/util/path-to-file-url.mdx`: Convert an absolute path to a file URL
- `docs/guides/util/which-path-to-executable-bin.mdx`: Get the path to an executable bin file
- `docs/guides/util/import-meta-dir.mdx`: Get the directory of the current file
- `docs/guides/util/import-meta-file.mdx`: Get the file name of the current file
- `docs/guides/util/import-meta-path.mdx`: Get the absolute path of the current file
- `docs/guides/util/entrypoint.mdx`: Check if the current file is the entrypoint
- `docs/guides/util/main.mdx`: Get the absolute path to the current entrypoint
- `docs/guides/util/hash-a-password.mdx`: Hash a password
- `docs/guides/util/javascript-uuid.mdx`: Generate a UUID
- `docs/guides/util/base64.mdx`: Encode and decode base64 data
- `docs/guides/util/gzip.mdx`: Compress and decompress data with gzip
- `docs/guides/util/deflate.mdx`: Compress and decompress data with DEFLATE
- `docs/guides/util/escape-html.mdx`: Escape an HTML string
- `docs/guides/util/deep-equals.mdx`: Check if two objects are deeply equal
- `docs/guides/util/sleep.mdx`: Sleep for a fixed number of milliseconds
- `docs/guides/util/file-url-to-path.mdx`: Convert a file URL to an absolute path
- `docs/guides/util/path-to-file-url.mdx`: Convert an absolute path to a file URL
- `docs/guides/util/which-path-to-executable-bin.mdx`: Get the path to an executable bin file

## Standards & Compatibility

- `docs/runtime/globals.mdx`: Globals (Use Bun's global objects)
- `docs/runtime/bun-apis.mdx`: Bun APIs (Overview of Bun's native APIs available on the Bun global object and built-in modules)
- `docs/runtime/web-apis.mdx`: Web APIs (Web-standard APIs supported by Bun for server-side JavaScript)
- `docs/runtime/nodejs-compat.mdx`: Node.js Compatibility (Bun's compatibility status with Node.js APIs, modules, and globals)

## Contributing

- `docs/project/roadmap.mdx`: Roadmap (Bun's roadmap and long-term plans)
- `docs/project/benchmarking.mdx`: Benchmarking (How to benchmark Bun)
- `docs/project/setup.mdx`: One-command setup (Clone and build the Aphrody runtime (aphrody-labs/bun), toolchains and dependencies included, with one command)
- `docs/project/agent-tools.mdx`: Agent tools (Native tools of `bun mcp` for coding agents: digest a directory and read the installed sources and docs of a project's dependencies, offline and at their exact versions.)
- `docs/project/agent-plugin.mdx`: Agent plugin (Bun OS agent plugin for Claude Code, Codex, Gemini CLI, OpenCode and local-model harnesses, with native adapters, MCP and shared skills)
- `docs/project/native-compiler-integration.mdx`: /project/native-compiler-integration
- `docs/project/auto-deploy.mdx`: Auto-deploy et conteneur Bun (Image Docker du runtime Aphrody, sonde prod sur dbfr, file de build sur le VPS et service Windows bun-winsvc)
- `docs/project/contributing.mdx`: Contributing (Contributing to Bun)
- `docs/project/building-windows.mdx`: Building Windows (Building Bun on Windows)
- `docs/project/bindgen.mdx`: Bindgen (Bindgen for Bun)
- `docs/project/license.mdx`: License (License for Bun)

See [catalog.md](references/catalog.md) for CLI commands, bundler, test runner, ecosystem, and low-level API indexes.

## References

Read the one that matches the task (`references/<name>.md`):

- [bun-docs-bundler](references/bun-docs-bundler.md): Cheat-sheet of docs/bundler/* — Bun.build options/defaults with bun build CLI flags, outputs, errors, loaders, plugins, macros, --compile executables, bytecode, CSS/HTML/fullstack/HMR, esbuild diffs, minifier.
- [bun-docs-bunfig-env](references/bun-docs-bunfig-env.md): Every bunfig.toml key (runtime, [serve], [test], [install], [run]) with defaults.env loading order, Bun-specific env vars, and the full `bun run` flag list from docs
- [bun-docs-http-networking](references/bun-docs-http-networking.md): Cheat-sheet of Bun docs for Bun.serve (options, routes, Server methods, TLS, HTTP/2/3, errors, metrics), WebSockets, fetch extensions, DNS cache, TCP/UDP, Cookie/CookieMap, CSRF
- [bun-docs-map](references/bun-docs-map.md): Map of <bun>\docs (Mintlify site bun.com/docs) - docs.json nav tabs/groups, page locations, guides categories, install/quickstart facts, MDX conventions
- [bun-docs-pm](references/bun-docs-pm.md): Bun package manager cheat-sheet (install/add/remove/update/audit/dedupe/prune/patch/pm/publish/bunx/create/init, bunfig [install], lockfile, linkers, trust, catalogs, overrides, workspaces, --filter) verified from docs/pm, docs/runtime/templating, docs/guides/install
- [bun-docs-runtime-apis-a-m](references/bun-docs-runtime-apis-a-m.md): Dense cheat-sheet of docs/runtime/*.mdx pages archive..module-resolution (Archive, spawn, check, cron, FFI/cc, file I/O, Glob, hashing, HTMLRewriter, Image, JSON5/JSONL, markdown, ModuleGraph, resolution)
- [bun-docs-runtime-apis-n-z](references/bun-docs-runtime-apis-n-z.md): Cheat-sheet of docs/runtime N-Z (node-api, nodejs-compat, plugins, redis, repl, s3, secrets, semver, shell, sql, sqlite, streams, toml, transpiler, typescript, utils, watch-mode, web-apis, webview, workers, xml, yaml) + docs/typescript*.mdx
- [bun-docs-test](references/bun-docs-test.md): Cheat-sheet bun test (docs/test + docs/guides/test) - CLI flags/defauts, [test] bunfig, discovery, modifiers, hooks, mocks, timers, snapshots, DOM, reporters, coverage, parallel/shard, runtime
- [bun-docs-voice-contributing](references/bun-docs-voice-contributing.md): Bun docs Voice rules, docs/types review expectations, contributor build setup (Linux/macOS/Windows), debug tooling, profiling, license and security policy
- [bun-packages](references/bun-packages.md): What each <bun>\packages\* is (@aphrody/bun-types layout and type-test flow, plugins, vscode, inspector/DAP, lambda, release, native plugin API, uSockets/uWS forks, h3blast) plus completions/ and the @aphrody scope rename
