# Bun Knowledge Brain Index

- Source revision: `4407879a5`
- Corpus: 1755 MDX docs (341 nav pages), 28 `bun-types` declaration files, 9 repo dev skills, 140 migration rules (12.17 MiB raw).

## Brain Files

| File | Contents |
| :--- | :--- |
| `INDEX.md` | Sitemap from `docs.json`, CLI quick reference, topic router |
| `RUNTIME_APIS.md` | `Bun.*` global APIs + signatures, `bun:*` built-in modules, Web/Node globals, `node:*` compat matrix |
| `TYPES_DIGEST.md` | Compressed TypeScript declarations from all `packages/bun-types/*.d.ts` + `ts7.1/` |
| `CLI_TOOLING.md` | `run`, `test`, `build`, `compile`, `install`/`pm`, `check`, `lint`, `fmt`, `migrate` + `bunfig.toml` |
| `GUIDES_SKILLS_DIGEST.md` | Mintlify guides summary + upstream runtime dev skills (`verify`, bundler/HMR tests, JSC, `bun_sys`) |
| `LEGACY_REPLACEMENT.md` | Legacy JS/TS/npm/CI/Docker/Rust replacement matrix from `src/migrate/registry/*.toml` + `replace_packages.rs` |

## Quick CLI & API Lookup

| Task / Domain | Canonical Bun Command / API | Brain File |
| :--- | :--- | :--- |
| Run TS/JS / scripts | `bun run`, `bun --watch`, `bun --hot`, `bun --check` | `CLI_TOOLING.md` |
| Type check (TS 7) | `bun check` (`--no-script`, `-p`, `-b`, `--aot`) | `CLI_TOOLING.md` |
| Lint / Format | `bun lint` (`--fix`, `--type-aware`), `bun fmt` (`--check`) | `CLI_TOOLING.md` |
| Test runner | `bun test`, `import { test, expect, mock } from "bun:test"` | `CLI_TOOLING.md`, `RUNTIME_APIS.md` |
| Bundle / Compile | `bun build`, `Bun.build()`, `bun build --compile`, `bun compile` | `CLI_TOOLING.md` |
| Package manager | `bun install`, `bun add`, `bun remove`, `bunx`, `bun pm` | `CLI_TOOLING.md` |
| Node migration | `bun migrate` (`--write`, `--aggressive`, `--replace-packages`, `--target rust`), `bun pm migrate` | `LEGACY_REPLACEMENT.md`, `CLI_TOOLING.md` |
| HTTP / WebSocket | `Bun.serve({ routes, fetch, websocket })` | `RUNTIME_APIS.md` |
| File I/O / Glob | `Bun.file()`, `Bun.write()`, `new Bun.Glob()` | `RUNTIME_APIS.md` |
| Shell / Subprocess | ``Bun.$`...` ``, `Bun.spawn()`, `Bun.spawnSync()` | `RUNTIME_APIS.md` |
| SQL / SQLite / Redis / S3 | `bun:sqlite`, `Bun.sql`/`Bun.SQL`, `Bun.redis`/`Bun.RedisClient`, `Bun.s3`/`Bun.S3Client` | `RUNTIME_APIS.md`, `TYPES_DIGEST.md` |
| Hashing / Crypto / Passwords | `Bun.password`, `Bun.hash`, `Bun.CryptoHasher`, `Bun.CSRF` | `RUNTIME_APIS.md` |
| Parsers / Text / Binary | `Bun.YAML`, `Bun.TOML`, `Bun.JSON5`, `Bun.JSONC`, `Bun.JSONL`, `Bun.XML`, `Bun.markdown`, `HTMLRewriter` | `RUNTIME_APIS.md` |
| FFI / Workers / WebView | `bun:ffi`, `new Worker()`, `Bun.WebView`, `Bun.Archive`, `Bun.cron` | `RUNTIME_APIS.md`, `TYPES_DIGEST.md` |

## Docs Sitemap (`docs/docs.json`)

