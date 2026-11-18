# Auth, `.netrc`, Sessions & RFC 9421 Message Signatures

Grounded in `src/auth.rs`, `src/netrc.rs`, `src/session.rs`, `src/message_signature.rs`, `src/redirect.rs`, and `src/redacted.rs`.

## Authentication (`src/auth.rs`, `src/netrc.rs`)

- **Schemes (`-A` / `--auth-type`)**: `basic` (default), `bearer`, `digest`.
- **Credential parsing (`-a` / `--auth`)**:
  - `user:pass` -> username + password.
  - `user:` -> username with no password (`None`).
  - `user` (no colon) -> interactive hidden prompt via `rpassword::prompt_password` (`http: password for user@host: `).
  - `-A bearer -a <TOKEN>` -> `Authorization: Bearer <TOKEN>`.
  - `SecretString` (`src/redacted.rs`) ensures `--debug` prints `<redacted>` instead of raw credentials.
- **Digest Auth (`DigestAuthMiddleware`)**:
  - Intercepts HTTP `401 Unauthorized` with `WWW-Authenticate` header.
  - Uses `digest_auth::AuthContext::new_with_method` including path + query string and HTTP method.
  - Re-sends the cloned request with computed `Authorization` header (and prints intermediate hop if `--all` is set).
- **`.netrc` / `_netrc` Lookup (`src/netrc.rs`)**:
  - Checked unless `--ignore-netrc` is set and `--auth` was not passed (or session auth isn't overriding).
  - Lookup order: `$NETRC`, else `~/.netrc`, else `~/_netrc`.
  - Supports UTF-16 BOM (`DecodeReaderBytesBuilder`), permissive parsing (does not abort on minor syntax errors), `default` fallback entry, and password-only entries for `-A bearer`.

## Sessions (`src/session.rs`)

- **`--session <NAME_OR_PATH>`** and **`--session-read-only <NAME_OR_PATH>`**:
  - If value contains path separators or starts with `.` (`is_path`), uses that file path directly.
  - Otherwise stores at `<XH_CONFIG_DIR>/sessions/<host_port>/<name>.json`.
- **Persisted JSON structure**:
  - `__meta__`: `{ "about": "xh session file", "xh": "<version>" }` (automatically migrates legacy HTTPie `Headers::Map` / `Cookies::Map` formats to `List` formats, and normalizes `localhost.local` cookie domain to `localhost`).
  - `auth`: `{ "type": "basic"|"digest"|"bearer", "raw_auth": "..." }`.
  - `headers`: list of `{ "name": "...", "value": "..." }` (excludes `cookie`, `content-*`, and `if-*` headers when saving).
  - `cookies`: list of `{ "name", "value", "expires", "path", "secure", "domain" }`, restored into `reqwest_cookie_store::CookieStoreMutex` and updated with unexpired cookies on exit (unless `--session-read-only`).
- Note: credentials loaded from `.netrc` are intentionally NOT saved into the session file (`save_auth_in_session = false`).

## Redirect Handling (`src/redirect.rs`)

- `RedirectFollower` handles `301`, `302`, `303` (downgrades non-GET/HEAD to `GET`, drops body and content headers) and `307`, `308` (preserves method and buffered body).
- Default `--max-redirects` is `10` (exceeding returns exit code `6`, `TooManyRedirects`).
- On cross-domain redirects (host or default/explicit port change), `remove_sensitive_headers` strips `Authorization`, `Cookie`, `Cookie2`, `Proxy-Authorization`, and `WWW-Authenticate`.
- Existing `Signature`, `Signature-Input`, and `Content-Digest` headers are stripped before redirect hops.

## RFC 9421 HTTP Message Signatures (`src/message_signature.rs`)

Available when compiled with Cargo feature `http-message-signatures` (`httpsig-hyper` + `sha2`):
- **Flags**:
  - `--unstable-m-sig-id=<KEY_ID>` (requires `--unstable-m-sig-key`)
  - `--unstable-m-sig-key=<RAW_OR_@FILE>` (requires `--unstable-m-sig-id`)
  - `--unstable-m-sig-alg=<ALG>`: `hmac-sha256`, `ed25519`, `ecdsa-p256-sha256`, `ecdsa-p384-sha384`, `rsa-v1_5-sha256`, `rsa-pss-sha512`
  - `--unstable-m-sig-comp=<COMPONENTS>` (repeatable, comma-separated, case-normalized)
- **Default components**: `@method`, `@authority`, `@target-uri`.
- **Special component shorthands**:
  - `@query-params`: expands into one `@query-param;name="..."` component per distinct query parameter in the URL.
  - `content-digest`: if the request has a body and lacks a `Content-Digest` header, automatically computes RFC 9530 SHA-256 (`sha-256=:<base64>:`) before signing.
- **Redirects**: When `--follow` is enabled alongside message signatures, `RedirectFollower` re-signs each redirected request with the configured `MessageSignature` parameters.
