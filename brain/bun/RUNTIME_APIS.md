# Bun Runtime APIs & Compatibility

Extracted from `packages/bun-types/*.d.ts` and `docs/runtime/{bun-apis,globals,nodejs-compat}.mdx`.

## Topic Overview (`docs/runtime/bun-apis.mdx`)

| Topic                            | APIs                                                                                                                                                                                                                                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP Server                      | [`Bun.serve`](/runtime/http/server)                                                                                                                                                                                                                                                                                    |
| Shell                            | [`$`](/runtime/shell)                                                                                                                                                                                                                                                                                                  |
| Bundler                          | [`Bun.build`](/bundler)                                                                                                                                                                                                                                                                                                |
| File I/O                         | [`Bun.file`](/runtime/file-io#reading-files-bun-file), [`Bun.write`](/runtime/file-io#writing-files-bun-write), `Bun.stdin`, `Bun.stdout`, `Bun.stderr`                                                                                                                                                                |
| Child Processes                  | [`Bun.spawn`](/runtime/child-process#spawn-a-process-bun-spawn), [`Bun.spawnSync`](/runtime/child-process#blocking-api-bun-spawnsync)                                                                                                                                                                                  |
| TCP Sockets                      | [`Bun.listen`](/runtime/networking/tcp#start-a-server-bun-listen), [`Bun.connect`](/runtime/networking/tcp#create-a-connection-bun-connect)                                                                                                                                                                            |
| UDP Sockets                      | [`Bun.udpSocket`](/runtime/networking/udp)                                                                                                                                                                                                                                                                             |
| WebSockets                       | `new WebSocket()` (client), [`Bun.serve`](/runtime/http/websockets) (server)                                                                                                                                                                                                                                           |
| Transpiler                       | [`Bun.Transpiler`](/runtime/transpiler)                                                                                                                                                                                                                                                                                |
| Routing                          | [`Bun.FileSystemRouter`](/runtime/file-system-router)                                                                                                                                                                                                                                                                  |
| Streaming HTML                   | [`HTMLRewriter`](/runtime/html-rewriter)                                                                                                                                                                                                                                                                               |
| Headless Browser                 | [`Bun.WebView`](/runtime/webview)                                                                                                                                                                                                                                                                                      |
| Hashing                          | [`Bun.password`](/runtime/hashing#bun-password), [`Bun.hash`](/runtime/hashing#bun-hash), [`Bun.CryptoHasher`](/runtime/hashing#bun-cryptohasher), `Bun.sha`                                                                                                                                                           |
| CSRF Protection                  | [`Bun.CSRF.generate`](/runtime/csrf), [`Bun.CSRF.verify`](/runtime/csrf)                                                                                                                                                                                                                                               |
| SQLite                           | [`bun:sqlite`](/runtime/sqlite)                                                                                                                                                                                                                                                                                        |
| SQL Client                       | [`Bun.SQL`](/runtime/sql), `Bun.sql`                                                                                                                                                                                                                                                                                   |
| Redis (Valkey) Client            | [`Bun.RedisClient`](/runtime/redis), `Bun.redis`                                                                                                                                                                                                                                                                       |
| FFI (Foreign Function Interface) | [`bun:ffi`](/runtime/ffi)                                                                                                                                                                                                                                                                                              |
| DNS                              | [`Bun.dns.lookup`](/runtime/networking/dns), `Bun.dns.prefetch`, `Bun.dns.getCacheStats`                                                                                                                                                                                                                               |
| Testing                          | [`bun:test`](/test)                                                                                                                                                                                                                                                                                                    |
| Workers                          | [`new Worker()`](/runtime/workers)                                                                                                                                                                                                                                                                                     |
| Module Loaders                   | [`Bun.plugin`](/bundler/plugins)                                                                                                                                                                                                                                                                                       |
| Glob                             | [`Bun.Glob`](/runtime/glob)                                                                                                                                                                                                                                                                                            |
| Cookies                          | [`Bun.Cookie`](/runtime/cookies), [`Bun.CookieMap`](/runtime/cookies)                                                                                                                                                                                                                                                  |
| Node-API                         | [`Node-API`](/runtime/node-api)                                                                                                                                                                                                                                                                                        |
| `import.meta`                    | [`import.meta`](/runtime/module-resolution#import-meta)                                                                                                                                                                                                                                                                |
| Utilities                        | [`Bun.version`](/runtime/utils#bun-version), [`Bun.revision`](/runtime/utils#bun-revision), [`Bun.env`](/runtime/utils#bun-env), [`Bun.main`](/runtime/utils#bun-main)                                                                                                                                                 |
| Sleep & Timing                   | [`Bun.sleep()`](/runtime/utils#bun-sleep), [`Bun.sleepSync()`](/runtime/utils#bun-sleepsync), [`Bun.nanoseconds()`](/runtime/utils#bun-nanoseconds)                                                                                                                                                                    |
| Random & UUID                    | [`Bun.randomUUIDv7()`](/runtime/utils#bun-randomuuidv7)                                                                                                                                                                                                                                                                |
| System & Environment             | [`Bun.which()`](/runtime/utils#bun-which)                                                                                                                                                                                                                                                                              |
| Comparison & Inspection          | [`Bun.peek()`](/runtime/utils#bun-peek), [`Bun.deepEquals()`](/runtime/utils#bun-deepequals), `Bun.deepMatch`, [`Bun.inspect()`](/runtime/utils#bun-inspect)                                                                                                                                                           |
| String & Text Processing         | [`Bun.escapeHTML()`](/runtime/utils#bun-escapehtml), [`Bun.stringWidth()`](/runtime/utils#bun-stringwidth), `Bun.indexOfLine`                                                                                                                                                                                          |
| URL & Path Utilities             | [`Bun.fileURLToPath()`](/runtime/utils#bun-fileurltopath), [`Bun.pathToFileURL()`](/runtime/utils#bun-pathtofileurl)                                                                                                                                                                                                   |
| Compression                      | [`Bun.gzipSync()`](/runtime/utils#bun-gzipsync), [`Bun.gunzipSync()`](/runtime/utils#bun-gunzipsync), [`Bun.deflateSync()`](/runtime/utils#bun-deflatesync), [`Bun.inflateSync()`](/runtime/utils#bun-inflatesync), `Bun.zstdCompressSync()`, `Bun.zstdDecompressSync()`, `Bun.zstdCompress()`, `Bun.zstdDecompress()` |
| Stream Processing                | [`Bun.readableStreamTo*()`](/runtime/utils#bun-readablestreamto), `Bun.readableStreamToBytes()`, `Bun.readableStreamToBlob()`, `Bun.readableStreamToFormData()`, `Bun.readableStreamToJSON()`, `Bun.readableStreamToArray()`                                                                                           |
| Memory & Buffer Management       | `Bun.ArrayBufferSink`, `Bun.allocUnsafe`, `Bun.concatArrayBuffers`                                                                                                                                                                                                                                                     |
| Module Resolution                | [`Bun.resolveSync()`](/runtime/utils#bun-resolvesync)                                                                                                                                                                                                                                                                  |
| Parsing & Formatting             | [`Bun.semver`](/runtime/semver), [`Bun.TOML.parse`](/runtime/toml), [`Bun.XML`](/runtime/xml), [`Bun.markdown`](/runtime/markdown), [`Bun.color`](/runtime/color), [`Bun.Image`](/runtime/image)                                                                                                                       |
| Low-level / Internals            | `Bun.mmap`, `Bun.gc`, `Bun.generateHeapSnapshot`, [`bun:jsc`](https://bun.com/reference/bun/jsc)                                                                                                                                                                                                                       |

## `Bun.*` Global Namespace Signatures (`declare module "bun"`)

### `Bun.$` (function, `shell.d.ts`) — Runs a shell command with the Bun Shell.
- `function $(strings: TemplateStringsArray, ...expressions: ShellExpression[]): $.ShellPromise;`
- `namespace $`
### `Bun.allocUnsafe` (function, `bun.d.ts`) — Allocate a new `Uint8Array` without zeroing the bytes.
- `function allocUnsafe(size: number): Uint8Array<ArrayBuffer>;`
### `Bun.Archive` (class, `bun.d.ts`) — Create and extract tar archives, with optional gzip compression.
- `export class Archive`
### `Bun.argv` (const, `bun.d.ts`) — The raw arguments passed to the process, including flags passed to Bun.
- `const argv: string[];`
### `Bun.ArrayBufferSink` (class, `bun.d.ts`) — Fast incremental writer that becomes an `ArrayBuffer` on end().
- `class ArrayBufferSink`
### `Bun.build` (function, `bun.d.ts`) — Bundles JavaScript, TypeScript, CSS, HTML and other supported files into optimized outputs.
- `function build(config: BuildConfig): Promise<BuildOutput>;`
### `Bun.Build` (namespace, `bun.d.ts`)
- `namespace Build`
### `Bun.color` (function, `bun.d.ts`) — Converts a color to a different format
- `function color( input: ColorInput, outputFormat?: | "ansi" | "ansi-16" | "ansi-16m" | "ansi-256" | "css"`
- `function color(input: ColorInput, outputFormat: "[rgb]"): [number, number, number] | null;`
- `function color(input: ColorInput, outputFormat: "[rgba]"): [number, number, number, number] | null;`
- `function color(input: ColorInput, outputFormat: "{rgb}"): { r: number; g: number; b: number } | null;`
- _(+2 additional overloads in `bun.d.ts`)_
### `Bun.concatArrayBuffers` (function, `bun.d.ts`) — Concatenate an array of typed arrays into a single `ArrayBuffer`.
- `function concatArrayBuffers(buffers: Array<ArrayBufferView | ArrayBufferLike>, maxLength?: number): ArrayBuffer;`
- `function concatArrayBuffers( buffers: Array<ArrayBufferView | ArrayBufferLike>, maxLength: number, asUint8Array: false, ): ArrayBuffer;`
- `function concatArrayBuffers( buffers: Array<ArrayBufferView | ArrayBufferLike>, maxLength: number, asUint8Array: true, ): Uint8Array<ArrayBuffer>;`
### `Bun.connect` (function, `bun.d.ts`) — Create a TCP client that connects to a server
- `function connect<Data = undefined>(options: TCPSocketConnectOptions<Data>): Promise<Socket<Data>>;`
- `function connect<Data = undefined>(options: UnixSocketOptions<Data>): Promise<Socket<Data>>;`
### `Bun.Cookie` (class, `bun.d.ts`) — A single HTTP cookie: its name, value, and attributes.
- `class Cookie`
### `Bun.CookieMap` (class, `bun.d.ts`) — A Map-like collection of cookies.
- `class CookieMap implements Iterable<[string, string]>`
### `Bun.cron` (const, `bun.d.ts`) — Schedule cron jobs.
- `const cron:`
### `Bun.CryptoHasher` (class, `bun.d.ts`) — Hardware-accelerated cryptographic hash functions
- `class CryptoHasher`
### `Bun.CSRF` (namespace, `bun.d.ts`) — Generate and verify CSRF tokens
- `namespace CSRF`
### `Bun.deepEquals` (function, `bun.d.ts`) — Fast deep-equality check two objects.
- `function deepEquals( a: any, b: any, strict?: boolean, ): boolean;`
### `Bun.deepMatch` (function, `bun.d.ts`) — Returns true if all properties in the subset exist in the
- `function deepMatch(subset: unknown, a: unknown): boolean;`
### `Bun.deflateSync` (function, `bun.d.ts`) — Compresses a chunk of data with the `zlib` DEFLATE algorithm.
- `function deflateSync( data: Uint8Array<ArrayBuffer> | string | ArrayBuffer, options?: ZlibCompressionOptions | LibdeflateCompressionOptions, ): Uint8Array<ArrayBuffer>;`
### `Bun.dns` (namespace, `bun.d.ts`) — DNS-related APIs
- `namespace dns`
### `Bun.embeddedFiles` (const, `bun.d.ts`) — A list of files embedded into the standalone executable, lexicographically sorted by name.
- `const embeddedFiles: ReadonlyArray<Blob>;`
### `Bun.enableANSIColors` (const, `bun.d.ts`) — Whether ANSI colors are enabled for stdin and stdout
- `const enableANSIColors: boolean;`
### `Bun.env` (const, `bun.d.ts`) — The environment variables of the process
- `const env: Env & NodeJS.ProcessEnv & ImportMetaEnv;`
### `Bun.escapeHTML` (function, `bun.d.ts`) — Escape the following characters in a string:
- `function escapeHTML(input: string | object | number | boolean): string;`
### `Bun.fetch` (var, `bun.d.ts`)
- `var fetch: typeof globalThis.fetch;`
### `Bun.FetchSession` (class, `bun.d.ts`) — Connection settings shared by the `fetch()` calls that name it, and the
- `class FetchSession`
### `Bun.file` (function, `bun.d.ts`) — `Blob` powered by the fastest system calls available for operating on files.
- `function file(path: string | URL, options?: BlobPropertyBag): BunFile;`
- `function file(path: ArrayBufferLike | Uint8Array<ArrayBuffer>, options?: BlobPropertyBag): BunFile;`
- `function file(fileDescriptor: number, options?: BlobPropertyBag): BunFile;`
### `Bun.FileSystemRouter` (class, `bun.d.ts`) — Resolve routes against a directory of files using Next.js-style (`pages`
- `class FileSystemRouter`
### `Bun.fileURLToPath` (function, `bun.d.ts`) — Convert a `URL` to a filesystem path.
- `function fileURLToPath(url: URL | string): string;`
### `Bun.gc` (function, `bun.d.ts`) — Manually trigger the garbage collector
- `function gc(force?: boolean): void;`
### `Bun.generateHeapSnapshot` (function, `bun.d.ts`) — Generates a heap snapshot in JavaScriptCore's format. View it with `bun --inspect` or
- `function generateHeapSnapshot(format?: "jsc"): HeapSnapshot;`
- `function generateHeapSnapshot(format: "v8"): string;`
- `function generateHeapSnapshot(format: "v8", encoding: "arraybuffer"): ArrayBuffer;`
### `Bun.Glob` (class, `bun.d.ts`) — Match files using glob patterns).
- `export class Glob`
### `Bun.gunzipSync` (function, `bun.d.ts`) — Decompresses a chunk of data with the `zlib` GUNZIP algorithm.
- `function gunzipSync( data: Uint8Array<ArrayBuffer> | string | ArrayBuffer, options?: ZlibCompressionOptions | LibdeflateCompressionOptions, ): Uint8Array<ArrayBuffer>;`
### `Bun.gzipSync` (function, `bun.d.ts`) — Compresses a chunk of data with the `zlib` GZIP algorithm.
- `function gzipSync( data: Uint8Array<ArrayBuffer> | string | ArrayBuffer, options?: ZlibCompressionOptions | LibdeflateCompressionOptions, ): Uint8Array<ArrayBuffer>;`
### `Bun.hash` (const, `bun.d.ts`) — Hash a string or array buffer using Wyhash
- `const hash: ((data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: number | bigint) => bigint) & Hash;`
### `Bun.Image` (namespace, `bun.d.ts`)
- `namespace Image`
- `export class Image`
### `Bun.indexOfLine` (function, `bun.d.ts`) — Find the index of a newline character in potentially ill-formed UTF-8 text.
- `function indexOfLine(buffer: ArrayBufferView | ArrayBufferLike, offset?: number | bigint): number;`
### `Bun.inflateSync` (function, `bun.d.ts`) — Decompresses a chunk of data with the `zlib` INFLATE algorithm.
- `function inflateSync( data: Uint8Array<ArrayBuffer> | string | ArrayBuffer, options?: ZlibCompressionOptions | LibdeflateCompressionOptions, ): Uint8Array<ArrayBuffer>;`
### `Bun.inspect` (function, `bun.d.ts`) — Pretty-prints an object to a `string`, the same as `console.log`
- `function inspect(arg: any, options?: BunInspectOptions): string;`
- `namespace inspect`
### `Bun.isMainThread` (const, `bun.d.ts`) — Whether the current global scope is the main thread
- `const isMainThread: boolean;`
### `Bun.isStandaloneExecutable` (const, `bun.d.ts`) — `true` when the current process is a standalone executable produced by
- `const isStandaloneExecutable: boolean;`
### `Bun.JSON5` (namespace, `bun.d.ts`) — JSON5 related APIs
- `namespace JSON5`
### `Bun.JSONC` (namespace, `bun.d.ts`) — JSONC related APIs
- `namespace JSONC`
### `Bun.JSONL` (namespace, `bun.d.ts`) — JSONL (JSON Lines) related APIs.
- `namespace JSONL`
### `Bun.listen` (function, `bun.d.ts`) — Create a TCP server that listens on a port
- `function listen<Data = undefined>(options: TCPSocketListenOptions<Data>): TCPSocketListener<Data>;`
- `function listen<Data = undefined>(options: UnixSocketOptions<Data>): UnixSocketListener<Data>;`
### `Bun.main` (const, `bun.d.ts`) — Absolute path of the script that launched Bun
- `const main: string;`
### `Bun.markdown` (namespace, `bun.d.ts`) — Markdown related APIs.
- `namespace markdown`
### `Bun.MD4` (class, `bun.d.ts`)
- `class MD4 extends CryptoHashInterface<MD4>`
### `Bun.MD5` (class, `bun.d.ts`)
- `class MD5 extends CryptoHashInterface<MD5>`
### `Bun.mmap` (function, `bun.d.ts`) — Open a file as a live-updating `Uint8Array` without copying memory
- `function mmap(path: string, opts?: MMapOptions): Uint8Array<ArrayBuffer>;`
### `Bun.ModuleGraph` (class, `bun.d.ts`) — A further instantiation of ES module graphs in **this** global object.
- `class ModuleGraph`
### `Bun.nanoseconds` (function, `bun.d.ts`) — Returns the number of nanoseconds since the process was started, measured with a
- `function nanoseconds(): number;`
### `Bun.openInEditor` (function, `bun.d.ts`) — Open a file in your local editor. The editor is detected from `$VISUAL` or `$EDITOR`
- `function openInEditor(path: string, options?: EditorOptions): void;`
### `Bun.password` (const, `bun.d.ts`) — Hash and verify passwords using argon2 or bcrypt. The default is argon2.
- `const password: { verify( password: Bun.StringOrBuffer,`
### `Bun.Password` (namespace, `bun.d.ts`) — Hash and verify passwords using argon2 or bcrypt
- `namespace Password`
### `Bun.pathToFileURL` (function, `bun.d.ts`) — Convert a filesystem path to a file:// URL.
- `function pathToFileURL(path: string): URL;`
### `Bun.peek` (function, `bun.d.ts`) — Extract the value from the Promise in the same tick of the event loop
- `function peek<T = undefined>(promise: T | Promise<T>): Promise<T> | T;`
- `namespace peek`
### `Bun.plugin` (const, `bun.d.ts`)
- `const plugin: BunRegisterPlugin;`
### `Bun.postgres` (const, `sql.d.ts`) — SQL client for PostgreSQL
- `const postgres: SQL;`
### `Bun.randomUUIDv5` (function, `bun.d.ts`) — Generate a UUIDv5, a name-based UUID derived from the SHA-1 hash of a namespace UUID and a name.
- `function randomUUIDv5( name: string | BufferSource, namespace: string | BufferSource | "dns" | "url" | "oid" | "x500", encoding?: "hex" | "base64" | "base64url", ): string;`
- `function randomUUIDv5( name: string | BufferSource, namespace: string | BufferSource | "dns" | "url" | "oid" | "x500", encoding: "buffer", ): Buffer;`
### `Bun.randomUUIDv7` (function, `bun.d.ts`) — Generate a UUIDv7, a sequential ID based on the current timestamp with a random component.
- `function randomUUIDv7( encoding?: "hex" | "base64" | "base64url", timestamp?: number | Date, ): string;`
- `function randomUUIDv7( encoding: "buffer", timestamp?: number | Date, ): Buffer;`
### `Bun.readableStreamToArray` (function, `bun.d.ts`) — Consume all data from a `ReadableStream` until it closes or errors.
- `function readableStreamToArray<T>(stream: ReadableStream<T>): Promise<T[]> | T[];`
### `Bun.readableStreamToArrayBuffer` (function, `bun.d.ts`) — Consume all data from a `ReadableStream` until it closes or errors,
- `function readableStreamToArrayBuffer( stream: ReadableStream<ArrayBufferView | ArrayBufferLike>, ): Promise<ArrayBuffer> | ArrayBuffer;`
### `Bun.readableStreamToBlob` (function, `deprecated.d.ts`) — Consumes all data from a `ReadableStream` until it closes or errors.
- `function readableStreamToBlob(stream: ReadableStream): Promise<Blob>;`
### `Bun.readableStreamToBytes` (function, `deprecated.d.ts`) — Consumes all data from a `ReadableStream` until it closes or errors.
- `function readableStreamToBytes( stream: ReadableStream<ArrayBufferView | ArrayBufferLike>, ): Promise<Uint8Array<ArrayBuffer>> | Uint8Array<ArrayBuffer>;`
### `Bun.readableStreamToFormData` (function, `bun.d.ts`) — Consume all data from a `ReadableStream` until it closes or errors.
- `function readableStreamToFormData( stream: ReadableStream<string | NodeJS.TypedArray | ArrayBufferView>, multipartBoundaryExcludingDashes?: string | NodeJS.TypedArray | ArrayBufferView, ): Promise<FormData>;`
### `Bun.readableStreamToJSON` (function, `deprecated.d.ts`) — Consumes all data from a `ReadableStream` until it closes or errors.
- `function readableStreamToJSON(stream: ReadableStream): Promise<any>;`
### `Bun.readableStreamToText` (function, `deprecated.d.ts`) — Consumes all data from a `ReadableStream` until it closes or errors.
- `function readableStreamToText(stream: ReadableStream): Promise<string>;`
### `Bun.redis` (const, `redis.d.ts`) — Default Redis client
- `export const redis: RedisClient;`
### `Bun.RedisClient` (namespace, `redis.d.ts`)
- `export namespace RedisClient`
- `export class RedisClient`
### `Bun.resolve` (function, `bun.d.ts`) — Resolve a `moduleId` as though it were imported from `parent`
- `function resolve(moduleId: string, parent: string): Promise<string>;`
### `Bun.resolveSync` (function, `bun.d.ts`) — Synchronously resolve a `moduleId` as though it were imported from `parent`
- `function resolveSync(moduleId: string, parent: string): string;`
### `Bun.revision` (const, `bun.d.ts`) — The git sha at the time the currently-running version of Bun was compiled
- `const revision: string;`
### `Bun.s3` (var, `s3.d.ts`) — A default instance of S3Client
- `var s3: S3Client;`
### `Bun.S3Client` (class, `s3.d.ts`) — A configured S3 bucket instance for managing files. It creates `S3File`
- `class S3Client`
### `Bun.secrets` (const, `bun.d.ts`) — Securely store and retrieve sensitive credentials using the operating system's native credential storage.
- `const secrets:`
### `Bun.Security` (namespace, `security.d.ts`) — Security scanner declarations for `bun install`
- `export namespace Security`
### `Bun.semver` (namespace, `bun.d.ts`) — Bun.semver parses and compares version numbers.
- `namespace semver`
### `Bun.serve` (function, `serve.d.ts`) — Bun.serve starts a high-performance HTTP server with built-in routing.
- `function serve<WebSocketData = undefined, R extends string = never>( options: Serve.Options<WebSocketData, R>, ): Server<WebSocketData>;`
### `Bun.Serve` (namespace, `serve.d.ts`)
- `namespace Serve`
### `Bun.sha` (function, `bun.d.ts`) — Hash `input` using SHA-2 512/256
- `function sha(input: Bun.StringOrBuffer, hashInto?: NodeJS.TypedArray): NodeJS.TypedArray;`
- `function sha(input: Bun.StringOrBuffer, encoding: DigestEncoding): string;`
### `Bun.SHA1` (class, `bun.d.ts`) — This is not the default because it's not cryptographically secure and it's slower than `SHA512`
- `class SHA1 extends CryptoHashInterface<SHA1>`
### `Bun.SHA224` (class, `bun.d.ts`)
- `class SHA224 extends CryptoHashInterface<SHA224>`
### `Bun.SHA256` (class, `bun.d.ts`)
- `class SHA256 extends CryptoHashInterface<SHA256>`
### `Bun.SHA384` (class, `bun.d.ts`)
- `class SHA384 extends CryptoHashInterface<SHA384>`
### `Bun.SHA512` (class, `bun.d.ts`)
- `class SHA512 extends CryptoHashInterface<SHA512>`
### `Bun.SHA512_256` (class, `bun.d.ts`) — See also `sha`
- `class SHA512_256 extends CryptoHashInterface<SHA512_256>`
### `Bun.shrink` (function, `bun.d.ts`) — The next time JavaScriptCore is idle, clear unused memory and attempt to reduce the heap size.
- `function shrink(): void;`
### `Bun.sleep` (function, `bun.d.ts`) — Returns a `Promise` that resolves after the given number of milliseconds,
- `function sleep(ms: number | Date): Promise<void>;`
### `Bun.sleepSync` (function, `bun.d.ts`) — Block the thread for a given number of milliseconds.
- `function sleepSync(ms: number): void;`
### `Bun.sliceAnsi` (function, `bun.d.ts`) — Slice a string by visible column width, preserving ANSI escape codes.
- `function sliceAnsi( input: string, start?: number, end?: number, options?: string | boolean | SliceAnsiOptions, ambiguousIsNarrow?: boolean, ): string;`
### `Bun.spawn` (function, `bun.d.ts`) — Spawn a new process
- `function spawn< const In extends SpawnOptions.Writable = "ignore", const Out extends SpawnOptions.Readable = "pipe", const Err extends SpawnOptions.Readable = "inherit", >( options: SpawnOptions.SpawnOptions<In, Out, Err`
- `function spawn< const In extends SpawnOptions.Writable = "ignore", const Out extends SpawnOptions.Readable = "pipe", const Err extends SpawnOptions.Readable = "inherit", >( cmds: string[], options?: SpawnOptions.SpawnOpt`
### `Bun.Spawn` (namespace, `bun.d.ts`)
- `namespace Spawn`
### `Bun.spawnSync` (function, `bun.d.ts`) — Synchronously spawn a new process
- `function spawnSync< const In extends SpawnOptions.Writable = "ignore", const Out extends SpawnOptions.Readable = "pipe", const Err extends SpawnOptions.Readable = "pipe", >( options: SpawnOptions.SpawnSyncOptions<In, Out`
- `function spawnSync< const In extends SpawnOptions.Writable = "ignore", const Out extends SpawnOptions.Readable = "pipe", const Err extends SpawnOptions.Readable = "pipe", >( cmds: string[], options?: SpawnOptions.SpawnSy`
### `Bun.sql` (const, `sql.d.ts`) — The default SQL client, configured from environment variables such as
- `const sql: SQL;`
### `Bun.SQL` (namespace, `sql.d.ts`)
- `namespace SQL`
- `class SQL`
### `Bun.stderr` (const, `bun.d.ts`) — Write to stderr
- `const stderr: BunFile;`
### `Bun.stdin` (const, `bun.d.ts`) — Read from stdin
- `const stdin: BunFile;`
### `Bun.stdout` (const, `bun.d.ts`) — Write to stdout
- `const stdout: BunFile;`
### `Bun.stringWidth` (function, `bun.d.ts`) — Get the column count of a string as it would be displayed in a terminal.
- `function stringWidth( input: string, options?: StringWidthOptions, ): number;`
### `Bun.stripANSI` (function, `bun.d.ts`) — Remove ANSI escape codes from a string.
- `function stripANSI(input: string): string;`
### `Bun.Terminal` (class, `bun.d.ts`) — A pseudo-terminal (PTY) for spawning interactive terminal programs.
- `class Terminal implements AsyncDisposable`
### `Bun.TOML` (namespace, `bun.d.ts`) — TOML related APIs
- `namespace TOML`
### `Bun.Transpiler` (class, `bun.d.ts`) — Quickly transpile TypeScript, JSX, or JS to modern JavaScript.
- `class Transpiler`
### `Bun.udp` (namespace, `bun.d.ts`)
- `namespace udp`
### `Bun.udpSocket` (function, `bun.d.ts`) — Create a UDP socket
- `export function udpSocket<DataBinaryType extends BinaryType = "buffer">( options: udp.SocketOptions<DataBinaryType>, ): Promise<udp.Socket<DataBinaryType>>;`
- `export function udpSocket<DataBinaryType extends BinaryType = "buffer">( options: udp.ConnectSocketOptions<DataBinaryType>, ): Promise<udp.ConnectedSocket<DataBinaryType>>;`
### `Bun.unsafe` (namespace, `bun.d.ts`)
- `namespace unsafe`
### `Bun.version` (const, `bun.d.ts`) — The current version of Bun
- `const version: string;`
### `Bun.version_with_sha` (const, `bun.d.ts`) — The current version of Bun with the shortened commit sha of the build
- `const version_with_sha: string;`
### `Bun.WebAssembly` (namespace, `wasm.d.ts`)
- `namespace WebAssembly`
### `Bun.WebView` (namespace, `bun.d.ts`)
- `namespace WebView`
- `class WebView extends EventTarget`
### `Bun.which` (function, `bun.d.ts`) — Find the path to an executable, like the `which` command in your terminal.
- `function which(command: string, options?: WhichOptions): string | null;`
### `Bun.wrapAnsi` (function, `bun.d.ts`) — Wrap a string to fit within the specified column width, preserving ANSI escape codes.
- `function wrapAnsi( input: string, columns: number, options?: WrapAnsiOptions, ): string;`
### `Bun.write` (function, `bun.d.ts`) — Use the fastest syscalls available to copy from `input` into `destination`.
- `function write( destination: BunFile | S3File | PathLike, input: Blob | NodeJS.TypedArray | ArrayBufferLike | string | BlobPart[] | Archive | ReadableStream, options?: { mode?: number; createPath?: boolean; }, ): Promise`
- `function write( destination: BunFile, input: Response | Request, options?: { createPath?: boolean; }, ): Promise<number>;`
- `function write( destinationPath: PathLike, input: Response | Request, options?: { createPath?: boolean; }, ): Promise<number>;`
- `function write( destination: BunFile, input: BunFile, options?: { mode?: number;`
- _(+1 additional overloads in `bun.d.ts`)_
### `Bun.XML` (namespace, `bun.d.ts`) — XML related APIs
- `namespace XML`
### `Bun.YAML` (namespace, `bun.d.ts`) — YAML related APIs
- `namespace YAML`
### `Bun.zstdCompress` (function, `bun.d.ts`) — Compresses a chunk of data with the Zstandard (zstd) compression algorithm.
- `function zstdCompress( data: NodeJS.TypedArray | Buffer | string | ArrayBuffer, options?: { level?: number }, ): Promise<Buffer>;`
### `Bun.zstdCompressSync` (function, `bun.d.ts`) — Compresses a chunk of data with the Zstandard (zstd) compression algorithm.
- `function zstdCompressSync( data: NodeJS.TypedArray | Buffer | string | ArrayBuffer, options?: { level?: number }, ): Buffer;`
### `Bun.zstdDecompress` (function, `bun.d.ts`) — Decompresses a chunk of data with the Zstandard (zstd) decompression algorithm.
- `function zstdDecompress(data: NodeJS.TypedArray | Buffer | string | ArrayBuffer): Promise<Buffer>;`
### `Bun.zstdDecompressSync` (function, `bun.d.ts`) — Decompresses a chunk of data with the Zstandard (zstd) decompression algorithm.
- `function zstdDecompressSync(data: NodeJS.TypedArray | Buffer | string | ArrayBuffer): Buffer;`

## Built-in `bun:*` & Ambient Modules

### `*" with { type: "file" }`
- `var path: string;` — The path to the file. At runtime this is the absolute path on disk. In a
### `*" with { type: "html" }`
- `var contents: import("bun").HTMLBundle;`
### `*" with { type: "json5" }`
- `var contents: any;`
### `*" with { type: "jsonc" }`
- `var contents: any;`
### `*" with { type: "markdown" }`
- `var html: string;` — The Markdown rendered to HTML.
### `*" with { type: "md" }`
- `var html: string;` — The Markdown rendered to HTML.
### `*" with { type: "sqlite" }`
- `var db: import("bun:sqlite").Database;` — The database, opened with `bun:sqlite`. `embed: "true"` bundles the
### `*" with { type: "text" }`
- `var text: string;` — The contents of the file as a string.
### `*" with { type: "toml" }`
- `var contents: any;`
### `*" with { type: "xml" }`
- `var contents: import("bun").XML.Document;`
### `*" with { type: "yaml" }`
- `var contents: any;`
### `*.html`
- `var contents: import("bun").HTMLBundle;`
### `*.json5`
- `var contents: any;`
### `*.jsonc`
- `var contents: any;`
### `*.toml`
- `var contents: any;`
### `*.txt`
- `var text: string;`
### `*.xml`
- `var contents: import("bun").XML.Document;`
### `*.yaml`
- `var contents: any;`
### `*.yml`
- `var contents: any;`
### `*/bun.lock`
- `var contents: import("bun").BunLockFile;`
### `bun:bundle`
- `function feature(flag: Registry extends { features: infer Features extends string } ? Features : string): boolean;` — Checks whether a feature flag is enabled at compile time.
### `bun:ffi`
- `const FFIFunctionCallableSymbol: unique symbol;`
- `function dlopen<Fns extends Record<string, FFIFunction>>( name: string | import("bun").BunFile | URL, symbols: Fns, ): Library<Fns>;` — Open a native library and load symbols from it
- `function cc<Fns extends Record<string, FFIFunction>>(options: { source: string | import("bun").BunFile | URL; library?: string[] | string; include?: string[] | string; symbols: Fns;` — **Experimental:** Compile ISO C11 source code using TinyCC, and make `symbols` available as functions to JavaScript.
- `function CFunction(fn: FFIFunction & { ptr: Pointer | number | bigint }): CallableFunction & { close(): void; };` — Turn a native library's function pointer into a JavaScript function
- `function linkSymbols<Fns extends Record<string, FFIFunction>>(symbols: Fns): Library<Fns>;` — Link a map of symbols to JavaScript functions
- `function toBuffer(ptr: Pointer | number | bigint, byteOffset?: number, byteLength?: number): Buffer;` — Read a pointer as a `Buffer`
- `function toArrayBuffer(ptr: Pointer | number | bigint, byteOffset?: number, byteLength?: number): ArrayBuffer;` — Read a pointer as an `ArrayBuffer`
- `namespace read` — Read a value directly from a memory address, without creating a
- `function ptr(view: NodeJS.TypedArray | ArrayBufferLike | DataView, byteOffset?: number): Pointer;` — Get the pointer backing a `TypedArray` or `ArrayBuffer`
- `const CString: CStringConstructor;` — Get a string from a UTF-8 encoded C string.
- `class JSCallback` — Pass a JavaScript function to FFI (Foreign Function Interface)
- `function viewSource(symbols: Symbols, is_callback?: false): string[];` — View the generated C code for FFI bindings
- `function viewSource(callback: FFIFunction, is_callback: true): string;`
- `const suffix: string;` — Platform-specific file extension for dynamic libraries, without the
### `bun:jsc`
- `function jscDescribe(value: any): string;` — Returns JavaScriptCore's debug description of a value: how the value is
- `function jscDescribeArray(array: any[]): string;` — Describes the storage behind an object's indexed elements: the address of
- `function gcAndSweep(): number;` — Runs a full garbage collection and then sweeps the heap, all synchronously,
- `function fullGC(): number;` — Runs a full garbage collection synchronously: every object in the heap is
- `function edenGC(): number;` — Runs an eden (young generation) garbage collection synchronously.
- `function heapSize(): number;` — Returns the size of the JavaScript heap in bytes: the objects that
- `function heapStats(): HeapStats;` — Returns statistics about the JavaScript heap, including a count of the
- `function memoryUsage(): MemoryUsage;` — Returns memory statistics for the whole Bun process: resident set size,
- `function bytecodeOrderStats(): BytecodeOrderStats | null;` — For an executable built with `bun build --compile --bytecode
- `function getRandomSeed(): number;` — Returns the seed of the pseudo-random number generator behind
- `function setRandomSeed(value: number): void;` — Reseeds the pseudo-random number generator behind `Math.random()`, making
- `function isRope(input: string): boolean;` — Returns whether a string is currently stored as a "rope".
- `function callerSourceOrigin(): string | null;` — Returns the URL of the source file containing the code that called this
- `function noFTL(func: (...args: any[]) => any): void;` — Prevents a function from ever being compiled by the FTL JIT,
- `function noOSRExitFuzzing(func: (...args: any[]) => any): void;` — Excludes a function from OSR exit fuzzing.
- `function optimizeNextInvocation(func: (...args: any[]) => any): void;` — Makes JavaScriptCore start optimizing a function (compiling it with the
- `function numberOfDFGCompiles(func: (...args: any[]) => any): number;` — Returns how many times a function has been optimized: `1` if the function
- `function releaseWeakRefs(): void;` — Releases the targets of `WeakRef`s so that a garbage collection can
- `function totalCompileTime(): number;` — Returns the total time in milliseconds this process has spent
- `function reoptimizationRetryCount(func: (...args: any[]) => any): number;` — Returns how many times JavaScriptCore has thrown away a function's
- `function drainMicrotasks(): void;` — Runs every pending microtask right now: promise reactions,
- `function serialize(value: any, options?: { binaryType?: "arraybuffer" }): SharedArrayBuffer;` — Serializes a JavaScript value into a binary representation that can be sent to another Bun instance.
- `function serialize(value: any, options?: { binaryType: "nodebuffer" }): Buffer;` — Serializes a JavaScript value into a binary representation that can be sent to another Bun instance.
- `function deserialize(value: ArrayBufferLike | NodeJS.TypedArray | Buffer): any;` — Converts an ArrayBuffer or Buffer to a JavaScript value compatible with the HTML Structured Clone Algorithm.
- `function setTimeZone(timeZone: string): string;` — Sets the time zone used by `Intl`, `Date`, and other date and time APIs.
### `bun:sqlite`
- `export class Database implements Disposable` — A SQLite3 database
- `export class Statement<ReturnType = unknown, ParamsType extends SQLQueryBindings[] = any[]> implements Disposable` — A prepared statement.
- `export namespace constants` — Constants from `sqlite3.h`
- `export class SQLiteError extends Error` — An error from SQLite. The `name` is `"SQLiteError"`.
### `bun:test`
- `export const mock: { <T extends (...args: any[]) => any>(Function?: T): Mock<T>; <Args extends any[], Instance>(Class: new (...args: Args) => Instance): Mock<(...args: Args) => Instance>; <T extends (...args: any[]) => a`
- `export function setSystemTime(now?: Date | number | string): void;` — Control the system time used by:
- `export namespace jest`
- `export function spyOn<T extends object, K extends keyof T>(obj: T, property: K, accessType: "get"): Mock<() => T[K]>;` — Create a spy on a property's getter. The spy calls the original getter until you give it another implementation.
- `export function spyOn<T extends object, K extends keyof T>( obj: T, property: K, accessType: "set", ): Mock<(value: T[K]) => void>;` — Create a spy on a property's setter. The spy calls the original setter until you give it another implementation.
- `export function spyOn<T extends object, K extends keyof T>( obj: T, methodOrPropertyValue: K, ): Mock<Extract<T[K], (...args: any[]) => any>>;` — Create a spy on an object property or method
- `export const vi: { fn: typeof jest.fn; spyOn: typeof spyOn; isMockFunction: typeof jest.isMockFunction; mocked: typeof jest.mocked;` — Vitest-compatible mocking utilities, for migrating tests from Vitest to Bun.
- `export const describe: Describe<[]>;` — Describes a group of related tests.
- `export const xdescribe: Describe<[]>;` — Skips a group of related tests.
- `export function beforeAll( fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void), options?: HookOptions, ): void;` — Runs a function, once, before all the tests.
- `export function beforeEach( fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void), options?: HookOptions, ): void;` — Runs a function before each test.
- `export function afterAll( fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void), options?: HookOptions, ): void;` — Runs a function, once, after all the tests.
- `export function afterEach( fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void), options?: HookOptions, ): void;` — Runs a function after each test.
- `export function aroundEach( fn: (runTest: () => Promise<void>, context: TestContext, suite: TestSuite) => unknown | Promise<unknown>, options?: HookOptions, ): void;` — Wraps each test in a function. The function does its setup, awaits `runTest()`, then does its teardown.
- `export function aroundAll( fn: (runSuite: () => Promise<void>, context: object, suite: TestSuite) => unknown | Promise<unknown>, options?: HookOptions, ): void;` — Wraps all the tests of the file or `describe()` block in a function. The function does its setup, awaits
- `export function onTestFinished( fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void), options?: HookOptions, ): void;` — Runs a function after the test finishes, once all `afterEach` hooks have completed.
- `export function setDefaultTimeout(milliseconds: number): void;` — Sets the default timeout for all tests in the current file. A timeout set on an
- `export const test: Test<[]>;` — Runs a test.
- `export const xtest: Test<[]>;` — Skips a test.
- `export const expect: Expect;` — Asserts that a value matches some criteria.
- `namespace JestMock`
- `export const expectTypeOf: typeof import("./vendor/expect-type").expectTypeOf;`
### `node:fs/promises`
- `function exists(path: Bun.PathLike): Promise<boolean>;`
### `node:tls`
- `function connect(options: BunConnectionOptions, secureConnectListener?: () => void): TLSSocket;`
### `vitest`
- `export const assert: typeof import("chai").assert;` — chai's `assert`. `bun test` rewrites `import { assert } from "vitest"` to import it from your project's `chai`.
- `export const should: typeof import("chai").should;` — chai's `should`. It has the same limits as `assert`.
- `export const vi: VitestUtils;` — Mocks, fake timers and the other test utilities.
- `export const expect: ExpectStatic;` — Wraps a value so you can check it with a matcher.
- `export const expectTypeOf: typeof import("bun:test").expectTypeOf;`
- `export const assertType: AssertType;` — Fails to compile unless `value` is assignable to `T`. It does nothing at run time.
- `export function beforeAll<ExtraContext = object>( fn: (context: ExtraContext, suite: Readonly<RunnerTestSuite | RunnerTestFile>) => Awaitable<unknown>, timeout?: number, ): void;` — Runs once before all tests in the enclosing `describe()` block, or in the file. If the callback returns a function,
- `export function afterAll<ExtraContext = object>( fn: (context: ExtraContext, suite: Readonly<RunnerTestSuite | RunnerTestFile>) => Awaitable<unknown>, timeout?: number, ): void;` — Runs once after all tests in the enclosing `describe()` block, or in the file.
- `export function beforeEach<ExtraContext = object>( fn: (context: TestContext & ExtraContext) => Awaitable<unknown>, timeout?: number, ): void;` — Runs before each test. If the callback returns a function, that function runs after the `afterEach` hooks.
- `export function afterEach<ExtraContext = object>( fn: (context: TestContext & ExtraContext) => Awaitable<unknown>, timeout?: number, ): void;` — Runs after each test.
- `export function aroundEach<ExtraContext = object>( fn: ( runTest: () => Promise<void>, context: TestContext & ExtraContext, suite: Readonly<RunnerTestSuite>, ) => Awaitable<unknown>, timeout?: number, ): void;` — Wraps each test and its `beforeEach` and `afterEach` hooks. The callback must call `runTest()`.
- `export function aroundAll<ExtraContext = object>( fn: ( runSuite: () => Promise<void>, context: ExtraContext, suite: Readonly<RunnerTestSuite | RunnerTestFile>, ) => Awaitable<unknown>, timeout?: number, ): void;` — Wraps the enclosing `describe()` block, or the file. The callback must call `runSuite()`.
- `export const test: TestAPI;` — Runs a test. The callback receives the `TestContext`. Without a callback, the test is marked as todo.
- `export const describe: SuiteAPI;` — Groups tests into a block.
- `export function onTestFinished(fn: OnTestFinishedHandler, timeout?: number): void;` — Runs `fn` after the current test, its `afterEach` hooks and its fixture teardown.
- `export function onTestFailed(fn: OnTestFailedHandler, timeout?: number): void;` — Like `onTestFinished()`, but only runs if the test failed.
- `export const TestRunner: { getCurrentTest(): RunnerTestCase | undefined; };`
- `export function inject<T extends keyof ProvidedContext & string>(key: T): ProvidedContext[T] | undefined;` — Always returns `undefined`, because `bun test` has no `provide` option or global setup file.

### Ambient / Module Overrides

- `buffer`
- `console`
- `node:fs`
- `stream/web`
- `url`

## Global Declarations (`bun-types`)

- `declare namespace NodeJS { interface Process { assert(value: unknown, message?: string | Error): asserts value; } } interface CustomEvent<T = any> { initCustomEvent(type: string, bubbles?: boolean, cancelable?: boolean, ` (`deprecated.d.ts`)
- `declare var BuildError: typeof BuildMessage;` (`deprecated.d.ts`)
- `declare var ResolveError: typeof ResolveMessage;` (`deprecated.d.ts`)
- `declare var ReadableStream: Bun.__internal.UseLibDomIfAvailable< "ReadableStream", { prototype: ReadableStream; new <R = any>(underlyingSource?: Bun.UnderlyingSource<R>, strategy?: QueuingStrategy<R>): ReadableStream<R>;` (`globals.d.ts`)
- `declare var WritableStream: Bun.__internal.UseLibDomIfAvailable< "WritableStream", { prototype: WritableStream; new <W = any>(underlyingSink?: Bun.UnderlyingSink<W>, strategy?: QueuingStrategy<W>): WritableStream<W>;` (`globals.d.ts`)
- `declare var CompressionStream: Bun.__internal.UseLibDomIfAvailable< "CompressionStream", { prototype: CompressionStream; new (format: Bun.CompressionFormat, strategy?: { highWaterMark?: number; level?: number }): Compres` (`globals.d.ts`)
- `declare var DecompressionStream: Bun.__internal.UseLibDomIfAvailable< "DecompressionStream", { prototype: DecompressionStream; new (format: Bun.CompressionFormat, strategy?: { highWaterMark?: number }): DecompressionStre` (`globals.d.ts`)
- `declare var Worker: Bun.__internal.UseLibDomIfAvailable< "Worker", { prototype: Worker; new (scriptURL: string | URL, options?: Bun.WorkerOptions | undefined): Worker; data: any; } >;` (`globals.d.ts`)
- `declare var WebSocket: Bun.__internal.UseLibDomIfAvailable< "WebSocket", { prototype: WebSocket; new (url: string | URL, options?: Bun.WebSocketOptions): WebSocket;` (`globals.d.ts`)
- `declare var Crypto: { prototype: Crypto; new (): Crypto; };` (`globals.d.ts`)
- `declare var crypto: Crypto;` (`globals.d.ts`)
- `declare var TextEncoder: Bun.__internal.UseLibDomIfAvailable< "TextEncoder", { prototype: TextEncoder; new (encoding?: Bun.Encoding, options?: { fatal?: boolean; ignoreBOM?: boolean }): TextEncoder; } >;` (`globals.d.ts`)
- `declare var TextDecoder: Bun.__internal.UseLibDomIfAvailable< "TextDecoder", { prototype: TextDecoder; new (encoding?: Bun.Encoding, options?: { fatal?: boolean; ignoreBOM?: boolean }): TextDecoder; } >;` (`globals.d.ts`)
- `declare var Event: { prototype: Event; readonly NONE: 0; readonly CAPTURING_PHASE: 1; readonly AT_TARGET: 2; readonly BUBBLING_PHASE: 3; new (type: string, eventInitDict?: Bun.EventInit): Event; };` (`globals.d.ts`)
- `declare var EventTarget: { prototype: EventTarget; new (): EventTarget; };` (`globals.d.ts`)
- `declare var File: Bun.__internal.UseLibDomIfAvailable< "File", { prototype: File; new ( parts: Bun.BlobPart[], name: string, options?: BlobPropertyBag & { lastModified?: Date | number | undefined }, ): File; } >;` (`globals.d.ts`)
- `declare var ShadowRealm: { prototype: ShadowRealm; new (): ShadowRealm; };` (`globals.d.ts`)
- `declare function queueMicrotask(callback: (...args: any[]) => void): void;` (`globals.d.ts`)
- `declare function reportError(error: any): void;` (`globals.d.ts`)
- `declare function clearInterval(id?: number | Timer): void;` (`globals.d.ts`)
- `declare function clearTimeout(id?: number | Timer): void;` (`globals.d.ts`)
- `declare function clearImmediate(id?: number | Timer): void;` (`globals.d.ts`)
- `declare function setImmediate(handler: Bun.TimerHandler, ...arguments: any[]): Timer;` (`globals.d.ts`)
- `declare function setInterval(handler: Bun.TimerHandler, interval?: number, ...arguments: any[]): Timer;` (`globals.d.ts`)
- `declare function setTimeout(handler: Bun.TimerHandler, timeout?: number, ...arguments: any[]): Timer;` (`globals.d.ts`)
- `declare function addEventListener<K extends keyof EventMap>( type: K, listener: (this: object, ev: EventMap[K]) => any, options?: boolean | AddEventListenerOptions, ): void;` (`globals.d.ts`)
- `declare function addEventListener( type: string, listener: Bun.EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions, ): void;` (`globals.d.ts`)
- `declare function removeEventListener<K extends keyof EventMap>( type: K, listener: (this: object, ev: EventMap[K]) => any, options?: boolean | Bun.EventListenerOptions, ): void;` (`globals.d.ts`)
- `declare function removeEventListener( type: string, listener: Bun.EventListenerOrEventListenerObject, options?: boolean | Bun.EventListenerOptions, ): void;` (`globals.d.ts`)
- `declare var ErrorEvent: { prototype: ErrorEvent; new (type: string, eventInitDict?: Bun.ErrorEventInit): ErrorEvent; };` (`globals.d.ts`)
- `declare var CloseEvent: { prototype: CloseEvent; new (type: string, eventInitDict?: Bun.CloseEventInit): CloseEvent; };` (`globals.d.ts`)
- `declare var MessageEvent: Bun.__internal.UseLibDomIfAvailable< "MessageEvent", { prototype: MessageEvent; new <T>(type: string, eventInitDict?: Bun.MessageEventInit<T>): MessageEvent<any>; } >;` (`globals.d.ts`)
- `declare var CustomEvent: { prototype: CustomEvent; new <T>(type: string, eventInitDict?: Bun.CustomEventInit<T>): CustomEvent<T>; };` (`globals.d.ts`)
- `declare var Loader: { registry: Map< string, { key: string;` (`globals.d.ts`)
- `declare var ByteLengthQueuingStrategy: { prototype: ByteLengthQueuingStrategy; new (init: QueuingStrategyInit): ByteLengthQueuingStrategy; };` (`globals.d.ts`)
- `declare var ReadableStreamDefaultController: { prototype: ReadableStreamDefaultController; new (): ReadableStreamDefaultController; };` (`globals.d.ts`)
- `declare var ReadableStreamDefaultReader: { prototype: ReadableStreamDefaultReader; new <R = any>(stream: ReadableStream<R>): ReadableStreamDefaultReader<R>; };` (`globals.d.ts`)
- `declare var WritableStreamDefaultController: { prototype: WritableStreamDefaultController; new (): WritableStreamDefaultController; };` (`globals.d.ts`)
- `declare var WritableStreamDefaultWriter: { prototype: WritableStreamDefaultWriter; new <W = any>(stream: WritableStream<W>): WritableStreamDefaultWriter<W>; };` (`globals.d.ts`)
- `declare var TransformStream: { prototype: TransformStream; new <I = any, O = any>( transformer?: Transformer<I, O>, writableStrategy?: QueuingStrategy<I>, readableStrategy?: QueuingStrategy<O>, ): TransformStream<I, O>;` (`globals.d.ts`)
- `declare var TransformStreamDefaultController: { prototype: TransformStreamDefaultController; new (): TransformStreamDefaultController; };` (`globals.d.ts`)
- `declare var CountQueuingStrategy: { prototype: CountQueuingStrategy; new (init: QueuingStrategyInit): CountQueuingStrategy; };` (`globals.d.ts`)
- `declare var DOMException: { prototype: DOMException; new (message?: string, name?: string): DOMException; readonly INDEX_SIZE_ERR: 1; readonly DOMSTRING_SIZE_ERR: 2; readonly HIERARCHY_REQUEST_ERR: 3; readonly WRONG_DOCU` (`globals.d.ts`)
- `declare function alert(message?: string): void;` (`globals.d.ts`)
- `declare function confirm(message?: string): boolean;` (`globals.d.ts`)
- `declare function prompt(message?: string, _default?: string): string | null;` (`globals.d.ts`)
- `declare var SubtleCrypto: { prototype: SubtleCrypto; new (): SubtleCrypto; };` (`globals.d.ts`)
- `declare var CryptoKey: { prototype: CryptoKey; new (): CryptoKey; };` (`globals.d.ts`)
- `declare class ResolveMessage { readonly name: "ResolveMessage"; readonly position: Position | null; readonly code: string; readonly message: string; readonly referrer: string; readonly specifier: string; readonly importK` (`globals.d.ts`)
- `declare class BuildMessage { readonly name: "BuildMessage"; readonly position: Position | null; readonly message: string; readonly level: "error" | "warning" | "info" | "debug" | "verbose"; } interface ErrorOptions` (`globals.d.ts`)
- `declare var console: Console;` (`globals.d.ts`)
- `declare var require: NodeJS.Require;` (`globals.d.ts`)
- `declare var exports: any;` (`globals.d.ts`)
- `declare var module: NodeModule;` (`globals.d.ts`)
- `declare function structuredClone<T>(value: T, options?: Bun.StructuredSerializeOptions): T;` (`globals.d.ts`)
- `declare function postMessage(message: any, transfer?: Bun.Transferable[]): void;` (`globals.d.ts`)
- `declare var navigator: Navigator;` (`globals.d.ts`)
- `declare var Blob: Bun.__internal.UseLibDomIfAvailable< "Blob", { prototype: Blob; new (blobParts?: Bun.BlobPart[], options?: BlobPropertyBag): Blob; } >;` (`globals.d.ts`)
- `declare var BroadcastChannel: Bun.__internal.UseLibDomIfAvailable< "BroadcastChannel", typeof import("node:worker_threads").BroadcastChannel >;` (`globals.d.ts`)
- `declare var URL: Bun.__internal.UseLibDomIfAvailable< "URL", { prototype: URL; new (url: string | URL, base?: string | URL): URL; canParse(url: string, base?: string): boolean; createObjectURL(object: Blob): `blob:${stri` (`globals.d.ts`)
- `declare var AbortController: Bun.__internal.UseLibDomIfAvailable< "AbortController", { prototype: AbortController; new (): AbortController; } >;` (`globals.d.ts`)
- `declare var AbortSignal: Bun.__internal.UseLibDomIfAvailable< "AbortSignal", { prototype: AbortSignal; new (): AbortSignal; timeout(ms: number): AbortSignal; abort(reason?: any): AbortSignal; any(signals: AbortSignal[]):` (`globals.d.ts`)
- `declare var FormData: Bun.__internal.UseLibDomIfAvailable<"FormData", { prototype: FormData; new (): FormData }>;` (`globals.d.ts`)
- `declare var EventSource: Bun.__internal.UseLibDomIfAvailable< "EventSource", { prototype: EventSource; new (): EventSource } >;` (`globals.d.ts`)
- `declare var performance: Bun.__internal.UseLibDomIfAvailable<"performance", Performance>;` (`globals.d.ts`)
- `declare var Performance: Bun.__internal.UseLibDomIfAvailable< "Performance", { new (): Performance; prototype: Performance } >;` (`globals.d.ts`)
- `declare var PerformanceEntry: Bun.__internal.UseLibDomIfAvailable< "PerformanceEntry", { prototype: PerformanceEntry; new (): PerformanceEntry } >;` (`globals.d.ts`)
- `declare var PerformanceMark: Bun.__internal.UseLibDomIfAvailable< "PerformanceMark", { prototype: PerformanceMark; new (): PerformanceMark } >;` (`globals.d.ts`)
- `declare var PerformanceMeasure: Bun.__internal.UseLibDomIfAvailable< "PerformanceMeasure", { prototype: PerformanceMeasure; new (): PerformanceMeasure } >;` (`globals.d.ts`)
- `declare var PerformanceObserver: Bun.__internal.UseLibDomIfAvailable< "PerformanceObserver", { prototype: PerformanceObserver; new (callback: import("node:perf_hooks").PerformanceObserverCallback): PerformanceObserver;` (`globals.d.ts`)
- `declare var PerformanceObserverEntryList: Bun.__internal.UseLibDomIfAvailable< "PerformanceObserverEntryList", { prototype: PerformanceObserverEntryList; new (): PerformanceObserverEntryList } >;` (`globals.d.ts`)
- `declare var PerformanceResourceTiming: Bun.__internal.UseLibDomIfAvailable< "PerformanceResourceTiming", { prototype: PerformanceResourceTiming; new (): PerformanceResourceTiming } >;` (`globals.d.ts`)
- `declare var ReadableByteStreamController: Bun.__internal.UseLibDomIfAvailable< "ReadableByteStreamController", { prototype: ReadableByteStreamController; new (): ReadableByteStreamController } >;` (`globals.d.ts`)
- `declare var ReadableStreamBYOBReader: Bun.__internal.UseLibDomIfAvailable< "ReadableStreamBYOBReader", { prototype: ReadableStreamBYOBReader; new (): ReadableStreamBYOBReader } >;` (`globals.d.ts`)
- `declare var ReadableStreamBYOBRequest: Bun.__internal.UseLibDomIfAvailable< "ReadableStreamBYOBRequest", { prototype: ReadableStreamBYOBRequest; new (): ReadableStreamBYOBRequest } >;` (`globals.d.ts`)
- `declare var TextDecoderStream: Bun.__internal.UseLibDomIfAvailable< "TextDecoderStream", { prototype: TextDecoderStream; new (encoding?: Bun.Encoding, options?: { fatal?: boolean; ignoreBOM?: boolean }): TextDecoderStrea` (`globals.d.ts`)
- `declare var TextEncoderStream: Bun.__internal.UseLibDomIfAvailable< "TextEncoderStream", { prototype: TextEncoderStream; new (): TextEncoderStream } >;` (`globals.d.ts`)
- `declare var URLSearchParams: Bun.__internal.UseLibDomIfAvailable< "URLSearchParams", { prototype: URLSearchParams; new ( init?: | URLSearchParams | string | Record<string, string | readonly string[]> | Iterable<[string, ` (`globals.d.ts`)
- `declare var MessageChannel: Bun.__internal.UseLibDomIfAvailable< "MessageChannel", { prototype: MessageChannel; new (): MessageChannel } >;` (`globals.d.ts`)
- `declare var MessagePort: Bun.__internal.UseLibDomIfAvailable< "MessagePort", { prototype: MessagePort; new (): MessagePort; } >;` (`globals.d.ts`)
- `declare var Headers: Bun.__internal.UseLibDomIfAvailable< "Headers", { prototype: Headers; new (init?: Bun.HeadersInit): Headers; } >;` (`globals.d.ts`)
- `declare var Request: Bun.__internal.UseLibDomIfAvailable< "Request", { prototype: Request; new (requestInfo: string, init?: RequestInit): Request; new (requestInfo: RequestInit & { url: string }): Request; new (requestIn` (`globals.d.ts`)
- `declare var Response: Bun.__internal.UseLibDomIfAvailable< "Response", { new (body?: Bun.BodyInit | null | undefined, init?: ResponseInit | undefined): Response;` (`globals.d.ts`)
- `declare function fetch(input: string | URL | Request, init?: BunFetchRequestInit): Promise<Response>;` (`globals.d.ts`)
- `declare namespace fetch { export function preconnect( url: string | URL, options?: { dns?: boolean; tcp?: boolean; http?: boolean; https?: boolean; }, ): void; }` (`globals.d.ts`)
- `declare namespace HTMLRewriterTypes { interface HTMLRewriterElementContentHandlers { element?(element: Element): void | Promise<void>; comments?(comment: Comment): void | Promise<void>; text?(text: Text): void | Promise<` (`html-rewriter.d.ts`)
- `declare class HTMLRewriter { constructor(); on(selector: string, handlers: HTMLRewriterTypes.HTMLRewriterElementContentHandlers): HTMLRewriter; onDocument(handlers: HTMLRewriterTypes.HTMLRewriterDocumentContentHandlers):` (`html-rewriter.d.ts`)
- `declare var onmessage: Bun.__internal.UseLibDomIfAvailable<"onmessage", never>;` (`index.d.ts`)
- `declare var test: typeof import("bun:test").test;` (`test-globals.d.ts`)
- `declare var it: typeof import("bun:test").it;` (`test-globals.d.ts`)
- `declare var describe: typeof import("bun:test").describe;` (`test-globals.d.ts`)
- `declare var expect: typeof import("bun:test").expect;` (`test-globals.d.ts`)
- `declare var expectTypeOf: typeof import("bun:test").expectTypeOf;` (`test-globals.d.ts`)
- `declare var beforeAll: typeof import("bun:test").beforeAll;` (`test-globals.d.ts`)
- `declare var beforeEach: typeof import("bun:test").beforeEach;` (`test-globals.d.ts`)
- `declare var afterEach: typeof import("bun:test").afterEach;` (`test-globals.d.ts`)
- `declare var afterAll: typeof import("bun:test").afterAll;` (`test-globals.d.ts`)
- `declare var jest: typeof import("bun:test").jest;` (`test-globals.d.ts`)
- `declare var vi: typeof import("bun:test").vi;` (`test-globals.d.ts`)
- `declare var xit: typeof import("bun:test").xit;` (`test-globals.d.ts`)
- `declare var xtest: typeof import("bun:test").xtest;` (`test-globals.d.ts`)
- `declare var xdescribe: typeof import("bun:test").xdescribe;` (`test-globals.d.ts`)
- `declare var onTestFinished: typeof import("bun:test").onTestFinished;` (`test-globals.d.ts`)
- `declare var aroundEach: typeof import("bun:test").aroundEach;` (`test-globals.d.ts`)
- `declare var aroundAll: typeof import("bun:test").aroundAll;` (`test-globals.d.ts`)
- `declare var test: typeof import("vitest").test;` (`vitest-globals.d.ts`)
- `declare var it: typeof import("vitest").it;` (`vitest-globals.d.ts`)
- `declare var describe: typeof import("vitest").describe;` (`vitest-globals.d.ts`)
- `declare var suite: typeof import("vitest").suite;` (`vitest-globals.d.ts`)
- `declare var expect: typeof import("vitest").expect;` (`vitest-globals.d.ts`)
- `declare var expectTypeOf: typeof import("vitest").expectTypeOf;` (`vitest-globals.d.ts`)
- `declare var assertType: typeof import("vitest").assertType;` (`vitest-globals.d.ts`)
- `declare var vi: typeof import("vitest").vi;` (`vitest-globals.d.ts`)
- `declare var vitest: typeof import("vitest").vitest;` (`vitest-globals.d.ts`)
- `declare var beforeAll: typeof import("vitest").beforeAll;` (`vitest-globals.d.ts`)
- `declare var beforeEach: typeof import("vitest").beforeEach;` (`vitest-globals.d.ts`)
- `declare var afterEach: typeof import("vitest").afterEach;` (`vitest-globals.d.ts`)
- `declare var afterAll: typeof import("vitest").afterAll;` (`vitest-globals.d.ts`)
- `declare var aroundEach: typeof import("vitest").aroundEach;` (`vitest-globals.d.ts`)
- `declare var aroundAll: typeof import("vitest").aroundAll;` (`vitest-globals.d.ts`)
- `declare var onTestFinished: typeof import("vitest").onTestFinished;` (`vitest-globals.d.ts`)
- `declare var onTestFailed: typeof import("vitest").onTestFailed;` (`vitest-globals.d.ts`)
- `declare namespace WebAssembly { interface ValueTypeMap extends Bun.WebAssembly.ValueTypeMap {} interface GlobalDescriptor<T extends keyof ValueTypeMap = keyof ValueTypeMap> extends Bun.WebAssembly .GlobalDescriptor<T> {}` (`wasm.d.ts`)

## Runtime Globals (`docs/runtime/globals.mdx`)

| Global                                                                                                                  | Source         | Notes                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)                                   | Web            |                                                                                                                                                                                                                                               |
| [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)                                           | Web            |                                                                                                                                                                                                                                               |
| [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert)                                                | Web            | Intended for command-line tools                                                                                                                                                                                                               |
| [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)                                                         | Web            |                                                                                                                                                                                                                                               |
| [`Buffer`](https://nodejs.org/api/buffer.html#class-buffer)                                                             | Node.js        | See [Node.js > `Buffer`](/runtime/nodejs-compat#node-buffer)                                                                                                                                                                                  |
| `Bun`                                                                                                                   | Bun            | Subject to change as additional APIs are added                                                                                                                                                                                                |
| [`ByteLengthQueuingStrategy`](https://developer.mozilla.org/en-US/docs/Web/API/ByteLengthQueuingStrategy)               | Web            |                                                                                                                                                                                                                                               |
| [`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)                                            | Web            | Intended for command-line tools                                                                                                                                                                                                               |
| [`__dirname`](https://nodejs.org/api/globals.html#__dirname)                                                            | Node.js        |                                                                                                                                                                                                                                               |
| [`__filename`](https://nodejs.org/api/globals.html#__filename)                                                          | Node.js        |                                                                                                                                                                                                                                               |
| [`atob()`](https://developer.mozilla.org/en-US/docs/Web/API/atob)                                                       | Web            |                                                                                                                                                                                                                                               |
| [`btoa()`](https://developer.mozilla.org/en-US/docs/Web/API/btoa)                                                       | Web            |                                                                                                                                                                                                                                               |
| `BuildMessage`                                                                                                          | Bun            |                                                                                                                                                                                                                                               |
| [`clearImmediate()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearImmediate)                            | Web            |                                                                                                                                                                                                                                               |
| [`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval)                              | Web            |                                                                                                                                                                                                                                               |
| [`clearTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout)                                | Web            |                                                                                                                                                                                                                                               |
| [`console`](https://developer.mozilla.org/en-US/docs/Web/API/console)                                                   | Web            |                                                                                                                                                                                                                                               |
| [`CountQueuingStrategy`](https://developer.mozilla.org/en-US/docs/Web/API/CountQueuingStrategy)                         | Web            |                                                                                                                                                                                                                                               |
| [`Crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)                                                     | Web            |                                                                                                                                                                                                                                               |
| [`crypto`](https://developer.mozilla.org/en-US/docs/Web/API/crypto)                                                     | Web            |                                                                                                                                                                                                                                               |
| [`CryptoKey`](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey)                                               | Web            |                                                                                                                                                                                                                                               |
| [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)                                           | Web            |                                                                                                                                                                                                                                               |
| [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event)                                                       | Web            | Also [`ErrorEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ErrorEvent) [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent) [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent). |
| [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)                                           | Web            |                                                                                                                                                                                                                                               |
| [`exports`](https://nodejs.org/api/globals.html#exports)                                                                | Node.js        |                                                                                                                                                                                                                                               |
| [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch)                                                       | Web            |                                                                                                                                                                                                                                               |
| [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)                                                 | Web            |                                                                                                                                                                                                                                               |
| [`global`](https://nodejs.org/api/globals.html#global)                                                                  | Node.js        | See [Node.js > `global`](/runtime/nodejs-compat#global).                                                                                                                                                                                      |
| [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)             | Cross-platform | Aliases to `global`                                                                                                                                                                                                                           |
| [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers)                                                   | Web            |                                                                                                                                                                                                                                               |
| [`HTMLRewriter`](/runtime/html-rewriter)                                                                                | Cloudflare     |                                                                                                                                                                                                                                               |
| [`JSON`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)                         | Cross-platform |                                                                                                                                                                                                                                               |
| [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent)                                         | Web            |                                                                                                                                                                                                                                               |
| [`module`](https://nodejs.org/api/globals.html#module)                                                                  | Node.js        |                                                                                                                                                                                                                                               |
| [`performance`](https://developer.mozilla.org/en-US/docs/Web/API/performance)                                           | Web            |                                                                                                                                                                                                                                               |
| [`process`](https://nodejs.org/api/process.html)                                                                        | Node.js        | See [Node.js > `process`](/runtime/nodejs-compat#node-process)                                                                                                                                                                                |
| [`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt)                                              | Web            | Intended for command-line tools                                                                                                                                                                                                               |
| [`queueMicrotask()`](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)                                   | Web            |                                                                                                                                                                                                                                               |
| [`ReadableByteStreamController`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableByteStreamController)         | Web            |                                                                                                                                                                                                                                               |
| [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)                                     | Web            |                                                                                                                                                                                                                                               |
| [`ReadableStreamDefaultController`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultController)   | Web            |                                                                                                                                                                                                                                               |
| [`ReadableStreamDefaultReader`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader)           | Web            |                                                                                                                                                                                                                                               |
| [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError)                                           | Web            |                                                                                                                                                                                                                                               |
| [`require()`](https://nodejs.org/api/globals.html#require)                                                              | Node.js        |                                                                                                                                                                                                                                               |
| `ResolveMessage`                                                                                                        | Bun            |                                                                                                                                                                                                                                               |
| [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)                                                 | Web            |                                                                                                                                                                                                                                               |
| [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)                                                   | Web            |                                                                                                                                                                                                                                               |
| [`setImmediate()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate)                                | Web            |                                                                                                                                                                                                                                               |
| [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval)                                  | Web            |                                                                                                                                                                                                                                               |
| [`setTimeout()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)                                    | Web            |                                                                                                                                                                                                                                               |
| [`ShadowRealm`](https://github.com/tc39/proposal-shadowrealm)                                                           | Cross-platform | Stage 3 proposal                                                                                                                                                                                                                              |
| [`SubtleCrypto`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)                                         | Web            |                                                                                                                                                                                                                                               |
| [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException)                                         | Web            |                                                                                                                                                                                                                                               |
| [`TextDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)                                           | Web            |                                                                                                                                                                                                                                               |
| [`TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)                                           | Web            |                                                                                                                                                                                                                                               |
| [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)                                   | Web            |                                                                                                                                                                                                                                               |
| [`TransformStreamDefaultController`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStreamDefaultController) | Web            |                                                                                                                                                                                                                                               |
| [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)                                                           | Web            |                                                                                                                                                                                                                                               |
| [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)                                   | Web            |                                                                                                                                                                                                                                               |
| [`WebAssembly`](https://nodejs.org/api/globals.html#webassembly)                                                        | Web            |                                                                                                                                                                                                                                               |
| [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)                                     | Web            |                                                                                                                                                                                                                                               |
| [`WritableStreamDefaultController`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultController)   | Web            |                                                                                                                                                                                                                                               |
| [`WritableStreamDefaultWriter`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultWriter)           | Web            |                                                                                                                                                                                                                                               |

## `node:*` Compatibility Matrix (`docs/runtime/nodejs-compat.mdx`)

| Scope | Name | Status | Key Notes |
| :--- | :--- | :--- | :--- |
| module | `node:assert` | Full | Fully implemented. Legacy-mode `deepEqual` uses `Bun.deepEquals` semantics rather than Node's loose `==` comparison, and function-valued or `printf`-style `message` arguments are not formatted. |
| module | `node:buffer` | Full | Fully implemented. A single `Buffer` is capped at 4 GiB (`buffer.constants.MAX_LENGTH` is `2**32`). |
| module | `node:console` | Full | Fully implemented. Bun writes console output directly to the stdout/stderr file descriptors and formats it with its own inspector. As a result, replacing `process.stdout.write` does not capture the output, and object lay |
| module | `node:dgram` | Full | Fully implemented. 99% of Node.js's test suite passes. `addMembership()` does not implicitly bind an unbound socket; call `bind()` first. |
| module | `node:diagnostics_channel` | Partial | `channel()`, `subscribe()`, `tracingChannel()` and the `http` client, `http2` and `dgram` built-in channels are implemented. Missing `boundedChannel()` and the `http.server.*`, `net`, `module`, `console`, `child_process` |
| module | `node:dns` | Full | Fully implemented. Missing `resolveTlsa`. Bun ignores the `Resolver` `maxTimeout` option. |
| module | `node:events` | Full | Fully implemented. 95% of Node.js's test suite passes. `EventEmitterAsyncResource` uses `AsyncResource` underneath, so its `asyncId` is always `0`. |
| module | `node:fs` | Full | Fully implemented. 98% of Node.js's test suite passes. `Stats` objects lack the `Temporal.Instant` getters (`atimeInstant` and friends). |
| module | `node:http` | Full | Fully implemented. `http.Server` does not extend `net.Server`. Bun ignores `listen(handle)` and the `fd`, `ipv6Only` and `signal` options of `listen()`. `keepAlive`/`keepAliveInitialDelay` on the server are no-ops. |
| module | `node:https` | Partial | `request`, `get`, `Agent` and `globalAgent` are implemented, including connection pooling. Client sockets are `tls.TLSSocket`s. `https.Server` is `http.Server` with TLS options rather than a `tls.Server`. Its request soc |
| module | `node:os` | Full | Fully implemented. `userInfo()` reads `username`, `shell` and `homedir` from the environment (`USER`, `SHELL`, `HOME`) rather than the passwd database. `machine()` returns `"arm64"` instead of `"aarch64"` on Linux arm64. |
| module | `node:path` | Full | Fully implemented. `matchesGlob()` uses `Bun.Glob` semantics rather than minimatch (`*` matches dotfiles, no extglobs). `path.win32` differs from Node in a few edge cases involving device paths and reserved names. |
| module | `node:punycode` | Full | Fully implemented. 100% of Node.js's test suite passes. _Deprecated by Node.js_. |
| module | `node:querystring` | Full | Fully implemented. 100% of Node.js's test suite passes. |
| module | `node:readline` | Full | Fully implemented. |
| module | `node:stream` | Full | Fully implemented. `isReadable`, `isWritable`, `isErrored` and `Readable.isDisturbed` only understand Node.js streams, not web streams. |
| module | `node:string_decoder` | Full | Fully implemented. 100% of Node.js's test suite passes. `end()` does not accept a string argument. |
| module | `node:timers` | Full | Fully implemented. The exports are the same functions as the globals. `node:timers/promises` (including `scheduler.wait()` and `scheduler.yield()`) is also implemented. |
| module | `node:tty` | Full | Fully implemented. `ReadStream` and `WriteStream` extend the `fs` streams rather than `net.Socket`, and constructing them on a non-TTY fd returns a stream with `isTTY` set to `false` instead of throwing. |
| module | `node:url` | Full | Fully implemented. |
| module | `node:zlib` | Full | Fully implemented. 98% of Node.js's test suite passes. |
| module | `node:async_hooks` | Partial | `AsyncLocalStorage` and `AsyncResource` are implemented. `createHook`, `executionAsyncId`, `triggerAsyncId` and `executionAsyncResource` are stubs: Bun does not invoke hooks, apart from `init` for `process.nextTick`, and |
| module | `node:child_process` | Partial | IPC can send `net.Socket`, `net.Server` and `dgram.Socket` handles (including to and from Node.js processes), but not `http` server sockets. `serialization: "advanced"` only works between Bun processes, so use JSON seria |
| module | `node:cluster` | Partial | `net` and `dgram` servers in workers are shared through the primary as in Node.js (`SCHED_RR` and `SCHED_NONE`), and handles can be passed with `worker.send()`. `node:http`/`node:https` servers in workers each bind their |
| module | `node:crypto` | Partial | Missing `encapsulate`/`decapsulate` (you can use ML-KEM keys through `crypto.subtle`). `argon2()` and `argon2Sync()` are implemented. Custom engines (`setEngine()`) throw, `setFips()` is a no-op and `secureHeapUsed()` re |
| module | `node:domain` | Partial | Missing `Domain` `members`. A domain only catches errors thrown synchronously inside `run()`/`bind()` or emitted by emitters passed to `add()`. Bun does not route errors from timers, `process.nextTick`, promises and othe |
| module | `node:http2` | Full | Client & server are implemented. 94% of Node.js's test suite passes. The `maxDeflateDynamicTableSize`, `peerMaxConcurrentStreams` and `streamResetBurst`/`streamResetRate` options are accepted but ignored. |
| module | `node:module` | Partial | Missing `Module#load()`, `registerHooks`, `findPackageJSON`, `stripTypeScriptTypes`, `getSourceMapsSupport`/`setSourceMapsSupport`. Overriding `require.cache`, `require.extensions` and `module._resolveFilename` is suppor |
| module | `node:net` | Full | Fully implemented, including `BlockList`, `SocketAddress`, `autoSelectFamily`, Unix domain sockets and `server.listen({ fd })`. `new net.Socket({ fd })` cannot read from an existing file descriptor (only write-only wrapp |
| module | `node:perf_hooks` | Partial | `monitorEventLoopDelay()`, `createHistogram()`, `timerify()` and `PerformanceObserver` (`mark`, `measure`, `function`, `net`, `http` and `http2` entries) are implemented. Bun never emits `gc`, `dns` or `resource` entries |
| module | `node:process` | Partial | See `process` Global. |
| module | `node:sys` | Full | See `node:util`. |
| module | `node:tls` | Partial | Missing `pskCallback`, OCSP stapling (`requestOCSP`), the server `'newSession'`/`'resumeSession'` events and session ticket keys (`ticketKeys` is ignored). As a result, session resumption does not work across processes.  |
| module | `node:util` | Full | Fully implemented. Missing `diff` (experimental in Node.js), `transferableAbortSignal` and `transferableAbortController`. `debuglog()` ignores its `callback` argument and the returned function has no `enabled` property. |
| module | `node:v8` | Partial | `writeHeapSnapshot`, `getHeapSnapshot`, `getHeapStatistics`, `getHeapSpaceStatistics`, `GCProfiler` and `startupSnapshot` are implemented. The heap statistics describe JavaScriptCore's single heap, and `setFlagsFromStrin |
| module | `node:vm` | Full | Fully implemented, including `vm.Script`, `vm.createContext`, `vm.runInContext`, `vm.runInNewContext`, `vm.runInThisContext`, `vm.compileFunction`, `vm.isContext`, the ES module classes `vm.Module`, `vm.SourceTextModule` |
| module | `node:wasi` | Partial | Partially implemented. `WASI` supports `args`, `env`, `preopens`, `wasiImport` and `start()`, and `bun ./program.wasm` runs a WASI command directly. Missing `getImportObject()` (use `wasiImport`), `initialize()` and the  |
| module | `node:worker_threads` | Partial | `Worker` ignores the `resourceLimits` and `trackUnmanagedFds` options. Some `execArgv` flags take effect in the worker, for example `--no-addons`, `--stack-trace-limit` and `--tls-min-v1.3`. Others, for example `--condit |
| module | `node:inspector` | Partial | Partially implemented. `Session` supports the `Profiler` domain (including precise coverage), `Runtime.enable` and `NodeTracing`, from both `node:inspector` and `node:inspector/promises`. After `open()`, `Session` also f |
| module | `node:repl` | Partial | Mostly implemented. `bun --interactive` starts a Node.js-compatible REPL. The REPL does not show result previews (they need V8's inspector-based side-effect-free eval). Tab-completion skips `let`/`const`/`class` bindings |
| module | `node:sqlite` | Full | Fully implemented. `backup()` runs synchronously and blocks the event loop for the duration of the copy (Node runs it on a worker thread). A `Buffer`/`Uint8Array` database path must be valid UTF-8 (Node passes the raw by |
| module | `node:test` | Partial | Partially implemented. The in-process API works when test files run under `bun test`: tests, suites, subtests, hooks, `t.plan()`, `t.assert`, `assert.register()`, `t.waitFor()`, `getTestContext()`, `expectFailure`, and ` |
| module | `node:trace_events` | Full | Fully implemented. `createTracing()`, `getEnabledCategories()` and the `--trace-events-enabled`, `--trace-event-categories` and `--trace-event-file-pattern` flags are supported. Bun writes the trace at exit. Some categor |
| module | `node:quic` | Full | Implemented: `listen()`, `connect()`, `QuicEndpoint`, `QuicSession` and `QuicStream`. 99% of Node.js's test suite passes. The API is experimental in Node.js, and importing it emits an `ExperimentalWarning` in Bun too. |
| module | `node:sea` | Not implemented | Not implemented. Use `bun build --compile` to build single-file executables instead. |
| global | `AbortController` | Full | Fully implemented. |
| global | `AbortSignal` | Full | Fully implemented. |
| global | `Blob` | Full | Fully implemented. The `endings` constructor option is ignored, and `blob.stream()` does not support BYOB readers. |
| global | `Buffer` | Full | Fully implemented. A single `Buffer` is capped at 4 GiB (`buffer.constants.MAX_LENGTH` is `2**32`). |
| global | `ByteLengthQueuingStrategy` | Full | Fully implemented. |
| global | `__dirname` | Full | Fully implemented. |
| global | `__filename` | Full | Fully implemented. |
| global | `[` | Full | Fully implemented. |
| global | `Atomics` | Full | Fully implemented. |
| global | `BroadcastChannel` | Full | Fully implemented. |
| global | `[` | Full | Fully implemented. |
| global | `[` | Full | Fully implemented. |
| global | `[` | Full | Fully implemented. |
| global | `[` | Full | Fully implemented. |
| global | `CloseEvent` | Full | Fully implemented. |
| global | `CompressionStream` | Full | Fully implemented. |
| global | `console` | Full | Fully implemented. See `node:console` for the differences in how output is written. |
| global | `CountQueuingStrategy` | Full | Fully implemented. |
| global | `Crypto` | Full | Fully implemented. |
| global | `[` | Full | Fully implemented. See `SubtleCrypto` for the algorithms Bun does not support. |
| global | `CryptoKey` | Full | Fully implemented. |
| global | `CustomEvent` | Full | Fully implemented. |
| global | `DecompressionStream` | Full | Fully implemented. |
| global | `ErrorEvent` | Full | Fully implemented. |
| global | `Event` | Full | Fully implemented. |
| global | `EventTarget` | Full | Fully implemented. |
| global | `exports` | Full | Fully implemented. |
| global | `fetch` | Full | Fully implemented. The `integrity` option is ignored. |
| global | `File` | Full | Fully implemented. `File` objects report `Blob` as their `constructor` and `Symbol.toStringTag`. |
| global | `FormData` | Full | Fully implemented. |
| global | `global` | Full | Implemented. `global` is an object containing all objects in the global namespace. It's rarely referenced directly, as its contents are available without a prefix, for example `console` instead of `global.console`. |
| global | `globalThis` | Full | Aliases to `global`. |
| global | `Headers` | Full | Fully implemented. |
| global | `MessageChannel` | Full | Fully implemented. |
| global | `MessageEvent` | Full | Fully implemented. |
| global | `MessagePort` | Full | Fully implemented. The EventEmitter-style methods Node.js adds (`on()`, `once()`, `off()`, ...) are only installed once `node:worker_threads` has been loaded. |
| global | `module` | Full | Fully implemented. Missing `module.isPreloading`. |
| global | `navigator` | Partial | `userAgent`, `platform` and `hardwareConcurrency` are implemented. Missing `language`, `languages` and `locks`. The `Navigator` class is not a global. |
| global | `PerformanceEntry` | Full | Fully implemented. |
| global | `PerformanceMark` | Full | Fully implemented. |
| global | `PerformanceMeasure` | Full | Fully implemented. |
| global | `PerformanceObserver` | Partial | Observing `mark` and `measure` entries works. Bun only delivers Node-only entry types (`function`, `http`, `net`, ...) to the `node:perf_hooks` `PerformanceObserver`, and never emits `gc`, `dns` or `resource` entries. |
| global | `PerformanceObserverEntryList` | Full | Fully implemented. |
| global | `PerformanceResourceTiming` | Partial | The class exists, but no entries are ever created: `fetch()` does not record resource timing and `performance.markResourceTiming()` is a no-op. |
| global | `performance` | Partial | `now()`, `timeOrigin`, `mark()`, `measure()` and `getEntries()` are implemented. The Node.js additions (`eventLoopUtilization()`, `nodeTiming`, `timerify()`) only exist once `node:perf_hooks` has been loaded. `eventLoopU |
| global | `process` | Partial | Mostly implemented. `process.binding` (internal Node.js bindings some packages rely on) is partially implemented: `buffer`, `config`, `constants`, `crypto/x509`, `fs`, `http_parser`, `natives`, `tty_wrap`, `util` and `uv |
| global | `[` | Full | Fully implemented. |
| global | `QuotaExceededError` | Not implemented | Not implemented. |
| global | `ReadableByteStreamController` | Full | Fully implemented. |
| global | `ReadableStream` | Full | Fully implemented. Streams cannot be transferred with `postMessage()` or `structuredClone()`. |
| global | `ReadableStreamBYOBReader` | Full | Fully implemented. |
| global | `ReadableStreamBYOBRequest` | Full | Fully implemented. |
| global | `ReadableStreamDefaultController` | Full | Fully implemented. |
| global | `ReadableStreamDefaultReader` | Full | Fully implemented. |
| global | `[` | Full | Fully implemented, including `require.main`, `require.cache`, `require.resolve`. |
| global | `Response` | Full | Fully implemented. A `Response` constructed from a string does not expose the default `content-type` header in `headers` (`Bun.serve()` still sends it). |
| global | `Request` | Partial | Missing `keepalive` and `duplex`. The `credentials`, `integrity`, `referrer` and `referrerPolicy` options are accepted but ignored. |
| global | `[` | Full | Fully implemented. |
| global | `[` | Full | Fully implemented. |
| global | `[` | Full | Fully implemented. |
| global | `[` | Full | Fully implemented. Only `ArrayBuffer` and `MessagePort` can be transferred, and cloned `Error`s lose their `cause`. |
| global | `Storage` | Not implemented | Not implemented. Bun has no `Storage`, `localStorage` or `sessionStorage` globals. |
| global | `SubtleCrypto` | Full | Fully implemented, including `supports()`, `getPublicKey()`, the `encapsulate*()`/`decapsulate*()` methods, `ML-DSA`, `ML-KEM-768`/`ML-KEM-1024`, `SHA3-*` and `ChaCha20-Poly1305`. Missing the `Ed448`, `X448`, `AES-OCB`,  |
| global | `DOMException` | Full | Fully implemented. Instances are not native errors (`Error.isError()` returns `false`). |
| global | `TextDecoder` | Full | Fully implemented. |
| global | `TextDecoderStream` | Full | Fully implemented. |
| global | `TextEncoder` | Full | Fully implemented. |
| global | `TextEncoderStream` | Full | Fully implemented. |
| global | `TransformStream` | Full | Fully implemented. Cannot be transferred with `postMessage()` or `structuredClone()`. |
| global | `TransformStreamDefaultController` | Full | Fully implemented. |
| global | `URL` | Full | Fully implemented. |
| global | `URLPattern` | Full | Fully implemented. |
| global | `URLSearchParams` | Full | Fully implemented. |
| global | `WebAssembly` | Full | Fully implemented. Memory64 is disabled by default (set `BUN_JSC_useWasmMemory64=1` to enable it). |
| global | `WebSocket` | Full | Fully implemented. `binaryType` defaults to `"nodebuffer"`, so binary messages arrive as `Buffer`s. Node.js defaults to `"blob"`. |
| global | `WritableStream` | Full | Fully implemented. Cannot be transferred with `postMessage()` or `structuredClone()`. |
| global | `WritableStreamDefaultController` | Full | Fully implemented. |
| global | `WritableStreamDefaultWriter` | Full | Fully implemented. |