### Runtime
#### Get Started
- `index` — **Welcome to Bun**: Bun is an all-in-one toolkit for developing modern JavaScript/TypeScript applications.
- `installation` — **Installation**: Install Bun with npm, Homebrew, Docker, or the official script.
- `quickstart` — **Quickstart**: Build your first app with Bun
- `typescript` — **TypeScript**: Using TypeScript with Bun, including type definitions and compiler options
- `typescript-6` — **TypeScript 6 and 7**: How to configure Bun's type definitions for TypeScript 6.0 and 7.0, which no longer auto-discover @types packages. Fix 'Cannot find name Bun' and other missing type errors after upgrading TypeScript.
- `runtime/templating/init` — **bun init**: Scaffold an empty Bun project with the interactive `bun init` command
- `runtime/templating/create` — **bun create**: Create a new Bun project from a React component, a `create-<template>` npm package, a GitHub repo, or a local template
#### Core Runtime
- `runtime/index` — **Bun Runtime**: Execute JavaScript/TypeScript files, package.json scripts, and executable packages with Bun's fast runtime.
- `runtime/watch-mode` — **Watch Mode**: Automatic reloading in Bun with --watch and --hot modes
- `runtime/check` — **Type checking**: Type check your TypeScript project with bun check
- `runtime/debugger` — **Debugging**: Debug your Bun code with an interactive debugger using WebKit Inspector Protocol
- `runtime/repl` — **REPL**: An interactive JavaScript and TypeScript REPL with syntax highlighting, history, and tab completion
- `runtime/bunfig` — **bunfig.toml**: Configure Bun's behavior using its configuration file bunfig.toml
- `runtime/code-generation-from-strings` — **Code generation from strings**: Make eval(), new Function() and every other way a string becomes code throw, for the whole process, with --disallow-code-generation-from-strings.
#### File & Module System
- `runtime/file-types` — **File Types**: File types and loaders supported by Bun's bundler and runtime
- `runtime/module-resolution` — **Module Resolution**: How Bun resolves modules and handles imports in JavaScript and TypeScript
- `runtime/jsx` — **JSX**: Built-in JSX and TSX support in Bun with configurable transpilation options
- `runtime/auto-install` — **Auto-install**: Bun's automatic package installation feature for standalone script execution
- `runtime/plugins` — **Plugins**: Universal plugin API for extending Bun's runtime and bundler
- `runtime/file-system-router` — **File System Router**: Bun provides a fast API for resolving routes against file-system paths
#### HTTP server
- `runtime/http/server` — **Server**: Use `Bun.serve` to start a high-performance HTTP server in Bun
- `runtime/http/routing` — **Routing**: Define routes in `Bun.serve` using static paths, parameters, and wildcards
- `runtime/http/cookies` — **Cookies**: Work with cookies in HTTP requests and responses using Bun's built-in Cookie API.
- `runtime/http/tls` — **TLS**: Enable TLS in Bun.serve
- `runtime/http/error-handling` — **Error Handling**: Learn how to handle errors in Bun's development server
- `runtime/http/metrics` — **Metrics**: Monitor server activity with built-in metrics
#### Networking
- `runtime/networking/fetch` — **Fetch**: Send HTTP requests with Bun's fetch API
- `runtime/http/websockets` — **WebSockets**: Server-side WebSockets in Bun
- `runtime/networking/tcp` — **TCP**: Use Bun's native TCP API to implement performance-sensitive systems like database clients, game servers, or anything that needs to communicate over TCP (instead of HTTP)
- `runtime/networking/udp` — **UDP**: Use Bun's UDP API to implement services with advanced real-time requirements, such as voice chat.
- `runtime/networking/dns` — **DNS**: Use Bun's DNS module to resolve DNS records
#### Data & Storage
- `runtime/cookies` — **Cookies**: Use Bun's native APIs for working with HTTP cookies
- `runtime/file-io` — **File I/O**: Bun provides a set of optimized APIs for reading and writing files.
- `runtime/streams` — **Streams**: Use Bun's streams API to work with binary data without loading it all into memory at once
- `runtime/binary-data` — **Binary Data**: Working with binary data in JavaScript
- `runtime/archive` — **Archive**: Create and extract tar archives with Bun's fast native implementation
- `runtime/sql` — **SQL**: Bun provides native bindings for working with SQL databases through a unified Promise-based API that supports PostgreSQL, MySQL, MariaDB, and SQLite.
- `runtime/sqlite` — **SQLite**: Bun natively implements a high-performance SQLite3 driver.
- `runtime/s3` — **S3**: Bun provides fast, native bindings for interacting with S3-compatible object storage services.
- `runtime/redis` — **Redis**: Use Bun's native Redis client with a Promise-based API
#### Concurrency
- `runtime/workers` — **Workers**: Use Bun's Workers API to create and communicate with a new JavaScript instance running on a separate thread while sharing I/O resources with the main thread
- `runtime/module-graph` — **ModuleGraph**: Run many instances of one app in a single process with Bun.ModuleGraph. Each instance gets fresh module state and its own timers and I/O; compiled code is shared.
#### Process & System
- `runtime/environment-variables` — **Environment Variables**: Read and configure environment variables in Bun, including automatic .env file support
- `runtime/shell` — **Shell**: Use Bun's shell scripting API to run shell commands from JavaScript
- `runtime/child-process` — **Spawn**: Spawn child processes with `Bun.spawn` or `Bun.spawnSync`
- `runtime/webview` — **WebView**: Control a headless browser from Bun for automation, testing, and scraping — zero dependencies on macOS, Chrome DevTools Protocol everywhere else
- `runtime/cron` — **Cron**: Schedule and parse cron jobs with Bun
#### Interop & Tooling
- `runtime/node-api` — **Node-API**: Use Bun's Node-API module to build native add-ons to Node.js
- `runtime/ffi` — **FFI**: Use Bun's FFI module to efficiently call native libraries from JavaScript
- `runtime/c-compiler` — **C Compiler**: Compile and run C from JavaScript with low overhead
- `runtime/transpiler` — **Transpiler**: Use Bun's transpiler to transpile JavaScript and TypeScript code
#### Utilities
- `runtime/csrf` — **CSRF Protection**: Generate and verify CSRF tokens with Bun's built-in API
- `runtime/secrets` — **Secrets**: Use Bun's Secrets API to store and retrieve sensitive credentials securely
- `runtime/console` — **Console**: The console object in Bun
- `runtime/toml` — **TOML**: Use Bun's built-in support for TOML files through both runtime APIs and bundler integration
- `runtime/yaml` — **YAML**: Use Bun's built-in support for YAML files through both runtime APIs and bundler integration
- `runtime/markdown` — **Markdown**: Parse and render Markdown with Bun's built-in Markdown API, supporting GFM extensions and custom rendering callbacks
- `runtime/json5` — **JSON5**: Use Bun's built-in support for JSON5 files through both runtime APIs and bundler integration
- `runtime/xml` — **XML**: Use Bun's built-in support for XML through both runtime APIs and bundler integration
- `runtime/jsonl` — **JSONL**: Parse newline-delimited JSON (JSONL) with Bun's built-in streaming parser
- `runtime/html-rewriter` — **HTMLRewriter**: Use Bun's HTMLRewriter to transform HTML documents with CSS selectors
- `runtime/image` — **Image**: Decode, transform, and encode images with a fast native pipeline
- `runtime/hashing` — **Hashing**: Utility functions for hashing and verifying passwords with various cryptographically secure algorithms
- `runtime/glob` — **Glob**: Use Bun's fast native implementation of file globbing
- `runtime/semver` — **Semver**: Use Bun's semantic versioning API
- `runtime/color` — **Color**: Format colors as CSS, ANSI, numbers, hex strings, and more
- `runtime/utils` — **Utils**: Use Bun's utility functions to work with the runtime
#### Standards & Compatibility
- `runtime/globals` — **Globals**: Use Bun's global objects
- `runtime/bun-apis` — **Bun APIs**: Overview of Bun's native APIs available on the Bun global object and built-in modules
- `runtime/web-apis` — **Web APIs**: Web-standard APIs supported by Bun for server-side JavaScript
- `runtime/nodejs-compat` — **Node.js Compatibility**: Bun's compatibility status with Node.js APIs, modules, and globals
#### Contributing
- `project/roadmap` — **Roadmap**: Bun's roadmap and long-term plans
- `project/benchmarking` — **Benchmarking**: How to benchmark Bun
- `project/contributing` — **Contributing**: Contributing to Bun
- `project/building-windows` — **Building Windows**: Building Bun on Windows
- `project/bindgen` — **Bindgen**: Bindgen for Bun
- `project/license` — **License**: License for Bun

