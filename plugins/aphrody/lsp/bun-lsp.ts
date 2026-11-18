#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getApiMatrix, lookupTypes, resolveBrainDir, searchBrain } from "../lib/bun-brain.ts";
import { scanCode } from "../lib/bun-legacy-scanner.ts";

export interface LspPosition {
  line: number;
  character: number;
}

export interface LspRange {
  start: LspPosition;
  end: LspPosition;
}

export interface LspDiagnostic {
  range: LspRange;
  severity: 1 | 2 | 3 | 4;
  code?: string;
  source: string;
  message: string;
}

export interface LspDocumentSymbol {
  name: string;
  detail?: string;
  kind: number;
  range: LspRange;
  selectionRange: LspRange;
}

export interface LspMessage {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
  result?: unknown;
  error?: { code: number; message: string };
}

const VALID_LOADERS = new Set(["ts", "tsx", "js", "jsx", "mts", "cts", "mjs", "cjs"]);

function uriToFsPath(uri: string): string | null {
  if (!uri.startsWith("file://")) return null;
  try {
    return fileURLToPath(uri);
  } catch {
    return null;
  }
}

function loaderFromPath(pathOrUri: string): "ts" | "tsx" | "js" | "jsx" {
  const ext = extname(pathOrUri.split("?")[0] ?? "").toLowerCase();
  if (ext === ".tsx") return "tsx";
  if (ext === ".jsx") return "jsx";
  if (ext === ".js" || ext === ".mjs" || ext === ".cjs") return "js";
  return "ts";
}

