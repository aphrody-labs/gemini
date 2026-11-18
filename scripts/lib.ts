import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

export type Harness = "agy" | "gemini";

export const HOME = (
  process.env.USERPROFILE ??
  process.env.HOME ??
  homedir()
).replaceAll("\\", "/");
export const GEMINI_ROOT = resolve(import.meta.dir, "..").replaceAll("\\", "/");
export const CONFIG_DIR = `${GEMINI_ROOT}/config`;
export const CLI_DIR = `${GEMINI_ROOT}/antigravity-cli`;
export const LEARNING_DIR = `${GEMINI_ROOT}/learning`;
export const MEMORY_DIR = `${GEMINI_ROOT}/memory`;
export const RULES_DIR = `${GEMINI_ROOT}/rules`;

export interface RawHookEvent {
  hook_event_name?: string;
  hookEventName?: string;
  session_id?: string;
  conversationId?: string;
  transcript_path?: string;
  transcriptPath?: string;
  artifactDirectoryPath?: string;
  cwd?: string;
  workspacePaths?: string[];
  modelName?: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  tool_response?: unknown;
  toolCall?: {
    id?: string;
    name?: string;
    args?: Record<string, unknown>;
  };
  prompt?: string;
  user_prompt?: string;
  lastUserInput?: string;
  error?: string;
  [k: string]: unknown;
}

