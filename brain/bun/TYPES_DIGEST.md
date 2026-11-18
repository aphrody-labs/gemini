# Bun Types Digest (`packages/bun-types`)

Covers 28 declaration files (26 root `*.d.ts` + 2 `ts7.1/*.d.ts`). Comments and long literal unions compressed for dense lookup.

## `bun.d.ts` (11384 lines -> 1661 lines, 604 nested lines elided)

```ts
declare module "bun" {
  type int32 = number & { readonly "bun.int32"?: true };
  type PathLike = string | NodeJS.TypedArray | ArrayBufferLike | URL;
  type ArrayBufferView<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> =
    NodeJS.TypedArray<TArrayBuffer> | DataView<TArrayBuffer>;
  type BufferSource = NodeJS.TypedArray<ArrayBufferLike> | DataView<ArrayBufferLike> | ArrayBufferLike;
  type StringOrBuffer = string | NodeJS.TypedArray | ArrayBufferLike;
  type XMLHttpRequestBodyInit = Blob | BufferSource | FormData | URLSearchParams | string;
  type ReadableStreamController<T> = ReadableStreamDefaultController<T>;
  type ReadableStreamDefaultReadResult<T> =
    ReadableStreamDefaultReadValueResult<T> | ReadableStreamDefaultReadDoneResult;
  type ReadableStreamReader<T> = ReadableStreamDefaultReader<T>;
  type Transferable = ArrayBuffer | MessagePort;
  type MessageEventSource = Bun.__internal.UseLibDomIfAvailable<"MessageEventSource", undefined>;
  type Encoding = | "unicode-1-1-utf-8" | "unicode11utf8" | "unicode20utf8" | "utf-8" | "utf8" | ... (+217 literals);
  type UncaughtExceptionOrigin = "uncaughtException" | "unhandledRejection";
  type MultipleResolveType = "resolve" | "reject";
  type BeforeExitListener = (code: number) => void;
  type DisconnectListener = () => void;
  type ExitListener = (code: number) => void;
  type RejectionHandledListener = (promise: Promise<unknown>) => void;
  type FormDataEntryValue = File | string;
  type WarningListener = (warning: Error) => void;
  type MessageListener = (message: unknown, sendHandle: unknown) => void;
  type SignalsListener = (signal: NodeJS.Signals) => void;
  type BlobPart = string | Blob | BufferSource;
  type TimerHandler = (...args: any[]) => void;
  type DOMHighResTimeStamp = number;
  type EventListenerOrEventListenerObject = EventListener | EventListenerObject;
  type BlobOrStringOrBuffer = string | NodeJS.TypedArray | ArrayBufferLike | Blob;
  type MaybePromise<T> = T | Promise<T>;
  interface ErrorEventInit extends EventInit {
    colno?: number;
    error?: any;
    filename?: string;
    lineno?: number;
    message?: string;
  }
  interface CloseEventInit extends EventInit {
    code?: number;
    reason?: string;
    wasClean?: boolean;
  }
  interface MessageEventInit<T = any> extends EventInit {
    data?: T;
    lastEventId?: string;
    origin?: string;
    source?: Bun.MessageEventSource | null;
  }
  interface EventInit {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
  }
  interface EventListenerOptions {
    capture?: boolean;
  }
  interface CustomEventInit<T = any> extends Bun.EventInit {
    detail?: T;
  }
  interface BunMessageEvent<T = any> extends Event {
    readonly data: T;
    readonly lastEventId: string;
    readonly origin: string;
    readonly ports: readonly MessagePort[]; // ReadonlyArray<typeof import("worker_threads").MessagePort["prototype"]>;
    readonly source: Bun.MessageEventSource | null;
  }
  type MessageEvent<T = any> = Bun.__internal.UseLibDomIfAvailable<"MessageEvent", BunMessageEvent<T>>;
  interface ReadableStreamDefaultReadManyResult<T> {
    done: boolean;
    size: number;
    value: T[];
  }
  interface EventSourceEventMap {
    error: Event;
    message: MessageEvent;
    open: Event;
  }
  interface AddEventListenerOptions extends EventListenerOptions {
    once?: boolean;
    passive?: boolean;
    signal?: AbortSignal;
  }
  interface EventListener {
    (evt: Event): void;
  }
  interface EventListenerObject {
    handleEvent(object: Event): void;
  }
  interface FetchEvent extends Event {
    readonly request: Request;
    readonly url: string;
    waitUntil(promise: Promise<any>): void;
    respondWith(response: Response | Promise<Response>): void;
  }
  interface EventMap {
    fetch: FetchEvent;
    message: MessageEvent;
    messageerror: MessageEvent;
  }
  interface StructuredSerializeOptions {
    transfer?: Bun.Transferable[];
  }
  interface EventSource extends EventTarget {
    new (url: string | URL, eventSourceInitDict?: EventSourceInit): EventSource;
    onerror: ((this: EventSource, ev: Event) => any) | null;
    onmessage: ((this: EventSource, ev: MessageEvent) => any) | null;
    onopen: ((this: EventSource, ev: Event) => any) | null;
    readonly readyState: number;
    readonly url: string;
    readonly withCredentials: boolean;
    close(): void;
    readonly CLOSED: 2;
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    addEventListener<K extends keyof EventSourceEventMap>(
    ): void;
    addEventListener(
    ): void;
    addEventListener(
    ): void;
    removeEventListener<K extends keyof EventSourceEventMap>(
    ): void;
    removeEventListener(
    ): void;
    removeEventListener(
    ): void;
    ref(): void;
    unref(): void;
  }
  interface TransformerFlushCallback<O> {
    (controller: TransformStreamDefaultController<O>): void | PromiseLike<void>;
  }
  interface TransformerStartCallback<O> {
    (controller: TransformStreamDefaultController<O>): any;
  }
  interface TransformerTransformCallback<I, O> {
    (chunk: I, controller: TransformStreamDefaultController<O>): void | PromiseLike<void>;
  }
  interface UnderlyingSinkAbortCallback {
    (reason?: any): void | PromiseLike<void>;
  }
  interface UnderlyingSinkCloseCallback {
    (): void | PromiseLike<void>;
  }
  interface UnderlyingSinkStartCallback {
    (controller: WritableStreamDefaultController): any;
  }
  interface UnderlyingSinkWriteCallback<W> {
    (chunk: W, controller: WritableStreamDefaultController): void | PromiseLike<void>;
  }
  interface UnderlyingSourceCancelCallback {
    (reason?: any): void | PromiseLike<void>;
  }
  interface UnderlyingSink<W = any> {
    abort?: UnderlyingSinkAbortCallback;
    close?: UnderlyingSinkCloseCallback;
    start?: UnderlyingSinkStartCallback;
    type?: undefined | "default" | "bytes";
    write?: UnderlyingSinkWriteCallback<W>;
  }
  interface UnderlyingSource<R = any> {
    cancel?: UnderlyingSourceCancelCallback;
    pull?: UnderlyingSourcePullCallback<R>;
    start?: UnderlyingSourceStartCallback<R>;
    type?: undefined;
  }
  interface DirectUnderlyingSource<R = any> {
    cancel?: UnderlyingSourceCancelCallback;
    pull: (controller: ReadableStreamDirectController) => void | PromiseLike<void>;
    type: "direct";
  }
  interface UnderlyingSourcePullCallback<R> {
    (controller: ReadableStreamController<R>): void | PromiseLike<void>;
  }
  interface UnderlyingSourceStartCallback<R> {
    (controller: ReadableStreamController<R>): any;
  }
  interface GenericTransformStream {
    readonly readable: ReadableStream;
    readonly writable: WritableStream;
  }
  interface AbstractWorkerEventMap {
    error: ErrorEvent;
  }
  interface WorkerEventMap extends AbstractWorkerEventMap {
    message: MessageEvent;
    messageerror: MessageEvent;
    close: CloseEvent;
    open: Event;
  }
  type WorkerType = "classic" | "module";
  interface AbstractWorker {
    onerror: ((this: AbstractWorker, ev: ErrorEvent) => any) | null;
    addEventListener<K extends keyof AbstractWorkerEventMap>(
    ): void;
    addEventListener(
    ): void;
    removeEventListener<K extends keyof AbstractWorkerEventMap>(
    ): void;
    removeEventListener(
    ): void;
  }
  interface WorkerOptions {
    name?: string;
    smol?: boolean;
    ref?: boolean;
    type?: Bun.WorkerType | undefined;
    argv?: any[] | undefined;
    env?: Record<string, string> | (typeof import("node:worker_threads"))["SHARE_ENV"] | undefined;
    credentials?: import("undici-types").RequestCredentials | undefined;
    preload?: string[] | string | undefined;
  }
  interface Worker extends EventTarget, AbstractWorker {
    onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
    onmessageerror: ((this: Worker, ev: MessageEvent) => any) | null;
    postMessage(message: any, transfer: Transferable[]): void;
    postMessage(message: any, options?: StructuredSerializeOptions): void;
    terminate(): void;
    addEventListener<K extends keyof WorkerEventMap>(
    ): void;
    addEventListener(
    ): void;
    removeEventListener<K extends keyof WorkerEventMap>(
    ): void;
    removeEventListener(
    ): void;
    ref(): void;
    unref(): void;
    threadId: number;
  }
  interface Env {
    NODE_ENV?: string;
    TZ?: string;
  }
  const env: Env & NodeJS.ProcessEnv & ImportMetaEnv;
  const argv: string[];
  interface WhichOptions {
    PATH?: string;
    cwd?: string;
  }
  function which(command: string, options?: WhichOptions): string | null;
  interface StringWidthOptions {
    countAnsiEscapeCodes?: boolean;
    ambiguousIsNarrow?: boolean;
    perCodePoint?: boolean;
  }
  function stringWidth(
    input: string,
    options?: StringWidthOptions,
  ): number;
  function stripANSI(input: string): string;
  interface SliceAnsiOptions {
    ellipsis?: string;
    ambiguousIsNarrow?: boolean;
  }
  function sliceAnsi(
    input: string,
    start?: number,
    end?: number,
    options?: string | boolean | SliceAnsiOptions,
    ambiguousIsNarrow?: boolean,
  ): string;
  interface WrapAnsiOptions {
    hard?: boolean;
    wordWrap?: boolean;
    trim?: boolean;
    ambiguousIsNarrow?: boolean;
  }
  function wrapAnsi(
    input: string,
    columns: number,
    options?: WrapAnsiOptions,
  ): string;
  namespace TOML {
    export function parse(
    ): object;
    export function stringify<T>(
    ): T extends Function | symbol | undefined ? undefined : T extends object ? string : string | undefined;
  }
  namespace XML {
    type Value = string | Element;
    interface Element {
    }
    interface Document {
    }
    interface Node {
    }
    interface Comment {
    }
    interface ProcessingInstruction {
    }
    interface ParseOptions {
    }
    function parse(
    ): Document;
    function parse(
    ): Node;
    function parse(
    ): Document | Node;
    type Scalar = string | number | boolean | bigint | Date;
    interface NodeInput {
    }
    function stringify(value: NodeInput | Document, replacer?: undefined | null, space?: string | number): string;
    function stringify(value: unknown, replacer?: undefined | null, space?: string | number): string | undefined;
  }
  namespace JSONC {
    export function parse(input: string): unknown;
  }
  namespace JSONL {
    interface ParseChunkResult {
    }
    export function parse(input: string | NodeJS.TypedArray | DataView<ArrayBufferLike> | ArrayBufferLike): unknown[];
    export function parseChunk(
    ): ParseChunkResult;
  }
  namespace YAML {
    export function parse(
    ): unknown;
    export function stringify(input: unknown, replacer?: undefined | null, space?: string | number): string;
  }
  namespace markdown {
    interface Options {
    }
    type Component<P = {}> = string | ((props: P) => any) | (new (props: P) => any);
    interface ChildrenProps {
    }
    interface HeadingProps extends ChildrenProps {
    }
    interface OrderedListProps extends ChildrenProps {
    }
    interface ListItemProps extends ChildrenProps {
    }
    interface CodeBlockProps extends ChildrenProps {
    }
    interface CellProps extends ChildrenProps {
    }
    interface LinkProps extends ChildrenProps {
    }
    interface ImageProps {
    }
    interface ComponentOverrides {
    }
    interface HeadingMeta {
    }
    interface CodeBlockMeta {
    }
    interface ListMeta {
    }
    interface ListItemMeta {
    }
    interface CellMeta {
    }
    interface LinkMeta {
    }
    interface ImageMeta {
    }
    interface RenderCallbacks {
    }
    interface ReactOptions extends Options {
    }
    export function html(
    ): string;
    export interface AnsiTheme {
    }
    export function ansi(
    ): string;
    export function render(
    ): string;
    export function react(
    ): import("./jsx.d.ts").JSX.Element;
  }
  namespace JSON5 {
    export function parse(input: string): unknown;
    export function stringify(input: unknown, replacer?: undefined | null, space?: string | number): string | undefined;
  }
  function resolveSync(moduleId: string, parent: string): string;
  function resolve(moduleId: string, parent: string): Promise<string>;
  function write(
    destination: BunFile | S3File | PathLike,
    input: Blob | NodeJS.TypedArray | ArrayBufferLike | string | BlobPart[] | Archive | ReadableStream,
    options?: {
    },
  ): Promise<number>;
  function write(
    destination: BunFile,
    input: Response | Request,
    options?: {
    },
  ): Promise<number>;
  function write(
    destinationPath: PathLike,
    input: Response | Request,
    options?: {
    },
  ): Promise<number>;
  function write(
    destination: BunFile,
    input: BunFile,
    options?: {
    },
  ): Promise<number>;
  function write(
    destinationPath: PathLike,
    input: BunFile,
    options?: {
    },
  ): Promise<number>;
  interface SystemError extends Error {
    errno?: number | undefined;
    code?: string | undefined;
    path?: string | undefined;
    syscall?: string | undefined;
  }
  function concatArrayBuffers(buffers: Array<ArrayBufferView | ArrayBufferLike>, maxLength?: number): ArrayBuffer;
  function concatArrayBuffers(
    buffers: Array<ArrayBufferView | ArrayBufferLike>,
    maxLength: number,
    asUint8Array: false,
  ): ArrayBuffer;
  function concatArrayBuffers(
    buffers: Array<ArrayBufferView | ArrayBufferLike>,
    maxLength: number,
    asUint8Array: true,
  ): Uint8Array<ArrayBuffer>;
  function readableStreamToArrayBuffer(
    stream: ReadableStream<ArrayBufferView | ArrayBufferLike>,
  ): Promise<ArrayBuffer> | ArrayBuffer;
  function readableStreamToFormData(
    stream: ReadableStream<string | NodeJS.TypedArray | ArrayBufferView>,
    multipartBoundaryExcludingDashes?: string | NodeJS.TypedArray | ArrayBufferView,
  ): Promise<FormData>;
  function readableStreamToArray<T>(stream: ReadableStream<T>): Promise<T[]> | T[];
  function escapeHTML(input: string | object | number | boolean): string;
  function pathToFileURL(path: string): URL;
  function peek<T = undefined>(promise: T | Promise<T>): Promise<T> | T;
  namespace peek {
    function status<T = undefined>(promise: T | Promise<T>): "pending" | "fulfilled" | "rejected";
  }
  function fileURLToPath(url: URL | string): string;
  class ArrayBufferSink {
    start(options?: {
    }): void;
    write(chunk: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer): number;
    flush(): number | Uint8Array<ArrayBuffer> | ArrayBuffer;
    end(): ArrayBuffer | Uint8Array<ArrayBuffer>;
  }
  namespace dns {
    function lookup(
    ): Promise<DNSLookup[]>;
    function prefetch(hostname: string, port?: number): void;
    function getCacheStats(): {
    };
    const ADDRCONFIG: number;
    const ALL: number;
    const V4MAPPED: number;
  }
  interface DNSLookup {
    address: string;
    family: 4 | 6;
    ttl: number;
  }
  interface FileBlob extends BunFile {}
  interface BunFile extends Blob {
    slice(begin?: number, end?: number, contentType?: string): BunFile;
    slice(begin?: number, contentType?: string): BunFile;
    slice(contentType?: string): BunFile;
    writer(options?: { highWaterMark?: number }): FileSink;
    lastModified: number;
    readonly name?: string;
    exists(): Promise<boolean>;
    write(
    ): Promise<number>;
    unlink(): Promise<void>;
    delete(): Promise<void>;
    stat(): Promise<import("node:fs").Stats>;
  }
  type CSRFAlgorithm = "blake2b256" | "blake2b512" | "sha256" | "sha384" | "sha512" | "sha512-256";
  interface CSRFGenerateOptions {
    expiresIn?: number;
    encoding?: "base64" | "base64url" | "hex";
    algorithm?: CSRFAlgorithm;
    sessionId?: string;
  }
  interface CSRFVerifyOptions {
    secret?: string;
    encoding?: "base64" | "base64url" | "hex";
    algorithm?: CSRFAlgorithm;
    maxAge?: number;
    sessionId?: string;
  }
  namespace CSRF {
    function generate(secret?: string, options?: CSRFGenerateOptions): string;
    function verify(token: string, options?: CSRFVerifyOptions): boolean;
  }
  type MacroMap = Record<string, Record<string, string>>;
  const hash: ((data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: number | bigint) => bigint) &
    Hash;
  interface Hash {
    wyhash: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: bigint) => bigint;
    adler32: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer) => number;
    crc32: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: number) => number;
    cityHash32: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer) => number;
    cityHash64: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: bigint) => bigint;
    xxHash32: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: number) => number;
    xxHash64: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: bigint) => bigint;
    xxHash3: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: bigint) => bigint;
    murmur32v3: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: number) => number;
    murmur32v2: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: number) => number;
    murmur64v2: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: bigint) => bigint;
    rapidhash: (data: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer, seed?: bigint) => bigint;
  }
  type JavaScriptLoader = "jsx" | "js" | "ts" | "tsx";
  function deepEquals(
    a: any,
    b: any,
    strict?: boolean,
  ): boolean;
  function deepMatch(subset: unknown, a: unknown): boolean;
  interface TSConfig {
    extends?: string;
    compilerOptions?: {
    };
  }
  interface TranspilerOptions {
    define?: Record<string, string>;
    loader?: JavaScriptLoader;
    target?: Target;
    tsconfig?: string | TSConfig;
    macro?: MacroMap;
    autoImportJSX?: boolean;
    allowBunRuntime?: boolean;
    exports?: {
    };
    treeShaking?: boolean;
    trimUnusedImports?: boolean;
    jsxOptimizationInline?: boolean;
    minifyWhitespace?: boolean;
    deadCodeElimination?: boolean;
    inline?: boolean;
    logLevel?: "verbose" | "debug" | "info" | "warn" | "error";
    replMode?: boolean;
  }
  class Transpiler {
    constructor(options?: TranspilerOptions);
    transform(code: Bun.StringOrBuffer, loader?: JavaScriptLoader): Promise<string>;
    transformSync(code: Bun.StringOrBuffer, loader: JavaScriptLoader, ctx: object): string;
    transformSync(code: Bun.StringOrBuffer, ctx: object): string;
    transformSync(code: Bun.StringOrBuffer, loader?: JavaScriptLoader): string;
    scan(code: Bun.StringOrBuffer): { exports: string[]; imports: Import[] };
    scanImports(code: Bun.StringOrBuffer): Import[];
  }
  type ImportKind =
    | "import-statement"
    | "require-call"
    | "require-resolve"
    | "dynamic-import"
    | "import-rule"
    | "url-token"
    | "internal"
    | "entry-point-run"
    | "entry-point-build";
  interface Import {
    path: string;
    kind: ImportKind;
  }
  namespace Build {
    type Architecture = "x64" | "arm64" | "aarch64";
    type Libc = "glibc" | "musl";
    type SIMD = "baseline" | "modern";
    type CompileTarget =
    type TrimFeature = | "cli" | "lint" | "fmt" | "check" | "install" | ... (+68 literals);
  }
  interface BuildConfig {
    splitting?: boolean;
    splitRequire?: boolean;
    minChunkSize?: number;
    modulePreload?: boolean;
    entrypoints: string[];
    target?: Target; // default: "browser"
    format?:
    naming?:
    root?: string; // project root
    plugins?: BunPlugin[];
    external?: string[];
    allowUnresolved?: string[];
    packages?: "bundle" | "external";
    publicPath?: string;
    define?: Record<string, string>;
    loader?: { [k in string]: Loader };
    sourcemap?: "none" | "linked" | "inline" | "external" | boolean;
    conditions?: Array<string> | string;
    env?: "inline" | "disable" | `${string}*`;
    minify?:
    ignoreDCEAnnotations?: boolean;
    emitDCEAnnotations?: boolean;
    deprecatedNamespaceObjectSetters?: boolean;
    treeShaking?: boolean;
    bytecode?: boolean;
    bytecodeDepth?: number;
    optimize?: {
    };
    banner?: string;
    footer?: string;
    drop?: string[];
    features?: string[];
    optimizeImports?: string[];
    check?: boolean;
    dts?: boolean;
    throw?: boolean;
    tsconfig?: string;
    jsx?: {
    };
    reactFastRefresh?: boolean;
    reactCompiler?: boolean;
    reactCompilerOutputMode?: "client" | "ssr";
    files?: Record<string, string | Blob | NodeJS.TypedArray | ArrayBufferLike>;
    metafile?: boolean;
    outdir?: string;
    compile?: boolean | Bun.Build.CompileTarget | CompileBuildOptions;
  }
  type AotReport = "text" | "json" | "guards" | "guards-json" | "trim" | "allocations" | "forms" | "statistics";
  interface TrimOptions {
    allow?: Bun.Build.TrimFeature[];
    remove?: Bun.Build.TrimFeature[];
    locales?: string[];
    log?: boolean;
  }
  interface CompileBuildOptions {
    target?: Bun.Build.CompileTarget;
    execArgv?: string[];
    disallowCodeGenerationFromStrings?: boolean | "strict";
    executablePath?: string;
    trim?: boolean | TrimOptions;
    outfile?: string;
    assets?: string[];
    functionSource?: boolean;
    allowCodeFromDisk?: boolean;
    autoloadDotenv?: boolean;
    autoloadBunfig?: boolean;
    autoloadTsconfig?: boolean;
    autoloadPackageJson?: boolean;
    aot?: boolean;
    obfuscate?: boolean;
    inspector?: boolean;
    aotExplain?: AotReport | AotReport[];
    aotHarden?: string | string[];
    aotOrder?: string | string[] | false | null;
    aotRecordOrder?: boolean;
    bytecodeOrder?: string | string[] | false | null;
    jitPolicy?: number;
    windows?: {
    };
  }
  namespace Password {
    interface Argon2Algorithm {
    }
    interface BCryptAlgorithm {
    }
    type AlgorithmLabel = (BCryptAlgorithm | Argon2Algorithm)["algorithm"];
  }
  const password: {
    verify(
    ): Promise<boolean>;
    hash(
    ): Promise<string>;
    verifySync(
    ): boolean;
    hashSync(
    ): string;
  };
  const secrets: {
    get(options: {
    }): Promise<string | null>;
    set(options: {
    }): Promise<void>;
    delete(options: {
    }): Promise<boolean>;
  };
  interface BuildArtifact extends Blob {
    path: string;
    loader: Loader;
    hash: string | null;
    kind: "entry-point" | "chunk" | "asset" | "sourcemap" | "bytecode";
    sourcemap: BuildArtifact | null;
  }
  interface BuildOutput {
    outputs: BuildArtifact[];
    success: boolean;
    logs: Array<BuildMessage | ResolveMessage>;
    metafile?: BuildMetafile;
  }
  interface BuildMetafile {
    inputs: {
    };
    outputs: {
    };
  }
  function build(config: BuildConfig): Promise<BuildOutput>;
  interface ErrorLike extends Error {
    code?: string;
    errno?: number;
    syscall?: string;
  }
  interface TLSOptions {
    passphrase?: string;
    dhParamsFile?: string;
    serverName?: string;
    servername?: string;
    lowMemoryMode?: boolean;
    rejectUnauthorized?: boolean;
    requestCert?: boolean;
    ca?: string | BufferSource | BunFile | Array<string | BufferSource | BunFile> | undefined;
    crl?: string | BufferSource | BunFile | Array<string | BufferSource | BunFile> | undefined;
    cert?: string | BufferSource | BunFile | Array<string | BufferSource | BunFile> | undefined;
    key?: string | BufferSource | BunFile | Array<string | BufferSource | BunFile> | undefined;
    secureOptions?: number | undefined; // Value is a numeric bitmask of the `SSL_OP_*` options
    ALPNProtocols?: string | BufferSource;
    ciphers?: string;
    clientRenegotiationLimit?: number;
    clientRenegotiationWindow?: number;
  }
  interface SocketAddress {
    address: string;
    port: number;
    family: "IPv4" | "IPv6";
  }
  function file(path: string | URL, options?: BlobPropertyBag): BunFile;
  const embeddedFiles: ReadonlyArray<Blob>;
  const isStandaloneExecutable: boolean;
  function file(path: ArrayBufferLike | Uint8Array<ArrayBuffer>, options?: BlobPropertyBag): BunFile;
  function file(fileDescriptor: number, options?: BlobPropertyBag): BunFile;
  function allocUnsafe(size: number): Uint8Array<ArrayBuffer>;
  interface BunInspectOptions {
    colors?: boolean;
    depth?: number;
    sorted?: boolean;
    compact?: boolean;
  }
  type WebSocketOptionsProtocolsOrProtocol =
    | {
    | {
  type WebSocketOptionsTLS = {
    tls?: TLSOptions & {
    };
  };
  type WebSocketOptionsHeaders = {
    headers?: import("node:http").OutgoingHttpHeaders | Headers | [string, string][];
  };
  type WebSocketOptionsProxy = {
    proxy?:
  };
  type WebSocketOptionsCompression = {
    perMessageDeflate?: boolean;
  };
  type WebSocketOptions = WebSocketOptionsProtocolsOrProtocol &
    WebSocketOptionsTLS &
    WebSocketOptionsHeaders &
    WebSocketOptionsProxy &
    WebSocketOptionsCompression;
  interface WebSocketEventMap {
    close: CloseEvent;
    error: ErrorEvent;
    message: globalThis.MessageEvent;
    open: Event;
    ping: globalThis.MessageEvent;
    pong: globalThis.MessageEvent;
  }
  interface WebSocket extends EventTarget {
    readonly url: string;
    readonly URL: string;
    readonly readyState:
    readonly bufferedAmount: number;
    readonly protocol: string;
    readonly extensions: string;
    binaryType: "arraybuffer" | "blob" | "nodebuffer";
    onopen: ((this: WebSocket, ev: Event) => any) | null;
    onmessage: ((this: WebSocket, ev: globalThis.MessageEvent) => any) | null;
    onerror: ((this: WebSocket, ev: ErrorEvent) => any) | null;
    onclose: ((this: WebSocket, ev: CloseEvent) => any) | null;
    send(data: string | ArrayBufferLike | ArrayBufferView | Blob): void;
    close(code?: number, reason?: string): void;
    ping(data?: string | ArrayBufferLike | ArrayBufferView | Blob): void;
    pong(data?: string | ArrayBufferLike | ArrayBufferView | Blob): void;
    terminate(): void;
    pause(): boolean;
    resume(): boolean;
    readonly isPaused: boolean;
    addEventListener<K extends keyof WebSocketEventMap>(
    ): void;
    addEventListener(
    ): void;
    removeEventListener<K extends keyof WebSocketEventMap>(
    ): void;
    removeEventListener(
    ): void;
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSING: 2;
    readonly CLOSED: 3;
  }
  function inspect(arg: any, options?: BunInspectOptions): string;
  namespace inspect {
    const custom: typeof import("util").inspect.custom;
    function table(tabularData: object | unknown[], properties?: string[], options?: { colors?: boolean }): string;
    function table(tabularData: object | unknown[], options?: { colors?: boolean }): string;
  }
  interface MMapOptions {
    sync?: boolean;
    shared?: boolean;
    offset?: number | bigint;
    size?: number | bigint;
  }
  function mmap(path: string, opts?: MMapOptions): Uint8Array<ArrayBuffer>;
  const stdout: BunFile;
  const stderr: BunFile;
  const stdin: BunFile;
  type StringLike = string | { toString(): string };
  type ColorInput =
    | { r: number; g: number; b: number; a?: number }
    | [number, number, number]
    | [number, number, number, number]
    | Uint8Array<ArrayBuffer>
    | Uint8ClampedArray<ArrayBuffer>
    | Float32Array
    | Float64Array
    | string
    | number
    | { toString(): string };
  function color(
    input: ColorInput,
    outputFormat?:
  ): string | null;
  function color(input: ColorInput, outputFormat: "[rgb]"): [number, number, number] | null;
  function color(input: ColorInput, outputFormat: "[rgba]"): [number, number, number, number] | null;
  function color(input: ColorInput, outputFormat: "{rgb}"): { r: number; g: number; b: number } | null;
  function color(input: ColorInput, outputFormat: "{rgba}"): { r: number; g: number; b: number; a: number } | null;
  function color(input: ColorInput, outputFormat: "number"): number | null;
  interface ModuleGraphOptions {
    globals?: Record<string, unknown> | undefined;
    onError?: ((error: unknown, kind: "uncaughtException" | "unhandledRejection") => void) | undefined;
  }
  class ModuleGraph {
    constructor(options?: ModuleGraphOptions);
    static readonly current: ModuleGraph | undefined;
    import<T = any>(specifier: string): Promise<T>;
    run<A extends unknown[], R>(fn: (...args: A) => R, ...args: A): R;
    dispose(): void;
    [Symbol.dispose](): void;
  }
  namespace semver {
    function satisfies(version: StringLike, range: StringLike): boolean;
    function order(v1: StringLike, v2: StringLike): -1 | 0 | 1;
  }
  namespace unsafe {
    function arrayBufferToString(buffer: Uint8Array<ArrayBuffer> | ArrayBufferLike): string;
    function arrayBufferToString(buffer: Uint16Array): string;
    function gcAggressionLevel(level?: 0 | 1 | 2): 0 | 1 | 2;
    function mimallocDump(): void;
    function setJITPolicy(scale: number): void;
    function memoryFootprint(): number | undefined;
  }
  type DigestEncoding = "utf8" | "ucs2" | "utf16le" | "latin1" | "ascii" | "base64" | "base64url" | "hex";
  const enableANSIColors: boolean;
  const main: string;
  function gc(force?: boolean): void;
  interface HeapSnapshot {
    version: number;
    type: string;
    nodes: number[];
    nodeClassNames: string[];
    edges: number[];
    edgeTypes: string[];
    edgeNames: string[];
  }
  function nanoseconds(): number;
  function generateHeapSnapshot(format?: "jsc"): HeapSnapshot;
  function generateHeapSnapshot(format: "v8"): string;
  function generateHeapSnapshot(format: "v8", encoding: "arraybuffer"): ArrayBuffer;
  function shrink(): void;
  function openInEditor(path: string, options?: EditorOptions): void;
  var fetch: typeof globalThis.fetch;
  interface EditorOptions {
    editor?: "vscode" | "subl";
    line?: number;
    column?: number;
  }
  abstract class CryptoHashInterface<T> {
    readonly byteLength: number;
    update(data: Bun.BlobOrStringOrBuffer): T;
    digest(encoding: DigestEncoding): string;
    digest(hashInto?: NodeJS.TypedArray): NodeJS.TypedArray;
    static hash(input: Bun.BlobOrStringOrBuffer, hashInto?: NodeJS.TypedArray): NodeJS.TypedArray;
    static hash(input: Bun.BlobOrStringOrBuffer, encoding: DigestEncoding): string;
  }
  type SupportedCryptoAlgorithms = | "blake2b256" | "blake2b512" | "blake2s256" | "md4" | "md5" | ... (+14 literals);
  class CryptoHasher {
    readonly algorithm: SupportedCryptoAlgorithms;
    readonly byteLength: number;
    constructor(algorithm: SupportedCryptoAlgorithms, hmacKey?: string | NodeJS.TypedArray);
    update(input: Bun.BlobOrStringOrBuffer, inputEncoding?: import("crypto").Encoding): CryptoHasher;
    copy(): CryptoHasher;
    digest(encoding: DigestEncoding): string;
    digest(): Buffer;
    digest(hashInto: NodeJS.TypedArray): NodeJS.TypedArray;
    static hash(algorithm: SupportedCryptoAlgorithms, input: Bun.BlobOrStringOrBuffer): Buffer;
    static hash(
    ): NodeJS.TypedArray;
    static hash(
    ): string;
    static readonly algorithms: SupportedCryptoAlgorithms[];
  }
  function sleep(ms: number | Date): Promise<void>;
  function sleepSync(ms: number): void;
  function sha(input: Bun.StringOrBuffer, hashInto?: NodeJS.TypedArray): NodeJS.TypedArray;
  function sha(input: Bun.StringOrBuffer, encoding: DigestEncoding): string;
  class SHA1 extends CryptoHashInterface<SHA1> {
    constructor();
    static readonly byteLength: 20;
  }
  class MD5 extends CryptoHashInterface<MD5> {
    constructor();
    static readonly byteLength: 16;
  }
  class MD4 extends CryptoHashInterface<MD4> {
    constructor();
    static readonly byteLength: 16;
  }
  class SHA224 extends CryptoHashInterface<SHA224> {
    constructor();
    static readonly byteLength: 28;
  }
  class SHA512 extends CryptoHashInterface<SHA512> {
    constructor();
    static readonly byteLength: 64;
  }
  class SHA384 extends CryptoHashInterface<SHA384> {
    constructor();
    static readonly byteLength: 48;
  }
  class SHA256 extends CryptoHashInterface<SHA256> {
    constructor();
    static readonly byteLength: 32;
  }
  class SHA512_256 extends CryptoHashInterface<SHA512_256> {
    constructor();
    static readonly byteLength: 32;
  }
  type CompressionFormat = "gzip" | "deflate" | "deflate-raw" | "brotli" | "zstd";
  interface ZlibCompressionOptions {
    level?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    memLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    windowBits?:
    strategy?: number;
    library?: "zlib";
  }
  interface LibdeflateCompressionOptions {
    level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    library?: "libdeflate";
  }
  function deflateSync(
    data: Uint8Array<ArrayBuffer> | string | ArrayBuffer,
    options?: ZlibCompressionOptions | LibdeflateCompressionOptions,
  ): Uint8Array<ArrayBuffer>;
  function gzipSync(
    data: Uint8Array<ArrayBuffer> | string | ArrayBuffer,
    options?: ZlibCompressionOptions | LibdeflateCompressionOptions,
  ): Uint8Array<ArrayBuffer>;
  function inflateSync(
    data: Uint8Array<ArrayBuffer> | string | ArrayBuffer,
    options?: ZlibCompressionOptions | LibdeflateCompressionOptions,
  ): Uint8Array<ArrayBuffer>;
  function gunzipSync(
    data: Uint8Array<ArrayBuffer> | string | ArrayBuffer,
    options?: ZlibCompressionOptions | LibdeflateCompressionOptions,
  ): Uint8Array<ArrayBuffer>;
  function zstdCompressSync(
    data: NodeJS.TypedArray | Buffer | string | ArrayBuffer,
    options?: { level?: number },
  ): Buffer;
  function zstdCompress(
    data: NodeJS.TypedArray | Buffer | string | ArrayBuffer,
    options?: { level?: number },
  ): Promise<Buffer>;
  function zstdDecompressSync(data: NodeJS.TypedArray | Buffer | string | ArrayBuffer): Buffer;
  function zstdDecompress(data: NodeJS.TypedArray | Buffer | string | ArrayBuffer): Promise<Buffer>;
  type Target =
    | "bun"
    | "node"
    | "browser";
  type Loader = | "js" | "jsx" | "ts" | "tsx" | "json" | ... (+12 literals);
  interface PluginConstraints {
    filter: RegExp;
    namespace?: string;
  }
  interface OnLoadResultSourceCode {
    contents: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer;
    loader?: Loader;
  }
  interface OnLoadResultObject {
    exports: Record<string, unknown>;
    loader: "object";
  }
  interface OnLoadArgs {
    path: string;
    namespace: string;
    loader: Loader;
    defer: () => Promise<void>;
  }
  type OnLoadResult = OnLoadResultSourceCode | OnLoadResultObject | undefined | null | void;
  type OnLoadCallback = (args: OnLoadArgs) => OnLoadResult | Promise<OnLoadResult>;
  type OnStartCallback = () => void | Promise<void>;
  type OnEndCallback = (result: BuildOutput) => void | Promise<void>;
  type OnBeforeParseCallback = {
    napiModule: unknown;
    symbol: string;
    external?: unknown | undefined;
  };
  interface OnResolveArgs {
    path: string;
    importer: string;
    namespace: string;
    resolveDir: string;
    kind: ImportKind;
  }
  interface OnResolveResult {
    path: string;
    namespace?: string;
    external?: boolean;
  }
  type OnResolveCallback = (
    args: OnResolveArgs,
  ) => OnResolveResult | Promise<OnResolveResult | undefined | null> | undefined | null;
  type FFIFunctionCallable = Function & {
    readonly __ffi_function_callable: typeof import("bun:ffi").FFIFunctionCallableSymbol;
  };
  interface PluginBuilder {
    onStart(callback: OnStartCallback): this;
    onEnd(callback: OnEndCallback): this;
    onBeforeParse(constraints: PluginConstraints, callback: OnBeforeParseCallback): this;
    onLoad(constraints: PluginConstraints, callback: OnLoadCallback): this;
    onResolve(constraints: PluginConstraints, callback: OnResolveCallback): this;
    config: BuildConfig & { plugins: BunPlugin[] };
    module(specifier: string, callback: () => OnLoadResult | Promise<OnLoadResult>): this;
  }
  interface BunPlugin {
    name: string;
    target?: Target;
    setup(
    ): void | Promise<void>;
  }
  interface BunRegisterPlugin {
    <T extends BunPlugin>(options: T): ReturnType<T["setup"]>;
    clearAll(): void;
  }
  const plugin: BunRegisterPlugin;
  const isMainThread: boolean;
  interface HTMLBundle {
    index: string;
    files?: Array<{
    }>;
  }
  interface Socket<Data = undefined> extends Disposable {
    write(data: string | BufferSource, byteOffset?: number, byteLength?: number): number;
    data: Data;
    end(data?: string | BufferSource, byteOffset?: number, byteLength?: number): number;
    end(): void;
    ref(): void;
    timeout(seconds: number): void;
    terminate(): void;
    shutdown(halfClose?: boolean): void;
    readonly readyState: -2 | -1 | 0 | 1 | 2;
    unref(): void;
    flush(): void;
    reload(options: Pick<SocketOptions<Data>, "socket">): void;
    readonly listener?: SocketListener;
    readonly remoteFamily: "IPv4" | "IPv6";
    readonly remoteAddress: string;
    readonly remotePort: number;
    readonly localFamily: "IPv4" | "IPv6";
    readonly localAddress: string;
    readonly localPort: number;
    readonly authorized: boolean;
    readonly alpnProtocol: string | false | null;
    disableRenegotiation(): void;
    exportKeyingMaterial(length: number, label: string, context: Buffer): Buffer;
    getAuthorizationError(): Error | null;
    getCertificate(): import("tls").PeerCertificate | object | null;
    getX509Certificate(): import("node:crypto").X509Certificate | undefined;
    getCipher(): import("tls").CipherNameAndProtocol;
    getEphemeralKeyInfo(): import("tls").EphemeralKeyInfo | object | null;
    getPeerCertificate(): import("node:tls").PeerCertificate;
    getPeerX509Certificate(): import("node:crypto").X509Certificate;
    getSharedSigalgs(): string[];
    getTLSFinishedMessage(): Buffer | undefined;
    getTLSPeerFinishedMessage(): Buffer | undefined;
    getTLSTicket(): Buffer | undefined;
    getTLSVersion(): string;
    isSessionReused(): boolean;
    setMaxSendFragment(size: number): boolean;
    setNoDelay(noDelay?: boolean): boolean;
    setKeepAlive(enable?: boolean, initialDelay?: number): boolean;
    readonly bytesWritten: number;
    [Symbol.dispose](): void;
    resume(): void;
    pause(): void;
    renegotiate(): void;
    setVerifyMode(requestCert: boolean, rejectUnauthorized: boolean): void;
    getSession(): void;
    setSession(session: string | Buffer | BufferSource): void;
    exportKeyingMaterial(length: number, label: string, context?: string | BufferSource): void;
    upgradeTLS<Data>(options: TLSUpgradeOptions<Data>): [raw: Socket<Data>, tls: Socket<Data>];
    close(): void;
    getServername(): string;
    setServername(name: string): void;
  }
  interface TLSUpgradeOptions<Data> {
    data?: Data;
    tls: TLSOptions | boolean;
    socket: SocketHandler<Data>;
  }
  interface SocketListener<Data = undefined> extends Disposable {
    stop(closeActiveConnections?: boolean): void;
    ref(): void;
    unref(): void;
    reload(options: Pick<SocketOptions<Data>, "socket">): void;
    data: Data;
  }
  interface TCPSocketListener<Data = unknown> extends SocketListener<Data> {
    readonly port: number;
    readonly hostname: string;
  }
  interface UnixSocketListener<Data> extends SocketListener<Data> {
    readonly unix: string;
  }
  interface TCPSocket extends Socket {}
  interface TLSSocket extends Socket {}
  interface BinaryTypeList {
    arraybuffer: ArrayBuffer;
    buffer: Buffer;
    uint8array: Uint8Array<ArrayBuffer>;
  }
  type BinaryType = keyof BinaryTypeList;
  interface SocketHandler<Data = unknown, DataBinaryType extends BinaryType = "buffer"> {
    open?(socket: Socket<Data>): void | Promise<void>;
    close?(socket: Socket<Data>, error?: Error): void | Promise<void>;
    error?(socket: Socket<Data>, error: Error): void | Promise<void>;
    data?(socket: Socket<Data>, data: BinaryTypeList[DataBinaryType]): void | Promise<void>;
    drain?(socket: Socket<Data>): void | Promise<void>;
    handshake?(socket: Socket<Data>, success: boolean, authorizationError: Error | null): void;
    end?(socket: Socket<Data>): void | Promise<void>;
    connectError?(socket: Socket<Data>, error: Error): void | Promise<void>;
    timeout?(socket: Socket<Data>): void | Promise<void>;
    binaryType?: BinaryType;
  }
  interface SocketOptions<Data = unknown> {
    socket: SocketHandler<Data>;
    data?: Data;
    allowHalfOpen?: boolean;
  }
  interface TCPSocketListenOptions<Data = undefined> extends SocketOptions<Data> {
    hostname: string;
    port: number;
    tls?: TLSOptions | boolean;
    exclusive?: boolean;
    allowHalfOpen?: boolean;
  }
  interface TCPSocketConnectOptions<Data = undefined> extends SocketOptions<Data> {
    hostname: string;
    port: number;
    tls?: TLSOptions | boolean;
    exclusive?: boolean;
    reusePort?: boolean;
    ipv6Only?: boolean;
  }
  interface UnixSocketOptions<Data = undefined> extends SocketOptions<Data> {
    unix: string;
    tls?: TLSOptions | boolean;
  }
  interface FdSocketOptions<Data = undefined> extends SocketOptions<Data> {
    tls?: TLSOptions | boolean;
    fd: number;
  }
  function connect<Data = undefined>(options: TCPSocketConnectOptions<Data>): Promise<Socket<Data>>;
  function connect<Data = undefined>(options: UnixSocketOptions<Data>): Promise<Socket<Data>>;
  function listen<Data = undefined>(options: TCPSocketListenOptions<Data>): TCPSocketListener<Data>;
  function listen<Data = undefined>(options: UnixSocketOptions<Data>): UnixSocketListener<Data>;
  namespace udp {
    type Data = string | ArrayBufferView | ArrayBufferLike;
    export interface ReceiveFlags {
    }
    export interface SocketHandler<DataBinaryType extends BinaryType> {
    }
    export interface ConnectedSocketHandler<DataBinaryType extends BinaryType> {
    }
    export interface SocketOptions<DataBinaryType extends BinaryType> {
    }
    export interface ConnectSocketOptions<DataBinaryType extends BinaryType> {
    }
    export interface BaseUDPSocket {
    }
    export interface ConnectedSocket<DataBinaryType extends BinaryType> extends BaseUDPSocket {
    }
    export interface Socket<DataBinaryType extends BinaryType> extends BaseUDPSocket {
    }
  }
  export function udpSocket<DataBinaryType extends BinaryType = "buffer">(
    options: udp.SocketOptions<DataBinaryType>,
  ): Promise<udp.Socket<DataBinaryType>>;
  export function udpSocket<DataBinaryType extends BinaryType = "buffer">(
    options: udp.ConnectSocketOptions<DataBinaryType>,
  ): Promise<udp.ConnectedSocket<DataBinaryType>>;
  export import SpawnOptions = Spawn;
  namespace Spawn {
    type Readable =
    type Writable =
    type OptionsObject<In extends Writable, Out extends Readable, Err extends Readable> = BaseOptions<In, Out, Err>;
    interface BaseOptions<In extends Writable, Out extends Readable, Err extends Readable> {
    }
    interface SpawnSyncOptions<In extends Writable, Out extends Readable, Err extends Readable> extends BaseOptions<
    > {}
    interface SpawnOptions<In extends Writable, Out extends Readable, Err extends Readable> extends BaseOptions<
    > {
    }
    type ReadableToIO<X extends Readable> = X extends "pipe" | undefined
    type ReadableToSyncIO<X extends Readable> = X extends "pipe" | undefined ? Buffer : undefined;
    type WritableIO = FileSink | number | undefined;
    type WritableToIO<X extends Writable> = X extends "pipe"
  }
  interface ResourceUsage {
    contextSwitches: {
    };
    cpuTime: {
    };
    maxRSS: number;
    messages: {
    };
    ops: {
    };
    shmSize: number;
    signalCount: number;
    swapCount: number;
  }
  interface Subprocess<
    In extends SpawnOptions.Writable = SpawnOptions.Writable,
    Out extends SpawnOptions.Readable = SpawnOptions.Readable,
    Err extends SpawnOptions.Readable = SpawnOptions.Readable,
  > extends AsyncDisposable {
    readonly stdin: SpawnOptions.WritableToIO<In>;
    readonly stdout: SpawnOptions.ReadableToIO<Out>;
    readonly stderr: SpawnOptions.ReadableToIO<Err>;
    readonly terminal: Terminal | undefined;
    readonly stdio: [null, null, null, ...(number | null)[]];
    readonly readable: SpawnOptions.ReadableToIO<Out>;
    readonly pid: number;
    readonly exited: Promise<number>;
    readonly exitCode: number | null;
    readonly signalCode: NodeJS.Signals | number | null;
    readonly killed: boolean;
    kill(exitCode?: number | NodeJS.Signals): void;
    ref(): void;
    unref(): void;
    send(message: any): void;
    disconnect(): void;
    resourceUsage(): ResourceUsage | undefined;
  }
  interface SyncSubprocess<
    Out extends SpawnOptions.Readable = SpawnOptions.Readable,
    Err extends SpawnOptions.Readable = SpawnOptions.Readable,
  > {
    stdout: SpawnOptions.ReadableToSyncIO<Out>;
    stderr: SpawnOptions.ReadableToSyncIO<Err>;
    exitCode: number;
    success: boolean;
    resourceUsage: ResourceUsage;
    signalCode?: NodeJS.Signals | number;
    exitedDueToTimeout?: boolean;
    exitedDueToMaxBuffer?: boolean;
    pid: number;
  }
  function spawn<
    const In extends SpawnOptions.Writable = "ignore",
    const Out extends SpawnOptions.Readable = "pipe",
    const Err extends SpawnOptions.Readable = "inherit",
  >(
    options: SpawnOptions.SpawnOptions<In, Out, Err> & {
    },
  ): Subprocess<In, Out, Err>;
  function spawn<
    const In extends SpawnOptions.Writable = "ignore",
    const Out extends SpawnOptions.Readable = "pipe",
    const Err extends SpawnOptions.Readable = "inherit",
  >(
    cmds: string[],
    options?: SpawnOptions.SpawnOptions<In, Out, Err>,
  ): Subprocess<In, Out, Err>;
  function spawnSync<
    const In extends SpawnOptions.Writable = "ignore",
    const Out extends SpawnOptions.Readable = "pipe",
    const Err extends SpawnOptions.Readable = "pipe",
  >(
    options: SpawnOptions.SpawnSyncOptions<In, Out, Err> & {
    },
  ): SyncSubprocess<Out, Err>;
  function spawnSync<
    const In extends SpawnOptions.Writable = "ignore",
    const Out extends SpawnOptions.Readable = "pipe",
    const Err extends SpawnOptions.Readable = "pipe",
  >(
    cmds: string[],
    options?: SpawnOptions.SpawnSyncOptions<In, Out, Err>,
  ): SyncSubprocess<Out, Err>;
  interface CronController {
    readonly type: "scheduled";
    readonly cron: string;
    readonly scheduledTime: number;
  }
  type CronWithAutocomplete = | "@yearly" | "@annually" | "@monthly" | "@weekly" | "@daily" | ... (+9 literals);
    | (string & {});
  interface CronJob extends Disposable {
    readonly cron: string;
    stop(): CronJob;
    ref(): CronJob;
    unref(): CronJob;
  }
  interface CronOptions {
    tz?: string;
  }
  const cron: {
    (schedule: CronWithAutocomplete, handler: (this: CronJob) => unknown, options?: CronOptions): CronJob;
    (path: string, schedule: CronWithAutocomplete, title: string): Promise<void>;
    remove(title: string): Promise<void>;
    parse(expression: CronWithAutocomplete, relativeDate?: Date | number, options?: CronOptions): Date | null;
  };
  type ReadableSubprocess = Subprocess<any, "pipe", "pipe">;
  type WritableSubprocess = Subprocess<"pipe", any, any>;
  type PipedSubprocess = Subprocess<"pipe", "pipe", "pipe">;
  type NullSubprocess = Subprocess<
    "ignore" | "inherit" | null | undefined,
    "ignore" | "inherit" | null | undefined,
    "ignore" | "inherit" | null | undefined
  >;
  type ReadableSyncSubprocess = SyncSubprocess<"pipe", "pipe">;
  type NullSyncSubprocess = SyncSubprocess<
    "ignore" | "inherit" | null | undefined,
    "ignore" | "inherit" | null | undefined
  >;
  interface TerminalOptions {
    cols?: number;
    rows?: number;
    name?: string;
    data?: (terminal: Terminal, data: Uint8Array<ArrayBuffer>) => void;
    exit?: (terminal: Terminal, exitCode: number, signal: string | null) => void;
    drain?: (terminal: Terminal) => void;
  }
  class Terminal implements AsyncDisposable {
    constructor(options: TerminalOptions);
    readonly closed: boolean;
    write(data: string | BufferSource): number;
    resize(cols: number, rows: number): void;
    setRawMode(enabled: boolean): void;
    ref(): void;
    unref(): void;
    close(): void;
    [Symbol.asyncDispose](): Promise<void>;
    inputFlags: number;
    outputFlags: number;
    localFlags: number;
    controlFlags: number;
  }
  type FetchProxyOption =
    | string
    | URL
    | false
    | {
  interface FetchSessionInit {
    tls?: BunFetchRequestInitTLS | undefined;
    proxy?: FetchProxyOption | undefined;
    keepAlive?:
    unix?: string | undefined;
  }
  class FetchSession {
    constructor(init?: FetchSessionInit);
    readonly fetch: (input: string | URL | Request, init?: BunFetchRequestInit) => Promise<Response>;
    close(): void;
    [Symbol.dispose](): void;
  }
  interface FileSystemRouterOptions {
    dir: string;
    style: "nextjs";
    assetPrefix?: string;
    origin?: string;
    fileExtensions?: string[];
  }
  class FileSystemRouter {
    constructor(options: FileSystemRouterOptions);
    match(input: string | Request | Response): MatchedRoute | null;
    readonly assetPrefix: string | null;
    readonly origin: string | null;
    readonly style: "nextjs";
    readonly routes: Record<string, string>;
    reload(): this;
  }
  interface MatchedRoute {
    readonly params: Record<string, string>;
    readonly filePath: string;
    readonly pathname: string;
    readonly query: Record<string, string>;
    readonly name: string;
    readonly kind: "exact" | "catch-all" | "optional-catch-all" | "dynamic";
    readonly src: string;
    readonly scriptSrc: string;
  }
  const version: string;
  const version_with_sha: string;
  const revision: string;
  function indexOfLine(buffer: ArrayBufferView | ArrayBufferLike, offset?: number | bigint): number;
  interface GlobScanOptions {
    cwd?: string;
    dot?: boolean;
    absolute?: boolean;
    followSymlinks?: boolean;
    throwErrorOnBrokenSymlink?: boolean;
    onlyFiles?: boolean;
  }
  export class Glob {
    constructor(pattern: string);
    scan(optionsOrCwd?: string | GlobScanOptions): AsyncIterableIterator<string>;
    scanSync(optionsOrCwd?: string | GlobScanOptions): IterableIterator<string>;
    match(str: string): boolean;
  }
  namespace Image {
    type ErrorCode =
    type Format = "jpeg" | "png" | "webp" | "heic" | "avif" | "bmp" | "tiff" | "gif";
    type Filter =
    interface ConstructorOptions {
    }
    interface ResizeOptions {
    }
    interface ModulateOptions {
    }
    interface Metadata {
    }
  }
  export class Image {
    static backend: "system" | "bun";
    static fromClipboard(): Image | null;
    static hasClipboardImage(): boolean;
    static clipboardChangeCount(): number;
    constructor(input: string | ArrayBuffer | NodeJS.TypedArray | Blob, options?: Image.ConstructorOptions);
    resize(width: number, height?: number, options?: Image.ResizeOptions): this;
    rotate(degrees: number): this;
    flip(): this;
    flop(): this;
    modulate(options: Image.ModulateOptions): this;
    jpeg(options?: {
    }): this;
    png(options?: {
    }): this;
    webp(options?: { quality?: number; lossless?: boolean }): this;
    heic(options?: { quality?: number }): this;
    avif(options?: { quality?: number }): this;
    bytes(): Promise<Uint8Array>;
    buffer(): Promise<Buffer>;
    toBuffer(): Promise<Buffer>;
    write(dest: BunFile | S3File | Bun.PathLike | number): Promise<number>;
    dataurl(): Promise<string>;
    placeholder(as?: "dataurl"): Promise<string>;
    raw(options?: { channels?: 1 | 3 | 4 }): Promise<Uint8Array>;
    blob(): Promise<Blob>;
    toBase64(): Promise<string>;
    metadata(): Promise<Image.Metadata>;
    readonly width: number;
    readonly height: number;
  }
  namespace WebView {
    type Modifier = "Shift" | "Control" | "Alt" | "Meta";
    type VirtualKey = | "Enter" | "Tab" | "Space" | "Backspace" | "Delete" | ... (+9 literals);
    interface ClickOptions {
    }
    interface ClickSelectorOptions extends ClickOptions {
    }
    interface ScrollToOptions {
    }
    interface PressOptions {
    }
    type Backend =
    type ConsoleCapture = typeof console | ((type: string, ...args: unknown[]) => void);
    interface ConstructorOptions {
    }
  }
  class WebView extends EventTarget {
    constructor(options?: WebView.ConstructorOptions);
    static closeAll(): void;
    readonly url: string;
    readonly title: string;
    readonly loading: boolean;
    onNavigated: ((url: string, title: string) => void) | null;
    onNavigationFailed: ((error: Error) => void) | null;
    navigate(url: string): Promise<void>;
    evaluate<T = unknown>(script: string): Promise<T>;
    screenshot(options?: { encoding?: "blob"; format?: "png" | "jpeg" | "webp"; quality?: number }): Promise<Blob>;
    screenshot(options: { encoding: "buffer"; format?: "png" | "jpeg" | "webp"; quality?: number }): Promise<Buffer>;
    screenshot(options: { encoding: "base64"; format?: "png" | "jpeg" | "webp"; quality?: number }): Promise<string>;
    screenshot(options: { encoding: "shmem"; format?: "png" | "jpeg" | "webp"; quality?: number }): Promise<{
    }>;
    cdp<T = unknown>(method: string, params?: Record<string, unknown>): Promise<T>;
    addEventListener<T = unknown>(
    ): void;
    addEventListener(
    ): void;
    click(x: number, y: number, options?: WebView.ClickOptions): Promise<void>;
    click(selector: string, options?: WebView.ClickSelectorOptions): Promise<void>;
    type(text: string): Promise<void>;
    press(key: WebView.VirtualKey | (string & {}), options?: WebView.PressOptions): Promise<void>;
    scroll(dx: number, dy: number): Promise<void>;
    scrollTo(selector: string, options?: WebView.ScrollToOptions): Promise<void>;
    resize(width: number, height: number): Promise<void>;
    goBack(): Promise<void>;
    goForward(): Promise<void>;
    reload(): Promise<void>;
    close(): void;
    [Symbol.dispose](): void;
    [Symbol.asyncDispose](): void;
  }
  type ArchiveInput = Record<string, BlobPart> | Blob | ArrayBufferView | ArrayBufferLike;
  type ArchiveCompression = "gzip";
  interface ArchiveOptions {
    compress?: ArchiveCompression;
    level?: number;
  }
  interface ArchiveExtractOptions {
    glob?: string | readonly string[];
  }
  export class Archive {
    constructor(data: ArchiveInput, options?: ArchiveOptions);
    static write(path: string, data: ArchiveInput | Archive, options?: ArchiveOptions): Promise<void>;
    extract(path: string, options?: ArchiveExtractOptions): Promise<number>;
    blob(): Promise<Blob>;
    bytes(): Promise<Uint8Array<ArrayBuffer>>;
    files(glob?: string | readonly string[]): Promise<Map<string, File>>;
  }
  function randomUUIDv7(
    encoding?: "hex" | "base64" | "base64url",
    timestamp?: number | Date,
  ): string;
  function randomUUIDv7(
    encoding: "buffer",
    timestamp?: number | Date,
  ): Buffer;
  function randomUUIDv5(
    name: string | BufferSource,
    namespace: string | BufferSource | "dns" | "url" | "oid" | "x500",
    encoding?: "hex" | "base64" | "base64url",
  ): string;
  function randomUUIDv5(
    name: string | BufferSource,
    namespace: string | BufferSource | "dns" | "url" | "oid" | "x500",
    encoding: "buffer",
  ): Buffer;
  type BunLockFile = {
    lockfileVersion: 0 | 1 | 2;
    workspaces: {
    };
    overrides?: Record<string, string>;
    patchedDependencies?: Record<string, string>;
    trustedDependencies?: string[];
    catalog?: Record<string, string>;
    catalogs?: Record<string, Record<string, string>>;
    configVersion?: 0 | 1;
    packages: {
    };
  };
  type BunLockFileBasePackageInfo = {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalPeers?: string[];
    unresolved?: string[];
    bin?: string | Record<string, string>;
    binDir?: string;
  };
  type BunLockFileWorkspacePackage = BunLockFileBasePackageInfo & {
    name?: string;
    version?: string;
  };
  type BunLockFilePackageInfo = BunLockFileBasePackageInfo & {
    os?: string | string[];
    cpu?: string | string[];
    hasInstallScript?: true;
    bundled?: true;
  };
  type BunLockFilePackageArray =
    | [pkg: string, registry: string, info: BunLockFilePackageInfo, integrity: string]
    | [pkg: string, info: BunLockFilePackageInfo]
    | [pkg: string]
    | [pkg: string, info: BunLockFilePackageInfo, bunTag: string]
    | [pkg: string, info: Pick<BunLockFileBasePackageInfo, "bin" | "binDir">];
  interface CookieInit {
    name?: string;
    value?: string;
    domain?: string;
    path?: string;
    expires?: number | Date | string;
    secure?: boolean;
    sameSite?: CookieSameSite;
    httpOnly?: boolean;
    partitioned?: boolean;
    maxAge?: number;
  }
  interface CookieStoreDeleteOptions {
    name: string;
    domain?: string | null;
    path?: string;
  }
  interface CookieStoreGetOptions {
    name?: string;
    url?: string;
  }
  type CookieSameSite = "strict" | "lax" | "none";
  class Cookie {
    constructor(name: string, value: string, options?: CookieInit);
    constructor(cookieString: string);
    constructor(cookieObject?: CookieInit);
    readonly name: string;
    value: string;
    domain?: string;
    path: string;
    expires?: Date;
    secure: boolean;
    sameSite: CookieSameSite;
    partitioned: boolean;
    maxAge?: number;
    httpOnly: boolean;
    isExpired(): boolean;
    serialize(): string;
    toString(): string;
    toJSON(): CookieInit;
    static parse(cookieString: string): Cookie;
    static from(name: string, value: string, options?: CookieInit): Cookie;
  }
  class CookieMap implements Iterable<[string, string]> {
    constructor(init?: string[][] | Record<string, string> | string);
    get(name: string): string | null;
    toSetCookieHeaders(): string[];
    has(name: string): boolean;
    set(name: string, value: string, options?: CookieInit): void;
    set(options: CookieInit): void;
    delete(name: string): void;
    delete(options: CookieStoreDeleteOptions): void;
    delete(name: string, options: Omit<CookieStoreDeleteOptions, "name">): void;
    toJSON(): Record<string, string>;
    readonly size: number;
    entries(): IterableIterator<[string, string]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    forEach(callback: (value: string, key: string, map: CookieMap) => void): void;
    [Symbol.iterator](): IterableIterator<[string, string]>;
  }
}
```

