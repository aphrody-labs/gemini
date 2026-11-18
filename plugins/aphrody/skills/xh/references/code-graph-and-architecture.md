# xh Code Graph & Rust Architecture (`v0.26.3`)

Generated with `ay graph build` (Tree-sitter AST) across `C:\src\xh`.

## Graph Metrics

- **Nodes**: `3,826`
- **Edges**: `6,714` (`defines`: `745`, `imports`: `174`, `calls`: `5,795`)
- **Communities**: `169`
- **Rust Edition / MSRV**: `2024` / `1.85.0`

### God Nodes (Highest Connectivity)

| Rank | Symbol / File | Kind | Location | Connections |
|---|---|---|---|---|
| 1 | `run` | function | `src/main.rs:99-782` | 216 |
| 2 | `tests/cli.rs` | test suite | `tests/cli.rs:1-3982` | 192 |
| 3 | `server::http` | test helper | `tests/server/mod.rs` | 166 |
| 4 | `get_command` | test helper | `tests/cli.rs:101-106` | 153 |
| 5 | `src/cli.rs` | module | `src/cli.rs:1-1941` | 107 |

## Execution Pipeline

```text
Cli::parse() [src/cli.rs]
  ├── loads <XH_CONFIG_DIR>/config.json default_options
  ├── detects binary stem (xh | xhs/https/xhttps | http/https)
  ├── parses RequestItems [src/request_items.rs] + nested_json [src/nested_json.rs]
  └── normalizes shorthand URLs (:8000, :/path, ://host)
        │
        ├── if --generate -> generation::generate() [src/generation.rs]
        ├── if --curl     -> to_curl::print_curl_translation() [src/to_curl.rs]
        ▼
run() [src/main.rs]
  ├── Body assembly: stdin | --raw | RequestItems (Json / Form / Multipart / File)
  ├── Client::builder(): TLS (rustls | native-tls), CA bundle, mTLS, proxy, HTTP/1-2-3, DNS --resolve, --interface, --unix-socket
  ├── Session::load_session() [src/session.rs] -> headers + auth + CookieStore
  ├── Auth [src/auth.rs, src/netrc.rs] + optional Deflate (-x) + optional RFC 9421 sign_request() [src/message_signature.rs]
  ├── Printer request preview (H / B) if requested
  ▼
if !--offline: ClientWithMiddleware::execute() [src/middleware.rs]
  ├── RedirectFollower [src/redirect.rs] (301/302/303/307/308, cross-domain strip, redirect re-sign)
  └── DigestAuthMiddleware [src/auth.rs] (401 WWW-Authenticate retry)
        │
        ├── Status check (--check-status -> exit 3/4/5)
        ├── Download (-d) -> download_file() [src/download.rs] + content_disposition [src/content_disposition.rs]
        └── Print (h / b / m) -> Printer [src/printer.rs] + decoder [src/decoder.rs] + Buffer [src/buffer.rs] + formatting [src/formatting/]
              │
              ▼
Session::persist() [src/session.rs] (skipped if --session-read-only)
```

## Module Inventory (`24` Rust Files)

