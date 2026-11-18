import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SCRIPT = join(import.meta.dir, "legacy-scan.ts");
let tmp: string;

beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), "bun-legacy-cli-"));
  mkdirSync(join(tmp, "src"), { recursive: true });
  writeFileSync(
    join(tmp, "package.json"),
    JSON.stringify({
      name: "legacy-demo",
      scripts: { test: "npm run unit", dev: "tsx src/app.ts" },
      dependencies: { glob: "^10.0.0", sharp: "^0.33.0" },
    }),
  );
  writeFileSync(
    join(tmp, "src", "app.ts"),
    'import path from "path";\nimport fs from "fs";\nexport const p = path.join(__dirname, "x");\nexport const txt = fs.readFileSync(p, "utf8");\n',
  );
  writeFileSync(join(tmp, "Dockerfile"), "FROM node:22-alpine\nRUN npm ci\n");
});

afterAll(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe("legacy-scan.ts CLI", () => {
  test("--json reports findings without mutating disk", () => {
    const r = Bun.spawnSync([process.execPath, "--no-install", "--no-env-file", SCRIPT, tmp, "--json"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    expect(r.exitCode).toBe(0);
    const data = JSON.parse(r.stdout.toString()) as { filesScanned: number; findings: Array<{ rule: string }> };
    expect(data.filesScanned).toBe(3);
    expect(data.findings.some((f) => f.rule === "imports/node-prefix")).toBe(true);
    expect(data.findings.some((f) => f.rule === "docker/node-base-alpine")).toBe(true);
    expect(readFileSync(join(tmp, "Dockerfile"), "utf8")).toContain("node:22-alpine");
  });

  test("--plan --target rust --json produces phased plan and Rust crates", () => {
    const r = Bun.spawnSync(
      [process.execPath, "--no-install", "--no-env-file", SCRIPT, tmp, "--plan", "--target", "rust", "--json"],
      { stdout: "pipe", stderr: "pipe" },
    );
    expect(r.exitCode).toBe(0);
    const plan = JSON.parse(r.stdout.toString()) as {
      steps: unknown[];
      rustTarget?: { hotPackages: Array<{ pkg: string; crate: string }> };
    };
    expect(plan.steps.length).toBe(4);
    expect(plan.rustTarget?.hotPackages.some((h) => h.pkg === "sharp" && h.crate === "image")).toBe(true);
  });

  test("--fix --write applies safe rewrites cleanly and is idempotent", () => {
    const r = Bun.spawnSync(
      [process.execPath, "--no-install", "--no-env-file", SCRIPT, tmp, "--fix", "--write", "--json"],
      { stdout: "pipe", stderr: "pipe" },
    );
    expect(r.exitCode).toBe(0);
    expect(readFileSync(join(tmp, "Dockerfile"), "utf8")).toContain("FROM oven/bun:1-alpine");
    expect(readFileSync(join(tmp, "src", "app.ts"), "utf8")).toContain('import path from "node:path"');
    expect(readFileSync(join(tmp, "src", "app.ts"), "utf8")).toContain("import.meta.dirname");

    const r2 = Bun.spawnSync(
      [process.execPath, "--no-install", "--no-env-file", SCRIPT, tmp, "--fix", "--write", "--json"],
      { stdout: "pipe", stderr: "pipe" },
    );
    const data2 = JSON.parse(r2.stdout.toString()) as { rewriteFiles?: unknown[]; rewrites?: unknown[] };
    expect(data2.rewrites ?? []).toEqual([]);
  });
});