## `bun.ns.d.ts` (6 lines -> 4 lines)

```ts
import * as BunModule from "bun";
declare global {
  export import Bun = BunModule;
}
```

## `bundle.d.ts` (75 lines -> 4 lines)

```ts
declare module "bun:bundle" {
  interface Registry {}
  function feature(flag: Registry extends { features: infer Features extends string } ? Features : string): boolean;
}
```

## `deprecated.d.ts` (175 lines -> 44 lines, 7 nested lines elided)

```ts
declare module "bun" {
  type Platform =
    "aix" | "android" | "darwin" | "freebsd" | "haiku" | "linux" | "openbsd" | "sunos" | "win32" | "cygwin" | "netbsd";
  type Architecture = "arm" | "arm64" | "ia32" | "mips" | "mipsel" | "ppc" | "ppc64" | "s390" | "s390x" | "x64";
  type UncaughtExceptionListener = (error: Error, origin: UncaughtExceptionOrigin) => void;
  type UnhandledRejectionListener = (reason: unknown, promise: Promise<unknown>) => void;
  type MultipleResolveListener = (type: MultipleResolveType, promise: Promise<unknown>, value: unknown) => void;
  function readableStreamToBytes(
    stream: ReadableStream<ArrayBufferView | ArrayBufferLike>,
  ): Promise<Uint8Array<ArrayBuffer>> | Uint8Array<ArrayBuffer>;
  function readableStreamToBlob(stream: ReadableStream): Promise<Blob>;
  function readableStreamToText(stream: ReadableStream): Promise<string>;
  function readableStreamToJSON(stream: ReadableStream): Promise<any>;
  interface BunMessageEvent<T> {
    initMessageEvent(
    ): void;
  }
  type ServeOptions<T = undefined, R extends string = never> = Serve.Options<T, R>;
  type SQLQuery<T = any> = SQL.Query<T>;
  type SQLTransactionContextCallback<T> = SQL.TransactionContextCallback<T>;
  type SQLSavepointContextCallback<T> = SQL.SavepointContextCallback<T>;
  type SQLOptions = SQL.Options;
  type Errorlike = ErrorLike;
  type ShellFunction = (input: Uint8Array<ArrayBuffer>) => Uint8Array<ArrayBuffer>;
  interface TLSOptions {
    keyFile?: string;
    certFile?: string;
    caFile?: string;
  }
  type ReadableIO = ReadableStream<Uint8Array<ArrayBuffer>> | number | undefined;
}
declare namespace NodeJS {
  interface Process {
    assert(value: unknown, message?: string | Error): asserts value;
  }
}
interface CustomEvent<T = any> {
  initCustomEvent(type: string, bubbles?: boolean, cancelable?: boolean, detail?: T): void;
}
interface DOMException {
  readonly code: number;
}
declare var BuildError: typeof BuildMessage;
declare var ResolveError: typeof ResolveMessage;
```