| Module | Nodes | Key Public Symbols | Responsibility |
|---|---|---|---|
| `build.rs` | 28 | `build_syntax`, `feature_status`, `features`, `main` | Compiles `basic.packdump`, `large.packdump`, `themepack.themedump`; sets `XH_FEATURES`. |
| `src/main.rs` | 236 | `main`, `run`, `get_user_agent`, `setup_backtraces` | Orchestrates client build, auth, middleware, printing/download, session save. |
| `src/cli.rs` | 354 | `Cli`, `AuthType`, `MessageSignature`, `Pretty`, `FormatOptions`, `Theme`, `Print`, `Proxy`, `Resolve`, `Verify`, `HttpVersion`, `Generate` | Clap argument model, `--no-*` negation synthesis, URL/method parsing, config loading. |
| `src/request_items.rs` | 114 | `RequestItem`, `RequestItems`, `Body`, `file_to_part` | Parses `==`, `=`, `:=`, `@`, `:`, `;`, and `@file` variants into request parts. |
| `src/nested_json.rs` | 78 | `PathAction`, `parse_path`, `insert`, `TypeError` | Tokenizer & recursive builder for `key[sub][0][]=val` JSON paths. |
| `src/auth.rs` | 59 | `Auth`, `parse_auth`, `DigestAuthMiddleware` | Basic/Bearer/Digest auth & 401 retry middleware. |
| `src/netrc.rs` | 56 | `Entry`, `find_entry` | Permissive `.netrc`/`_netrc` parser with UTF-16 BOM & bearer password-only support. |
| `src/message_signature.rs` | 160 | `sign_request` | Feature `http-message-signatures`: RFC 9421 signing + RFC 9530 `Content-Digest`. |
| `src/session.rs` | 128 | `Session` | Session JSON load, legacy migration, cookie/header/auth persistence. |
| `src/middleware.rs` | 31 | `ResponseMeta`, `ResponseExt`, `Context`, `Middleware`, `ClientWithMiddleware` | Middleware pipeline + request/download timing metadata. |
| `src/redirect.rs` | 35 | `RedirectFollower`, `TooManyRedirects` | 3xx redirect following, cross-domain credential stripping, redirect re-signing. |
| `src/decoder.rs` | 114 | `CompressionType`, `get_compression_type`, `decompress` | Streaming `gzip`, `x-gzip`, `deflate`, `br`, `zstd` decoding; empty-body safe. |
| `src/download.rs` | 108 | `get_file_size`, `download_file`, `total_for_content_range` | Filename resolution, collision avoidance (`-1`), `Range` resume, progress bar. |
| `src/content_disposition.rs` | 35 | `parse_filename_from_content_disposition` | RFC 5987 `filename*` (UTF-8 / Windows-1252) & `filename=` parser. |
| `src/printer.rs` | 173 | `Printer`, `BinaryGuard` | Request/response header, body, metadata printing; binary null-byte guard. |
| `src/buffer.rs` | 68 | `Buffer` | Cross-platform `termcolor` buffered stdout/stderr/file writer. |
| `src/formatting/mod.rs` | 56 | `get_json_formatter`, `format_xml`, `serde_json_format`, `Highlighter` | `syntect` syntax highlighting, `jsonxf`, `serde_json`, `quick-xml` formatting. |
| `src/formatting/headers.rs` | 56 | `HeaderFormatter` | Theme-colored & optionally sorted HTTP header printing. |
| `src/formatting/palette.rs` | 16 | `palette!` | Syntect theme scope -> `termcolor::ColorSpec` macro. |
| `src/to_curl.rs` | 64 | `print_curl_translation`, `Command`, `translate` | Translates `Cli` + `RequestItems` to `curl` (`--curl` / `--curl-long`). |
| `src/generation.rs` | 97 | `generate` | Generates shell completions (6 shells), `roff` man page, and Markdown man page. |
| `src/error_reporting.rs` | 29 | `additional_messages`, `exit_code` | Human-readable `rustls` cert expiry messages & exit codes `2`/`6`. |
| `src/redacted.rs` | 9 | `SecretString` | Masks secrets in debug logs (`<redacted>`). |
| `src/utils.rs` | 79 | `unescape`, `clone_request`, `config_dir`, `get_home_dir`, `expand_tilde`, `url_with_query`, `copy_largebuf` | Core escaping, path, query, and header string helpers. |

## Cargo Feature Matrix (`Cargo.toml`)

- `default = ["online-tests", "rustls", "network-interface"]`
- `rustls`: Pure-Rust TLS backend + mTLS `--cert`/`--cert-key` + `rustls` expiry diagnostics.
- `native-tls`: OS TLS backend (required for TLS `< 1.2`).
- `http3`: Enables `--http-version=3-prior-knowledge` via `reqwest/http3` (requires `rustls`).
- `http-message-signatures`: Enables `--unstable-m-sig-*` via `httpsig-hyper` + `sha2`.
- `network-interface`: Enables binding by interface name on Windows/unsupported Unix targets.
- `online-tests`, `ipv6-tests`: Integration test feature gates in `tests/`.
