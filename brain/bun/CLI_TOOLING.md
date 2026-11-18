# Bun CLI & Tooling Reference

Distilled from `docs/{runtime,test,bundler,compiler,pm,lint,format}` and `docs/snippets/cli/*.mdx`.

## `bun run` & Runtime Flags

### Bun Runtime — Execute JavaScript/TypeScript files, package.json scripts, and executable packages with Bun's fast runtime.
- Sections: Run a file · --watch · --check · Run a package.json script · --bun · Filtering · bun run - to pipe code from stdin · bun run --console-depth
- The Bun Runtime is designed to start fast and run fast.
- Bun uses the JavaScriptCore engine, developed by Apple for Safari. JavaScriptCore usually starts and runs faster than V8, the engine used by Node.js and Chromium-based browsers. Bu
```sh
bun run index.js
```
### Watch Mode — Automatic reloading in Bun with --watch and --hot modes
- Sections: --watch mode · --hot mode · HTTP servers
- Bun supports two kinds of automatic reloading:
- - `--watch` mode, which hard restarts Bun's process when imported files change.
```sh
bun --watch index.tsx
```
### bunfig.toml — Configure Bun's behavior using its configuration file bunfig.toml
- Sections: Global vs. local · Runtime · preload · jsx · smol · logLevel · define · loader
- `bunfig.toml` is Bun's configuration file.
- Bun relies on pre-existing configuration files like `package.json` and `tsconfig.json` where it can; `bunfig.toml` is only for Bun-specific settings. The file is optional, and Bun 
```sh
# scripts to run before `bun run`-ing a file or script
# register plugins by adding them to this list
preload = ["./preload.ts"]
```
### Debugging — Debug your Bun code with an interactive debugger using WebKit Inspector Protocol
- Sections: Debugging JavaScript and TypeScript · --inspect · --inspect-brk · --inspect-wait · Setting a port or URL for the debugger · Debuggers · debug.bun.sh · Visual Studio Code Debugger
- Bun speaks the WebKit Inspector Protocol, so you can debug your code with an interactive debugger. For demonstration purposes, consider the following web server.
- To enable debugging when running code with Bun, use the `--inspect` flag. This starts a WebSocket server on an available port for introspecting the running Bun process.
```sh
Bun.serve({
  fetch(req) {
    console.log(req.url);
    return new Response("Hello, world!");
  },
});
```
### REPL — An interactive JavaScript and TypeScript REPL with syntax highlighting, history, and tab completion
- Sections: Features · Special variables · Top-level await · Importing modules · Multi-line input · REPL commands · Keybindings · History
- `bun repl` starts an interactive Read-Eval-Print Loop (REPL) for evaluating JavaScript and TypeScript expressions. Use it to test code snippets, explore APIs, and debug.
- - **TypeScript & JSX** — Write TypeScript and JSX directly. Bun transpiles everything on the fly.
```sh
bun repl
```

