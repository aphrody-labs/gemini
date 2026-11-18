#!/usr/bin/env bun
import { resolve } from "node:path";
import { getApiMatrix, lookupTypes, resolveBrainDir, searchBrain } from "../lib/brain.ts";
import { buildMigratePlan, scanCode, scanPath } from "../lib/legacy-scanner.ts";

export interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
}

export interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

export const MCP_TOOLS = [
  {
    name: "bun_brain_search",
    description:
      "Search the compacted Bun 1.4+ knowledge brain (INDEX, RUNTIME_APIS, TYPES_DIGEST, CLI_TOOLING, GUIDES_SKILLS_DIGEST, LEGACY_REPLACEMENT).",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keywords, Bun API name, CLI flag, or topic to search." },
        file: { type: "string", description: "Optional brain filename filter (e.g. RUNTIME_APIS, CLI_TOOLING)." },
        limit: { type: "integer", minimum: 1, maximum: 30, description: "Max ranked hits (default 8)." },
      },
      required: ["query"],
    },
  },
  {
    name: "bun_types_lookup",
    description:
      "Lookup exact TypeScript declarations, Bun.* signatures, bun:* built-in exports, and ts7.1 import attributes from bun-types digests.",
    inputSchema: {
      type: "object",
      properties: {
        symbol: { type: "string", description: "Symbol, interface, class, type, or API name (e.g. serve, SQL, Database)." },
        module: { type: "string", description: "Optional module filter (e.g. bun, bun:sqlite, bun:test, bun:ffi)." },
        limit: { type: "integer", minimum: 1, maximum: 40, description: "Max declarations returned (default 12)." },
      },
      required: ["symbol"],
    },
  },
  {
    name: "bun_api_matrix",
    description:
      "Retrieve Bun API topic overview, Bun.* globals, bun:* built-in modules, node:* compatibility matrix, or CLI tooling sections.",
    inputSchema: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Optional filter keyword (e.g. sqlite, crypto, http, test)." },
        kind: {
          type: "string",
          enum: ["bun", "builtin", "node", "cli", "all"],
          description: "Matrix slice to return (default all).",
        },
      },
    },
  },
  {
    name: "bun_legacy_scan",
    description:
      "Scan a file, directory, or inline code snippet for legacy Node.js/npm/JS/Docker/CI patterns and suggest or preview Bun-native replacements.",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "File or directory path to scan." },
        code: { type: "string", description: "Inline source code or config text to scan (used when path is omitted)." },
        filename: { type: "string", description: "Virtual filename for inline code (default index.ts)." },
        fix: { type: "boolean", description: "Include safe autofix preview without writing disk." },
        aggressive: { type: "boolean", description: "Include behavior-changing autofix preview." },
        maxFiles: { type: "integer", minimum: 1, maximum: 5000, description: "Max files when scanning a directory." },
      },
    },
  },
  {
    name: "bun_migrate_plan",
    description:
      "Generate a phased Node/npm/Yarn/pnpm -> Bun migration plan (safe rewrites, lockfile migration, --replace-packages candidates, optional Rust porting target).",
    inputSchema: {
      type: "object",
      properties: {
        root: { type: "string", description: "Project root directory (defaults to current working directory)." },
        target: {
          type: "string",
          enum: ["bun", "rust"],
          description: "Migration target: bun (default) or rust (includes Rust crate/addon/hot-package plan).",
        },
      },
    },
  },
] as const;

function textResult(payload: unknown, isError = false): { content: Array<{ type: "text"; text: string }>; isError?: boolean } {
  const text = typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  return isError ? { content: [{ type: "text", text }], isError: true } : { content: [{ type: "text", text }] };
}

