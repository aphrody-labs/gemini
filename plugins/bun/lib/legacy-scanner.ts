import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";

export type Severity = "info" | "warn" | "error";

export interface LegacyFinding {
  file: string;
  line: number;
  column: number;
  rule: string;
  severity: Severity;
  message: string;
  original: string;
  replacement?: string;
  fixable: boolean;
  aggressive: boolean;
}

export interface ScanResult {
  filesScanned: number;
  findings: LegacyFinding[];
  rewrites?: Array<{ file: string; original: string; updated: string }>;
}

export interface MigratePlan {
  root: string;
  target: "bun" | "rust";
  summary: {
    filesScanned: number;
    safeAutofixCount: number;
    aggressiveAutofixCount: number;
    replacePackagesCandidates: string[];
    advisoryCount: number;
  };
  steps: Array<{ phase: number; title: string; command?: string; items: string[] }>;
  rustTarget?: {
    addons: string[];
    hotPackages: Array<{ pkg: string; crate: string; area: string; repo?: string }>;
    tools: Array<{ tool: string; to: string; note: string }>;
  };
  findings: LegacyFinding[];
}

export const NODE_BUILTINS = new Set([
  "assert",
  "async_hooks",
  "buffer",
  "child_process",
  "cluster",
  "console",
  "constants",
  "crypto",
  "dgram",
  "diagnostics_channel",
  "dns",
  "domain",
  "events",
  "fs",
  "http",
  "http2",
  "https",
  "inspector",
  "module",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "repl",
  "sqlite",
  "stream",
  "string_decoder",
  "sys",
  "timers",
  "tls",
  "trace_events",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "wasi",
  "worker_threads",
  "zlib",
]);

export const PACKAGE_REPLACEMENTS: Array<{ id: string; packages: string[]; replacement: string; autoReplaceable?: boolean }> = [
  { id: "bun/sqlite", packages: ["better-sqlite3", "sqlite3"], replacement: "bun:sqlite" },
  { id: "bun/fetch", packages: ["node-fetch", "isomorphic-fetch", "cross-fetch", "undici"], replacement: "global fetch, Headers, Request, Response", autoReplaceable: true },
  { id: "bun/dotenv", packages: ["dotenv", "dotenv-cli"], replacement: ".env files loaded automatically by bun", autoReplaceable: true },
  { id: "bun/websocket", packages: ["ws"], replacement: "global WebSocket (client) or Bun.serve({ websocket }) (server)", autoReplaceable: true },
  { id: "bun/password", packages: ["bcrypt", "bcryptjs", "argon2"], replacement: "Bun.password" },
  { id: "bun/glob", packages: ["glob", "fast-glob", "globby", "tiny-glob"], replacement: "Bun.Glob", autoReplaceable: true },
  { id: "bun/yaml", packages: ["js-yaml", "yaml"], replacement: "Bun.YAML" },
  { id: "bun/toml", packages: ["toml", "smol-toml", "@iarna/toml"], replacement: "Bun.TOML" },
  { id: "bun/json5", packages: ["json5"], replacement: "Bun.JSON5" },
  { id: "bun/jsonc", packages: ["jsonc-parser"], replacement: "Bun.JSONC" },
  { id: "bun/markdown", packages: ["marked", "markdown-it"], replacement: "Bun.markdown" },
  { id: "bun/escape-html", packages: ["escape-html", "he", "lodash.escape"], replacement: "Bun.escapeHTML" },
  { id: "bun/cookie", packages: ["cookie", "cookie-parser"], replacement: "Bun.CookieMap" },
  { id: "bun/csrf", packages: ["csrf", "csurf"], replacement: "Bun.CSRF" },
  { id: "bun/string-width", packages: ["string-width"], replacement: "Bun.stringWidth" },
  { id: "bun/strip-ansi", packages: ["strip-ansi", "ansi-regex"], replacement: "Bun.stripANSI" },
  { id: "bun/slice-ansi", packages: ["slice-ansi"], replacement: "Bun.sliceAnsi" },
  { id: "bun/which", packages: ["which"], replacement: "Bun.which" },
  { id: "bun/deep-equals", packages: ["fast-deep-equal", "deep-equal", "lodash.isequal"], replacement: "Bun.deepEquals" },
  { id: "bun/spawn", packages: ["cross-spawn", "execa", "shelljs"], replacement: "Bun.spawn and Bun.$", autoReplaceable: true },
  { id: "bun/gzip", packages: ["pako"], replacement: "Bun.gzipSync / Bun.gunzipSync / Bun.deflateSync / Bun.inflateSync" },
  { id: "bun/s3", packages: ["@aws-sdk/client-s3"], replacement: "Bun.S3Client / Bun.s3" },
  { id: "bun/secrets", packages: ["keytar"], replacement: "Bun.secrets" },
  { id: "bun/form-data", packages: ["form-data"], replacement: "global FormData" },
  { id: "bun/abort-controller", packages: ["abort-controller"], replacement: "global AbortController" },
  { id: "bun/url", packages: ["whatwg-url"], replacement: "global URL" },
  { id: "bun/parse-args", packages: ["minimist"], replacement: "util.parseArgs" },
  { id: "bun/rm", packages: ["rimraf"], replacement: "fs.rm({ recursive: true, force: true })", autoReplaceable: true },
  { id: "bun/mkdir", packages: ["mkdirp"], replacement: "fs.mkdir({ recursive: true })" },
  { id: "bun/test", packages: ["jest", "mocha", "vitest", "@jest/globals", "ts-jest", "babel-jest", "@swc/jest", "jest-circus"], replacement: "bun test and bun:test" },
  { id: "bun/run-ts", packages: ["ts-node", "tsx", "esm"], replacement: "bun run" },
  { id: "bun/watch", packages: ["nodemon"], replacement: "bun --watch" },
  { id: "bun/lint", packages: ["eslint"], replacement: "bun lint" },
  { id: "bun/format", packages: ["prettier"], replacement: "bun fmt" },
  { id: "bun/types", packages: ["@types/node"], replacement: "@types/bun" },
  { id: "bun/uuid", packages: ["uuid"], replacement: "crypto.randomUUID / Bun.randomUUIDv7" },
  { id: "bun/del", packages: ["del"], replacement: "fs.rm and Bun.Glob" },
  { id: "bun/require-like", packages: ["require-like"], replacement: "module.createRequire", autoReplaceable: true },
];

