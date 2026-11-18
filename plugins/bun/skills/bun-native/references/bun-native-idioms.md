# Bun-native Idioms and Working Snippets

## HTTP server with JSON routes

Instead of express, fastify, koa, node:http:

```ts
const server = Bun.serve({
  port: 3000,
  routes: {
    "/users/:id": (req) => Response.json({ id: req.params.id }),
    "/users": {
      POST: async (req) => Response.json(await req.json(), { status: 201 }),
    },
  },
  fetch: () => new Response("Not found", { status: 404 }),
});
console.log(`listening on ${server.url}`);
```

## WebSocket server

Instead of ws, socket.io, uWebSockets.js:

```ts
Bun.serve({
  port: 8080,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("Upgrade failed", { status: 400 });
  },
  websocket: {
    open(ws) {
      ws.subscribe("chat");
    },
    message(ws, message) {
      ws.publish("chat", message);
    },
  },
});
```

## Read and write files

Instead of fs.readFile, fs.writeFile, fs-extra:

```ts
const text = await Bun.file("input.txt").text();
const config = await Bun.file("config.json").json();
await Bun.write("output.txt", text.toUpperCase());
console.log(config, await Bun.file("output.txt").exists());
```

## SQLite, PostgreSQL, Redis, S3/R2

```ts
import { Database } from "bun:sqlite";
import { sql, SQL, redis, RedisClient, S3Client } from "bun";

const db = new Database("app.db", { strict: true });
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)");
db.query("INSERT INTO users (name) VALUES ($name)").run({ name: "Ada" });

const rows = await sql`SELECT * FROM users WHERE id = ${1}`;
const mysql = new SQL("mysql://user:pass@localhost:3306/app");
await redis.set("key", "value");

const s3 = new S3Client({
  bucket: "b",
  endpoint: "https://<account>.r2.cloudflarestorage.com",
});
await s3.write("k.txt", "hi");
const url = s3.presign("k.txt", { expiresIn: 3600 });
console.log(rows, mysql, new RedisClient("redis://localhost:6379"), url);
```

## Shell & Subprocesses & Tests

```ts
import { $ } from "bun";
import { describe, test, expect, mock, beforeEach } from "bun:test";

const branch = (await $`git branch --show-current`.text()).trim();
await $`ls -la ${"some dir"}`.quiet();
const { exitCode } = await $`false`.nothrow();

const proc = Bun.spawn(["bun", "--version"], {
  stdout: "pipe",
  stderr: "pipe",
});
const [stdout, code] = await Promise.all([proc.stdout.text(), proc.exited]);
const sync = Bun.spawnSync(["git", "status"]);

const fn = mock((x: number) => x * 2);
beforeEach(() => fn.mockClear());
describe("sum", () => {
  test("adds", () => {
    expect(1 + 1).toBe(2);
    expect(fn(2)).toBe(4);
  });
});
console.log(branch, exitCode, stdout, code, sync.success);
```

## Crypto, Glob, Env, Fetch, Build, Semver, Archive, HTMLRewriter

```ts
const hash = await Bun.password.hash("secret", { algorithm: "argon2id" });
const ok = await Bun.password.verify("secret", hash);
const hex = new Bun.CryptoHasher("sha256").update("data").digest("hex");
const xx = Bun.hash.xxHash3("data");

const files: string[] = [];
for await (const file of new Bun.Glob("src/**/*.ts").scan("."))
  files.push(file);

const res = await fetch("https://example.com/api", {
  headers: { Accept: "application/json" },
  signal: AbortSignal.timeout(5000),
});
const result = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "bun",
  minify: true,
  sourcemap: "linked",
});
const packed = Bun.gzipSync("hello");
const zstd = await Bun.zstdCompress("hello");

const links: string[] = [];
await new HTMLRewriter()
  .on("a[href]", {
    element(el) {
      links.push(el.getAttribute("href")!);
    },
  })
  .transform(new Response("<a href='/x'>x</a>"))
  .text();

console.log(
  ok,
  hex,
  xx,
  files,
  res.ok,
  result.success,
  packed,
  zstd,
  links,
  Bun.semver.satisfies("1.2.3", "^1.0.0"),
);
```

## Workers, FFI, Secrets, Cookies, Video, Utilities

```ts
import { dlopen, FFIType, suffix } from "bun:ffi";

const worker = new Worker(new URL("./worker.ts", import.meta.url).href);
worker.postMessage({ n: 42 });

const lib = dlopen(`libm.${suffix}`, {
  cos: { args: [FFIType.f64], returns: FFIType.f64 },
});
lib.close();

await Bun.secrets.set({ service: "my-app", name: "token", value: "s3cr3t" });
const jar = new Bun.CookieMap("a=1; b=2");

if (Bun.Video.available) {
  const video = new Bun.Video("input.mp4");
  const metadata = await video.metadata();
  await video.frame(1).resize(640).png().write("preview.png");
  console.log(metadata);
}

await Bun.sleep(10);
console.log(
  Bun.stringWidth("héllo"),
  Bun.escapeHTML("<b>"),
  Bun.deepEquals({ a: 1 }, { a: 1 }),
  Bun.which("git"),
  jar.get("a"),
);
```
