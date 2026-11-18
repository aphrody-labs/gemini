# Bun Runtime Documentation Pages (`docs/`)

| Page                                         | File                                                    | About                                                     |
| -------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| bun init                                     | `docs/runtime/templating/init.mdx`                      | Scaffold an empty Bun project with `bun init`             |
| bun create                                   | `docs/runtime/templating/create.mdx`                    | Create a new Bun project from template/package/GitHub     |
| Bun Runtime                                  | `docs/runtime/index.mdx`                                | Execute JS/TS files and scripts                           |
| Watch Mode                                   | `docs/runtime/watch-mode.mdx`                           | Automatic reloading with `--watch` and `--hot`            |
| Type checking                                | `docs/runtime/check.mdx`                                | Type check TypeScript with `bun check`                    |
| Linting                                      | `docs/runtime/lint.mdx`                                 | Lint JS/TS with embedded oxlint                           |
| Formatting                                   | `docs/runtime/fmt.mdx`                                  | Format source with embedded OXC core                      |
| Language server                              | `docs/runtime/lsp.mdx`                                  | Unified LSP for TS/JS/Python/Rust/C/C++/C# with `bun lsp` |
| Migrate from Node.js                         | `docs/runtime/n2b.mdx`                                  | Rewrite Node.js APIs with `bun n2b` and `bun migrate`     |
| Recipes with bun just                        | `docs/runtime/just.mdx`                                 | Run justfile recipes with embedded runner                 |
| MCP server                                   | `docs/runtime/mcp.mdx`                                  | Built-in `bun mcp` server for coding agents               |
| Host inventory                               | `docs/runtime/host.mdx`                                 | Machine inventory with `bun host`                         |
| Debugging                                    | `docs/runtime/debugger.mdx`                             | Interactive debugger using WebKit Inspector Protocol      |
| REPL                                         | `docs/runtime/repl.mdx`                                 | Interactive JS/TS REPL                                    |
| bunfig.toml                                  | `docs/runtime/bunfig.mdx`                               | Configure Bun via `bunfig.toml`                           |
| Code generation from strings                 | `docs/runtime/code-generation-from-strings.mdx`         | `--disallow-code-generation-from-strings`                 |
| File Types                                   | `docs/runtime/file-types.mdx`                           | Supported loaders                                         |
| Module Resolution                            | `docs/runtime/module-resolution.mdx`                    | Resolution and imports                                    |
| JSX                                          | `docs/runtime/jsx.mdx`                                  | Built-in JSX/TSX support                                  |
| Auto-install                                 | `docs/runtime/auto-install.mdx`                         | Automatic dependency resolution                           |
| Plugins                                      | `docs/runtime/plugins.mdx`                              | Runtime and bundler plugin API                            |
| File System Router                           | `docs/runtime/file-system-router.mdx`                   | `Bun.FileSystemRouter`                                    |
| Server                                       | `docs/runtime/http/server.mdx`                          | High-performance `Bun.serve` HTTP server                  |
| Routing                                      | `docs/runtime/http/routing.mdx`                         | Static/param/wildcard routes in `Bun.serve`               |
| Cookies                                      | `docs/runtime/http/cookies.mdx`                         | `Bun.CookieMap` and request cookies                       |
| TLS                                          | `docs/runtime/http/tls.mdx`                             | TLS in `Bun.serve`                                        |
| Error Handling                               | `docs/runtime/http/error-handling.mdx`                  | Dev server error handling                                 |
| Metrics                                      | `docs/runtime/http/metrics.mdx`                         | Server metrics                                            |
| Fetch                                        | `docs/runtime/networking/fetch.mdx`                     | `fetch` API                                               |
| WebSockets                                   | `docs/runtime/http/websockets.mdx`                      | Server-side WebSockets                                    |
| TCP                                          | `docs/runtime/networking/tcp.mdx`                       | Native `Bun.listen`/`Bun.connect` TCP                     |
| UDP                                          | `docs/runtime/networking/udp.mdx`                       | Native UDP sockets                                        |
| DNS                                          | `docs/runtime/networking/dns.mdx`                       | DNS resolution                                            |
| File I/O                                     | `docs/runtime/file-io.mdx`                              | `Bun.file` and `Bun.write`                                |
| Streams                                      | `docs/runtime/streams.mdx`                              | Streaming binary data                                     |
| Binary Data                                  | `docs/runtime/binary-data.mdx`                          | ArrayBuffer/Uint8Array/TypedArrays                        |
| Archive                                      | `docs/runtime/archive.mdx`                              | Tar and zip archives                                      |
| SQL                                          | `docs/runtime/sql.mdx`                                  | `Bun.sql` (Postgres, MySQL, SQLite)                       |
| SQLite                                       | `docs/runtime/sqlite.mdx`                               | `bun:sqlite` driver                                       |
| S3                                           | `docs/runtime/s3.mdx`                                   | `Bun.s3` / `Bun.S3Client`                                 |
| Redis                                        | `docs/runtime/redis.mdx`                                | `Bun.redis` client                                        |
| Workers                                      | `docs/runtime/workers.mdx`                              | Web Workers                                               |
| ModuleGraph                                  | `docs/runtime/module-graph.mdx`                         | `Bun.ModuleGraph` multi-instance isolation                |
| Native code graph                            | `docs/runtime/graph.mdx`                                | Extract source graphs & snapshots                         |
| Environment Variables                        | `docs/runtime/environment-variables.mdx`                | `.env` loading and `Bun.env`                              |
| Shell                                        | `docs/runtime/shell.mdx`                                | `Bun.$` scripting                                         |
| /runtime/buv                                 | `docs/runtime/buv.mdx`                                  | Native JSC + UV runtime (`PyJS`)                          |
| Python                                       | `docs/runtime/python.mdx`                               | `bun:python` CPython bridge                               |
| PyTorch CUDA                                 | `docs/runtime/cuda-torch.mdx`                           | CUDA PyTorch setup in `uv` venv                           |
| Terminal APIs                                | `docs/runtime/terminal.mdx`                             | `Bun.Terminal` PTY                                        |
| Spawn                                        | `docs/runtime/child-process.mdx`                        | `Bun.spawn` and `Bun.spawnSync`                           |
| WebView                                      | `docs/runtime/webview.mdx`                              | Headless browser / CDP control                            |
| Cron                                         | `docs/runtime/cron.mdx`                                 | `Bun.cron`                                                |
| Node-API                                     | `docs/runtime/node-api.mdx`                             | N-API native addons                                       |
| FFI                                          | `docs/runtime/ffi.mdx`                                  | `bun:ffi`                                                 |
| Linux                                        | `docs/runtime/linux.mdx`                                | `bun:linux` kernel interfaces                             |
| Windows                                      | `docs/runtime/windows.mdx`                              | `bun:windows` interfaces                                  |
| Windows Runtime                              | `docs/runtime/winrt.mdx`                                | `bun:winrt` WinRT bindings                                |
| WinUI 3                                      | `docs/runtime/winui.mdx`                                | `bun:winui` native Fluent 2 windows                       |
| MSVC & Windows metadata                      | `docs/runtime/msvc.mdx`                                 | MSVC & `.winmd` bindings                                  |
| .NET                                         | `docs/runtime/dotnet.mdx`                               | `bun:dotnet`                                              |
| COSMIC                                       | `docs/runtime/cosmic.mdx`                               | `bun:cosmic`                                              |
| C Compiler                                   | `docs/runtime/c-compiler.mdx`                           | Native C compilation from JS                              |
| Transpiler                                   | `docs/runtime/transpiler.mdx`                           | `Bun.Transpiler`                                          |
| CSRF Protection                              | `docs/runtime/csrf.mdx`                                 | `Bun.CSRF`                                                |
| Secrets                                      | `docs/runtime/secrets.mdx`                              | `Bun.secrets`                                             |
| Console                                      | `docs/runtime/console.mdx`                              | Console formatting                                        |
| TOML / YAML / JSON5 / XML / JSONL / Markdown | `docs/runtime/{toml,yaml,json5,xml,jsonl,markdown}.mdx` | Native data parsers                                       |
| HTMLRewriter / Readability                   | `docs/runtime/{html-rewriter,readability}.mdx`          | Streaming HTML transform & extraction                     |
| Image / Bun.Video                            | `docs/runtime/{image,video}.mdx`                        | Native image & video pipelines                            |
| /runtime/yolo & /runtime/decisions           | `docs/runtime/{yolo,decisions}.mdx`                     | Typed decision validator                                  |
| Adblock                                      | `docs/runtime/adblock.mdx`                              | Native `adblock-rust` engine                              |
| NGINX                                        | `docs/runtime/nginx.mdx`                                | Managed NGINX engine (`bun:nginx`)                        |
| Hashing & Privacy                            | `docs/runtime/{hashing,privacy}.mdx`                    | `Bun.password`, `Bun.hash`, STAR/OPAQUE                   |
| Glob / Semver / Color / Utils / Globals      | `docs/runtime/{glob,semver,color,utils,globals}.mdx`    | Core built-in utilities                                   |
| Bun APIs / Web APIs / Node.js Compat         | `docs/runtime/{bun-apis,web-apis,nodejs-compat}.mdx`    | API coverage matrices                                     |