### Package Manager
#### Core Commands
- `pm/cli/install` — **bun install**: Install packages with Bun's fast package manager
- `pm/cli/add` — **bun add**: Add packages to your project with Bun's fast package manager
- `pm/cli/remove` — **bun remove**: Remove dependencies from your project
- `pm/cli/update` — **bun update**: Update dependencies to the newest versions their ranges allow
- `pm/cli/dedupe` — **bun dedupe**: Remove duplicate versions of packages from bun.lock
- `pm/cli/prune` — **bun prune**: Remove packages that are not in bun.lock from node_modules
- `pm/bunx` — **bunx**: Run packages from npm
#### Publishing & Analysis
- `pm/cli/publish` — **bun publish**: Use `bun publish` to publish a package to the npm registry
- `pm/cli/outdated` — **bun outdated**: Check for outdated dependencies
- `pm/cli/why` — **bun why**: Explain why a package is installed
- `pm/cli/migrate` — **bun migrate**: Report what a Node.js repository needs to run on Bun, and rewrite what can be rewritten
- `pm/cli/audit` — **bun audit**: Check your installed packages for known security vulnerabilities
- `pm/cli/info` — **bun info**: Display package metadata from the npm registry
#### Workspace Management
- `pm/workspaces` — **Workspaces**: Develop complex monorepos with multiple independent packages
- `pm/catalogs` — **Catalogs**: Share common dependency versions across multiple packages in a monorepo
- `pm/cli/link` — **bun link**: Link local packages for development
- `pm/cli/pm` — **bun pm**: Package manager utilities
#### Advanced Configuration
- `pm/cli/patch` — **bun patch**: Persistently patch node_modules packages in a git-friendly way
- `pm/filter` — **bun --filter**: Select packages by pattern in a monorepo using the --filter flag
- `pm/global-cache` — **Global cache**: How Bun stores and manages packages in its global cache
- `pm/global-store` — **Global virtual store**: Install packages once. Every project links to the same copy.
- `pm/isolated-installs` — **Isolated installs**: Strict dependency isolation similar to pnpm's approach
- `pm/lockfile` — **Lockfile**: Bun's lockfile format and configuration
- `pm/lifecycle` — **Lifecycle scripts**: How Bun handles package lifecycle scripts securely
- `pm/scopes-registries` — **Scopes and registries**: Configure private registries and scoped packages
- `pm/overrides` — **Overrides and resolutions**: Control metadependency versions with npm overrides and Yarn resolutions
- `pm/package-extensions` — **Package extensions**: Add missing dependencies and peerDependencies to third-party packages with packageExtensions
- `pm/security-scanner-api` — **Security Scanner API**
- `pm/npmrc` — **.npmrc support**

