// xh HTTP client knowledge, code graph, use-case catalog, curl translator, offline request builder,
// and non-interactive request runner as a stdio MCP server (protocol 2025-11-25, one JSON message per line).
// Registered by [[hub.mcp]] xh in apps/agents/toolchain.toml (hub.json).
// Skill: .agents/skills/xh | Data: packages/ai-os/data/xh/xh-knowledge.json.
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

type Rpc = {
  jsonrpc?: string;
  id?: number | string | null;
  method?: string;
  params?: Record<string, any>;
};

type Reply = {
  jsonrpc: "2.0";
  id: number | string | null;
  result?: unknown;
  error?: { code: number; message: string };
};

export interface XhTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  readOnly: boolean;
  run: (args: Record<string, unknown>) => Promise<unknown>;
}

export interface XhOptions {
  bin?: string[];
  knowledgePath?: string;
}

const MAX_OUT = 400_000;

const ok = (id: Reply["id"], result: unknown): Reply => ({
  jsonrpc: "2.0",
  id,
  result,
});

const fail = (id: Reply["id"], code: number, message: string): Reply => ({
  jsonrpc: "2.0",
  id,
  error: { code, message },
});

function defaultKnowledgePath(): string {
  const local = join(import.meta.dir, "xh-knowledge.json");
  if (existsSync(local)) return local;
  return join(import.meta.dir, "..", "..", "data", "xh", "xh-knowledge.json");
}

function loadKnowledge(pathOverride?: string): any {
  const path = pathOverride ?? defaultKnowledgePath();
  return JSON.parse(readFileSync(path, "utf8"));
}

function resolveXhBin(override?: string[]): string[] {
  if (override && override.length > 0) return override;
  if (Bun.env.XH_BIN) return [Bun.env.XH_BIN];
  const onPath = Bun.which("xh");
  if (onPath) return [onPath];
  const localBin = join(
    homedir(),
    ".local",
    "bin",
    process.platform === "win32" ? "xh.exe" : "xh",
  );
  if (existsSync(localBin)) return [localBin];
  throw new Error("xh binary not found on PATH or ~/.local/bin (set XH_BIN to override)");
}

async function execXh(
  argv: string[],
  opts: XhOptions,
  stdinText?: string,
  timeoutMs = 35_000,
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  const bin = resolveXhBin(opts.bin);
  const proc = Bun.spawn([...bin, ...argv], {
    stdin: stdinText !== undefined ? Buffer.from(stdinText, "utf8") : "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  const timer = setTimeout(() => proc.kill(), timeoutMs);
  try {
    const [stdout, stderr, exitCode] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
      proc.exited,
    ]);
    return {
      exitCode,
      stdout: stdout.slice(0, MAX_OUT),
      stderr: stderr.slice(0, MAX_OUT),
    };
  } finally {
    clearTimeout(timer);
  }
}

function asStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${field} (non-empty string[]) is required`);
  }
  return value.map((v) => String(v));
}

function matchesQuery(item: unknown, q: string): boolean {
  return JSON.stringify(item).toLowerCase().includes(q);
}

function statusCategory(code: number): string {
  switch (code) {
    case 0:
      return "ok";
    case 1:
      return "usage_or_network_error";
    case 2:
      return "timeout";
    case 3:
      return "redirect_3xx";
    case 4:
      return "client_error_4xx";
    case 5:
      return "server_error_5xx";
    case 6:
      return "too_many_redirects";
    default:
      return "error";
  }
}

export function xhTools(opts: XhOptions = {}): XhTool[] {
  const data = () => loadKnowledge(opts.knowledgePath);

  return [
    {
      name: "xh_docs",
      description:
        "Query xh v0.26.3 CLI help, man page (doc/xh.1.md), request-item separators, exit codes 0..6, environment variables, binary modes (xh/xhs/http/https), config files, and FAQ.",
      inputSchema: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: [
              "all",
              "options",
              "request_items",
              "exit_codes",
              "env",
              "files",
              "binary_modes",
              "url_shorthands",
              "faq",
            ],
            description: "Documentation slice (default all).",
          },
          query: {
            type: "string",
            description: "Optional case-insensitive filter across entries.",
          },
        },
      },
      readOnly: true,
      run: async (a) => {
        const k = data();
        const section = typeof a.section === "string" ? a.section : "all";
        const q = typeof a.query === "string" ? a.query.trim().toLowerCase() : "";
        const filter = <T>(arr: T[]): T[] => (q ? arr.filter((x) => matchesQuery(x, q)) : arr);

        switch (section) {
          case "options":
            return { usage: k.cli.usage, negationRule: k.cli.negationRule, options: filter(k.cli.options) };
          case "request_items":
            return { requestItems: filter(k.cli.requestItems) };
          case "exit_codes":
            return { exitCodes: filter(k.cli.exitCodes) };
          case "env":
            return { envVars: filter(k.cli.envVars) };
          case "files":
            return { files: filter(k.cli.files) };
          case "binary_modes":
            return { binaryModes: filter(k.cli.binaryModes) };
          case "url_shorthands":
            return { urlShorthands: filter(k.cli.urlShorthands) };
          case "faq":
            return { faq: filter(k.faq) };
          default:
            return {
              meta: k.meta,
              usage: k.cli.usage,
              negationRule: k.cli.negationRule,
              binaryModes: filter(k.cli.binaryModes),
              urlShorthands: filter(k.cli.urlShorthands),
              requestItems: filter(k.cli.requestItems),
              options: filter(k.cli.options),
              exitCodes: filter(k.cli.exitCodes),
              envVars: filter(k.cli.envVars),
              files: filter(k.cli.files),
              faq: filter(k.faq),
            };
        }
      },
    },
    {
      name: "xh_code_graph",
      description:
        "Inspect the xh Rust codebase Tree-sitter code graph (3,826 nodes, 6,714 edges, 169 communities): execution pipeline, god nodes, 24 Rust modules, symbols, imports, and Cargo features.",
      inputSchema: {
        type: "object",
        properties: {
          view: {
            type: "string",
            enum: ["summary", "pipeline", "god_nodes", "modules", "features", "all"],
            description: "Code graph slice to return (default summary).",
          },
          query: {
            type: "string",
            description: "Optional filter across module filenames, roles, symbols, imports, or features.",
          },
        },
      },
      readOnly: true,
      run: async (a) => {
        const g = data().codeGraph;
        const view = typeof a.view === "string" ? a.view : "summary";
        const q = typeof a.query === "string" ? a.query.trim().toLowerCase() : "";
        const filter = <T>(arr: T[]): T[] => (q ? arr.filter((x) => matchesQuery(x, q)) : arr);

        if (q && view === "summary") {
          return {
            summary: g.summary,
            modules: filter(g.modules),
            features: filter(g.features),
          };
        }
        switch (view) {
          case "pipeline":
            return { pipeline: g.pipeline };
          case "god_nodes":
            return { godNodes: g.godNodes };
          case "modules":
            return { modules: filter(g.modules) };
          case "features":
            return { features: filter(g.features) };
          case "all":
            return {
              engine: g.engine,
              summary: g.summary,
              godNodes: g.godNodes,
              pipeline: g.pipeline,
              modules: filter(g.modules),
              features: filter(g.features),
            };
          default:
            return {
              engine: g.engine,
              summary: g.summary,
              godNodes: g.godNodes,
              pipeline: g.pipeline,
            };
        }
      },
    },
    {
      name: "xh_use_cases",
      description:
        "Search or retrieve structured xh HTTP use-case recipes (REST, JSON paths, forms, multipart, auth, sessions, downloads, curl translation, CI checks, TLS/mTLS, proxies, HTTP/2-3, RFC 9421 signatures).",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string", description: "Exact use-case id to retrieve." },
          category: {
            type: "string",
            enum: ["rest-api", "forms", "auth", "files", "diagnostics", "automation", "security", "network", "output"],
            description: "Optional category filter.",
          },
          query: { type: "string", description: "Optional keyword search across title, summary, command, and notes." },
        },
      },
      readOnly: true,
      run: async (a) => {
        const cases: any[] = data().useCases;
        const id = typeof a.id === "string" ? a.id.trim() : "";
        if (id) {
          const hit = cases.find((c) => c.id === id);
          return hit ?? { error: `unknown use case: ${id}` };
        }
        let filtered = cases;
        const category = typeof a.category === "string" ? a.category.trim() : "";
        if (category) {
          filtered = filtered.filter((c) => c.category === category);
        }
        const query = typeof a.query === "string" ? a.query.trim().toLowerCase() : "";
        if (query) {
          filtered = filtered.filter((c) => matchesQuery(c, query));
        }
        return { count: filtered.length, useCases: filtered };
      },
    },
    {
      name: "xh_translate_curl",
      description:
        "Translate an xh invocation into an equivalent curl command offline using `xh --curl` (or `--curl-long`). Never sends network traffic.",
      inputSchema: {
        type: "object",
        properties: {
          args: {
            type: "array",
            items: { type: "string" },
            description: "Arguments for xh (e.g. ['post', 'https://api.example.com/items', 'name=widget']).",
          },
          long: { type: "boolean", description: "Use --curl-long flag names (default false)." },
        },
        required: ["args"],
      },
      readOnly: true,
      run: async (a) => {
        const rawArgs = asStringArray(a.args, "args").filter((x) => x !== "--offline");
        const flag = a.long === true ? "--curl-long" : "--curl";
        const res = await execXh([flag, "-I", ...rawArgs], opts, undefined, 10_000);
        return {
          exitCode: res.exitCode,
          curl: res.stdout.trim(),
          warnings: res.stderr.trim(),
        };
      },
    },
    {
      name: "xh_build_request",
      description:
        "Build and inspect the exact HTTP request (headers + serialized body) offline via `xh --offline -I -p HB --pretty=none` without sending any network request.",
      inputSchema: {
        type: "object",
        properties: {
          args: {
            type: "array",
            items: { type: "string" },
            description: "Arguments for xh (e.g. ['post', 'https://api.example.com/items', 'name=widget', 'count:=3']).",
          },
          body: { type: "string", description: "Optional raw stdin request body." },
        },
        required: ["args"],
      },
      readOnly: true,
      run: async (a) => {
        const rawArgs = asStringArray(a.args, "args");
        const hasBody = typeof a.body === "string";
        const argv = [
          "--offline",
          ...(hasBody ? [] : ["-I"]),
          "-p",
          "HB",
          "--pretty=none",
          ...rawArgs,
        ];
        const res = await execXh(argv, opts, hasBody ? (a.body as string) : undefined, 10_000);
        return {
          exitCode: res.exitCode,
          request: res.stdout.trimEnd(),
          stderr: res.stderr.trim(),
        };
      },
    },
    {
      name: "xh_request",
      description:
        "Execute a real HTTP request via the `xh` binary in non-interactive mode (default `--ignore-stdin` and bounded `--timeout`). Returns exitCode, semantic statusCategory, stdout, and stderr.",
      inputSchema: {
        type: "object",
        properties: {
          args: {
            type: "array",
            items: { type: "string" },
            description: "Arguments for xh (method, URL, request items, flags).",
          },
          body: { type: "string", description: "Optional raw request body passed on stdin." },
          timeoutSec: {
            type: "number",
            minimum: 1,
            maximum: 120,
            description: "Request timeout in seconds (default 30).",
          },
        },
        required: ["args"],
      },
      readOnly: false,
      run: async (a) => {
        const rawArgs = asStringArray(a.args, "args");
        if (rawArgs.some((x) => x === "--generate" || x.startsWith("--generate="))) {
          throw new Error("--generate is not allowed in xh_request");
        }
        const timeoutSec = Math.min(Math.max(Number(a.timeoutSec ?? 30) || 30, 1), 120);
        const hasBody = typeof a.body === "string";
        const hasTimeout = rawArgs.some((x) => x === "--timeout" || x.startsWith("--timeout="));
        const hasIgnoreStdin = rawArgs.some((x) => x === "-I" || x === "--ignore-stdin");
        const argv = [
          ...(hasBody || hasIgnoreStdin ? [] : ["-I"]),
          ...(hasTimeout ? [] : [`--timeout=${timeoutSec}`]),
          "--pretty=none",
          ...rawArgs,
        ];
        const res = await execXh(
          argv,
          opts,
          hasBody ? (a.body as string) : undefined,
          (timeoutSec + 5) * 1000,
        );
        return {
          exitCode: res.exitCode,
          statusCategory: statusCategory(res.exitCode),
          stdout: res.stdout,
          stderr: res.stderr.trim(),
        };
      },
    },
  ];
}

export async function respond(
  line: string,
  tools: XhTool[] = xhTools(),
): Promise<Reply | undefined> {
  let m: Rpc;
  try {
    m = JSON.parse(line) as Rpc;
  } catch {
    return fail(null, -32700, "parse error");
  }
  if (typeof m !== "object" || m === null || Array.isArray(m) || typeof m.method !== "string") {
    return fail(null, -32600, "invalid request");
  }
  if (m.id === undefined) return undefined;
  const id = m.id;
  switch (m.method) {
    case "initialize":
      return ok(id, {
        protocolVersion: m.params?.protocolVersion ?? "2025-11-25",
        capabilities: { tools: {} },
        serverInfo: { name: "aphrody-xh", version: "0.1.0" },
      });
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, {
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema,
          annotations: { readOnlyHint: t.readOnly },
        })),
      });
    case "tools/call": {
      if (typeof m.params?.name !== "string") {
        return fail(id, -32602, "params.name (string) required");
      }
      const t = tools.find((x) => x.name === m.params!.name);
      if (!t) return fail(id, -32602, `unknown tool ${m.params.name}`);
      try {
        const r = await t.run((m.params.arguments as Record<string, unknown>) ?? {});
        return ok(id, { content: [{ type: "text", text: JSON.stringify(r) }] });
      } catch (e) {
        return ok(id, { isError: true, content: [{ type: "text", text: String(e) }] });
      }
    }
    default:
      return fail(id, -32601, `method not found: ${m.method}`);
  }
}

if (import.meta.main) {
  const tools = xhTools();
  let buf = "";
  for await (const chunk of Bun.stdin.stream()) {
    buf += Buffer.from(chunk).toString("utf8");
    let i: number;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!line) continue;
      const reply = await respond(line, tools);
      if (reply !== undefined) process.stdout.write(`${JSON.stringify(reply)}\n`);
    }
  }
  if (buf.trim()) {
    const reply = await respond(buf.trim(), tools);
    if (reply !== undefined) process.stdout.write(`${JSON.stringify(reply)}\n`);
  }
}
