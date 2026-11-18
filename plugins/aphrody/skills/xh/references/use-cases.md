# xh Use Cases Catalog (16 Recipes)

All recipes follow non-interactive script safety (`-I` / `--ignore-stdin` unless piping stdin) and align with `xh` `v0.26.3`.

## 1. REST & JSON APIs

### `rest-get-query` — GET with query parameters and headers
```sh
xh -I get https://api.example.com/search q==rust page==1 accept:application/json
```
- Use `==` for URL query parameters (`=` creates a JSON body field and flips implicit method to `POST`).
- `curl`: `curl -G https://api.example.com/search --data-urlencode q=rust --data-urlencode page=1 -H 'accept: application/json'`

### `json-post-typed` — POST JSON with typed literals and nested JSON paths
```sh
xh -I post https://api.example.com/apps name=xh active:=true tags:='["http","cli"]' meta[env]=prod meta[ports][]:=8080
```
- `=` encodes strings; `:=` parses raw JSON literals; bracket paths build nested objects and arrays.
- `curl`: `curl -X POST https://api.example.com/apps -H 'content-type: application/json' -d '{"name":"xh","active":true,"tags":["http","cli"],"meta":{"env":"prod","ports":[8080]}}'`

### `json-stdin-or-file` — Send raw JSON from stdin or `@file`
```sh
xh -I post https://api.example.com/batch @payload.json
```
- Or pipe via stdin without `-I`: `echo '{"ok":true}' | xh post https://api.example.com/batch`
- `curl`: `curl -X POST https://api.example.com/batch -H 'content-type: application/json' --data-binary @payload.json`

## 2. Forms & File Uploads

### `form-urlencoded` — Submit URL-encoded form
```sh
xh -I -f post https://auth.example.com/oauth/token grant_type=client_credentials scope=read
```
- Use `key=@secret.txt` to read field values from disk without exposing secrets in shell history.
- `curl`: `curl -X POST https://auth.example.com/oauth/token -d grant_type=client_credentials -d scope=read`

### `multipart-upload` — Multipart file upload with MIME & filename overrides
```sh
xh -I -f post https://api.example.com/upload title=avatar file@./photo.png;type=image/png;filename=avatar.png
```
- Pass `--multipart` when forcing `multipart/form-data` without file items.
- `curl`: `curl -X POST https://api.example.com/upload -F title=avatar -F 'file=@./photo.png;type=image/png;filename=avatar.png'`

## 3. Auth & Sessions

### `auth-basic-bearer-digest` — Basic, Bearer, Digest, or `.netrc`
```sh
xh -I -A bearer -a "@token.txt" https://api.example.com/me
```
- Digest auth (`-A digest -a user:pass`) automatically responds to `401 WWW-Authenticate` challenges via `DigestAuthMiddleware`. Pass `--ignore-netrc` to skip `~/.netrc`.
- `curl`: `curl -H 'authorization: Bearer <token>' https://api.example.com/me`

### `session-persistence` — Persist cookies, headers, and auth across calls
```sh
xh -I --session=./api-session.json post https://api.example.com/login user=alice password=secret
```
- Use `--session-read-only=./api-session.json` to reuse auth/cookies without mutating the file.
- `curl`: `curl -c ./cookies.txt -b ./cookies.txt -X POST https://api.example.com/login -H 'content-type: application/json' -d '{"user":"alice","password":"secret"}'`

## 4. Downloads & Resume

### `download-resume` — Download and resume large artifacts safely
```sh
xh -I -d -c -o ./archive.tar.gz https://releases.example.com/archive.tar.gz
```
- `-d` sets `Accept-Encoding: identity`, enables `--follow` and `--check-status`, and appends `-1`/`-2` on collisions unless `-o` + `-c` resumes. HTTP `416` exits `0` when already complete.
- `curl`: `curl -L -f -C - -o ./archive.tar.gz https://releases.example.com/archive.tar.gz`

## 5. Diagnostics, Automation & Output

