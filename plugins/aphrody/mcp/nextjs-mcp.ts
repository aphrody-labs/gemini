#!/usr/bin/env bun
import {
  type ConfigSectionFilter,
  lookupNextConfig,
  lookupNextDocs,
  lookupNextTypes,
  resolveNextBrainDir,
  searchNextBrain,
} from "../lib/nextjs-brain.ts";

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
    name: "nextjs_brain_search",
    description:
      "Search the compacted Next.js 16.5+ knowledge brain (INDEX, TYPES_DIGEST, CONFIG_SCHEMA, DOCS_DIGEST, UPSTREAM_APIS).",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keywords, Next.js API, directive, or guide topic to search." },
        file: { type: "string", description: "Optional brain filename filter (e.g. CONFIG_SCHEMA, TYPES_DIGEST, DOCS_DIGEST)." },
        limit: { type: "integer", minimum: 1, maximum: 30, description: "Max ranked hits (default 8)." },
      },
      required: ["query"],
    },
  },
  {
    name: "nextjs_types_lookup",
    description:
      "Lookup exact Next.js 16.5+ TypeScript declarations, entrypoint exports (next/cache, next/server, next/navigation, next/root-params, next/error, next/offline), and route-aware helpers.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      properties: {
        symbol: { type: "string", description: "Symbol, type, interface, or function name (e.g. revalidateTag, NextProxy, cacheLife, io)." },
        module: { type: "string", description: "Optional entrypoint/file filter (e.g. next/cache, next/server, next/navigation)." },
        limit: { type: "integer", minimum: 1, maximum: 40, description: "Max declarations returned (default 12)." },
      },
      required: ["symbol"],
    },
  },
  {
    name: "nextjs_config_lookup",
    description:
      "Lookup NextConfig, ExperimentalConfig, ImageConfigComplete, AppSegmentConfig, ProxyConfig, rewrites execution order, and built-in cacheLife profiles from CONFIG_SCHEMA.",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      properties: {
        option: { type: "string", description: "Config key or keyword (e.g. cacheComponents, beforeFiles, minimumCacheTTL, goRoutes)." },
        section: {
          type: "string",
          enum: ["top", "experimental", "images", "segment", "proxy", "routes", "cacheLife", "all"],
          description: "Schema section filter (default all).",
        },
        limit: { type: "integer", minimum: 1, maximum: 50, description: "Max rows returned (default 15)." },
      },
      required: ["option"],
    },
  },
  {
    name: "nextjs_docs_lookup",
    description:
      "Search bundled Next.js documentation digests and resolve exact project-local node_modules/next/dist/docs/ markdown paths (with optional bounded excerpt).",
    annotations: { readOnlyHint: true },
    inputSchema: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Doc topic, guide, or API name (e.g. proxy, use cache, catchError, beforeFiles)." },
        router: {
          type: "string",
          enum: ["app", "pages", "architecture", "all"],
          description: "Router section filter (default all).",
        },
        projectPath: { type: "string", description: "Optional project root containing node_modules/next/dist/docs/." },
        readLocal: { type: "boolean", description: "When true and project-local docs exist, include bounded markdown excerpt." },
        limit: { type: "integer", minimum: 1, maximum: 25, description: "Max doc matches (default 8)." },
      },
      required: ["topic"],
    },
  },
] as const;

function textResult(
  payload: unknown,
  isError = false,
): { content: Array<{ type: "text"; text: string }>; isError?: boolean } {
  const text = typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  return isError ? { content: [{ type: "text", text }], isError: true } : { content: [{ type: "text", text }] };
}

export function handleToolCall(
  name: string,
  args: Record<string, unknown> = {},
  brainDirOverride?: string,
): { content: Array<{ type: "text"; text: string }>; isError?: boolean } {
  const brainDir = resolveNextBrainDir(brainDirOverride);

  if (name === "nextjs_brain_search") {
    const query = typeof args.query === "string" ? args.query.trim() : "";
    if (!query) return textResult("Missing required argument: query", true);
    const hits = searchNextBrain(query, {
      file: typeof args.file === "string" ? args.file : undefined,
      limit: typeof args.limit === "number" ? args.limit : undefined,
      brainDir,
    });
    return textResult({ query, count: hits.length, hits });
  }

  if (name === "nextjs_types_lookup") {
    const symbol = typeof args.symbol === "string" ? args.symbol.trim() : "";
    if (!symbol) return textResult("Missing required argument: symbol", true);
    const hits = lookupNextTypes(symbol, {
      module: typeof args.module === "string" ? args.module : undefined,
      limit: typeof args.limit === "number" ? args.limit : undefined,
      brainDir,
    });
    return textResult({ symbol, count: hits.length, hits });
  }

  if (name === "nextjs_config_lookup") {
    const option = typeof args.option === "string" ? args.option.trim() : "";
    const validSections = new Set(["top", "experimental", "images", "segment", "proxy", "routes", "cacheLife", "all"]);
    const section =
      typeof args.section === "string" && validSections.has(args.section)
        ? (args.section as ConfigSectionFilter)
        : "all";
    if (!option && section === "all") {
      return textResult("Missing required argument: option", true);
    }
    const res = lookupNextConfig(option, {
      section,
      limit: typeof args.limit === "number" ? args.limit : undefined,
      brainDir,
    });
    return textResult({ option, section, count: res.matches.length, ...res });
  }

  if (name === "nextjs_docs_lookup") {
    const topic = typeof args.topic === "string" ? args.topic.trim() : "";
    if (!topic) return textResult("Missing required argument: topic", true);
    const router =
      args.router === "app" || args.router === "pages" || args.router === "architecture" || args.router === "all"
        ? args.router
        : "all";
    const res = lookupNextDocs(topic, {
      router,
      projectPath: typeof args.projectPath === "string" ? args.projectPath : undefined,
      readLocal: args.readLocal === true,
      limit: typeof args.limit === "number" ? args.limit : undefined,
      brainDir,
    });
    return textResult({ topic, router, count: res.hits.length, ...res });
  }

  return textResult(`Unknown tool: ${name}`, true);
}

export function handleRpcRequest(
  req: JsonRpcRequest,
  brainDirOverride?: string,
): JsonRpcResponse | null {
  const id = req.id ?? null;
  const method = req.method ?? "";

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
        serverInfo: { name: "nextjs-brain", version: "16.5.0" },
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
