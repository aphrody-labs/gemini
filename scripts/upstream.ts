#!/usr/bin/env bun
// Vendors the text parts of Google's official Gemini and Antigravity repositories into upstream/, compacted.
// upstream/upstream.toml lists the sources; upstream/lock.json pins each one to a commit. Only files that are text, small
// and useful to an agent (skills, extension manifests and commands, docs, licenses) are fetched, one raw file at a time,
// so no clone, no binary and no dependency tree is ever downloaded.
//   bun scripts/upstream.ts plan            count what each source would add (no download)
//   bun scripts/upstream.ts fetch [repo..]  download the selected files at the pinned (or current) commit, rebuild the index
//   bun scripts/upstream.ts update          move every pin to the current default-branch commit, then fetch
//   bun scripts/upstream.ts check           report sources whose upstream moved, and files that fail the rules
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
export const OUT = join(ROOT, "upstream");

export type Source = { repo: string; kind: string; take?: string[]; skip?: string[]; max_kb?: number; note?: string };
export type Rules = { take: RegExp[]; skip: RegExp[]; maxBytes: number };

const TEXT = /\.(md|mdx|json|toml|ya?ml|txt)$/i;
const LEGAL = /(^|\/)(LICENSE|NOTICE)(\.[a-z]+)?$/i;
const NOISE =
  /(^|\/)(node_modules|dist|build|out|coverage|tests?|__tests__|__snapshots__|fixtures?|testdata|vendor|third_party|\.github|\.git[a-z]*|\.vscode|\.idea|assets|images?|static|public)\//i;
const NOISE_FILE =
  /(^|\/)(package(-lock)?\.json|tsconfig[^/]*\.json|CHANGELOG[^/]*|CODE_OF_CONDUCT[^/]*|CONTRIBUTING[^/]*|SECURITY[^/]*|\.[^/]*rc(\.json)?|[^/]*\.lock|[^/]*\.schema\.json|[^/]*lock\.ya?ml|renovate\.json|dependabot\.ya?ml)$/i;

/** Whether a repository path belongs in the vendored copy. */
export function wanted(path: string, size: number, rules: Rules): boolean {
  if (size > rules.maxBytes) return false;
  if (LEGAL.test(path)) return !NOISE.test(path);
  if (!TEXT.test(path) || NOISE.test(path) || NOISE_FILE.test(path)) return false;
  if (rules.skip.some((rx) => rx.test(path))) return false;
  return rules.take.length === 0 || rules.take.some((rx) => rx.test(path));
}

export const rulesOf = (source: Source): Rules => ({
  take: (source.take ?? []).map((glob) => new RegExp(glob)),
  skip: (source.skip ?? []).map((glob) => new RegExp(glob)),
  maxBytes: (source.max_kb ?? 200) * 1024,
});

export const slug = (repo: string) => repo.replace("/", "__");

export type Page = { url: string; path: string; license: string };
export type Pointer = { repo: string; note: string };
const registry = () => Bun.TOML.parse(readFileSync(join(OUT, "upstream.toml"), "utf8")) as { source: Source[]; page?: Page[]; pointer?: Pointer[] };
export const loadSources = (): Source[] => registry().source;
export const loadPages = (): Page[] => registry().page ?? [];
export const loadPointers = (): Pointer[] => registry().pointer ?? [];

async function fetchPage(page: Page) {
  const response = await fetch(page.url);
  if (!response.ok) throw new Error(`${response.status} ${page.url}`);
  const text = cleanText(new Uint8Array(await response.arrayBuffer()));
  if (text === undefined) throw new Error(`${page.url} is not UTF-8 text`);
  const target = join(OUT, page.path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `<!-- source: ${page.url} | license: ${page.license} | fetched: ${new Date().toISOString().slice(0, 10)} -->\n${text}`);
  console.log(`${page.url.padEnd(58)} ${String(Math.round(text.length / 1024)).padStart(6)} KB`);
}

type Lock = Record<string, { commit: string; files: number; bytes: number }>;
const lockPath = join(OUT, "lock.json");
const readLock = (): Lock => (existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, "utf8")) : {});

async function gh<T>(path: string): Promise<T> {
  const process_ = Bun.spawn(["gh", "api", path], { stdout: "pipe", stderr: "pipe" });
  const [out, err, code] = await Promise.all([new Response(process_.stdout).text(), new Response(process_.stderr).text(), process_.exited]);
  if (code !== 0) throw new Error(`gh api ${path}: ${err.trim().split("\n")[0]}`);
  return JSON.parse(out) as T;
}