### CLI Flags (`run.mdx`)

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--silent` | boolean | - | Don't print the script command |
| `--if-present` | boolean | - | Exit without an error if the entrypoint does not exist |
| `--eval` | string | - | Evaluate argument as a script. Alias: `-e` |
| `--print` | string | - | Evaluate argument as a script and print the result. Alias: `-p` |
| `--help` | boolean | - | Display this menu and exit. Alias: `-h` |
| `--elide-lines` | number | `0` | Truncate each script's output to its last N lines when using --filter. Default 0 shows all lines |
| `--filter` | string | - | Run a script in all workspace packages matching the pattern. Alias: `-F` |
| `--workspaces` | boolean | - | Run a script in all workspace packages (from the `workspaces` field in `package.json`) |
| `--parallel` | boolean | - | Run multiple scripts or workspace scripts concurrently with prefixed output |
| `--sequential` | boolean | - | Run multiple scripts or workspace scripts one after another with prefixed output |
| `--no-exit-on-error` | boolean | - | When using `--parallel` or `--sequential`, continue running other scripts when one fails |
| `--bun` | boolean | - | Force a script or package to use Bun's runtime instead of Node.js (via symlinking node). Alias: `-b` |
| `--shell` | string | - | Control the shell used for `package.json` scripts. Supports either `bun` or `system` |
| `--interactive` | boolean | - | Open the Node.js-compatible REPL (`node:repl`). When combined with `-e`, starts the REPL and then evaluates the script. Under `--interactive`, `-e` is raw JavaScript (matching `node -i -e`). Use `bun repl` for TypeScript. Distinct from `bun repl`, which is Bun's native REPL. |
| `--smol` | boolean | - | Use less memory, but run garbage collection more often |
| `--aot` | boolean | - | Check the program like `bun compile` does, then run it with built-in objects read-only |
| `--aot-allow-code-from-disk` | boolean | - | With `--aot`: check the program like `bun compile --aot-allow-code-from-disk` does |
| `--expose-gc` | boolean | - | Expose `gc()` on the global object. Has no effect on `Bun.gc()` |
| `--no-deprecation` | boolean | - | Silence all deprecation warnings |
| `--throw-deprecation` | boolean | - | Throw deprecation warnings as errors |
| `--title` | string | - | Set the process title |
| `--zero-fill-buffers` | boolean | - | Force `Buffer.allocUnsafe(size)` to be zero-filled |
| `--no-addons` | boolean | - | Throw an error if `process.dlopen` or `bun:ffi` `cc()` is called, and disable export condition `node-addons` |
| `--no-ffi-cc` | boolean | - | Throw an error if `bun:ffi` `cc()` is called (disables the C compiler) |
| `--unhandled-rejections` | string | - | One of `strict`, `throw`, `warn`, `none`, or `warn-with-error-code` |
| `--console-depth` | number | `2` | Set the default depth for `console.log` object inspection (default: 2) |
| `--check` | boolean | - | Type check before running. Nothing runs if there are type errors. See bun check |
| `--watch` | boolean | - | Automatically restart the process on file change |
| `--watch-kill-signal` | string | `SIGTERM` | Signal whose handlers run when --watch restarts the process |
| `--hot` | boolean | - | Enable auto reload in the Bun runtime, test runner, or bundler |
| `--no-clear-screen` | boolean | - | Disable clearing the terminal screen on reload when --hot or --watch is enabled |
| `--inspect` | string | - | Activate Bun's debugger |
| `--inspect-wait` | string | - | Activate Bun's debugger, wait for a connection before executing |
| `--inspect-brk` | string | - | Activate Bun's debugger, set breakpoint on first line of code and wait |
| `--preload` | string | - | Import a module before Bun loads other modules. Alias: `-r` |
| `--require` | string | - | Alias of --preload, for Node.js compatibility |
| `--import` | string | - | Alias of --preload, for Node.js compatibility |
| `--no-install` | boolean | - | Disable auto install in the Bun runtime |
| `--install` | string | `auto` | Configure auto-install behavior. One of `auto` (default, auto-installs when no node_modules), `fallback` (missing packages only), `force` (always) |
| `-i` | boolean | - | Auto-install dependencies during execution. Equivalent to --install=fallback |
| `--prefer-offline` | boolean | - | Skip staleness checks for packages in the Bun runtime and resolve from disk |
| `--prefer-latest` | boolean | - | Use the latest matching versions of packages in the Bun runtime, always checking npm |
| `--conditions` | string | - | Pass custom conditions to resolve |
| `--main-fields` | string | - | Main fields to lookup in `package.json` |
| `--preserve-symlinks` | boolean | - | Preserve symlinks when resolving files |
| `--preserve-symlinks-main` | boolean | - | Preserve symlinks when resolving the main entry point |
| `--extension-order` | string | `.tsx,.ts,.jsx,.cts,.cjs,.js,.mjs,.mts,.json,.node` | Defaults to: `.tsx,.ts,.jsx,.cts,.cjs,.js,.mjs,.mts,.json,.node` |
| `--tsconfig-override` | string | - | Specify custom `tsconfig.json`. Default `$cwd/tsconfig.json` |
| `--define` | string | - | Substitute K:V while parsing, e.g. `--define process.env.NODE_ENV:"development"`. Bun parses values as JSON. Alias: `-d` |
| `--drop` | string | - | Remove function calls, e.g. `--drop=console` removes all `console.*` calls |
| `--loader` | string | - | Parse files with `.ext:loader`, e.g. `--loader .js:jsx`. Valid loaders: `js`, `jsx`, `ts`, `tsx`, `json`, `toml`, `text`, `file`, `wasm`, `napi`. Alias: `-l` |
| `--no-macros` | boolean | - | Disable macro execution in the bundler, transpiler and runtime |
| `--jsx-factory` | string | - | Changes the function called when compiling JSX elements using the classic JSX runtime |
| `--jsx-fragment` | string | - | Changes the function called when compiling JSX fragments |
| `--jsx-import-source` | string | `react` | Declares the module specifier used to import the jsx and jsxs factory functions. Default: `react` |
| `--jsx-runtime` | string | `automatic` | `automatic` (default) or `classic` |
| `--jsx-side-effects` | boolean | - | Treat JSX elements as having side effects (disable pure annotations) |
| `--ignore-dce-annotations` | boolean | - | Ignore tree-shaking annotations such as `@__PURE__` |
| `--port` | number | - | Set the default port for `Bun.serve` |
| `--fetch-preconnect` | string | - | Preconnect to a URL while code is loading |
| `--max-http-header-size` | number | `16384` | Set the maximum size of HTTP headers in bytes. Default is 16KiB |
| `--dns-result-order` | string | `verbatim` | Set the default order of DNS lookup results. Valid orders: `verbatim` (default), `ipv4first`, `ipv6first` |
| `--use-system-ca` | boolean | - | Use the system's trusted certificate authorities |
| `--use-openssl-ca` | boolean | - | Use OpenSSL's default CA store instead of the bundled one |
| `--use-bundled-ca` | boolean | - | Use bundled CA store |
| `--redis-preconnect` | boolean | - | Preconnect to `$REDIS_URL` at startup |
| `--sql-preconnect` | boolean | - | Preconnect to PostgreSQL at startup |
| `--user-agent` | string | - | Set the default User-Agent header for HTTP requests |
| `--env-file` | string | - | Load environment variables from the specified file(s) |
| `--cwd` | string | - | Absolute path to resolve files &amp; entrypoints from. This only changes the process' cwd |
| `--config` | string | - | Specify path to Bun config file. Default `$cwd/bunfig.toml`. Alias: `-c` |

## `bun test` (Test Runner)

### Test runner — Bun's fast, built-in, Jest-compatible test runner with TypeScript support, lifecycle hooks, mocking, and watch mode
- Sections: Run tests · CI/CD integration · GitHub Actions · JUnit XML reports (GitLab, etc.) · Timeouts · Concurrent test execution · --concurrent flag · --max-concurrency flag
- Bun ships with a fast, built-in, Jest-compatible test runner. Tests run in the Bun runtime and support the following features.
- - Watch mode with `--watch`
```sh
bun test
```
### Writing tests — Write tests with Bun's Jest-compatible API, including async tests, timeouts, and test modifiers
- Sections: Basic Usage · Grouping Tests · Async Tests · Timeouts · Retries and Repeats · test.retry · test.repeats · 🧟 Zombie Process Killer
- Define tests with a Jest-like API imported from the built-in `bun:test` module. Long term, Bun aims for complete Jest compatibility.
- Group tests into suites with `describe`.
```sh
test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});
```
### Test configuration — Configure bun test behavior with bunfig.toml and command-line options
- Sections: Configuration File · Test Discovery · root · Preload Scripts · Environment · Globals · React Compiler · Path Ignore Patterns
- Configure `bun test` with `bunfig.toml` and command-line options.
- To configure `bun test` in `bunfig.toml`, add a `[test]` section:
```sh
[test]
# Options go here
```
### Mocks — Learn how to create and use mock functions, spies, and module mocks in Bun tests
- Sections: Basic Function Mocks · Jest Compatibility · Mock Function Properties · Available Properties and Methods · Practical Examples · Spies with spyOn() · Advanced Spy Usage · Getters and Setters
- Mocking replaces a dependency with a controlled implementation. Bun supports function mocks, spies, and module mocks.
- Create mocks with the `mock` function.
```sh
const random = mock(() => Math.random());

