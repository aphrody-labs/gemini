import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SCRIPT = join(import.meta.dir, "title.ts");

let tmp: string;
let project: string;
beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), "gemini-title-test-"));
  project = join(tmp, "demo-project");
  mkdirSync(join(project, ".git"), { recursive: true });
  writeFileSync(join(project, ".git", "HEAD"), "ref: refs/heads/main\n");
});
afterAll(() => {
  rmSync(tmp, { recursive: true, force: true });
});

const run = (stdin: string, cwd = tmp) =>
  Bun.spawnSync(["bun", "--no-install", "--no-env-file", SCRIPT], {
    cwd,
    stdin: new TextEncoder().encode(stdin),
    stdout: "pipe",
    stderr: "pipe",
  });

describe("title.ts", () => {
  test("renders state, folder, branch and title within 100 chars", () => {
    const r = run(
      JSON.stringify({
        workspace: { project_dir: project },
        agent_state: "running",
        conversation_title: "x".repeat(200),
      }),
    );
    expect(r.exitCode).toBe(0);
    const out = r.stdout.toString();
    expect(out.startsWith("[running] agy demo-project (main) - ")).toBe(true);
    expect(out.length).toBe(100);
  });
});