## `devserver.d.ts` (189 lines -> 26 lines)

```ts
declare module "bun" {
  type HMREventNames =
    | "beforeUpdate"
    | "afterUpdate"
    | "beforeFullReload"
    | "beforePrune"
    | "invalidate"
    | "error"
    | "ws:disconnect"
    | "ws:connect";
  type HMREvent = `bun:${HMREventNames}` | (string & {});
}
interface ImportMeta {
  hot: {
    data: any;
    accept(): void;
    accept(cb: (newModule: any | undefined) => void): void;
    accept(specifier: string, callback: (newModule: any) => void): void;
    accept(specifiers: string[], callback: (newModules: (any | undefined)[]) => void): void;
    dispose(cb: (data: any) => void | Promise<void>): void;
    decline(): void;
    ////////////////////////////////////////////////////////////////
    on(event: Bun.HMREvent, callback: () => void): void;
    off(event: Bun.HMREvent, callback: () => void): void;
  };
}
```

## `extensions.d.ts` (46 lines -> 36 lines)

```ts
declare module "*.txt" {
  var text: string;
  export = text;
}
declare module "*.toml" {
  var contents: any;
  export = contents;
}
declare module "*.yaml" {
  var contents: any;
  export = contents;
}
declare module "*.yml" {
  var contents: any;
  export = contents;
}
declare module "*.jsonc" {
  var contents: any;
  export = contents;
}
declare module "*.json5" {
  var contents: any;
  export = contents;
}
declare module "*.xml" {
  var contents: import("bun").XML.Document;
  export = contents;
}
declare module "*/bun.lock" {
  var contents: import("bun").BunLockFile;
  export = contents;
}
declare module "*.html" {
  var contents: import("bun").HTMLBundle;
  export = contents;
}
```

## `fetch.d.ts` (132 lines -> 10 lines, 55 nested lines elided)

```ts
declare module "bun" {
  type HeadersInit = string[][] | Record<string, string | ReadonlyArray<string>> | Headers;
  type BodyInit =
    | ReadableStream
    | Bun.XMLHttpRequestBodyInit
    | AsyncIterable<string | ArrayBuffer | ArrayBufferView>
    | AsyncGenerator<string | ArrayBuffer | ArrayBufferView>
    | (() => AsyncGenerator<string | ArrayBuffer | ArrayBufferView>)
    | import("bun").Image;
}
```

## `ffi.d.ts` (1118 lines -> 190 lines, 11 nested lines elided)

```ts
declare module "bun:ffi" {
  enum FFIType {
    char = 0,
    int8_t = 1,
    i8 = 1,
    uint8_t = 2,
    u8 = 2,
    int16_t = 3,
    i16 = 3,
    uint16_t = 4,
    u16 = 4,
    int32_t = 5,
    i32 = 5,
    int = 5,
    uint32_t = 6,
    u32 = 6,
    int64_t = 7,
    i64 = 7,
    uint64_t = 8,
    u64 = 8,
    double = 9,
    f64 = 9,
    float = 10,
    f32 = 10,
    bool = 11,
    ptr = 12,
    pointer = 12,
    void = 13,
    cstring = 14,
    i64_fast = 15,
    u64_fast = 16,
    function = 17,
    napi_env = 18,
    napi_value = 19,
    buffer = 20,
    buffer_length = 21,
  }
  type Pointer = number & { __pointer__: null };
  interface FFITypeToArgsType {
    [FFIType.char]: number;
    [FFIType.int8_t]: number;
    [FFIType.uint8_t]: number;
    [FFIType.int16_t]: number;
    [FFIType.uint16_t]: number;
    [FFIType.int32_t]: number;
    [FFIType.uint32_t]: number;
    [FFIType.int64_t]: number | bigint;
    [FFIType.uint64_t]: number | bigint;
    [FFIType.double]: number;
    [FFIType.float]: number;
    [FFIType.bool]: boolean;
    [FFIType.ptr]: NodeJS.TypedArray | Pointer | bigint | null;
    [FFIType.void]: undefined;
    [FFIType.cstring]: string | NodeJS.TypedArray | Pointer | bigint | null;
    [FFIType.i64_fast]: number | bigint;
    [FFIType.u64_fast]: number | bigint;
    [FFIType.function]: Pointer | JSCallback; // cannot be null
    [FFIType.napi_env]: unknown;
    [FFIType.napi_value]: unknown;
    [FFIType.buffer]: NodeJS.TypedArray | DataView;
    [FFIType.buffer_length]: NodeJS.TypedArray | DataView;
  }
  interface FFITypeToReturnsType {
    [FFIType.char]: number;
    [FFIType.int8_t]: number;
    [FFIType.uint8_t]: number;
    [FFIType.int16_t]: number;
    [FFIType.uint16_t]: number;
    [FFIType.int32_t]: number;
    [FFIType.uint32_t]: number;
    [FFIType.int64_t]: bigint;
    [FFIType.uint64_t]: bigint;
    [FFIType.double]: number;
    [FFIType.float]: number;
    [FFIType.bool]: boolean;
    [FFIType.ptr]: Pointer | bigint | null;
    [FFIType.void]: undefined;
    [FFIType.cstring]: string | null;
    [FFIType.i64_fast]: number | bigint;
    [FFIType.u64_fast]: number | bigint;
    [FFIType.function]: Pointer | bigint | null;
    [FFIType.napi_env]: unknown;
    [FFIType.napi_value]: unknown;
    [FFIType.buffer]: NodeJS.TypedArray | DataView;
    [FFIType.buffer_length]: NodeJS.TypedArray | DataView;
  }
  interface FFITypeStringToType {
    ["char"]: FFIType.char;
    ["int8_t"]: FFIType.int8_t;
    ["i8"]: FFIType.i8;
    ["uint8_t"]: FFIType.uint8_t;
    ["u8"]: FFIType.u8;
    ["int16_t"]: FFIType.int16_t;
    ["i16"]: FFIType.i16;
    ["uint16_t"]: FFIType.uint16_t;
    ["u16"]: FFIType.u16;
    ["int32_t"]: FFIType.int32_t;
    ["i32"]: FFIType.i32;
    ["int"]: FFIType.int;
    ["uint32_t"]: FFIType.uint32_t;
    ["u32"]: FFIType.u32;
    ["int64_t"]: FFIType.int64_t;
    ["i64"]: FFIType.i64;
    ["uint64_t"]: FFIType.uint64_t;
    ["u64"]: FFIType.u64;
    ["double"]: FFIType.double;
    ["f64"]: FFIType.f64;
    ["float"]: FFIType.float;
    ["f32"]: FFIType.f32;
    ["bool"]: FFIType.bool;
    ["ptr"]: FFIType.ptr;
    ["pointer"]: FFIType.pointer;
    ["void"]: FFIType.void;
    ["cstring"]: FFIType.cstring;
    ["function"]: FFIType.pointer; // for now
    ["usize"]: FFIType.uint64_t; // for now
    ["callback"]: FFIType.pointer; // for now
    ["napi_env"]: FFIType.napi_env;
    ["napi_value"]: FFIType.napi_value;
    ["buffer"]: FFIType.buffer;
    ["buffer_length"]: FFIType.buffer_length;
    ["buffer_bytelength"]: FFIType.buffer_length;
  }
  type FFITypeOrString = FFIType | keyof FFITypeStringToType;
  interface FFIFunction {
    readonly args?: readonly FFITypeOrString[];
    readonly returns?: FFITypeOrString;
    readonly ptr?: Pointer | bigint;
    readonly threadsafe?: boolean;
  }
  type Symbols = Readonly<Record<string, FFIFunction>>;
  interface Library<Fns extends Symbols> {
    symbols: ConvertFns<Fns>;
    close(): void;
  }
  type ToFFIType<T extends FFITypeOrString> = T extends FFIType ? T : T extends string ? FFITypeStringToType[T] : never;
  const FFIFunctionCallableSymbol: unique symbol;
  type ConvertFns<Fns extends Symbols> = {
    [K in keyof Fns]: {
    };
  };
  function dlopen<Fns extends Record<string, FFIFunction>>(
    name: string | import("bun").BunFile | URL,
    symbols: Fns,
  ): Library<Fns>;
  function cc<Fns extends Record<string, FFIFunction>>(options: {
    source: string | import("bun").BunFile | URL;
    library?: string[] | string;
    include?: string[] | string;
    symbols: Fns;
    define?: Record<string, string>;
    flags?: string | string[];
  }): Library<Fns>;
  function CFunction(fn: FFIFunction & { ptr: Pointer | number | bigint }): CallableFunction & {
    close(): void;
  };
  function linkSymbols<Fns extends Record<string, FFIFunction>>(symbols: Fns): Library<Fns>;
  function toBuffer(ptr: Pointer | number | bigint, byteOffset?: number, byteLength?: number): Buffer;
  function toArrayBuffer(ptr: Pointer | number | bigint, byteOffset?: number, byteLength?: number): ArrayBuffer;
  namespace read {
    function u8(ptr: Pointer | number | bigint, byteOffset?: number): number;
    function i8(ptr: Pointer | number | bigint, byteOffset?: number): number;
    function u16(ptr: Pointer | number | bigint, byteOffset?: number): number;
    function i16(ptr: Pointer | number | bigint, byteOffset?: number): number;
    function u32(ptr: Pointer | number | bigint, byteOffset?: number): number;
    function i32(ptr: Pointer | number | bigint, byteOffset?: number): number;
    function f32(ptr: Pointer | number | bigint, byteOffset?: number): number;
    function u64(ptr: Pointer | number | bigint, byteOffset?: number): bigint;
    function i64(ptr: Pointer | number | bigint, byteOffset?: number): bigint;
    function f64(ptr: Pointer | number | bigint, byteOffset?: number): number;
    function ptr(ptr: Pointer | number | bigint, byteOffset?: number): number;
    function intptr(ptr: Pointer | number | bigint, byteOffset?: number): number;
  }
  function ptr(view: NodeJS.TypedArray | ArrayBufferLike | DataView, byteOffset?: number): Pointer;
  type CString = string;
  interface CStringConstructor {
    new (ptr: Pointer | number | bigint | null, byteOffset?: number, byteLength?: number): string;
    (ptr: Pointer | number | bigint | null, byteOffset?: number, byteLength?: number): string;
  }
  const CString: CStringConstructor;
  class JSCallback {
    constructor(callback: (...args: any[]) => any, definition: FFIFunction);
    readonly ptr: Pointer | null;
    readonly threadsafe: boolean;
    close(): void;
  }
  function viewSource(symbols: Symbols, is_callback?: false): string[];
  function viewSource(callback: FFIFunction, is_callback: true): string;
  const suffix: string;
}
```

## `globals.d.ts` (2324 lines -> 842 lines, 133 nested lines elided)