test("random", () => {
  const val = random();
  expect(val).toBeGreaterThan(0);
  expect(random).toHaveBeenCalled();
  expect(random).toHaveBeenCalledTimes(1);
});
```
### Snapshots — Learn how to use snapshot testing in Bun to save and compare output between test runs
- Sections: Basic Snapshots · Snapshot Files · Updating Snapshots · Inline Snapshots · Using Inline Snapshots · Error Snapshots · File Snapshots · Advanced Snapshot Usage
- Snapshot testing saves the output of a value and compares it against future test runs. Use it for UI components, complex objects, or any output that needs to remain consistent.
- Write snapshot tests with the `.toMatchSnapshot()` matcher:
```sh
test("snap", () => {
  expect("foo").toMatchSnapshot();
});
```
### Code coverage — Use Bun's built-in code coverage reporting to track test coverage and find untested code
- Sections: Enabling Coverage · Enable by Default · Coverage Thresholds · Simple Threshold · Detailed Thresholds · Coverage Reporters · Available Reporters · LCOV Coverage Reporter
- Bun's test runner has built-in code coverage reporting. Use it to see how much of your codebase your tests cover and to find untested code.
- `bun:test` can report which lines of code your tests cover. Pass `--coverage` to print a coverage report to the console:
```sh
[test]
# Always enable coverage
coverage = true
```
### DOM testing — Learn how to test DOM elements and components using Bun with happy-dom and React Testing Library
- Sections: Test environments · Options · Windows and test files · Registering happy-dom in a preload · TypeScript Support · React Testing Library · Advanced DOM Testing · Custom Elements
- Bun's test runner plays well with existing component and DOM testing libraries, including React Testing Library and happy-dom.
- `bun test` can set up happy-dom or jsdom for you. Test files get the same globals they get in Vitest (`window`, `document`, `HTMLElement`, ...). Install the one you want as a dev d
```sh
bun add -d happy-dom
```

### CLI Flags (`test.mdx`)

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--check` | boolean | - | Type check the test files and everything they import. No test runs if there are type errors |
| `--aot` | boolean | - | Compile the test files ahead of time, then run them. See Run your tests compiled |
| `--no-compile-function-source` | boolean | - | With `--aot`: don't embed function source code. `fn.toString()` returns `[native code]` |
| `--timeout` | number | `5000` | Set the per-test timeout in milliseconds (default 5000) |
| `--rerun-each` | number | - | Re-run each test file `NUMBER` times to help catch certain bugs |
| `--retry` | number | - | Retry failed tests up to `NUMBER` times. Per-test `{`{ retry: N }`}` overrides this flag |
| `--concurrent` | boolean | - | Treat all tests as `test.concurrent()` tests |
| `--randomize` | boolean | - | Run tests in random order |
| `--seed` | number | - | Set the random seed for test randomization |
| `--bail` | number | - | Exit the test suite after `NUMBER` failures. If you do not specify a number, it defaults to 1. |
| `--max-concurrency` | number | `20` | Maximum number of concurrent tests to execute at once (default 20) |
| `--environment` | string | `node` | The DOM that test files run with: `node` (no DOM), `jsdom` or `happy-dom`. A `@vitest-environment` or `@jest-environment` comment in a file overrides it |
| `--globals` | string | `bun` | Where `test`, `expect` and the other globals come from. With `bun`, a file that imports from `"vitest"` gets them from there and any other file gets them from `"bun:test"`. With `vitest`, every file gets them from `"vitest"` |
| `--react-compiler` | boolean | - | Compile components and hooks with the React Compiler. Test files, preload scripts and `node_modules` are left alone |
| `--todo` | boolean | - | Include tests that are marked with `test.todo()` |
| `--test-name-pattern` | string | - | Run only tests with a name that matches the given regex. Alias: `-t` |
| `--reporter` | string | - | Test output reporter format. Available: `junit` (requires --reporter-outfile), `dots`. Default: console output. |
| `--reporter-outfile` | string | - | Output file path for the reporter format (required with --reporter=junit) |
| `--reporter-junit-suites` | string | - | How --reporter=junit writes describe blocks. `nested` (the default) gives each block its own testsuite inside the file's testsuite. `flat` prefixes each test's name with its block names |
| `--dots` | boolean | - | Enable dots reporter. Shorthand for --reporter=dots |
| `--coverage` | boolean | - | Generate a coverage profile |
| `--coverage-reporter` | string | `text` | Report coverage in `text` and/or `lcov`. Defaults to `text`. Implies `--coverage` |
| `--coverage-dir` | string | `coverage` | Directory for coverage files. Defaults to `coverage` |
| `--update-snapshots` | boolean | - | Update snapshot files. Alias: `-u` |

## `bun build` & `bun compile` (Bundler & Compiler)

