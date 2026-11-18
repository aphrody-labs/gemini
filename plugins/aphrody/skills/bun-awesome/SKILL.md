---
name: bun-awesome
description: "Curated Bun 1.4+ stack, ecosystem libraries, frameworks, and architectural patterns. Use when choosing libraries or templates for web servers, APIs, databases, fullstack apps, workers, containers, or CI with Bun."
---

# Awesome Bun Ecosystem & Stack Guide

Prefer Bun's built-in zero-dependency APIs first; add external libraries only where they complement Bun cleanly without duplicating built-ins.

## Zero-Dependency Built-In Stack (Prefer First)

| Layer | Built-In Bun API | Avoid Adding |
| :--- | :--- | :--- |
| HTTP & Routing | `Bun.serve({ routes, fetch, error })` | `express`, `koa`, `http-server` |
| WebSockets | `Bun.serve({ websocket })` + global `WebSocket` | `ws`, `socket.io` (when WS suffices) |
| SQLite / SQL | `bun:sqlite` (`Database`), `Bun.sql` / `Bun.SQL` (Postgres, MySQL, SQLite) | `better-sqlite3`, `sqlite3`, `pg`, `mysql2` |
| Valkey / Redis | `Bun.redis` / `Bun.RedisClient` | `ioredis`, `redis` |
| S3 Object Storage | `Bun.s3` / `Bun.S3Client` | `@aws-sdk/client-s3`, `minio` |
| File I/O & Glob | `Bun.file()`, `Bun.write()`, `new Bun.Glob()` | `fs-extra`, `glob`, `fast-glob`, `rimraf` |
| Shell & Subprocess | ``Bun.$`...` ``, `Bun.spawn()`, `Bun.spawnSync()` | `execa`, `cross-spawn`, `shelljs`, `cross-env` |
| Auth & Crypto | `Bun.password` (argon2/bcrypt), `Bun.CryptoHasher`, `Bun.hash`, `Bun.CSRF` | `bcrypt`, `bcryptjs`, `argon2`, `csurf` |
| Formats & HTML | `Bun.YAML`, `Bun.TOML`, `Bun.JSON5`, `Bun.JSONC`, `Bun.JSONL`, `Bun.XML`, `Bun.markdown`, `HTMLRewriter` | `js-yaml`, `yaml`, `toml`, `json5`, `marked`, `cheerio` |
| Archives & Cron | `Bun.Archive`, `Bun.cron` | `tar`, `archiver`, `node-cron` |
| Browser Automation | `Bun.WebView` | heavy standalone wrappers when `Bun.WebView` covers scraping/testing |
| Bundler & Fullstack | `Bun.build()`, `bun build --compile`, HTML imports (`import index from "./index.html"`) | `webpack`, `esbuild`, `tsup`, `vite` (for simple SPAs) |
| QA & Tooling | `bun check`, `bun lint`, `bun fmt`, `bun test` | `tsc`, `eslint`, `prettier`, `jest`, `vitest`, `tsx` |

## Recommended Ecosystem Libraries (From `docs/guides/ecosystem/`)

- **Typed HTTP APIs**: **Hono** (`hono`) for ultra-lightweight WinterCG middleware; **Elysia** (`elysia`) for Bun-native end-to-end type safety; or zero-dep `Bun.serve({ routes })`.
- **SQL & Schema Migrations**: **Drizzle ORM** (`drizzle-orm` with `bun:sqlite` or `Bun.sql` / Neon) or **Prisma** when schema-first modeling is needed.
- **Frontend & SSR**: React 19 + Bun fullstack HTML imports (`bun --hot ./src/index.ts`), **Astro**, **Next.js**, **TanStack Start**, **SvelteKit**, **SolidStart**.
- **Observability**: `@sentry/bun` for error/performance tracing.
- **Containers & CI**:
  - Docker base images: `oven/bun:1-alpine` (minimal production), `oven/bun:1-slim`, `oven/bun:1` (never `node:*` images).
  - GitHub Actions: `oven-sh/setup-bun@v2` + `bun install --frozen-lockfile` + `bun check --no-script` + `bun lint --no-script` + `bun fmt --check --no-script` + `bun test`.

Cross-check detailed guide snippets in `~/.gemini/brain/bun/GUIDES_SKILLS_DIGEST.md` or query `bun_brain_search`.