```ts
declare module "bun" {
}
interface ReadableStream<R = any> extends Bun.__internal.LibEmptyOrNodeReadableStream<R> {}
declare var ReadableStream: Bun.__internal.UseLibDomIfAvailable<
  "ReadableStream",
  {
    prototype: ReadableStream;
    new <R = any>(underlyingSource?: Bun.UnderlyingSource<R>, strategy?: QueuingStrategy<R>): ReadableStream<R>;
    new <R = any>(underlyingSource?: Bun.DirectUnderlyingSource<R>, strategy?: QueuingStrategy<R>): ReadableStream<R>;
    new <R extends Uint8Array = Uint8Array<ArrayBuffer>>(
    ): ReadableStream<R>;
  }
>;
interface WritableStream<W = any> extends Bun.__internal.LibEmptyOrNodeWritableStream<W> {}
declare var WritableStream: Bun.__internal.UseLibDomIfAvailable<
  "WritableStream",
  {
    prototype: WritableStream;
    new <W = any>(underlyingSink?: Bun.UnderlyingSink<W>, strategy?: QueuingStrategy<W>): WritableStream<W>;
  }
>;
interface CompressionStream extends Bun.__internal.LibEmptyOrNodeStreamWebCompressionStream {}
declare var CompressionStream: Bun.__internal.UseLibDomIfAvailable<
  "CompressionStream",
  {
    prototype: CompressionStream;
    new (format: Bun.CompressionFormat, strategy?: { highWaterMark?: number; level?: number }): CompressionStream;
  }
>;
interface DecompressionStream extends Bun.__internal.LibEmptyOrNodeStreamWebDecompressionStream {}
declare var DecompressionStream: Bun.__internal.UseLibDomIfAvailable<
  "DecompressionStream",
  {
    prototype: DecompressionStream;
    new (format: Bun.CompressionFormat, strategy?: { highWaterMark?: number }): DecompressionStream;
  }
>;
interface Worker extends Bun.__internal.LibWorkerOrBunWorker {}
declare var Worker: Bun.__internal.UseLibDomIfAvailable<
  "Worker",
  {
    prototype: Worker;
    new (scriptURL: string | URL, options?: Bun.WorkerOptions | undefined): Worker;
    data: any;
  }
>;
interface WebSocket extends Bun.__internal.LibEmptyOrBunWebSocket {}
declare var WebSocket: Bun.__internal.UseLibDomIfAvailable<
  "WebSocket",
  {
    prototype: WebSocket;
    new (url: string | URL, options?: Bun.WebSocketOptions): WebSocket;
    new (url: string | URL, protocols?: string | string[]): WebSocket;
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSING: 2;
    readonly CLOSED: 3;
  }
>;
interface Crypto {
  readonly subtle: SubtleCrypto;
  getRandomValues<T extends ArrayBufferView | null>(array: T): T;
  randomUUID(): `${string}-${string}-${string}-${string}-${string}`;
  timingSafeEqual: typeof import("node:crypto").timingSafeEqual;
}
declare var Crypto: {
  prototype: Crypto;
  new (): Crypto;
};
declare var crypto: Crypto;
interface TextEncoder extends Bun.__internal.LibEmptyOrNodeUtilTextEncoder {
  encodeInto(src: string, dest: Bun.BufferSource): import("node:util").TextEncoderEncodeIntoResult;
}
declare var TextEncoder: Bun.__internal.UseLibDomIfAvailable<
  "TextEncoder",
  {
    prototype: TextEncoder;
    new (encoding?: Bun.Encoding, options?: { fatal?: boolean; ignoreBOM?: boolean }): TextEncoder;
  }
>;
interface TextDecoder extends Bun.__internal.LibEmptyOrNodeUtilTextDecoder {}
declare var TextDecoder: Bun.__internal.UseLibDomIfAvailable<
  "TextDecoder",
  {
    prototype: TextDecoder;
    new (encoding?: Bun.Encoding, options?: { fatal?: boolean; ignoreBOM?: boolean }): TextDecoder;
  }
>;
interface Event extends Bun.__internal.LibEmptyOrBunEvent {}
declare var Event: {
  prototype: Event;
  readonly NONE: 0;
  readonly CAPTURING_PHASE: 1;
  readonly AT_TARGET: 2;
  readonly BUBBLING_PHASE: 3;
  new (type: string, eventInitDict?: Bun.EventInit): Event;
};
interface EventTarget extends Bun.__internal.LibEmptyOrBunEventTarget {}
declare var EventTarget: {
  prototype: EventTarget;
  new (): EventTarget;
};
interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}
declare var File: Bun.__internal.UseLibDomIfAvailable<
  "File",
  {
    prototype: File;
    new (
    ): File;
  }
>;
interface ShadowRealm {
  importValue(specifier: string, bindingName: string): Promise<any>;
  evaluate(sourceText: string): any;
}
declare var ShadowRealm: {
  prototype: ShadowRealm;
  new (): ShadowRealm;
};
declare function queueMicrotask(callback: (...args: any[]) => void): void;
declare function reportError(error: any): void;
interface Timer {
  ref(): Timer;
  unref(): Timer;
  hasRef(): boolean;
  refresh(): Timer;
  [Symbol.toPrimitive](): number;
}
declare function clearInterval(id?: number | Timer): void;
declare function clearTimeout(id?: number | Timer): void;
declare function clearImmediate(id?: number | Timer): void;
declare function setImmediate(handler: Bun.TimerHandler, ...arguments: any[]): Timer;
declare function setInterval(handler: Bun.TimerHandler, interval?: number, ...arguments: any[]): Timer;
declare function setTimeout(handler: Bun.TimerHandler, timeout?: number, ...arguments: any[]): Timer;
declare function addEventListener<K extends keyof EventMap>(
  type: K,
  listener: (this: object, ev: EventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void;
declare function addEventListener(
  type: string,
  listener: Bun.EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): void;
declare function removeEventListener<K extends keyof EventMap>(
  type: K,
  listener: (this: object, ev: EventMap[K]) => any,
  options?: boolean | Bun.EventListenerOptions,
): void;
declare function removeEventListener(
  type: string,
  listener: Bun.EventListenerOrEventListenerObject,
  options?: boolean | Bun.EventListenerOptions,
): void;
interface ErrorEvent extends Event {
  readonly colno: number;
  readonly error: any;
  readonly filename: string;
  readonly lineno: number;
  readonly message: string;
}
declare var ErrorEvent: {
  prototype: ErrorEvent;
  new (type: string, eventInitDict?: Bun.ErrorEventInit): ErrorEvent;
};
interface CloseEvent extends Event {
  readonly code: number;
  readonly reason: string;
  readonly wasClean: boolean;
}
declare var CloseEvent: {
  prototype: CloseEvent;
  new (type: string, eventInitDict?: Bun.CloseEventInit): CloseEvent;
};
interface MessageEvent<T = any> extends Bun.MessageEvent<T> {}
declare var MessageEvent: Bun.__internal.UseLibDomIfAvailable<
  "MessageEvent",
  {
    prototype: MessageEvent;
    new <T>(type: string, eventInitDict?: Bun.MessageEventInit<T>): MessageEvent<any>;
  }
>;
interface CustomEvent<T = any> extends Event {
  readonly detail: T;
}
declare var CustomEvent: {
  prototype: CustomEvent;
  new <T>(type: string, eventInitDict?: Bun.CustomEventInit<T>): CustomEvent<T>;
};
interface EventListener {
  (evt: Event): void;
}
interface EventListenerObject {
  handleEvent(object: Event): void;
}
interface FetchEvent extends Event {
  readonly request: Request;
  readonly url: string;
  waitUntil(promise: Promise<any>): void;
  respondWith(response: Response | Promise<Response>): void;
}
interface EventMap {
  fetch: FetchEvent;
  message: MessageEvent;
  messageerror: MessageEvent;
}
interface AddEventListenerOptions extends Bun.EventListenerOptions {
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
}
declare var Loader: {
  registry: Map<
    string,
    {
    }
  >;
  dependencyKeysIfEvaluated: (specifier: string) => string[];
  resolve: (specifier: string, referrer: string) => string;
};
interface QueuingStrategy<T = any> {
  highWaterMark?: number;
  size?: QueuingStrategySize<T>;
}
interface QueuingStrategyInit {
  highWaterMark: number;
}
interface ByteLengthQueuingStrategy extends QueuingStrategy<ArrayBufferView> {
  readonly highWaterMark: number;
  readonly size: QueuingStrategySize<ArrayBufferView>;
}
declare var ByteLengthQueuingStrategy: {
  prototype: ByteLengthQueuingStrategy;
  new (init: QueuingStrategyInit): ByteLengthQueuingStrategy;
};
interface ReadableStreamDefaultController<R = any> {
  readonly desiredSize: number | null;
  close(): void;
  enqueue(chunk?: R): void;
  error(e?: any): void;
}
interface ReadableStreamDirectController {
  close(error?: Error): void;
  write(data: Bun.BufferSource | ArrayBuffer | string): number | Promise<number>;
  end(): number | Promise<number>;
  flush(wait?: boolean): number | Promise<number>;
  start(): void;
}
declare var ReadableStreamDefaultController: {
  prototype: ReadableStreamDefaultController;
  new (): ReadableStreamDefaultController;
};
interface ReadableStreamDefaultReader<R = any> extends ReadableStreamGenericReader {
  read(): Promise<Bun.ReadableStreamDefaultReadResult<R>>;
  readMany(): Promise<Bun.ReadableStreamDefaultReadManyResult<R>> | Bun.ReadableStreamDefaultReadManyResult<R>;
  releaseLock(): void;
}
declare var ReadableStreamDefaultReader: {
  prototype: ReadableStreamDefaultReader;
  new <R = any>(stream: ReadableStream<R>): ReadableStreamDefaultReader<R>;
};
interface ReadableStreamGenericReader {
  readonly closed: Promise<void>;
  cancel(reason?: any): Promise<void>;
}
interface ReadableStreamDefaultReadDoneResult {
  done: true;
  value?: undefined;
}
interface ReadableStreamDefaultReadValueResult<T> {
  done: false;
  value: T;
}
interface ReadableWritablePair<R = any, W = any> {
  readable: ReadableStream<R>;
  writable: WritableStream<W>;
}
interface WritableStreamDefaultController {
  error(e?: any): void;
}
declare var WritableStreamDefaultController: {
  prototype: WritableStreamDefaultController;
  new (): WritableStreamDefaultController;
};
interface WritableStreamDefaultWriter<W = any> {
  readonly closed: Promise<void>;
  readonly desiredSize: number | null;
  readonly ready: Promise<void>;
  abort(reason?: any): Promise<void>;
  close(): Promise<void>;
  releaseLock(): void;
  write(chunk?: W): Promise<void>;
}
declare var WritableStreamDefaultWriter: {
  prototype: WritableStreamDefaultWriter;
  new <W = any>(stream: WritableStream<W>): WritableStreamDefaultWriter<W>;
};
interface TransformStream<I = any, O = any> {
  readonly readable: ReadableStream<O>;
  readonly writable: WritableStream<I>;
}
declare var TransformStream: {
  prototype: TransformStream;
  new <I = any, O = any>(
    transformer?: Transformer<I, O>,
    writableStrategy?: QueuingStrategy<I>,
    readableStrategy?: QueuingStrategy<O>,
  ): TransformStream<I, O>;
};
interface TransformStreamDefaultController<O = any> {
  readonly desiredSize: number | null;
  enqueue(chunk?: O): void;
  error(reason?: any): void;
  terminate(): void;
}
declare var TransformStreamDefaultController: {
  prototype: TransformStreamDefaultController;
  new (): TransformStreamDefaultController;
};
interface StreamPipeOptions {
  preventAbort?: boolean;
  preventCancel?: boolean;
  preventClose?: boolean;
  signal?: AbortSignal;
}
interface CountQueuingStrategy extends QueuingStrategy {
  readonly highWaterMark: number;
  readonly size: QueuingStrategySize;
}
declare var CountQueuingStrategy: {
  prototype: CountQueuingStrategy;
  new (init: QueuingStrategyInit): CountQueuingStrategy;
};
interface QueuingStrategySize<T = any> {
  (chunk?: T): number;
}
interface Transformer<I = any, O = any> {
  flush?: Bun.TransformerFlushCallback<O>;
  readableType?: undefined;
  start?: Bun.TransformerStartCallback<O>;
  transform?: Bun.TransformerTransformCallback<I, O>;
  writableType?: undefined;
}
interface Dict<T> {
  [key: string]: T | undefined;
}
interface ReadOnlyDict<T> {
  readonly [key: string]: T | undefined;
}
interface ErrnoException extends Error {
  errno?: number | undefined;
  code?: string | undefined;
  path?: string | undefined;
  syscall?: string | undefined;
}
interface DOMException extends Error {
  readonly message: string;
  readonly name: string;
  readonly INDEX_SIZE_ERR: 1;
  readonly DOMSTRING_SIZE_ERR: 2;
  readonly HIERARCHY_REQUEST_ERR: 3;
  readonly WRONG_DOCUMENT_ERR: 4;
  readonly INVALID_CHARACTER_ERR: 5;
  readonly NO_DATA_ALLOWED_ERR: 6;
  readonly NO_MODIFICATION_ALLOWED_ERR: 7;
  readonly NOT_FOUND_ERR: 8;
  readonly NOT_SUPPORTED_ERR: 9;
  readonly INUSE_ATTRIBUTE_ERR: 10;
  readonly INVALID_STATE_ERR: 11;
  readonly SYNTAX_ERR: 12;
  readonly INVALID_MODIFICATION_ERR: 13;
  readonly NAMESPACE_ERR: 14;
  readonly INVALID_ACCESS_ERR: 15;
  readonly VALIDATION_ERR: 16;
  readonly TYPE_MISMATCH_ERR: 17;
  readonly SECURITY_ERR: 18;
  readonly NETWORK_ERR: 19;
  readonly ABORT_ERR: 20;
  readonly URL_MISMATCH_ERR: 21;
  readonly QUOTA_EXCEEDED_ERR: 22;
  readonly TIMEOUT_ERR: 23;
  readonly INVALID_NODE_TYPE_ERR: 24;
  readonly DATA_CLONE_ERR: 25;
}
declare var DOMException: {
  prototype: DOMException;
  new (message?: string, name?: string): DOMException;
  readonly INDEX_SIZE_ERR: 1;
  readonly DOMSTRING_SIZE_ERR: 2;
  readonly HIERARCHY_REQUEST_ERR: 3;
  readonly WRONG_DOCUMENT_ERR: 4;
  readonly INVALID_CHARACTER_ERR: 5;
  readonly NO_DATA_ALLOWED_ERR: 6;
  readonly NO_MODIFICATION_ALLOWED_ERR: 7;
  readonly NOT_FOUND_ERR: 8;
  readonly NOT_SUPPORTED_ERR: 9;
  readonly INUSE_ATTRIBUTE_ERR: 10;
  readonly INVALID_STATE_ERR: 11;
  readonly SYNTAX_ERR: 12;
  readonly INVALID_MODIFICATION_ERR: 13;
  readonly NAMESPACE_ERR: 14;
  readonly INVALID_ACCESS_ERR: 15;
  readonly VALIDATION_ERR: 16;
  readonly TYPE_MISMATCH_ERR: 17;
  readonly SECURITY_ERR: 18;
  readonly NETWORK_ERR: 19;
  readonly ABORT_ERR: 20;
  readonly URL_MISMATCH_ERR: 21;
  readonly QUOTA_EXCEEDED_ERR: 22;
  readonly TIMEOUT_ERR: 23;
  readonly INVALID_NODE_TYPE_ERR: 24;
  readonly DATA_CLONE_ERR: 25;
};
declare function alert(message?: string): void;
declare function confirm(message?: string): boolean;
declare function prompt(message?: string, _default?: string): string | null;
interface SubtleCrypto extends Bun.__internal.LibEmptyOrNodeCryptoWebcryptoSubtleCrypto {}
declare var SubtleCrypto: {
  prototype: SubtleCrypto;
  new (): SubtleCrypto;
};
interface CryptoKey extends Bun.__internal.NodeCryptoWebcryptoCryptoKey {}
declare var CryptoKey: {
  prototype: CryptoKey;
  new (): CryptoKey;
};
interface CryptoKeyPair extends Bun.__internal.NodeCryptoWebcryptoCryptoKeyPair {}
interface Position {
  lineText: string;
  file: string;
  namespace: string;
  line: number;
  column: number;
  length: number;
  offset: number;
}
declare class ResolveMessage {
  readonly name: "ResolveMessage";
  readonly position: Position | null;
  readonly code: string;
  readonly message: string;
  readonly referrer: string;
  readonly specifier: string;
  readonly importKind:
    | "entry_point"
    | "stmt"
    | "require"
    | "import"
    | "dynamic"
    | "require_resolve"
    | "at"
    | "at_conditional"
    | "url"
    | "internal";
  readonly level: "error" | "warning" | "info" | "debug" | "verbose";
  toString(): string;
}
declare class BuildMessage {
  readonly name: "BuildMessage";
  readonly position: Position | null;
  readonly message: string;
  readonly level: "error" | "warning" | "info" | "debug" | "verbose";
}
interface ErrorOptions {
  cause?: unknown;
}
interface Error {
  cause?: unknown;
}
interface ErrorConstructor {
  new (message?: string, options?: ErrorOptions): Error;
  isError(value: unknown): value is Error;
  captureStackTrace(targetObject: object, constructorOpt?: Function): void;
  stackTraceLimit: number;
}
interface ArrayBufferConstructor {
  new (byteLength: number, options: { maxByteLength?: number }): ArrayBuffer;
}
interface ArrayBuffer {
  readonly byteLength: number;
  resize(byteLength: number): ArrayBuffer;
  slice(begin: number, end?: number): ArrayBuffer;
}
interface SharedArrayBuffer {
  grow(size: number): SharedArrayBuffer;
}
interface ArrayConstructor {
  fromAsync<T>(arrayLike: AsyncIterable<T> | Iterable<T> | ArrayLike<T>): Promise<Awaited<T>[]>;
  fromAsync<T, U>(
    arrayLike: AsyncIterable<T> | Iterable<T> | ArrayLike<T>,
    mapFn?: (value: T, index: number) => U,
    thisArg?: any,
  ): Promise<Awaited<U>[]>;
}
interface ConsoleOptions {
  stdout: import("stream").Writable;
  stderr?: import("stream").Writable;
  ignoreErrors?: boolean;
  colorMode?: boolean | "auto";
  inspectOptions?: import("util").InspectOptions;
  groupIndentation?: number;
}
interface Console {
  [Symbol.asyncIterator](): AsyncIterableIterator<string>;
  write(...data: Array<string | ArrayBufferView | ArrayBuffer>): number | Promise<number>;
  clear(): void;
  assert(condition?: boolean, ...data: any[]): void;
  count(label?: string): void;
  countReset(label?: string): void;
  debug(...data: any[]): void;
  dir(item?: any, options?: any): void;
  dirxml(...data: any[]): void;
  error(...data: any[]): void;
  group(...data: any[]): void;
  groupCollapsed(...data: any[]): void;
  groupEnd(): void;
  info(...data: any[]): void;
  log(...data: any[]): void;
  table(tabularData?: any, properties?: string[]): void;
  time(label?: string): void;
  timeEnd(label?: string): void;
  timeLog(label?: string, ...data: any[]): void;
  timeStamp(label?: string): void;
  trace(...data: any[]): void;
  warn(...data: any[]): void;
}
declare var console: Console;
interface ImportMetaEnv {
  [key: string]: string | undefined;
}
declare module "bun" {
  interface ImportMetaGlobOptions {
    eager?: boolean;
    import?: string;
    query?: string | Record<string, string | number | boolean>;
    base?: string;
    exhaustive?: boolean;
  }
}
interface ImportMeta extends Bun.__internal.ImportMetaGlob {
  url: string;
  readonly path: string;
  readonly dir: string;
  readonly file: string;
  readonly env: Bun.Env & NodeJS.ProcessEnv & ImportMetaEnv;
  resolveSync(moduleId: string, parent?: string): string;
  require: NodeJS.Require;
  main: boolean;
  dirname: string;
  filename: string;
}
declare var require: NodeJS.Require;
declare var exports: any;
interface NodeModule {
  exports: any;
}
declare var module: NodeModule;
declare function structuredClone<T>(value: T, options?: Bun.StructuredSerializeOptions): T;
declare function postMessage(message: any, transfer?: Bun.Transferable[]): void;
interface EventSourceInit {
  withCredentials?: boolean;
}
interface PromiseConstructor {
  withResolvers<T>(): {
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
  };
  try<T, A extends any[] = []>(fn: (...args: A) => T | PromiseLike<T>, ...args: A): Promise<T>;
}
interface Navigator {
  readonly userAgent: string;
  readonly platform: "MacIntel" | "Win32" | "Linux x86_64";
  readonly hardwareConcurrency: number;
}
declare var navigator: Navigator;
interface BlobPropertyBag {
  type?: string;
}
interface WorkerOptions extends Bun.WorkerOptions {}
interface Blob {
  readonly size: number;
  readonly type: string;
  slice(start?: number, end?: number, contentType?: string): Blob;
  json(): Promise<any>;
  image(options?: Bun.Image.ConstructorOptions): Bun.Image;
  formData(): Promise<FormData>;
  text(): Promise<string>;
  arrayBuffer(): Promise<ArrayBuffer>;
  bytes(): Promise<Uint8Array<ArrayBuffer>>;
  stream(): ReadableStream<Uint8Array<ArrayBuffer>>;
}
declare var Blob: Bun.__internal.UseLibDomIfAvailable<
  "Blob",
  {
    prototype: Blob;
    new (blobParts?: Bun.BlobPart[], options?: BlobPropertyBag): Blob;
  }
>;
interface Uint8Array {
  toBase64(options?: { alphabet?: "base64" | "base64url"; omitPadding?: boolean }): string;
  setFromBase64(
    base64: string,
    offset?: number,
  ): {
    read: number;
    written: number;
  };
  toHex(): string;
  setFromHex(hex: string): {
    read: number;
    written: number;
  };
}
interface Uint8ArrayConstructor {
  fromBase64(
    base64: string,
    options?: {
    },
  ): Uint8Array<ArrayBuffer>;
  fromHex(hex: string): Uint8Array<ArrayBuffer>;
}
interface BroadcastChannel extends Bun.__internal.LibEmptyOrBroadcastChannel {}
declare var BroadcastChannel: Bun.__internal.UseLibDomIfAvailable<
  "BroadcastChannel",
  typeof import("node:worker_threads").BroadcastChannel
>;
declare var URL: Bun.__internal.UseLibDomIfAvailable<
  "URL",
  {
    prototype: URL;
    new (url: string | URL, base?: string | URL): URL;
    canParse(url: string, base?: string): boolean;
    createObjectURL(object: Blob): `blob:${string}`;
    revokeObjectURL(url: string): void;
    parse(url: string, base?: string): URL | null;
  }
>;
interface AbortController {
  readonly signal: AbortSignal;
  abort(reason?: any): void;
}
declare var AbortController: Bun.__internal.UseLibDomIfAvailable<
  "AbortController",
  {
    prototype: AbortController;
    new (): AbortController;
  }
>;
interface AbortSignal extends EventTarget {
  readonly aborted: boolean;
  onabort: ((this: AbortSignal, ev: Event) => any) | null;
  readonly reason: any;
  throwIfAborted(): void;
}
declare var AbortSignal: Bun.__internal.UseLibDomIfAvailable<
  "AbortSignal",
  {
    prototype: AbortSignal;
    new (): AbortSignal;
    timeout(ms: number): AbortSignal;
    abort(reason?: any): AbortSignal;
    any(signals: AbortSignal[]): AbortSignal;
  }
>;
interface FormData {
  append(name: string, value: string | Blob): void;
  append(name: string, value: string): void;
  append(name: string, blobValue: Blob, filename?: string): void;
  delete(name: string): void;
  get(name: string): Bun.FormDataEntryValue | null;
  getAll(name: string): Bun.FormDataEntryValue[];
  has(name: string): boolean;
  set(name: string, value: string | Blob): void;
  set(name: string, value: string): void;
  set(name: string, blobValue: Blob, filename?: string): void;
  forEach(callbackfn: (value: Bun.FormDataEntryValue, key: string, parent: FormData) => void, thisArg?: any): void;
  keys(): IterableIterator<string>;
  values(): IterableIterator<string>;
  entries(): IterableIterator<[string, string]>;
}
declare var FormData: Bun.__internal.UseLibDomIfAvailable<"FormData", { prototype: FormData; new (): FormData }>;
interface EventSource extends Bun.__internal.LibEmptyOrEventSource {}
declare var EventSource: Bun.__internal.UseLibDomIfAvailable<
  "EventSource",
  { prototype: EventSource; new (): EventSource }
>;
interface Performance extends Bun.__internal.LibPerformanceOrNodePerfHooksPerformance {}
declare var performance: Bun.__internal.UseLibDomIfAvailable<"performance", Performance>;
declare var Performance: Bun.__internal.UseLibDomIfAvailable<
  "Performance",
  { new (): Performance; prototype: Performance }
>;
interface PerformanceEntry extends Bun.__internal.LibEmptyOrPerformanceEntry {}
declare var PerformanceEntry: Bun.__internal.UseLibDomIfAvailable<
  "PerformanceEntry",
  { prototype: PerformanceEntry; new (): PerformanceEntry }
>;
interface PerformanceMark extends Bun.__internal.LibEmptyOrPerformanceMark {}
declare var PerformanceMark: Bun.__internal.UseLibDomIfAvailable<
  "PerformanceMark",
  { prototype: PerformanceMark; new (): PerformanceMark }
>;
interface PerformanceMeasure extends Bun.__internal.LibEmptyOrPerformanceMeasure {}
declare var PerformanceMeasure: Bun.__internal.UseLibDomIfAvailable<
  "PerformanceMeasure",
  { prototype: PerformanceMeasure; new (): PerformanceMeasure }
>;
interface PerformanceObserver extends Bun.__internal.LibEmptyOrPerformanceObserver {}
declare var PerformanceObserver: Bun.__internal.UseLibDomIfAvailable<
  "PerformanceObserver",
  {
    prototype: PerformanceObserver;
    new (callback: import("node:perf_hooks").PerformanceObserverCallback): PerformanceObserver;
    readonly supportedEntryTypes: readonly string[];
  }
>;
interface PerformanceObserverEntryList extends Bun.__internal.LibEmptyOrPerformanceObserverEntryList {}
declare var PerformanceObserverEntryList: Bun.__internal.UseLibDomIfAvailable<
  "PerformanceObserverEntryList",
  { prototype: PerformanceObserverEntryList; new (): PerformanceObserverEntryList }
>;
interface PerformanceResourceTiming extends Bun.__internal.LibEmptyOrPerformanceResourceTiming {}
declare var PerformanceResourceTiming: Bun.__internal.UseLibDomIfAvailable<
  "PerformanceResourceTiming",
  { prototype: PerformanceResourceTiming; new (): PerformanceResourceTiming }
>;
interface ReadableByteStreamController extends Bun.__internal.LibEmptyOrReadableByteStreamController {}
declare var ReadableByteStreamController: Bun.__internal.UseLibDomIfAvailable<
  "ReadableByteStreamController",
  { prototype: ReadableByteStreamController; new (): ReadableByteStreamController }
>;
interface ReadableStreamBYOBReader extends Bun.__internal.LibEmptyOrReadableStreamBYOBReader {}
declare var ReadableStreamBYOBReader: Bun.__internal.UseLibDomIfAvailable<
  "ReadableStreamBYOBReader",
  { prototype: ReadableStreamBYOBReader; new (): ReadableStreamBYOBReader }
>;
interface ReadableStreamBYOBRequest extends Bun.__internal.LibEmptyOrReadableStreamBYOBRequest {}
declare var ReadableStreamBYOBRequest: Bun.__internal.UseLibDomIfAvailable<
  "ReadableStreamBYOBRequest",
  { prototype: ReadableStreamBYOBRequest; new (): ReadableStreamBYOBRequest }
>;
interface TextDecoderStream extends Bun.__internal.LibEmptyOrNodeStreamWebTextDecoderStream {}
declare var TextDecoderStream: Bun.__internal.UseLibDomIfAvailable<
  "TextDecoderStream",
  {
    prototype: TextDecoderStream;
    new (encoding?: Bun.Encoding, options?: { fatal?: boolean; ignoreBOM?: boolean }): TextDecoderStream;
  }
>;
interface TextEncoderStream extends Bun.__internal.LibEmptyOrNodeStreamWebTextEncoderStream {}
declare var TextEncoderStream: Bun.__internal.UseLibDomIfAvailable<
  "TextEncoderStream",
  { prototype: TextEncoderStream; new (): TextEncoderStream }
>;
interface URLSearchParams {}
declare var URLSearchParams: Bun.__internal.UseLibDomIfAvailable<
  "URLSearchParams",
  {
    prototype: URLSearchParams;
    new (
    ): URLSearchParams;
  }
>;
interface MessageChannel {
  readonly port1: MessagePort;
  readonly port2: MessagePort;
}
declare var MessageChannel: Bun.__internal.UseLibDomIfAvailable<
  "MessageChannel",
  { prototype: MessageChannel; new (): MessageChannel }
>;
interface MessagePort extends Bun.__internal.LibEmptyOrNodeMessagePort {}
declare var MessagePort: Bun.__internal.UseLibDomIfAvailable<
  "MessagePort",
  {
    prototype: MessagePort;
    new (): MessagePort;
  }
>;
interface RequestInit extends Bun.__internal.LibOrFallbackRequestInit {}
interface ResponseInit extends Bun.__internal.LibOrFallbackResponseInit {}
interface Headers extends Bun.__internal.BunHeadersOverride {}
declare var Headers: Bun.__internal.UseLibDomIfAvailable<
  "Headers",
  {
    prototype: Headers;
    new (init?: Bun.HeadersInit): Headers;
  }
>;
interface Request extends Bun.__internal.BunRequestOverride {}
declare var Request: Bun.__internal.UseLibDomIfAvailable<
  "Request",
  {
    prototype: Request;
    new (requestInfo: string, init?: RequestInit): Request;
    new (requestInfo: RequestInit & { url: string }): Request;
    new (requestInfo: Request, init?: RequestInit): Request;
  }
>;
interface Response extends Bun.__internal.BunResponseOverride {}
declare var Response: Bun.__internal.UseLibDomIfAvailable<
  "Response",
  {
    new (body?: Bun.BodyInit | null | undefined, init?: ResponseInit | undefined): Response;
    json(body?: any, init?: ResponseInit | number): Response;
    redirect(url: string, status?: number): Response;
    redirect(url: string, init?: ResponseInit): Response;
    error(): Response;
  }
>;
interface BunFetchRequestInitTLS extends Bun.TLSOptions {
  checkServerIdentity?: NonNullable<import("node:tls").ConnectionOptions["checkServerIdentity"]>;
}
interface BunFetchRequestInit extends RequestInit {
  tls?: BunFetchRequestInitTLS;
  verbose?: boolean;
  proxy?: Bun.FetchProxyOption | undefined;
  session?: Bun.FetchSession | undefined;
  s3?: Bun.S3Options;
  unix?: string;
  protocol?: "http2" | "http1.1" | "http3" | "h2" | "h1" | "h3";
  decompress?: boolean;
  compress?:
    boolean | "gzip" | "deflate" | "br" | "zstd" | { encoding: "gzip" | "deflate" | "br" | "zstd"; level?: number };
  maxRedirects?: number;
  timeout?: number | boolean;
}
declare function fetch(input: string | URL | Request, init?: BunFetchRequestInit): Promise<Response>;
declare namespace fetch {
  export function preconnect(
    url: string | URL,
    options?: {
    },
  ): void;
}
interface RegExpConstructor {
  escape(string: string): string;
}
```

## `html-rewriter.d.ts` (202 lines -> 79 lines)

```ts
declare namespace HTMLRewriterTypes {
  interface HTMLRewriterElementContentHandlers {
    element?(element: Element): void | Promise<void>;
    comments?(comment: Comment): void | Promise<void>;
    text?(text: Text): void | Promise<void>;
  }
  interface HTMLRewriterDocumentContentHandlers {
    doctype?(doctype: Doctype): void | Promise<void>;
    comments?(comment: Comment): void | Promise<void>;
    text?(text: Text): void | Promise<void>;
    end?(end: DocumentEnd): void | Promise<void>;
  }
  interface Text {
    readonly text: string;
    readonly lastInTextNode: boolean;
    readonly removed: boolean;
    before(content: Content, options?: ContentOptions): Text;
    after(content: Content, options?: ContentOptions): Text;
    replace(content: Content, options?: ContentOptions): Text;
    remove(): Text;
  }
  interface Doctype {
    readonly name: string | null;
    readonly publicId: string | null;
    readonly systemId: string | null;
    readonly removed: boolean;
    remove(): Doctype;
  }
  interface DocumentEnd {
    append(content: Content, options?: ContentOptions): DocumentEnd;
  }
  interface ContentOptions {
    html?: boolean;
  }
  type Content = string;
  interface Comment {
    text: string;
    readonly removed: boolean;
    before(content: Content, options?: ContentOptions): Comment;
    after(content: Content, options?: ContentOptions): Comment;
    replace(content: Content, options?: ContentOptions): Comment;
    remove(): Comment;
  }
  interface Element {
    tagName: string;
    readonly attributes: IterableIterator<[string, string]>;
    readonly removed: boolean;
    readonly selfClosing: boolean;
    readonly canHaveContent: boolean;
    readonly namespaceURI: string;
    getAttribute(name: string): string | null;
    hasAttribute(name: string): boolean;
    setAttribute(name: string, value: string): Element;
    removeAttribute(name: string): Element;
    before(content: Content, options?: ContentOptions): Element;
    after(content: Content, options?: ContentOptions): Element;
    prepend(content: Content, options?: ContentOptions): Element;
    append(content: Content, options?: ContentOptions): Element;
    replace(content: Content, options?: ContentOptions): Element;
    remove(): Element;
    removeAndKeepContent(): Element;
    setInnerContent(content: Content, options?: ContentOptions): Element;
    onEndTag(handler: (tag: EndTag) => void | Promise<void>): void;
  }
  interface EndTag {
    name: string;
    before(content: Content, options?: ContentOptions): EndTag;
    after(content: Content, options?: ContentOptions): EndTag;
    remove(): EndTag;
  }
}
declare class HTMLRewriter {
  constructor();
  on(selector: string, handlers: HTMLRewriterTypes.HTMLRewriterElementContentHandlers): HTMLRewriter;
  onDocument(handlers: HTMLRewriterTypes.HTMLRewriterDocumentContentHandlers): HTMLRewriter;
  transform(input: Response): Response;
  transform(input: string): string;
  transform(input: Bun.BufferSource): ArrayBuffer;
}
```

## `index.d.ts` (33 lines -> 23 lines)

```ts
/// <reference types="node" />
/// <reference path="./globals.d.ts" />
/// <reference path="./s3.d.ts" />
/// <reference path="./fetch.d.ts" />
/// <reference path="./bun.d.ts" />
/// <reference path="./extensions.d.ts" />
/// <reference path="./devserver.d.ts" />
/// <reference path="./ffi.d.ts" />
/// <reference path="./html-rewriter.d.ts" />
/// <reference path="./jsc.d.ts" />
/// <reference path="./sqlite.d.ts" />
/// <reference path="./test.d.ts" />
/// <reference path="./wasm.d.ts" />
/// <reference path="./overrides.d.ts" />
/// <reference path="./deprecated.d.ts" />
/// <reference path="./redis.d.ts" />
/// <reference path="./shell.d.ts" />
/// <reference path="./serve.d.ts" />
/// <reference path="./sql.d.ts" />
/// <reference path="./security.d.ts" />
/// <reference path="./bundle.d.ts" />
/// <reference path="./bun.ns.d.ts" />
declare var onmessage: Bun.__internal.UseLibDomIfAvailable<"onmessage", never>;
```

## `jsc.d.ts` (825 lines -> 88 lines, 17 nested lines elided)