### Bundler — Bun's fast native bundler for JavaScript, TypeScript, JSX, and more
- Sections: At a Glance · Why bundle? · Basic example · Watch mode · Content types · Assets · Plugins · API
- Use Bun's native bundler through the `bun build` CLI command or the `Bun.build()` JavaScript API.
- - JS API: `await Bun.build({ entrypoints, outdir })`
```sh
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Component message="Sup!" />);
```
### Fullstack dev server — Build fullstack applications with Bun's integrated dev server that bundles frontend assets and handles API routes
- Sections: HTML Routes · HTML Imports as Routes · HTML Processing Example · React Integration · Development Mode · Development Mode Features · Advanced Development Configuration · Development vs Production
- To get started, import HTML files and pass them to the `routes` option in `Bun.serve()`.
- To specify entrypoints to your frontend, import HTML files into your JavaScript/TypeScript/TSX/JSX files.
```sh
bun run app.ts
```
### Plugins — Universal plugin API for extending Bun's runtime and bundler
- Sections: Lifecycle hooks · Reference · Usage · Plugin lifecycle · Namespaces · onStart · onResolve · onLoad
- Bun's universal plugin API extends both the runtime and the bundler.
- Plugins intercept imports and perform custom loading logic, such as reading files or transpiling code. They can add support for additional file types, like `.scss`. In the bundler,
```sh
const myPlugin: BunPlugin = {
  name: "Custom loader",
  setup(build) {
    // implementation
  },
};
```
### Macros — Run JavaScript functions at bundle-time with Bun macros
- Sections: When to use macros · Import attributes · Security considerations · Export condition "macro" · Execution · Dead code elimination · Serializability · Arguments
- Macros are JavaScript functions that run at bundle-time. Bun inlines their return values directly into your bundle.
- As a toy example, consider this function that returns a random number.
```sh
export function random() {
  return Math.random();
}
```
### Compiler — Turn a TypeScript or JavaScript program into one executable file
- Sections: Two ways to compile · Read next
- Bun turns a TypeScript or JavaScript program into one executable file. It runs on machines that don't have Bun installed.
- `bun build --compile` runs nearly everything that `bun run` runs. With `bun compile`, which is short for `bun build --compile --aot`, your program starts faster, and a few things d
```sh
console.log("Hello world!");
```
### Single-file executable — Generate standalone executables from TypeScript or JavaScript files with Bun
- Sections: Cross-compile to other platforms · Supported targets · Build-time constants · Deploying to production · Bytecode compilation · What do these flags do? · Profile-guided bytecode layout · JIT policy
- Bun's bundler implements a `--compile` flag for generating a standalone binary from a TypeScript or JavaScript file.
- ```bash terminal icon="terminal"
```sh
console.log("Hello world!");
```
### Ahead-of-time compilation — Compile TypeScript and JavaScript to machine code at build time, with bun compile
- Sections: What to expect · When to stay with the JIT · Build an executable · Type errors stop the build · Harden the compiled code · Order the executable by a recorded start · Read next
- Ahead-of-time compilation is experimental.
- `bun compile` compiles your program to machine code at build time and writes one executable. It runs on machines that don't have Bun installed.
```sh
bun compile ./server.ts
./server
```

### CLI Flags (`build.mdx`)

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--production` | boolean | - | Set `NODE_ENV=production` and enable minification |
| `--bytecode` | boolean | - | Use a bytecode cache when compiling |
| `--bytecode-depth` | number | - | How many levels of nested functions to compile to bytecode ahead of time (a non-negative integer). Defaults to all |
| `--no-optimize-bytecode` | boolean | - | With `--bytecode`: skip the build-time bytecode optimization passes |
| `--bytecode-order` | string | - | With `--compile --bytecode`: lay the bytecode out by the order files that a run of the executable wrote with `BUN_BYTECODE_ORDER_OUT`. Comma-separated or repeated, most important first |
| `--target` | string | `browser` | Intended execution environment for the bundle. One of `browser`, `bun`, or `node` |
| `--conditions` | string | - | Pass custom resolution conditions |
| `--env` | string | `disable` | Inline environment variables into the bundle as `process.env.${name}`. To inline variables matching a prefix, use a glob like `FOO_PUBLIC_*` |
| `--outdir` | string | `dist` | Output directory (used when building multiple entry points) |
| `--outfile` | string | - | Write output to a specific file |
| `--metafile` | string | - | Write a JSON file with metadata about the build |
| `--metafile-md` | string | - | Write a markdown file with a visualization of the module graph (LLM-friendly) |
| `--sourcemap` | string | `none` | Generate source maps. One of `linked`, `inline`, `external`, or `none`. With `--aot`, only `external` has an effect. It does what `--obfuscate` does, but functions and classes keep their `name` |
| `--banner` | string | - | Add a banner to the output (e.g. `"use client"` for React Server Components) |
| `--footer` | string | - | Add a footer to the output (e.g. `// built with bun!`) |
| `--format` | string | `esm` | Module format of the output bundle. One of `esm`, `cjs`, or `iife`. Defaults to `cjs` when `--bytecode` is used. |
| `--entry-naming` | string | `[dir]/[name].[ext]` | Customize entry point filenames |
| `--chunk-naming` | string | `[name]-[hash].[ext]` | Customize chunk filenames |
| `--asset-naming` | string | `[name]-[hash].[ext]` | Customize asset filenames |
| `--root` | string | - | Root directory used when bundling multiple entry points |
| `--splitting` | boolean | - | Enable code splitting for shared modules |
| `--min-chunk-size` | number | - | With `--splitting`, also fold side-effect-free chunks smaller than this many source bytes into a chunk loaded by a superset of their importers |
| `--no-module-preload` | boolean | - | With `--splitting` and `--target browser`, don't emit ` ` for the chunks an entrypoint or `import()` depends on |
| `--public-path` | string | - | Prefix the bundler adds to import paths in bundled code |
| `--external` | string | - | Exclude modules from the bundle (supports wildcards). Alias: `-e` |
| `--allow-unresolved` | string | `*` | Allow unresolved dynamic import()/require() specifiers matching these glob patterns. Pass `''` to allow opaque specifiers |
| `--reject-unresolved` | boolean | - | Fail the build on any dynamic import()/require() specifier that cannot be resolved at build time |
| `--packages` | string | `bundle` | How to treat dependencies: `external` or `bundle` |
| `--no-bundle` | boolean | - | Transpile only — do not bundle |
| `--css-chunking` | boolean | - | Chunk CSS files together to reduce duplication (only when multiple entry points import CSS) |
| `--emit-dce-annotations` | boolean | `true` | Re-emit Dead Code Elimination annotations. Disabled when `--minify-whitespace` is used |
| `--no-deprecated-namespace-object-setters` | boolean | - | Emit getter-only module namespace objects (assigning to a property throws, like a real namespace). This becomes the default in a future release |
| `--minify` | boolean | - | Enable all minification options |
| `--minify-syntax` | boolean | - | Minify syntax and inline constants |
| `--minify-whitespace` | boolean | - | Minify whitespace |
| `--minify-identifiers` | boolean | - | Minify variable and function identifiers |
| `--keep-names` | boolean | - | Preserve original function and class names when minifying |
| `--check` | boolean | - | Type check the entry points and everything they import. Nothing is bundled if there are type errors |
| `--dts` | boolean | - | Write declaration files (`.d.ts`), and each output file with its types kept (`.aot.ts`), to `--outdir`. Implies `--check` |
| `--watch` | boolean | - | Rebuild automatically when files change |
| `--no-clear-screen` | boolean | - | Don’t clear the terminal when rebuilding with `--watch` |
| `--react-fast-refresh` | boolean | - | Enable React Fast Refresh transform (for development testing) |
| `--react-compiler` | boolean | - | Run the React Compiler over `.jsx`/`.tsx` files, automatically memoizing components and hooks. The bundler derives the output mode from `--target` (`browser` → client, `bun`/`node` → ssr). Experimental. |
| `--compile` | boolean | - | Generate a standalone Bun executable containing the bundle |
| `--compile-exec-argv` | string | - | Prepend arguments to the standalone executable’s `execArgv` |
| `--disallow-code-generation-from-strings` | string | - | In the standalone executable, `eval()` and `new Function()` throw an `EvalError`, like Node.js's flag of the same name. `=strict` also blocks every other way to run code from a string. Requires `--compile` |
| `--aot` | boolean | - | Compile JavaScript and TypeScript to machine code at build time. Requires `--compile`. `--format` and `--bytecode` have no effect with it |
| `--explain` | string | - | With `--aot`: list the code that compiled to a slow path, worst first, with a fix for each. `--explain=json` prints one object per line. Other reports: `guards`, `guards-json`, `trim`, `allocations` |
| `--aot-huge-heap` | boolean | - | With `--aot`: remove the 32 GB heap limit per thread. The executable uses more memory and runs slower |
| `--no-compile-function-source` | boolean | - | With `--aot`: don't embed function source code. `fn.toString()` returns `[native code]` |
| `--compile-inspector` | boolean | - | With `--aot`: let a debugger attach to the executable. Makes it larger and slower |
| `--aot-allow-code-from-disk` | boolean | - | With `--aot`: let `import()`, `require()` and `new Worker()` load code that isn't in the executable from disk at run time. Makes it larger and slower |
| `--aot-order` | string | - | With `--aot`: lay the executable out by the order file that runs of it wrote ( `--aot-record-order`), so that it starts faster from a cold disk. Takes a list of files, most important first |
| `--aot-record-order` | boolean | - | With `--aot`: build an executable that writes an order file when it runs with `BUN_AOT_ORDER_OUT` |
| `--aot-harden` | string | - | With `--aot`: make a bug in the compiler harder to turn into a memory bug. Takes a list of `proof-checks` and `ignore-told-ranges`. The executable runs slower |
| `--compile-in-place` | boolean | - | With `--aot`: keep modules at their paths on disk and load anything that wasn't compiled from there. The executable only runs on the machine that built it |
| `--obfuscate` | boolean | - | With `--aot`: strip function names and source locations from the executable and write them to `&lt;outfile&gt;.map`. The `name` of every function and class is empty, and `fn.toString()` returns `[native code]` |
| `--trim` | boolean | - | Remove the Bun and Node.js APIs your code never calls from the executable. Requires `--compile` |
| `--trim-locales` | string | - | Keep only these locales, such as `en,de-AT`. Implies `--trim` |
| `--compile-jit-policy` | number | `1` | JIT tier-up threshold scale the executable starts with; `1` is the normal JIT policy. See `Bun.unsafe.setJITPolicy` |
| `--compile-autoload-dotenv` | boolean | `true` | Enable autoloading of `.env` files in the standalone executable |
| `--no-compile-autoload-dotenv` | boolean | - | Disable autoloading of `.env` files in the standalone executable |
| `--compile-autoload-bunfig` | boolean | `true` | Enable autoloading of `bunfig.toml` in the standalone executable |
| `--no-compile-autoload-bunfig` | boolean | - | Disable autoloading of `bunfig.toml` in the standalone executable |
| `--compile-autoload-tsconfig` | boolean | `false` | Enable autoloading of `tsconfig.json` at runtime in the standalone executable |
| `--no-compile-autoload-tsconfig` | boolean | - | Disable autoloading of `tsconfig.json` at runtime in the standalone executable |
| `--compile-autoload-package-json` | boolean | `false` | Enable autoloading of `package.json` at runtime in the standalone executable |
| `--no-compile-autoload-package-json` | boolean | - | Disable autoloading of `package.json` at runtime in the standalone executable |
| `--compile-executable-path` | string | - | Path to a Bun executable to use for cross-compilation instead of downloading |
| `--asset` | string | - | Embed a file or directory into the compiled executable under its basename; a directory keeps its internal tree, so `--asset ./static/public` embeds `public/...` (requires `--compile`) |
| `--windows-hide-console` | boolean | - | Prevent a console window from opening when running a compiled Windows executable |
| `--windows-icon` | string | - | Set an icon for the Windows executable |
| `--windows-title` | string | - | Set the Windows executable product name |
| `--windows-publisher` | string | - | Set the Windows executable company name |
| `--windows-version` | string | - | Set the Windows executable version (e.g. `1.2.3.4`) |
| `--windows-description` | string | - | Set the Windows executable description |
| `--windows-copyright` | string | - | Set the Windows executable copyright notice |
| `--app` | boolean | - | (EXPERIMENTAL) Build a web app for production using Bun Bake |
| `--debug-dump-server-files` | boolean | - | When `--app` is set, dump all server files to disk even for static builds |
| `--debug-no-minify` | boolean | - | When `--app` is set, disable all minification |

