import { Database } from "bun:sqlite";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { spawn } from "node:child_process";
import { homedir, hostname, platform } from "node:os";
import { basename, dirname, join } from "node:path";
import {
  detectHarness,
  emitContext,
  extractCommand,
  extractCwd,
  extractPrompt,
  extractSessionId,
  extractToolName,
  GEMINI_ROOT,
  HOME,
  LEARNING_DIR,
  MEMORY_DIR,
  RawHookEvent,
  readHookEvent,
  redactSecrets,
  RULES_DIR,
  writeEmpty,
} from "./lib.ts";

export interface JournalEntry {
  at: string;
  harness: string;
  session: string;
  cwd: string;
  kind: "error" | "recovery" | "correction";
  tool?: string;
  summary: string;
}

export interface LearnState {
  lastDistillAt: number;
  lastLineCount: number;
  lastErrorsBySession: Record<string, string>;
  lastPromptsBySession?: Record<string, string>;
}

export type Kind = "memory" | "instructions" | "digest" | "rule" | "skill" | "brain";

export interface Hit {
  path: string;
  kind: Kind;
  title: string;
  snippet: string;
  rank: number;
}

export const JOURNAL_PATH = join(LEARNING_DIR, "journal.jsonl");
export const INBOX_DIR = join(LEARNING_DIR, "inbox");
export const STATE_PATH = join(LEARNING_DIR, "state.json");
export const DB_PATH = join(LEARNING_DIR, "memory.db");
const MAX_CHUNK = 1500;
const CORRECTION_RE =
  /\b(always|never|stop doing|do not|don't|instead|remember|toujours|jamais|retiens|arrête|arrete|fais plutot|corrige|evite|évite)\b/i;

/** Raw tool recoveries replayed from other harnesses are not durable rules and leak their paths: keep rules only. */
export function isDurableCloudBullet(b: string): boolean {
  return !/^\[recovery\] Recovered from \[/.test(b) && !/[\\/]\.claude[\\/]/.test(b);
}

export function loadState(path = STATE_PATH): LearnState {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as LearnState;
  } catch {
    return { lastDistillAt: 0, lastLineCount: 0, lastErrorsBySession: {} };
  }
}

export function saveState(state: LearnState, path = STATE_PATH): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function appendEntry(entry: JournalEntry, journalPath = JOURNAL_PATH): number {
  mkdirSync(dirname(journalPath), { recursive: true });
  appendFileSync(journalPath, `${JSON.stringify(entry)}\n`, "utf8");
  return readFileSync(journalPath, "utf8").split(/\r?\n/).filter(Boolean).length;
}

function looksFailed(text: string): boolean {
  return (
    /\bCommand exited with code [1-9]\d*|exitCode["']?\s*:\s*[1-9]\d*|stderr["']?\s*:\s*["'][^"']+/i.test(
      text,
    ) || /error:\s|ENOENT|ECONNREFUSED|SyntaxError|ParseError/i.test(text)
  );
}

function responseText(resp: unknown): string {
  if (typeof resp === "string") return resp;
  if (resp === null || resp === undefined) return "";
  try {
    return JSON.stringify(resp);
  } catch {
    return String(resp);
  }
}

function maybeTriggerDistill(lineCount: number, state: LearnState): void {
  const delta = lineCount - state.lastLineCount;
  const elapsedMs = Date.now() - state.lastDistillAt;
  if (delta >= 6 && elapsedMs >= 10 * 60 * 1000) {
    spawn(
      "bun",
      ["--no-install", "--no-env-file", import.meta.path, "distill-quiet"],
      { detached: true, stdio: "ignore", windowsHide: true },
    ).unref();
  }
}

export function recordEvent(event: RawHookEvent, harness: string): void {
  const session = extractSessionId(event) || "default";
  const cwd = extractCwd(event);
  const state = loadState();
  const tool = extractToolName(event);
  const prompt = extractPrompt(event);

  if (!tool && prompt.trim()) {
    const clean = redactSecrets(prompt.trim()).replace(/\s+/g, " ").slice(0, 400);
    state.lastPromptsBySession ??= {};
    if (state.lastPromptsBySession[session] !== clean) {
      state.lastPromptsBySession[session] = clean;
      const pKeys = Object.keys(state.lastPromptsBySession);
      if (pKeys.length > 24) delete state.lastPromptsBySession[pKeys[0]!];
      saveState(state);
      if (CORRECTION_RE.test(clean)) {
        const n = appendEntry({
          at: new Date().toISOString(),
          harness,
          session,
          cwd,
          kind: "correction",
          summary: clean,
        });
        maybeTriggerDistill(n, state);
      }
    }
    return;
  }
  if (!tool) return;

  const rawResp = responseText(event.error ?? event.tool_response);
  const cmd = extractCommand(event);
  const isError =
    (typeof event.error === "string" && event.error !== "") ||
    looksFailed(rawResp);
  const label = redactSecrets((cmd || tool).replace(/\s+/g, " ").slice(0, 180));

  if (isError) {
    state.lastErrorsBySession[session] = label;
    const keys = Object.keys(state.lastErrorsBySession);
    if (keys.length > 24) delete state.lastErrorsBySession[keys[0]!];
    saveState(state);
    const errSnippet = redactSecrets(rawResp.replace(/\s+/g, " ")).slice(0, 320);
    const n = appendEntry({
      at: new Date().toISOString(),
      harness,
      session,
      cwd,
      kind: "error",
      tool,
      summary: `${label} => ${errSnippet}`,
    });
    maybeTriggerDistill(n, state);
  } else if (state.lastErrorsBySession[session]) {
    const prevErr = state.lastErrorsBySession[session];
    delete state.lastErrorsBySession[session];
    saveState(state);
    const n = appendEntry({
      at: new Date().toISOString(),
      harness,
      session,
      cwd,
      kind: "recovery",
      tool,
      summary: `Recovered from [${prevErr}] via [${label}]`,
    });
    maybeTriggerDistill(n, state);
  }
}

export function distillJournal(
  journalPath = JOURNAL_PATH,
  inboxDir = INBOX_DIR,
  statePath = STATE_PATH,
  minEntries = 1,
): string | null {
  if (!existsSync(journalPath)) return null;
  const lines = readFileSync(journalPath, "utf8").split(/\r?\n/).filter(Boolean);
  const state = loadState(statePath);
  const startIdx = Math.min(state.lastLineCount, lines.length);
  const slice = lines.slice(startIdx);
  if (slice.length < minEntries) return null;

  const parsed: JournalEntry[] = [];
  for (const line of slice) {
    try {
      parsed.push(JSON.parse(line) as JournalEntry);
    } catch {
      // Skip malformed line.
    }
  }
  const counts = new Map<string, { count: number; sample: JournalEntry }>();
  for (const e of parsed) {
    const key = `${e.kind}:${e.tool ?? "prompt"}:${e.summary.slice(0, 80)}`;
    const prev = counts.get(key);
    counts.set(key, { count: (prev?.count ?? 0) + 1, sample: e });
  }

  mkdirSync(inboxDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const digestPath = join(inboxDir, `${stamp}-digest.md`);
  const rows = [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 30)
    .map(
      ({ count, sample }) =>
        `- [${sample.kind} x${count}] (${basename(sample.cwd) || sample.harness}) ${sample.summary}`,
    );

  writeFileSync(
    digestPath,
    `# Learning Digest (${new Date().toISOString()})\n\nEntries processed: ${parsed.length}\n\n${rows.join("\n")}\n`,
    "utf8",
  );

  const kept = lines.length > 400 ? lines.slice(lines.length - 400) : lines;
  if (kept.length !== lines.length) {
    writeFileSync(journalPath, `${kept.join("\n")}\n`, "utf8");
  }
  state.lastDistillAt = Date.now();
  state.lastLineCount = kept.length;
  saveState(state, statePath);
  return digestPath;
}

export function openIndex(path = DB_PATH): Database {
  mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path, { create: true });
  db.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 3000;");
  db.exec(
    "CREATE TABLE IF NOT EXISTS docs (path TEXT PRIMARY KEY, kind TEXT NOT NULL, mtime INTEGER NOT NULL, size INTEGER NOT NULL)",
  );
  db.exec(
    "CREATE VIRTUAL TABLE IF NOT EXISTS chunks USING fts5(path UNINDEXED, kind UNINDEXED, title, body, tokenize = 'porter unicode61')",
  );
  return db;
}

export function chunkMarkdown(
  text: string,
  fallbackTitle: string,
): Array<{ title: string; body: string }> {
  const chunks: Array<{ title: string; body: string }> = [];
  let title = fallbackTitle;
  let buf: string[] = [];
  const flush = () => {
    const body = buf.join("\n").trim();
    buf = [];
    for (let i = 0; i < body.length; i += MAX_CHUNK) {
      chunks.push({ title, body: body.slice(i, i + MAX_CHUNK) });
    }
  };
  for (const line of text.split(/\r?\n/)) {
    const h = line.match(/^#{1,4}\s+(.*)$/);
    if (h) {
      flush();
      title = `${fallbackTitle} > ${h[1]}`;
    } else {
      buf.push(line);
    }
  }
  flush();
  return chunks.filter((c) => c.body.length > 0);
}

function walkMarkdown(dir: string, out: string[]): void {
  if (!existsSync(dir)) return;
  const st = statSync(dir);
  if (st.isFile()) {
    if (dir.endsWith(".md")) out.push(dir);
    return;
  }
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walkMarkdown(p, out);
    else if (e.isFile() && e.name.endsWith(".md")) out.push(p);
  }
}

export function indexAll(dbPath = DB_PATH): { files: number; changed: number } {
  const db = openIndex(dbPath);
  const roots: Array<{ kind: Kind; path: string }> = [
    { kind: "instructions", path: join(GEMINI_ROOT, "GEMINI.md") },
    { kind: "rule", path: RULES_DIR },
    { kind: "memory", path: MEMORY_DIR },
    { kind: "digest", path: INBOX_DIR },
    { kind: "skill", path: join(GEMINI_ROOT, "plugins") },
    { kind: "brain", path: join(GEMINI_ROOT, "brain") },
  ];
  let files = 0;
  let changed = 0;
  const seen = new Set<string>();
  const insert = db.query(
    "INSERT INTO chunks (path, kind, title, body) VALUES (?, ?, ?, ?)",
  );
  for (const r of roots) {
    const list: string[] = [];
    walkMarkdown(r.path, list);
    for (const file of list) {
      seen.add(file);
      files++;
      const st = statSync(file);
      const mtime = Math.floor(st.mtimeMs);
      const prev = db
        .query<{ mtime: number; size: number }, [string]>(
          "SELECT mtime, size FROM docs WHERE path = ?",
        )
        .get(file);
      if (prev && prev.mtime === mtime && prev.size === st.size) continue;
      const text = readFileSync(file, "utf8");
      const name = basename(file, ".md");
      const chunks = chunkMarkdown(text, name);
      db.transaction(() => {
        db.query("DELETE FROM chunks WHERE path = ?").run(file);
        for (const c of chunks) insert.run(file, r.kind, c.title, c.body);
        db.query(
          "INSERT OR REPLACE INTO docs (path, kind, mtime, size) VALUES (?, ?, ?, ?)",
        ).run(file, r.kind, mtime, st.size);
      })();
      changed++;
    }
  }
  for (const { path } of db
    .query<{ path: string }, []>("SELECT path FROM docs")
    .all()) {
    if (!seen.has(path) && !existsSync(path)) {
      db.query("DELETE FROM chunks WHERE path = ?").run(path);
      db.query("DELETE FROM docs WHERE path = ?").run(path);
    }
  }
  db.close();
  return { files, changed };
}

export function searchMemory(
  query: string,
  limit = 8,
  dbPath = DB_PATH,
): Hit[] {
  if (!existsSync(dbPath)) indexAll(dbPath);
  const db = openIndex(dbPath);
  const terms = query.toLowerCase().match(/[\p{L}\p{N}_]{2,}/gu) ?? [];
  if (terms.length === 0) {
    db.close();
    return [];
  }
  for (const op of ["AND", "OR"] as const) {
    const fts = terms.map((t) => `"${t}"*`).join(` ${op} `);
    const rows = db
      .query<Hit, [string, number]>(
        "SELECT path, kind, title, snippet(chunks, 3, '[', ']', ' ... ', 24) AS snippet, bm25(chunks, 0, 0, 4, 1) AS rank FROM chunks WHERE chunks MATCH ?1 ORDER BY rank LIMIT ?2",
      )
      .all(fts, limit);
    if (rows.length > 0) {
      db.close();
      return rows;
    }
  }
  db.close();
  return [];
}

export interface CloudSyncState {
  lastRevision: number;
  lastPushLine: number;
  lastCheckAt: number;
}

const CLOUD_STATE_PATH = join(LEARNING_DIR, "cloud-state.json");

export function loadCloudState(path = CLOUD_STATE_PATH): CloudSyncState {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as CloudSyncState;
  } catch {
    return { lastRevision: -1, lastPushLine: 0, lastCheckAt: 0 };
  }
}

