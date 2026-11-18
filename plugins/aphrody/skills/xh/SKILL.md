---
name: xh
description: Send HTTP/HTTPS/HTTP3 requests, inspect APIs, translate to curl, manage sessions/auth/RFC 9421 signatures, download/resume files, and navigate the xh Rust codebase (code graph, CLI help, man page, and 16 use cases).
---

# xh — Friendly HTTP Client, CLI Reference & Code Graph

## When to Use

Activate this skill whenever you need to:
- Call or debug REST, GraphQL, JSON, form, multipart, or Unix-socket HTTP endpoints with `xh` / `xhs` (prefer `-I` in scripts so `xh` never blocks reading stdin).
- Preview requests offline (`--offline -v`) or translate HTTPie/`xh` invocations into `curl` (`--curl` / `--curl-long`).
- Persist cookies, headers, and auth across requests (`--session`, `--session-read-only`), authenticate via Basic/Bearer/Digest/`.netrc`, or sign requests with RFC 9421 Message Signatures.
- Download or resume large artifacts (`-d -c -o`), inspect TLS/CA/mTLS behavior, or debug HTTP redirects and exit codes (`0`..`6`).
- Explore, extend, or audit the `xh` Rust codebase (`src/` modules, middleware pipeline, request-item parser, nested JSON grammar, or Tree-sitter code graph).

## Core Rules & Defaults

- **Non-interactive safety**: Always pass `-I` (`--ignore-stdin`) in scripts, hooks, and agents unless deliberately piping a body into `xh` via stdin.
- **Method & scheme inference**: Method defaults to `GET` when no body items are present, or `POST` when body items (`=`, `:=`, `@`, `--raw`, stdin) are present. Scheme defaults to `http://` (or `https://` when invoked as `xhs` / `https` / `xhttps`, or with `--https`).
- **URL shorthands**: `:8000` -> `http://localhost:8000/`, `:/users` -> `http://localhost/users`, `://example.com` -> `http://example.com/`.
- **Default status checks**: `xh` enables `--check-status` by default (exits `3` on 3xx without `-F`, `4` on 4xx, `5` on 5xx; `2` on timeout, `6` on `--max-redirects` exceeded). Pass `--no-check-status` to exit `0` when inspecting error responses. Binary names `http`/`https` or `XH_HTTPIE_COMPAT_MODE` disable default `--check-status`.
- **Negation**: Any `--OPTION` can be reset by a later `--no-OPTION` (flags apply in order).
- **Secrets hygiene**: Never hardcode raw tokens in shared scripts or logs; use `header:@secret.txt`, `-a @token.txt`, or `.netrc` (`--debug` redacts `--auth` via `SecretString`).

## Quick Cheat Sheet

| Task | Command |
|---|---|
| GET with query params & header | `xh -I get https://api.example.com/items q==rust limit==10 accept:application/json` |
| POST JSON (string + typed + nested) | `xh -I post https://api.example.com/apps name=xh active:=true tags:='["a","b"]' meta[port]:=8080` |
| Send file body or multipart upload | `xh -I post :8080/raw @body.json` or `xh -I -f post :8080/up file@./a.png;type=image/png` |
| Preview offline / translate to curl | `xh --offline -I -v post :8080/x a=1` or `xh --curl -I post :8080/x a=1` |
| Download & resume safely | `xh -I -d -c -o ./out.tar.gz https://example.com/out.tar.gz` |
| Persistent session | `xh -I --session=dev post :8080/login user=alice pass=secret` |
| Body-only JSON for CI piping | `xh -I -b --check-status --timeout=10 https://api.example.com/health` |

## MCP Integration (`xh` server)

When the `xh` MCP server is connected (via `ai-os` hub `xh__*` or plugin `xh`), prefer its tools for zero-network inspection and structured lookups:
- `xh_docs`: Query CLI options, request items, exit codes `0`..`6`, environment variables, config files, FAQ, and man sections.
- `xh_code_graph`: Query the Tree-sitter code graph (`3,826` nodes, `6,714` edges, `169` communities) across all `24` Rust modules (`build.rs` + `src/**/*.rs`), god nodes, pipeline stages, and Cargo features.
- `xh_use_cases`: Search or retrieve the `16` verified use-case recipes with flags and `curl` equivalents.
- `xh_translate_curl`: Run `xh --curl -I` / `--curl-long` offline.
- `xh_build_request`: Run `xh --offline -I -v` to inspect exact serialized headers and body without sending traffic.
- `xh_request`: Execute a non-interactive (`-I`) bounded `xh` request.

## References (Progressive Disclosure)

- [CLI Help & Man Page (`xh.1.md`)](references/cli-help-and-man.md): Complete flag matrix, binary invocation modes, `--generate`, exit codes, environment variables, and config files.
- [Request Items & Nested JSON Grammar](references/request-items-and-nested-json.md): All 11 separators (`==`, `=`, `:=`, `@`, `:`, `;`, `*@`), multipart params, backslash escaping, and nested JSON AST rules.
- [Auth, Sessions & RFC 9421 Signatures](references/auth-sessions-and-signatures.md): Basic/Bearer/Digest middleware, `.netrc` parser, session JSON schema, and HTTP Message Signatures + Content-Digest.
- [Code Graph & Rust Architecture](references/code-graph-and-architecture.md): `ay graph` topology, 24-module map, middleware/redirect/printer/download pipeline, and Cargo feature matrix.
- [Use Cases Catalog](references/use-cases.md): 16 categorized HTTPie/`xh` recipes with `curl` equivalents and behavioral notes.
