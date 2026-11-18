import { describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { importDockerBrain } from "./import-docker-brain.ts";

describe("import-docker-brain.ts", () => {
  test("digests sample official docker docs, skills, and mcp-gateway docs reproducibly", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "docker-brain-import-"));
    try {
      const docs = join(tmp, "docs", "content", "manuals", "build");
      const skills = join(tmp, "skills", "skills", "docker-build-strategies");
      const mcpgw = join(tmp, "mcpgw", "docs");
      mkdirSync(docs, { recursive: true });
      mkdirSync(skills, { recursive: true });
      mkdirSync(mcpgw, { recursive: true });

      writeFileSync(
        join(docs, "bake.md"),
        "---\ntitle: Buildx Bake\ndescription: Declarative multi-target Docker builds\n---\n# Targets\n- Use docker-bake.hcl for scalable builds.\n",
      );
      writeFileSync(
        join(skills, "SKILL.md"),
        "---\nname: docker-build-strategies\ndescription: Multi-stage BuildKit caching best practices\n---\n# Multi-stage\n- Keep runtime lean.\n",
      );
      writeFileSync(join(mcpgw, "mcp-gateway.md"), "# Docker MCP Gateway\n- Run docker mcp gateway run.\n");

      const outDir = join(tmp, "out");
      const res = await importDockerBrain({
        docsDir: join(tmp, "docs"),
        skillsDir: join(tmp, "skills"),
        mcpGwDir: join(tmp, "mcpgw"),
        outDir,
      });

      expect(res.counts).toEqual({ manuals: 1, skills: 1, mcpDocs: 1 });
      expect(existsSync(join(outDir, "INDEX.md"))).toBe(true);
      expect(existsSync(join(outDir, "DOCS_DIGEST.md"))).toBe(true);
      expect(existsSync(join(outDir, "SKILLS_DIGEST.md"))).toBe(true);
      expect(existsSync(join(outDir, "MCP_GATEWAY.md"))).toBe(true);
      expect(existsSync(join(outDir, "BEST_PRACTICES.md"))).toBe(true);
      expect(readFileSync(join(outDir, "DOCS_DIGEST.md"), "utf8")).toContain("Buildx Bake");
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