## `bun install` / `add` / `remove` / `update` / `pm` / `bunx`

### bun install — Install packages with Bun's fast package manager
- Sections: Basic Usage · Logging · Lifecycle scripts · Workspaces · Installing dependencies for specific packages · Overrides and resolutions · Global packages · Production mode
- The `bun` CLI contains a Node.js-compatible package manager designed to be a dramatically faster replacement for `npm`, `yarn`, and `pnpm`. It's a standalone tool that works in exi
- **⚡️ 25x faster** — Switch from `npm install` to `bun install` in any Node.js project to make your installations up to 25x faster.
```sh
bun install react
bun install react@19.1.1 # specific version
bun install react@latest # specific tag
```
### bun add — Add packages to your project with Bun's fast package manager
- Sections: --dev · --optional · --peer · --save-prod · --exact · --catalog · --filter · --global
- To add a particular package:
- To specify a version, version range, or tag:
```sh
bun add preact
```
### bun remove — Remove dependencies from your project
- Sections: Basic Usage · --filter
- **Alias** — `bun rm`, `bun uninstall`, `bun r`
- Bun removes the package from every dependency group in `package.json` that lists it and updates `bun.lock`. Once nothing else depends on the package, Bun deletes it from `node_modu
```sh
bun remove ts-node
```
### bun update — Update dependencies to the newest versions their ranges allow
- Sections: How package.json is rewritten · What is held back · --interactive · Interactive Interface · Keyboard Controls · Visual Indicators · Package Grouping · --recursive and --filter
- To upgrade your Bun CLI version, see `bun upgrade`.
- `bun update` (alias `bun up`) updates every dependency, direct and transitive, to the newest version allowed by the ranges that request it. It then rewrites `package.json` and `bun
```sh
bun update
```
### Workspaces — Develop complex monorepos with multiple independent packages
- Sections: Self-contained workspaces · Share versions with Catalogs
- Bun supports `workspaces` in `package.json`. With workspaces, you develop several independent packages in a single repository, a _monorepo_.
- A monorepo commonly has this structure:
```sh
{
  "name": "my-project",
  "version": "1.0.0",
  "workspaces": ["packages/*"],
  "devDependencies": {
    "example-package-in-monorepo": "workspace:*"
  }
}
```
### Catalogs — Share common dependency versions across multiple packages in a monorepo
- Sections: Overview · How to Use Catalogs · Directory Structure Example · 1. Define Catalogs in Root package.json · 2. Reference Catalog Versions in Workspace Packages · 3. Run Bun Install · Catalog vs Catalogs · Benefits of Using Catalogs
- **Catalogs** share dependency versions across the packages in a monorepo. Rather than repeating the same versions in each workspace package, you define them once in the root `packa
- Instead of each workspace package specifying its own versions, you:
```sh
my-monorepo/
├── package.json
├── bun.lock
└── packages/
    ├── app/
    │   └── package.json
    ├── ui/
    │   └── package.json
    └── utils/
        └── package.json