const RUST_CRATE_REPOS: Record<string, string> = {
  oxc: "oxc-project/oxc",
  swc: "swc-project/swc",
  lightningcss: "parcel-bundler/lightningcss",
  rspack: "web-infra-dev/rspack",
  ignore: "BurntSushi/ripgrep",
  walkdir: "BurntSushi/walkdir",
  notify: "notify-rs/notify",
  blake3: "BLAKE3-team/BLAKE3",
  sha2: "RustCrypto/hashes",
  argon2: "RustCrypto/password-hashes",
  ring: "briansmith/ring",
  image: "image-rs/image",
  zstd: "gyscos/zstd-rs",
  flate2: "rust-lang/flate2-rs",
  comrak: "kivikakk/comrak",
  oxc_resolver: "oxc-project/oxc_resolver",
  "napi-rs": "napi-rs/napi-rs",
};

const RUST_ADDONS = new Set([
  "node-gyp",
  "nan",
  "node-addon-api",
  "bindings",
  "node-gyp-build",
  "prebuild-install",
  "prebuildify",
  "node-pre-gyp",
  "@mapbox/node-pre-gyp",
  "cmake-js",
]);

const RUST_HOT: Array<{ packages: string[]; crate: string; area: string }> = [
  { packages: ["md5", "js-sha256", "js-sha512", "sha.js", "hash.js"], crate: "blake3, sha2", area: "hashing" },
  { packages: ["crypto-js", "node-forge"], crate: "ring", area: "crypto" },
  { packages: ["argon2"], crate: "argon2", area: "crypto" },
  { packages: ["marked", "markdown-it"], crate: "comrak", area: "parsing" },
  { packages: ["acorn", "esprima", "@babel/parser"], crate: "oxc", area: "parsing" },
  { packages: ["@babel/core"], crate: "swc", area: "parsing" },
  { packages: ["enhanced-resolve"], crate: "oxc_resolver", area: "parsing" },
  { packages: ["postcss", "autoprefixer"], crate: "lightningcss", area: "parsing" },
  { packages: ["pako", "fflate"], crate: "flate2", area: "compression" },
  { packages: ["snappy", "node-zstd"], crate: "zstd", area: "compression" },
  { packages: ["sharp", "jimp", "pngjs"], crate: "image", area: "image" },
  { packages: ["glob", "globby", "fast-glob"], crate: "ignore", area: "glob and walk" },
  { packages: ["readdirp"], crate: "walkdir", area: "glob and walk" },
  { packages: ["chokidar"], crate: "notify", area: "glob and walk" },
];

const RUST_TOOLS: Array<{ name: string; to: string; note: string }> = [
  { name: "prettier", to: "bun fmt", note: "bun fmt reads [fmt] in bunfig.toml" },
  { name: "eslint", to: "bun lint", note: "bun lint runs ESLint rules from bunfig.toml" },
  { name: "tsc", to: "bun check", note: "bun check type-checks without emitting" },
  { name: "babel", to: "swc", note: ".swcrc replaces babel config" },
  { name: "postcss", to: "lightningcss", note: "CSS transforms without postcss JS plugins" },
  { name: "autoprefixer", to: "lightningcss", note: "adds vendor prefixes from browserslist" },
  { name: "webpack", to: "rspack build", note: "check loaders and plugins with rspack" },
  { name: "webpack-cli", to: "rspack build", note: "check loaders and plugins with rspack" },
];

interface TextRuleDef {
  id: string;
  kinds: string[];
  pattern: RegExp;
  replace?: string;
  message: string;
  severity: Severity;
  autofix: boolean;
  aggressive: boolean;
  requires?: RegExp;
  unless?: RegExp;
  importFrom?: string;
}

