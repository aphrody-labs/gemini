import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  extractCrateDocComment,
  extractPubItems,
  importGpuiBrain,
  parsePubModules,
  parseUpstreamToml,
} from "./import-gpui-brain.ts";

let tmp: string;
beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), "gemini-gpui-brain-test-"));
});
afterAll(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe("import-gpui-brain.ts", () => {
  test("extractCrateDocComment stops cleanly before code or extern crate", () => {
    const src = `//! Behavior and foundations.\n//!\n//! Keeps state separate.\n\nextern crate ropey_kit as ropey;\nmod button;\n`;
    expect(extractCrateDocComment(src)).toBe("Behavior and foundations. Keeps state separate.");
  });

  test("parsePubModules and extractPubItems inspect Rust modules", () => {
    const src = `mod private;\npub mod button;\npub mod dialog;\npub struct Path<T = Pixels> {}\npub fn init() {}\n`;
    expect(parsePubModules(src)).toEqual(["button", "dialog"]);
    expect(extractPubItems(src)).toEqual(["struct Path", "fn init"]);
  });

  test("parseUpstreamToml parses UPSTREAM commit metadata", () => {
    const raw = `zed_commit = "abc1234"\nimport_commit = "def5678"\ntracked = [\n  "crates/gpui",\n  "crates/gpui_wgpu",\n]\n`;
    expect(parseUpstreamToml(raw)).toEqual({
      zedCommit: "abc1234",
      importCommit: "def5678",
      tracked: ["crates/gpui", "crates/gpui_wgpu"],
    });
  });

  test("importGpuiBrain generates all 5 digests and skips cleanly when workspace absent", async () => {
    const missing = await importGpuiBrain({ aphrodyRoot: join(tmp, "nope"), outDir: join(tmp, "unused") });
    expect(missing.skipped).toBe(true);

    const fakeRepo = join(tmp, "fake-aphrody");
    const fakeFast = join(tmp, "fake-fast");
    const outDir = join(tmp, "out-gpui-brain");

    mkdirSync(join(fakeRepo, "crates", "gpui", "src"), { recursive: true });
    mkdirSync(join(fakeRepo, "crates", "gpui-base", "src"), { recursive: true });
    mkdirSync(join(fakeRepo, "crates", "gpui-component", "src"), { recursive: true });
    mkdirSync(join(fakeRepo, "crates", "gpui-kit", "src"), { recursive: true });
    mkdirSync(join(fakeRepo, "crates", "gpui_ui", "src"), { recursive: true });
    mkdirSync(join(fakeRepo, "crates", "gpui_code", "src"), { recursive: true });
    mkdirSync(join(fakeRepo, "assets", "os"), { recursive: true });
    mkdirSync(
      join(fakeRepo, ".agents", "plugins", "aphrody", "skills", "gpui-kit", "references", "gpui"),
      { recursive: true },
    );

    writeFileSync(join(fakeRepo, "crates", "gpui", "Cargo.toml"), '[package]\nname = "gpui"\n');
    writeFileSync(join(fakeRepo, "crates", "gpui", "src", "gpui.rs"), "mod window;\nmod view;\n");
    writeFileSync(join(fakeRepo, "crates", "gpui-base", "src", "lib.rs"), "//! Base\npub mod button;\n");
    writeFileSync(join(fakeRepo, "crates", "gpui-base", "src", "button.rs"), "//! Button behavior\npub struct ButtonBase;\n");
    writeFileSync(join(fakeRepo, "crates", "gpui-component", "src", "lib.rs"), "pub mod button;\n");
    writeFileSync(join(fakeRepo, "crates", "gpui-component", "src", "button.rs"), "//! Styled button\npub struct Button;\n");
    writeFileSync(join(fakeRepo, "crates", "gpui-kit", "Cargo.toml"), '[package]\nname = "gpui-kit"\nversion = "0.10.0"\n');
    writeFileSync(join(fakeRepo, "crates", "gpui-kit", "src", "lib.rs"), "//! Kit facade\n");
    writeFileSync(join(fakeRepo, "crates", "gpui_ui", "src", "gpui_ui.rs"), "pub fn application() {}\n");
    writeFileSync(join(fakeRepo, "crates", "gpui_code", "src", "gpui_code.rs"), "pub struct CodeMod;\n");
    writeFileSync(join(fakeRepo, "assets", "os", "upstream_sync_lock.toml"), 'zed = "123"\n');
    writeFileSync(
      join(fakeRepo, ".agents", "plugins", "aphrody", "skills", "gpui-kit", "references", "conventions.md"),
      "# Conventions\nUse Switch::on_change.\n",
    );
    writeFileSync(
      join(fakeRepo, ".agents", "plugins", "aphrody", "skills", "gpui-kit", "references", "coding-guides.md"),
      "# Coding Guides\n## State ownership\nOwn state in parent Entity.\n",
    );
    writeFileSync(
      join(fakeRepo, ".agents", "plugins", "aphrody", "skills", "gpui-kit", "references", "gpui", "entity.md"),
      "# Entity\nEntity<T> manages UI state.\n",
    );

    mkdirSync(join(fakeFast, "crates", "gpui", "src", "fast", "layers"), { recursive: true });
    mkdirSync(join(fakeFast, "crates", "gpui", "src", "fast", "tests"), { recursive: true });
    mkdirSync(join(fakeFast, "docs"), { recursive: true });
    mkdirSync(join(fakeFast, "compat"), { recursive: true });
    writeFileSync(join(fakeFast, "UPSTREAM"), 'zed_commit = "aaaa"\nimport_commit = "bbbb"\ntracked = ["crates/gpui"]\n');
    writeFileSync(join(fakeFast, "README.md"), "# GPUI Fast\n| Scenario | GPUI | GPUI Fast |\n| a | 5ms | 0.5ms |\n");
    writeFileSync(join(fakeFast, "compat", "README.md"), "# compat\n");
    writeFileSync(join(fakeFast, "docs", "architecture.md"), "# Architecture\n");
    writeFileSync(join(fakeFast, "crates", "gpui", "src", "fast", "mod.rs"), "//! Fast root\npub(crate) mod retained;\n");
    writeFileSync(join(fakeFast, "crates", "gpui", "src", "fast", "retained.rs"), "//! Retained subtrees\npub(crate) struct RetainedSubtree;\n");
    writeFileSync(join(fakeFast, "crates", "gpui", "src", "fast", "layers", "policy.rs"), "//! Layer policy\npub(crate) enum LayerDecision { Composite }\n");
    writeFileSync(join(fakeFast, "crates", "gpui", "src", "fast", "tests", "oracle.rs"), "//! Oracle test\n");

    const summary = await importGpuiBrain({ aphrodyRoot: fakeRepo, fastRoot: fakeFast, outDir });
    expect(summary.skipped).toBe(false);
    expect(summary.counts).toEqual({
      gpuiRefDocs: 1,
      kitComponentModules: 1,
      baseModules: 1,
      fastModules: 3,
      fastTests: 1,
    });

    for (const file of ["INDEX.md", "GPUI_CORE.md", "GPUI_KIT.md", "GPUI_FAST.md", "UNIFICATION_MATRIX.md"]) {
      expect(existsSync(join(outDir, file))).toBe(true);
    }
    const fastMd = readFileSync(join(outDir, "GPUI_FAST.md"), "utf8");
    expect(fastMd).toContain("RetainedSubtree");
    expect(fastMd).toContain("LayerDecision");
    const kitMd = readFileSync(join(outDir, "GPUI_KIT.md"), "utf8");
    expect(kitMd).toContain("ButtonBase");
  });
});
