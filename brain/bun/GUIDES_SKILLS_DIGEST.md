# Bun Guides & Dev Skills Digest

Compacted from `docs/guides/**/*.mdx` and upstream repo dev skills.

## Mintlify Guides (`docs/guides/`)

### binary (22)
- **binary/arraybuffer-to-array** (Convert an ArrayBuffer to an array of numbers): To retrieve the contents of an `ArrayBuffer` as an array of numbers, create a `Uint8Array` over the buffer, then use `Array.from()` to conve — `const buf = new ArrayBuffer(64);`
- **binary/arraybuffer-to-blob** (Convert an ArrayBuffer to a Blob): You can construct a `Blob` from an array of "chunks", where each chunk is a string, binary data structure, or another `Blob`. — `const buf = new ArrayBuffer(64);`
- **binary/arraybuffer-to-buffer** (Convert an ArrayBuffer to a Buffer): The Node.js `Buffer` API predates the introduction of `ArrayBuffer` into the JavaScript language. Bun implements both. — `const arrBuffer = new ArrayBuffer(64);`
- **binary/arraybuffer-to-string** (Convert an ArrayBuffer to a string): Bun implements the Web-standard `TextDecoder` class for converting between binary data types and strings. — `const buf = new ArrayBuffer(64);`
- **binary/arraybuffer-to-typedarray** (Convert an ArrayBuffer to a Uint8Array): A `Uint8Array` is a _typed array_, a view over the data in an underlying `ArrayBuffer`. — `const buffer = new ArrayBuffer(64);`
- **binary/blob-to-arraybuffer** (Convert a Blob to an ArrayBuffer): The `Blob` class provides several methods for consuming its contents in different formats, including `.arrayBuffer()`. — `const blob = new Blob(["hello world"]);`
- **binary/blob-to-dataview** (Convert a Blob to a DataView): The `Blob` class provides several methods for consuming its contents in different formats. Read the contents into an `ArrayBuffer` with `.ar — `const blob = new Blob(["hello world"]);`
- **binary/blob-to-stream** (Convert a Blob to a ReadableStream): The `Blob` class provides several methods for consuming its contents in different formats, including `.stream()`, which returns a `ReadableS — `const blob = new Blob(["hello world"]);`
- **binary/blob-to-string** (Convert a Blob to a string): The `Blob` class provides several methods for consuming its contents in different formats, including `.text()`. — `const blob = new Blob(["hello world"]);`
- **binary/blob-to-typedarray** (Convert a Blob to a Uint8Array): The `Blob` class provides several methods for consuming its contents in different formats. Use `.bytes()` to read the contents as a `Uint8Ar — `const blob = new Blob(["hello world"]);`
- **binary/buffer-to-arraybuffer** (Convert a Buffer to an ArrayBuffer): The Node.js `Buffer` class views and manipulates data in an underlying `ArrayBuffer`. The `buffer` property returns that `ArrayBuffer`. — `const nodeBuf = Buffer.alloc(64);`
- **binary/buffer-to-blob** (Convert a Buffer to a blob): You can construct a `Blob` from an array of "chunks", where each chunk is a string, binary data structure (including `Buffer`), or another ` — `const buf = Buffer.from("hello");`
- **binary/buffer-to-readablestream** (Convert a Buffer to a ReadableStream): The naive approach to creating a `ReadableStream` from a `Buffer` is to use the `ReadableStream` constructor and enqueue the entire array as — `const buf = Buffer.from("hello world");`
- **binary/buffer-to-string** (Convert a Buffer to a string): The `Buffer` class provides a `.toString()` method that converts a `Buffer` to a string. — `const buf = Buffer.from("hello");`
- **binary/buffer-to-typedarray** (Convert a Buffer to a Uint8Array): The Node.js `Buffer` class extends `Uint8Array`, so no conversion is needed. All properties and methods on `Uint8Array` are available on `Bu — `const buf = Buffer.alloc(64);`
- **binary/dataview-to-string** (Convert a DataView to a string): If a `DataView` contains ASCII-encoded text, use the `TextDecoder` class to convert it to a string. — `const dv: DataView = ...;`
- **binary/typedarray-to-arraybuffer** (Convert a Uint8Array to an ArrayBuffer): A `Uint8Array` is a _typed array_, a view over data in an underlying `ArrayBuffer`. The `buffer` property returns that `ArrayBuffer`. — `const arr = new Uint8Array(64);`
- **binary/typedarray-to-blob** (Convert a Uint8Array to a Blob): You can construct a `Blob` from an array of "chunks", where each chunk is a string, binary data structure (including `Uint8Array`), or anoth — `const arr = new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]);`
- **binary/typedarray-to-buffer** (Convert a Uint8Array to a Buffer): The `Buffer` class extends `Uint8Array` with additional methods. Use `Buffer.from()` to create a `Buffer` instance from a `Uint8Array`. — `const arr: Uint8Array = ...`
- **binary/typedarray-to-dataview** (Convert a Uint8Array to a DataView): A `Uint8Array` is a _typed array_, a view over data in an underlying `ArrayBuffer`. To convert it to a `DataView`, create one over the same  — `const arr: Uint8Array = ...`
- **binary/typedarray-to-readablestream** (Convert a Uint8Array to a ReadableStream): The naive approach to creating a `ReadableStream` from a `Uint8Array` is to use the `ReadableStream` constructor and enqueue the entire arra — `const arr = new Uint8Array(64);`
- **binary/typedarray-to-string** (Convert a Uint8Array to a string): Bun implements the Web-standard `TextDecoder` class for converting binary data types like `Uint8Array` to strings. — `const arr = new Uint8Array([104, 101, 108, 108, 111]);`

### deployment (6)
- **deployment/aws-lambda** (Deploy a Bun application on AWS Lambda): AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers.
- **deployment/digital-ocean** (Deploy a Bun application on DigitalOcean): DigitalOcean is a cloud platform that provides a range of services for building and deploying applications.
- **deployment/google-cloud-run** (Deploy a Bun application on Google Cloud Run): Google Cloud Run is a managed platform for deploying and scaling serverless applications. Google handles the infrastructure for you. — `gcloud init`
- **deployment/railway** (Deploy a Bun application on Railway): Deploy a Bun application to Railway from the CLI or dashboard, with optional PostgreSQL setup and automatic SSL — `bun install -g @railway/cli`
- **deployment/render** (Deploy a Bun application on Render): Render is a cloud platform for building, deploying, and scaling apps.
- **deployment/vercel** (Deploy a Bun application on Vercel): Vercel is a cloud platform for building, deploying, and scaling apps. Vercel Functions can run on the Bun runtime, either behind a framework — `export const config = { runtime: "nodejs" }; // [!code ++]`

