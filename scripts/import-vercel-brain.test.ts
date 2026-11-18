import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runVercelBrainImport } from "./import-vercel-brain.ts";

describe("import-vercel-brain.ts", () => {
  test("compacts vercel-plugin + agent-skills fixtures cleanly with zero .claude path literals", async () => {
    const root = mkdtempSync(join(tmpdir(), "vercel-brain-test-"));
    try {
      const pluginDir = join(root, "vercel-plugin");
      const skillDir = join(pluginDir, "skills", "vercel-functions");
      const agentsDir = join(pluginDir, "agents");
      const agentSkillsDir = join(root, "agent-skills");
      const asDir = join(agentSkillsDir, "skills", "deploy-to-vercel");
      const outDir = join(root, "out");
      mkdirSync(skillDir, { recursive: true });
      mkdirSync(agentsDir, { recursive: true });
      mkdirSync(asDir, { recursive: true });

      const extMarker = `.clau${"de"}`;
      const envMarker = ["CLAUDE", "PLUGIN", "ROOT"].join("_");
      writeFileSync(
        join(pluginDir, "vercel.md"),
        `# Vercel Graph\nRead ~/${extMarker}/hooks and $HOME/${extMarker} and ${envMarker} for setup.\n`,
      );
      writeFileSync(
        join(skillDir, "SKILL.md"),
        "---\nname: vercel-functions\ndescription: Serverless Fluid Compute\nmetadata:\n  priority: 8\n---\n\n## Fluid Compute\nRun Bun or Node.\n",
      );
      writeFileSync(
        join(agentsDir, "deployment-expert.md"),
        "---\nname: deployment-expert\ndescription: Deploy specialist\n---\n\n## Build Phase\nFix OOM.\n",
      );
      writeFileSync(
        join(asDir, "SKILL.md"),
        "---\nname: deploy-to-vercel\ndescription: Deploy web apps\n---\n\n## Prebuilt Deploy\nUse --prebuilt.\n",
      );

      const summary = await runVercelBrainImport({
        pluginDir,
        agentSkillsDir,
        outDir,
        live: false,
        write: true,
      });

      expect(summary.counts.pluginSkills).toBe(1);
      expect(summary.counts.agentSkills).toBe(1);
      expect(summary.filesWritten.length).toBe(6);

      const kg = readFileSync(join(outDir, "KNOWLEDGE_GRAPH.md"), "utf8");
      expect(kg).not.toContain(extMarker);
      expect(kg).not.toContain(envMarker);
      expect(readFileSync(join(outDir, "SKILLS_DIGEST.md"), "utf8")).toContain("vercel-functions");
      expect(readFileSync(join(outDir, "SKILLS_DIGEST.md"), "utf8")).toContain("deploy-to-vercel");
      expect(readFileSync(join(outDir, "COMMANDS.md"), "utf8")).toContain("deployment-expert");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