export function handleToolCall(
  name: string,
  args: Record<string, unknown> = {},
  brainDirOverride?: string,
): { content: Array<{ type: "text"; text: string }>; isError?: boolean } {
  const brainDir = resolveBrainDir(brainDirOverride);
  if (name === "bun_brain_search") {
    const query = typeof args.query === "string" ? args.query.trim() : "";
    if (!query) return textResult("Missing required argument: query", true);
    const hits = searchBrain(query, {
      file: typeof args.file === "string" ? args.file : undefined,
      limit: typeof args.limit === "number" ? args.limit : undefined,
      brainDir,
    });
    return textResult({ query, count: hits.length, hits });
  }

  if (name === "bun_types_lookup") {
    const symbol = typeof args.symbol === "string" ? args.symbol.trim() : "";
    if (!symbol) return textResult("Missing required argument: symbol", true);
    const hits = lookupTypes(symbol, {
      module: typeof args.module === "string" ? args.module : undefined,
      limit: typeof args.limit === "number" ? args.limit : undefined,
      brainDir,
    });
    return textResult({ symbol, count: hits.length, hits });
  }

  if (name === "bun_api_matrix") {
    const kind =
      args.kind === "bun" || args.kind === "builtin" || args.kind === "node" || args.kind === "cli" || args.kind === "all"
        ? args.kind
        : "all";
    const matrix = getApiMatrix({
      topic: typeof args.topic === "string" ? args.topic : undefined,
      kind,
      brainDir,
    });
    return textResult(matrix);
  }

  if (name === "bun_legacy_scan") {
    const fix = args.fix === true;
    const aggressive = args.aggressive === true;
    if (typeof args.code === "string") {
      const filename = typeof args.filename === "string" && args.filename ? args.filename : "index.ts";
      const res = scanCode(args.code, filename, { fix, aggressive });
      return textResult({
        filesScanned: 1,
        findings: res.findings,
        changed: res.changed,
        preview: fix || aggressive ? res.updated : undefined,
      });
    }
    if (typeof args.path === "string" && args.path.trim()) {
      const res = scanPath(args.path, {
        fix,
        aggressive,
        write: false,
        maxFiles: typeof args.maxFiles === "number" ? args.maxFiles : undefined,
      });
      return textResult({
        filesScanned: res.filesScanned,
        findingCount: res.findings.length,
        findings: res.findings.slice(0, 200),
        rewriteFiles: res.rewrites?.map((r) => r.file) ?? [],
      });
    }
    return textResult("Provide either `path` or `code` to bun_legacy_scan", true);
  }

  if (name === "bun_migrate_plan") {
    const root = typeof args.root === "string" && args.root.trim() ? resolve(args.root) : process.cwd();
    const target = args.target === "rust" ? "rust" : "bun";
    const plan = buildMigratePlan(root, { target });
    return textResult({
      ...plan,
      findings: plan.findings.slice(0, 150),
    });
  }

  return textResult(`Unknown tool: ${name}`, true);
}

export function handleRpcRequest(
  req: JsonRpcRequest,
  brainDirOverride?: string,
): JsonRpcResponse | null {
  const id = req.id ?? null;
  const method = req.method ?? "";

  // JSON-RPC notifications have no id and expect no reply.
  if (req.id === undefined && method.startsWith("notifications/")) {
    return null;
  }

  if (method === "initialize") {
    const clientProto = typeof req.params?.protocolVersion === "string" ? req.params.protocolVersion : "2025-03-26";
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: clientProto,
        capabilities: { tools: {} },
        serverInfo: { name: "bun-brain", version: "1.4.5" },
      },
    };
  }

  if (method === "ping") {
    return { jsonrpc: "2.0", id, result: {} };
  }

  if (method === "tools/list") {
    return { jsonrpc: "2.0", id, result: { tools: MCP_TOOLS } };
  }

  if (method === "tools/call") {
    const params = req.params ?? {};
    const name = typeof params.name === "string" ? params.name : "";
    const args =
      params.arguments && typeof params.arguments === "object"
        ? (params.arguments as Record<string, unknown>)
        : {};
    if (!name) {
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32602, message: "Invalid params: tools/call requires tool name" },
      };
    }
    if (!MCP_TOOLS.some((t) => t.name === name)) {
      return {
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Unknown tool: ${name}` },
      };
    }
    const result = handleToolCall(name, args, brainDirOverride);
    return { jsonrpc: "2.0", id, result };
  }

  if (req.id === undefined) return null;
  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

async function runStdioServer(): Promise<void> {
  let buffer = "";
  const decoder = new TextDecoder();
  const reader = Bun.stdin.stream().getReader();

  const processLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      const msg = JSON.parse(trimmed) as JsonRpcRequest;
      const res = handleRpcRequest(msg);
      if (res !== null) {
        process.stdout.write(`${JSON.stringify(res)}\n`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const errRes: JsonRpcResponse = {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: `Parse error: ${msg}` },
      };
      process.stdout.write(`${JSON.stringify(errRes)}\n`);
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (buffer.trim()) processLine(buffer);
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    let nlIdx = buffer.indexOf("\n");
    while (nlIdx !== -1) {
      const line = buffer.slice(0, nlIdx);
      buffer = buffer.slice(nlIdx + 1);
      processLine(line);
      nlIdx = buffer.indexOf("\n");
    }
  }
}

if (import.meta.main) {
  await runStdioServer();
}