const SCRIPT_RULES: TextRuleDef[] = [
  { id: "cli/filter-npm", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\bnpm\s+run\s+(\S+)\s+--workspaces?\b/g, replace: "bun run --filter '*' $1", message: "npm run --workspaces becomes bun run --filter", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/filter-pnpm", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\bpnpm\s+(?:--filter|-F)[= ](?:"([^"]+)"|'([^']+)'|(\S+))\s+(?:--\S+\s+)*(?:run\s+|exec\s+)?/g, replace: "bun run --filter $1$2$3 ", message: "pnpm --filter becomes bun run --filter", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/filter-pnpm-all", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\bpnpm\s+(?:-r|--recursive)\s+(?:--\S+\s+)*(?:run\s+)?/g, replace: "bun run --filter '*' ", message: "pnpm -r becomes bun run --filter '*'", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/filter-yarn", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\byarn\s+workspaces\s+(?:foreach\s+(?:-\S+\s+)*)?run\s+/g, replace: "bun run --filter '*' ", message: "yarn workspaces run becomes bun run --filter '*'", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/filter-yarn-workspace", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\byarn\s+workspace\s+(\S+)\s+(?:run\s+)?/g, replace: "bun run --filter $1 ", message: "yarn workspace becomes bun run --filter", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/filter-lerna", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\blerna\s+run\s+/g, replace: "bun run --filter '*' ", message: "lerna run becomes bun run --filter '*'", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/cross-env", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\bcross-env(?:-shell)?\s+/g, replace: "", message: "Bun's shell reads VAR=value prefixes cross-platform; cross-env is not needed", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/add-dev", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm\s+(?:install|i)|pnpm\s+(?:add|install|i)|yarn\s+add)\s+(?:--save-dev|--dev|-D)\b/g, replace: "bun add --dev", message: "Add a dev dependency with bun add --dev", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/add-global", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm\s+(?:install|i)|pnpm\s+(?:add|install|i)|yarn\s+global\s+add)\s+(?:-g|--global)\b/g, replace: "bun add --global", message: "Add a global package with bun add --global", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/ci", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm\s+ci|pnpm\s+install\s+--frozen-lockfile|yarn\s+install\s+(?:--frozen-lockfile|--immutable))\b/g, replace: "bun install --frozen-lockfile", message: "Clean install from lockfile is bun install --frozen-lockfile", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/add", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm\s+(?:install|i)|pnpm\s+(?:add|install|i)|yarn\s+add)\s+(?=[@A-Za-z./])/g, replace: "bun add ", message: "Adding packages is bun add", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/install", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm|pnpm|yarn)\s+(?:install|i)\b/g, replace: "bun install", message: "Installing dependencies is bun install", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/remove", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm\s+(?:uninstall|remove|rm|un)|pnpm\s+(?:remove|rm|uninstall)|yarn\s+remove)\b/g, replace: "bun remove", message: "Removing packages is bun remove", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/run", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm|pnpm|yarn)\s+run\s+/g, replace: "bun run ", message: "Running a script is bun run", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/test-start", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm|pnpm|yarn)\s+(test|start)\b/g, replace: "bun run $1", message: "Run package script via bun run $1", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/exec", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npx|pnpm\s+dlx|pnpm\s+exec|yarn\s+dlx|yarn\s+exec|npm\s+exec(?:\s+--)?)\s+/g, replace: "bunx ", message: "Running a package binary is bunx", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/update", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm|pnpm|yarn)\s+(?:update|upgrade|up)\b/g, replace: "bun update", message: "Updating dependencies is bun update", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/outdated", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm|pnpm|yarn)\s+outdated\b/g, replace: "bun outdated", message: "Listing outdated dependencies is bun outdated", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/publish", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm|pnpm|yarn)\s+publish\b/g, replace: "bun publish", message: "Publishing is bun publish", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/pack", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm|pnpm|yarn)\s+pack\b/g, replace: "bun pm pack", message: "Packing a tarball is bun pm pack", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/link", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm|pnpm|yarn)\s+link\b/g, replace: "bun link", message: "Linking a package is bun link", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/init", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /\b(?:npm|pnpm|yarn)\s+init\b/g, replace: "bun init", message: "Creating package.json is bun init", severity: "warn", autofix: true, aggressive: false },
  { id: "cli/node", kinds: ["script", "shell", "ci", "dockerfile", "husky", "procfile"], pattern: /(^|[\s;&|(])(?:node|ts-node(?:-esm)?|tsx)(?=\s)/g, replace: "$1bun", message: "Runs script with bun instead of node/ts-node/tsx", severity: "warn", autofix: true, aggressive: true },
];

