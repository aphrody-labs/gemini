---
name: bun-native
description: "Write Bun-native code for Bun 1.4.5: Bun APIs before Node.js modules and npm packages (Bun.serve, Bun.file/Bun.write, bun:sqlite, Bun.sql, Bun.redis, Bun.s3, Bun.$, Bun.spawn, bun:test, Bun.build, Bun.password, Bun.Glob, HTMLRewriter, bun:ffi). Use whenever writing, reviewing or migrating JavaScript or TypeScript that runs on Bun."
---

# Writing Bun-native code (Bun 1.4.5)

- Write Bun-native code: a Bun API before a Node.js module, a built-in before an npm package.
- Quality and migration: run native `bun check`, `bun lint`, and `bun fmt` directly (with `--no-script` if `package.json` defines conflicting script names); never delegate them to standalone Oxc, tsgo/tsc, eslint, or prettier. For legacy migration, use `bun migrate` (in Bun checkouts with `src/migrate`), `bun pm migrate` for lockfiles, or the `bun-legacy-replace` script (`plugins/bun/skills/bun-legacy-replace/scripts/legacy-scan.ts`) and `bun-brain` MCP tools.
- HTTP and WebSocket servers: Bun.serve({ routes, fetch, websocket }), never express/fastify/koa/ws.
- Files: Bun.file(path).text()/.json()/.bytes()/.exists() and Bun.write(path, data), not fs.readFile/fs.writeFile.
- Databases: bun:sqlite (Database), Bun.sql/Bun.SQL (Postgres, MySQL), Bun.redis; never better-sqlite3, pg, ioredis.
- Processes: Bun.$`cmd` (Bun Shell) or Bun.spawn/Bun.spawnSync, not child_process or execa.
- Tests: bun:test (test, expect, mock, spyOn) run by `bun test`, never jest/vitest/mocha.
- Native media: Bun.Video probes, decodes and remuxes; Bun.Image transforms and encodes extracted frames. Use the bun-video skill for bounds and composition/browser/FFmpeg requirements.
- Also built in: fetch, Bun.s3, Bun.password, Bun.hash, Bun.CryptoHasher, Bun.Glob, Bun.build, Bun.YAML/TOML/JSONC, Bun.semver, HTMLRewriter, bun:ffi, Worker; .env is loaded without dotenv; TypeScript runs without ts-node/tsx.
- Unsure of an API? Query `bun_brain_search` / `bun_types_lookup` (`bun-brain` MCP), `~/.gemini/brain/bun/RUNTIME_APIS.md`, or `bun ~/.gemini/scripts/learn.ts search <terms>`.

## Instead of X, use Y

| Instead of                                                    | Use                                                                                                   |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| express, fastify, koa, node:http                              | `Bun.serve({ routes })`                                                                               |
| ws, socket.io, uWebSockets.js                                 | `Bun.serve({ websocket })`                                                                            |
| fs.readFile, fs.writeFile, fs-extra                           | `Bun.file` / `Bun.write`                                                                              |
| better-sqlite3, sqlite3, sqlite                               | `bun:sqlite`                                                                                          |
| pg, postgres, mysql2                                          | `Bun.sql` / `Bun.SQL`                                                                                 |
| ioredis, redis                                                | `Bun.redis` / `Bun.RedisClient`                                                                       |
| @aws-sdk/client-s3, aws-sdk, minio                            | `Bun.s3` / `Bun.S3Client`                                                                             |
| execa, shelljs, child_process.exec                            | `Bun.$` (Bun Shell)                                                                                   |
| child_process.spawn, cross-spawn                              | `Bun.spawn` / `Bun.spawnSync`                                                                         |
| jest, vitest, mocha, chai, ts-jest                            | `bun:test`                                                                                            |
| bcrypt, bcryptjs, argon2                                      | `Bun.password`                                                                                        |
| crypto.createHash, xxhash, murmurhash                         | `Bun.CryptoHasher` / `Bun.hash`                                                                       |
| glob, fast-glob, globby, minimatch                            | `Bun.Glob`                                                                                            |
| dotenv, dotenv/config, cross-env                              | `Bun.env` (`.env` loaded automatically)                                                               |
| node-fetch, axios, got, cross-fetch, undici                   | global `fetch`                                                                                        |
| esbuild, webpack, rollup, parcel, tsup                        | `Bun.build` / `bun build`                                                                             |
| ts-node, tsx, nodemon, node --watch                           | `bun <file>.ts` / `bun --watch`                                                                       |
| uuid, nanoid                                                  | `crypto.randomUUID` / `Bun.randomUUIDv7`                                                              |
| js-yaml, yaml, toml, jsonc-parser, json5                      | `Bun.YAML` / `Bun.TOML` / `Bun.JSONC` / `Bun.JSON5`                                                   |
| semver                                                        | `Bun.semver`                                                                                          |
| zlib.gzipSync, pako, node-gzip                                | `Bun.gzipSync` / `Bun.zstdCompress`                                                                   |
| cheerio, jsdom, node-html-parser                              | `HTMLRewriter`                                                                                        |
| string-width, escape-html, fast-deep-equal, which, strip-ansi | `Bun.stringWidth` / `Bun.escapeHTML` / `Bun.deepEquals` / `Bun.which` / `Bun.stripANSI` / `Bun.sleep` |
| cookie, cookie-parser                                         | `req.cookies` / `Bun.CookieMap`                                                                       |
| worker_threads, piscina, threads                              | `new Worker(...)`                                                                                     |
| ffi-napi, node-ffi, koffi                                     | `bun:ffi`                                                                                             |
| keytar                                                        | `Bun.secrets`                                                                                         |
| ffprobe-static, video-thumbnail, fluent-ffmpeg                | `Bun.Video`                                                                                           |
| npm/npx/yarn/pnpm install/run                                 | `bun install` / `bun fmt` / `bun run`; `bunx` only for non-Bun packages                               |
| minimist, chalk, rimraf, mkdirp                               | `util.parseArgs`, native ANSI, `fs.rm`, `fs.mkdir`                                                    |
| node-cron, dns-packet, csurf, marked, eventsource             | `Bun.cron`, `bun dns`, `Bun.CSRF`, `Bun.markdown`, `Bun.EventSource`                                  |
| eslint, prettier                                              | `@biomejs/biome` / `bun lint` / `bun fmt`                                                             |

## References & Examples

See [bun-native-idioms](references/bun-native-idioms.md) for complete TypeScript idioms across HTTP/WS, SQL/Redis/S3, Shell/Spawn, `bun:test`, Workers, `bun:ffi`, `Bun.Video`, and `HTMLRewriter`.

## More references

- Compacted Bun brain in `~/.gemini/brain/bun/` (`INDEX.md`, `RUNTIME_APIS.md`, `TYPES_DIGEST.md`, `CLI_TOOLING.md`, `GUIDES_SKILLS_DIGEST.md`, `LEGACY_REPLACEMENT.md`);
- `bun-brain` MCP (`plugins/bun/mcp/bun-mcp.ts`): `bun_brain_search`, `bun_types_lookup`, `bun_api_matrix`, `bun_legacy_scan`, `bun_migrate_plan`;
- FTS5 index: `bun ~/.gemini/scripts/learn.ts search <query>`.