function findNearestTsconfig(startPath: string | null): string | null {
  if (!startPath) return null;
  let dir = existsSync(startPath) ? dirname(resolve(startPath)) : resolve(dirname(startPath));
  for (let i = 0; i < 10; i++) {
    const cand = join(dir, "tsconfig.json");
    if (existsSync(cand)) return cand;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

export function parseBunCheckDiagnostics(output: string, matchFileName?: string): LspDiagnostic[] {
  const diags: LspDiagnostic[] = [];
  const lineRe = /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s+(.+)$/;
  const globalRe = /^(error|warning)\s+(TS\d+):\s+(.+)$/;
  for (const rawLine of output.split(/\r?\n/)) {
    const m = rawLine.match(lineRe);
    if (m) {
      const filePart = m[1]!.replaceAll("\\", "/");
      if (matchFileName && !filePart.endsWith(matchFileName.replaceAll("\\", "/"))) {
        continue;
      }
      const line = Math.max(0, Number.parseInt(m[2]!, 10) - 1);
      const col = Math.max(0, Number.parseInt(m[3]!, 10) - 1);
      const sev = m[4] === "warning" ? 2 : 1;
      diags.push({
        range: { start: { line, character: col }, end: { line, character: col + 1 } },
        severity: sev,
        code: m[5]!,
        source: "bun check",
        message: m[6]!.trim(),
      });
      continue;
    }
    const gm = rawLine.match(globalRe);
    if (gm) {
      diags.push({
        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
        severity: gm[1] === "warning" ? 2 : 1,
        code: gm[2]!,
        source: "bun check",
        message: gm[3]!.trim(),
      });
    }
  }
  return diags;
}

export function diagnoseDocument(
  uri: string,
  text: string,
  opts: { runTypeCheck?: boolean; includeLegacyHints?: boolean } = {},
): LspDiagnostic[] {
  const fsPath = uriToFsPath(uri);
  const loader = loaderFromPath(fsPath ?? uri);
  const ext = extname(fsPath ?? uri).slice(1).toLowerCase();
  if (ext && !VALID_LOADERS.has(ext)) return [];

  const diags: LspDiagnostic[] = [];

  // 1. Instant syntax / transpile check via Bun.Transpiler.
  let syntaxFailed = false;
  try {
    const transpiler = new Bun.Transpiler({ loader });
    transpiler.transformSync(text);
  } catch (err) {
    syntaxFailed = true;
    const msg = err instanceof Error ? err.message : String(err);
    const locM = msg.match(/:(\d+):(\d+)\b/) ?? msg.match(/at line (\d+)/i);
    const line = locM?.[1] ? Math.max(0, Number.parseInt(locM[1], 10) - 1) : 0;
    const col = locM?.[2] ? Math.max(0, Number.parseInt(locM[2], 10) - 1) : 0;
    diags.push({
      range: { start: { line, character: col }, end: { line, character: col + 1 } },
      severity: 1,
      source: "bun transpiler",
      message: msg.split("\n")[0] ?? msg,
    });
  }

  // 2. Native TS 7 type checking via `bun check --no-script --no-pretty`.
  if (!syntaxFailed && opts.runTypeCheck !== false) {
    let checkTarget = fsPath;
    let tmpDir: string | null = null;
    const tsconfig = findNearestTsconfig(fsPath);
    let matchesDisk = false;
    if (fsPath && existsSync(fsPath)) {
      try {
        matchesDisk = readFileSync(fsPath, "utf8") === text;
      } catch {
        matchesDisk = false;
      }
    }
    if (!fsPath || !matchesDisk) {
      tmpDir = join(tmpdir(), `bun-lsp-${process.pid}-${Date.now()}`);
      mkdirSync(tmpDir, { recursive: true });
      const fileBase = fsPath ? basename(fsPath) : `untitled.${loader}`;
      checkTarget = join(tmpDir, fileBase);
      writeFileSync(checkTarget, text, "utf8");
    }

    try {
      if (checkTarget) {
        const args = [process.execPath, "check", "--no-script", "--no-pretty"];
        if (tsconfig) args.push("-p", tsconfig);
        args.push(checkTarget);
        const r = Bun.spawnSync(args, {
          cwd: fsPath && existsSync(dirname(fsPath)) ? dirname(fsPath) : process.cwd(),
          stdout: "pipe",
          stderr: "pipe",
          stdin: "ignore",
        });
        const combined = `${r.stdout.toString()}\n${r.stderr.toString()}`;
        const parsed = parseBunCheckDiagnostics(combined, basename(checkTarget));
        diags.push(...parsed);
      }
    } finally {
      if (tmpDir) {
        try {
          rmSync(tmpDir, { recursive: true, force: true });
        } catch {
          // Ignore cleanup errors.
        }
      }
    }
  }

  // 3. Bun-native legacy migration hints.
  if (opts.includeLegacyHints !== false) {
    const scan = scanCode(text, fsPath ?? `file.${loader}`);
    for (const f of scan.findings) {
      const l = Math.max(0, f.line - 1);
      const c = Math.max(0, f.column - 1);
      diags.push({
        range: {
          start: { line: l, character: c },
          end: { line: l, character: c + Math.max(1, f.original.length) },
        },
        severity: 3,
        code: f.rule,
        source: "bun-legacy",
        message: f.replacement ? `${f.message} -> ${f.replacement}` : f.message,
      });
    }
  }

  return diags;
}

export function extractSymbolAtPosition(text: string, pos: LspPosition): string | null {
  const lines = text.split(/\r?\n/);
  const line = lines[pos.line];
  if (!line) return null;
  const chIdx = Math.max(0, Math.min(line.length - 1, pos.character));
  const isIdent = (c: string) => /[A-Za-z0-9_.:$-]/.test(c);
  if (!isIdent(line[chIdx] ?? "") && chIdx > 0 && isIdent(line[chIdx - 1] ?? "")) {
    return extractSymbolAtPosition(text, { line: pos.line, character: chIdx - 1 });
  }
  if (!isIdent(line[chIdx] ?? "")) return null;
  let start = chIdx;
  let end = chIdx;
  while (start > 0 && isIdent(line[start - 1]!)) start--;
  while (end < line.length && isIdent(line[end]!)) end++;
  return line.slice(start, end);
}

export function computeHover(
  text: string,
  pos: LspPosition,
  brainDirOverride?: string,
): { contents: { kind: "markdown"; value: string } } | null {
  const sym = extractSymbolAtPosition(text, pos);
  if (!sym) return null;
  const brainDir = resolveBrainDir(brainDirOverride);
  const cleanSym = sym.replace(/^Bun\./, "");
  const typeHits = lookupTypes(sym.startsWith("bun:") ? sym : cleanSym, {
    module: sym.startsWith("bun:") ? sym : undefined,
    limit: 5,
    brainDir,
  });
  if (typeHits.length > 0) {
    const exact = typeHits.find((h) => h.name === sym || h.name === `Bun.${cleanSym}`) ?? typeHits[0]!;
    const lines = [`**\`${exact.name}\`** _(${exact.kind}, \`${exact.file}\`)_`];
    if (exact.summary) lines.push("", exact.summary);
    lines.push("", "```ts", exact.signature, "```");
    return { contents: { kind: "markdown", value: lines.join("\n") } };
  }
  const brainHits = searchBrain(sym, { limit: 2, brainDir });
  if (brainHits.length > 0) {
    const top = brainHits[0]!;
    return {
      contents: {
        kind: "markdown",
        value: `**${top.section}** _(${top.file})_\n\n${top.excerpt.slice(0, 400)}`,
      },
    };
  }
  return null;
}

export function computeCompletions(
  text: string,
  pos: LspPosition,
  brainDirOverride?: string,
): Array<{ label: string; kind: number; detail?: string; documentation?: string }> {
  const lines = text.split(/\r?\n/);
  const line = lines[pos.line] ?? "";
  const prefix = line.slice(0, pos.character);
  const matrix = getApiMatrix({ kind: "all", brainDir: resolveBrainDir(brainDirOverride) });

  if (/\bbun:[A-Za-z0-9_-]*$/.test(prefix)) {
    const seen = new Set<string>();
    const items: Array<{ label: string; kind: number; detail?: string }> = [];
    for (const m of matrix.builtinModules) {
      if (!m.startsWith("bun:") || seen.has(m)) continue;
      seen.add(m);
      items.push({ label: m, kind: 9, detail: "Bun built-in module" });
    }
    return items;
  }

  if (/\bBun\.[A-Za-z0-9_$]*$/.test(prefix)) {
    return matrix.bunApis.slice(0, 80).map((api) => ({
      label: api.name.replace(/^Bun\./, ""),
      kind: api.kind === "class" ? 7 : api.kind === "namespace" ? 9 : 3,
      detail: api.signature.slice(0, 100),
      documentation: api.summary || undefined,
    }));
  }

  return [];
}

export function computeDocumentSymbols(text: string): LspDocumentSymbol[] {
  const symbols: LspDocumentSymbol[] = [];
  const lines = text.split(/\r?\n/);
  const declRe = /^\s*(?:export\s+)?(?:async\s+)?(function|class|interface|type|const|let|enum)\s+([$A-Za-z_][A-Za-z0-9_$]*)/;
  const kindMap: Record<string, number> = {
    function: 12,
    class: 5,
    interface: 11,
    type: 26,
    const: 14,
    let: 13,
    enum: 10,
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const m = line.match(declRe);
    if (!m) continue;
    const kw = m[1]!;
    const name = m[2]!;
    const col = line.indexOf(name);
    const range: LspRange = {
      start: { line: i, character: Math.max(0, col) },
      end: { line: i, character: line.length },
    };
    const selectionRange: LspRange = {
      start: { line: i, character: Math.max(0, col) },
      end: { line: i, character: Math.max(0, col) + name.length },
    };
    symbols.push({
      name,
      detail: kw,
      kind: kindMap[kw] ?? 13,
      range,
      selectionRange,
    });
  }
  return symbols;
}

export function encodeLspMessage(payload: unknown): Uint8Array {
  const json = JSON.stringify(payload);
  const body = Buffer.from(json, "utf8");
  const header = Buffer.from(`Content-Length: ${body.byteLength}\r\n\r\n`, "ascii");
  return Buffer.concat([header, body]);
}

export class LspServer {
  private docs = new Map<string, string>();
  private shutdownRequested = false;
  private emit: (msg: LspMessage) => void;
  private brainDir?: string;

  constructor(emit: (msg: LspMessage) => void, brainDir?: string) {
    this.emit = emit;
    this.brainDir = brainDir;
  }

  handleMessage(msg: LspMessage): { exitCode?: number } {
    const method = msg.method ?? "";
    const params = msg.params ?? {};

    if (method === "initialize") {
      this.emit({
        jsonrpc: "2.0",
        id: msg.id ?? null,
        result: {
          capabilities: {
            textDocumentSync: 1,
            hoverProvider: true,
            completionProvider: { triggerCharacters: [".", ":"] },
            documentSymbolProvider: true,
          },
          serverInfo: { name: "bun-lsp", version: "1.4.5" },
        },
      });
      return {};
    }

    if (method === "initialized") {
      return {};
    }

    if (method === "shutdown") {
      this.shutdownRequested = true;
      this.emit({ jsonrpc: "2.0", id: msg.id ?? null, result: null });
      return {};
    }

    if (method === "exit") {
      return { exitCode: this.shutdownRequested ? 0 : 1 };
    }

    if (method === "textDocument/didOpen") {
      const td = params.textDocument as { uri?: string; text?: string } | undefined;
      if (td?.uri && typeof td.text === "string") {
        this.docs.set(td.uri, td.text);
        this.publishDiagnostics(td.uri, td.text);
      }
      return {};
    }

    if (method === "textDocument/didChange") {
      const td = params.textDocument as { uri?: string } | undefined;
      const changes = params.contentChanges as Array<{ text?: string }> | undefined;
      const nextText = changes?.[changes.length - 1]?.text;
      if (td?.uri && typeof nextText === "string") {
        this.docs.set(td.uri, nextText);
        this.publishDiagnostics(td.uri, nextText);
      }
      return {};
    }

    if (method === "textDocument/didSave") {
      const td = params.textDocument as { uri?: string } | undefined;
      if (td?.uri) {
        const text = typeof params.text === "string" ? params.text : this.docs.get(td.uri);
        if (typeof text === "string") {
          this.docs.set(td.uri, text);
          this.publishDiagnostics(td.uri, text);
        }
      }
      return {};
    }

    if (method === "textDocument/didClose") {
      const td = params.textDocument as { uri?: string } | undefined;
      if (td?.uri) {
        this.docs.delete(td.uri);
        this.emit({
          jsonrpc: "2.0",
          method: "textDocument/publishDiagnostics",
          params: { uri: td.uri, diagnostics: [] },
        });
      }
      return {};
    }

    if (method === "textDocument/hover") {
      const td = params.textDocument as { uri?: string } | undefined;
      const pos = params.position as LspPosition | undefined;
      const text = td?.uri ? this.docs.get(td.uri) : undefined;
      const result = text && pos ? computeHover(text, pos, this.brainDir) : null;
      this.emit({ jsonrpc: "2.0", id: msg.id ?? null, result });
      return {};
    }

    if (method === "textDocument/completion") {
      const td = params.textDocument as { uri?: string } | undefined;
      const pos = params.position as LspPosition | undefined;
      const text = td?.uri ? this.docs.get(td.uri) : undefined;
      const items = text && pos ? computeCompletions(text, pos, this.brainDir) : [];
      this.emit({ jsonrpc: "2.0", id: msg.id ?? null, result: { isIncomplete: false, items } });
      return {};
    }

    if (method === "textDocument/documentSymbol") {
      const td = params.textDocument as { uri?: string } | undefined;
      const text = td?.uri ? this.docs.get(td.uri) : undefined;
      const symbols = text ? computeDocumentSymbols(text) : [];
      this.emit({ jsonrpc: "2.0", id: msg.id ?? null, result: symbols });
      return {};
    }

    if (msg.id !== undefined) {
      this.emit({
        jsonrpc: "2.0",
        id: msg.id,
        error: { code: -32601, message: `Method not found: ${method}` },
      });
    }
    return {};
  }

  private publishDiagnostics(uri: string, text: string): void {
    const diagnostics = diagnoseDocument(uri, text);
    this.emit({
      jsonrpc: "2.0",
      method: "textDocument/publishDiagnostics",
      params: { uri, diagnostics },
    });
  }
}

export function extractLspFrames(buf: Buffer): { frames: LspMessage[]; rest: Buffer } {
  const frames: LspMessage[] = [];
  let offset = 0;
  while (offset < buf.length) {
    const headerEnd = buf.indexOf("\r\n\r\n", offset, "ascii");
    if (headerEnd === -1) break;
    const headerStr = buf.subarray(offset, headerEnd).toString("ascii");
    const lenMatch = headerStr.match(/Content-Length:\s*(\d+)/i);
    if (!lenMatch) {
      offset = headerEnd + 4;
      continue;
    }
    const contentLength = Number.parseInt(lenMatch[1]!, 10);
    const bodyStart = headerEnd + 4;
    const bodyEnd = bodyStart + contentLength;
    if (buf.length < bodyEnd) break;
    const bodyStr = buf.subarray(bodyStart, bodyEnd).toString("utf8");
    offset = bodyEnd;
    try {
      frames.push(JSON.parse(bodyStr) as LspMessage);
    } catch {
      // Skip malformed JSON body.
    }
  }
  return { frames, rest: buf.subarray(offset) };
}

async function runStdioLsp(): Promise<void> {
  const server = new LspServer((msg) => {
    process.stdout.write(encodeLspMessage(msg));
  });
  let buffer = Buffer.alloc(0);
  const reader = Bun.stdin.stream().getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer = Buffer.concat([buffer, Buffer.from(value)]);
    const { frames, rest } = extractLspFrames(buffer);
    buffer = Buffer.from(rest);
    for (const frame of frames) {
      const outcome = server.handleMessage(frame);
      if (typeof outcome.exitCode === "number") {
        process.exit(outcome.exitCode);
      }
    }
  }
}

if (import.meta.main) {
  await runStdioLsp();
}
