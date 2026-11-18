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
- `compiler/aot` — **Ahead-of-time compilation**: Compile TypeScript and JavaScript to machine code at build time, with bun compile
- `compiler/types` — **How bun compile uses your types**: What your TypeScript types do in a compiled program, and how to write code that compiles well
- `compiler/explain` — **Get more of your program typed**: How to read bun compile --explain, and what to change for each cause it reports
- `compiler/compatibility` — **Compatibility**: What behaves differently in an executable built with bun compile, and what to change in your program
- `compiler/debugging` — **Test and debug a compiled program**: Stack traces, source maps, crash reports and profiles of an executable, and how to run your tests compiled
- `compiler/size` — **Smaller executables**: Why an executable is as big as it is, and how to make it smaller with bun compile --trim
- `compiler/libraries` — **Libraries**: Which npm packages don't work with bun compile and what to use instead, the flags that frameworks need, and how to publish a package that keeps its types
- `compiler/troubleshooting` — **Troubleshooting**: The errors you're most likely to hit when you first build a program with bun compile, and the fix for each
#### Guides
- `guides/runtime/codesign-macos-executable` — **Codesign a single-file JavaScript executable on macOS**: Fix the "can't be opened because it is from an unidentified developer" Gatekeeper warning when running your JavaScript executable.
- `guides/runtime/build-time-constants` — **Build-time constants with --define**

### Test Runner
#### Getting Started
- `test/index` — **Test runner**: Bun's fast, built-in, Jest-compatible test runner with TypeScript support, lifecycle hooks, mocking, and watch mode
- `test/writing-tests` — **Writing tests**: Write tests with Bun's Jest-compatible API, including async tests, timeouts, and test modifiers
- `test/configuration` — **Test configuration**: Configure bun test behavior with bunfig.toml and command-line options
#### Test Execution
- `test/runtime-behavior` — **Runtime behavior**: Learn about Bun test's runtime integration, environment variables, timeouts, and error handling
- `test/discovery` — **Finding tests**: Learn how Bun's test runner discovers and filters test files in your project
- `test/parallel` — **Parallel & isolated test runs**: Run test files across CPU cores with --parallel, isolate files from each other with --isolate, run tests within a file concurrently, and split suites across CI machines with --shard and --timings
#### Test Features
- `test/lifecycle` — **Lifecycle hooks**: Learn how to use beforeAll, beforeEach, afterEach, afterAll, aroundEach, and aroundAll lifecycle hooks in Bun tests
- `test/mocks` — **Mocks**: Learn how to create and use mock functions, spies, and module mocks in Bun tests
- `test/snapshots` — **Snapshots**: Learn how to use snapshot testing in Bun to save and compare output between test runs
- `test/dates-times` — **Dates and times**: Learn how to manipulate time and dates in your Bun tests using setSystemTime and Jest compatibility functions
#### Specialized Testing
- `test/dom` — **DOM testing**: Learn how to test DOM elements and components using Bun with happy-dom and React Testing Library
#### Reporting
- `test/code-coverage` — **Code coverage**: Use Bun's built-in code coverage reporting to track test coverage and find untested code
- `test/reporters` — **Test Reporters**

### Linter
#### Getting Started
- `lint/index` — **Linter**: Bun's fast, built-in linter for JavaScript, TypeScript, and JSX
#### Rules
- `lint/rules/index` — **Lint rules**: Every rule built into bun lint
- `lint/plugins` — **ESLint plugins**: Run ESLint plugins in bun lint, and write your own rules
#### Migrate
- `guides/lint/migrate-from-eslint` — **Migrate from ESLint to bun lint**
- `guides/lint/migrate-from-oxlint` — **Migrate from oxlint to bun lint**

### Formatter
#### Getting Started
- `format/index` — **Formatter**: Bun's fast, built-in formatter for JavaScript, TypeScript, CSS, HTML, JSON, YAML, Markdown, and more
#### Migrate
- `guides/format/migrate-from-prettier` — **Migrate from Prettier to bun fmt**
- `guides/format/migrate-from-oxfmt` — **Migrate from oxfmt to bun fmt**

