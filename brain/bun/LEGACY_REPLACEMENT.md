# Legacy JS/TS/Node -> Bun Replacement Matrix

Generated from `src/migrate/registry/*.toml`, `src/migrate/replace_packages.rs`, `src/migrate/scan.rs`, and verified against `packages/bun-types`.

## 1. Auto-Rewritable npm Packages (`--replace-packages` in `replace_packages.rs`)

| Rule ID | npm Packages | Bun Replacement | Notes |
| :--- | :--- | :--- | :--- |
| `replace/execa` | `execa` | `Bun.$` | AST/call-safe full file rewrite + package.json cleanup |
| `replace/glob` | `glob`, `fast-glob`, `globby` | `Bun.Glob` | AST/call-safe full file rewrite + package.json cleanup |
| `replace/rimraf` | `rimraf` | `fs.rm` | AST/call-safe full file rewrite + package.json cleanup |
| `replace/del` | `del` | `fs.rm and Bun.Glob` | Manual rewrite required (globs) |
| `replace/require-like` | `require-like` | `module.createRequire` | AST/call-safe full file rewrite + package.json cleanup |
| `replace/dotenv` | `dotenv` | `the .env files that bun reads` | AST/call-safe full file rewrite + package.json cleanup |
| `replace/node-fetch` | `node-fetch`, `undici` | `the global fetch` | AST/call-safe full file rewrite + package.json cleanup |
| `replace/ws` | `ws` | `the global WebSocket` | AST/call-safe full file rewrite + package.json cleanup |

## 2. Package Replacements (`packages.toml` + `bun-types` Verification)

| Rule ID | Legacy npm Packages | Bun Replacement | `bun-types` Check |
| :--- | :--- | :--- | :--- |
| `bun/sqlite` | `better-sqlite3`, `sqlite3` | bun:sqlite | built-in |
| `bun/fetch` | `node-fetch`, `isomorphic-fetch`, `cross-fetch`, `undici` | the global fetch, Headers, Request and Response | built-in |
| `bun/dotenv` | `dotenv`, `dotenv-cli` | .env files, which bun reads on start | built-in |
| `bun/websocket` | `ws` | the global WebSocket client (the ws server has no replacement) | built-in |
| `bun/password` | `bcrypt`, `bcryptjs`, `argon2` | Bun.password | `Bun.password` (in bun-types) |
| `bun/glob` | `glob`, `fast-glob`, `globby`, `tiny-glob` | Bun.Glob | `Bun.Glob` (in bun-types) |
| `bun/yaml` | `js-yaml`, `yaml` | Bun.YAML | `Bun.YAML` (in bun-types) |
| `bun/toml` | `toml`, `smol-toml`, `@iarna/toml` | Bun.TOML | `Bun.TOML` (in bun-types) |
| `bun/json5` | `json5` | Bun.JSON5 | `Bun.JSON5` (in bun-types) |
| `bun/jsonc` | `jsonc-parser` | Bun.JSONC | `Bun.JSONC` (in bun-types) |
| `bun/markdown` | `marked`, `markdown-it` | Bun.markdown (the output can differ) | `Bun.markdown` (in bun-types) |
| `bun/escape-html` | `escape-html`, `he`, `lodash.escape` | Bun.escapeHTML | `Bun.escapeHTML` (in bun-types) |
| `bun/cookie` | `cookie`, `cookie-parser` | Bun.CookieMap | `Bun.CookieMap` (in bun-types) |
| `bun/csrf` | `csrf`, `csurf` | Bun.CSRF | `Bun.CSRF` (in bun-types) |
| `bun/string-width` | `string-width` | Bun.stringWidth | `Bun.stringWidth` (in bun-types) |
| `bun/strip-ansi` | `strip-ansi`, `ansi-regex` | Bun.stripANSI | `Bun.stripANSI` (in bun-types) |
| `bun/slice-ansi` | `slice-ansi` | Bun.sliceAnsi | `Bun.sliceAnsi` (in bun-types) |
| `bun/which` | `which` | Bun.which | `Bun.which` (in bun-types) |
| `bun/deep-equals` | `fast-deep-equal`, `deep-equal`, `lodash.isequal` | Bun.deepEquals | `Bun.deepEquals` (in bun-types) |
| `bun/spawn` | `cross-spawn`, `execa`, `shelljs` | Bun.spawn and the Bun.$ shell | `Bun.spawn` (in bun-types), `Bun.$` (in bun-types) |
| `bun/gzip` | `pako` | Bun.gzipSync, Bun.gunzipSync, Bun.deflateSync and Bun.inflateSync | `Bun.gzipSync` (in bun-types), `Bun.gunzipSync` (in bun-types), `Bun.deflateSync` (in bun-types), `Bun.inflateSync` (in bun-types) |
| `bun/s3` | `@aws-sdk/client-s3` | Bun.S3Client for object reads, writes and presigned URLs | `Bun.S3Client` (in bun-types) |
| `bun/secrets` | `keytar` | Bun.secrets | `Bun.secrets` (in bun-types) |
| `bun/form-data` | `form-data` | the global FormData | built-in |
| `bun/abort-controller` | `abort-controller` | the global AbortController | built-in |
| `bun/url` | `whatwg-url` | the global URL | built-in |
| `bun/parse-args` | `minimist` | util.parseArgs | built-in |
| `bun/rm` | `rimraf` | fs.rm with recursive and force | built-in |
| `bun/mkdir` | `mkdirp` | fs.mkdir with recursive | built-in |
| `bun/test` | `jest`, `mocha`, `vitest`, `@jest/globals`, `ts-jest`, `babel-jest`, `@swc/jest`, `jest-circus` | bun test, which reads Jest-style tests and imports from bun:test | built-in |
| `bun/run-ts` | `ts-node`, `tsx`, `esm` | bun run, which runs TypeScript and ES modules directly | built-in |
| `bun/watch` | `nodemon` | bun --watch | built-in |
| `bun/lint` | `eslint` | bun lint | built-in |
| `bun/format` | `prettier` | bun fmt | built-in |
| `bun/types` | `@types/node` | @types/bun, which declares the Node.js APIs that Bun implements | built-in |
| `bun/uuid` | `uuid` | crypto.randomUUID for version 4 and Bun.randomUUIDv7 for version 7 | `Bun.randomUUIDv7` (in bun-types) |

