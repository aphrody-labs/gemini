import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SCRIPT = join(import.meta.dir, "statusline.ts");

let tmp: string;
let project: string;
beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), "gemini-status-test-"));
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

describe("statusline.ts", () => {
  test("renders model, folder, branch, context and cost", () => {
    const r = run(
      JSON.stringify({
        model: { display_name: "Gemini 4" },
        workspace: { project_dir: project },
        cycle_mode: "auto",
        context_window: { used_percentage: 27.6 },
        cost: { total_usd: 0.45 },
      }),
    );
    expect(r.exitCode).toBe(0);
    expect(r.stdout.toString()).toBe(
      "Gemini 4 | demo-project (main) | [auto] | ctx 28% | $0.45",
    );
  });

  test("handles empty stdin gracefully", () => {
    const r = run("", project);
    expect(r.exitCode).toBe(0);
    expect(r.stdout.toString()).toBe("agy | demo-project (main)");
  });
});