```
### Lockfile — Bun's lockfile format and configuration
- `bun install` creates a lockfile called `bun.lock`.
- #### Should it be committed to git?
```sh
bun install --lockfile-only
```
### Isolated installs — Strict dependency isolation similar to pnpm's approach
- Sections: What are isolated installs? · Key benefits · Using isolated installs · Command line · Configuration file · Default behavior · How isolated installs work · Directory structure
- Bun provides an alternative package installation strategy called **isolated installs** that creates strict dependency isolation similar to pnpm's approach. This mode prevents phant
- Isolated installs are the default for **new** workspace/monorepo projects (with `configVersion = 1` in the lockfile). Existing projects continue using hoisted installs unless expli
```sh
# Use isolated installs
bun install --linker isolated

# Use traditional hoisted installs
bun install --linker hoisted
```
### bun pm — Package manager utilities
- Sections: pack · Examples · Options · Output Modes · bin · ls · licenses · diff
- The `bun pm` command group is a set of utilities for working with Bun's package manager.
- To create a tarball of the current workspace:
```sh
bun pm pack
```
### bunx — Run packages from npm
- Sections: Arguments and flags · Shebangs · Package flag
- `bunx` is an alias for `bun x`. The `bunx` CLI is auto-installed when you install `bun`.
- Use `bunx` to auto-install and run packages from `npm`. It's Bun's equivalent of `npx` or `yarn dlx`.
```sh
bunx cowsay "Hello world!"
```

### CLI Flags (`install.mdx`)

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--config` | string | - | Specify path to config file (bunfig.toml) |
| `--cwd` | string | - | Set a specific cwd |
| `--env-file` | string | - | Load environment variables from the specified file(s) |
| `--no-env-file` | boolean | - | Disable automatic loading of .env files |
| `--production` | boolean | - | Don't install devDependencies |
| `--no-save` | boolean | - | Don't update package.json or save a lockfile |
| `--save` | boolean | `true` | Save to package.json |
| `--omit` | string | - | Exclude 'dev', 'optional', or 'peer' dependencies from install |
| `--only-missing` | boolean | - | Only add dependencies to package.json if they are not already present |
| `--dev` | boolean | - | Add dependency to "devDependencies" |
| `--optional` | boolean | - | Add dependency to "optionalDependencies" |
| `--peer` | boolean | - | Add dependency to "peerDependencies" |
| `--save-prod` | boolean | - | Add dependency to "dependencies", also when another group lists it |
| `--exact` | boolean | - | Add the exact version instead of the ^ range |
| `--yarn` | boolean | - | Write a yarn.lock file (yarn v1) |
| `--frozen-lockfile` | boolean | - | Disallow changes to lockfile |
| `--save-text-lockfile` | boolean | - | Save a text-based lockfile |
| `--lockfile-only` | boolean | - | Generate a lockfile without installing dependencies |
| `--ca` | string | - | Provide a Certificate Authority signing certificate |
| `--cafile` | string | - | File path to Certificate Authority signing certificate |
| `--use-system-ca` | boolean | - | Use the system's trusted certificate authorities |
| `--use-openssl-ca` | boolean | - | Use OpenSSL's default CA store instead of the bundled one |
| `--use-bundled-ca` | boolean | - | Use bundled CA store |
| `--registry` | string | - | Use a specific registry by default, overriding .npmrc, bunfig.toml and environment variables |
| `--dry-run` | boolean | - | Resolve dependencies but don't install packages, update package.json, save a lockfile, or run the project's lifecycle scripts |
| `--force` | boolean | - | Always request the latest versions from the registry & reinstall all dependencies |
| `--global` | boolean | - | Install globally |
| `--backend` | string | - | Platform-specific optimizations: "clonefile", "hardlink", "symlink", "copyfile" |
| `--filter` | string | - | Install packages for the matching workspaces |
| `--analyze` | boolean | - | Recursively analyze & install all dependencies of files passed as arguments |
| `--cache-dir` | string | - | Store & load cached data from a specific directory path |
| `--no-cache` | boolean | - | Ignore manifest cache entirely |
| `--silent` | boolean | - | Don't log anything |
| `--verbose` | boolean | - | Excessively verbose logging |
| `--no-progress` | boolean | - | Disable the progress bar |
| `--no-summary` | boolean | - | Don't print a summary |
| `--no-verify` | boolean | - | Skip verifying integrity of newly downloaded packages |
| `--trust` | boolean | - | Add to trustedDependencies in the project's package.json and install the package(s) |
| `--concurrent-scripts` | number | - | Maximum number of concurrent jobs for lifecycle scripts (default: 2x CPU cores) |
| `--network-concurrency` | number | `64` | Maximum number of concurrent network requests |
| `--ignore-scripts` | boolean | - | Skip lifecycle scripts for all packages, including the project's package.json and trusted dependencies. Also set by `NPM_CONFIG_IGNORE_SCRIPTS=true` in the environment |
| `--help` | boolean | - | Print this help menu |