```ts
declare module "bun:jsc" {
  function jscDescribe(value: any): string;
  function jscDescribeArray(array: any[]): string;
  function gcAndSweep(): number;
  function fullGC(): number;
  function edenGC(): number;
  function heapSize(): number;
  function heapStats(): HeapStats;
  function memoryUsage(): MemoryUsage;
  function bytecodeOrderStats(): BytecodeOrderStats | null;
  function getRandomSeed(): number;
  function setRandomSeed(value: number): void;
  function isRope(input: string): boolean;
  function callerSourceOrigin(): string | null;
  function noFTL(func: (...args: any[]) => any): void;
  function noOSRExitFuzzing(func: (...args: any[]) => any): void;
  function optimizeNextInvocation(func: (...args: any[]) => any): void;
  function numberOfDFGCompiles(func: (...args: any[]) => any): number;
  function releaseWeakRefs(): void;
  function totalCompileTime(): number;
  function reoptimizationRetryCount(func: (...args: any[]) => any): number;
  function drainMicrotasks(): void;
  function serialize(value: any, options?: { binaryType?: "arraybuffer" }): SharedArrayBuffer;
  function serialize(value: any, options?: { binaryType: "nodebuffer" }): Buffer;
  function deserialize(value: ArrayBufferLike | NodeJS.TypedArray | Buffer): any;
  function setTimeZone(timeZone: string): string;
  interface HeapStats {
    heapSize: number;
    heapCapacity: number;
    extraMemorySize: number;
    objectCount: number;
    protectedObjectCount: number;
    globalObjectCount: number;
    protectedGlobalObjectCount: number;
    objectTypeCounts: Record<string, number>;
    protectedObjectTypeCounts: Record<string, number>;
  }
  interface BytecodeOrderStats {
    hot: number;
    unknown: number;
    cold: number;
    hotBytes: number;
    unknownBytes: number;
    coldBytes: number;
    regions: {
    };
  }
  interface MemoryUsage {
    current: number;
    peak: number;
    currentCommit: number;
    peakCommit: number;
    pageFaults: number;
  }
  interface SamplingProfileStackFrame {
    sourceID: number;
    name: string;
    location: string;
    sourceURL?: string;
    line: number;
    column: number;
    category: string;
    flags: number;
    inliner?: {
    };
  }
  interface SamplingProfileStackTraces {
    interval: number;
    traces: Array<{
    }>;
    sources: Array<{
    }>;
  }
  interface SamplingProfile {
    functions: string;
    bytecodes: string;
    stackTraces: SamplingProfileStackTraces;
  }
  function profile<T extends (...args: any[]) => any>(
    callback: T,
    sampleInterval?: number,
    ...args: Parameters<T>
  ): ReturnType<T> extends Promise<infer U> ? Promise<SamplingProfile> : SamplingProfile;
  function getProtectedObjects(): any[];
  function startRemoteDebugger(host?: string, port?: number): void;
  function startSamplingProfiler(optionalDirectory?: string, sampleInterval?: number): void;
  function estimateShallowMemoryUsageOf(value: object | CallableFunction | bigint | symbol | string): number;
}
```

## `jsx.d.ts` (17 lines -> 9 lines)

```ts
export {};
type ReactElement = typeof globalThis extends { React: infer React }
  ? React extends { createElement(...args: any): infer R }
    ? R
    : never
  : unknown;
export namespace JSX {
  export type Element = ReactElement;
}
```

## `overrides.d.ts` (429 lines -> 55 lines, 244 nested lines elided)

```ts
export {};
interface BunConsumerConvenienceMethods {
  text(): Promise<string>;
  bytes(): Promise<Uint8Array<ArrayBuffer>>;
  json(): Promise<any>;
}
declare module "stream/web" {
  interface ReadableStream extends BunConsumerConvenienceMethods {
    blob(): Promise<Blob>;
  }
}
declare module "buffer" {
  interface Blob extends BunConsumerConvenienceMethods {
    bytes(): Promise<Uint8Array<ArrayBuffer>>;
    formData(): Promise<FormData>;
    arrayBuffer(): Promise<ArrayBuffer>;
    image(options?: Bun.Image.ConstructorOptions): Bun.Image;
    stream(): ReadableStream<Uint8Array<ArrayBuffer>>;
  }
}
declare module "url" {
  interface URLSearchParams {
    toJSON(): Record<string, string>;
  }
}
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Bun.Env {}
    interface Process {
    }
    interface ProcessVersions extends Dict<string> {
    }
  }
}
declare module "node:fs/promises" {
  function exists(path: Bun.PathLike): Promise<boolean>;
}
declare module "node:fs" {
  interface StreamOptions {
    windowsHandle?: bigint | undefined;
  }
}
declare module "node:tls" {
  interface BunConnectionOptions extends Omit<ConnectionOptions, "key" | "ca" | "tls" | "cert"> {
    ca?: string | Buffer | NodeJS.TypedArray | Bun.BunFile | Array<string | Buffer | Bun.BunFile> | undefined;
    cert?:
    key?:
  }
  function connect(options: BunConnectionOptions, secureConnectListener?: () => void): TLSSocket;
}
declare module "console" {
  interface Console {
    [Symbol.asyncIterator](): AsyncIterableIterator<string>;
  }
}
```

## `redis.d.ts` (3997 lines -> 377 lines, 259 nested lines elided)

```ts
declare module "bun" {
  export interface RedisOptions {
    connectionTimeout?: number;
    idleTimeout?: number;
    autoReconnect?: boolean;
    maxRetries?: number;
    enableOfflineQueue?: boolean;
    tls?: boolean | Bun.TLSOptions;
    enableAutoPipelining?: boolean;
  }
  export namespace RedisClient {
    type KeyLike = string | ArrayBufferView | Blob;
    type StringPubSubListener = (message: string, channel: string) => void;
  }
  export class RedisClient {
    constructor(url?: string, options?: RedisOptions);
    readonly connected: boolean;
    readonly bufferedAmount: number;
    onconnect: ((this: RedisClient) => void) | null;
    onclose: ((this: RedisClient, error: Error) => void) | null;
    connect(): Promise<void>;
    close(): void;
    send(command: string, args: string[]): Promise<any>;
    get(key: RedisClient.KeyLike): Promise<string | null>;
    getBuffer(key: RedisClient.KeyLike): Promise<Uint8Array<ArrayBuffer> | null>;
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<"OK">;
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, ex: "EX", seconds: number): Promise<"OK">;
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, px: "PX", milliseconds: number): Promise<"OK">;
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, exat: "EXAT", timestampSeconds: number): Promise<"OK">;
    set(
    ): Promise<"OK">;
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, nx: "NX"): Promise<"OK" | null>;
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, xx: "XX"): Promise<"OK" | null>;
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, get: "GET"): Promise<string | null>;
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, keepttl: "KEEPTTL"): Promise<"OK">;
    set(key: RedisClient.KeyLike, value: RedisClient.KeyLike, ...options: string[]): Promise<"OK" | string | null>;
    del(...keys: RedisClient.KeyLike[]): Promise<number>;
    incr(key: RedisClient.KeyLike): Promise<number>;
    incrby(key: RedisClient.KeyLike, increment: number): Promise<number>;
    incrbyfloat(key: RedisClient.KeyLike, increment: number | string): Promise<string>;
    decr(key: RedisClient.KeyLike): Promise<number>;
    decrby(key: RedisClient.KeyLike, decrement: number): Promise<number>;
    exists(key: RedisClient.KeyLike): Promise<boolean>;
    expire(key: RedisClient.KeyLike, seconds: number): Promise<number>;
    expireat(key: RedisClient.KeyLike, timestamp: number): Promise<number>;
    pexpire(key: RedisClient.KeyLike, milliseconds: number): Promise<number>;
    ttl(key: RedisClient.KeyLike): Promise<number>;
    hset(key: RedisClient.KeyLike, fields: Record<string | number, RedisClient.KeyLike | number>): Promise<number>;
    hset(
    ): Promise<number>;
    hsetnx(key: RedisClient.KeyLike, field: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<boolean>;
    hgetdel(
    ): Promise<Array<string | null>>;
    hgetex(key: RedisClient.KeyLike, fieldsKeyword: "FIELDS", numfields: number, ...fields: RedisClient.KeyLike[]): Promise<Array<string | null>>;
    hgetex(key: RedisClient.KeyLike, ex: "EX", seconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fields: RedisClient.KeyLike[]): Promise<Array<string | null>>;
    hgetex(key: RedisClient.KeyLike, px: "PX", milliseconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fields: RedisClient.KeyLike[]): Promise<Array<string | null>>;
    hgetex(key: RedisClient.KeyLike, exat: "EXAT", unixTimeSeconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fields: RedisClient.KeyLike[]): Promise<Array<string | null>>;
    hgetex(key: RedisClient.KeyLike, pxat: "PXAT", unixTimeMilliseconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fields: RedisClient.KeyLike[]): Promise<Array<string | null>>;
    hgetex(key: RedisClient.KeyLike, persist: "PERSIST", fieldsKeyword: "FIELDS", numfields: number, ...fields: RedisClient.KeyLike[]): Promise<Array<string | null>>;
    hsetex(key: RedisClient.KeyLike, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, fnx: "FNX", fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, fxx: "FXX", fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, ex: "EX", seconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, px: "PX", milliseconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, exat: "EXAT", unixTimeSeconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, pxat: "PXAT", unixTimeMilliseconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, keepttl: "KEEPTTL", fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, fnx: "FNX", ex: "EX", seconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, fnx: "FNX", px: "PX", milliseconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, fnx: "FNX", exat: "EXAT", unixTimeSeconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, fnx: "FNX", pxat: "PXAT", unixTimeMilliseconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, fnx: "FNX", keepttl: "KEEPTTL", fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, fxx: "FXX", ex: "EX", seconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, fxx: "FXX", px: "PX", milliseconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, fxx: "FXX", exat: "EXAT", unixTimeSeconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, fxx: "FXX", pxat: "PXAT", unixTimeMilliseconds: number, fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hsetex(key: RedisClient.KeyLike, fxx: "FXX", keepttl: "KEEPTTL", fieldsKeyword: "FIELDS", numfields: number, ...fieldValues: RedisClient.KeyLike[]): Promise<number>;
    hexpire(
    ): Promise<number[]>;
    hexpire(
    ): Promise<number[]>;
    hexpireat(
    ): Promise<number[]>;
    hexpireat(
    ): Promise<number[]>;
    hexpiretime(
    ): Promise<number[]>;
    hpersist(
    ): Promise<number[]>;
    hpexpire(
    ): Promise<number[]>;
    hpexpire(
    ): Promise<number[]>;
    hpexpireat(
    ): Promise<number[]>;
    hpexpireat(
    ): Promise<number[]>;
    hpexpiretime(
    ): Promise<number[]>;
    hpttl(
    ): Promise<number[]>;
    httl(
    ): Promise<number[]>;
    hmset(key: RedisClient.KeyLike, fields: Record<string | number, RedisClient.KeyLike | number>): Promise<"OK">;
    hmset(
    ): Promise<"OK">;
    hmset(key: RedisClient.KeyLike, fieldValues: RedisClient.KeyLike[]): Promise<"OK">;
    hget(key: RedisClient.KeyLike, field: RedisClient.KeyLike): Promise<string | null>;
    hmget(key: RedisClient.KeyLike, ...fields: string[]): Promise<Array<string | null>>;
    hmget(key: RedisClient.KeyLike, fields: string[]): Promise<Array<string | null>>;
    hdel(key: RedisClient.KeyLike, field: RedisClient.KeyLike, ...rest: RedisClient.KeyLike[]): Promise<number>;
    hexists(key: RedisClient.KeyLike, field: RedisClient.KeyLike): Promise<boolean>;
    hrandfield(key: RedisClient.KeyLike): Promise<string | null>;
    hrandfield(key: RedisClient.KeyLike, count: number): Promise<string[]>;
    hrandfield(key: RedisClient.KeyLike, count: number, withValues: "WITHVALUES"): Promise<[string, string][]>;
    hscan(key: RedisClient.KeyLike, cursor: number | string): Promise<[string, string[]]>;
    hscan(
    ): Promise<[string, string[]]>;
    hscan(
    ): Promise<[string, string[]]>;
    hscan(
    ): Promise<[string, string[]]>;
    sismember(key: RedisClient.KeyLike, member: string): Promise<boolean>;
    sadd(key: RedisClient.KeyLike, ...members: string[]): Promise<number>;
    srem(key: RedisClient.KeyLike, ...members: string[]): Promise<number>;
    smove(source: RedisClient.KeyLike, destination: RedisClient.KeyLike, member: string): Promise<boolean>;
    smembers(key: RedisClient.KeyLike): Promise<string[]>;
    srandmember(key: RedisClient.KeyLike): Promise<string | null>;
    srandmember(key: RedisClient.KeyLike, count: number): Promise<string[] | null>;
    spop(key: RedisClient.KeyLike): Promise<string | null>;
    spop(key: RedisClient.KeyLike, count: number): Promise<string[] | null>;
    spublish(channel: RedisClient.KeyLike, message: string): Promise<number>;
    sdiffstore(
    ): Promise<number>;
    smismember(
    ): Promise<number[]>;
    sscan(key: RedisClient.KeyLike, cursor: number | string, ...args: (string | number)[]): Promise<[string, string[]]>;
    hincrby(key: RedisClient.KeyLike, field: string, increment: string | number): Promise<number>;
    hincrbyfloat(key: RedisClient.KeyLike, field: string, increment: string | number): Promise<string>;
    hgetall(key: RedisClient.KeyLike): Promise<Record<string, string>>;
    hkeys(key: RedisClient.KeyLike): Promise<string[]>;
    hlen(key: RedisClient.KeyLike): Promise<number>;
    hstrlen(key: RedisClient.KeyLike, field: string): Promise<number>;
    hvals(key: RedisClient.KeyLike): Promise<string[]>;
    keys(pattern: string): Promise<string[]>;
    blpop(...args: (RedisClient.KeyLike | number)[]): Promise<[string, string] | null>;
    brpop(...args: (RedisClient.KeyLike | number)[]): Promise<[string, string] | null>;
    blmove(
    ): Promise<string | null>;
    blmpop(timeout: number, numkeys: number, ...args: (string | number)[]): Promise<[string, string[]] | null>;
    brpoplpush(source: RedisClient.KeyLike, destination: RedisClient.KeyLike, timeout: number): Promise<string | null>;
    lindex(key: RedisClient.KeyLike, index: number): Promise<string | null>;
    llen(key: RedisClient.KeyLike): Promise<number>;
    lmove(
    ): Promise<string | null>;
    lpop(key: RedisClient.KeyLike): Promise<string | null>;
    lpop(key: RedisClient.KeyLike, count: number): Promise<string[] | null>;
    lpos(
    ): Promise<number | number[] | null>;
    lmpop(numkeys: number, ...args: (string | number)[]): Promise<[string, string[]] | null>;
    lrange(key: RedisClient.KeyLike, start: number, stop: number): Promise<string[]>;
    lset(key: RedisClient.KeyLike, index: number, element: RedisClient.KeyLike): Promise<string>;
    persist(key: RedisClient.KeyLike): Promise<number>;
    pexpireat(key: RedisClient.KeyLike, millisecondsTimestamp: number): Promise<number>;
    pexpiretime(key: RedisClient.KeyLike): Promise<number>;
    pttl(key: RedisClient.KeyLike): Promise<number>;
    randomkey(): Promise<string | null>;
    rpop(key: RedisClient.KeyLike): Promise<string | null>;
    rpop(key: RedisClient.KeyLike, count: number): Promise<string[]>;
    rpoplpush(source: RedisClient.KeyLike, destination: RedisClient.KeyLike): Promise<string | null>;
    scan(cursor: string | number): Promise<[string, string[]]>;
    scan(cursor: string | number, match: "MATCH", pattern: string): Promise<[string, string[]]>;
    scan(cursor: string | number, count: "COUNT", hint: number): Promise<[string, string[]]>;
    scan(
    ): Promise<[string, string[]]>;
    scan(cursor: string | number, ...options: (string | number)[]): Promise<[string, string[]]>;
    scard(key: RedisClient.KeyLike): Promise<number>;
    sdiff(key: RedisClient.KeyLike, ...keys: RedisClient.KeyLike[]): Promise<string[]>;
    sinter(key: RedisClient.KeyLike, ...keys: RedisClient.KeyLike[]): Promise<string[]>;
    sinterstore(
    ): Promise<number>;
    sintercard(
    ): Promise<number>;
    strlen(key: RedisClient.KeyLike): Promise<number>;
    sunion(key: RedisClient.KeyLike, ...keys: RedisClient.KeyLike[]): Promise<string[]>;
    sunionstore(
    ): Promise<number>;
    type(key: RedisClient.KeyLike): Promise<"none" | "string" | "list" | "set" | "zset" | "hash" | "stream">;
    zcard(key: RedisClient.KeyLike): Promise<number>;
    zcount(key: RedisClient.KeyLike, min: string | number, max: string | number): Promise<number>;
    zlexcount(key: RedisClient.KeyLike, min: string, max: string): Promise<number>;
    zpopmax(key: RedisClient.KeyLike): Promise<[string, number] | []>;
    zpopmax(key: RedisClient.KeyLike, count: number): Promise<Array<[string, number]>>;
    zpopmin(key: RedisClient.KeyLike): Promise<[string, number] | []>;
    zpopmin(key: RedisClient.KeyLike, count: number): Promise<[string, number][]>;
    bzpopmin(...args: (RedisClient.KeyLike | number)[]): Promise<[string, string, number] | null>;
    bzpopmax(...args: (RedisClient.KeyLike | number)[]): Promise<[string, string, number] | null>;
    zrandmember(key: RedisClient.KeyLike): Promise<string | null>;
    zrandmember(key: RedisClient.KeyLike, count: number): Promise<string[] | null>;
    zrandmember(key: RedisClient.KeyLike, count: number, withscores: "WITHSCORES"): Promise<[string, number][] | null>;
    zrange(
    ): Promise<[string, number][]>;
    zrange(
    ): Promise<string[]>;
    zrange(key: RedisClient.KeyLike, start: string, stop: string, bylex: "BYLEX"): Promise<string[]>;
    zrange(
    ): Promise<string[]>;
    zrange(key: RedisClient.KeyLike, start: string | number, stop: string | number): Promise<string[]>;
    zrevrange(key: RedisClient.KeyLike, start: number, stop: number): Promise<string[]>;
    zrevrange(
    ): Promise<[string, number][]>;
    zrevrange(key: RedisClient.KeyLike, start: number, stop: number, ...options: string[]): Promise<string[]>;
    append(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<number>;
    getset(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<string | null>;
    linsert(
    ): Promise<number>;
    lpush(key: RedisClient.KeyLike, value: RedisClient.KeyLike, ...rest: RedisClient.KeyLike[]): Promise<number>;
    lpushx(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<number>;
    lrem(key: RedisClient.KeyLike, count: number, element: RedisClient.KeyLike): Promise<number>;
    ltrim(key: RedisClient.KeyLike, start: number, stop: number): Promise<string>;
    pfadd(key: RedisClient.KeyLike, element: string): Promise<number>;
    rpush(key: RedisClient.KeyLike, value: RedisClient.KeyLike, ...rest: RedisClient.KeyLike[]): Promise<number>;
    rpushx(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<number>;
    setnx(key: RedisClient.KeyLike, value: RedisClient.KeyLike): Promise<number>;
    setex(key: RedisClient.KeyLike, seconds: number, value: RedisClient.KeyLike): Promise<"OK">;
    psetex(key: RedisClient.KeyLike, milliseconds: number, value: RedisClient.KeyLike): Promise<"OK">;
    zscore(key: RedisClient.KeyLike, member: string): Promise<number | null>;
    zincrby(key: RedisClient.KeyLike, increment: number, member: RedisClient.KeyLike): Promise<number>;
    zmscore(
    ): Promise<(number | null)[]>;
    zadd(key: RedisClient.KeyLike, ...args: (string | number)[]): Promise<number>;
    zscan(key: RedisClient.KeyLike, cursor: string | number, ...options: string[]): Promise<[string, string[]]>;
    zrem(key: RedisClient.KeyLike, member: RedisClient.KeyLike, ...members: RedisClient.KeyLike[]): Promise<number>;
    zremrangebylex(key: RedisClient.KeyLike, min: string, max: string): Promise<number>;
    zremrangebyrank(key: RedisClient.KeyLike, start: number, stop: number): Promise<number>;
    zremrangebyscore(key: RedisClient.KeyLike, min: string | number, max: string | number): Promise<number>;
    zrangebylex(key: RedisClient.KeyLike, min: string, max: string): Promise<string[]>;
    zrangebylex(
    ): Promise<string[]>;
    zrangebylex(key: RedisClient.KeyLike, min: string, max: string, ...options: (string | number)[]): Promise<string[]>;
    zrangebyscore(key: RedisClient.KeyLike, min: string | number, max: string | number): Promise<string[]>;
    zrangebyscore(
    ): Promise<[string, number][]>;
    zrangebyscore(
    ): Promise<string[]>;
    zrangebyscore(
    ): Promise<[string, number][]>;
    zrangebyscore(
    ): Promise<[string, number][]>;
    zrangebyscore(
    ): Promise<string[]>;
    zrevrangebyscore(key: RedisClient.KeyLike, max: string | number, min: string | number): Promise<string[]>;
    zrevrangebyscore(
    ): Promise<[string, number][]>;
    zrevrangebyscore(
    ): Promise<string[]>;
    zrevrangebyscore(
    ): Promise<string[]>;
    zrevrangebylex(key: RedisClient.KeyLike, max: string, min: string, ...options: string[]): Promise<string[]>;
    zrangestore(
    ): Promise<number>;
    zrank(key: RedisClient.KeyLike, member: string): Promise<number | null>;
    zrank(key: RedisClient.KeyLike, member: string, withscore: "WITHSCORE"): Promise<[number, number] | null>;
    zrevrank(key: RedisClient.KeyLike, member: string): Promise<number | null>;
    zrevrank(key: RedisClient.KeyLike, member: string, withscore: "WITHSCORE"): Promise<[number, number] | null>;
    mget(...keys: RedisClient.KeyLike[]): Promise<(string | null)[]>;
    mset(...keyValuePairs: RedisClient.KeyLike[]): Promise<"OK">;
    msetnx(...keyValuePairs: RedisClient.KeyLike[]): Promise<number>;
    bitcount(key: RedisClient.KeyLike): Promise<number>;
    getbit(key: RedisClient.KeyLike, offset: number): Promise<number>;
    setbit(key: RedisClient.KeyLike, offset: number, value: 0 | 1): Promise<number>;
    getrange(key: RedisClient.KeyLike, start: number, end: number): Promise<string>;
    substr(key: RedisClient.KeyLike, start: number, end: number): Promise<string>;
    setrange(key: RedisClient.KeyLike, offset: number, value: RedisClient.KeyLike): Promise<number>;
    dump(key: RedisClient.KeyLike): Promise<string | null>;
    expiretime(key: RedisClient.KeyLike): Promise<number>;
    getdel(key: RedisClient.KeyLike): Promise<string | null>;
    getex(key: RedisClient.KeyLike): Promise<string | null>;
    getex(key: RedisClient.KeyLike, ex: "EX", seconds: number): Promise<string | null>;
    getex(key: RedisClient.KeyLike, px: "PX", milliseconds: number): Promise<string | null>;
    getex(key: RedisClient.KeyLike, exat: "EXAT", timestampSeconds: number): Promise<string | null>;
    getex(key: RedisClient.KeyLike, pxat: "PXAT", timestampMilliseconds: number): Promise<string | null>;
    getex(key: RedisClient.KeyLike, persist: "PERSIST"): Promise<string | null>;
    ping(): Promise<"PONG">;
    ping(message: RedisClient.KeyLike): Promise<string>;
    publish(channel: string, message: string): Promise<number>;
    subscribe(channel: string, listener: RedisClient.StringPubSubListener): Promise<number>;
    subscribe(channels: string[], listener: RedisClient.StringPubSubListener): Promise<number>;
    unsubscribe(channel: string): Promise<void>;
    unsubscribe(channel: string, listener: RedisClient.StringPubSubListener): Promise<void>;
    unsubscribe(): Promise<void>;
    unsubscribe(channels: string[]): Promise<void>;
    duplicate(): Promise<RedisClient>;
    copy(source: RedisClient.KeyLike, destination: RedisClient.KeyLike): Promise<number>;
    copy(source: RedisClient.KeyLike, destination: RedisClient.KeyLike, replace: "REPLACE"): Promise<number>;
    unlink(...keys: RedisClient.KeyLike[]): Promise<number>;
    touch(...keys: RedisClient.KeyLike[]): Promise<number>;
    rename(key: RedisClient.KeyLike, newkey: RedisClient.KeyLike): Promise<"OK">;
    renamenx(key: RedisClient.KeyLike, newkey: RedisClient.KeyLike): Promise<number>;
    zdiff(
    ): Promise<[string, number][]>;
    zdiff(numkeys: number, ...keys: RedisClient.KeyLike[]): Promise<string[]>;
    zdiffstore(destination: RedisClient.KeyLike, numkeys: number, ...keys: RedisClient.KeyLike[]): Promise<number>;
    zinter(
    ): Promise<[string, number][]>;
    zinter(numkeys: number, ...args: (string | number)[]): Promise<string[]>;
    zintercard(numkeys: number, ...keys: RedisClient.KeyLike[]): Promise<number>;
    zintercard(numkeys: number, ...args: (RedisClient.KeyLike | "LIMIT" | number)[]): Promise<number>;
    zinterstore(destination: RedisClient.KeyLike, numkeys: number, ...args: (string | number)[]): Promise<number>;
    zunion(
    ): Promise<[string, number][]>;
    zunion(numkeys: number, ...args: (string | number)[]): Promise<string[]>;
    zunionstore(destination: RedisClient.KeyLike, numkeys: number, ...args: (string | number)[]): Promise<number>;
    zmpop(numkeys: number, ...args: (string | number)[]): Promise<[string, [string, number][]] | null>;
    bzmpop(
    ): Promise<[string, [string, number][]] | null>;
    bitop(operation: "NOT" | "not", destkey: RedisClient.KeyLike, key: RedisClient.KeyLike): Promise<number>;
    bitop(
    ): Promise<number>;
    bitpos(key: RedisClient.KeyLike, bit: 0 | 1, ...options: (string | number)[]): Promise<number>;
    bitfield(key: RedisClient.KeyLike, ...operations: (string | number)[]): Promise<(number | null)[]>;
    pfcount(key: RedisClient.KeyLike, ...moreKeys: RedisClient.KeyLike[]): Promise<number>;
    pfmerge(destkey: RedisClient.KeyLike, ...sourcekeys: RedisClient.KeyLike[]): Promise<"OK">;
    geoadd(key: RedisClient.KeyLike, ...args: (string | number)[]): Promise<number>;
    geodist(key: RedisClient.KeyLike, member1: string, member2: string): Promise<string | null>;
    geodist(
    ): Promise<string | null>;
    geohash(key: RedisClient.KeyLike, ...members: string[]): Promise<(string | null)[]>;
    geopos(key: RedisClient.KeyLike, ...members: string[]): Promise<([number, number] | null)[]>;
    geosearch(key: RedisClient.KeyLike, ...args: (string | number)[]): Promise<unknown[]>;
    geosearchstore(
    ): Promise<number>;
    eval(script: string, numkeys: number, ...keysAndArgs: (string | number)[]): Promise<any>;
    evalsha(sha1: string, numkeys: number, ...keysAndArgs: (string | number)[]): Promise<any>;
    script(...args: string[]): Promise<any>;
    fcall(name: string, numkeys: number, ...keysAndArgs: (string | number)[]): Promise<any>;
    function(...args: RedisClient.KeyLike[]): Promise<any>;
    dbsize(): Promise<number>;
    flushdb(): Promise<"OK">;
    flushdb(mode: "ASYNC" | "SYNC" | "async" | "sync"): Promise<"OK">;
    flushall(): Promise<"OK">;
    flushall(mode: "ASYNC" | "SYNC" | "async" | "sync"): Promise<"OK">;
    info(...sections: string[]): Promise<string>;
    time(): Promise<[string, string]>;
    echo(message: string): Promise<string>;
    lastsave(): Promise<number>;
    client(...args: (string | number)[]): Promise<any>;
    config(...args: (string | number)[]): Promise<any>;
    debug(...args: (string | number)[]): Promise<any>;
    command(...args: (string | number)[]): Promise<any>;
    object(subcommand: string, ...args: RedisClient.KeyLike[]): Promise<any>;
    sort(key: RedisClient.KeyLike, ...args: (string | number)[]): Promise<(string | null)[] | number>;
    wait(numreplicas: number, timeout: number): Promise<number>;
    lcs(key1: RedisClient.KeyLike, key2: RedisClient.KeyLike, ...options: (string | number)[]): Promise<any>;
    xadd(key: RedisClient.KeyLike, ...args: (string | number)[]): Promise<string | null>;
    xlen(key: RedisClient.KeyLike): Promise<number>;
    xrange(
    ): Promise<[string, string[]][]>;
    xrevrange(
    ): Promise<[string, string[]][]>;
    xread(...args: (string | number)[]): Promise<any>;
    xreadgroup(...args: (string | number)[]): Promise<any>;
    xdel(key: RedisClient.KeyLike, id: string, ...moreIds: string[]): Promise<number>;
    xtrim(
    ): Promise<number>;
    xack(key: RedisClient.KeyLike, group: string, id: string, ...moreIds: string[]): Promise<number>;
    xclaim(
    ): Promise<any>;
    xautoclaim(
    ): Promise<any>;
    xpending(key: RedisClient.KeyLike, group: string, ...args: (string | number)[]): Promise<any>;
    xinfo(subcommand: string, ...args: (string | number)[]): Promise<any>;
    xgroup(subcommand: string, ...args: (string | number)[]): Promise<any>;
    xsetid(key: RedisClient.KeyLike, lastId: string, ...options: (string | number)[]): Promise<"OK">;
  }
  export const redis: RedisClient;
}
```