### Guides
#### Overview
- `guides/index` — **Guides**: Code samples and walkthroughs for common tasks with Bun
#### Deployment
- `guides/deployment/vercel` — **Deploy a Bun application on Vercel**
- `guides/deployment/railway` — **Deploy a Bun application on Railway**: Deploy a Bun application to Railway from the CLI or dashboard, with optional PostgreSQL setup and automatic SSL
- `guides/deployment/render` — **Deploy a Bun application on Render**
- `guides/deployment/aws-lambda` — **Deploy a Bun application on AWS Lambda**
- `guides/deployment/digital-ocean` — **Deploy a Bun application on DigitalOcean**
- `guides/deployment/google-cloud-run` — **Deploy a Bun application on Google Cloud Run**
#### Runtime & Debugging
- `guides/runtime/typescript` — **Install TypeScript declarations for Bun**
- `guides/runtime/tsconfig-paths` — **Re-map import paths**
- `guides/runtime/vscode-debugger` — **Debugging Bun with the VS Code extension**
- `guides/runtime/web-debugger` — **Debugging Bun with the web debugger**
- `guides/runtime/heap-snapshot` — **Inspect memory usage using V8 heap snapshots**
- `guides/runtime/build-time-constants` — **Build-time constants with --define**
- `guides/runtime/define-constant` — **Define and replace static globals & constants**
- `guides/runtime/cicd` — **Install and run Bun in GitHub Actions**
- `guides/runtime/codesign-macos-executable` — **Codesign a single-file JavaScript executable on macOS**: Fix the "can't be opened because it is from an unidentified developer" Gatekeeper warning when running your JavaScript executable.
#### Utilities
- `guides/util/upgrade` — **Upgrade Bun to the latest version**
- `guides/util/detect-bun` — **Detect when code is executed with Bun**
- `guides/util/version` — **Get the current Bun version**
- `guides/util/hash-a-password` — **Hash a password**
- `guides/util/javascript-uuid` — **Generate a UUID**
- `guides/util/base64` — **Encode and decode base64 data**
- `guides/util/gzip` — **Compress and decompress data with gzip**
- `guides/util/deflate` — **Compress and decompress data with DEFLATE**
- `guides/util/escape-html` — **Escape an HTML string**
- `guides/util/deep-equals` — **Check if two objects are deeply equal**
- `guides/util/sleep` — **Sleep for a fixed number of milliseconds**
- `guides/util/file-url-to-path` — **Convert a file URL to an absolute path**
- `guides/util/path-to-file-url` — **Convert an absolute path to a file URL**
- `guides/util/which-path-to-executable-bin` — **Get the path to an executable bin file**
- `guides/util/import-meta-dir` — **Get the directory of the current file**
- `guides/util/import-meta-file` — **Get the file name of the current file**
- `guides/util/import-meta-path` — **Get the absolute path of the current file**
- `guides/util/entrypoint` — **Check if the current file is the entrypoint**
- `guides/util/main` — **Get the absolute path to the current entrypoint**
#### Ecosystem & Frameworks
- `guides/ecosystem/astro` — **Build an app with Astro and Bun**
- `guides/ecosystem/discordjs` — **Create a Discord bot**
- `guides/ecosystem/docker` — **Containerize a Bun application with Docker**
- `guides/ecosystem/drizzle` — **Use Drizzle ORM with Bun**
- `guides/ecosystem/gel` — **Use Gel with Bun**
- `guides/ecosystem/elysia` — **Build an HTTP server using Elysia and Bun**
- `guides/ecosystem/express` — **Build an HTTP server using Express and Bun**
- `guides/ecosystem/hono` — **Build an HTTP server using Hono and Bun**
- `guides/ecosystem/mongoose` — **Read and write data to MongoDB using Mongoose and Bun**
- `guides/ecosystem/neon-drizzle` — **Use Neon Postgres through Drizzle ORM**
- `guides/ecosystem/neon-serverless-postgres` — **Use Neon's Serverless Postgres with Bun**
- `guides/ecosystem/nextjs` — **Build an app with Next.js and Bun**
- `guides/ecosystem/nuxt` — **Build an app with Nuxt and Bun**
- `guides/ecosystem/pm2` — **Run Bun as a daemon with PM2**
- `guides/ecosystem/prisma` — **Use Prisma with Bun**
- `guides/ecosystem/prisma-postgres` — **Use Prisma Postgres with Bun**
- `guides/ecosystem/qwik` — **Build an app with Qwik and Bun**
- `guides/ecosystem/react` — **Build a React app with Bun**
- `guides/ecosystem/remix` — **Build an app with Remix and Bun**
- `guides/ecosystem/tanstack-start` — **Use TanStack Start with Bun**
- `guides/ecosystem/sentry` — **Add Sentry to a Bun app**
- `guides/ecosystem/solidstart` — **Build an app with SolidStart and Bun**
- `guides/ecosystem/ssr-react` — **Server-side render (SSR) a React component**
- `guides/ecosystem/sveltekit` — **Build an app with SvelteKit and Bun**
- `guides/ecosystem/systemd` — **Run Bun as a daemon with systemd**
- `guides/ecosystem/vite` — **Build a frontend using Vite and Bun**
- `guides/ecosystem/upstash` — **Bun Redis with Upstash**
#### HTTP & Networking
- `guides/http/server` — **Common HTTP server usage**
- `guides/http/simple` — **Write a simple HTTP server**
- `guides/http/fetch` — **Send an HTTP request using fetch**
- `guides/http/hot` — **Hot reload an HTTP server**
- `guides/http/cluster` — **Start a cluster of HTTP servers**: Run multiple HTTP servers concurrently with the "reusePort" option to share the same port across multiple processes
- `guides/http/tls` — **Configure TLS on an HTTP server**
- `guides/http/proxy` — **Proxy HTTP requests using fetch()**
- `guides/http/stream-file` — **Stream a file as an HTTP Response**
- `guides/http/file-uploads` — **Upload files via HTTP using FormData**
- `guides/http/fetch-unix` — **fetch with unix domain sockets in Bun**
- `guides/http/stream-iterator` — **Streaming HTTP Server with Async Iterators**
- `guides/http/sse` — **Server-Sent Events (SSE) with Bun**
- `guides/http/stream-node-streams-in-bun` — **Streaming HTTP Server with Node.js Streams**
#### WebSocket
- `guides/websocket/simple` — **Build a simple WebSocket server**
- `guides/websocket/pubsub` — **Build a publish-subscribe WebSocket server**
- `guides/websocket/context` — **Set per-socket contextual data on a WebSocket**
- `guides/websocket/compression` — **Enable compression for WebSocket messages**
#### Processes & System
- `guides/process/spawn` — **Spawn a child process**
- `guides/process/spawn-stdout` — **Read stdout from a child process**
- `guides/process/spawn-stderr` — **Read stderr from a child process**
- `guides/process/argv` — **Parse command-line arguments**
- `guides/process/stdin` — **Read from stdin**
- `guides/process/ipc` — **Spawn a child process and communicate using IPC**
- `guides/process/ctrl-c` — **Listen for CTRL+C**
- `guides/process/os-signals` — **Listen to OS signals**
- `guides/process/nanoseconds` — **Get the process uptime in nanoseconds**
- `guides/runtime/shell` — **Run a Shell Command**
- `guides/runtime/timezone` — **Set a time zone in Bun**
- `guides/runtime/set-env` — **Set environment variables**
- `guides/runtime/read-env` — **Read environment variables**
#### Package Manager
- `guides/install/add` — **Add a dependency**
- `guides/install/add-dev` — **Add a development dependency**
- `guides/install/add-optional` — **Add an optional dependency**
- `guides/install/add-peer` — **Add a peer dependency**
- `guides/install/add-git` — **Add a Git dependency**
- `guides/install/add-tarball` — **Add a tarball dependency**
- `guides/install/npm-alias` — **Install a package under a different name**
- `guides/install/workspaces` — **Configuring a monorepo using workspaces**
- `guides/install/custom-registry` — **Override the default npm registry for bun install**
- `guides/install/registry-scope` — **Configure a private registry for an organization scope with bun install**
- `guides/install/azure-artifacts` — **Using bun install with an Azure Artifacts npm registry**
- `guides/install/jfrog-artifactory` — **Using bun install with Artifactory**
- `guides/install/trusted` — **Add a trusted dependency**
- `guides/install/yarnlock` — **Generate a yarn-compatible lockfile**
- `guides/install/from-npm-install-to-bun-install` — **Migrate from npm install to bun install**
- `guides/install/git-diff-bun-lockfile` — **Configure git to diff Bun's lockb lockfile**
- `guides/install/cicd` — **Install dependencies with Bun in GitHub Actions**
#### Test Runner
- `guides/test/run-tests` — **Run your tests with the Bun test runner**
- `guides/test/watch-mode` — **Run tests in watch mode with Bun**
- `guides/test/migrate-from-jest` — **Migrate from Jest to Bun's test runner**
- `guides/test/mock-functions` — **Mock functions in `bun test`**
- `guides/test/spy-on` — **Spy on methods in `bun test`**
- `guides/test/mock-clock` — **Set the system time in Bun's test runner**
- `guides/test/snapshot` — **Use snapshot testing in `bun test`**
- `guides/test/update-snapshots` — **Update snapshots in `bun test`**
- `guides/test/coverage` — **Generate code coverage reports with the Bun test runner**
- `guides/test/coverage-threshold` — **Set a code coverage threshold with the Bun test runner**
- `guides/test/concurrent-test-glob` — **Selectively run tests concurrently with glob patterns**: Set a glob pattern to decide which tests from which files run in parallel
- `guides/test/skip-tests` — **Skip tests with the Bun test runner**
- `guides/test/todo-tests` — **Mark a test as a "todo" with the Bun test runner**
- `guides/test/timeout` — **Set a per-test timeout with the Bun test runner**
- `guides/test/bail` — **Bail early with the Bun test runner**
- `guides/test/rerun-each` — **Re-run tests multiple times with the Bun test runner**
- `guides/test/testing-library` — **Using Testing Library with Bun**
- `guides/test/happy-dom` — **Write browser DOM tests with Bun and happy-dom**
- `guides/test/svelte-test` — **import, require, and test Svelte components with bun test**
#### Linter & Formatter
- `guides/lint/migrate-from-eslint` — **Migrate from ESLint to bun lint**
- `guides/lint/migrate-from-oxlint` — **Migrate from oxlint to bun lint**
- `guides/format/migrate-from-prettier` — **Migrate from Prettier to bun fmt**
- `guides/format/migrate-from-oxfmt` — **Migrate from oxfmt to bun fmt**
#### Runtime & Debugging
- `guides/runtime/vscode-debugger` — **Debugging Bun with the VS Code extension**
- `guides/runtime/web-debugger` — **Debugging Bun with the web debugger**
- `guides/runtime/heap-snapshot` — **Inspect memory usage using V8 heap snapshots**
- `guides/runtime/build-time-constants` — **Build-time constants with --define**
- `guides/runtime/define-constant` — **Define and replace static globals & constants**
- `guides/runtime/cicd` — **Install and run Bun in GitHub Actions**
- `guides/runtime/codesign-macos-executable` — **Codesign a single-file JavaScript executable on macOS**: Fix the "can't be opened because it is from an unidentified developer" Gatekeeper warning when running your JavaScript executable.
#### Module System
- `guides/runtime/import-json` — **Import a JSON file**
- `guides/runtime/import-toml` — **Import a TOML file**
- `guides/runtime/import-yaml` — **Import a YAML file**
- `guides/runtime/import-json5` — **Import a JSON5 file**
- `guides/runtime/import-xml` — **Import an XML file**
- `guides/runtime/import-html` — **Import a HTML file as text**
- `guides/util/import-meta-dir` — **Get the directory of the current file**
- `guides/util/import-meta-file` — **Get the file name of the current file**
- `guides/util/import-meta-path` — **Get the absolute path of the current file**
- `guides/util/entrypoint` — **Check if the current file is the entrypoint**
- `guides/util/main` — **Get the absolute path to the current entrypoint**
#### File System
- `guides/read-file/string` — **Read a file as a string**
- `guides/read-file/buffer` — **Read a file to a Buffer**
- `guides/read-file/uint8array` — **Read a file to a Uint8Array**
- `guides/read-file/arraybuffer` — **Read a file to an ArrayBuffer**
- `guides/read-file/json` — **Read a JSON file**
- `guides/read-file/mime` — **Get the MIME type of a file**
- `guides/read-file/exists` — **Check if a file exists**
- `guides/read-file/watch` — **Watch a directory for changes**
- `guides/read-file/stream` — **Read a file as a ReadableStream**
- `guides/write-file/basic` — **Write a string to a file**
- `guides/write-file/blob` — **Write a Blob to a file**
- `guides/write-file/response` — **Write a Response to a file**
- `guides/write-file/append` — **Append content to a file**
- `guides/write-file/filesink` — **Write a file incrementally**
- `guides/write-file/stream` — **Write a ReadableStream to a file**
- `guides/write-file/stdout` — **Write to stdout**
- `guides/write-file/cat` — **Write a file to stdout**
- `guides/write-file/file-cp` — **Copy a file to another location**
- `guides/write-file/unlink` — **Delete a file**
- `guides/runtime/delete-file` — **Delete files**
- `guides/runtime/delete-directory` — **Delete directories**
#### Utilities
- `guides/util/hash-a-password` — **Hash a password**
- `guides/util/javascript-uuid` — **Generate a UUID**
- `guides/util/base64` — **Encode and decode base64 data**
- `guides/util/gzip` — **Compress and decompress data with gzip**
- `guides/util/deflate` — **Compress and decompress data with DEFLATE**
- `guides/util/escape-html` — **Escape an HTML string**
- `guides/util/deep-equals` — **Check if two objects are deeply equal**
- `guides/util/sleep` — **Sleep for a fixed number of milliseconds**
- `guides/util/file-url-to-path` — **Convert a file URL to an absolute path**
- `guides/util/path-to-file-url` — **Convert an absolute path to a file URL**
- `guides/util/which-path-to-executable-bin` — **Get the path to an executable bin file**
#### HTML Processing
- `guides/html-rewriter/extract-links` — **Extract links from a webpage using HTMLRewriter**
- `guides/html-rewriter/extract-social-meta` — **Extract social share images and Open Graph tags**
#### Binary Data
- `guides/binary/arraybuffer-to-string` — **Convert an ArrayBuffer to a string**
- `guides/binary/arraybuffer-to-buffer` — **Convert an ArrayBuffer to a Buffer**
- `guides/binary/arraybuffer-to-blob` — **Convert an ArrayBuffer to a Blob**
- `guides/binary/arraybuffer-to-array` — **Convert an ArrayBuffer to an array of numbers**
- `guides/binary/arraybuffer-to-typedarray` — **Convert an ArrayBuffer to a Uint8Array**
- `guides/binary/buffer-to-string` — **Convert a Buffer to a string**
- `guides/binary/buffer-to-arraybuffer` — **Convert a Buffer to an ArrayBuffer**
- `guides/binary/buffer-to-blob` — **Convert a Buffer to a blob**
- `guides/binary/buffer-to-typedarray` — **Convert a Buffer to a Uint8Array**
- `guides/binary/buffer-to-readablestream` — **Convert a Buffer to a ReadableStream**
- `guides/binary/blob-to-string` — **Convert a Blob to a string**
- `guides/binary/blob-to-arraybuffer` — **Convert a Blob to an ArrayBuffer**
- `guides/binary/blob-to-typedarray` — **Convert a Blob to a Uint8Array**
- `guides/binary/blob-to-dataview` — **Convert a Blob to a DataView**
- `guides/binary/blob-to-stream` — **Convert a Blob to a ReadableStream**
- `guides/binary/typedarray-to-string` — **Convert a Uint8Array to a string**
- `guides/binary/typedarray-to-arraybuffer` — **Convert a Uint8Array to an ArrayBuffer**
- `guides/binary/typedarray-to-buffer` — **Convert a Uint8Array to a Buffer**
- `guides/binary/typedarray-to-blob` — **Convert a Uint8Array to a Blob**
- `guides/binary/typedarray-to-dataview` — **Convert a Uint8Array to a DataView**
- `guides/binary/typedarray-to-readablestream` — **Convert a Uint8Array to a ReadableStream**
- `guides/binary/dataview-to-string` — **Convert a DataView to a string**
#### Streams
- `guides/streams/to-string` — **Convert a ReadableStream to a string**
- `guides/streams/to-json` — **Convert a ReadableStream to JSON**
- `guides/streams/to-blob` — **Convert a ReadableStream to a Blob**
- `guides/streams/to-buffer` — **Convert a ReadableStream to a Buffer**
- `guides/streams/to-arraybuffer` — **Convert a ReadableStream to an ArrayBuffer**
- `guides/streams/to-typedarray` — **Convert a ReadableStream to a Uint8Array**
- `guides/streams/to-array` — **Convert a ReadableStream to an array of chunks**
- `guides/streams/node-readable-to-string` — **Convert a Node.js Readable to a string**
- `guides/streams/node-readable-to-json` — **Convert a Node.js Readable to JSON**
- `guides/streams/node-readable-to-blob` — **Convert a Node.js Readable to a Blob**
- `guides/streams/node-readable-to-uint8array` — **Convert a Node.js Readable to an Uint8Array**
- `guides/streams/node-readable-to-arraybuffer` — **Convert a Node.js Readable to an ArrayBuffer**

### Reference
- External: https://bun.com/reference

### Blog
- External: https://bun.com/blog

### Feedback
- `feedback` — **Feedback**: Share feedback, bug reports, and feature requests
