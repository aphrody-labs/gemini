import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export type RewriteOptions = {
  bunCheckout?: boolean;
  aphrody?: boolean;
};

export type Rewrite = { command: string; changes: string[] };

type Token = { raw: string; value: string; start: number; end: number };
type Segment = { tokens: Token[] };

const SEPARATORS = ["&&", "||", ";;", "|&", ";", "|", "&", "\n", "(", ")"];
const ENV_ASSIGNMENT = /^[A-Za-z_][A-Za-z0-9_]*=/;
const WRAPPERS = new Set(["time", "command", "exec", "nohup", "env"]);

export function isBunCheckout(cwd?: string): boolean {
  let dir = resolve(cwd || process.cwd());
  for (let i = 0; i < 8; i++) {
    const pkg = join(dir, "package.json");
    if (existsSync(pkg)) {
      try {
        const parsed = JSON.parse(readFileSync(pkg, "utf8")) as {
          name?: string;
        };
        if (parsed.name === "bun" && existsSync(join(dir, "src", "bun.js"))) {
          return true;
        }
      } catch {
        // Ignore malformed package.json.
      }
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return false;
}

export function hasAphrodyBun(): boolean {
  const url =
    (process.release as { sourceUrl?: string } | undefined)?.sourceUrl ?? "";
  if (url.includes("aphrody-labs/bun")) return true;
  return (
    Bun.spawnSync([process.execPath, "uv", "--help"], {
      stdout: "ignore",
      stderr: "ignore",
      stdin: "ignore",
    }).exitCode === 0
  );
}

function segments(line: string): Segment[] {
  const out: Segment[] = [];
  let tokens: Token[] = [];
  let i = 0;
  const flush = () => {
    if (tokens.length) out.push({ tokens });
    tokens = [];
  };
  while (i < line.length) {
    const c = line[i];
    if (c === " " || c === "\t" || c === "\r") {
      i++;
      continue;
    }
    if (c === "#" && (i === 0 || /\s/.test(line[i - 1]))) {
      while (i < line.length && line[i] !== "\n") i++;
      continue;
    }
    if (line.startsWith("<<", i)) break;
    const sep = SEPARATORS.find((s) => line.startsWith(s, i));
    if (sep) {
      flush();
      i += sep.length;
      continue;
    }
    const start = i;
    let value = "";
    let depth = 0;
    while (i < line.length) {
      const ch = line[i];
      if (
        depth === 0 &&
        (/\s/.test(ch) ||
          SEPARATORS.some((s) => line.startsWith(s, i)) ||
          line.startsWith("<<", i))
      ) {
        break;
      }
      if (ch === "\\" && i + 1 < line.length) {
        value += line[i + 1];
        i += 2;
      } else if (ch === "'") {
        const close = line.indexOf("'", i + 1);
        const stop = close === -1 ? line.length : close;
        value += line.slice(i + 1, stop);
        i = stop + 1;
      } else if (ch === '"') {
        let j = i + 1;
        while (j < line.length && line[j] !== '"') {
          if (line[j] === "\\" && j + 1 < line.length) j++;
          value += line[j];
          j++;
        }
        i = j + 1;
      } else if (ch === "`") {
        const close = line.indexOf("`", i + 1);
        const stop = close === -1 ? line.length : close;
        value += line.slice(i, stop + 1);
        i = stop + 1;
      } else if (ch === "$" && line[i + 1] === "(") {
        depth++;
        value += "$(";
        i += 2;
      } else if (depth > 0 && ch === ")") {
        depth--;
        value += ch;
        i++;
      } else {
        value += ch;
        i++;
      }
    }
    i = Math.min(i, line.length);
    tokens.push({ raw: line.slice(start, i), value, start, end: i });
  }
  flush();
  return out;
}

function commandName(value: string): string {
  return value.replace(/\.(exe|cmd|bat|ps1)$/i, "").toLowerCase();
}

function installFlags(args: string[]): string[] {
  const out: string[] = [];
  for (const a of args) {
    if (a === "--save-dev" || a === "-D") out.push("--dev");
    else if (a === "--save-optional" || a === "-O") out.push("--optional");
    else if (a === "--save-peer") out.push("--peer");
    else if (a === "--save-exact" || a === "-E") out.push("--exact");
    else if (
      a === "--save" ||
      a === "-S" ||
      a === "--legacy-peer-deps" ||
      a === "--no-fund" ||
      a === "--no-audit"
    )
      continue;
    else if (a === "--global") out.push("-g");
    else out.push(a);
  }
  return out;
}

function bunxArgs(args: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (
      a === "-y" ||
      a === "--yes" ||
      a === "--no-install" ||
      a === "-q" ||
      a === "--quiet"
    )
      continue;
    if (a === "--") continue;
    if ((a === "-p" || a === "--package") && i + 1 < args.length) {
      out.push(`--package=${args[++i]}`);
      continue;
    }
    out.push(a);
  }
  return out;
}

const NPM_ALIASES: Record<string, (rest: string[]) => string[] | undefined> = {
  install: (rest) => ["bun", "install", ...installFlags(rest)],
  i: (rest) => ["bun", "i", ...installFlags(rest)],
  add: (rest) => ["bun", "add", ...installFlags(rest)],
  ci: (rest) => ["bun", "install", "--frozen-lockfile", ...installFlags(rest)],
  uninstall: (rest) => ["bun", "remove", ...rest],
  remove: (rest) => ["bun", "remove", ...rest],
  rm: (rest) => ["bun", "remove", ...rest],
  run: (rest) => ["bun", "run", ...rest.filter((a) => a !== "--")],
  test: (rest) => ["bun", "run", "test", ...rest.filter((a) => a !== "--")],
  t: (rest) => ["bun", "run", "test", ...rest.filter((a) => a !== "--")],
  start: (rest) => ["bun", "run", "start", ...rest.filter((a) => a !== "--")],
  exec: (rest) => ["bunx", ...bunxArgs(rest)],
  x: (rest) => ["bunx", ...bunxArgs(rest)],
  update: (rest) => ["bun", "update", ...rest],
  outdated: (rest) => ["bun", "outdated", ...rest],
  audit: (rest) => ["bun", "audit", ...rest],
  publish: (rest) => ["bun", "publish", ...rest],
  link: (rest) => ["bun", "link", ...rest],
  unlink: (rest) => ["bun", "unlink", ...rest],
  init: (rest) => [
    "bun",
    "init",
    ...rest.filter((a) => a !== "-y" && a !== "--yes"),
  ],
  create: (rest) => ["bun", "create", ...rest],
};

function quote(arg: string): string {
  if (arg === "") return "''";
  return /^[\w@%+=:,./\\^~-]+$/.test(arg)
    ? arg
    : `'${arg.replace(/'/g, `'\\''`)}'`;
}

export function rewriteCommand(
  line: string,
  options: RewriteOptions = {},
): Rewrite | undefined {
  if (/#\s*keep-(node|npm|tool)\b/.test(line)) return undefined;
  const edits: { start: number; end: number; text: string; change: string }[] =
    [];
  for (const { tokens } of segments(line)) {
    let k = 0;
    while (k < tokens.length && ENV_ASSIGNMENT.test(tokens[k].value)) k++;
    while (k < tokens.length && WRAPPERS.has(tokens[k].value)) {
      k++;
      while (k < tokens.length && ENV_ASSIGNMENT.test(tokens[k].value)) k++;
    }
    if (k >= tokens.length) continue;
    const head = tokens[k];
    if (/[\\/]/.test(head.value)) continue;
    const name = commandName(head.value);
    const argTokens = tokens.slice(k + 1);
    const args = argTokens.map((t) => t.value);
    let next: string[] | undefined;
    switch (name) {
      case "npm":
        next = args.length === 0 ? ["bun", "install"] : NPM_ALIASES[args[0]]?.(args.slice(1));
        break;
      case "npx":
      case "pnpx":
        next = ["bunx", ...bunxArgs(args)];
        break;
      case "yarn":
        if (args.length === 0) next = ["bun", "install"];
        else if (args[0] === "dlx") next = ["bunx", ...bunxArgs(args.slice(1))];
        else if (args[0] === "add") next = ["bun", "add", ...installFlags(args.slice(1))];
        else if (args[0] === "remove") next = ["bun", "remove", ...args.slice(1)];
        else if (args[0] === "install") next = ["bun", "install", ...installFlags(args.slice(1))];
        else if (args[0] === "run") next = ["bun", "run", ...args.slice(1)];
        else if (!args[0].startsWith("-")) next = ["bun", "run", ...args];
        break;
      case "pnpm":
        if (args.length === 0 || args[0] === "install" || args[0] === "i") {
          next = ["bun", "install", ...installFlags(args.slice(1))];
        } else if (args[0] === "dlx" || args[0] === "exec") {
          next = ["bunx", ...bunxArgs(args.slice(1))];
        } else if (args[0] === "add") {
          next = ["bun", "add", ...installFlags(args.slice(1))];
        } else if (args[0] === "remove" || args[0] === "rm") {
          next = ["bun", "remove", ...args.slice(1)];
        } else if (args[0] === "run") {
          next = ["bun", "run", ...args.slice(1).filter((a) => a !== "--")];
        } else if (!args[0].startsWith("-")) {
          next = ["bun", "run", ...args];
        }
        break;
      case "node":
      case "nodejs":
        next = ["bun", ...args];
        break;
      case "pip":
      case "pip3":
        if (options.aphrody) next = ["bun", "uv", "pip", ...args];
        break;
      case "python":
      case "python3":
      case "py":
        if (options.aphrody) {
          next =
            args[0] === "-m" && (args[1] === "pip" || args[1] === "pip3")
              ? ["bun", "uv", "pip", ...args.slice(2)]
              : ["bun", "uv", "run", "python", ...args];
        }
        break;
      case "bun":
        if (options.bunCheckout && args[0] === "test") {
          next = ["bun", "bd", "test", ...args.slice(1)];
        }
        break;
    }
    if (!next) continue;
    const rawByValue = new Map(argTokens.map((t) => [t.value, t.raw]));
    const text = next.map((a) => rawByValue.get(a) ?? quote(a)).join(" ");
    const end = argTokens.length
      ? argTokens[argTokens.length - 1].end
      : head.end;
    const before = line.slice(head.start, end);
    if (text === before) continue;
    edits.push({
      start: head.start,
      end,
      text,
      change: `${before} -> ${text}`,
    });
  }
  if (edits.length === 0) return undefined;
  let out = line;
  for (const e of edits.sort((a, b) => b.start - a.start)) {
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
  }
  return { command: out, changes: edits.reverse().map((e) => e.change) };
}