## `s3.d.ts` (1489 lines -> 113 lines, 90 nested lines elided)

```ts
declare module "bun" {
  interface FileSink {
    write(chunk: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer): number | Promise<number>;
    flush(): number | Promise<number>;
    end(error?: Error): number | Promise<number>;
    start(options?: {
    }): void;
    ref(): void;
    unref(): void;
  }
  interface NetworkSink extends FileSink {
    write(chunk: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer): number | Promise<number>;
    flush(): number | Promise<number>;
    end(error?: Error): number | Promise<number>;
    stat(): Promise<import("node:fs").Stats>;
  }
  interface S3Options extends BlobPropertyBag {
    acl?:
    bucket?: string;
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    sessionToken?: string;
    endpoint?: string;
    virtualHostedStyle?: boolean;
    partSize?: number;
    queueSize?: number;
    retry?: number;
    type?: string;
    contentDisposition?: string | undefined;
    contentEncoding?: string | undefined;
    storageClass?:
    requestPayer?: boolean;
    highWaterMark?: number;
  }
  interface S3FilePresignOptions extends S3Options {
    expiresIn?: number;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "HEAD";
  }
  interface S3Stats {
    size: number;
    lastModified: Date;
    etag: string;
    type: string;
  }
  interface S3File extends Blob {
    slice(begin?: number, end?: number, contentType?: string): S3File;
    slice(begin?: number, contentType?: string): S3File;
    slice(contentType?: string): S3File;
    writer(options?: S3Options): NetworkSink;
    readonly readable: ReadableStream<Uint8Array<ArrayBuffer>>;
    stream(): ReadableStream<Uint8Array<ArrayBuffer>>;
    readonly name?: string;
    readonly bucket?: string;
    exists(): Promise<boolean>;
    write(
    ): Promise<number>;
    presign(options?: S3FilePresignOptions): string;
    delete(): Promise<void>;
    unlink: S3File["delete"];
    stat(): Promise<S3Stats>;
  }
  interface S3ListObjectsOptions {
    prefix?: string;
    continuationToken?: string;
    delimiter?: string;
    maxKeys?: number;
    startAfter?: string;
    encodingType?: "url";
    fetchOwner?: boolean;
  }
  interface S3ListObjectsResponse {
    commonPrefixes?: { prefix: string }[];
    contents?: {
    }[];
    continuationToken?: string;
    delimiter?: string;
    encodingType?: "url";
    isTruncated?: boolean;
    keyCount?: number;
    maxKeys?: number;
    name?: string;
    nextContinuationToken?: string;
    prefix?: string;
    startAfter?: string;
  }
  class S3Client {
    constructor(options?: S3Options);
    file(path: string, options?: S3Options): S3File;
    static file(path: string, options?: S3Options): S3File;
    write(
    ): Promise<number>;
    static write(
    ): Promise<number>;
    presign(path: string, options?: S3FilePresignOptions): string;
    static presign(path: string, options?: S3FilePresignOptions): string;
    unlink(path: string, options?: S3Options): Promise<void>;
    static unlink(path: string, options?: S3Options): Promise<void>;
    delete(path: string, options?: S3Options): Promise<void>;
    static delete(path: string, options?: S3Options): Promise<void>;
    size(path: string, options?: S3Options): Promise<number>;
    static size(path: string, options?: S3Options): Promise<number>;
    exists(path: string, options?: S3Options): Promise<boolean>;
    static exists(path: string, options?: S3Options): Promise<boolean>;
    stat(path: string, options?: S3Options): Promise<S3Stats>;
    static stat(path: string, options?: S3Options): Promise<S3Stats>;
    list(
    ): Promise<S3ListObjectsResponse>;
    static list(
    ): Promise<S3ListObjectsResponse>;
  }
  var s3: S3Client;
}
```

## `security.d.ts` (113 lines -> 10 lines, 10 nested lines elided)

```ts
declare module "bun" {
  export namespace Security {
    export interface Package {
    }
    export interface Advisory {
    }
    export interface Scanner {
    }
  }
}
```

## `serve.d.ts` (1505 lines -> 105 lines, 91 nested lines elided)

```ts
declare module "bun" {
  type ServerWebSocketSendStatus = number;
  type WebSocketReadyState = 0 | 1 | 2 | 3;
  interface ServerWebSocket<T = undefined> {
    send(data: string | BufferSource | Blob, compress?: boolean): ServerWebSocketSendStatus;
    sendText(data: string, compress?: boolean): ServerWebSocketSendStatus;
    sendBinary(data: BufferSource | Blob, compress?: boolean): ServerWebSocketSendStatus;
    close(code?: number, reason?: string): void;
    terminate(): void;
    ping(data?: string | BufferSource | Blob): ServerWebSocketSendStatus;
    pong(data?: string | BufferSource | Blob): ServerWebSocketSendStatus;
    publish(topic: string, data: string | BufferSource | Blob, compress?: boolean): ServerWebSocketSendStatus;
    publishText(topic: string, data: string, compress?: boolean): ServerWebSocketSendStatus;
    publishBinary(topic: string, data: BufferSource | Blob, compress?: boolean): ServerWebSocketSendStatus;
    subscribe(topic: string): boolean;
    unsubscribe(topic: string): boolean;
    isSubscribed(topic: string): boolean;
    readonly subscriptions: string[];
    cork<R = unknown>(callback: (ws: ServerWebSocket<T>) => R): R;
    readonly remoteAddress: string;
    readonly readyState: WebSocketReadyState;
    binaryType?: "nodebuffer" | "arraybuffer" | "uint8array" | "blob";
    data: T;
    getBufferedAmount(): number;
    pause(): void;
    resume(): void;
    readonly isPaused: boolean;
  }
  type WebSocketCompressor =
    "disable" | "shared" | "dedicated" | "3KB" | "4KB" | "8KB" | "16KB" | "32KB" | "64KB" | "128KB" | "256KB";
  interface WebSocketHandler<T> {
    data?: T;
    message?(ws: ServerWebSocket<T>, message: string | Buffer<ArrayBuffer>): void | Promise<void>;
    open?(ws: ServerWebSocket<T>): void | Promise<void>;
    drain?(ws: ServerWebSocket<T>): void | Promise<void>;
    close?(ws: ServerWebSocket<T>, code: number, reason: string): void | Promise<void>;
    ping?(ws: ServerWebSocket<T>, data: Buffer): void | Promise<void>;
    pong?(ws: ServerWebSocket<T>, data: Buffer): void | Promise<void>;
    error?(error: Error, ws: ServerWebSocket<T>): void | Promise<void>;
    maxPayloadLength?: number;
    backpressureLimit?: number;
    closeOnBackpressureLimit?: boolean;
    idleTimeout?: number;
    publishToSelf?: boolean;
    sendPings?: boolean;
    perMessageDeflate?:
  }
  namespace Serve {
    type ExtractRouteParams<T> = string extends T
    type Development =
    type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
    type Handler<Req extends Request, S, Res> = (request: Req, server: S) => MaybePromise<Res>;
    interface DirectoryRouteOptions {
    }
    type BaseRouteValue = Response | false | HTMLBundle | BunFile | DirectoryRouteOptions;
    type Routes<WebSocketData, R extends string> = {
    };
    type RoutesWithUpgrade<WebSocketData, R extends string> = {
    };
    type FetchOrRoutes<WebSocketData, R extends string> =
    type FetchOrRoutesWithWebSocket<WebSocketData, R extends string> = {
    } & (
    );
    interface BaseServeOptions<WebSocketData> {
    }
    interface HostnamePortServeOptions<WebSocketData> extends BaseServeOptions<WebSocketData> {
    }
    interface UnixServeOptions<WebSocketData> extends BaseServeOptions<WebSocketData> {
    }
    type Options<WebSocketData, R extends string = string> = Bun.__internal.XOR<
    > &
  }
  interface BunRequest<T extends string = string> extends Request {
    readonly params: {
    } & {};
    readonly cookies: CookieMap;
    clone(): BunRequest<T>;
  }
  interface Server<WebSocketData> extends Disposable {
    stop(closeActiveConnections?: boolean): Promise<void>;
    closeIdleConnections(): number;
    reload<R extends string>(options: Serve.Options<WebSocketData, R>): Server<WebSocketData>;
    fetch(request: Request | string): Response | Promise<Response>;
    upgrade(
    ): boolean;
    publish(
    ): ServerWebSocketSendStatus;
    subscriberCount(topic: string): number;
    requestIP(request: Request): SocketAddress | null;
    timeout(request: Request, seconds: number): void;
    ref(): void;
    unref(): void;
    readonly pendingRequests: number;
    readonly pendingWebSockets: number;
    readonly url: URL;
    readonly port: number | undefined;
    readonly hostname: string | undefined;
    readonly protocol: "http" | "https" | null;
    readonly development: boolean;
    readonly id: string;
  }
  function serve<WebSocketData = undefined, R extends string = never>(
    options: Serve.Options<WebSocketData, R>,
  ): Server<WebSocketData>;
}
```

## `shell.d.ts` (381 lines -> 28 lines, 27 nested lines elided)

```ts
declare module "bun" {
  type ShellExpression =
    | { toString(): string }
    | Array<ShellExpression>
    | string
    | { raw: string }
    | Subprocess<SpawnOptions.Writable, SpawnOptions.Readable, SpawnOptions.Readable>
    | SpawnOptions.Readable
    | SpawnOptions.Writable
    | ReadableStream;
  function $(strings: TemplateStringsArray, ...expressions: ShellExpression[]): $.ShellPromise;
  type $ = typeof $;
  namespace $ {
    function braces(pattern: string): string[];
    function escape(input: string): string;
    function env(newEnv?: Record<string, string | undefined> | NodeJS.Dict<string> | undefined): $;
    function cwd(newCwd?: string): $;
    function nothrow(): $;
    function throws(shouldThrow: boolean): $;
    class ShellPromise extends Promise<ShellOutput> {
    }
    class ShellError extends Error implements ShellOutput {
    }
    interface ShellOutput {
    }
    const Shell: new () => $;
  }
}
```

## `sql.d.ts` (1665 lines -> 112 lines, 153 nested lines elided)

```ts
import type * as BunSQLite from "bun:sqlite";
declare module "bun" {
  interface ReservedSQL extends SQL, Disposable {
    release(): Promise<void>;
    close(options?: { timeout?: number }): Promise<void>;
  }
  type ArrayType = | "BOOLEAN" | "BYTEA" | "CHAR" | "NAME" | "TEXT" | ... (+40 literals);
    | (string & {});
  interface SQLArrayParameter {
    serializedValues: string;
    arrayType: ArrayType | undefined;
  }
  interface SQLJSONParameter {
    value: unknown;
    toJSON(key: string): unknown;
  }
  interface TransactionSQL extends SQL {
    savepoint<T>(name: string, fn: SQL.SavepointContextCallback<T>): Promise<SQL.ContextCallbackResult<T>>;
    savepoint<T>(fn: SQL.SavepointContextCallback<T>): Promise<SQL.ContextCallbackResult<T>>;
    close(options?: { timeout?: number }): Promise<void>;
    reserve(options?: { signal?: AbortSignal }): Promise<ReservedSQL>;
  }
  namespace SQL {
    class SQLError extends Error {
    }
    class PostgresError extends SQLError {
    }
    class MySQLError extends SQLError {
    }
    class SQLiteError extends SQLError {
    }
    type AwaitPromisesArray<T extends Array<PromiseLike<any>>> = {
    };
    type ContextCallbackResult<T> = T extends Array<PromiseLike<any>> ? AwaitPromisesArray<T> : Awaited<T>;
    type ContextCallback<T, SQL> = (sql: SQL) => Bun.MaybePromise<T>;
    interface TLSOptions extends Bun.TLSOptions {
    }
    interface ColumnTransform {
    }
    interface Transform {
    }
    interface NameTransform {
    }
    const camel: { readonly column: Required<ColumnTransform> };
    const pascal: { readonly column: Required<ColumnTransform> };
    const kebab: { readonly column: Required<ColumnTransform> };
    const toCamel: NameTransform;
    const toPascal: NameTransform;
    const toKebab: NameTransform;
    const fromCamel: NameTransform;
    const fromPascal: NameTransform;
    const fromKebab: NameTransform;
    interface SQLiteOptions extends BunSQLite.DatabaseOptions {
    }
    interface PostgresOrMySQLOptions {
    }
    type Options = SQLiteOptions | PostgresOrMySQLOptions;
    interface ListenSubscription extends AsyncDisposable {
    }
    interface ResultColumn {
    }
    interface ResultStatement {
    }
    interface ResultMetadata {
    }
    interface Query<T> extends Promise<T & ResultMetadata> {
    }
    type TransactionContextCallback<T> = ContextCallback<T, TransactionSQL>;
    type SavepointContextCallback<T> = ContextCallback<T, SavepointSQL>;
    interface Helper<T> {
    }
  }
  interface SQL extends AsyncDisposable {
    <T = any>(strings: TemplateStringsArray, ...values: unknown[]): SQL.Query<T>;
    <T = any>(string: string): SQL.Query<T>;
    <T extends { [Key in PropertyKey]: unknown }>(obj: T | T[] | readonly T[]): SQL.Helper<T>; // Contributor note: This is the same as the signature below with the exception of the columns and the Pick<T, Keys>
    <T extends { [Key in PropertyKey]: unknown }, Keys extends keyof T = keyof T>(
    ): SQL.Helper<Pick<T, Keys>>; // Contributor note: This is the same as the signature above with the exception of this signature tracking keys
    <T>(value: T & {}): SQL.Helper<T>;
  }
  class SQL {
    constructor(connectionString: string | URL);
    constructor(
    );
    constructor(options?: SQL.Options);
    options: Bun.__internal.DistributedMerge<SQL.Options>;
    commitDistributed(name: string): Promise<void>;
    rollbackDistributed(name: string): Promise<void>;
    connect(): Promise<SQL>;
    close(options?: { timeout?: number }): Promise<void>;
    end(options?: { timeout?: number }): Promise<void>;
    flush(): void;
    reserve(options?: { signal?: AbortSignal }): Promise<ReservedSQL>;
    array(values: any[] | NodeJS.TypedArray, typeNameOrTypeID?: number | ArrayType): SQLArrayParameter;
    json(value: unknown): SQLJSONParameter | string | undefined;
    begin<const T>(fn: SQL.TransactionContextCallback<T>): Promise<SQL.ContextCallbackResult<T>>;
    begin<const T>(options: string, fn: SQL.TransactionContextCallback<T>): Promise<SQL.ContextCallbackResult<T>>;
    transaction<const T>(fn: SQL.TransactionContextCallback<T>): Promise<SQL.ContextCallbackResult<T>>;
    transaction<const T>(options: string, fn: SQL.TransactionContextCallback<T>): Promise<SQL.ContextCallbackResult<T>>;
    beginDistributed<const T>(
    ): Promise<SQL.ContextCallbackResult<T>>;
    distributed<const T>(name: string, fn: SQL.TransactionContextCallback<T>): Promise<SQL.ContextCallbackResult<T>>;
    unsafe<T = any>(string: string, values?: any[] | Record<string, any>): SQL.Query<T>;
    file<T = any>(filename: string, values?: any[] | Record<string, any>): SQL.Query<T>;
    listen(
    ): Promise<SQL.ListenSubscription>;
    notify(channel: string, payload?: string): Promise<void>;
  }
  const sql: SQL;
  const postgres: SQL;
  interface SavepointSQL extends TransactionSQL {}
}
```

## `sqlite.d.ts` (1643 lines -> 181 lines, 11 nested lines elided)

```ts
declare module "bun:sqlite" {
  export interface DatabaseOptions {
    readonly?: boolean | undefined;
    create?: boolean | undefined;
    readwrite?: boolean | undefined;
    safeIntegers?: boolean | undefined;
    strict?: boolean | undefined;
  }
  export class Database implements Disposable {
    constructor(filename?: string, options?: number | DatabaseOptions);
    static open(filename: string, options?: number | DatabaseOptions): Database;
    static MAX_QUERY_CACHE_SIZE: number;
    clearQueryCache(): void;
    run<ParamsType extends SQLQueryBindings[]>(sql: string, ...bindings: ParamsType[]): Changes;
    exec<ParamsType extends SQLQueryBindings[]>(sql: string, ...bindings: ParamsType[]): Changes;
    query<ReturnType, ParamsType extends SQLQueryBindings | SQLQueryBindings[]>(
    ): Statement<ReturnType, ParamsType extends any[] ? ParamsType : [ParamsType]>;
    prepare<ReturnType, ParamsType extends SQLQueryBindings | SQLQueryBindings[]>(
    ): Statement<ReturnType, ParamsType extends any[] ? ParamsType : [ParamsType]>;
    get inTransaction(): boolean;
    close(
    ): void;
    readonly filename: string;
    readonly handle: number;
    loadExtension(extension: string, entryPoint?: string): void;
    static setCustomSQLite(path: string): boolean;
    [Symbol.dispose](): void;
    transaction<A extends any[], T>(
    ): {
    };
    function(name: string, fn: (...args: any[]) => SQLFunctionResult): this;
    function(name: string, options: FunctionOptions, fn: (...args: any[]) => SQLFunctionResult): this;
    aggregate<T = any>(name: string, options: AggregateOptions<T>): this;
    get onInsert(): UpdateHook | null;
    set onInsert(hook: UpdateHook | null | undefined);
    get onUpdate(): UpdateHook | null;
    set onUpdate(hook: UpdateHook | null | undefined);
    get onDelete(): UpdateHook | null;
    set onDelete(hook: UpdateHook | null | undefined);
    serialize(name?: string): Buffer;
    static deserialize(serialized: NodeJS.TypedArray | ArrayBufferLike, isReadOnly?: boolean): Database;
    static deserialize(
    ): Database;
    fileControl(op: number, arg?: ArrayBufferView | number | null): number;
    fileControl(zDbName: string, op: number, arg?: ArrayBufferView | number | null): number;
  }
  export class Statement<ReturnType = unknown, ParamsType extends SQLQueryBindings[] = any[]> implements Disposable {
    constructor(nativeHandle: any);
    all(...params: ParamsType): ReturnType[];
    get(...params: ParamsType): ReturnType | null;
    iterate(...params: ParamsType): IterableIterator<ReturnType>;
    [Symbol.iterator](): IterableIterator<ReturnType>;
    run(...params: ParamsType): Changes;
    values(...params: ParamsType): Array<Array<string | bigint | number | Uint8Array | null>>;
    raw(...params: ParamsType): Array<Array<Uint8Array | null>>;
    readonly columnNames: string[];
    readonly paramsCount: number;
    readonly reader: boolean;
    readonly readonly: boolean;
    readonly isFinalized: boolean;
    readonly columnTypes: Array<"INTEGER" | "FLOAT" | "TEXT" | "BLOB" | "NULL" | null>;
    readonly declaredTypes: Array<string | null>;
    safeIntegers(enabled: boolean): this;
    safeIntegers(): boolean;
    finalize(): void;
    [Symbol.dispose](): void;
    toString(): string;
    toJSON(): { sql: string; isFinalized: boolean; paramsCount: number; columnNames: string[] };
    as<T = unknown>(Class: new (...args: any[]) => T): Statement<T, ParamsType>;
    readonly native: any;
  }
  export namespace constants {
    const SQLITE_OPEN_READONLY: number;
    const SQLITE_OPEN_READWRITE: number;
    const SQLITE_OPEN_CREATE: number;
    const SQLITE_OPEN_DELETEONCLOSE: number;
    const SQLITE_OPEN_EXCLUSIVE: number;
    const SQLITE_OPEN_AUTOPROXY: number;
    const SQLITE_OPEN_URI: number;
    const SQLITE_OPEN_MEMORY: number;
    const SQLITE_OPEN_MAIN_DB: number;
    const SQLITE_OPEN_TEMP_DB: number;
    const SQLITE_OPEN_TRANSIENT_DB: number;
    const SQLITE_OPEN_MAIN_JOURNAL: number;
    const SQLITE_OPEN_TEMP_JOURNAL: number;
    const SQLITE_OPEN_SUBJOURNAL: number;
    const SQLITE_OPEN_SUPER_JOURNAL: number;
    const SQLITE_OPEN_NOMUTEX: number;
    const SQLITE_OPEN_FULLMUTEX: number;
    const SQLITE_OPEN_SHAREDCACHE: number;
    const SQLITE_OPEN_PRIVATECACHE: number;
    const SQLITE_OPEN_WAL: number;
    const SQLITE_OPEN_NOFOLLOW: number;
    const SQLITE_OPEN_EXRESCODE: number;
    const SQLITE_PREPARE_PERSISTENT: number;
    const SQLITE_PREPARE_NORMALIZE: number;
    const SQLITE_PREPARE_NO_VTAB: number;
    const SQLITE_FCNTL_LOCKSTATE: number;
    const SQLITE_FCNTL_GET_LOCKPROXYFILE: number;
    const SQLITE_FCNTL_SET_LOCKPROXYFILE: number;
    const SQLITE_FCNTL_LAST_ERRNO: number;
    const SQLITE_FCNTL_SIZE_HINT: number;
    const SQLITE_FCNTL_CHUNK_SIZE: number;
    const SQLITE_FCNTL_FILE_POINTER: number;
    const SQLITE_FCNTL_SYNC_OMITTED: number;
    const SQLITE_FCNTL_WIN32_AV_RETRY: number;
    const SQLITE_FCNTL_PERSIST_WAL: number;
    const SQLITE_FCNTL_OVERWRITE: number;
    const SQLITE_FCNTL_VFSNAME: number;
    const SQLITE_FCNTL_POWERSAFE_OVERWRITE: number;
    const SQLITE_FCNTL_PRAGMA: number;
    const SQLITE_FCNTL_BUSYHANDLER: number;
    const SQLITE_FCNTL_TEMPFILENAME: number;
    const SQLITE_FCNTL_MMAP_SIZE: number;
    const SQLITE_FCNTL_TRACE: number;
    const SQLITE_FCNTL_HAS_MOVED: number;
    const SQLITE_FCNTL_SYNC: number;
    const SQLITE_FCNTL_COMMIT_PHASETWO: number;
    const SQLITE_FCNTL_WIN32_SET_HANDLE: number;
    const SQLITE_FCNTL_WAL_BLOCK: number;
    const SQLITE_FCNTL_ZIPVFS: number;
    const SQLITE_FCNTL_RBU: number;
    const SQLITE_FCNTL_VFS_POINTER: number;
    const SQLITE_FCNTL_JOURNAL_POINTER: number;
    const SQLITE_FCNTL_WIN32_GET_HANDLE: number;
    const SQLITE_FCNTL_PDB: number;
    const SQLITE_FCNTL_BEGIN_ATOMIC_WRITE: number;
    const SQLITE_FCNTL_COMMIT_ATOMIC_WRITE: number;
    const SQLITE_FCNTL_ROLLBACK_ATOMIC_WRITE: number;
    const SQLITE_FCNTL_LOCK_TIMEOUT: number;
    const SQLITE_FCNTL_DATA_VERSION: number;
    const SQLITE_FCNTL_SIZE_LIMIT: number;
    const SQLITE_FCNTL_CKPT_DONE: number;
    const SQLITE_FCNTL_RESERVE_BYTES: number;
    const SQLITE_FCNTL_CKPT_START: number;
    const SQLITE_FCNTL_EXTERNAL_READER: number;
    const SQLITE_FCNTL_CKSM_FILE: number;
    const SQLITE_FCNTL_RESET_CACHE: number;
  }
  export type SQLQueryBindings =
    | string
    | bigint
    | NodeJS.TypedArray
    | ArrayBufferLike
    | number
    | boolean
    | null
    | Record<string, string | bigint | NodeJS.TypedArray | ArrayBufferLike | number | boolean | null>;
  export type SQLFunctionResult =
    string | bigint | NodeJS.TypedArray | ArrayBufferLike | number | boolean | null | undefined | void;
  export interface FunctionOptions {
    varargs?: boolean | undefined;
    deterministic?: boolean | undefined;
    directOnly?: boolean | undefined;
    safeIntegers?: boolean | undefined;
  }
  export interface AggregateOptions<T = any> extends FunctionOptions {
    start?: T | (() => T) | undefined;
    step: (accumulator: T, ...args: any[]) => T | void;
    inverse?: ((accumulator: T, ...args: any[]) => T | void) | null | undefined;
    result?: ((accumulator: T) => SQLFunctionResult) | null | undefined;
  }
  export type UpdateHook = (
    this: Database,
    database: Database,
    tableName: string,
    rowid: number | bigint,
    schemaName: string,
  ) => void;
  export default Database;
  export class SQLiteError extends Error {
    readonly name: "SQLiteError";
    errno: number;
    code?: string;
    readonly byteOffset: number;
  }
  export interface Changes {
    changes: number;
    lastInsertRowid: number | bigint;
  }
}
```

## `test-globals.d.ts` (26 lines -> 17 lines)

```ts
declare var test: typeof import("bun:test").test;
declare var it: typeof import("bun:test").it;
declare var describe: typeof import("bun:test").describe;
declare var expect: typeof import("bun:test").expect;
declare var expectTypeOf: typeof import("bun:test").expectTypeOf;
declare var beforeAll: typeof import("bun:test").beforeAll;
declare var beforeEach: typeof import("bun:test").beforeEach;
declare var afterEach: typeof import("bun:test").afterEach;
declare var afterAll: typeof import("bun:test").afterAll;
declare var jest: typeof import("bun:test").jest;
declare var vi: typeof import("bun:test").vi;
declare var xit: typeof import("bun:test").xit;
declare var xtest: typeof import("bun:test").xtest;
declare var xdescribe: typeof import("bun:test").xdescribe;
declare var onTestFinished: typeof import("bun:test").onTestFinished;
declare var aroundEach: typeof import("bun:test").aroundEach;
declare var aroundAll: typeof import("bun:test").aroundAll;
```

## `test.d.ts` (3577 lines -> 632 lines, 241 nested lines elided)