export function autoPromoteDigests(
  inboxDir = INBOX_DIR,
  memoryDir = MEMORY_DIR,
): { promoted: number; filesRemoved: number } {
  if (!existsSync(inboxDir)) return { promoted: 0, filesRemoved: 0 };
  const digests = readdirSync(inboxDir).filter((f) => f.endsWith("-digest.md"));
  if (digests.length === 0) return { promoted: 0, filesRemoved: 0 };

  const targetMem = join(memoryDir, "learned-auto.md");
  const curBody = existsSync(targetMem)
    ? readFileSync(targetMem, "utf8")
    : "# Autonomous Self-Learned Rules & Recoveries\n\nFolded without human intervention from hook telemetry.\n";
  const seen = new Set(curBody.split(/\r?\n/).map((l) => l.trim()));
  const additions: string[] = [];

  for (const d of digests) {
    const p = join(inboxDir, d);
    const lines = readFileSync(p, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const m = /^- \[(correction|recovery|error) x(\d+)\]\s+\([^)]+\)\s+(.+)$/.exec(line.trim());
      if (!m) continue;
      const [, kind, countStr, body] = m;
      const count = Number(countStr);
      if (kind === "correction" || kind === "recovery" || count >= 2) {
        const entry = `- [${kind}] ${redactSecrets(body).slice(0, 220)}`;
        if (!seen.has(entry)) {
          seen.add(entry);
          additions.push(entry);
        }
      }
    }
    rmSync(p, { force: true });
  }

  if (additions.length > 0) {
    mkdirSync(memoryDir, { recursive: true });
    writeFileSync(targetMem, `${curBody.trimEnd()}\n${additions.join("\n")}\n`, "utf8");
    const indexPath = join(memoryDir, "MEMORY.md");
    if (existsSync(indexPath)) {
      const idx = readFileSync(indexPath, "utf8");
      if (!idx.includes("(learned-auto.md)")) {
        writeFileSync(
          indexPath,
          `${idx.trimEnd()}\n- [learned-auto](learned-auto.md) — Autonomously folded corrections and tool recoveries (zero approval required).\n`,
          "utf8",
        );
      }
    }
  }
  return { promoted: additions.length, filesRemoved: digests.length };
}