## 3. Source API & Global Rewrites (`apis.toml`, `files.toml`, `scan.rs`)

| Rule ID | Pattern | Replacement | Mode | Message |
| :--- | :--- | :--- | :--- | :--- |
| `imports/node-prefix` | Bare Node core module (`fs`, `path`, ...) | `node:<mod>` | safe autofix | Node.js core modules are imported with the `node:` prefix |
| `manifest/package-manager` | `packageManager` field in `package.json` | remove field | aggressive autofix | `packageManager` selects another package manager through Corepack |
| `api/fs-readFileSync` | `\bfs\.readFileSync\s*\(\s*([^,)]+?)\s*,\s*[\x22\x27]utf-?8[\x22\x27]\s*\)` | `await Bun.file($1).text()` | aggressive autofix | Bun.file(path).text() reads a file as text |
| `api/fs-promises-readFile` | `\b(?:fsPromises\|fs\.promises)\.readFile\s*\(\s*([^,)]+?)\s*,\s*[\x22\x27]utf-?8` | `await Bun.file($1).text()` | aggressive autofix | Bun.file(path).text() reads a file as text |
| `api/fs-writeFileSync` | `\bfs\.writeFileSync\s*\(\s*([^,]+?)\s*,\s*([^)]+?)\s*\)` | `await Bun.write($1, $2)` | aggressive autofix | Bun.write(path, data) writes a file |
| `api/json-readFileSync` | `\bJSON\.parse\s*\(\s*fs\.readFileSync\s*\(\s*([^,)]+?)\s*,\s*[\x22\x27]utf-?8[\x` | `await Bun.file($1).json()` | aggressive autofix | Bun.file(path).json() reads and parses a JSON file |
| `api/fs-existsSync` | `\bfs\.existsSync\s*\(\s*([^)]+?)\s*\)` | `await Bun.file($1).exists()` | aggressive autofix | Bun.file(path).exists() resolves true for a file; it is false for a directory |
| `api/sleep` | `\bnew\s+Promise\s*\(\s*\(?\s*(?:resolve\|res\|r)\s*\)?\s*=>\s*setTimeout\s*\(\s*` | `Bun.sleep($1)` | aggressive autofix | Bun.sleep(ms) waits for a number of milliseconds |
| `api/buffer-alloc` | `\bBuffer\.alloc\s*\(\s*([^,)]+?)\s*\)` | `new Uint8Array($1)` | aggressive autofix | Uint8Array is the standard type; Buffer methods are not available on the result |
| `api/dirname-esm` | `\b(?:const\|let\|var)\s+__dirname\s*=\s*(?:path\.)?dirname\s*\(\s*fileURLToPath\` | `const __dirname = import.meta.dirname` | aggressive autofix | import.meta.dirname is the directory of the module |
| `api/filename-esm` | `\b(?:const\|let\|var)\s+__filename\s*=\s*fileURLToPath\s*\(\s*import\.meta\.url\` | `const __filename = import.meta.filename` | aggressive autofix | import.meta.filename is the path of the module |
| `api/child-process` | `\b(?:child_process\|cp)\.(?:exec\|execSync\|spawn\|spawnSync)\s*\(` | _manual_ | advisory | Bun.spawn, Bun.spawnSync and the Bun.$ shell run commands |
| `api/exec-import` | `(?<![.\w$])(?:exec\|execSync)\s*\(` | _manual_ | advisory | Bun.$ and Bun.spawn run commands |
| `api/http-createServer` | `\bhttps?\.createServer\s*\(` | _manual_ | advisory | Bun.serve is the fetch-based HTTP server |
| `api/crypto-createHash` | `\bcreateHash\s*\(` | _manual_ | advisory | Bun.CryptoHasher and Bun.hash hash data |
| `api/bcrypt` | `\bbcrypt(?:js)?\.(?:hash\|hashSync\|compare\|compareSync)\s*\(` | _manual_ | advisory | Bun.password.hash and Bun.password.verify support bcrypt and argon2 |
| `api/yaml` | `\b(?:yaml\|YAML\|jsYaml)\.(?:parse\|load\|stringify\|dump)\s*\(` | _manual_ | advisory | Bun.YAML.parse and Bun.YAML.stringify read and write YAML |
| `api/toml` | `\bTOML\.parse\s*\(` | _manual_ | advisory | Bun.TOML.parse reads TOML |
| `api/escape-html` | `(?<![.\w$])(?:escapeHtml\|escapeHTML)\s*\(` | _manual_ | advisory | Bun.escapeHTML escapes HTML |
| `api/strip-ansi` | `(?<![.\w$])stripAnsi\s*\(` | _manual_ | advisory | Bun.stripANSI removes ANSI escape codes |
| `api/string-width` | `(?<![.\w$])stringWidth\s*\(` | _manual_ | advisory | Bun.stringWidth measures the width of a string in a terminal |
| `api/which` | `(?<![.\w$])which(?:\.sync)?\s*\(` | _manual_ | advisory | Bun.which finds an executable |
| `api/deep-equal` | `(?<![.\w$])(?:deepEqual\|isEqual\|equal)\s*\(` | _manual_ | advisory | Bun.deepEquals compares two values |
| `api/glob` | `(?<![.\w$])(?:glob\|globSync\|fg\|fastGlob)(?:\.sync)?\s*\(` | _manual_ | advisory | Bun.Glob scans the file system with a glob pattern |
| `api/express` | `\bexpress\s*\(\s*\)` | _manual_ | advisory | Bun.serve is a fetch-based HTTP server; Express keeps working under Bun |
| `api/require-resolve` | `\brequire\.resolve\s*\(` | _manual_ | advisory | import.meta.resolve and Bun.resolveSync resolve a module path |
| `api/set-immediate` | `(?<![.\w$])setImmediate\s*\(` | _manual_ | advisory | setImmediate is not a web standard; queueMicrotask and setTimeout are |
| `shebang/node` | `^#!\s*(?:/usr/bin/env\s+(?:-S\s+)?(?:node\|ts-node\|tsx)\|/usr/bin/node\|node)(?` | `#!/usr/bin/env bun` | aggressive autofix | The shebang can run Bun |
| `globals/__dirname` | `\b__dirname\b` | `import.meta.dirname` | safe autofix | In an ES module, __dirname is import.meta.dirname |
| `globals/__filename` | `\b__filename\b` | `import.meta.filename` | safe autofix | In an ES module, __filename is import.meta.filename |

## 4. CLI, Scripts, Docker, CI, & JSON Rewrites (`scripts.toml`, `files.toml`, `json.toml`)

| Rule ID | Scope / Files | Replacement | Mode | Message |
| :--- | :--- | :--- | :--- | :--- |
| `cli/filter-npm` | script,shell,ci,dockerfile,husky,procfile | `bun run --filter '*' $1` | safe autofix | npm run --workspaces becomes bun run --filter |
| `cli/filter-pnpm` | script,shell,ci,dockerfile,husky,procfile | `bun run --filter $1 ` | safe autofix | pnpm --filter becomes bun run --filter |
| `cli/filter-pnpm-all` | script,shell,ci,dockerfile,husky,procfile | `bun run --filter '*' ` | safe autofix | pnpm -r becomes bun run --filter '*' |
| `cli/filter-yarn` | script,shell,ci,dockerfile,husky,procfile | `bun run --filter '*' ` | safe autofix | yarn workspaces run becomes bun run --filter '*' |
| `cli/filter-yarn-workspace` | script,shell,ci,dockerfile,husky,procfile | `bun run --filter $1 ` | safe autofix | yarn workspace becomes bun run --filter |
| `cli/filter-lerna` | script,shell,ci,dockerfile,husky,procfile | `bun run --filter '*' ` | safe autofix | lerna run becomes bun run --filter '*' |
| `cli/cross-env` | script,shell,ci,dockerfile,husky,procfile | `` | safe autofix | Bun's shell reads VAR=value prefixes on every platform, cross-env is not needed |
| `cli/add-dev` | script,shell,ci,dockerfile,husky,procfile | `bun add --dev` | safe autofix | Add a dev dependency with bun add --dev |
| `cli/add-global` | script,shell,ci,dockerfile,husky,procfile | `bun add --global` | safe autofix | Add a global package with bun add --global |
| `cli/ci` | script,shell,ci,dockerfile,husky,procfile | `bun install --frozen-lockfile` | safe autofix | A clean install from the lockfile is bun install --frozen-lockfile |
| `cli/add` | script,shell,ci,dockerfile,husky,procfile | `bun add ` | safe autofix | Adding packages is bun add |
| `cli/install` | script,shell,ci,dockerfile,husky,procfile | `bun install` | safe autofix | Installing dependencies is bun install |
| `cli/yarn-bare` | script,shell,ci,dockerfile,husky,procfile | `${1}bun install` | safe autofix | A bare yarn installs dependencies: bun install |
| `cli/remove` | script,shell,ci,dockerfile,husky,procfile | `bun remove` | safe autofix | Removing packages is bun remove |
| `cli/run` | script,shell,ci,dockerfile,husky,procfile | `bun run ` | safe autofix | Running a script is bun run |
| `cli/test-start` | script,shell,ci,dockerfile,husky,procfile | `bun run $1` | safe autofix | bun test is Bun's test runner, so the test script runs with bun run test |
| `cli/exec` | script,shell,ci,dockerfile,husky,procfile | `bunx ` | safe autofix | Running a package binary is bunx |
| `cli/update` | script,shell,ci,dockerfile,husky,procfile | `bun update` | safe autofix | Updating dependencies is bun update |
| `cli/outdated` | script,shell,ci,dockerfile,husky,procfile | `bun outdated` | safe autofix | Listing outdated dependencies is bun outdated |
| `cli/publish` | script,shell,ci,dockerfile,husky,procfile | `bun publish` | safe autofix | Publishing is bun publish |
| `cli/pack` | script,shell,ci,dockerfile,husky,procfile | `bun pm pack` | safe autofix | Packing a tarball is bun pm pack |
| `cli/link` | script,shell,ci,dockerfile,husky,procfile | `bun link` | safe autofix | Linking a package is bun link |
| `cli/init` | script,shell,ci,dockerfile,husky,procfile | `bun init` | safe autofix | Creating a package.json is bun init |
| `cli/node` | script,shell,ci,dockerfile,husky,procfile | `${1}bun` | aggressive autofix | Runs the script with Bun instead of Node (the runtime changes) |
| `source/spawn-package-manager` | source | `$1($2bun$2` | safe autofix | A script that starts a package manager starts bun instead |
| `source/spawn-npx` | source | `$1($2bunx$2` | safe autofix | A script that starts npx starts bunx instead |
| `source/spawn-node` | source | `$1(process.execPath` | aggressive autofix | A script that starts node starts the running runtime instead |
| `source/command-install` | source | `${1}bun install` | safe autofix | A command string that installs with a package manager installs with bun |
| `source/command-run` | source | `${1}bun run ` | safe autofix | A command string that runs a script with a package manager runs it with bun |
| `source/command-npx` | source | `${1}bunx ` | safe autofix | A command string that starts npx starts bunx |
| `docker/node-base-alpine` | dockerfile | `${1}oven/bun:1-alpine` | safe autofix | The base image can be the Bun image, which has no Node.js or npm |
| `docker/node-base-slim` | dockerfile | `${1}oven/bun:1-slim` | safe autofix | The base image can be the Bun image, which has no Node.js or npm |
| `docker/node-base` | dockerfile | `${1}oven/bun:1` | safe autofix | The base image can be the Bun image, which has no Node.js or npm |
| `compose/node-image-alpine` | compose | `${1}oven/bun:1-alpine` | safe autofix | The service image can be the Bun image |
| `compose/node-image-slim` | compose | `${1}oven/bun:1-slim` | safe autofix | The service image can be the Bun image |
| `compose/node-image` | compose | `${1}oven/bun:1` | safe autofix | The service image can be the Bun image |
| `ci/setup-node` | ci | `uses: oven-sh/setup-bun@v2` | safe autofix | actions/setup-node becomes oven-sh/setup-bun |
| `ci/node-version` | ci | `bun-version: latest` | safe autofix | setup-bun reads bun-version |
| `ci/package-manager-cache` | ci | `` | safe autofix | setup-bun has no package manager cache input; bun install uses its own cache |
| `ci/pnpm-setup` | ci | _manual_ | advisory | This step installs pnpm and can be removed once the scripts use bun |
| `turbo/lockfile-input` | turbo | `"bun.lock"` | safe autofix | turbo.json lists a lockfile that bun install no longer writes |
| `tsconfig/types` | tsconfig*.json (`compilerOptions.types`) | see message | advisory | compilerOptions.types lists node and not bun: add bun, or Bun's globals have no types |
| `tsconfig/module-resolution` | tsconfig*.json (`compilerOptions.moduleResolution`) | see message | advisory | moduleResolution bundler matches how Bun resolves imports |
| `tsconfig/module` | tsconfig*.json (`compilerOptions.module`) | see message | advisory | module Preserve or ESNext keeps import and export statements, which Bun runs as they are |

## 5. Rust Porting Target (`--target rust` from `rust.toml`)

### Crates

| Crate | Upstream Repo |
| :--- | :--- |
| `oxc` | `oxc-project/oxc` |
| `swc` | `swc-project/swc` |
| `lightningcss` | `parcel-bundler/lightningcss` |
| `rspack` | `web-infra-dev/rspack` |
| `ignore` | `BurntSushi/ripgrep` |
| `walkdir` | `BurntSushi/walkdir` |
| `notify` | `notify-rs/notify` |
| `blake3` | `BLAKE3-team/BLAKE3` |
| `sha2` | `RustCrypto/hashes` |
| `argon2` | `RustCrypto/password-hashes` |
| `ring` | `briansmith/ring` |
| `image` | `image-rs/image` |
| `zstd` | `gyscos/zstd-rs` |
| `flate2` | `rust-lang/flate2-rs` |
| `comrak` | `kivikakk/comrak` |
| `oxc_resolver` | `oxc-project/oxc_resolver` |
| `napi-rs` | `napi-rs/napi-rs` |

### Native Addon Loaders (`binding.gyp` / `node-gyp` -> Rust cdylib via `bun:ffi`)

- `node-gyp`, `nan`, `node-addon-api`, `bindings`, `node-gyp-build`, `prebuild-install`, `prebuildify`, `node-pre-gyp`, `@mapbox/node-pre-gyp`, `cmake-js`

### CPU-Bound Hot Packages -> Rust Crates

| Area | npm Packages | Rust Crate |
| :--- | :--- | :--- |
| hashing | `md5`, `js-sha256`, `js-sha512`, `sha.js`, `hash.js` | `blake3, sha2` |
| crypto | `crypto-js`, `node-forge` | `ring` |
| crypto | `argon2` | `argon2` |
| parsing | `marked`, `markdown-it` | `comrak` |
| parsing | `acorn`, `esprima`, `@babel/parser` | `oxc` |
| parsing | `@babel/core` | `swc` |
| parsing | `enhanced-resolve` | `oxc_resolver` |
| parsing | `postcss`, `autoprefixer` | `lightningcss` |
| compression | `pako`, `fflate` | `flate2` |
| compression | `snappy`, `node-zstd` | `zstd` |
| image | `sharp`, `jimp`, `pngjs` | `image` |
| glob and walk | `glob`, `globby`, `fast-glob` | `ignore` |
| glob and walk | `readdirp` | `walkdir` |
| glob and walk | `chokidar` | `notify` |

### JS CLI Tools -> Native Commands / Rust Tools

| Tool | Target | Crate | Notes |
| :--- | :--- | :--- | :--- |
| `prettier` | `bun fmt` | (built into bun) | bun fmt reads the [fmt] section of bunfig.toml |
| `eslint` | `bun lint` | (built into bun) | bun lint runs ESLint's rules; its configuration is bunfig.toml |
| `tsc` | `bun check` | (built into bun) | bun check type-checks without emitting |
| `babel` | `swc` | `swc` | .swcrc replaces the babel configuration |
| `postcss` | `lightningcss` | `lightningcss` | postcss plugins have no equivalent |
| `autoprefixer` | `lightningcss` | `lightningcss` | lightningcss adds vendor prefixes from the browserslist targets |
| `webpack` | `rspack build` | `rspack` | check that loaders and plugins work with rspack |
| `webpack-cli` | `rspack build` | `rspack` | check that loaders and plugins work with rspack |