const SECRET_RE =
  /(sk-[A-Za-z0-9_-]{16,}|ghp_\w{20,}|gho_\w{20,}|github_pat_\w{20,}|AIza[\w-]{30,}|xox[bp]-[\w-]+|eyJ[\w-]{10,}\.[\w-]{10,}\.[\w-]{10,}|Bearer\s+\S{16,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|(?:api[_-]?key|token|secret|passw(?:or)?d)["']?\s*[=:]\s*["']?[^\s"',;]{6,})/gi;

export function toSlash(p: string): string {
  return p.replaceAll("\\", "/");
}

export function userEnv(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  const systemRoot = process.env.SystemRoot ?? process.env.windir;
  if (process.platform !== "win32" || !systemRoot) return undefined;
  const r = Bun.spawnSync(
    [
      join(systemRoot, "System32", "reg.exe"),
      "query",
      "HKCU\\Environment",
      "/v",
      name,
    ],
    { stdout: "pipe", stderr: "ignore", stdin: "ignore" },
  );
  return r.stdout
    .toString()
    .match(new RegExp(`^\\s*${name}\\s+REG_\\w+\\s+(.+?)\\s*$`, "m"))?.[1];
}

export function discoverWorkspaceRoot(): string {
  const candidates = [process.env.WORKSPACE_ROOT, userEnv("WORKSPACE_ROOT"), `${HOME}/src`].filter(
    (x): x is string => Boolean(x),
  );
  const found = candidates.find((d) => existsSync(d));
  return toSlash(resolve(found ?? `${HOME}/src`));
}

export function discoverAphrodyRoot(): string | undefined {
  const ws = discoverWorkspaceRoot();
  const candidates = [
    process.env.SRC_ROOT,
    userEnv("SRC_ROOT"),
    `${ws}/aphrody`,
  ].filter((x): x is string => Boolean(x));
  return candidates.find(
    (d) =>
      existsSync(join(d, "Cargo.toml")) &&
      existsSync(join(d, "crates", "gpui", "Cargo.toml")),
  );
}

export function discoverWorkspaces(): Record<string, string> {
  const wsRoot = discoverWorkspaceRoot();
  const map: Record<string, string> = {};
  if (existsSync(wsRoot)) {
    map[wsRoot] = "src";
    try {
      for (const entry of readdirSync(wsRoot, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
        const full = toSlash(join(wsRoot, entry.name));
        if (
          existsSync(join(full, ".git")) ||
          existsSync(join(full, "product.toml")) ||
          existsSync(join(full, "Cargo.toml")) ||
          existsSync(join(full, "package.json"))
        ) {
          const slug =
            entry.name
              .toLowerCase()
              .replace(/[^a-z0-9-]+/g, "-")
              .replace(/^-+|-+$/g, "") || "repo";
          map[full] = slug;
        }
      }
    } catch {
      // Ignore unreadable directories.
    }
  }
  map[GEMINI_ROOT] = "gemini";
  return map;
}

export function templateVars(): Record<string, string> {
  const wsRoot = discoverWorkspaceRoot();
  return {
    HOME,
    HOME_WIN: HOME.replaceAll("/", "\\"),
    GEMINI_ROOT,
    GEMINI_ROOT_WIN: GEMINI_ROOT.replaceAll("/", "\\"),
    WORKSPACE_ROOT: wsRoot,
    WORKSPACE_ROOT_WIN: wsRoot.replaceAll("/", "\\"),
    RELAY_URL: process.env.RELAY_URL ?? "http://127.0.0.1:8790",
  };
}

export function renderTemplate(
  raw: string,
  vars = templateVars(),
  jsonEscape = false,
): string {
  let out = raw;
  for (const [k, v] of Object.entries(vars)) {
    const val = jsonEscape ? v.replaceAll("\\", "\\\\") : v;
    out = out.replaceAll(`{{${k}}}`, val).replaceAll(`\${${k}}`, val);
  }
  return out;
}

export function writeIfChanged(path: string, content: string): boolean {
  if (existsSync(path)) {
    try {
      if (readFileSync(path, "utf8") === content) return false;
    } catch {
      // Rewrite unreadable file.
    }
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
  return true;
}

/** Materializes a directory copy without symlinks/junctions so Go's os.ReadDir discovers plugins on Windows. */
export function syncRealDir(srcDir: string, dstDir: string): void {
  if (!existsSync(srcDir)) return;
  try {
    const st = lstatSync(dstDir);
    if (st.isSymbolicLink() || st.isDirectory() || st.isFile()) {
      rmSync(dstDir, { recursive: true, force: true });
    }
  } catch {
    // Destination absent.
  }
  mkdirSync(dirname(dstDir), { recursive: true });
  cpSync(srcDir, dstDir, { recursive: true });
}

export function runCmd(
  cmd: string[],
  cwd = GEMINI_ROOT,
): { ok: boolean; code: number; out: string; err: string } {
  const r = Bun.spawnSync(cmd, {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
    stdin: "ignore",
  });
  return {
    ok: r.exitCode === 0,
    code: r.exitCode,
    out: r.stdout.toString().trim(),
    err: r.stderr.toString().trim(),
  };
}

export function detectHarness(arg?: string): Harness {
  if (arg === "gemini" || arg === "agy") return arg;
  if (process.env.GEMINI_CLI || process.env.extensionPath) return "gemini";
  return "agy";
}

export function redactSecrets(input: string): string {
  return input.replace(SECRET_RE, "[redacted]");
}

export async function readHookEvent(): Promise<RawHookEvent | null> {
  if (process.stdin.isTTY) return null;
  try {
    const text = await new Response(Bun.stdin.stream()).text();
    if (!text.trim()) return null;
    return JSON.parse(text) as RawHookEvent;
  } catch {
    return null;
  }
}

export function extractSessionId(event: RawHookEvent): string {
  const id = event.session_id ?? event.conversationId;
  return typeof id === "string" ? id : "";
}

export function extractCwd(event: RawHookEvent): string {
  if (typeof event.cwd === "string" && event.cwd) return event.cwd;
  if (
    Array.isArray(event.workspacePaths) &&
    typeof event.workspacePaths[0] === "string" &&
    event.workspacePaths[0]
  ) {
    return event.workspacePaths[0];
  }
  return process.cwd();
}

export function extractToolName(event: RawHookEvent): string {
  const name = event.tool_name ?? event.toolCall?.name;
  return typeof name === "string" ? name : "";
}

export function extractToolArgs(event: RawHookEvent): Record<string, unknown> {
  if (event.toolCall?.args && typeof event.toolCall.args === "object") {
    return event.toolCall.args;
  }
  if (event.tool_input && typeof event.tool_input === "object") {
    return event.tool_input;
  }
  return {};
}

export function extractPrompt(event: RawHookEvent): string {
  const p = event.prompt ?? event.user_prompt ?? event.lastUserInput;
  return typeof p === "string" ? p : "";
}

export function extractCommand(event: RawHookEvent): string {
  const input = extractToolArgs(event);
  const cmd = input.command ?? input.CommandLine ?? input.cmd;
  return typeof cmd === "string" ? cmd : "";
}

export function extractFilePath(event: RawHookEvent): string {
  const input = extractToolArgs(event);
  const fp =
    input.file_path ??
    input.Path ??
    input.TargetFile ??
    input.AbsolutePath ??
    input.path;
  return typeof fp === "string" ? fp : "";
}

export function writeEmpty(): void {
  process.stdout.write("{}");
}

export function allowPreTool(
  harness: Harness,
  updatedInput?: Record<string, unknown>,
  note?: string,
): void {
  if (harness === "gemini") {
    const payload: Record<string, unknown> = { decision: "allow" };
    if (updatedInput) payload.hookSpecificOutput = { tool_input: updatedInput };
    if (note) payload.systemMessage = note;
    process.stdout.write(JSON.stringify(payload));
    return;
  }
  const payload: Record<string, unknown> = { decision: "allow" };
  if (updatedInput) payload.overwrite = updatedInput;
  if (note) payload.reason = note;
  process.stdout.write(JSON.stringify(payload));
}

export function emitContext(
  harness: Harness,
  hookEventName: "PostToolUse" | "SessionStart" | "UserPromptSubmit",
  text: string,
): void {
  if (harness === "agy") {
    if (hookEventName === "PostToolUse") {
      console.error(text);
      writeEmpty();
      return;
    }
    process.stdout.write(
      JSON.stringify({
        injectSteps: [{ systemMessage: { systemMessage: text } }],
      }),
    );
    return;
  }
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName,
        additionalContext: text,
      },
    }),
  );
}