### Bundler
#### Core
- `bundler/index` — **Bundler**: Bun's fast native bundler for JavaScript, TypeScript, JSX, and more
#### Development Server
- `bundler/fullstack` — **Fullstack dev server**: Build fullstack applications with Bun's integrated dev server that bundles frontend assets and handles API routes
- `bundler/hot-reloading` — **Hot reloading**: Hot Module Replacement (HMR) for Bun's development server
#### Asset Processing
- `bundler/html-static` — **HTML & static sites**: Build static sites, landing pages, and web applications with Bun's bundler
- `bundler/standalone-html` — **Standalone HTML**: Bundle a single-page app into a single self-contained .html file with no external dependencies
- `bundler/css` — **CSS**: Bun's bundler has built-in support for CSS with modern features
- `bundler/loaders` — **Loaders**: Built-in loaders for the Bun bundler and runtime
#### Extensions
- `bundler/plugins` — **Plugins**: Universal plugin API for extending Bun's runtime and bundler
- `bundler/macros` — **Macros**: Run JavaScript functions at bundle-time with Bun macros
#### Optimization
- `bundler/minifier` — **minifier**: Reduce bundle sizes with Bun's JavaScript and TypeScript minifier
#### Migration
- `bundler/esbuild` — **esbuild**: Migration guide from esbuild to Bun's bundler

### Compiler
#### Getting Started
- `compiler/index` — **Compiler**: Turn a TypeScript or JavaScript program into one executable file
#### Single File Executable
- `compiler/executables` — **Single-file executable**: Generate standalone executables from TypeScript or JavaScript files with Bun
- `compiler/bytecode` — **Bytecode Caching**: Speed up JavaScript execution with bytecode caching in Bun's bundler
#### Ahead-of-Time Compilation
- `compiler/aot` — **Ahead-of-time compilation**: Compile TypeScript and JavaScript to machine code at 