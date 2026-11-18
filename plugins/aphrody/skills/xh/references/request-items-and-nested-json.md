# xh Request Items & Nested JSON Grammar

Grounded in `src/request_items.rs`, `src/nested_json.rs`, and `src/utils.rs`.

## Request Item Separators (`RequestItem::from_str`)

`RequestItem::from_str` scans left-to-right for the first unescaped separator in precedence order:
`==@`, `=@`, `:=@`, `:@`, `==`, `:=`, `=`, `@`, `:`, or trailing `;`.

| Syntax | Enum Variant | Effect |
|---|---|---|
| `key==value` | `UrlParam` | Appends `key=value` to URL query string. |
| `key==@file` | `UrlParamFromFile` | Reads query parameter value from `file` (tilde expanded). |
| `key=value` | `DataField` | Adds string field to JSON body (`--json`) or form field (`--form`/`--multipart`). |
| `key=@file` | `DataFieldFromFile` | Reads string/form value from `file`. |
| `key:=value` | `JsonField` | Parses `value` with `serde_json::from_str` and inserts literal JSON value. |
| `key:=@file` | `JsonFieldFromFile` | Parses contents of `file` as literal JSON value. |
| `key@file[;type=MIME][;filename=NAME]` | `FormFile` | Attaches file part in multipart mode; requires `-f` or `--multipart`. |
| `@file[;type=MIME]` | `FormFile` (empty key) | Streams `file` directly as `Body::File` (defaults `Content-Type` to `application/json`). |
| `header:value` | `HttpHeader` | Sets request header (`HeaderName` / `HeaderValue`). |
| `header:@file` | `HttpHeaderFromFile` | Reads header value from `file`. |
| `header:` | `HttpHeaderToUnset` | Removes default or session header. |
| `header;` | `HttpHeader("", "")` | Sends header with empty value. |

### Special Characters & Escaping

- Special characters recognized by `RequestItem::from_str`: `=@:;\`.
- Prefix any separator character with `\` to keep it literal inside a key or value, e.g. `weird\:key=value`.
- In `nested_json`, additional special characters are `[` and `]` (`SPECIAL_CHARS = "=@:;[]\\"`).

## Multipart File Parameters (`parse_part_params`)

In `key@path;type=...;filename=...`:
- `;type=<mime>` overrides the part MIME type (default guessed via `mime_guess` or `application/octet-stream`).
- `;filename=<name>` overrides the `Content-Disposition` filename sent for the part.
- Single-file body (`@path`): `;filename=` logs a warning and is ignored (only valid in multipart parts).

## Nested JSON Path Grammar (`src/nested_json.rs`)

Keys for `=`, `:=`, `=@`, and `:=@` in `--json` mode are parsed by `nested_json::parse_path`:

```ebnf
start       := root_path path*
root_path   := literal | index_path | append_path
path        := key_path | index_path | append_path
key_path    := '[' TEXT ']'
index_path  := '[' NUMBER ']'
append_path := '[' ']'
```

### Key Rules & Edge Cases

- **Root key vs root array**:
  - `user[name]=alice` -> `{"user": {"name": "alice"}}`
  - `[0]=first` -> `["first"]`
  - `[]=item` -> `["item"]`
- **Escaping numeric object keys**:
  - `a[0]=x` treats `0` as an array index (`{"a": ["x"]}`).
  - `a[\0]=x` escapes the leading digit so `0` is treated as an object key (`{"a": {"0": "x"}}`).
  - The root segment is always `Token::Text` (never interpreted as an array index unless wrapped in `[...]`).
- **Sparse array padding**: Assigning index `N` pads intermediate missing slots with `null` (`arr_insert`).
- **Type mismatch errors**: Mixing object and array access at the same path node produces `nested_json::TypeError` with caret-highlighted path diagnostics.

## Method & Body Conflict Rules (`src/main.rs`, `src/cli.rs`)

- Stdin is read only when `!args.ignore_stdin && !io::stdin().is_terminal() && !test_pretend_term()`.
- Mixing stdin with `key=value` body items or `--raw` fails unless `-I` / `--ignore-stdin` is passed.
- Mixing `--raw` with `key=value` body items fails during CLI validation.
- Mixing `--multipart` with `--raw` or `-x` / `--compress` is rejected by clap `conflicts_with_all`.
- When body is `Body::Json` and non-null, `xh` sets `Content-Type: application/json` and `Accept: application/json, */*;q=0.5`.
- When `-x` / `--compress` is used, `xh` buffers the body with `ZlibEncoder` (deflate) and sets `Content-Encoding: deflate` only if compressed length is smaller (unless `-xx` forces it). Compression is skipped with a warning if a `Content-Encoding` header was manually supplied.