### `offline-and-curl-translation` — Preview request offline & translate to curl
```sh
xh --offline -I -v post https://api.example.com/items name=widget count:=3
xh --curl -I post https://api.example.com/items name=widget count:=3
```
- Emits exact wire headers/body without network I/O (`--offline`) or prints equivalent `curl` flags (`--curl` / `--curl-long`).

### `scripting-ci-check-status` — Non-interactive CI checks & clean JSON piping
```sh
xh -I -b --check-status --timeout=10 https://api.example.com/health
```
- Exits `4` on 4xx, `5` on 5xx, `3` on 3xx (without `-F`), `2` on timeout, `6` on max redirects. Pass `--no-check-status` to inspect error bodies with exit `0`.
- `curl`: `curl -sS -f --max-time 10 https://api.example.com/health`

### `redirects-and-trace` — Follow redirects & trace intermediate hops
```sh
xh -I -F --max-redirects=5 --all -P Hh -vv https://example.org/shortlink
```
- `-v` implies `--all` + `--print=HhBb`; `-vv` adds `m` timings. Cross-domain redirects strip `Authorization`, `Cookie`, `Proxy-Authorization`, and `WWW-Authenticate`.
- `curl`: `curl -L --max-redirs 5 -v https://example.org/shortlink`

### `formatting-and-encoding` — Indent, header sorting, charset, and MIME overrides
```sh
xh -I --pretty=all -s monokai --format-options=json.indent:2,headers.sort:false --response-mime=application/json https://api.example.com/raw
```
- `format-options` keys: `json.indent`, `json.format`, `xml.indent`, `xml.format`, `headers.sort`.

## 6. TLS, Proxies, Networking & Signatures

### `tls-mtls-custom-ca` — Custom CA, mTLS client certs & TLS version pinning
```sh
xh -I --verify=./ca-bundle.pem --cert=./client.pem --cert-key=./client.key --ssl=tls1.3 https://mtls.internal.example/status
```
- `--cert` requires `rustls` (not supported with `--native-tls`). `REQUESTS_CA_BUNDLE` / `CURL_CA_BUNDLE` are also checked.
- `curl`: `curl --cacert ./ca-bundle.pem --cert ./client.pem --key ./client.key --tlsv1.3 https://mtls.internal.example/status`

### `proxy-dns-interface` — Proxy, DNS override, IPv4/IPv6 & Unix sockets
```sh
xh -I --resolve=api.example.com:127.0.0.1 --proxy=https:socks5://127.0.0.1:1080 -4 https://api.example.com/v1/ping
```
- `--proxy` overrides `ALL_PROXY`/`HTTP_PROXY`/`HTTPS_PROXY`. `--unix-socket=/var/run/docker.sock` works on Unix hosts.
- `curl`: `curl --resolve api.example.com:443:127.0.0.1 --proxy socks5://127.0.0.1:1080 -4 https://api.example.com/v1/ping`

### `http-versions` — HTTP/1.0, HTTP/1.1, HTTP/2, HTTP/3
```sh
xh -I --http-version=2-prior-knowledge -m http://127.0.0.1:8080/grpc.health.v1.Health/Check
```
- Supported values: `1.0`, `1.1`, `2`, `2-prior-knowledge`, `3-prior-knowledge` (`http3` feature + `rustls`).
- `curl`: `curl --http2-prior-knowledge -I http://127.0.0.1:8080/grpc.health.v1.Health/Check`

### `rfc9421-message-signatures` — RFC 9421 Message Signatures + Content-Digest
```sh
xh -I --unstable-m-sig-id=key-1 --unstable-m-sig-key=@ed25519.pem --unstable-m-sig-alg=ed25519 --unstable-m-sig-comp=@method,@authority,@target-uri,content-digest post https://api.example.com/webhooks event=paid
```
- Requires Cargo feature `http-message-signatures`. Automatically computes RFC 9530 `Content-Digest` when `content-digest` is covered and re-signs across redirects.