## `bun check` (Native TypeScript 7 Type Checker)

### Type checking — Type check your TypeScript project with bun check
- Sections: Set up a project · Replace tsc · Coming from TypeScript 5 · Run in CI · GitHub Actions · GitLab CI and other providers · What to expect in CI · Check before you commit
- `bun check` type checks your TypeScript project. It reads your `tsconfig.json`, reports the same errors as `tsc` from TypeScript 7, and uses every CPU core.
- `bun check` exits with code `1` if it finds an error and `0` if it finds none. It never writes files.
```sh
bun check
```
### TypeScript — Using TypeScript with Bun, including type definitions and compiler options
- Sections: Suggested compilerOptions · Type checking · TypeScript 6 and 7
- To get TypeScript definitions for Bun's built-in APIs, install `@types/bun`.
- You can now reference the `Bun` global in your TypeScript files without errors in your editor.
```sh
bun add -d @types/bun # dev dependency
```
### TypeScript 6 and 7 — How to configure Bun's type definitions for TypeScript 6.0 and 7.0, which no longer auto-discover @types packages. Fix 'Cannot find name Bun' and other missing type errors after upgrading TypeScript.
- Sections: What changed · Add "types": ["bun"] to your tsconfig · Full recommended tsconfig.json · Does this apply to TypeScript 7? · Does this apply to bun check?
- TypeScript 6.0 changed how it discovers type definitions. If you've upgraded TypeScript and your editor no longer recognizes `Bun`, `Request`, or other globals from `@types/bun`, h
- Starting in TypeScript 6.0, the `types` field in `compilerOptions` defaults to an empty array instead of including all `@types/*` packages. You now need to explicitly list the type
```sh
{
  "compilerOptions": {
    "types": ["bun"], // [!code ++]
  },
}
```

## `bun lint` (Native Linter)

### Linter — Bun's fast, built-in linter for JavaScript, TypeScript, and JSX
- Sections: Run the linter · Fix problems · Default rules · Configure rules · Find a rule · Add an ESLint plugin · Turn on a group of rules · Turn a plugin off
- Bun ships with a fast, built-in linter. There's nothing to install and nothing to configure.
- - 1,000+ rules from ESLint, typescript-eslint, React, import, unicorn, jsx-a11y, Jest, Vitest, and more
```sh
bun lint
```
### ESLint plugins — Run ESLint plugins in bun lint, and write your own rules
- Sections: Plugins from npm · Performance · Run the installed package instead · prettier/prettier · Other languages · Processors · Notes
- `bun lint` runs ESLint plugins, both from npm and your own. Rules get the same `context`, `sourceCode`, scopes, and fixers as in ESLint.
- This plugin has one rule, which reports `TODO` comments:
```sh
[lint]
plugins = ["./lint/plugin.js"]

[lint.rules]
"local/no-todo" = "warn"
```
### Migrate from ESLint to bun lint
- Sections: Differences from ESLint
- `bun lint` reads your `eslint.config.js` and prints the same report as ESLint 10. In most projects you only change the command.
- Flags and arguments stay the same: `eslint --fix src` becomes `bun lint --fix src`. Change CI, lint-staged, and Git hooks too.
```sh
{
  "scripts": {
    "lint": "eslint --max-warnings 0", // [!code --]
    "lint": "bun lint --max-warnings 0" // [!code ++]
  }
}
```
### Migrate from oxlint to bun lint
- Sections: Differences from oxlint
- `bun lint` reads your `.oxlintrc.json` and reports the same problems as oxlint 1.87. In most projects you only change the command.
- Flags and arguments stay the same: `oxlint -D no-console src` becomes `bun lint -D no-console src`. Change CI, lint-staged, and Git hooks too.
```sh
{
  "scripts": {
    "lint": "oxlint --deny-warnings", // [!code --]
    "lint": "bun lint --deny-warnings" // [!code ++]
  }
}
```

