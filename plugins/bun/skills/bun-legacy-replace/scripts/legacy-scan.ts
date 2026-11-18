#!/usr/bin/env bun
import { resolve } from "node:path";
import { buildMigratePlan, scanPath } from "../../../lib/legacy-scanner.ts";

interface CliOpts {
  targetPath: string;
  json: boolean;
  fix: boolean;
  aggressive: boolean;
  write: boolean;
  plan: boolean;
  target: "bun" | "rust";
}

function parseArgs(argv: string[]): CliOpts {
  const opts: CliOpts = {
    targetPath: ".",
    json: false,
    fix: false,
    aggressive: false,
    write: false,
    plan: false,
    target: "bun",
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "--json") opts.json = true;
    else if (a === "--fix") opts.fix = true;
    else if (a === "--aggressive") {
      opts.aggressive = true;
      opts.fix = true;
    } else if (a === "--write") {
      opts.write = true;
      opts.fix = true;
    } else if (a === "--plan") opts.plan = true;
    else if (a === "--target" && argv[i + 1]) {
      opts.target = argv[++i] === "rust" ? "rust" : "bun";
      opts.plan = true;
    } else if (a.startsWith("--target=")) {
      opts.target = a.slice("--target=".length) === "rust" ? "rust" : "bun";
      opts.plan = true;
    } else if (a === "-h" || a === "--help") {
      console.log(
        "Usage: bun legacy-scan.ts [path] [--json] [--fix] [--aggressive] [--write] [--plan] [--target bun|rust]",
      );
      process.exit(0);
    } else if (!a.startsWith("-")) {
      opts.targetPath = a;
    }
  }
  return opts;
}

if (import.meta.main) {
  const opts = parseArgs(Bun.argv);
  const abs = resolve(opts.targetPath);
  if (opts.plan) {
    const plan = buildMigratePlan(abs, { target: opts.target });
    if (opts.json) {
      console.log(JSON.stringify(plan, null, 2));
    } else {
      console.log(`Migration Plan (${plan.target}) for ${plan.root}`);
      console.log(
        `Scanned ${plan.summary.filesScanned} files: ${plan.summary.safeAutofixCount} safe fix(es), ${plan.summary.aggressiveAutofixCount} aggressive fix(es), ${plan.summary.advisoryCount} advisory`,
      );
      for (const s of plan.steps) {
        console.log(`\n${s.phase}. ${s.title}${s.command ? `  [$ ${s.command}]` : ""}`);
        for (const item of s.items) console.log(`   - ${item}`);
      }
      if (plan.rustTarget) {
        console.log("\nRust target:");
        console.log(`  Addons -> bun:ffi cdylib: ${plan.rustTarget.addons.join(", ") || "none"}`);
        for (const h of plan.rustTarget.hotPackages) {
          console.log(`  Hot (${h.area}): ${h.pkg} -> crate ${h.crate}${h.repo ? ` (${h.repo})` : ""}`);
        }
        for (const t of plan.rustTarget.tools) {
          console.log(`  Tool: ${t.tool} -> ${t.to} (${t.note})`);
        }
      }
    }
    process.exit(0);
  }

  const res = scanPath(abs, {
    fix: opts.fix,
    aggressive: opts.aggressive,
    write: opts.write,
  });
  if (opts.json) {
    console.log(JSON.stringify(res, null, 2));
  } else {
    console.log(`Scanned ${res.filesScanned} file(s), found ${res.findings.length} legacy pattern(s).`);
    for (const f of res.findings.slice(0, 80)) {
      const repl = f.replacement ? ` -> ${f.replacement}` : "";
      const tag = f.fixable ? (f.aggressive ? "[aggressive]" : "[autofix]") : "[advisory]";
      console.log(`  ${f.file}:${f.line}:${f.column} ${f.severity} ${f.rule} ${tag}: ${f.message}${repl}`);
    }
    if (res.rewrites?.length) {
      console.log(
        `\n${opts.write ? "Updated" : "Previewed rewrites for"} ${res.rewrites.length} file(s): ${res.rewrites.map((r) => r.file).join(", ")}`,
      );
    }
  }
}