```ts
declare module "bun:test" {
  export type Mock<T extends (...args: any[]) => any> = JestMock.Mock<T>;
  export type Mocked<T> = T extends new (...args: infer Args) => infer Instance
    ? Mock<(...args: Args) => Mocked<Instance>> & { prototype: Mocked<Instance> } & {
    : T extends (...args: any[]) => any
  export type ModuleMockFactory<T = any> = (importOriginal: <M = T>() => Promise<M>) => any;
  export interface ModuleMockOptions {
    spy?: boolean | undefined;
  }
  export const mock: {
    <T extends (...args: any[]) => any>(Function?: T): Mock<T>;
    <Args extends any[], Instance>(Class: new (...args: Args) => Instance): Mock<(...args: Args) => Instance>;
    <T extends (...args: any[]) => any>(Function?: T): Mock<T>;
    module(id: string, factory: ModuleMockFactory): void | Promise<void>;
    restore(): void;
    clearAllMocks(): void;
  };
  export function setSystemTime(now?: Date | number | string): void;
  export type FakeableAPI = | "setTimeout" | "clearTimeout" | "setInterval" | "clearInterval" | "setImmediate" | ... (+12 literals);
  export interface FakeTimersOptions {
    now?: number | Date | undefined;
    toFake?: FakeableAPI[] | undefined;
    doNotFake?: FakeableAPI[] | undefined;
    toNotFake?: FakeableAPI[] | undefined;
    shouldAdvanceTime?: boolean | undefined;
    advanceTimeDelta?: number | undefined;
    advanceTimers?: boolean | number | undefined;
    loopLimit?: number | undefined;
    timerLimit?: number | undefined;
  }
  export namespace jest {
    function restoreAllMocks(): typeof jest;
    function clearAllMocks(): typeof jest;
    function resetAllMocks(): typeof jest;
    function fn<T extends (...args: any[]) => any>(func?: T): Mock<T>;
    function fn<Args extends any[], Instance>(func: new (...args: Args) => Instance): Mock<(...args: Args) => Instance>;
    function fn<T extends (...args: any[]) => any>(func?: T): Mock<T>;
    function isMockFunction(fn: unknown): fn is Mock<(...args: any[]) => any>;
    function mocked<T>(item: T, options?: unknown): Mocked<T>;
    function mock(id: string, factory?: ModuleMockFactory): typeof jest;
    function doMock(id: string, factory?: ModuleMockFactory): typeof jest;
    function unmock(id: string): typeof jest;
    function dontMock(id: string): typeof jest;
    function requireActual<T = any>(id: string): T;
    function requireMock<T = any>(id: string): T;
    function createMockFromModule<T = any>(id: string): Mocked<T>;
    function resetModules(): typeof jest;
    function setSystemTime(now?: number | Date | string): void;
    function setTimeout(milliseconds: number): void;
    function useFakeTimers(options?: FakeTimersOptions | "modern" | "legacy"): typeof jest;
    function useRealTimers(): typeof jest;
    function advanceTimersByTime(milliseconds: number): typeof jest;
    function advanceTimersByTimeAsync(milliseconds: number): Promise<void>;
    function advanceTimersToNextTimer(steps?: number): typeof jest;
    function advanceTimersToNextTimerAsync(steps?: number): Promise<void>;
    function advanceTimersToNextFrame(): typeof jest;
    function runAllTimers(): typeof jest;
    function runAllTimersAsync(): Promise<void>;
    function runOnlyPendingTimers(): typeof jest;
    function runOnlyPendingTimersAsync(): Promise<void>;
    function runAllTicks(): typeof jest;
    function runAllImmediates(): typeof jest;
    function setTimerTickMode(
    ): typeof jest;
    function getTimerCount(): number;
    function clearAllTimers(): void;
    function isFakeTimers(): boolean;
    function getRealSystemTime(): number;
    function spyOn<T extends object, K extends keyof T>(obj: T, property: K, accessType: "get"): Mock<() => T[K]>;
    function spyOn<T extends object, K extends keyof T>(
    ): Mock<(value: T[K]) => void>;
    function spyOn<T extends object, K extends keyof T>(
    ): Mock<Extract<T[K], (...args: any[]) => any>>;
    type Mock<T extends (...args: any[]) => any = (...args: any[]) => any> = JestMock.Mock<T>;
    type Replaced<T> = JestMock.Replaced<T>;
    type Spied<T extends JestMock.ClassLike | ((...args: any[]) => any)> = JestMock.Spied<T>;
    type SpiedClass<T extends JestMock.ClassLike> = JestMock.SpiedClass<T>;
    type SpiedFunction<T extends (...args: any[]) => any> = JestMock.SpiedFunction<T>;
    type SpiedGetter<T> = JestMock.SpiedGetter<T>;
    type SpiedSetter<T> = JestMock.SpiedSetter<T>;
  }
  export function spyOn<T extends object, K extends keyof T>(obj: T, property: K, accessType: "get"): Mock<() => T[K]>;
  export function spyOn<T extends object, K extends keyof T>(
    obj: T,
    property: K,
    accessType: "set",
  ): Mock<(value: T[K]) => void>;
  export function spyOn<T extends object, K extends keyof T>(
    obj: T,
    methodOrPropertyValue: K,
  ): Mock<Extract<T[K], (...args: any[]) => any>>;
  export const vi: {
    fn: typeof jest.fn;
    spyOn: typeof spyOn;
    isMockFunction: typeof jest.isMockFunction;
    mocked: typeof jest.mocked;
    mockObject<T>(value: T, options?: { spy?: boolean | undefined }): Mocked<T>;
    mock<T>(module: Promise<T>, factory?: ModuleMockFactory<T> | ModuleMockOptions): void | Promise<void>;
    mock(id: string, factory?: ModuleMockFactory | ModuleMockOptions): void | Promise<void>;
    doMock(id: string, factory?: ModuleMockFactory | ModuleMockOptions): Disposable | (Disposable & Promise<void>);
    doMock<T>(
    ): Disposable | (Disposable & Promise<void>);
    unmock(id: string | Promise<unknown>): void;
    doUnmock(id: string | Promise<unknown>): void;
    importActual<T = any>(id: string): Promise<T>;
    importMock<T = any>(id: string): Promise<Mocked<T>>;
    resetModules(): typeof vi;
    hoisted<T>(factory: () => T): T;
    restoreAllMocks(): typeof vi;
    clearAllMocks(): typeof vi;
    resetAllMocks(): typeof vi;
    useFakeTimers(options?: FakeTimersOptions | "modern" | "legacy"): typeof vi;
    useRealTimers(): typeof vi;
    advanceTimersByTime(milliseconds: number): typeof vi;
    advanceTimersByTimeAsync(milliseconds: number): Promise<typeof vi>;
    advanceTimersToNextTimer(steps?: number): typeof vi;
    advanceTimersToNextTimerAsync(steps?: number): Promise<typeof vi>;
    advanceTimersToNextFrame(): typeof vi;
    runAllTimers(): typeof vi;
    runAllTimersAsync(): Promise<typeof vi>;
    runOnlyPendingTimers(): typeof vi;
    runOnlyPendingTimersAsync(): Promise<typeof vi>;
    runAllTicks(): typeof vi;
    setTimerTickMode(mode: "manual" | "nextTimerAsync"): typeof vi;
    setTimerTickMode(mode: "interval", interval?: number): typeof vi;
    getTimerCount(): number;
    clearAllTimers(): typeof vi;
    isFakeTimers(): boolean;
    setSystemTime(now?: number | Date | string): typeof vi;
    getMockedSystemTime(): Date | null;
    getRealSystemTime(): number;
    stubEnv<T extends string>(
    ): typeof vi;
    unstubAllEnvs(): typeof vi;
    stubGlobal(name: string | symbol | number, value: unknown): typeof vi;
    unstubAllGlobals(): typeof vi;
    setConfig(config: {
    }): void;
    resetConfig(): void;
    dynamicImportSettled(): Promise<void>;
    waitFor<T>(
    ): Promise<T>;
    waitUntil<T>(
    ): Promise<Exclude<T, false | "" | 0 | 0n | null | undefined>>;
  };
  interface FunctionLike {
    readonly name: string;
  }
  type DescribeLabel = number | string | Function | FunctionLike;
  export interface Describe<T extends Readonly<any[]>> {
    (fn: () => void): void;
    (label: DescribeLabel, fn: (...args: T) => void): void;
    only: Describe<T>;
    skip: ((label: string | number) => void) & Describe<T>;
    todo: ((label: string | number) => void) & Describe<T>;
    concurrent: Describe<T>;
    serial: Describe<T>;
    sequential: Describe<T>;
    shuffle: Describe<T>;
    if(condition: boolean): Describe<T>;
    runIf(condition: boolean): Describe<T>;
    skipIf(condition: boolean): Describe<T>;
    todoIf(condition: boolean): Describe<T>;
    each<T extends Readonly<[any, ...any[]]>>(table: readonly T[]): Describe<[...T]>;
    each<T extends readonly any[]>(table: readonly T[]): Describe<[...T]>;
    each<const T>(table: readonly T[]): Describe<[T]>;
    each(headings: TemplateStringsArray, ...values: any[]): Describe<[row: any]>;
    each<const T>(table: readonly T[]): Describe<[T]>;
    for<const T>(table: readonly T[]): Describe<[row: T]>;
    for(headings: TemplateStringsArray, ...values: any[]): Describe<[row: any]>;
  }
  export const describe: Describe<[]>;
  export const xdescribe: Describe<[]>;
  type HookOptions = number | { timeout?: number };
  export function beforeAll(
    fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
    options?: HookOptions,
  ): void;
  export function beforeEach(
    fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
    options?: HookOptions,
  ): void;
  export function afterAll(
    fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
    options?: HookOptions,
  ): void;
  export function afterEach(
    fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
    options?: HookOptions,
  ): void;
  export function aroundEach(
    fn: (runTest: () => Promise<void>, context: TestContext, suite: TestSuite) => unknown | Promise<unknown>,
    options?: HookOptions,
  ): void;
  export function aroundAll(
    fn: (runSuite: () => Promise<void>, context: object, suite: TestSuite) => unknown | Promise<unknown>,
    options?: HookOptions,
  ): void;
  export function onTestFinished(
    fn: (() => void | Promise<unknown>) | ((done: (err?: unknown) => void) => void),
    options?: HookOptions,
  ): void;
  export function setDefaultTimeout(milliseconds: number): void;
  export interface TestOptions {
    timeout?: number;
    retry?: number;
    repeats?: number;
  }
  export interface Test<T extends ReadonlyArray<unknown>> {
    (
    ): void;
    (
    ): void;
    (
    ): void;
    only: Test<T>;
    skip: ((label: string) => void) & Test<T>;
    todo: ((label: string) => void) & Test<T>;
    failing: Test<T>;
    fails: Test<T>;
    concurrent: Test<T>;
    serial: Test<T>;
    sequential: Test<T>;
    if(condition: boolean): Test<T>;
    runIf(condition: boolean): Test<T>;
    skipIf(condition: boolean): Test<T>;
    todoIf(condition: boolean): Test<T>;
    failingIf(condition: boolean): Test<T>;
    concurrentIf(condition: boolean): Test<T>;
    serialIf(condition: boolean): Test<T>;
    each<T extends Readonly<[unknown, ...unknown[]]>>(table: readonly T[]): Test<T>;
    each<T extends readonly unknown[]>(table: readonly T[]): Test<T>;
    each<const T>(table: readonly T[]): Test<[T]>;
    each(headings: TemplateStringsArray, ...values: any[]): Test<[row: any]>;
    each<const T>(table: readonly T[]): Test<[T]>;
    for<const Row>(table: readonly Row[]): TestWithContext<object, [row: Row]>;
    for(headings: TemplateStringsArray, ...values: any[]): TestWithContext<object, [row: any]>;
    extend: ExtendTest<object>;
    beforeAll: typeof beforeAll;
    beforeEach: typeof beforeEach;
    afterEach: typeof afterEach;
    afterAll: typeof afterAll;
    aroundEach: typeof aroundEach;
    aroundAll: typeof aroundAll;
    describe: Describe<[]>;
    suite: Describe<[]>;
  }
  export interface TestContext {
    readonly task: TestTask;
    readonly expect: Expect;
    readonly signal: AbortSignal;
    skip(note?: string): never;
    skip(condition: boolean, note?: string): void;
    onTestFinished(fn: (context: TestContext) => void | Promise<unknown>, options?: HookOptions): void;
    onTestFailed(fn: (context: TestContext) => void | Promise<unknown>, options?: HookOptions): void;
    annotate(message: string, type?: string, attachment?: object): Promise<TestAnnotation>;
    annotate(message: string, attachment?: object): Promise<TestAnnotation>;
  }
  export interface TestAnnotation {
    message: string;
    type: string;
    attachment?: object;
  }
  export interface TestSuite {
    type: "suite";
    name: string;
    fullName: string;
    mode: "run" | "skip" | "only" | "todo";
    meta: Record<string, any>;
    file: TestSuite & { filepath: string };
    suite?: TestSuite;
  }
  export interface TestTask extends Omit<TestSuite, "type"> {
    type: "test";
    id: string;
    fullTestName: string;
    timeout: number;
    retry: number;
    repeats: number;
    fails?: true;
    concurrent?: true;
    annotations: TestAnnotation[];
    result: {
    };
    context: TestContext;
  }
  export interface FixtureOptions {
    auto?: boolean;
    scope?: "test" | "file" | "worker";
  }
  export type FixtureFunction<Value, Context> = (
    context: Context,
    use: (value: Value) => Promise<void>,
  ) => void | Promise<void>;
  type Fixture<Value, Context> = ((...args: any[]) => any) extends Value
    ? FixtureFunction<Value, Context>
    : Value | FixtureFunction<Value, Context>;
  export type Fixtures<Added, Context = object> = {
    [Name in keyof Added]:
  };
  export interface ExtendTest<Context> {
    <Added extends Record<string, any> = object>(
    ): TestWithContext<Omit<Context, keyof Added> & Added>;
    <Name extends string, Value>(
    ): TestWithContext<Omit<Context, Name> & Record<Name, Value>>;
    <Name extends string, Value>(
    ): TestWithContext<Omit<Context, Name> & Record<Name, Value>>;
  }
  type ContextHook<Context> = (
    fn: (context: Context & TestContext) => unknown | Promise<unknown>,
    options?: HookOptions,
  ) => void;
  type SuiteHook<Context> = (
    fn: (context: Context, suite: TestSuite) => unknown | Promise<unknown>,
    options?: HookOptions,
  ) => void;
  type AroundHook<Context> = (
    fn: (run: () => Promise<void>, context: Context, suite: TestSuite) => unknown | Promise<unknown>,
    options?: HookOptions,
  ) => void;
  type TestOfRows<Row extends ReadonlyArray<unknown>> = {
    (label: string, fn: (...args: Row) => void | Promise<unknown>, options: number | TestOptions): void;
    (label: string, options: number | TestOptions, fn: (...args: Row) => void | Promise<unknown>): void;
    (label: string, fn: (...args: Row) => void | Promise<unknown>, options?: number | TestOptions): void;
  };
  export interface TestWithContext<Context, Row extends ReadonlyArray<unknown> = []> {
    (
    ): void;
    (
    ): void;
    (
    ): void;
    only: TestWithContext<Context, Row>;
    skip: ((label: string) => void) & TestWithContext<Context, Row>;
    todo: ((label: string) => void) & TestWithContext<Context, Row>;
    failing: TestWithContext<Context, Row>;
    fails: TestWithContext<Context, Row>;
    concurrent: TestWithContext<Context, Row>;
    serial: TestWithContext<Context, Row>;
    sequential: TestWithContext<Context, Row>;
    if(condition: boolean): TestWithContext<Context, Row>;
    runIf(condition: boolean): TestWithContext<Context, Row>;
    skipIf(condition: boolean): TestWithContext<Context, Row>;
    todoIf(condition: boolean): TestWithContext<Context, Row>;
    failingIf(condition: boolean): TestWithContext<Context, Row>;
    concurrentIf(condition: boolean): TestWithContext<Context, Row>;
    serialIf(condition: boolean): TestWithContext<Context, Row>;
    each<T extends Readonly<[unknown, ...unknown[]]>>(table: readonly T[]): TestOfRows<T>;
    each<T extends readonly unknown[]>(table: readonly T[]): TestOfRows<T>;
    each<const T>(table: readonly T[]): TestOfRows<[row: T]>;
    each(headings: TemplateStringsArray, ...values: any[]): TestOfRows<[row: any]>;
    for<const T>(table: readonly T[]): TestWithContext<Context, [row: T]>;
    for(headings: TemplateStringsArray, ...values: any[]): TestWithContext<Context, [row: any]>;
    extend: ExtendTest<Context>;
    override(fixtures: Partial<Fixtures<Context>>): this;
    scoped(fixtures: Partial<Fixtures<Context>>): this;
    beforeAll: SuiteHook<Context>;
    afterAll: SuiteHook<Context>;
    beforeEach: ContextHook<Context>;
    afterEach: ContextHook<Context>;
    aroundEach: AroundHook<Context & TestContext>;
    aroundAll: AroundHook<Context>;
    describe: Describe<[]>;
    suite: Describe<[]>;
  }
  export const test: Test<[]>;
  export { test as it, xtest as xit };
  export const xtest: Test<[]>;
  export const expect: Expect;
  type ExpectNot = Omit<AsymmetricMatchers, keyof AsymmetricMatchersBuiltin> & AsymmetricMatchersBuiltinNegated;
  export interface Expect extends AsymmetricMatchers {
    (): Matchers<undefined>;
    <T = unknown>(actual: T, customFailMessage?: string): Matchers<T>;
    <T = unknown>(actual?: T, customFailMessage?: string): Matchers<T | undefined>;
    not: ExpectNot;
    resolvesTo: AsymmetricMatchers;
    rejectsTo: AsymmetricMatchers;
    extend<M>(matchers: ExpectExtendMatchers<M>): void;
    unreachable(msg?: string | Error): never;
    soft<T = unknown>(actual?: T, customFailMessage?: string): Matchers<T>;
    poll<T>(
    ): Omit<
    >;
    hasAssertions(): void;
    assertions(neededAssertions: number): void;
    addEqualityTesters(testers: Tester[]): void;
    addSnapshotSerializer(serializer: SnapshotSerializer): void;
    getState(): ExpectState & Record<string, unknown>;
    setState(state: Partial<ExpectState> & Record<string, unknown>): void;
  }
  export interface ExpectState {
    assertionCalls: number;
    currentTestName?: string;
    expectedAssertionsNumber: number | null;
    isExpectingAssertions: boolean;
    suppressedErrors: Error[];
    testPath?: string;
  }
  export interface Matchers<T = unknown> extends MatchersBuiltin<T> {}
  export interface AsymmetricMatchers extends AsymmetricMatchersBuiltin {}
  export interface AsymmetricMatchersBuiltin {
    any(constructor: ((...args: any[]) => any) | { new (...args: any[]): any }): AsymmetricMatcher;
    anything(): AsymmetricMatcher;
    arrayContaining<E = any>(arr: readonly E[]): AsymmetricMatcher;
    objectContaining(obj: object): AsymmetricMatcher;
    stringContaining(str: string | String): AsymmetricMatcher;
    stringMatching(regex: string | String | RegExp): AsymmetricMatcher;
    toSatisfy(predicate: (value: any) => unknown, message?: string): AsymmetricMatcher;
    closeTo(num: number, numDigits?: number): AsymmetricMatcher;
  }
  interface AsymmetricMatchersBuiltinNegated {
    resolvesTo: ExpectNot;
    rejectsTo: ExpectNot;
    arrayContaining<E = any>(arr: readonly E[]): AsymmetricMatcher;
    objectContaining(obj: object): AsymmetricMatcher;
    stringContaining(str: string | String): AsymmetricMatcher;
    stringMatching(str: string | String | RegExp): AsymmetricMatcher;
    toSatisfy(predicate: (value: any) => unknown, message?: string): AsymmetricMatcher;
    closeTo(num: number, numDigits?: number): AsymmetricMatcher;
  }
  export type AsyncMatchers<T = unknown> = MatchersBuiltin<T, Promise<void>> & {
    [K in Exclude<keyof Matchers<T>, keyof MatchersBuiltin>]: Matchers<T>[K] extends (...args: infer Args) => unknown
  } & Matchers<T>;
  export interface MatchersBuiltin<T = unknown, R = void> {
    not: [R] extends [void] ? Matchers<unknown> : AsyncMatchers<unknown>;
    resolves: AsyncMatchers<Awaited<T extends (...args: any[]) => infer Returned ? Returned : T>>;
    rejects: AsyncMatchers<unknown>;
    pass: (message?: string) => R;
    fail: (message?: string) => R;
    toBe(expected: T): R;
    toBe<X = T>(expected: NoInfer<X>): R;
    toBeOdd(): R;
    toBeEven(): R;
    toBeCloseTo(expected: number, numDigits?: number): R;
    toEqual(expected: T): R;
    toEqual<X = T>(expected: NoInfer<X>): R;
    toStrictEqual(expected: T): R;
    toStrictEqual<X = T>(expected: NoInfer<X>): R;
    toBeOneOf(expected: Iterable<T>): R;
    toBeOneOf<X = T>(expected: NoInfer<Iterable<X>>): R;
    toContain(expected: T extends Iterable<infer U> ? U : T): R;
    toContain<X = T>(expected: NoInfer<X extends Iterable<infer U> ? U : X>): R;
    toContainKey(expected: __internal.IfNeverThenElse<keyof T, PropertyKey>): R;
    toContainKey<X = T>(expected: __internal.IfNeverThenElse<NoInfer<keyof X>, PropertyKey>): R;
    toContainAllKeys(expected: Array<__internal.IfNeverThenElse<keyof T, PropertyKey>>): R;
    toContainAllKeys<X = T>(expected: Array<__internal.IfNeverThenElse<NoInfer<keyof X>, PropertyKey>>): R;
    toContainAnyKeys(expected: Array<__internal.IfNeverThenElse<keyof T, PropertyKey>>): R;
    toContainAnyKeys<X = T>(expected: Array<__internal.IfNeverThenElse<NoInfer<keyof X>, PropertyKey>>): R;
    toContainValue(expected: unknown): R;
    toContainValues(expected: Array<unknown>): R;
    toContainAllValues(expected: Array<unknown>): R;
    toContainAnyValues(expected: Array<unknown>): R;
    toContainKeys(expected: Array<__internal.IfNeverThenElse<keyof T, PropertyKey>>): R;
    toContainKeys<X = T>(expected: Array<__internal.IfNeverThenElse<NoInfer<keyof X>, PropertyKey>>): R;
    toContainEqual(expected: T extends Iterable<infer U> ? U : T): R;
    toContainEqual<X = T>(expected: NoInfer<X extends Iterable<infer U> ? U : X>): R;
    toHaveLength(length: number): R;
    toHaveProperty(keyPath: string | number | Array<string | number>, value?: unknown): R;
    toBeTruthy(): R;
    toBeFalsy(): R;
    toBeDefined(): R;
    toBeInstanceOf(value: unknown): R;
    toBeUndefined(): R;
    toBeNull(): R;
    toBeNaN(): R;
    toBeGreaterThan(expected: number | bigint): R;
    toBeGreaterThanOrEqual(expected: number | bigint): R;
    toBeLessThan(expected: number | bigint): R;
    toBeLessThanOrEqual(expected: number | bigint): R;
    toThrow(expected?: unknown): R;
    toThrowError(expected?: unknown): R;
    toMatch(expected: string | RegExp): R;
    toMatchSnapshot(hint?: string): R;
    toMatchSnapshot(propertyMatchers?: object, hint?: string): R;
    toMatchInlineSnapshot(value?: string): R;
    toMatchInlineSnapshot(propertyMatchers?: object, value?: string): R;
    toMatchFileSnapshot(path: string, hint?: string): Promise<void>;
    toThrowErrorMatchingSnapshot(hint?: string): R;
    toThrowErrorMatchingInlineSnapshot(value?: string): R;
    toMatchObject(subset: object): R;
    toBeEmpty(): R;
    toBeEmptyObject(): R;
    toBeNil(): R;
    toBeArray(): R;
    toBeArrayOfSize(size: number): R;
    toBeBoolean(): R;
    toBeTrue(): R;
    toBeTypeOf(type: "bigint" | "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined"): R;
    toBeFalse(): R;
    toBeNumber(): R;
    toBeInteger(): R;
    toBeObject(): R;
    toBeFinite(): R;
    toBePositive(): R;
    toBeNegative(): R;
    toBeWithin(start: number, end: number): R;
    toEqualIgnoringWhitespace(expected: string): R;
    toBeSymbol(): R;
    toBeFunction(): R;
    toBeDate(): R;
    toBeValidDate(): R;
    toBeString(): R;
    toInclude(expected: string): R;
    toIncludeRepeated(expected: string, times: number): R;
    toSatisfy(predicate: (value: T) => boolean): R;
    toStartWith(expected: string): R;
    toEndWith(expected: string): R;
    toHaveReturned(): R;
    toHaveReturnedTimes(times: number): R;
    toHaveReturnedWith(expected: unknown): R;
    toHaveLastReturnedWith(expected: unknown): R;
    toHaveNthReturnedWith(n: number, expected: unknown): R;
    toHaveBeenCalled(): R;
    toBeCalled(): R;
    toHaveBeenCalledOnce(): void;
    toHaveBeenCalledTimes(expected: number): R;
    toBeCalledTimes(expected: number): R;
    toHaveBeenCalledWith(...expected: unknown[]): R;
    toBeCalledWith(...expected: unknown[]): R;
    toHaveBeenLastCalledWith(...expected: unknown[]): R;
    lastCalledWith(...expected: unknown[]): R;
    toHaveBeenNthCalledWith(n: number, ...expected: unknown[]): R;
    nthCalledWith(n: number, ...expected: unknown[]): R;
    toHaveBeenCalledExactlyOnceWith(...expected: unknown[]): R;
    toHaveBeenCalledBefore(mock: Mock<(...args: any[]) => any>, failIfNoFirstInvocation?: boolean): R;
    toHaveBeenCalledAfter(mock: Mock<(...args: any[]) => any>, failIfNoFirstInvocation?: boolean): R;
    toHaveResolved(): R;
    toHaveResolvedTimes(times: number): R;
    toHaveResolvedWith(expected: unknown): R;
    toHaveLastResolvedWith(expected: unknown): R;
    toHaveNthResolvedWith(n: number, expected: unknown): R;
  }
  export type AsymmetricMatcher = any;
  export interface MatcherResult {
    pass: boolean;
    message?: string | (() => string);
  }
  export type CustomMatcher<E, P extends any[]> = (
    this: MatcherContext,
    expected: E,
    ...matcherArguments: P
  ) => MatcherResult | Promise<MatcherResult>;
  export type CustomMatchersDetected = Omit<Matchers<unknown>, keyof MatchersBuiltin<unknown>> &
    Omit<AsymmetricMatchers, keyof AsymmetricMatchersBuiltin>;
  export type ExpectExtendMatchers<M> = {
    [k in keyof M]: k extends keyof CustomMatchersDetected
  };
  export type SnapshotPrinter = (
    value: unknown,
    config: SnapshotSerializerConfig,
    indentation: string,
    depth: number,
    refs: unknown[],
  ) => string;
  export interface SnapshotSerializerConfig {
    indent: string;
    spacingInner: string;
    spacingOuter: string;
    min: boolean;
    plugins: SnapshotSerializer[];
    [option: string]: unknown;
  }
  export type SnapshotSerializer = { test(value: any): boolean } & (
    | {
    | {
  );
  export type Tester = (this: TesterContext, a: any, b: any, customTesters: Tester[]) => boolean | undefined;
  export type EqualsFunction = (
    a: unknown,
    b: unknown,
    customTesters?: Array<Tester>,
    strictCheck?: boolean,
  ) => boolean;
  export interface TesterContext {
    equals: EqualsFunction;
  }
  interface MatcherState extends ExpectState {
    isNot: boolean;
    promise: string;
  }
  type MatcherHintColor = (arg: string) => string; // subset of Chalk type
  interface MatcherUtils {
    customTesters: Array<Tester>;
    equals: EqualsFunction;
    utils: Readonly<{
    }>;
  }
  type MatcherContext = MatcherUtils & MatcherState;
  namespace JestMock {
    export interface ClassLike {
    }
    export type ConstructorLikeKeys<T> = keyof {
    };
    export type FunctionLike = (...args: any) => any;
    export type MethodLikeKeys<T> = keyof {
    };
    export interface Mock<T extends (...args: any[]) => any> extends MockInstance<T> {
    }
    type MockFunctionResult<T extends FunctionLike = UnknownFunction> =
    interface MockFunctionResultIncomplete {
    }
    interface MockFunctionResultReturn<T extends FunctionLike = UnknownFunction> {
    }
    interface MockFunctionResultThrow {
    }
    interface MockFunctionState<T extends FunctionLike = FunctionLike> {
    }
    export interface MockInstance<T extends FunctionLike = UnknownFunction> {
    }
    export type PropertyLikeKeys<T> = Exclude<keyof T, ConstructorLikeKeys<T> | MethodLikeKeys<T>>;
    export type RejectType<T extends FunctionLike> = ReturnType<T> extends PromiseLike<any> ? unknown : never;
    export interface Replaced<T = unknown> {
    }
    export function replaceProperty<
    >(object: T, propertyKey: K_2, value: V): Replaced<T[K_2]>;
    export type ResolveType<T extends FunctionLike> = ReturnType<T> extends PromiseLike<infer U> ? U : never;
    export type Spied<T extends ClassLike | FunctionLike> = T extends ClassLike
    export type SpiedClass<T extends ClassLike = UnknownClass> = MockInstance<
    >;
    export type SpiedFunction<T extends FunctionLike = UnknownFunction> = MockInstance<
    >;
    export type SpiedGetter<T> = MockInstance<() => T>;
    export type SpiedSetter<T> = MockInstance<(arg: T) => void>;
    export interface SpyInstance<T extends FunctionLike = UnknownFunction> extends MockInstance<T> {}
    export const spyOn: {
    };
    export interface UnknownClass {
    }
    export type UnknownFunction = (...args: unknown[]) => unknown;
  }
  export const expectTypeOf: typeof import("./vendor/expect-type").expectTypeOf;
}
```