/** The default-branch commit and the selected files (path, size) of a repository at a commit. */
export async function select(source: Source, commit?: string): Promise<{ commit: string; files: { path: string; size: number }[] }> {
  const head = commit ?? (await gh<{ sha: string }>(`repos/${source.repo}/commits/HEAD`)).sha;
  const tree = await gh<{ tree: { path: string; type: string; size?: number }[]; truncated: boolean }>(`repos/${source.repo}/git/trees/${head}?recursive=1`);
  if (tree.truncated) console.error(`warning: ${source.repo} tree is truncated by the API`);
  const rules = rulesOf(source);
  const files = tree.tree.filter((entry) => entry.type === "blob" && wanted(entry.path, entry.size ?? 0, rules)).map((entry) => ({ path: entry.path, size: entry.size ?? 0 }));
  return { commit: head, files };
}

async function pool<T, R>(items: T[], width: number, work: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(width, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await work(items[index]!);
      }
    }),
  );
  return results;
}

/** A file's bytes are kept only when they decode as UTF-8 without NUL (the failure that breaks agent conversations). */
export function cleanText(bytes: Uint8Array): string | undefined {
  if (bytes.includes(0)) return undefined;
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes).replace(/^﻿/, "").replace(/\r\n/g, "\n");
  } catch {
    return undefined;
  }
}

async function raw(repo: string, commit: string, path: string): Promise<Uint8Array> {
  const url = `https://raw.githubusercontent.com/${repo}/${commit}/${path.split("/").map(encodeURIComponent).join("/")}`;
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(url);
    if (response.ok) return new Uint8Array(await response.arrayBuffer());
    if (attempt >= 3 || response.status === 404) throw new Error(`${response.status} ${url}`);
    await Bun.sleep(500 * (attempt + 1));
  }
}

async function fetchSource(source: Source, lock: Lock, move: boolean) {
  const pinned = move ? undefined : lock[source.repo]?.commit;
  const { commit, files } = await select(source, pinned);
  const dir = join(OUT, slug(source.repo));
  rmSync(dir, { recursive: true, force: true });
  let kept = 0;
  let bytes = 0;
  await pool(files, 16, async (file) => {
    const text = cleanText(await raw(source.repo, commit, file.path));
    if (text === undefined) return;
    const target = join(dir, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, text);
    kept++;
    bytes += text.length;
  });
  lock[source.repo] = { commit, files: kept, bytes };
  console.log(`${source.repo.padEnd(58)} ${commit.slice(0, 9)} ${String(kept).padStart(5)} files ${String(Math.round(bytes / 1024)).padStart(6)} KB`);
}

if (import.meta.main) {
  const [command = "plan", ...only] = Bun.argv.slice(2);
  const sources = loadSources().filter((source) => only.length === 0 || only.includes(source.repo));
  if (command === "plan") {
    let total = 0;
    for (const source of sources) {
      const { commit, files } = await select(source, readLock()[source.repo]?.commit);
      const size = files.reduce((sum, file) => sum + file.size, 0);
      total += size;
      console.log(`${source.repo.padEnd(58)} ${commit.slice(0, 9)} ${String(files.length).padStart(5)} files ${String(Math.round(size / 1024)).padStart(6)} KB`);
    }
    console.log(`total ${Math.round(total / 1024)} KB`);
  } else if (command === "fetch" || command === "update") {
    const lock = readLock();
    mkdirSync(OUT, { recursive: true });
    for (const source of sources) await fetchSource(source, lock, command === "update");
    if (only.length === 0) for (const page of loadPages()) await fetchPage(page);
    writeFileSync(lockPath, JSON.stringify(Object.fromEntries(Object.entries(lock).sort()), null, 2) + "\n");
    const { buildIndex } = await import("./upstream-index.ts");
    await buildIndex();
  } else if (command === "check") {
    const lock = readLock();
    let drift = 0;
    for (const source of sources) {
      const head = (await gh<{ sha: string }>(`repos/${source.repo}/commits/HEAD`)).sha;
      const pinned = lock[source.repo]?.commit;
      if (head !== pinned) {
        drift++;
        console.log(`${source.repo}: pinned ${pinned?.slice(0, 9) ?? "none"}, upstream ${head.slice(0, 9)}`);
      }
    }
    console.log(drift ? `${drift} source(s) moved` : "all pins are current");
  } else {
    console.error("usage: upstream.ts plan|fetch|update|check [owner/repo ...]");
    process.exit(2);
  }
}