const SOURCE_RULES: TextRuleDef[] = [
  { id: "shebang/node", kinds: ["source", "shell"], pattern: /^#!\s*(?:\/usr\/bin\/env\s+(?:-S\s+)?(?:node|ts-node|tsx)|\/usr\/bin\/node|node)(?=\s|$)/m, replace: "#!/usr/bin/env bun", message: "Shebang can invoke bun", severity: "warn", autofix: true, aggressive: true },
  { id: "api/json-readFileSync", kinds: ["source"], pattern: /\bJSON\.parse\s*\(\s*fs\.readFileSync\s*\(\s*([^,)]+?)\s*,\s*["']utf-?8["']\s*\)\s*\)/g, replace: "await Bun.file($1).json()", message: "Bun.file(path).json() reads and parses a JSON file", severity: "warn", autofix: true, aggressive: true, importFrom: "fs" },
  { id: "api/fs-readFileSync", kinds: ["source"], pattern: /\bfs\.readFileSync\s*\(\s*([^,)]+?)\s*,\s*["']utf-?8["']\s*\)/g, replace: "await Bun.file($1).text()", message: "Bun.file(path).text() reads a file as text", severity: "warn", autofix: true, aggressive: true, importFrom: "fs" },
  { id: "api/fs-promises-readFile", kinds: ["source"], pattern: /\b(?:fsPromises|fs\.promises)\.readFile\s*\(\s*([^,)]+?)\s*,\s*["']utf-?8["']\s*\)/g, replace: "await Bun.file($1).text()", message: "Bun.file(path).text() reads a file as text", severity: "warn", autofix: true, aggressive: true },
  { id: "api/fs-writeFileSync", kinds: ["source"], pattern: /\bfs\.writeFileSync\s*\(\s*([^,]+?)\s*,\s*([^)]+?)\s*\)/g, replace: "await Bun.write($1, $2)", message: "Bun.write(path, data) writes a file", severity: "warn", autofix: true, aggressive: true, importFrom: "fs" },
  { id: "api/fs-existsSync", kinds: ["source"], pattern: /\bfs\.existsSync\s*\(\s*([^)]+?)\s*\)/g, replace: "await Bun.file($1).exists()", message: "Bun.file(path).exists() checks whether a file exists", severity: "warn", autofix: true, aggressive: true, importFrom: "fs" },
  { id: "api/sleep", kinds: ["source"], pattern: /\bnew\s+Promise\s*\(\s*\(?\s*(?:resolve|res|r)\s*\)?\s*=>\s*setTimeout\s*\(\s*(?:resolve|res|r)\s*,\s*([^)]+?)\s*\)\s*\)/g, replace: "Bun.sleep($1)", message: "Bun.sleep(ms) waits for a number of milliseconds", severity: "warn", autofix: true, aggressive: true },
  { id: "api/buffer-alloc", kinds: ["source"], pattern: /\bBuffer\.alloc\s*\(\s*([^,)]+?)\s*\)/g, replace: "new Uint8Array($1)", message: "Uint8Array is the standard type", severity: "warn", autofix: true, aggressive: true },
  { id: "api/dirname-esm", kinds: ["source"], pattern: /\b(?:const|let|var)\s+__dirname\s*=\s*(?:path\.)?dirname\s*\(\s*fileURLToPath\s*\(\s*import\.meta\.url\s*\)\s*\)/g, replace: "const __dirname = import.meta.dirname", message: "import.meta.dirname is the module directory", severity: "warn", autofix: true, aggressive: true },
  { id: "api/filename-esm", kinds: ["source"], pattern: /\b(?:const|let|var)\s+__filename\s*=\s*fileURLToPath\s*\(\s*import\.meta\.url\s*\)/g, replace: "const __filename = import.meta.filename", message: "import.meta.filename is the module path", severity: "warn", autofix: true, aggressive: true },
  { id: "globals/__dirname", kinds: ["source"], pattern: /\b__dirname\b/g, replace: "import.meta.dirname", message: "In an ES module, __dirname is import.meta.dirname", severity: "warn", autofix: true, aggressive: false, requires: /^\s*(?:import|export)\s/m, unless: /(?:const|let|var|function)\s+__dirname\b|\b__dirname\s*=/ },
  { id: "globals/__filename", kinds: ["source"], pattern: /\b__filename\b/g, replace: "import.meta.filename", message: "In an ES module, __filename is import.meta.filename", severity: "warn", autofix: true, aggressive: false, requires: /^\s*(?:import|export)\s/m, unless: /(?:const|let|var|function)\s+__filename\b|\b__filename\s*=/ },
  { id: "source/spawn-package-manager", kinds: ["source"], pattern: /\b(execa|execaSync|spawn|spawnSync|exec|execSync|execFile|execFileSync|fork)\s*\(\s*(["'`])(?:pnpm|yarn|npm)\2/g, replace: "$1($2bun$2", message: "Spawn bun instead of npm/yarn/pnpm", severity: "warn", autofix: true, aggressive: false },
  { id: "source/spawn-npx", kinds: ["source"], pattern: /\b(execa|execaSync|spawn|spawnSync|exec|execSync|execFile|execFileSync|fork)\s*\(\s*(["'`])npx\2/g, replace: "$1($2bunx$2", message: "Spawn bunx instead of npx", severity: "warn", autofix: true, aggressive: false },
  { id: "source/spawn-node", kinds: ["source"], pattern: /\b(execa|execaSync|spawn|spawnSync|exec|execSync|execFile|execFileSync|fork)\s*\(\s*(["'`])node\2/g, replace: "$1(process.execPath", message: "Spawn process.execPath instead of node", severity: "warn", autofix: true, aggressive: true },
  { id: "api/child-process", kinds: ["source"], pattern: /\b(?:child_process|cp)\.(?:exec|execSync|spawn|spawnSync)\s*\(/g, message: "Bun.spawn, Bun.spawnSync, and Bun.$ run commands natively", severity: "info", autofix: false, aggressive: false, importFrom: "child_process" },
  { id: "api/http-createServer", kinds: ["source"], pattern: /\bhttps?\.createServer\s*\(/g, message: "Bun.serve is the fetch-based HTTP server", severity: "info", autofix: false, aggressive: false, importFrom: "http" },
  { id: "api/crypto-createHash", kinds: ["source"], pattern: /\bcreateHash\s*\(/g, message: "Bun.CryptoHasher and Bun.hash hash data natively", severity: "info", autofix: false, aggressive: false, importFrom: "crypto" },
  { id: "api/bcrypt", kinds: ["source"], pattern: /\bbcrypt(?:js)?\.(?:hash|hashSync|compare|compareSync)\s*\(/g, message: "Bun.password.hash and Bun.password.verify support bcrypt and argon2", severity: "info", autofix: false, aggressive: false },
  { id: "api/yaml", kinds: ["source"], pattern: /\b(?:yaml|YAML|jsYaml)\.(?:parse|load|stringify|dump)\s*\(/g, message: "Bun.YAML.parse and Bun.YAML.stringify read and write YAML", severity: "info", autofix: false, aggressive: false },
  { id: "api/toml", kinds: ["source"], pattern: /\bTOML\.parse\s*\(/g, message: "Bun.TOML.parse reads TOML", severity: "info", autofix: false, aggressive: false, importFrom: "toml" },
  { id: "api/escape-html", kinds: ["source"], pattern: /(?<![.\w$])(?:escapeHtml|escapeHTML)\s*\(/g, message: "Bun.escapeHTML escapes HTML", severity: "info", autofix: false, aggressive: false },
  { id: "api/strip-ansi", kinds: ["source"], pattern: /(?<![.\w$])stripAnsi\s*\(/g, message: "Bun.stripANSI removes ANSI escape codes", severity: "info", autofix: false, aggressive: false, importFrom: "strip-ansi" },
  { id: "api/string-width", kinds: ["source"], pattern: /(?<![.\w$])stringWidth\s*\(/g, message: "Bun.stringWidth measures terminal width", severity: "info", autofix: false, aggressive: false, importFrom: "string-width" },
  { id: "api/which", kinds: ["source"], pattern: /(?<![.\w$])which(?:\.sync)?\s*\(/g, message: "Bun.which finds an executable", severity: "info", autofix: false, aggressive: false, importFrom: "which" },
  { id: "api/deep-equal", kinds: ["source"], pattern: /(?<![.\w$])(?:deepEqual|isEqual|equal)\s*\(/g, message: "Bun.deepEquals compares two values", severity: "info", autofix: false, aggressive: false, importFrom: "fast-deep-equal" },
  { id: "api/glob", kinds: ["source"], pattern: /(?<![.\w$])(?:glob|globSync|fg|fastGlob)(?:\.sync)?\s*\(/g, message: "Bun.Glob scans the file system with a glob pattern", severity: "info", autofix: false, aggressive: false, importFrom: "glob" },
  { id: "api/express", kinds: ["source"], pattern: /\bexpress\s*\(\s*\)/g, message: "Bun.serve({ routes }) is the built-in router (Express also runs on Bun)", severity: "info", autofix: false, aggressive: false, importFrom: "express" },
  { id: "api/require-resolve", kinds: ["source"], pattern: /\brequire\.resolve\s*\(/g, message: "import.meta.resolve and Bun.resolveSync resolve module paths", severity: "info", autofix: false, aggressive: false },
  { id: "api/set-immediate", kinds: ["source"], pattern: /(?<![.\w$])setImmediate\s*\(/g, message: "queueMicrotask and setTimeout are web-standard alternatives", severity: "info", autofix: false, aggressive: false },
];

const FILE_KIND_RULES: TextRuleDef[] = [
  { id: "docker/node-base-alpine", kinds: ["dockerfile"], pattern: /^(\s*FROM\s+(?:--\S+\s+)*)node:\S*alpine\S*/gm, replace: "$1oven/bun:1-alpine", message: "Use oven/bun:1-alpine base image", severity: "warn", autofix: true, aggressive: false },
  { id: "docker/node-base-slim", kinds: ["dockerfile"], pattern: /^(\s*FROM\s+(?:--\S+\s+)*)node:\S*slim\S*/gm, replace: "$1oven/bun:1-slim", message: "Use oven/bun:1-slim base image", severity: "warn", autofix: true, aggressive: false },
  { id: "docker/node-base", kinds: ["dockerfile"], pattern: /^(\s*FROM\s+(?:--\S+\s+)*)node:(?!\S*(?:alpine|slim))\S*/gm, replace: "$1oven/bun:1", message: "Use oven/bun:1 base image", severity: "warn", autofix: true, aggressive: false },
  { id: "compose/node-image-alpine", kinds: ["compose"], pattern: /^(\s*image:\s*["']?)node:[^\s"']*alpine[^\s"']*/gm, replace: "$1oven/bun:1-alpine", message: "Use oven/bun:1-alpine service image", severity: "warn", autofix: true, aggressive: false },
  { id: "compose/node-image-slim", kinds: ["compose"], pattern: /^(\s*image:\s*["']?)node:[^\s"']*slim[^\s"']*/gm, replace: "$1oven/bun:1-slim", message: "Use oven/bun:1-slim service image", severity: "warn", autofix: true, aggressive: false },
  { id: "compose/node-image", kinds: ["compose"], pattern: /^(\s*image:\s*["']?)node:(?![^\s"']*(?:alpine|slim))[^\s"']*/gm, replace: "$1oven/bun:1", message: "Use oven/bun:1 service image", severity: "warn", autofix: true, aggressive: false },
  { id: "ci/setup-node", kinds: ["ci"], pattern: /uses:\s*actions\/setup-node@\S+/g, replace: "uses: oven-sh/setup-bun@v2", message: "actions/setup-node becomes oven-sh/setup-bun@v2", severity: "warn", autofix: true, aggressive: false },
  { id: "ci/node-version", kinds: ["ci"], pattern: /\bnode-version:\s*["']?[^\n"']+["']?/g, replace: "bun-version: latest", message: "setup-bun reads bun-version", severity: "warn", autofix: true, aggressive: false },
  { id: "ci/package-manager-cache", kinds: ["ci"], pattern: /\n[ \t]*cache:[ \t]*["']?(?:npm|yarn|pnpm)["']?[ \t]*(?=\n)/g, replace: "", message: "setup-bun uses its own cache", severity: "warn", autofix: true, aggressive: false },
  { id: "ci/pnpm-setup", kinds: ["ci"], pattern: /uses:\s*pnpm\/action-setup@\S+/g, message: "pnpm/action-setup can be removed once scripts use bun", severity: "info", autofix: false, aggressive: false },
  { id: "turbo/lockfile-input", kinds: ["turbo"], pattern: /"(?:[^"]*\/)?(?:package-lock\.json|pnpm-lock\.yaml|yarn\.lock)"/g, replace: '"bun.lock"', message: "turbo.json references a non-Bun lockfile", severity: "warn", autofix: true, aggressive: false },
];

const SKIP_DIRS = new Set(["node_modules", ".git", ".turbo", ".next", ".yarn", ".pnpm-store", "dist", "coverage", "target"]);

function lineColAt(text: string, offset: number): { line: number; column: number } {
  const before = text.slice(0, Math.max(0, offset));
  const parts = before.split("\n");
  return { line: parts.length, column: (parts[parts.length - 1]?.length ?? 0) + 1 };
}

function classifyFileKind(filePath: string): string | null {
  const norm = filePath.replaceAll("\\", "/");
  const base = basename(norm).toLowerCase();
  if (base === "package.json") return "manifest";
  if (/^tsconfig.*\.json$/i.test(base)) return "tsconfig";
  if (base === "turbo.json") return "turbo";
  if (base === "dockerfile" || base.startsWith("dockerfile.")) return "dockerfile";
  if (/^(?:docker-)?compose.*\.ya?ml$/i.test(base)) return "compose";
  if (norm.includes("/.github/workflows/") || base === ".gitlab-ci.yml") return "ci";
  if (base === "procfile") return "procfile";
  if (norm.includes("/.husky/")) return "husky";
  if (/\.(?:sh|bash|zsh)$/i.test(base)) return "shell";
  if (/\.(?:js|jsx|ts|tsx|mjs|cjs|mts|cts)$/i.test(base)) return "source";
  return null;
}

function packageOfSpecifier(spec: string): string {
  if (spec.startsWith("@")) {
    const parts = spec.split("/");
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : spec;
  }
  return spec.split("/")[0] ?? spec;
}

function hasImportOf(text: string, modName: string): boolean {
  const escaped = modName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`["'](?:node:)?${escaped}(?:/[^"']*)?["']`).test(text);
}

function applyTextRules(
  text: string,
  fileLabel: string,
  kind: string,
  rules: TextRuleDef[],
  applySafe: boolean,
  applyAggressive: boolean,
  findings: LegacyFinding[],
  baseLine = 0,
): string {
  let current = text;
  for (const rule of rules) {
    if (!rule.kinds.includes(kind)) continue;
    if (rule.requires && !rule.requires.test(current)) continue;
    if (rule.unless && rule.unless.test(current)) continue;
    if (rule.importFrom && !hasImportOf(current, rule.importFrom)) continue;

    const re = new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : `${rule.pattern.flags}g`);
    let m: RegExpExecArray | null;
    const matches: Array<{ index: number; raw: string; replaced?: string }> = [];
    while ((m = re.exec(current)) !== null) {
      if (m[0].length === 0) {
        re.lastIndex++;
        continue;
      }
      const replaced =
        rule.replace !== undefined
          ? m[0].replace(new RegExp(rule.pattern.source, rule.pattern.flags.replace("g", "")), rule.replace)
          : undefined;
      matches.push({ index: m.index, raw: m[0], replaced });
    }
    if (matches.length === 0) continue;

    for (const hit of matches) {
      const lc = lineColAt(current, hit.index);
      findings.push({
        file: fileLabel,
        line: baseLine > 0 ? baseLine : lc.line,
        column: baseLine > 0 ? 1 : lc.column,
        rule: rule.id,
        severity: rule.severity,
        message: rule.message,
        original: hit.raw.trim().slice(0, 100),
        replacement: hit.replaced?.trim().slice(0, 100),
        fixable: rule.autofix && rule.replace !== undefined,
        aggressive: rule.aggressive,
      });
    }

    const shouldApply =
      rule.autofix &&
      rule.replace !== undefined &&
      ((rule.aggressive && applyAggressive) || (!rule.aggressive && applySafe));
    if (shouldApply) {
      current = current.replace(re, rule.replace!);
    }
  }
  return current;
}

export function scanCode(
  code: string,
  filename: string,
  opts: { fix?: boolean; aggressive?: boolean } = {},
): { findings: LegacyFinding[]; updated: string; changed: boolean } {
  const kind = classifyFileKind(filename) ?? "source";
  const applySafe = Boolean(opts.fix || opts.aggressive);
  const applyAggressive = Boolean(opts.aggressive);
  const findings: LegacyFinding[] = [];
  let updated = code;

  if (kind === "source") {
    const importRe = /((?:\bfrom\s*|\brequire\s*\(\s*|\bimport\s*\(\s*|^\s*import\s+))(["'])([^"'\n]+)\2/gm;
    const edits: Array<{ start: number; end: number; replacement: string }> = [];
    let m: RegExpExecArray | null;
    while ((m = importRe.exec(updated)) !== null) {
      const prefix = m[1]!;
      const quote = m[2]!;
      const spec = m[3]!;
      const specStart = m.index + prefix.length + quote.length;
      const head = spec.split("/")[0]!;
      if (!spec.startsWith("node:") && !spec.startsWith(".") && !spec.startsWith("/") && NODE_BUILTINS.has(head) && head !== "test") {
        const lc = lineColAt(updated, specStart);
        findings.push({
          file: filename,
          line: lc.line,
          column: lc.column,
          rule: "imports/node-prefix",
          severity: "warn",
          message: "Node.js core modules should use the node: prefix",
          original: spec,
          replacement: `node:${spec}`,
          fixable: true,
          aggressive: false,
        });
        if (applySafe) {
          edits.push({ start: specStart, end: specStart + spec.length, replacement: `node:${spec}` });
        }
      } else {
        const pkg = packageOfSpecifier(spec);
        const pkgRule = PACKAGE_REPLACEMENTS.find((r) => r.packages.includes(pkg));
        if (pkgRule) {
          const lc = lineColAt(updated, specStart);
          findings.push({
            file: filename,
            line: lc.line,
            column: lc.column,
            rule: pkgRule.id,
            severity: "info",
            message: `Bun covers ${pkg} with ${pkgRule.replacement}`,
            original: pkg,
            replacement: pkgRule.replacement,
            fixable: false,
            aggressive: false,
          });
        }
      }
    }
    if (edits.length > 0) {
      let next = "";
      let cursor = 0;
      for (const e of edits) {
        next += updated.slice(cursor, e.start) + e.replacement;
        cursor = e.end;
      }
      updated = next + updated.slice(cursor);
    }

    updated = applyTextRules(updated, filename, "source", SOURCE_RULES, applySafe, applyAggressive, findings);
  } else if (kind === "manifest") {
    try {
      const pkg = JSON.parse(updated) as Record<string, unknown>;
      let mutated = false;
      if (pkg.scripts && typeof pkg.scripts === "object") {
        const scripts = pkg.scripts as Record<string, unknown>;
        for (const [k, v] of Object.entries(scripts)) {
          if (typeof v !== "string") continue;
          const idx = updated.indexOf(`"${k}"`);
          const line = idx >= 0 ? lineColAt(updated, idx).line : 1;
          const nextCmd = applyTextRules(
            v,
            filename,
            "script",
            SCRIPT_RULES,
            applySafe,
            applyAggressive,
            findings,
            line,
          );
          if (applySafe && nextCmd !== v) {
            scripts[k] = nextCmd;
            mutated = true;
          }
        }
      }
      for (const sec of ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"]) {
        const deps = pkg[sec];
        if (!deps || typeof deps !== "object") continue;
        for (const dep of Object.keys(deps as Record<string, unknown>)) {
          const pkgRule = PACKAGE_REPLACEMENTS.find((r) => r.packages.includes(dep));
          if (pkgRule) {
            const idx = updated.indexOf(`"${dep}"`);
            const lc = idx >= 0 ? lineColAt(updated, idx) : { line: 1, column: 1 };
            findings.push({
              file: filename,
              line: lc.line,
              column: lc.column,
              rule: pkgRule.id,
              severity: "info",
              message: `Bun covers ${dep} (${sec}) with ${pkgRule.replacement}`,
              original: dep,
              replacement: pkgRule.replacement,
              fixable: false,
              aggressive: false,
            });
          }
        }
      }
      if (typeof pkg.packageManager === "string" && pkg.packageManager) {
        const idx = updated.indexOf('"packageManager"');
        const lc = idx >= 0 ? lineColAt(updated, idx) : { line: 1, column: 1 };
        findings.push({
          file: filename,
          line: lc.line,
          column: lc.column,
          rule: "manifest/package-manager",
          severity: "info",
          message: "packageManager pins another package manager via Corepack",
          original: pkg.packageManager,
          replacement: "(remove packageManager field)",
          fixable: true,
          aggressive: true,
        });
        if (applyAggressive) {
          delete pkg.packageManager;
          mutated = true;
        }
      }
      if (mutated) {
        updated = `${JSON.stringify(pkg, null, 2)}\n`;
      }
    } catch {
      findings.push({
        file: filename,
        line: 1,
        column: 1,
        rule: "manifest/syntax",
        severity: "error",
        message: "package.json is not valid JSON",
        original: "",
        fixable: false,
        aggressive: false,
      });
    }
  } else if (kind === "tsconfig") {
    try {
      const ts = JSON.parse(updated) as { compilerOptions?: Record<string, unknown> };
      const co = ts.compilerOptions ?? {};
      if (Array.isArray(co.types) && co.types.includes("node") && !co.types.includes("bun")) {
        findings.push({
          file: filename,
          line: 1,
          column: 1,
          rule: "tsconfig/types",
          severity: "info",
          message: 'compilerOptions.types lists "node" without "bun"; add "bun"',
          original: JSON.stringify(co.types),
          replacement: JSON.stringify([...co.types, "bun"]),
          fixable: false,
          aggressive: false,
        });
      }
      if (typeof co.moduleResolution === "string" && /^(?:node|node10|classic)$/i.test(co.moduleResolution)) {
        findings.push({
          file: filename,
          line: 1,
          column: 1,
          rule: "tsconfig/module-resolution",
          severity: "info",
          message: 'moduleResolution "bundler" matches how Bun resolves imports',
          original: co.moduleResolution,
          replacement: "bundler",
          fixable: false,
          aggressive: false,
        });
      }
      if (typeof co.module === "string" && /^(?:commonjs|amd|umd|system|none|es6|es2015)$/i.test(co.module)) {
        findings.push({
          file: filename,
          line: 1,
          column: 1,
          rule: "tsconfig/module",
          severity: "info",
          message: 'module "Preserve" or "ESNext" keeps ESM syntax as Bun executes it',
          original: co.module,
          replacement: "Preserve",
          fixable: false,
          aggressive: false,
        });
      }
    } catch {
      // Ignore JSONC comments in tsconfig.
    }
  } else {
    updated = applyTextRules(
      updated,
      filename,
      kind,
      [...FILE_KIND_RULES, ...SCRIPT_RULES],
      applySafe,
      applyAggressive,
      findings,
    );
  }

  return { findings, updated, changed: updated !== code };
}

function walkRepoFiles(targetPath: string, maxFiles: number, out: string[]): void {
  if (!existsSync(targetPath) || out.length >= maxFiles) return;
  const st = statSync(targetPath);
  if (st.isFile()) {
    out.push(targetPath);
    return;
  }
  for (const e of readdirSync(targetPath, { withFileTypes: true })) {
    if (out.length >= maxFiles) break;
    if (SKIP_DIRS.has(e.name)) continue;
    const full = join(targetPath, e.name);
    if (e.isDirectory()) walkRepoFiles(full, maxFiles, out);
    else if (e.isFile() && classifyFileKind(full) !== null) out.push(full);
  }
}

export function scanPath(
  targetPath: string,
  opts: { fix?: boolean; aggressive?: boolean; write?: boolean; maxFiles?: number } = {},
): ScanResult {
  const abs = resolve(targetPath);
  const maxFiles = opts.maxFiles ?? 2000;
  const files: string[] = [];
  walkRepoFiles(abs, maxFiles, files);
  const findings: LegacyFinding[] = [];
  const rewrites: Array<{ file: string; original: string; updated: string }> = [];

  const rootForRel = existsSync(abs) && statSync(abs).isDirectory() ? abs : resolve(abs, "..");
  for (const f of files) {
    const raw = readFileSync(f, "utf8");
    const rel = relative(rootForRel, f).replaceAll("\\", "/") || basename(f);
    const res = scanCode(raw, rel, { fix: opts.fix || opts.write, aggressive: opts.aggressive });
    findings.push(...res.findings);
    if (res.changed) {
      rewrites.push({ file: rel, original: raw, updated: res.updated });
      if (opts.write) {
        writeFileSync(f, res.updated, "utf8");
      }
    }
  }

  return { filesScanned: files.length, findings, rewrites: rewrites.length > 0 ? rewrites : undefined };
}

export function buildMigratePlan(
  rootPath: string,
  opts: { target?: "bun" | "rust" } = {},
): MigratePlan {
  const abs = resolve(rootPath);
  const scan = scanPath(abs);
  const safeCount = scan.findings.filter((f) => f.fixable && !f.aggressive).length;
  const aggCount = scan.findings.filter((f) => f.fixable && f.aggressive).length;
  const advisoryCount = scan.findings.filter((f) => !f.fixable).length;

  const pkgRules = new Set(scan.findings.map((f) => f.original));
  const replaceCandidates = PACKAGE_REPLACEMENTS.filter((r) => r.autoReplaceable)
    .flatMap((r) => r.packages)
    .filter((p) => pkgRules.has(p));

  const lockfiles: string[] = [];
  for (const lf of ["package-lock.json", "yarn.lock", "pnpm-lock.yaml"]) {
    if (existsSync(join(abs, lf))) lockfiles.push(lf);
  }

  const steps: MigratePlan["steps"] = [
    {
      phase: 1,
      title: "Apply safe script, import, CI, and Dockerfile rewrites",
      command: "bun plugins/bun/skills/bun-legacy-replace/scripts/legacy-scan.ts . --fix",
      items: [
        `${safeCount} safe autofixable finding(s) (node: import prefixes, package.json scripts, Dockerfile/CI)`,
        ...scan.findings.filter((f) => f.fixable && !f.aggressive).slice(0, 8).map((f) => `${f.file}:${f.line} [${f.rule}] ${f.original} -> ${f.replacement ?? ""}`),
      ],
    },
    {
      phase: 2,
      title: "Migrate lockfile & install with Bun",
      command: "bun install",
      items: lockfiles.length > 0
        ? [`Detected lockfile(s): ${lockfiles.join(", ")} -> run bun install (or bun pm migrate) to generate bun.lock`]
        : ["Run bun install to generate bun.lock"],
    },
    {
      phase: 3,
      title: "Review aggressive runtime rewrites & replace legacy packages",
      command: "bun plugins/bun/skills/bun-legacy-replace/scripts/legacy-scan.ts . --aggressive",
      items: [
        `${aggCount} behavior-changing autofixable finding(s) (fs.*Sync -> Bun.file/write, node -> bun)`,
        `${replaceCandidates.length} auto-replaceable npm package(s): ${replaceCandidates.join(", ") || "none"}`,
      ],
    },
    {
      phase: 4,
      title: "Validate with native Bun toolchain",
      command: "bun check && bun lint && bun fmt --check && bun test",
      items: ["Type-check with TS 7, lint, verify formatting, and run tests natively on Bun"],
    },
  ];

  const target = opts.target ?? "bun";
  let rustTarget: MigratePlan["rustTarget"];
  if (target === "rust") {
    const addonsFound = new Set<string>();
    const hotFound: Array<{ pkg: string; crate: string; area: string; repo?: string }> = [];
    const toolsFound: Array<{ tool: string; to: string; note: string }> = [];
    const candidateNames = new Set<string>(scan.findings.map((f) => f.original));
    const pkgJsonPath = join(abs, "package.json");
    if (existsSync(pkgJsonPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8")) as Record<string, unknown>;
        for (const sec of ["dependencies", "devDependencies", "optionalDependencies"]) {
          const secObj = pkg[sec];
          if (secObj && typeof secObj === "object") {
            for (const dep of Object.keys(secObj as Record<string, unknown>)) {
              candidateNames.add(dep);
            }
          }
        }
      } catch {
        // Ignore invalid package.json.
      }
    }
    for (const name of candidateNames) {
      if (RUST_ADDONS.has(name)) addonsFound.add(name);
      const hot = RUST_HOT.find((h) => h.packages.includes(name));
      if (hot && !hotFound.some((x) => x.pkg === name)) {
        const primaryCrate = hot.crate.split(",")[0]!.trim();
        hotFound.push({ pkg: name, crate: hot.crate, area: hot.area, repo: RUST_CRATE_REPOS[primaryCrate] });
      }
      for (const t of RUST_TOOLS) {
        if (name.includes(t.name) && !toolsFound.some((x) => x.tool === t.name)) {
          toolsFound.push({ tool: t.name, to: t.to, note: t.note });
        }
      }
    }
    if (existsSync(join(abs, "binding.gyp"))) addonsFound.add("binding.gyp");
    rustTarget = {
      addons: [...addonsFound],
      hotPackages: hotFound,
      tools: toolsFound,
    };
  }

  return {
    root: abs,
    target,
    summary: {
      filesScanned: scan.filesScanned,
      safeAutofixCount: safeCount,
      aggressiveAutofixCount: aggCount,
      replacePackagesCandidates: replaceCandidates,
      advisoryCount,
    },
    steps,
    rustTarget,
    findings: scan.findings,
  };
}