## `vitest-globals.d.ts` (31 lines -> 18 lines)

```ts
/// <reference path="./vitest.d.ts" />
declare var test: typeof import("vitest").test;
declare var it: typeof import("vitest").it;
declare var describe: typeof import("vitest").describe;
declare var suite: typeof import("vitest").suite;
declare var expect: typeof import("vitest").expect;
declare var expectTypeOf: typeof import("vitest").expectTypeOf;
declare var assertType: typeof import("vitest").assertType;
declare var vi: typeof import("vitest").vi;
declare var vitest: typeof import("vitest").vitest;
declare var beforeAll: typeof import("vitest").beforeAll;
declare var beforeEach: typeof import("vitest").beforeEach;
declare var afterEach: typeof import("vitest").afterEach;
declare var afterAll: typeof import("vitest").afterAll;
declare var aroundEach: typeof import("vitest").aroundEach;
declare var aroundAll: typeof import("vitest").aroundAll;
declare var onTestFinished: typeof import("vitest").onTestFinished;
declare var onTestFailed: typeof import("vitest").onTestFailed;
```

## `vitest.d.ts` (799 lines -> 370 lines, 92 nested lines elided)

```ts
/// <reference path="./test.d.ts" />
declare module "vitest" {
  import type {
    AsymmetricMatchersBuiltin,
    MatcherResult as BunMatcherResult,
    TestContext as BunTestContext,
    vi as bunVi,
    CustomMatcher,
    Expect,
    FixtureOptions,
    MatchersBuiltin,
    TestSuite,
    TestTask,
  } from "bun:test";
  export type { SnapshotSerializer, TestAnnotation } from "bun:test";
  export { test as it, describe as suite, vi as vitest };
  export const assert: typeof import("chai").assert;
  export const should: typeof import("chai").should;
  type Awaitable<T> = T | PromiseLike<T>;
  type Procedure = (...args: any[]) => any;
  interface Constructable {
    new (...args: any[]): any;
  }
  export interface MockResultReturn<T> {
    type: "return";
    value: T;
  }
  export interface MockResultIncomplete {
    type: "incomplete";
    value: undefined;
  }
  export interface MockResultThrow {
    type: "throw";
    value: any;
  }
  export type MockResult<T> = MockResultReturn<T> | MockResultThrow | MockResultIncomplete;
  export interface MockSettledResultIncomplete {
    type: "incomplete";
    value: undefined;
  }
  export interface MockSettledResultFulfilled<T> {
    type: "fulfilled";
    value: T;
  }
  export interface MockSettledResultRejected {
    type: "rejected";
    value: any;
  }
  export type MockSettledResult<T> =
    MockSettledResultFulfilled<T> | MockSettledResultRejected | MockSettledResultIncomplete;
  type MockParameters<T extends Procedure | Constructable> = T extends Constructable
    ? ConstructorParameters<T>
    : T extends Procedure
  type MockReturnType<T extends Procedure | Constructable> = T extends Constructable
    ? InstanceType<T>
    : T extends Procedure
  type MockThis<T extends Procedure | Constructable> = T extends Constructable ? InstanceType<T> : ThisParameterType<T>;
  type MockImplementation<T extends Procedure | Constructable> = T extends Constructable
    ? | { new (...args: ConstructorParameters<T>): InstanceType<T> }
    : T extends Procedure
  export interface MockContext<T extends Procedure | Constructable = Procedure> {
    calls: MockParameters<T>[];
    instances: MockThis<T>[];
    contexts: MockThis<T>[];
    invocationCallOrder: number[];
    results: MockResult<MockReturnType<T>>[];
    settledResults: MockSettledResult<Awaited<MockReturnType<T>>>[];
    lastCall: MockParameters<T> | undefined;
  }
  export interface MockInstance<T extends Procedure | Constructable = Procedure> extends Disposable {
    getMockName(): string;
    mockName(name: string): this;
    mock: MockContext<T>;
    mockClear(): this;
    mockReset(): this;
    mockRestore(): void;
    getMockImplementation(): MockImplementation<T> | undefined;
    mockImplementation(fn: MockImplementation<T>): this;
    mockImplementationOnce(fn: MockImplementation<T>): this;
    withImplementation(fn: MockImplementation<T>, callback: () => Promise<unknown>): Promise<void>;
    withImplementation(fn: MockImplementation<T>, callback: () => unknown): this;
    mockReturnThis(): this;
    mockReturnValue(value: MockReturnType<T>): this;
    mockReturnValueOnce(value: MockReturnType<T>): this;
    mockThrow(value: unknown): this;
    mockThrowOnce(value: unknown): this;
    mockResolvedValue(value: Awaited<MockReturnType<T>>): this;
    mockResolvedValueOnce(value: Awaited<MockReturnType<T>>): this;
    mockRejectedValue(error: unknown): this;
    mockRejectedValueOnce(error: unknown): this;
  }
  export type Mock<T extends Procedure | Constructable = Procedure> = MockInstance<T> &
    (T extends Constructable
    };
  type Methods<T> = keyof { [K in keyof T as T[K] extends Procedure ? K : never]: T[K] };
  type Properties<T> = { [K in keyof T]: T[K] extends Procedure ? never : K }[keyof T] & (string | symbol);
  type Classes<T> = { [K in keyof T]: T[K] extends new (...args: any[]) => any ? K : never }[keyof T] &
    (string | symbol);
  type PartialMaybePromise<T> = T extends Promise<Awaited<T>> ? Promise<Partial<Awaited<T>>> : Partial<T>;
  type DeepPartial<T> = T extends Procedure
    ? T
    : T extends Array<infer U>
  type DeepPartialMaybePromise<T> = T extends Promise<Awaited<T>> ? Promise<DeepPartial<Awaited<T>>> : DeepPartial<T>;
  type ImplementationOf<T> = T extends Mock ? NonNullable<ReturnType<T["getMockImplementation"]>> : T;
  type PartialMock<T extends Procedure | Constructable> = Mock<
    ImplementationOf<T> extends infer F
  >;
  type DeepPartialMock<T extends Procedure | Constructable> = Mock<
    ImplementationOf<T> extends infer F
  >;
  type MaybeMockedConstructor<T> = T extends Constructable ? Mock<T> : T;
  export type MockedFunction<T extends Procedure | Constructable> = Mock<T> & MockedObject<T>;
  type PartiallyMockedFunction<T extends Procedure | Constructable> = PartialMock<T> & MockedObject<T>;
  type MockedFunctionDeep<T extends Procedure | Constructable> = Mock<T> & MockedObjectDeep<T>;
  type PartiallyMockedFunctionDeep<T extends Procedure | Constructable> = DeepPartialMock<T> & MockedObjectDeep<T>;
  export type MockedObject<T> = MaybeMockedConstructor<T> & {
    [K in Methods<T>]: T[K] extends Procedure ? MockedFunction<T[K]> : T[K];
  } & { [K in Properties<T>]: T[K] };
  type MockedObjectDeep<T> = MaybeMockedConstructor<T> & {
    [K in Methods<T>]: T[K] extends Procedure ? MockedFunctionDeep<T[K]> : T[K];
  } & { [K in Properties<T>]: MaybeMockedDeep<T[K]> };
  type MaybeMocked<T> = T extends Procedure | Constructable
    ? MockedFunction<T>
    : T extends object
  type MaybeMockedDeep<T> = T extends Procedure | Constructable
    ? MockedFunctionDeep<T>
    : T extends object
  type MaybePartiallyMocked<T> = T extends Procedure | Constructable
    ? PartiallyMockedFunction<T>
    : T extends object
  type MaybePartiallyMockedDeep<T> = T extends Procedure | Constructable
    ? PartiallyMockedFunctionDeep<T>
    : T extends object
  export type MockedClass<T extends Constructable> = MockInstance<T> & {
    prototype: T extends { prototype: any } ? Mocked<T["prototype"]> : never;
  } & T;
  export type Mocked<T> = {
    [P in keyof T]: T[P] extends Procedure ? MockInstance<T[P]> : T[P] extends Constructable ? MockedClass<T[P]> : T[P];
  } & T;
  type SpyOnValue<T extends object, K extends keyof any> = K extends keyof Required<T>
    ? Required<T>[K]
    : (T & Record<K, unknown>)[K];
  type SharedUtils = Omit<
    typeof bunVi,
    "fn" | "spyOn" | "mocked" | "isMockFunction" | "mockObject" | "importMock" | "stubEnv" | "setTimerTickMode"
  >;
  type ReturnsVitestUtils<F> = F extends (...args: infer Args) => infer Result
    ? 0 extends 1 & Awaited<Result> // `any` would match the two below
    : F;
  type VitestSharedUtils = { [K in keyof SharedUtils]: ReturnsVitestUtils<SharedUtils[K]> };
  export interface VitestUtils extends VitestSharedUtils {
    fn<T extends Procedure | Constructable = Procedure>(implementation?: T): Mock<T>;
    spyOn<T extends object, S extends Properties<Required<T>>>(object: T, key: S, accessor: "get"): Mock<() => T[S]>;
    spyOn<T extends object, G extends Properties<Required<T>>>(
    ): Mock<(arg: T[G]) => void>;
    spyOn<T extends object, M extends Classes<Required<T>> | Methods<Required<T>>>(
    ): Required<T>[M] extends Constructable | Procedure ? Mock<Required<T>[M]> : never;
    spyOn<T extends object, K extends keyof any>(
    ): Mock<SpyOnValue<T, K> extends Constructable | Procedure ? SpyOnValue<T, K> : never>;
    mocked<T>(item: T, deep?: false): MaybeMocked<T>;
    mocked<T>(item: T, deep: true): MaybeMockedDeep<T>;
    mocked<T>(item: T, options: { partial?: false; deep?: false }): MaybeMocked<T>;
    mocked<T>(item: T, options: { partial?: false; deep: true }): MaybeMockedDeep<T>;
    mocked<T>(item: T, options: { partial: true; deep?: false }): MaybePartiallyMocked<T>;
    mocked<T>(item: T, options: { partial: true; deep: true }): MaybePartiallyMockedDeep<T>;
    mocked<T>(item: T): MaybeMocked<T>;
    isMockFunction(fn: any): fn is Mock;
    mockObject<T>(value: T, options?: { spy?: boolean | undefined }): MaybeMockedDeep<T>;
    importMock<T = Record<string, any>>(id: string): Promise<MaybeMockedDeep<T>>;
    stubEnv<T extends string>(
    ): VitestUtils;
    setTimerTickMode(mode: "manual" | "nextTimerAsync"): VitestUtils;
    setTimerTickMode(mode: "interval", interval?: number): VitestUtils;
  }
  export const vi: VitestUtils;
  export interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> {}
  export interface JestAssertion<R extends void | Promise<void>, T = unknown> extends Omit<
    MatchersBuiltin<any, R>,
    "not" | "resolves" | "rejects" | "toHaveBeenCalledBefore" | "toHaveBeenCalledAfter"
  > {
    toReturn(): R;
    toHaveBeenCalledBefore(mock: MockInstance, failIfNoFirstInvocation?: boolean): R;
    toHaveBeenCalledAfter(mock: MockInstance, failIfNoFirstInvocation?: boolean): R;
  }
  export interface Assertion<R extends void | Promise<void> = void, T = unknown>
    extends JestAssertion<R, T>, Matchers<R, T> {
    not: Assertion<R, T>;
    resolves: Assertion<Promise<void>, Awaited<T extends (...args: any[]) => infer Returned ? Returned : T>>;
    rejects: Assertion<Promise<void>, unknown>;
  }
  export interface AsymmetricMatchersContaining extends Matchers<any>, AsymmetricMatchersBuiltin {}
  export interface ExpectStatic
    extends
    <T>(actual: T, message?: string): Assertion<void, T>;
    soft<T>(actual: T, message?: string): Assertion<void, T>;
    poll<T>(
    ): Omit<
    >;
    extend(matchers: MatchersObject): void;
    not: AsymmetricMatchersContaining;
  }
  export type MatcherState = ThisParameterType<CustomMatcher<unknown, []>>;
  export type SyncMatcherResult = BunMatcherResult;
  export type AsyncMatcherResult = Promise<SyncMatcherResult>;
  export type MatcherResult = SyncMatcherResult | AsyncMatcherResult;
  export interface Matcher<T extends MatcherState = MatcherState, E extends Array<any> = Array<any>> {
    (this: T, received: any, ...expected: E): MatcherResult;
  }
  export type MatchersObject<T extends MatcherState = MatcherState> = Record<string, Matcher<T>> &
    ThisType<T> & { [K in keyof Matchers]?: Matcher<T, Parameters<Matchers[K]>> };
  export const expect: ExpectStatic;
  export const expectTypeOf: typeof import("bun:test").expectTypeOf;
  export type ExpectTypeOf<Actual, Options extends { positive: boolean }> = import("./vendor/expect-type").ExpectTypeOf<
    Actual,
    Options
  >;
  export interface AssertType {
    <T>(value: T): void;
  }
  export const assertType: AssertType;
  export interface TaskMeta {}
  export type RunMode = "run" | "skip" | "only" | "todo";
  export type TaskState = RunMode | "pass" | "fail";
  export interface RunnerTestSuite extends Omit<TestSuite, "meta" | "file" | "suite"> {
    fullTestName?: string;
    meta: TaskMeta;
    file: RunnerTestFile;
    suite?: RunnerTestSuite;
  }
  export interface RunnerTestFile extends RunnerTestSuite {
    filepath: string;
  }
  export interface RunnerTestCase<ExtraContext = object> extends Omit<TestTask, "meta" | "file" | "suite" | "context"> {
    meta: TaskMeta;
    file: RunnerTestFile;
    suite?: RunnerTestSuite;
    context: TestContext & ExtraContext;
  }
  export type RunnerTask = RunnerTestCase | RunnerTestSuite | RunnerTestFile;
  export type OnTestFailedHandler = (context: TestContext) => Awaitable<void>;
  export type OnTestFinishedHandler = (context: TestContext) => Awaitable<void>;
  export interface TestContext extends Omit<BunTestContext, "task" | "expect" | "onTestFinished" | "onTestFailed"> {
    readonly task: Readonly<RunnerTestCase>;
    readonly expect: ExpectStatic;
    onTestFinished(fn: OnTestFinishedHandler, timeout?: number): void;
    onTestFailed(fn: OnTestFailedHandler, timeout?: number): void;
  }
  export interface TestOptions {
    timeout?: number | undefined;
    retry?: number | { count?: number | undefined } | undefined;
    repeats?: number | undefined;
    concurrent?: boolean | undefined;
    sequential?: boolean | undefined;
    skip?: boolean | undefined;
    only?: boolean | undefined;
    todo?: boolean | undefined;
    fails?: boolean | undefined;
  }
  export interface SuiteOptions extends TestOptions {
    shuffle?: boolean | undefined;
  }
  export type TestFunction<ExtraContext = object> = (context: TestContext & ExtraContext) => Awaitable<any> | void;
  type TaskName = string | Function;
  interface Register<Args extends any[], Options> {
    (name: TaskName, fn?: (...args: Args) => Awaitable<any> | void, timeout?: number): void;
    (name: TaskName, options: Options, fn?: (...args: Args) => Awaitable<any> | void): void;
  }
  type Writable<T extends ReadonlyArray<any>> = { -readonly [K in keyof T]: T[K] };
  interface Each<Options> {
    <T extends any[] | [any]>(rows: ReadonlyArray<T>): Register<T, Options>;
    <T extends ReadonlyArray<any>>(rows: ReadonlyArray<T>): Register<Writable<T>, Options>;
    <T>(rows: ReadonlyArray<T>): Register<T[], Options>;
    (headings: TemplateStringsArray, ...values: any[]): Register<any[], Options>;
  }
  type FixtureFunction<T, K extends keyof T, Context> = (
    context: Omit<T, K> & Context,
    use: (value: T[K]) => Promise<void>,
  ) => Promise<void>;
  type Fixture<T, K extends keyof T, Context> = ((...args: any) => any) extends T[K]
    ? T[K] extends any
    : T[K] | (T[K] extends any ? FixtureFunction<T, K, Omit<Context, Exclude<keyof T, K>>> : never);
  type Fixtures<T, ExtraContext = object> = {
    [K in keyof T]:
  };
  type Extended<ExtraContext, Added> = {
    [K in keyof Added | keyof ExtraContext]: K extends keyof Added
  };
  type FixtureValue<Value, ExtraContext> =
    | ((
    | Value;
  export function beforeAll<ExtraContext = object>(
    fn: (context: ExtraContext, suite: Readonly<RunnerTestSuite | RunnerTestFile>) => Awaitable<unknown>,
    timeout?: number,
  ): void;
  export function afterAll<ExtraContext = object>(
    fn: (context: ExtraContext, suite: Readonly<RunnerTestSuite | RunnerTestFile>) => Awaitable<unknown>,
    timeout?: number,
  ): void;
  export function beforeEach<ExtraContext = object>(
    fn: (context: TestContext & ExtraContext) => Awaitable<unknown>,
    timeout?: number,
  ): void;
  export function afterEach<ExtraContext = object>(
    fn: (context: TestContext & ExtraContext) => Awaitable<unknown>,
    timeout?: number,
  ): void;
  export function aroundEach<ExtraContext = object>(
    fn: (
    ) => Awaitable<unknown>,
    timeout?: number,
  ): void;
  export function aroundAll<ExtraContext = object>(
    fn: (
    ) => Awaitable<unknown>,
    timeout?: number,
  ): void;
  export interface TestAPI<ExtraContext = object> {
    <Context extends ExtraContext>(name: TaskName, fn?: TestFunction<Context>, timeout?: number): void;
    <Context extends ExtraContext>(name: TaskName, options: TestOptions, fn?: TestFunction<Context>): void;
    only: TestAPI<ExtraContext>;
    skip: TestAPI<ExtraContext>;
    todo: TestAPI<ExtraContext>;
    fails: TestAPI<ExtraContext>;
    concurrent: TestAPI<ExtraContext>;
    sequential: TestAPI<ExtraContext>;
    skipIf(condition: any): TestAPI<ExtraContext>;
    runIf(condition: any): TestAPI<ExtraContext>;
    each: Each<TestOptions>;
    for<T>(rows: ReadonlyArray<T>): Register<[row: T, context: TestContext & ExtraContext], TestOptions>;
    for(
    ): Register<[row: any, context: TestContext & ExtraContext], TestOptions>;
    extend<Added extends Record<string, any> = object>(
    ): TestAPI<Extended<ExtraContext, Added>>;
    extend<Name extends string, Value>(
    ): TestAPI<Extended<ExtraContext, Record<Name, Value>>>;
    extend<Name extends string, Value>(
    ): TestAPI<Extended<ExtraContext, Record<Name, Value>>>;
    override(fixtures: Partial<Fixtures<ExtraContext>>): this;
    scoped(fixtures: Partial<Fixtures<ExtraContext>>): this;
    beforeAll: typeof beforeAll<ExtraContext>;
    afterAll: typeof afterAll<ExtraContext>;
    beforeEach: typeof beforeEach<ExtraContext>;
    afterEach: typeof afterEach<ExtraContext>;
    aroundEach: typeof aroundEach<ExtraContext>;
    aroundAll: typeof aroundAll<ExtraContext>;
    describe: SuiteAPI;
  }
  export interface SuiteAPI extends Register<[], SuiteOptions> {
    only: SuiteAPI;
    skip: SuiteAPI;
    todo: SuiteAPI;
    concurrent: SuiteAPI;
    sequential: SuiteAPI;
    shuffle: SuiteAPI;
    skipIf(condition: any): SuiteAPI;
    runIf(condition: any): SuiteAPI;
    each: Each<SuiteOptions>;
    for<T>(rows: ReadonlyArray<T>): Register<[row: T], SuiteOptions>;
    for(headings: TemplateStringsArray, ...values: any[]): Register<[row: any], SuiteOptions>;
  }
  export const test: TestAPI;
  export const describe: SuiteAPI;
  export function onTestFinished(fn: OnTestFinishedHandler, timeout?: number): void;
  export function onTestFailed(fn: OnTestFailedHandler, timeout?: number): void;
  export const TestRunner: {
    getCurrentTest(): RunnerTestCase | undefined;
  };
  export interface ProvidedContext {}
  export function inject<T extends keyof ProvidedContext & string>(key: T): ProvidedContext[T] | undefined;
}
```

## `wasm.d.ts` (199 lines -> 106 lines, 44 nested lines elided)

```ts
declare module "bun" {
  namespace WebAssembly {
    type ImportExportKind = "function" | "global" | "memory" | "table" | "tag";
    type TableKind = "anyfunc" | "externref";
    type ExportValue = Function | Global | WebAssembly.Memory | WebAssembly.Table;
    type Exports = Record<string, ExportValue>;
    type ImportValue = ExportValue | number;
    type Imports = Record<string, ModuleImports>;
    type ModuleImports = Record<string, ImportValue>;
    interface ValueTypeMap {
    }
    type ValueType = keyof ValueTypeMap;
    interface GlobalDescriptor<T extends ValueType = ValueType> {
    }
    interface Global<T extends ValueType = ValueType> {
    }
    interface CompileError extends Error {}
    interface LinkError extends Error {}
    interface RuntimeError extends Error {}
    interface Instance {
    }
    interface Memory {
    }
    interface Module {}
    interface Table {
    }
    interface MemoryDescriptor {
    }
    interface ModuleExportDescriptor {
    }
    interface ModuleImportDescriptor {
    }
    interface TableDescriptor {
    }
    interface WebAssemblyInstantiatedSource {
    }
  }
}
declare namespace WebAssembly {
  interface ValueTypeMap extends Bun.WebAssembly.ValueTypeMap {}
  interface GlobalDescriptor<T extends keyof ValueTypeMap = keyof ValueTypeMap> extends Bun.WebAssembly
    .GlobalDescriptor<T> {}
  interface MemoryDescriptor extends Bun.WebAssembly.MemoryDescriptor {}
  interface ModuleExportDescriptor extends Bun.WebAssembly.ModuleExportDescriptor {}
  interface ModuleImportDescriptor extends Bun.WebAssembly.ModuleImportDescriptor {}
  interface TableDescriptor extends Bun.WebAssembly.TableDescriptor {}
  interface WebAssemblyInstantiatedSource extends Bun.WebAssembly.WebAssemblyInstantiatedSource {}
  interface LinkError extends Bun.WebAssembly.LinkError {}
  var LinkError: {
    prototype: LinkError;
    new (message?: string): LinkError;
    (message?: string): LinkError;
  };
  interface CompileError extends Bun.WebAssembly.CompileError {}
  var CompileError: {
    prototype: CompileError;
    new (message?: string): CompileError;
    (message?: string): CompileError;
  };
  interface RuntimeError extends Bun.WebAssembly.RuntimeError {}
  var RuntimeError: {
    prototype: RuntimeError;
    new (message?: string): RuntimeError;
    (message?: string): RuntimeError;
  };
  interface Global<T extends keyof ValueTypeMap = keyof ValueTypeMap> extends Bun.WebAssembly.Global<T> {}
  var Global: {
    prototype: Global;
    new <T extends Bun.WebAssembly.ValueType = Bun.WebAssembly.ValueType>(
    ): Global<T>;
  };
  interface Instance extends Bun.WebAssembly.Instance {}
  var Instance: Bun.__internal.UseLibDomIfAvailable<
    "WebAssembly",
    {
    }
  >["Instance"];
  interface Memory extends Bun.WebAssembly.Memory {}
  var Memory: {
    prototype: Memory;
    new (descriptor: MemoryDescriptor): Memory;
  };
  interface Module extends Bun.WebAssembly.Module {}
  var Module: Bun.__internal.UseLibDomIfAvailable<
    "WebAssembly",
    {
    }
  >["Module"];
  interface Table extends Bun.WebAssembly.Table {}
  var Table: {
    prototype: Table;
    new (descriptor: TableDescriptor, value?: any): Table;
  };
  function compile(bytes: Bun.BufferSource): Promise<Module>;
  function compileStreaming(source: Response | PromiseLike<Response>): Promise<Module>;
  function instantiate(
    bytes: Bun.BufferSource,
    importObject?: Bun.WebAssembly.Imports,
  ): Promise<WebAssemblyInstantiatedSource>;
  function instantiate(moduleObject: Module, importObject?: Bun.WebAssembly.Imports): Promise<Instance>;
  function instantiateStreaming(
    source: Response | PromiseLike<Response>,
    importObject?: Bun.WebAssembly.Imports,
  ): Promise<WebAssemblyInstantiatedSource>;
  function validate(bytes: Bun.BufferSource): boolean;
}
```

## `ts7.1/import-attributes.d.ts` (88 lines -> 44 lines)

```ts
declare module "*" with { type: "text" } {
  var text: string;
  export = text;
}
declare module "*" with { type: "file" } {
  var path: string;
  export = path;
}
declare module "*" with { type: "md" } {
  var html: string;
  export = html;
}
declare module "*" with { type: "markdown" } {
  var html: string;
  export = html;
}
declare module "*" with { type: "toml" } {
  var contents: any;
  export = contents;
}
declare module "*" with { type: "yaml" } {
  var contents: any;
  export = contents;
}
declare module "*" with { type: "jsonc" } {
  var contents: any;
  export = contents;
}
declare module "*" with { type: "json5" } {
  var contents: any;
  export = contents;
}
declare module "*" with { type: "xml" } {
  var contents: import("bun").XML.Document;
  export = contents;
}
declare module "*" with { type: "sqlite" } {
  var db: import("bun:sqlite").Database;
  export = db;
}
declare module "*" with { type: "html" } {
  var contents: import("bun").HTMLBundle;
  export = contents;
}
```

## `ts7.1/index.d.ts` (7 lines -> 2 lines)

```ts
/// <reference path="../index.d.ts" />
/// <reference path="./import-attributes.d.ts" />
```