### CLI Flags (`lint.mdx`)

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--rule` | string | - | Set a rule for this run: `--rule 'eqeqeq: [error, smart]'`. Turn off a plugin: `--rule 'unicorn/*: off'` |
| `--type-aware` | boolean | - | Also run the rules that need type information |
| `--rules` | boolean | - | List every built-in rule. Add `-f json` for machine-readable output |
| `--explain` | string | - | Print the documentation for a rule |
| `--init` | boolean | - | Add a `[lint]` section to `bunfig.toml` |
| `--fix` | boolean | - | Apply fixes and write the files |
| `--fix-suggestions` | boolean | - | Also apply suggestions, which may change what the code does |
| `--fix-dry-run` | boolean | - | Compute fixes without writing them. The `json` format includes the fixed code |
| `--staged` | boolean | - | Lint only the files staged in Git |
| `--changed` | string | - | Lint only the files that differ from a Git ref. Defaults to the default branch |
| `--ignore-pattern` | string | - | Skip files that match this glob. Can be repeated |
| `--no-ignore` | boolean | - | Lint ignored files too |
| `-f, --format` | string | `pretty` | `pretty`, `stylish`, `json`, `unix`, `github`, `junit`, `checkstyle`, `gitlab`, `sarif`, or `agent` |
| `-o, --output-file` | string | - | Write the report to a file |
| `--quiet` | boolean | - | Report errors only |
| `--max-warnings` | number | - | Exit with code 1 if there are more warnings than this |
| `--all` | boolean | - | Show every problem. By default, more than 50 identical problems are grouped |
| `--doctor` | boolean | - | Show which rules of your ESLint or oxlint config run natively, and which packages you can remove |
| `--print-config` | string | - | Print the resolved config for a file |
| `--no-script` | boolean | - | Run the linter even if the project has a `lint` script |

### Built-in Lint Rule Categories (`docs/lint/rules/`)

| Plugin / Group | Rule Docs |
| :--- | ---: |
| `bun` | 29 |
| `bun-test` | 65 |
| `eslint` | 218 |
| `import` | 46 |
| `jest` | 60 |
| `json` | 6 |
| `jsx-a11y` | 36 |
| `markdown` | 21 |
| `nextjs` | 21 |
| `node` | 12 |
| `oxc` | 27 |
| `prettier` | 1 |
| `promise` | 16 |
| `react` | 135 |
| `react-perf` | 4 |
| `typescript` | 137 |
| `unicorn` | 138 |
| `vitest` | 73 |

## `bun fmt` (Native Formatter)

### Formatter — Bun's fast, built-in formatter for JavaScript, TypeScript, CSS, HTML, JSON, YAML, Markdown, and more
- Sections: Run the formatter · Check without writing · Options · Different options for some files · .editorconfig · Ignore files · Ignore code · Sort imports
- Bun ships with a fast, built-in code formatter. There's nothing to install and nothing to configure.
- - JavaScript, TypeScript, JSX, CSS, SCSS, Less, HTML, Vue, Svelte, Angular, JSON, YAML, TOML, Markdown, MDX, GraphQL, and Handlebars
```sh
bun fmt
```
### Migrate from Prettier to bun fmt
- Sections: Differences from Prettier
- `bun fmt` reads your `.prettierrc` and prints what Prettier 3 prints. In most projects you only change the command.
- Start with `--doctor`. It shows what Bun will do with your config, and it doesn't format or write anything.
```sh
bun fmt --doctor
```
### Migrate from oxfmt to bun fmt
- Sections: Differences from oxfmt
- `bun fmt` reads your `.oxfmtrc.json` and prints what oxfmt 0.72 prints. In most projects you only change the command.
- Start with `--doctor`. It shows what Bun will do with your config, and it doesn't format or write anything.
```sh
bun fmt --doctor
```

### CLI Flags (`format.mdx`)

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `-c, --check` | boolean | - | Write nothing. Exit with code 1 if a file needs formatting |
| `-l, --list-different` | boolean | - | Like `--check`, but print only the file names |
| `--stdin-filepath` | string | - | Format standard input as this file and print the result |
| `--init` | boolean | - | Add a `[fmt]` section to `bunfig.toml` |
| `--doctor` | boolean | - | Show what Bun does with your Prettier or oxfmt config, and which packages you can remove |
| `--no-script` | boolean | - | Run the formatter even if the project has a `fmt` script |
| `--staged` | boolean | - | Format only the files staged in Git, and stage them again |
| `--changed` | string | - | Format only the files that differ from a Git ref. Defaults to the default branch |
| `--ignore-pattern` | string | - | Skip files that match this glob. Can be repeated |
| `--print-width` | number | `80` | Wrap lines at this column |
| `--tab-width` | number | `2` | Spaces per indentation level |
| `--use-tabs` | boolean | - | Indent with tabs |
| `--no-semi` | boolean | - | Only print semicolons where they are needed |
| `--single-quote` | boolean | - | Use single quotes |
| `--trailing-comma` | string | `all` | `all`, `es5`, or `none` |
| `--sort-imports` | boolean | - | Sort and group imports |
| `--sort-tailwindcss` | boolean | - | Sort Tailwind CSS classes |
| `--sort-package-json` | boolean | - | Sort the keys of `package.json` |
| `--jsdoc` | boolean | - | Format JSDoc comments |
| `--svelte` | boolean | - | Format Svelte components. This is the default without a Prettier or oxfmt config |
| `--no-svelte` | boolean | - | Do not format Svelte components |
| `--no-editorconfig` | boolean | - | Do not read `.editorconfig` |
| `--log-level` | string | `log` | `silent`, `error`, `warn`, `log`, or `debug` |
| `--threads` | number | - | Number of threads. Defaults to one per CPU core |

## `bun migrate` & `bun pm migrate`

### bun migrate — Report what a Node.js repository needs to run on Bun, and rewrite what can be rewritten
- Sections: What it reads · Options · --write · --aggressive · --replace-packages · --target · --format · --check
- `bun migrate` reads a repository that uses Node.js with npm, Yarn or pnpm, and reports what Bun does differently. With `--write` it rewrites what a rewrite can do safely. It reads 
- `bun migrate` does not convert the lockfile. `bun install` reads `package-lock.json`, `yarn.lock` and `pnpm-lock.yaml`, with `pnpm-workspace.yaml`, overrides, patches and catalogs,
```sh
bun migrate
```

- **Important CLI nuance**: `bun pm migrate` (available in all Bun 1.4+ builds) migrates `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` into `bun.lock`. Full source/script migration (`bun migrate` backed by `src/migrate` / `bun_migrate`) requires a build including `migrate_command.rs`; otherwise use `plugins/bun/skills/bun-legacy-replace/scripts/legacy-scan.ts` or the `bun_legacy_scan` / `bun_migrate_plan` MCP tools.