### ecosystem (27)
- **ecosystem/astro** (Build an app with Astro and Bun): Initialize a fresh Astro app with `bun create astro`. The `create-astro` package detects when you are using `bunx` and installs dependencies — `bun create astro`
- **ecosystem/discordjs** (Create a Discord bot): Discord.js runs on Bun with no extra setup. This guide builds a bot that answers a `/ping` slash command: you register the command once, the — `mkdir my-bot`
- **ecosystem/docker** (Containerize a Bun application with Docker): This guide assumes you already have Docker Desktop installed. — `node_modules`
- **ecosystem/drizzle** (Use Drizzle ORM with Bun): Drizzle is an ORM that supports both a SQL-like "query builder" API and an ORM-like Queries API. It supports the `bun:sqlite` built-in modul — `bun init -y`
- **ecosystem/elysia** (Build an HTTP server using Elysia and Bun): Elysia is a Bun-first web framework built on Bun's HTTP, file system, and hot reloading APIs. Get started with `bun create`. — `bun create elysia myapp`
- **ecosystem/express** (Build an HTTP server using Express and Bun): Express and other major Node.js HTTP libraries should work in Bun without changes. Bun implements the `node:http` and `node:https` modules t — `bun add express`
- **ecosystem/gel** (Use Gel with Bun): Gel (formerly EdgeDB) is a graph-relational database built on Postgres. It provides a declarative schema language, migrations system, and ob — `curl https://www.geldata.com/sh --proto "=https" -sSf1 | sh`
- **ecosystem/hono** (Build an HTTP server using Hono and Bun): Hono is a lightweight web framework designed for the edge. — `const app = new Hono();`
- **ecosystem/mongoose** (Read and write data to MongoDB using Mongoose and Bun): MongoDB and Mongoose work with Bun with no extra configuration. This guide assumes you've already installed MongoDB and are running it as a  — `mkdir mongoose-app`
- **ecosystem/neon-drizzle** (Use Neon Postgres through Drizzle ORM): Neon is a fully managed serverless Postgres. Neon separates compute and storage to offer features like autoscaling, branching and bottomless — `mkdir bun-drizzle-neon`
- **ecosystem/neon-serverless-postgres** (Use Neon's Serverless Postgres with Bun): Neon is a fully managed serverless Postgres. Neon separates compute and storage to offer features such as autoscaling, branching, and bottom — `mkdir bun-neon-postgres`
- **ecosystem/nextjs** (Build an app with Next.js and Bun): Next.js is a React framework for building full-stack web applications. It supports server-side rendering, static site generation, and API ro
- **ecosystem/nuxt** (Build an app with Nuxt and Bun): Bun supports Nuxt with no extra configuration. Initialize a Nuxt app with the official `create-nuxt` CLI. — `bun create nuxt@latest my-nuxt-app`
- **ecosystem/pm2** (Run Bun as a daemon with PM2): PM2 is a process manager that runs your applications as daemons (background processes). — `pm2 start --interpreter ~/.bun/bin/bun index.ts`
- **ecosystem/prisma-postgres** (Use Prisma Postgres with Bun): Prisma Postgres is a managed PostgreSQL database. In this guide you scaffold a Bun project with Prisma ORM 8, create a Prisma Postgres datab
- **ecosystem/prisma** (Use Prisma with Bun): Prisma ORM 8 generates a typed query API from a schema. In this guide you add it to a Bun project, create the tables in a PostgreSQL databas
- **ecosystem/qwik** (Build an app with Qwik and Bun): Initialize a new Qwik app with `bunx create-qwik`. — `bun create qwik`
- **ecosystem/react** (Build a React app with Bun): Bun has built-in support for `.jsx` and `.tsx` files. React works with Bun. — `# Create a new React app`
- **ecosystem/remix** (Build an app with Remix and Bun): Remix 3 is a web framework built from standalone packages: a router, HTML rendering, sessions, form parsing, and more. These packages are di — `bunx remix@next new my-remix-app`
- **ecosystem/sentry** (Add Sentry to a Bun app): Sentry is an error tracking and performance monitoring platform. Its Bun SDK, `@sentry/bun`, instruments your application to automatically c — `bun add @sentry/bun`
- **ecosystem/solidstart** (Build an app with SolidStart and Bun): Initialize a SolidStart app with `create-solid`. Pass the `--solidstart` flag to create a SolidStart project and `--ts` for TypeScript suppo — `bun create solid my-app --solidstart --ts`
- **ecosystem/ssr-react** (Server-side render (SSR) a React component): Install `react` and `react-dom`: — `# Any package manager can be used`
- **ecosystem/sveltekit** (Build an app with SvelteKit and Bun): Use `sv create my-app` to create a SvelteKit project with the Svelte CLI. Answer the prompts to select a template and set up your developmen — `bunx sv create my-app`
- **ecosystem/systemd** (Run Bun as a daemon with systemd): systemd is an init system and service manager for Linux. It manages the startup and control of system processes and services. — `cd /etc/systemd/system`
- **ecosystem/tanstack-start** (Use TanStack Start with Bun): TanStack Start is a full-stack framework powered by TanStack Router and Vite. It supports full-document SSR, streaming, server functions, an
- **ecosystem/upstash** (Bun Redis with Upstash): Upstash is a fully managed Redis database as a service. It works with the Redis® API, so you can connect with Bun's native Redis client.
- **ecosystem/vite** (Build a frontend using Vite and Bun): You can use Vite with Bun, but many projects get faster builds & drop hundreds of dependencies by switching to [HTML — `bun create vite my-app`

### format (2)
- **format/migrate-from-oxfmt** (Migrate from oxfmt to bun fmt): `bun fmt` reads your `.oxfmtrc.json` and prints what oxfmt 0.72 prints. In most projects you only change the command. — `bun fmt --doctor`
- **format/migrate-from-prettier** (Migrate from Prettier to bun fmt): `bun fmt` reads your `.prettierrc` and prints what Prettier 3 prints. In most projects you only change the command. — `bun fmt --doctor`

### html-rewriter (2)
- **html-rewriter/extract-links** (Extract links from a webpage using HTMLRewriter): Bun's HTMLRewriter API extracts links from HTML. Chain CSS selectors to match the elements, text, and attributes you want to process. Then p
- **html-rewriter/extract-social-meta** (Extract social share images and Open Graph tags): Bun's HTMLRewriter API extracts social share images and Open Graph metadata from HTML by matching CSS selectors against the elements, text, 

### http (13)
- **http/cluster** (Start a cluster of HTTP servers): Run multiple HTTP servers concurrently with the "reusePort" option to share the same port across multiple processes
- **http/fetch-unix** (fetch with unix domain sockets in Bun): In Bun, `fetch()` can send HTTP requests over a unix domain socket with the `unix` option. — `const unix = "/var/run/docker.sock";`
- **http/fetch** (Send an HTTP request using fetch): Bun implements the Web-standard `fetch` API for sending HTTP requests. To send a `GET` request to a URL: — `const response = await fetch("https://bun.com");`
- **http/file-uploads** (Upload files via HTTP using FormData): To upload files over HTTP with Bun, use the `FormData` API. Start with an HTTP server that serves an HTML form. — `bun run index.ts`
- **http/hot** (Hot reload an HTTP server): The `--hot` flag runs a file with hot reloading enabled. When that file or a file it imports changes, Bun re-runs it. Bun does not watch fil — `bun --hot run index.ts`
- **http/proxy** (Proxy HTTP requests using fetch()): In Bun, `fetch` supports sending requests through an HTTP or HTTPS proxy. Use it on corporate networks or when a request must come from a sp — `await fetch("https://example.com", {`
- **http/server** (Common HTTP server usage): This code starts an HTTP server listening on port `3000`. It demonstrates basic routing with common responses and handles POST data from sta
- **http/simple** (Write a simple HTTP server): This code starts an HTTP server listening on port `3000`. It responds to every request with a `200` status and the body `"Welcome to Bun!"`. — `const server = Bun.serve({`
- **http/sse** (Server-Sent Events (SSE) with Bun): Server-Sent Events let you push a stream of text events to the browser over a single HTTP response. The client consumes them with `EventSour
- **http/stream-file** (Stream a file as an HTTP Response): `Bun.file()` accepts a path and returns a lazily-loaded `BunFile` instance, which you can pass directly to the `new Response` constructor. — `const path = "/path/to/file.txt";`
- **http/stream-iterator** (Streaming HTTP Server with Async Iterators): In Bun, a `Response` accepts an async generator function as its body, so you can stream data to the client as it becomes available rather th
- **http/stream-node-streams-in-bun** (Streaming HTTP Server with Node.js Streams): In Bun, a `Response` accepts a Node.js `Readable` as its body. — `serve({`
- **http/tls** (Configure TLS on an HTTP server): Set the `tls` key to configure TLS. Both `key` and `cert` are required: `key` is the contents of your private key and `cert` is the contents — `const server = Bun.serve({`

### install (17)
- **install/add-dev** (Add a development dependency): To add an npm package as a development dependency, use `bun add --development`. — `bun add zod --dev`
- **install/add-git** (Add a Git dependency): Bun supports directly adding GitHub repositories as dependencies of your project. — `bun add github:lodash/lodash`
- **install/add-optional** (Add an optional dependency): To add an npm package as an optional dependency, use the `--optional` flag. — `bun add zod --optional`
- **install/add-peer** (Add a peer dependency): To add an npm package as a peer dependency, use the `--peer` flag. — `bun add @types/bun --peer`
- **install/add-tarball** (Add a tarball dependency): Bun's package manager can install a tarball URL as a dependency of your project. If the URL needs credentials, see Tarball dependencies. — `bun add zod@https://registry.npmjs.org/zod/-/zod-3.21.4.tgz`
- **install/add** (Add a dependency): To add an npm package as a dependency, use `bun add`. — `bun add zod`
- **install/azure-artifacts** (Using bun install with an Azure Artifacts npm registry): Artifacts'](https://learn.microsoft.com/en-us/azure/devops/artifacts/npm/npmrc?view=azure-devops&tabs=windows%2Cclassic) — `[install.registry]`
- **install/cicd** (Install dependencies with Bun in GitHub Actions): Use the official `setup-bun` GitHub Action to install `bun` in your GitHub Actions runner. — `name: my-workflow`
- **install/custom-registry** (Override the default npm registry for bun install): The default registry is `registry.npmjs.org`. Override it globally in `bunfig.toml`. — `[install]`
- **install/from-npm-install-to-bun-install** (Migrate from npm install to bun install): `bun install` is a fast, Node.js-compatible npm client. — `# It only takes one command to migrate`
- **install/git-diff-bun-lockfile** (Configure git to diff Bun's lockb lockfile): Bun v1.1.39 introduced `bun.lock`, a JSONC formatted lockfile. `bun.lock` is human-readable and git-diffable without — `*.lockb binary diff=lockb`
- **install/jfrog-artifactory** (Using bun install with Artifactory): JFrog Artifactory is a package management system for npm, Docker, Maven, NuGet, Ruby, Helm, and more. You can use it to host your own privat
- **install/npm-alias** (Install a package under a different name): To install an npm package under an alias: — `bun add my-custom-name@npm:zod`
- **install/registry-scope** (Configure a private registry for an organization scope with bun install): You can configure private registries in `.npmrc` or `bunfig.toml`. Both work; we recommend `bunfig.toml` for its Bun-specific options. — `[install.scopes]`
- **install/trusted** (Add a trusted dependency): By default, Bun does not execute arbitrary lifecycle scripts for installed dependencies, such as `postinstall` and `node-gyp` builds. These  — `{`
- **install/workspaces** (Configuring a monorepo using workspaces): Bun's package manager supports npm `"workspaces"`. Workspaces split a codebase into distinct packages that live in the same repository, can  — `{`
- **install/yarnlock** (Generate a yarn-compatible lockfile): Bun v1.1.39 introduced `bun.lock`, a JSONC-formatted lockfile. It is human-readable and git-diffable without — `bun install --yarn`

### lint (2)
- **lint/migrate-from-eslint** (Migrate from ESLint to bun lint): `bun lint` reads your `eslint.config.js` and prints the same report as ESLint 10. In most projects you only change the command. — `{`
- **lint/migrate-from-oxlint** (Migrate from oxlint to bun lint): `bun lint` reads your `.oxlintrc.json` and reports the same problems as oxlint 1.87. In most projects you only change the command. — `{`

### process (9)
- **process/argv** (Parse command-line arguments): The _argument vector_ is the list of arguments passed to the program when it is run. It is available as `Bun.argv`. — `console.log(Bun.argv);`
- **process/ctrl-c** (Listen for CTRL+C): The `ctrl+c` shortcut sends an _interrupt signal_ to the running process. Intercept it by listening for the `SIGINT` event. To close the pro — `process.on("SIGINT", () => {`
- **process/ipc** (Spawn a child process and communicate using IPC): Use `Bun.spawn()` to spawn a child process. When spawning a second `bun` process, you can open a direct inter-process communication (IPC) ch — `const child = Bun.spawn(["bun", "child.ts"], {`
- **process/nanoseconds** (Get the process uptime in nanoseconds): Use `Bun.nanoseconds()` to get the total number of nanoseconds the `bun` process has been alive. — `Bun.nanoseconds();`
- **process/os-signals** (Listen to OS signals): Bun supports the Node.js `process` global, including the `process.on()` method for listening to OS signals. — `process.on("SIGINT", () => {`
- **process/spawn-stderr** (Read stderr from a child process): When you spawn a child process with `Bun.spawn()`, it inherits the `stderr` of the spawning process. To read and handle `stderr` instead, se — `const proc = Bun.spawn(["echo", "hello"], {`
- **process/spawn-stdout** (Read stdout from a child process): When you spawn a child process with `Bun.spawn()`, `proc.stdout` is a `ReadableStream` of the child's `stdout`. — `const proc = Bun.spawn(["echo", "hello"]);`
- **process/spawn** (Spawn a child process): Use `Bun.spawn()` to spawn a child process. — `const proc = Bun.spawn(["echo", "hello"]);`
- **process/stdin** (Read from stdin): In Bun, the `console` object is an `AsyncIterable` that yields lines from `stdin`. — `const prompt = "Type something: ";`

### read-file (9)
- **read-file/arraybuffer** (Read a file to an ArrayBuffer): The `Bun.file()` function accepts a path and returns a `BunFile` instance. `BunFile` extends `Blob`, so you can read the file lazily in a va — `const path = "/path/to/package.json";`
- **read-file/buffer** (Read a file to a Buffer): The `Bun.file()` function accepts a path and returns a `BunFile` instance. `BunFile` extends `Blob`, so you can read the file lazily in a va — `const path = "/path/to/package.json";`
- **read-file/exists** (Check if a file exists): The `Bun.file()` function accepts a path and returns a `BunFile` instance. Use the `.exists()` method to check if a file exists at the given — `const path = "/path/to/package.json";`
- **read-file/json** (Read a JSON file): The `Bun.file()` function accepts a path and returns a `BunFile` instance. `BunFile` extends `Blob`, so you can read the file lazily in a va — `const path = "/path/to/package.json";`
- **read-file/mime** (Get the MIME type of a file): The `Bun.file()` function accepts a path and returns a `BunFile` instance. The `BunFile` class extends `Blob`, so use the `.type` property t — `const file = Bun.file("./package.json");`
- **read-file/stream** (Read a file as a ReadableStream): The `Bun.file()` function accepts a path and returns a `BunFile` instance. `BunFile` extends `Blob`, so you can read the file lazily in a va — `const path = "/path/to/package.json";`
- **read-file/string** (Read a file as a string): The `Bun.file()` function accepts a path and returns a `BunFile` instance. `BunFile` extends `Blob`, so you can read the file lazily in a va — `const path = "/path/to/file.txt";`
- **read-file/uint8array** (Read a file to a Uint8Array): The `Bun.file()` function accepts a path and returns a `BunFile` instance. `BunFile` extends `Blob`, so you can read the file lazily in a va — `const path = "/path/to/package.json";`
- **read-file/watch** (Watch a directory for changes): Bun implements the `node:fs` module, including the `fs.watch` function for listening for file system changes. — `const watcher = watch(import.meta.dir, (event, filename) => {`

### runtime (21)
- **runtime/build-time-constants** (Build-time constants with --define): Pass `--define` to `bun build` or `bun build --compile` to inject build-time constants into your application. Use it to embed metadata like  — `bun build --compile --define BUILD_VERSION='"1.2.3"' --define BUILD_TIME='"2024-01-15T10:3`
- **runtime/cicd** (Install and run Bun in GitHub Actions): Use the official `setup-bun` GitHub Action to install `bun` in your GitHub Actions runner. — `name: my-workflow`
- **runtime/codesign-macos-executable** (Codesign a single-file JavaScript executable on macOS): Fix the "can't be opened because it is from an unidentified developer" Gatekeeper warning when running your JavaScript executable. — `bun build --compile ./path/to/entry.ts --outfile myapp`
- **runtime/define-constant** (Define and replace static globals & constants): The `--define` flag declares statically-analyzable constants and globals. It replaces all usages of an identifier or property in a JavaScrip — `bun --define process.env.NODE_ENV="'production'" src/index.ts # Runtime`
- **runtime/delete-directory** (Delete directories): To recursively delete a directory and all its contents, use `rm` from `node:fs/promises`. This is like running `rm -rf` in JavaScript. — `// Delete a directory and all its contents`
- **runtime/delete-file** (Delete files): To delete a file, use `Bun.file(path).delete()`. — `// Delete a file`
- **runtime/heap-snapshot** (Inspect memory usage using V8 heap snapshots): Bun implements V8's heap snapshot API. Use it to capture the heap at runtime and debug memory leaks in your JavaScript/TypeScript applicatio — `// Creates a heap snapshot file with an auto-generated name`
- **runtime/import-html** (Import a HTML file as text): To import a `.html` file in Bun as a text file, use the `type: "text"` attribute in the import statement. — `console.log(html); // <!DOCTYPE html><html><head>...`
- **runtime/import-json** (Import a JSON file): Bun natively supports `.json` imports. — `{`
- **runtime/import-json5** (Import a JSON5 file): Bun natively supports `.json5` imports. — `{`
- **runtime/import-toml** (Import a TOML file): Bun natively supports importing `.toml` files. — `name = "bun"`
- **runtime/import-xml** (Import an XML file): Bun natively supports `.xml` imports. — `<?xml version="1.0" encoding="UTF-8"?>`
- **runtime/import-yaml** (Import a YAML file): Bun natively supports `.yaml` and `.yml` imports. — `database:`
- **runtime/read-env** (Read environment variables): Access the current environment variables with `process.env`. — `process.env.API_TOKEN; // => "secret"`
- **runtime/set-env** (Set environment variables): Access the current environment variables with `process.env` or `Bun.env`. — `Bun.env.API_TOKEN; // => "secret"`
- **runtime/shell** (Run a Shell Command): Bun Shell is a cross-platform bash-like shell built into Bun. — `await $`echo Hello, world!`; // => "Hello, world!"`
- **runtime/timezone** (Set a time zone in Bun): Bun supports programmatically setting a default time zone for the lifetime of the `bun` process. Set the `TZ` environment variable to a vali — `process.env.TZ = "America/New_York";`
- **runtime/tsconfig-paths** (Re-map import paths): Bun reads the `paths` field in your `tsconfig.json` to re-write import paths. This is useful for aliasing package names or avoiding long rel — `{`
- **runtime/typescript** (Install TypeScript declarations for Bun): To add TypeScript definitions for Bun's built-in APIs to your project, install `@types/bun`. — `bun add -d @types/bun # dev dependency`
- **runtime/vscode-debugger** (Debugging Bun with the VS Code extension): The VS Code extension is buggy. We recommend the web debugger instead.
- **runtime/web-debugger** (Debugging Bun with the web debugger): Bun speaks the WebKit Inspector Protocol. To enable debugging when running code with Bun, use the `--inspect` flag. Consider the following w — `Bun.serve({`

### streams (12)
- **streams/node-readable-to-arraybuffer** (Convert a Node.js Readable to an ArrayBuffer): To convert a Node.js `Readable` stream to an `ArrayBuffer` in Bun, create a `Response` with the stream as the body, then call `arrayBuffer() — `const stream = Readable.from(["Hello, ", "world!"]);`
- **streams/node-readable-to-blob** (Convert a Node.js Readable to a Blob): To convert a Node.js `Readable` stream to a `Blob` in Bun, create a `Response` with the stream as the body, then call `response.blob()`. — `const stream = Readable.from(["Hello, ", "world!"]);`
- **streams/node-readable-to-json** (Convert a Node.js Readable to JSON): To convert a Node.js `Readable` stream to a JSON object in Bun, create a `Response` with the stream as the body, then call `response.json()` — `const stream = Readable.from([JSON.stringify({ hello: "world" })]);`
- **streams/node-readable-to-string** (Convert a Node.js Readable to a string): To convert a Node.js `Readable` stream to a string in Bun, create a `Response` with the stream as the body, then call `response.text()`. — `const stream = Readable.from([Buffer.from("Hello, world!")]);`
- **streams/node-readable-to-uint8array** (Convert a Node.js Readable to an Uint8Array): To convert a Node.js `Readable` stream to a `Uint8Array` in Bun, create a `Response` with the stream as the body, then call `bytes()`. — `const stream = Readable.from(["Hello, ", "world!"]);`
- **streams/to-array** (Convert a ReadableStream to an array of chunks): `Bun.readableStreamToArray` reads the contents of a `ReadableStream` into an array of chunks. — `const stream = new ReadableStream();`
- **streams/to-arraybuffer** (Convert a ReadableStream to an ArrayBuffer): `Bun.readableStreamToArrayBuffer` reads the contents of a `ReadableStream` into an `ArrayBuffer`. — `const stream = new ReadableStream();`
- **streams/to-blob** (Convert a ReadableStream to a Blob): Bun provides several conveniences for reading the contents of a `ReadableStream` into other formats. To read a stream into a `Blob`, call it — `const stream = new ReadableStream();`
- **streams/to-buffer** (Convert a ReadableStream to a Buffer): To convert a `ReadableStream` to a `Buffer`, read its contents into an `ArrayBuffer` with `Bun.readableStreamToArrayBuffer`, then create a ` — `const stream = new ReadableStream();`
- **streams/to-json** (Convert a ReadableStream to JSON): Bun provides several conveniences for reading the contents of a `ReadableStream` into other formats. To read a stream and parse it as JSON,  — `const stream = new ReadableStream();`
- **streams/to-string** (Convert a ReadableStream to a string): Bun provides several conveniences for reading the contents of a `ReadableStream` into other formats. To read a stream into a string, call it — `const stream = new ReadableStream();`
- **streams/to-typedarray** (Convert a ReadableStream to a Uint8Array): To convert a `ReadableStream` to a `Uint8Array`, read its contents into an `ArrayBuffer` with `Bun.readableStreamToArrayBuffer`, then create — `const stream = new ReadableStream();`

### test (19)
- **test/bail** (Bail early with the Bun test runner): Use the `--bail` flag to abort a test run after the first failure, so a continuous integration run fails as early as possible. — `bun test --bail`
- **test/concurrent-test-glob** (Selectively run tests concurrently with glob patterns): Set a glob pattern to decide which tests from which files run in parallel — `[test]`
- **test/coverage-threshold** (Set a code coverage threshold with the Bun test runner): Bun's test runner has built-in code coverage reporting. Enable it with the `--coverage` flag. — `bun test --coverage`
- **test/coverage** (Generate code coverage reports with the Bun test runner): Bun's test runner has built-in _code coverage reporting_. Use it to see how much of your codebase your tests cover, and where the gaps are. — `bun test --coverage`
- **test/happy-dom** (Write browser DOM tests with Bun and happy-dom): Use Happy DOM to write browser tests with Bun's test runner. Happy DOM implements mocked versions of browser APIs like `document` and `locat — `bun add -d @happy-dom/global-registrator`
- **test/migrate-from-jest** (Migrate from Jest to Bun's test runner): In many cases, Bun's test runner can run Jest test suites with no code changes. Run `bun test` instead of `npx jest` or `yarn test`. — `npx jest # [!code --]`
- **test/mock-clock** (Set the system time in Bun's test runner): Set the system time in tests with the `setSystemTime` function from `bun:test`. — `beforeAll(() => {`
- **test/mock-functions** (Mock functions in `bun test`): Create mocks with the `mock` function from `bun:test`. — `const random = mock(() => Math.random());`
- **test/rerun-each** (Re-run tests multiple times with the Bun test runner): The `--rerun-each` flag runs every test multiple times. Use it to find flaky or non-deterministic tests. — `# re-run each test 10 times`
- **test/run-tests** (Run your tests with the Bun test runner): Bun has a built-in test runner with a Jest-like `expect` API. — `*.test.{js|jsx|ts|tsx|mjs|cjs|mts|cts}`
- **test/skip-tests** (Skip tests with the Bun test runner): To skip a test with the Bun test runner, use the `test.skip` function. — `test.skip("unimplemented feature", () => {`
- **test/snapshot** (Use snapshot testing in `bun test`): Bun's test runner supports Jest-style snapshot testing with `.toMatchSnapshot()`. — `test("snapshot", () => {`
- **test/spy-on** (Spy on methods in `bun test`): Use the `spyOn` utility to track method calls with Bun's test runner. — `const leo = {`
- **test/svelte-test** (import, require, and test Svelte components with bun test): Use Bun's Plugin API to add a custom loader for `.svelte` files, and the `test.preload` option in `bunfig.toml` to load it before your tests — `bun add @testing-library/svelte svelte@4 @happy-dom/global-registrator`
- **test/testing-library** (Using Testing Library with Bun): You can use Testing Library with Bun's test runner. — `bun add -D @happy-dom/global-registrator`
- **test/timeout** (Set a per-test timeout with the Bun test runner): Use the `--timeout` flag to set a timeout for each test in milliseconds. Bun marks a test that exceeds this timeout as failed. — `bun test --timeout 3000 # 3 seconds`
- **test/todo-tests** (Mark a test as a "todo" with the Bun test runner): To remind yourself to write a test later, use the `test.todo` function. An implementation isn't required. — `// write this later`
- **test/update-snapshots** (Update snapshots in `bun test`): Bun's test runner supports Jest-style snapshot testing with `.toMatchSnapshot()`. — `test("snapshot", () => {`
- **test/watch-mode** (Run tests in watch mode with Bun): Use the `--watch` flag to run your tests in watch mode. — `bun test --watch`

### util (19)
- **util/base64** (Encode and decode base64 data): Prefer `Uint8Array.prototype.toBase64()` and `Uint8Array.fromBase64()` for encoding and decoding base64 data in Bun. These APIs work directl — `const bytes = new Uint8Array([98, 117, 110]);`
- **util/deep-equals** (Check if two objects are deeply equal): `Bun.deepEquals()` checks if two objects are deeply equal. `expect().toEqual()` in Bun's test runner uses it internally. — `const a = { a: 1, b: 2, c: { d: 3 } };`
- **util/deflate** (Compress and decompress data with DEFLATE): Use `Bun.deflateSync()` to compress a `Uint8Array` with DEFLATE. — `const data = Buffer.from("Hello, world!");`
- **util/detect-bun** (Detect when code is executed with Bun): Check `process.versions.bun` to detect whether code is running in Bun. This works in both JavaScript and TypeScript without extra type defin — `if (process.versions.bun) {`
- **util/entrypoint** (Check if the current file is the entrypoint): Bun provides a handful of module-specific utilities on the `import.meta` object. Use `import.meta.main` to check if the current file is the  — `if (import.meta.main) {`
- **util/escape-html** (Escape an HTML string): `Bun.escapeHTML()` escapes HTML characters in a string. It makes the following replacements. — `Bun.escapeHTML("<script>alert('Hello World!')</script>");`
- **util/file-url-to-path** (Convert a file URL to an absolute path): Use `Bun.fileURLToPath()` to convert a `file://` URL to an absolute path. — `Bun.fileURLToPath("file:///path/to/file.txt");`
- **util/gzip** (Compress and decompress data with gzip): Use `Bun.gzipSync()` to compress a `Uint8Array` with gzip. — `const data = Buffer.from("Hello, world!");`
- **util/hash-a-password** (Hash a password): Use `Bun.password.hash()` to securely hash passwords. It's built into Bun, with no third-party dependencies. — `const password = "super-secure-pa$$word";`
- **util/import-meta-dir** (Get the directory of the current file): Bun provides a handful of module-specific utilities on the `import.meta` object. Use `import.meta.dir` to retrieve the absolute path to the  — `import.meta.dir; // => "/a/b"`
- **util/import-meta-file** (Get the file name of the current file): Bun provides a handful of module-specific utilities on the `import.meta` object. Use `import.meta.file` to retrieve the name of the current  — `import.meta.file; // => "c.ts"`
- **util/import-meta-path** (Get the absolute path of the current file): Bun provides a handful of module-specific utilities on the `import.meta` object. Use `import.meta.path` to retrieve the absolute path of the — `import.meta.path; // => "/a/b/c.ts"`
- **util/javascript-uuid** (Generate a UUID): Use `crypto.randomUUID()` to generate a UUID v4. It works in Bun, Node.js, and browsers, with no dependencies. — `crypto.randomUUID();`
- **util/main** (Get the absolute path to the current entrypoint): The `Bun.main` property contains the absolute path to the current entrypoint. — `console.log(Bun.main);`
- **util/path-to-file-url** (Convert an absolute path to a file URL): Use `Bun.pathToFileURL()` to convert an absolute path to a `file://` URL. — `Bun.pathToFileURL("/path/to/file.txt").href;`
- **util/sleep** (Sleep for a fixed number of milliseconds): `Bun.sleep()` returns a void `Promise` that resolves after a given number of milliseconds. — `// sleep for 1 second`
- **util/upgrade** (Upgrade Bun to the latest version): Bun upgrades itself with the built-in `bun upgrade` command. — `bun upgrade`
- **util/version** (Get the current Bun version): `Bun.version` contains the current version of Bun in semver format. — `Bun.version; // => "1.3.3"`
- **util/which-path-to-executable-bin** (Get the path to an executable bin file): `Bun.which` finds the absolute path of an executable file, like the `which` command on Unix-like systems. — `Bun.which("sh"); // => "/bin/sh"`

### websocket (4)
- **websocket/compression** (Enable compression for WebSocket messages): Set the `perMessageDeflate` parameter to enable the permessage-deflate WebSocket extension. Bun then negotiates compression with clients tha — `Bun.serve({`
- **websocket/context** (Set per-socket contextual data on a WebSocket): A WebSocket server typically needs to store some identifying information or context for each connected client.
- **websocket/pubsub** (Build a publish-subscribe WebSocket server): Bun's server-side `WebSocket` API includes native pub-sub. Subscribe a socket to a set of named channels with `socket.subscribe(<name>)`; pu
- **websocket/simple** (Build a simple WebSocket server): Start a WebSocket server with `Bun.serve`.

### write-file (10)
- **write-file/append** (Append content to a file): Bun implements the `node:fs` module, which includes the `fs.appendFile` and `fs.appendFileSync` functions for appending content to files. — `await appendFile("message.txt", "data to append");`
- **write-file/basic** (Write a string to a file): Use `Bun.write()` to write a string to disk at an _absolute path_. The first argument is a _destination_; the second is the _data_ to write. — `const path = "/path/to/file.txt";`
- **write-file/blob** (Write a Blob to a file): Use `Bun.write()` to write a `Blob` to disk. The first argument is a _destination_, like an absolute path or `BunFile` instance. The second  — `const path = "/path/to/file.txt";`
- **write-file/cat** (Write a file to stdout): Bun exposes `stdout` as a `BunFile` with the `Bun.stdout` property. Pass it as the destination to `Bun.write()`. — `const path = "/path/to/file.txt";`
- **write-file/file-cp** (Copy a file to another location): Use `Bun.write()` to copy a file to another location on disk. The first argument is a _destination_, like an absolute path or `BunFile` inst — `const file = Bun.file("/path/to/original.txt");`
- **write-file/filesink** (Write a file incrementally): Bun provides an API for incrementally writing to a file. Use it for large files, or when writing to a file over a long period of time. — `const file = Bun.file("/path/to/file.txt");`
- **write-file/response** (Write a Response to a file): Use `Bun.write()` to write a `Response` to disk. Bun writes the body of the `Response` to the destination. — `const result = await fetch("https://bun.com");`
- **write-file/stdout** (Write to stdout): The `console.log` function writes to `stdout` and appends a line break to the printed data. — `console.log("Lorem ipsum");`
- **write-file/stream** (Write a ReadableStream to a file): To write a `ReadableStream` to disk, call `.writer()` on a `BunFile` to get a `FileSink`. The stream is an async iterable, so write each of  — `const stream: ReadableStream = ...;`
- **write-file/unlink** (Delete a file): The `Bun.file()` function accepts a path and returns a `BunFile` instance. Use the `.delete()` method to delete the file. — `const path = "/path/to/file.txt";`

## Upstream Bun Dev Skills

### `implementing-jsc-classes-cpp`
- Purpose: Implements JavaScript classes in C++ using JavaScriptCore. Use when creating new JS classes with C++ bindings, prototypes, or constructors.
- Sections: Class Structure · Iso Subspaces · Property Definitions · Prototype Class · Getter/Setter/Function Definitions · Constructor Class · Structure Caching · Expose to Zig
- `src/jsc/bindings/webcore/DOMClientIsoSubspaces.h`
- `src/jsc/bindings/webcore/DOMIsoSubspaces.h`
- Key commands: `template<typename MyClassT, JSC::SubspaceAccess mode>`; `static JSC::GCClient::IsoSubspace* subspaceFor(JSC::VM& vm) {`; `if constexpr (mode == JSC::SubspaceAccess::Concurrently)`; `return nullptr;`

### `implementing-jsc-classes-rust`
- Purpose: Creates JavaScript classes using Bun's bindings generator (.bind.ts). Use when implementing new JS APIs in Rust with JSC integration, prototypes, or constructors.
- Sections: Schema · Rust · Where the struct lives · What a body may do · Holding JS values · Reference implementations
- Freed when its JS object is freed: it is stored inside the object. This is the default. Cleanup is `Drop`.
- Can outlive its object (a timer, another thread or a C library still points at it): `refCounted: true`. It is a separate,
- `src/jsc/bindgen_test.bind.ts` + `src/jsc/bindgen_test.rs`: an example of most keys
- `src/jsc/resolve_message.bind.ts`: cached getters, `prototypeBase`, `construct: "illegal"`
- `src/runtime/api/cron.bind.ts`: `refCounted`, `finalize`
- Key commands: `import * as b from "../../codegen/bindgen-lib.ts";`; `export const Matcher = b.class({`; `rustPath: "crate::api::matcher::Matcher",`; `construct: { args: { pattern: b.string.utf8 } },`

### `javascriptcore-garbage-collector`
- Purpose: JSC GC reference for Bun. Use for use-after-free, JS object leaks, "collected too early", or when touching WriteBarrier, visitChildren, visitAdditionalChildren, JSRef, JSC::Strong/Weak, hasPendingActivity, ensureStillAlive, addOpaqueRoot, reportExtraMemoryAllocated, IsoSubspace, HeapAnalyzer, finalize.
- Sections: The mental model · How the VM gathers roots · Object layout: the 8-byte JSCell header · CellState and the write barrier · Allocation: where objects live · Conservative stack scanning — what it does and doesn't guarantee · visitChildren — the per-cell tracing hook · visitAdditionalChildren and output constraints
- **Eden GC**: only scans newly-allocated objects + remembered set. Fast, frequent.
- **Full GC**: scans everything. Slower, rarer.
- `GreyedByExecution` — may produce new grey cells whenever the mutator runs (re-run after every resume)
- `GreyedByMarking` — may produce new grey cells when _other_ marking happens (re-run after each drain)
- `SeldomGreyed` — usually doesn't add anything; run last
- Key commands: `| StructureID (4) | indexingTypeAndMisc (1) | JSType (1) | flags (1) | cellState (1) |`; `PossiblyBlack   = 0   // visited (or old-space-pending-rescan during full GC)`; `DefinitelyWhite = 1   // new / unmarked`; `PossiblyGrey    = 2   // on the mark stack`

### `rust-system-calls`
- Purpose: Guides using bun_sys for system calls and file I/O in Rust. Use when implementing file operations, opening fds, or any syscall path instead of std::fs or libc.
- Sections: bun_sys::File (Preferred) · Complete Example · Why bun_sys? · Error Handling with Maybe<T> · Key Types and Functions · Path Buffers · Common Mistakes
- `Fd` (`bun_core::Fd`) — cross-platform file descriptor. `Fd::cwd()`, `Fd::stdin()/stdout()/stderr()`, `fd.close()`.
- `File::open(path: &ZStr, flags, mode)` / `File::openat(dir: Fd, path: &[u8], flags, mode)` / `File::make_open(...)` (creates parent dirs) / `File::create(dir,
- `file.read(buf)` / `read_all(buf)` / `read_to_end()` / `read_to_end_small()` / `write(buf)` / `write_all(buf)`
- `bun_sys::open`, `read`, `write`, `pread`, `pwrite`, `stat`, `fstat`, `lstat`, `mkdir`, `unlink`, `rename`, `symlink`, `chmod` — free fns over `Fd`
- `bun_sys::read_buf(fd, cursor)` / `file.read_all_buf(cursor)` / `pread_all_buf(cursor, offset)` — fill uninitialized memory through a `BorrowedCursor`; `bun_c
- Key commands: `use bun_sys::{File, Fd, O};`; `let file = File::openat(Fd::cwd(), b"path/to/file", O::RDONLY, 0)?;`; `let mut buf = vec![0u8; 4096];`; `let n = file.read_all(&mut buf)?;     // loops until EOF or full`

### `slowest-tests`
- Purpose: Find the top-N slowest test files in CI from a recent BuildKite run, optionally posting the results to a Slack channel as a formatted table. Use when asked to find slow CI tests, "what's making CI slow", or to post a slow-test report to Slack.
- Sections: 1. Gather the data · 2. Post to Slack (only if a channel was given)
- Lists `test-bun` jobs from `bk build view <N>`, skipping `retried: true`.
- Fetches each job's `raw_log_url` directly with `Authorization: Bearer $BUILDKITE_TOKEN`. **Do not use `bk job log` — it hangs indefinitely on some Windows/alp
- Caches logs to `$TMPDIR/bun-ci-logs-<build>/` so re-runs are instant.
- Parses `_bk;t=<ms> ... --- [N/TOTAL] <file>` group headers, normalising backslashes to `/` and stripping `[attempt #N]` retries.
- Aggregates each file's duration as the **max across all platforms** (a file appears once per platform; shards within a platform are disjoint).
- Key commands: `bun run ci:slowest                 # top 500 from a recent merged-PR build → TSV on stdout`; `bun run ci:slowest 47324 100       # specific build, top 100`; `bun run ci:slowest --json > /tmp/slow.json`

### `sync-react-compiler`
- Purpose: Re-sync src/react_compiler/ against upstream facebook/react. Use when bumping the React Compiler, when upstream lands a fix we need, or when src/react_compiler/UPSTREAM_PORTED is stale.
- Sections: Sync procedure
- **Whole-crate ports** (`hir/`, `diagnostics/`, `ssa/`, `inference/`,
- **AST-boundary ports** (`lowering/build_hir/`, `lowering/*.rs`, `codegen.rs`,

### `verify`
- Purpose: Verify a Bun runtime change by driving the debug binary end-to-end.
- Sections: Build · Drive · Gotchas
- **A `src/js/**` edit can silently not reach the binary.** `bundle-modules`
- **Prefix every `bun bd` with `PATH="$HOME/.cargo/bin:$PATH"`** — Homebrew's `rust`
- `node:cluster` changes can't be driven with `-e`: `cluster.fork()` re-execs `argv[1]`, so workers need a real file on disk. Write a scratch script and run `./
- Only one `bun bd` per worktree at a time — a second one blocks on the build lock and looks like a runtime hang. Build once, then drive `./build/debug/bun-debu
- `BUN_DEBUG_QUIET_LOGS=1` suppresses debug-build log spam.
- Key commands: `bun bd --version   # builds ./build/debug/bun-debug and prints its version`; `bun bd -e '<repro>'   # builds, then runs; sets BUN_DEBUG_QUIET_LOGS for you`

### `writing-bundler-tests`
- Purpose: Guides writing bundler tests using itBundled/expectBundled in test/bundler/. Use when creating or modifying bundler, transpiler, or code transformation tests.
- Sections: Basic Usage · File Setup · Bundler Options · Runtime Verification · Bundle Errors/Warnings · Dead Code Elimination (DCE) · Capture Pattern · Post-Bundle Assertions
- Use `dedent` for readable multi-line code
- File paths are relative (e.g., `/index.js`)
- Use `capture()` to verify exact transpilation results
- Use `.toMatchSnapshot()` for complex outputs
- Pass array to `run` for multiple test scenarios
- Key commands: `import { describe } from "bun:test";`; `import { itBundled, dedent } from "./expectBundled";`; `describe("bundler", () => {`; `itBundled("category/TestName", {`

### `writing-dev-server-tests`
- Purpose: Guides writing HMR/Dev Server tests in test/bake/. Use when creating or modifying dev server, hot reloading, or bundling tests.
- Sections: File Structure · Test Categories · devTest Basics · Key APIs · Testing Errors
- `test/bake/bake-harness.ts` - shared utilities: `devTest`, `prodTest`, `devAndProductionTest`, `Dev` class, `Client` class
- `test/bake/client-fixture.mjs` - subprocess for `Client` (page loading, IPC queries)
- `test/bake/dev/*.test.ts` - dev server and hot reload tests
- `test/bake/dev-and-prod.ts` - tests running on both dev and production mode
- `bundle.test.ts` - DevServer-specific bundling bugs
- Key commands: `import { devTest, emptyHtmlFile } from "../bake-harness";`; `devTest("html file is watched", {`; `files: {`; `"index.html": emptyHtmlFile({`
