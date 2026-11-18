---
name: bun-legacy-replace
description: "Analyze and migrate legacy Node.js, npm/Yarn/pnpm, CommonJS, Dockerfile, CI, and tsconfig codebases to Bun 1.4+ native APIs and commands. Use when scanning for legacy JS/TS patterns, replacing npm packages with Bun built-ins, or planning a Bun/Rust migration."
---

# Legacy JS/TS -> Bun Replacement

Use the compacted migration matrix in `~/.gemini/brain/bun/LEGACY_REPLACEMENT.md`, the `bun-brain` MCP tools (`bun_legacy_scan`, `bun_migrate_plan`), and the bundled analyzer/codemod script [legacy-scan.ts](./scripts/legacy-scan.ts).

## Quick Workflow

1. **Read-only audit**:
   ```sh
   bun ~/.gemini/plugins/bun/skills/bun-legacy-replace/scripts/legacy-scan.ts <repo-or-file>
   ```
   Or call `bun_legacy_scan` / `bun_migrate_plan` via the `bun-brain` MCP server.

2. **Phased migration plan** (adds `--target rust` crate/addon/tool recommendations when requested):
   ```sh
   bun ~/.gemini/plugins/bun/skills/bun-legacy-replace/scripts/legacy-scan.ts <repo> --plan --target bun --json
   ```

3. **Apply safe autofixes** (`node:` import prefixes, `package.json` `npm`/`pnpm`/`yarn`/`npx` scripts, ESM `__dirname`/`__filename`, `Dockerfile` `oven/bun:1*`, GitHub Actions `oven-sh/setup-bun@v2`, `turbo.json` lockfile):
   ```sh
   bun ~/.gemini/plugins/bun/skills/bun-legacy-replace/scripts/legacy-scan.ts <repo> --fix --write
   ```

4. **Review behavior-changing (`--aggressive`) rewrites before applying**:
   - `fs.readFileSync(p, "utf8")` -> `await Bun.file(p).text()`
   - `JSON.parse(fs.readFileSync(p, "utf8"))` -> `await Bun.file(p).json()`
   - `fs.writeFileSync(p, d)` -> `await Bun.write(p, d)`
   - `fs.existsSync(p)` -> `await Bun.file(p).exists()`
   - `new Promise(r => setTimeout(r, ms))` -> `Bun.sleep(ms)`
   - `Buffer.alloc(n)` -> `new Uint8Array(n)` (note: Buffer methods are not on `Uint8Array`)
   - `node` / `ts-node` / `tsx` scripts & shebangs -> `bun` / `#!/usr/bin/env bun`

5. **Lockfile & verification**:
   - Convert `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` with `bun install` (or `bun pm migrate`).
   - On Bun checkout builds that ship `migrate_command.rs`, `bun migrate --write [--aggressive] [--replace-packages]` runs the Rust `bun_migrate` engine natively.
   - Verify after every migration batch:
     ```sh
     bun check --no-script && bun lint --no-script && bun fmt --check --no-script && bun test
     ```

## Key Replacement Matrix Summary

| Legacy Pattern / Package | Bun Replacement |
| :--- | :--- |
| `better-sqlite3`, `sqlite3` | `bun:sqlite` (`Database`) |
| `node-fetch`, `cross-fetch`, `undici` | global `fetch`, `Headers`, `Request`, `Response` |
| `ws` | `Bun.serve({ websocket })` (server), global `WebSocket` (client) |
| `dotenv`, `dotenv-cli`, `cross-env` | `.env` auto-loading (`Bun.env`) + Bun Shell env prefixes |
| `execa`, `cross-spawn`, `shelljs` | ``Bun.$`...` `` and `Bun.spawn` / `Bun.spawnSync` |
| `glob`, `fast-glob`, `globby` | `new Bun.Glob(pattern)` |
| `bcrypt`, `bcryptjs`, `argon2` | `Bun.password.hash` / `Bun.password.verify` |
| `js-yaml`, `yaml`, `toml`, `json5`, `jsonc-parser` | `Bun.YAML`, `Bun.TOML`, `Bun.JSON5`, `Bun.JSONC` |
| `jest`, `vitest`, `mocha`, `ts-jest` | `bun:test` + `bun test` |
| `ts-node`, `tsx`, `nodemon` | `bun <file>.ts` + `bun --watch` / `bun --hot` |
| `eslint`, `prettier`, `tsc --noEmit` | `bun lint`, `bun fmt`, `bun check` |
| `@types/node` | `@types/bun` (`"types": ["bun"]` in `tsconfig.json`) |