function resolveCloudConfig(): { url: string; token?: string; pcId: string } {
  const url = (process.env.APHRODY_LEARN_URL?.trim() || "https://learn.aphrody.com").replace(/\/$/, "");
  const tokenFile = join(homedir(), ".config", "aphrody", "learn.token");
  const token =
    process.env.APHRODY_LEARN_TOKEN?.trim() ||
    process.env.APHRODY_FLEET_TOKEN?.trim() ||
    (existsSync(tokenFile) ? readFileSync(tokenFile, "utf8").trim() : undefined);
  const pcId = `${platform()}-${hostname().replace(/[^A-Za-z0-9_.-]/g, "_").slice(0, 32)}`;
  return { url, token, pcId };
}

export async function syncCloudLearn(mode: "push" | "pull" | "cycle" = "cycle"): Promise<Record<string, unknown>> {
  const { url, token, pcId } = resolveCloudConfig();
  const cs = loadCloudState();
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  };
  let pushed = 0;
  let updatedRev = cs.lastRevision;

  try {
    if ((mode === "push" || mode === "cycle") && existsSync(JOURNAL_PATH)) {
      const lines = readFileSync(JOURNAL_PATH, "utf8").split(/\r?\n/).filter(Boolean);
      const start = Math.min(cs.lastPushLine, lines.length);
      const batch = lines
        .slice(start, start + 60)
        .map((l) => {
          try {
            return JSON.parse(l) as JournalEntry;
          } catch {
            return null;
          }
        })
        .filter((x): x is JournalEntry => x !== null && !!x.summary);
      if (batch.length > 0) {
        const res = await fetch(`${url}/api/learn/events?distill=1`, {
          method: "POST",
          headers,
          body: JSON.stringify({ harness: "agy", pcId, entries: batch }),
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          pushed = batch.length;
          cs.lastPushLine = Math.min(lines.length, start + 60);
        }
      } else {
        cs.lastPushLine = lines.length;
      }
    }

    if (mode === "pull" || mode === "cycle") {
      const mUrl = cs.lastRevision >= 0 ? `${url}/api/learn/manifest.json?since=${cs.lastRevision}` : `${url}/api/learn/manifest.json`;
      const man = await fetch(mUrl, { headers, signal: AbortSignal.timeout(3500) });
      if (man.status === 200) {
        const bRes = await fetch(`${url}/api/learn/bundle.json`, { headers, signal: AbortSignal.timeout(4500) });
        if (bRes.ok) {
          const bundle = (await bRes.json()) as {
            revision: number;
            updatedAt?: string;
            memory?: { topics?: Record<string, { title: string; summary: string; bullets: string[] }> };
            brain?: { docs?: Record<string, { path: string; content: string }> };
            skills?: { deltas?: Record<string, { skill: string; notes: string[] }> };
          };
          const topicLines = ["# Aphrody Cloud Memory (rev " + bundle.revision + ")", ""];
          for (const t of Object.values(bundle.memory?.topics ?? {})) {
            topicLines.push(`## ${t.title}`, t.summary || "", ...t.bullets.filter(isDurableCloudBullet).slice(0, 10).map((b) => `- ${b}`), "");
          }
          mkdirSync(MEMORY_DIR, { recursive: true });
          writeFileSync(join(MEMORY_DIR, "learned-cloud.md"), `${topicLines.join("\n").trim()}\n`, "utf8");
          const indexPath = join(MEMORY_DIR, "MEMORY.md");
          if (existsSync(indexPath)) {
            const idx = readFileSync(indexPath, "utf8");
            if (!idx.includes("(learned-cloud.md)")) {
              writeFileSync(
                indexPath,
                `${idx.trimEnd()}\n- [learned-cloud](learned-cloud.md) — Serverless unified memory, brain, and skills synced across Aphrody PCs.\n`,
                "utf8",
              );
            }
          }
          for (const doc of Object.values(bundle.brain?.docs ?? {})) {
            const dst = join(GEMINI_ROOT, "brain", "cloud", doc.path.replace(/^\/+/, ""));
            mkdirSync(dirname(dst), { recursive: true });
            writeFileSync(dst, doc.content, "utf8");
          }
          updatedRev = bundle.revision;
          cs.lastRevision = bundle.revision;
          indexAll();
        }
      }
    }
  } catch {
    // Non-blocking offline resilience.
  }

  cs.lastCheckAt = Date.now();
  mkdirSync(dirname(CLOUD_STATE_PATH), { recursive: true });
  writeFileSync(CLOUD_STATE_PATH, `${JSON.stringify(cs, null, 2)}\n`, "utf8");
  return { ok: true, pushed, revision: updatedRev, home: HOME };
}

