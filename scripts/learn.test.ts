import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chunkMarkdown, distillJournal, openIndex, searchMemory } from "./learn.ts";

let tmp: string;
beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), "gemini-learn-test-"));
});
afterAll(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe("learn.ts", () => {
  test("chunkMarkdown splits headings cleanly", () => {
    const chunks = chunkMarkdown("# Title\n\nIntro\n\n## Section\n\nBody", "doc");
    expect(chunks.length).toBe(2);
    expect(chunks[0]?.title).toBe("doc > Title");
    expect(chunks[1]?.title).toBe("doc > Section");
  });

  test("distillJournal summarizes entries and updates state", () => {
    const journal = join(tmp, "journal.jsonl");
    const inbox = join(tmp, "inbox");
    const state = join(tmp, "state.json");
    writeFileSync(
      journal,
      [
        JSON.stringify({
          at: "2026-11-17T10:00:00Z",
          harness: "agy",
          session: "s1",
          cwd: tmp,
          kind: "error",
          tool: "run_command",
          summary: "bun x -> failed",
        }),
        JSON.stringify({
          at: "2026-11-17T10:01:00Z",
          harness: "agy",
          session: "s1",
          cwd: tmp,
          kind: "recovery",
          tool: "run_command",
          summary: "Recovered with bun test",
        }),
      ].join("\n") + "\n",
    );
    const out = distillJournal(journal, inbox, state, 1);
    expect(out).not.toBeNull();
    expect(existsSync(out!)).toBe(true);
    expect(readFileSync(out!, "utf8")).toContain("Entries processed: 2");
    expect(distillJournal(journal, inbox, state, 1)).toBeNull();
  });

  test("FTS5 index and searchMemory return ranked hits", () => {
    const dbPath = join(tmp, "mem.db");
    const db = openIndex(dbPath);
    db.query("INSERT INTO chunks (path, kind, title, body) VALUES (?, ?, ?, ?)").run(
      "test.md",
      "memory",
      "Quoting fix",
      "Remove embedded double quotes from cmd /c statusLine commands on Windows.",
    );
    db.close();
    const hits = searchMemory("double quotes statusLine", 5, dbPath);
    expect(hits.length).toBe(1);
    expect(hits[0]?.title).toBe("Quoting fix");
  });
});
