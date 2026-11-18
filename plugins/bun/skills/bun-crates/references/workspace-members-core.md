# Core Workspace Members (`aphrody-labs/bun`)

Top core crates extracted from the workspace table (see [workspace-members.md](workspace-members.md) for the remaining crates):

| Crate                               | Path                                        | What                                                                                             |
| ----------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `aphrody-jev`                       | `crates/aphrody-jev`                        | Bun typed decision protocol, validation and optional endpoint clients                            |
| `bun-plugin-n2b-napi`               | `packages/bun-n2b/crates/napi`              | Node-API addon behind `@aphrody/bun-plugin-n2b`.                                                 |
| `bun-plugin-oxc-napi`               | `packages/bun-oxc/crates/napi`              | Node-API addon and native onBeforeParse plugin behind `@aphrody/bun-plugin-oxc`.                 |
| `bun_adblock`                       | `src/adblock`                               | Brave native adblocker engine (`adblock-rust`).                                                  |
| `bun_agent_tools`                   | `src/agent_tools`                           | Native agent tools served by `bun mcp`: directory digests and installed dependency sources/docs. |
| `bun_analytics`                     | `src/analytics`                             | Analytics subsystem.                                                                             |
| `bun_ast`                           | `src/ast`                                   | AST and byte-slice ownership core.                                                               |
| `bun_ast_jsc`                       | `src/ast_jsc`                               | JSC bridge for `bun.logger`.                                                                     |
| `bun_ecma_ast`                      | `src/ast/ecma`                              | ECMA AST definitions.                                                                            |
| `bun_estree`                        | `src/ast/estree`                            | ESTree serialization.                                                                            |
| `bun_estree_tokens`                 | `src/ast/estree_tokens`                     | ESTree token table.                                                                              |
| `bun_ecma_ast_macros`               | `src/ast/macros`                            | ECMA AST macros.                                                                                 |
| `bun_ecma_span`                     | `src/ast/span`                              | Span utilities.                                                                                  |
| `bun_ecma_syntax`                   | `src/ast/syntax`                            | Syntax node helpers.                                                                             |
| `bun_ecma_traverse`                 | `src/ast/traverse`                          | AST traverser.                                                                                   |
| `bun_ecma_ast_visit`                | `src/ast/visit`                             | AST visitor.                                                                                     |
| `bun_base64`                        | `src/base64`                                | Base64 codecs.                                                                                   |
| `bun_boringssl`                     | `src/boringssl`                             | BoringSSL Rust wrappers.                                                                         |
| `bun_boringssl_sys`                 | `src/boringssl_sys`                         | BoringSSL FFI bindings.                                                                          |
| `bun_brotli`                        | `src/brotli`                                | Brotli bindings.                                                                                 |
| `bun_brotli_sys`                    | `src/brotli_sys`                            | Brotli C FFI.                                                                                    |
| `bun_browser`                       | `src/browser/crates/api`                    | Rust API for the BunBrowser headless browser                                                     |
| `bun_browser_browser`               | `src/browser/crates/browser`                | Bun browser module `bun_browser_browser`.                                                        |
| `bun_browser_cdp`                   | `src/browser/crates/cdp`                    | Bun browser CDP protocol.                                                                        |
| `bun_browser_crawl`                 | `src/browser/crates/crawl`                  | Shared persistent crawl frontier and bounded Rust crawler for Bun.                               |
| `bun_browser_detect`                | `src/browser/crates/detect`                 | Native technology and challenge detection for Bun                                                |
| `bun_browser_dom`                   | `src/browser/crates/dom`                    | Bun browser DOM.                                                                                 |
| `bun_browser_extract`               | `src/browser/crates/extract`                | Content extraction, Markdown, chunking, SimHash, URL metadata, media and embed resolution.       |
| `bun_browser_index`                 | `src/browser/crates/index`                  | HNSW approximate nearest-neighbour index with scalar int8 quantisation and mmap persistence      |
| `bun_browser_js`                    | `src/browser/crates/js`                     | Bun browser JS engine glue.                                                                      |
| `bun_browser_layout`                | `src/browser/crates/layout`                 | Aphrody fork of Taffy (flexbox, grid, block, float), imported as `taffy`.                        |
| `bun_browser_mcp`                   | `src/browser/crates/mcp`                    | Bun browser MCP server.                                                                          |
| `bun_browser_net`                   | `src/browser/crates/net`                    | Bun browser network transport.                                                                   |
| `bun_browser_render`                | `src/browser/crates/render`                 | Layout (`taffy`) + optional paint raster screenshots.                                            |
| `bun_browser_service`               | `src/browser/crates/service`                | Canonical web execution contract for Aphrody OS.                                                 |
| `bun_browser_ssrf`                  | `src/browser/crates/ssrf`                   | Shared SSRF deny-set and private-network opt-in.                                                 |
| `bun_alloc`                         | `src/bun_alloc`                             | Allocators & arenas.                                                                             |
| `bun_core`                          | `src/bun_core`                              | Core foundation crate.                                                                           |
| `bun_core_macros`                   | `src/bun_core_macros`                       | Proc-macros for `bun_core`.                                                                      |
| `bun_ecma_str`                      | `src/bun_core/ecma_strings`                 | ECMA string helpers.                                                                             |
| `bun_output_tags`                   | `src/bun_output_tags`                       | ANSI tag/color single source of truth.                                                           |
| `bun_vpn`                           | `src/bun_vpn`                               | Native Mullvad VPN daemon client.                                                                |
| `bun_git`                           | `src/bun-os/git`                            | Native Git (`gix`) & GitHub (`octocrab`).                                                        |
| `bun_native`                        | `src/bun-os/native`                         | Host hardware topology & clock probes.                                                           |
| `bun_pkg_cli`                       | `src/bun-os/pkg/cli`                        | Package store CLI.                                                                               |
| `bun_pkg_core`                      | `src/bun-os/pkg/core`                       | Metadata parsers (npm, Cargo sparse, NuGet, vcpkg, PyPI).                                        |
| `bun_pkg_net`                       | `src/bun-os/pkg/net`                        | Resumable HTTP ingestion into package store.                                                     |
| `bun_pkg_store`                     | `src/bun-os/pkg/store`                      | Content-addressed package blob store.                                                            |
| `bun_bundler`                       | `src/bundler`                               | Bundler core.                                                                                    |
| `bun_bundler_jsc`                   | `src/bundler_jsc`                           | JSC bridge for `bun.bundler`.                                                                    |
| `bun_bunfig`                        | `src/bunfig`                                | `bunfig.toml` parser.                                                                            |
| `bun_cares_sys`                     | `src/cares_sys`                             | c-ares FFI bindings.                                                                             |
| `bun_clap`                          | `src/clap`                                  | CLI flag parser.                                                                                 |
| `bun_clap_macros`                   | `src/clap_macros`                           | Proc-macro backend for `bun_clap`.                                                               |
| `bun_ecma_ast_tools`                | `src/codegen/ecma_ast_tools`                | AST codegen.                                                                                     |
| `bun_ecma_benchmark`                | `src/codegen/ecma_benchmark`                | ECMA benchmark helpers.                                                                          |
| `bun_ecma_codegen_conformance`      | `src/codegen/ecma_codegen_conformance`      | Codegen conformance tests.                                                                       |
| `bun_ecma_common`                   | `src/codegen/ecma_common`                   | Shared codegen types.                                                                            |
| `bun_ecma_compat_data`              | `src/codegen/ecma_compat_data`              | Browser compat table data.                                                                       |
| `bun_ecma_coverage`                 | `src/codegen/ecma_coverage`                 | Coverage codegen.                                                                                |
| `bun_ecma_linter_codegen`           | `src/codegen/ecma_linter_codegen`           | Linter rule codegen.                                                                             |
| `bun_ecma_minsize`                  | `src/codegen/ecma_minsize`                  | Minsize checks.                                                                                  |
| `bun_ecma_rulegen`                  | `src/codegen/ecma_rulegen`                  | Rule codegen.                                                                                    |
| `bun_ecma_track_linter_timings`     | `src/codegen/ecma_track_linter_timings`     | Linter timing tracker.                                                                           |
| `bun_ecma_track_memory_allocations` | `src/codegen/ecma_track_memory_allocations` | Memory allocation tracker.                                                                       |
| `bun_ecma_transform_checker`        | `src/codegen/ecma_transform_checker`        | `ScopeTree`/`SymbolTable` invariant checker.                                                     |
| `bun_ecma_transform_conformance`    | `src/codegen/ecma_transform_conformance`    | Transform conformance tests.                                                                     |
| `bun_ecma_website_common`           | `src/codegen/ecma_website_common`           | OXC website common.                                                                              |
| `bun_ecma_website_formatter`        | `src/codegen/ecma_website_formatter`        | Website formatter helpers.                                                                       |
| `bun_ecma_website_linter`           | `src/codegen/ecma_website_linter`           | Website linter helpers.                                                                          |
| `bun_collections`                   | `src/collections`                           | Collections re-export hub.                                                                       |
| `bun_arena`                         | `src/collections/arena`                     | Arena allocator.                                                                                 |
| `bun_ecma_collections`              | `src/collections/ecma`                      | ECMA collections.                                                                                |
| `bun_typed_index`                   | `src/collections/typed_index`               | Typed `Vec`/`usize` index helpers.                                                               |
| `bun_coreutils`                     | `src/coreutils`                             | Multi-call uutils coreutils linked into `bun`.                                                   |
| `bun_cosmic`                        | `src/cosmic`                                | COSMIC text stack + desktop entry index (`bun:cosmic`).                                          |
| `bun_crash_handler`                 | `src/crash_handler`                         | Crash handler & trace mapping.                                                                   |
| `bun_csrf`                          | `src/csrf`                                  | HMAC CSRF protection.                                                                            |
| `bun_css`                           | `src/css`                                   | CSS processor.                                                                                   |
| `bun_css_jsc`                       | `src/css_jsc`                               | JSC bridge for `bun_css`.                                                                        |
| `bun_css_parser`                    | `src/css/parser`                            | CSS/SCSS/Sass/Less parser.                                                                       |
| `bun_dispatch`                      | `src/dispatch`                              | Closed-set cross-crate dispatch.                                                                 |
| `bun_dns`                           | `src/dns`                                   | DNS client.                                                                                      |
| `bun_docker`                        | `src/docker`                                | Docker Engine HTTP client.                                                                       |
| `bun_dotenv`                        | `src/dotenv`                                | `.env` loader.                                                                                   |
| `bun_errno`                         | `src/errno`                                 | System error codes.                                                                              |
| `bun_event_loop`                    | `src/event_loop`                            | Event loop integration.                                                                          |
| `bun_exe_format`                    | `src/exe_format`                            | Executable format helpers.                                                                       |
| `bun_format`                        | `src/format`                                | Native code formatter (`bun fmt`).                                                               |
| `bun_format_conformance`            | `src/format/conformance`                    | Prettier/oxfmt conformance suite.                                                                |
| `bun_glob`                          | `src/glob`                                  | Native globbing (`Bun.Glob`).                                                                    |
| `bun_graph`                         | `src/graph`                                 | Aphrody code-graph algorithms.                                                                   |
| `bun_hash`                          | `src/hash`                                  | `Bun.hash` non-crypto hashes.                                                                    |
| `bun_highway`                       | `src/highway`                               | SIMD hashing.                                                                                    |
| `bun_host`                          | `src/host`                                  | `bun host` machine inventory & registry.                                                         |
| `bun_http`                          | `src/http`                                  | HTTP client.                                                                                     |
| `bun_http_jsc`                      | `src/http_jsc`                              | HTTP JSC bridge.                                                                                 |
| `bun_http_types`                    | `src/http_types`                            | HTTP shared types.                                                                               |