if (import.meta.main) {
  const mode = Bun.argv[2] ?? "status";
  if (mode === "capture") {
    const event = await readHookEvent();
    if (event) recordEvent(event, detectHarness(Bun.argv[3]));
    writeEmpty();
  } else if (mode === "distill") {
    const out = distillJournal();
    const promoted = autoPromoteDigests();
    if (promoted.promoted > 0) indexAll();
    console.log(out ? `Distilled -> ${out} (auto-promoted ${promoted.promoted})` : `Auto-promoted ${promoted.promoted}`);
  } else if (mode === "distill-quiet") {
    await readHookEvent();
    distillJournal(JOURNAL_PATH, INBOX_DIR, STATE_PATH, 4);
    const promoted = autoPromoteDigests();
    if (promoted.promoted > 0) indexAll();
    await syncCloudLearn("cycle");
    writeEmpty();
  } else if (mode === "cloud-sync") {
    await readHookEvent();
    const res = await syncCloudLearn("cycle");
    console.log(JSON.stringify(res));
  } else if (mode === "nudge") {
    await readHookEvent();
    const promoted = autoPromoteDigests();
    if (promoted.promoted > 0) indexAll();
    const cloudState = loadCloudState();
    if (Date.now() - cloudState.lastCheckAt > 120_000) {
      spawn(
        "bun",
        ["--no-install", "--no-env-file", import.meta.path, "cloud-sync"],
        { detached: true, stdio: "ignore", windowsHide: true },
      ).unref();
    }
    writeEmpty();
  } else if (mode === "index") {
    console.log(JSON.stringify(indexAll()));
  } else if (mode === "search") {
    const q = Bun.argv.slice(3).join(" ");
    console.log(JSON.stringify(searchMemory(q), null, 2));
  } else {
    const lines = existsSync(JOURNAL_PATH)
      ? readFileSync(JOURNAL_PATH, "utf8").split(/\r?\n/).filter(Boolean).length
      : 0;
    const digests = existsSync(INBOX_DIR)
      ? readdirSync(INBOX_DIR).filter((f) => f.endsWith("-digest.md")).length
      : 0;
    const s = loadState();
    console.log(
      JSON.stringify({
        totalLines: lines,
        pendingLines: Math.max(0, lines - s.lastLineCount),
        pendingDigests: digests,
        lastDistillAt: s.lastDistillAt,
        dbExists: existsSync(DB_PATH),
      }),
    );
  }
}
