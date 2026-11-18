#!/usr/bin/env bun
// Distills live Aphrody GPUI Core, GPUI Kit 0.10+, and GPUI Fast sources + docs
// into deterministic, FTS5-indexed Markdown digests in ~/.gemini/brain/gpui/.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { discoverAphrodyRoot, GEMINI_ROOT, toSlash, writeIfChanged } from "./lib.ts";

export const BRAIN_GPUI_DIR = join(GEMINI_ROOT, "brain", "gpui");

export interface GpuiImportOptions {
  aphrodyRoot?: string;
  fastRoot?: string;
  outDir?: string;
  write?: boolean;
}

export interface GpuiImportSummary {
  skipped: boolean;
  reason?: string;
  aphrodyRoot?: string;
  fastRoot?: string;
  outDir: string;
  sourceBytes: number;
  outputBytes: number;
  compressionRatio: number;
  filesWritten: string[];
  counts: {
    gpuiRefDocs: number;
    kitComponentModules: number;
    baseModules: number;
    fastModules: number;
    fastTests: number;
  };
}

export interface FastModuleDigest {
  name: string;
  relPath: string;
  summary: string;
  exports: string[];
  bytes: number;
}

export interface CrateModuleInfo {
  name: string;
  summary: string;
  reexports: string[];
}

export function discoverGpuiFastRoot(explicit?: string, aphrodyRoot?: string): string | null {
  const candidates = [
    explicit,
    process.env.GPUI_FAST_ROOT,
    aphrodyRoot ? join(aphrodyRoot, "target", "agent-forks", "gpui-fast") : undefined,
    aphrodyRoot ? join(aphrodyRoot, "..", "gpui-fast") : undefined,
  ].filter((x): x is string => Boolean(x));
  for (const raw of candidates) {
    const abs = toSlash(resolve(raw));
    if (
      existsSync(join(abs, "crates", "gpui", "src", "fast", "mod.rs")) &&
      existsSync(join(abs, "docs", "architecture.md"))
    ) {
      return abs;
    }
  }
  return null;
}

export function extractCrateDocComment(source: string): string {
  const lines: string[] = [];
  for (const raw of source.split(/\r?\n/)) {
    const trimmed = raw.trim();
    if (!trimmed) {
      if (lines.length > 0) break;
      continue;
    }
    if (trimmed.startsWith("//!")) {
      const cleaned = trimmed.replace(/^\/\/!\s?/, "").trim();
      if (cleaned) lines.push(cleaned);
    } else if (trimmed.startsWith("#!") || trimmed.startsWith("extern crate")) {
      continue;
    } else {
      break;
    }
  }
  return lines.slice(0, 3).join(" ").slice(0, 260);
}

export function parsePubModules(libSource: string): string[] {
  const mods: string[] = [];
  for (const match of libSource.matchAll(/^(?:pub\s+)mod\s+([a-zA-Z0-9_]+)\s*;/gm)) {
    mods.push(match[1]!);
  }
  return [...new Set(mods)].sort();
}

export function parseAllDeclaredModules(libSource: string): string[] {
  const mods: string[] = [];
  for (const match of libSource.matchAll(/^(?:pub(?:\([^)]+\))?\s+)?mod\s+([a-zA-Z0-9_]+)\s*;/gm)) {
    mods.push(match[1]!);
  }
  return [...new Set(mods)].sort();
}

export function extractPubItems(rustSource: string, limit = 16): string[] {
  const items: string[] = [];
  for (const raw of rustSource.split(/\r?\n/)) {
    const line = raw.trim();
    const match = line.match(
      /^(pub(?:\(crate\))?)\s+(struct|enum|trait|type|const|fn|async\s+fn)\s+([a-zA-Z0-9_]+)/,
    );
    if (match) {
      items.push(`${match[2]} ${match[3]}`);
      if (items.length >= limit) break;
    }
  }
  return [...new Set(items)];
}

export function parseUpstreamToml(raw: string): {
  zedCommit: string;
  importCommit: string;
  tracked: string[];
} {
  const zedCommit = raw.match(/^zed_commit\s*=\s*"([^"]+)"/m)?.[1] ?? "unknown";
  const importCommit = raw.match(/^import_commit\s*=\s*"([^"]+)"/m)?.[1] ?? "unknown";
  const trackedMatch = raw.match(/tracked\s*=\s*\[([\s\S]*?)\]/m);
  const tracked: string[] = [];
  if (trackedMatch) {
    for (const item of trackedMatch[1]!.matchAll(/"([^"]+)"/g)) {
      tracked.push(item[1]!);
    }
  }
  return { zedCommit, importCommit, tracked };
}

function measureFiles(dir: string, exts: Set<string>): { count: number; bytes: number; files: string[] } {
  if (!existsSync(dir)) return { count: 0, bytes: 0, files: [] };
  const files: string[] = [];
  let bytes = 0;
  const walk = (cur: string) => {
    for (const entry of readdirSync(cur, { withFileTypes: true })) {
      if (entry.name === "target" || entry.name === ".git" || entry.name === "node_modules") continue;
      const full = join(cur, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        const dot = entry.name.lastIndexOf(".");
        const ext = dot >= 0 ? entry.name.slice(dot).toLowerCase() : "";
        if (exts.has(ext)) {
          files.push(full);
          bytes += statSync(full).size;
        }
      }
    }
  };
  walk(dir);
  files.sort();
  return { count: files.length, bytes, files };
}

function readSafe(path: string): string {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function extractHeadingsAndSummary(md: string, maxSections = 14): string[] {
  const lines: string[] = [];
  for (const match of md.matchAll(/^#{1,3}\s+(.+)$/gm)) {
    const title = match[1]!.trim();
    if (!lines.includes(title)) lines.push(title);
    if (lines.length >= maxSections) break;
  }
  return lines;
}

function inspectCrateModules(crateSrcDir: string, onlyPublic: boolean): CrateModuleInfo[] {
  const libRs = existsSync(join(crateSrcDir, "lib.rs"))
    ? join(crateSrcDir, "lib.rs")
    : join(crateSrcDir, `${basename(resolve(crateSrcDir, ".."))}.rs`);
  const src = readSafe(libRs);
  if (!src) return [];
  const mods = onlyPublic ? parsePubModules(src) : parseAllDeclaredModules(src);
  const infos: CrateModuleInfo[] = [];
  for (const modName of mods) {
    const candidate = existsSync(join(crateSrcDir, `${modName}.rs`))
      ? join(crateSrcDir, `${modName}.rs`)
      : join(crateSrcDir, modName, "mod.rs");
    const modSrc = readSafe(candidate);
    const summary = modSrc ? extractCrateDocComment(modSrc) : "";
    const reexports = modSrc ? extractPubItems(modSrc, 10) : [];
    infos.push({ name: modName, summary, reexports });
  }
  return infos;
}

function inspectFastModules(fastRoot: string): {
  modules: FastModuleDigest[];
  testFiles: string[];
  upstream: { zedCommit: string; importCommit: string; tracked: string[] };
} {
  const fastSrcDir = join(fastRoot, "crates", "gpui", "src", "fast");
  const upstream = parseUpstreamToml(readSafe(join(fastRoot, "UPSTREAM")));
  const modules: FastModuleDigest[] = [];
  const testFiles: string[] = [];

  if (!existsSync(fastSrcDir)) {
    return { modules, testFiles, upstream };
  }

  const rsFiles = measureFiles(fastSrcDir, new Set([".rs"])).files;
  for (const full of rsFiles) {
    const rel = toSlash(relative(fastRoot, full));
    if (rel.includes("/fast/tests/")) {
      testFiles.push(rel);
      continue;
    }
    const content = readFileSync(full, "utf8");
    const name = rel.replace(/^crates\/gpui\/src\//, "").replace(/\.rs$/, "");
    modules.push({
      name,
      relPath: rel,
      summary: extractCrateDocComment(content) || "(internal hook module)",
      exports: extractPubItems(content, 12),
      bytes: statSync(full).size,
    });
  }
  return { modules, testFiles, upstream };
}

function buildGpuiCoreMd(aphrodyRoot: string): { content: string; refCount: number } {
  const gpuiSrc = join(aphrodyRoot, "crates", "gpui", "src");
  const gpuiLib = readSafe(join(gpuiSrc, "gpui.rs"));
  const coreMods = parseAllDeclaredModules(gpuiLib);
  const refDir = join(aphrodyRoot, ".agents", "plugins", "aphrody", "skills", "gpui-kit", "references", "gpui");
  const refFiles = measureFiles(refDir, new Set([".md"])).files;

  const refDigests = refFiles.map((file) => {
    const name = basename(file);
    const md = readSafe(file);
    const firstPara =
      md
        .split(/\r?\n/)
        .map((l) => l.trim())
        .find((l) => l && !l.startsWith("#") && !l.startsWith("```") && !l.startsWith("|")) ?? "";
    const headings = extractHeadingsAndSummary(md, 10);
    return `### \`${name}\`\n- Summary: ${firstPara}\n- Topics: ${headings.map((h) => `\`${h}\``).join(", ")}`;
  });

  const uiSrc = readSafe(join(aphrodyRoot, "crates", "gpui_ui", "src", "gpui_ui.rs"));
  const codeSrc = readSafe(join(aphrodyRoot, "crates", "gpui_code", "src", "gpui_code.rs"));

  const content = `# GPUI Core Engine Digest

> Distilled from Aphrody \`crates/gpui\`, \`crates/gpui_wgpu\`, \`crates/gpui_ui\`, \`crates/gpui_code\`, and \`skills/gpui-kit/references/gpui/\`.

## Frame Lifecycle & Ownership Model

1. **Three Render Phases (Single Foreground Thread)**:
   - \`request_layout(id, inspector_id, window, cx) -> (LayoutId, RequestLayoutState)\`: views call \`render(&mut self, window, cx) -> impl IntoElement\` and emit Taffy nodes.
   - \`prepaint(id, inspector_id, bounds, request_layout, window, cx) -> PrepaintState\`: Taffy resolves geometry; elements push \`Hitbox\`, dispatch nodes, listeners, and cursors.
   - \`paint(id, inspector_id, bounds, request_layout, prepaint, window, cx)\`: elements push quads, sprites, underlines, shadows, and vector \`Path\`s into \`Frame.scene\`.
2. **Context Types**:
   - \`App\`: root state store, globals (\`Global\`), entity registry, asset source.
   - \`Context<T>\`: derefs to \`App\`, bound to \`Entity<T>\`; exposes \`cx.notify()\`, \`cx.emit()\`, \`cx.subscribe()\`, \`cx.observe()\`, \`cx.listener()\`, \`cx.spawn(async move |weak, cx| ...)\`.
   - \`Window\`: focus (\`FocusHandle\`), actions (\`window.dispatch_action\`), drawing (\`paint_quad\`, \`paint_path\`, \`paint_layer(|w| ...)\`), overlays, animations (\`request_animation_frame\`).
   - \`AsyncApp\` / \`AsyncWindowContext\`: cross-await handles from \`cx.spawn\` / \`window.spawn\`.
3. **Entity Discipline**:
   - Store child state as \`Entity<S>\` owned by the parent view; hold only \`WeakEntity<T>\` inside closures/async tasks.
   - Never mutate entities inside \`render()\` or call \`cx.notify()\` during \`prepaint\`/\`paint\` unless state genuinely changed (mandatory for \`gpui-fast\` view retention).
   - Keep \`Task<R>\` alive via a field, \`.await\`, or \`.detach()\`/\`.detach_and_log_err(cx)\`.
4. **Vector Paths & Layering (\`crates/gpui\`)**:
   - \`pub struct Path<T = Pixels>\` (backward compatible with both Zed \`Path\` and \`gpui-kit\` \`Path<Pixels>\`), \`Path::translate(&self, Point<Pixels>) -> Self\`.
   - \`Window::paint_layer<R>(&mut self, f: impl FnOnce(&mut Self) -> R) -> R\`.

## \`crates/gpui\` Modules (${coreMods.length})

${coreMods.map((m) => `\`${m}\``).join(" · ")}

## SDK Facade Boundaries

- **\`gpui_ui\`** (\`--no-default-features\`): must NEVER pull in \`settings_content\`, \`cloud_llm_client\`, or \`language_model_core\`. Optional features: \`kit\` (\`gpui-kit\`), \`nsh\` (\`nsh-base\`/\`nsh-core\`), \`nsh-full\` (\`nsh-platform-gpui\`).
  - Prelude exports: ${extractPubItems(uiSrc, 10).join(", ") || "`application()`, `prelude`"}.
- **\`gpui_code\`** (\`--no-default-features\`): must NEVER pull in \`buffer_diff\`, \`language\`, \`rpc\`, or \`proto\`.
  - Exports: ${extractPubItems(codeSrc, 10).join(", ") || "`rope`, `text`, `sum_tree`, `fuzzy`"}.

## Reference Topic Map (${refFiles.length} Guides)

${refDigests.join("\n\n")}
`;

  return { content, refCount: refFiles.length };
}

function buildGpuiKitMd(aphrodyRoot: string): {
  content: string;
  componentModules: number;
  baseModules: number;
} {
  const baseSrcDir = join(aphrodyRoot, "crates", "gpui-base", "src");
  const compSrcDir = join(aphrodyRoot, "crates", "gpui-component", "src");
  const kitLib = readSafe(join(aphrodyRoot, "crates", "gpui-kit", "src", "lib.rs"));
  const baseMods = inspectCrateModules(baseSrcDir, false);
  const compMods = inspectCrateModules(compSrcDir, true);

  const conventionsMd = readSafe(
    join(aphrodyRoot, ".agents", "plugins", "aphrody", "skills", "gpui-kit", "references", "conventions.md"),
  );
  const codingGuidesMd = readSafe(
    join(aphrodyRoot, ".agents", "plugins", "aphrody", "skills", "gpui-kit", "references", "coding-guides.md"),
  );
  const codingSections = extractHeadingsAndSummary(codingGuidesMd, 24);
  const kitVersion =
    readSafe(join(aphrodyRoot, "crates", "gpui-kit", "Cargo.toml")).match(/^version\s*=\s*"([^"]+)"/m)?.[1] ??
    "0.10.0";

  const formatModList = (mods: CrateModuleInfo[]) =>
    mods
      .map((m) => {
        const items = m.reexports.slice(0, 6).join(", ");
        const desc = m.summary ? ` — ${m.summary}` : "";
        return `- **\`${m.name}\`**${desc}${items ? ` | Exports: \`${items}\`` : ""}`;
      })
      .join("\n");

  const content = `# GPUI Kit ${kitVersion} Digest

> One consumer crate (\`gpui_kit::*\`, \`gpui_kit::base\`, \`gpui_kit::component\`, \`gpui_kit::assets\`, \`gpui_kit::platform\`). Zero \`mod.rs\` in Aphrody tree; default \`gpui-fast\` blanket \`IntoElement\`.

## Architectural Rules

1. **Strict Behavior vs Presentation Seam**:
   - \`gpui-base\` (${baseMods.length} modules): owns layout, focus trap, state transitions, keyboard nav, AccessKit semantics, and motion primitives — zero hardcoded colors/spacing.
   - \`gpui-component\` (${compMods.length} public modules): styled component facade applying \`cx.theme()\` (\`ActiveTheme\`), icons (\`gpui-kit-assets\`), and typography.
   - Application layer composes \`gpui_kit::component::*\` without re-implementing interaction state.
2. **Component-Family Ownership Contract** (from \`conventions.md\`):
   - Command: \`Button::new("id").on_click(...)\` — application executes command.
   - Boolean request: \`Checkbox::new("id")\` / \`Switch::new("id")\` / \`Radio::new("id")\` — pass \`.checked(bool)\` and handle \`.on_change(cx.listener(|this, next, _, cx| { this.val = *next; cx.notify(); }))\`.
   - Option group: \`RadioGroup::new("id").selected_index(Option<usize>).on_change(...)\`.
   - Retained editors/controls: \`Input::new(&self.state)\`, \`Diff::new(&self.diff)\`, \`Select::new(&self.select)\`, \`Table::new(&self.table)\` — caller owns \`Entity<*State>\` and keeps subscriptions.
   - Forms: \`Form::new().label_layout(Axis::Horizontal|Vertical).columns(n).child(Field::new()...).footer(el)\`.
   - Extension traits must be imported explicitly: \`ButtonVariants\`, \`Sizable\`, \`Disableable\`, \`ActiveTheme\`, \`WindowExt\`.
3. **Stable Identity & No \`pub\` Fields Across Seam**:
   - Repeated controls derive \`ElementId\` from domain keys (never loop indices).
   - Overlays dismiss on \`Escape\` and return focus to trigger.
   - Integration tests use \`#[gpui_kit::test]\` and \`gpui_kit::test::{TestEventExt, TestWindowExt}\` (never sleep loops).

## Coding Guides Sections (${codingSections.length})

${codingSections.map((s) => `- ${s}`).join("\n")}

## \`gpui-component\` Public Modules (${compMods.length})

${formatModList(compMods)}

## \`gpui-base\` Foundation Modules (${baseMods.length})

${formatModList(baseMods)}

## Conventions Snapshot

${conventionsMd.split(/\r?\n/).slice(0, 26).join("\n")}

## Crate Root Summary (\`crates/gpui-kit/src/lib.rs\`)

- Doc summary: ${extractCrateDocComment(kitLib)}
`;

  return { content, componentModules: compMods.length, baseModules: baseMods.length };
}

function buildGpuiFastMd(fastRoot: string | null): {
  content: string;
  fastModules: number;
  fastTests: number;
} {
  if (!fastRoot) {
    return {
      content: `# GPUI Fast Digest\n\n_Checkout not present during build; run with \`--fast <path>\` or populate \`target/agent-forks/gpui-fast\` to refresh module digests._\n`,
      fastModules: 0,
      fastTests: 0,
    };
  }

  const { modules, testFiles, upstream } = inspectFastModules(fastRoot);
  const readme = readSafe(join(fastRoot, "README.md"));
  const compatReadme = readSafe(join(fastRoot, "compat", "README.md"));
  const benchmarkLines = readme
    .split(/\r?\n/)
    .filter((l) => l.startsWith("|"))
    .slice(0, 14)
    .join("\n");

  const coreModules = modules.filter((m) => !m.relPath.includes("/fast/layers/"));
  const layerModules = modules.filter((m) => m.relPath.includes("/fast/layers/"));

  const formatFast = (list: FastModuleDigest[]) =>
    list
      .map(
        (m) =>
          `- **\`${m.name}\`** (\`${m.relPath}\`, ${Math.round(m.bytes / 1024)} KB) — ${m.summary}${m.exports.length ? ` | Key items: \`${m.exports.slice(0, 7).join("`, `")}\`` : ""}`,
      )
      .join("\n");

  const content = `# GPUI Fast Architecture & Module Reference

> Source: \`longbridge/gpui-fast\` (Upstream Zed base \`${upstream.zedCommit.slice(0, 10)}\`, import \`${upstream.importCommit.slice(0, 10)}\`, ${upstream.tracked.length} tracked crates).
> Core principle: **the frame drawn from scratch is the specification**. All public APIs remain upstream GPUI's; performance logic lives isolated in \`crates/gpui/src/fast/\`.

## Measured Benchmark Gains (\`gpui_perf\`, Linux Release 144 FPS)

${benchmarkLines}

## Three Optimization Pillars

### 1. Retained Subtrees & Splicing (\`fast/retained.rs\`, \`fast/dependencies.rs\`, \`fast/splice.rs\`)
- Every \`Entity<V: Render>\` / \`AnyView\` is tracked per \`GlobalElementId\` (full path equality, cached hash).
- Records two read sets per view: \`dependencies\` (entire subtree) vs \`own_dependencies\` (self outside nested retained views), tracking:
  - Entity notifications & updates outside/during drawing
  - Globals read (\`cx.global\`, \`cx.has_global\`) via generation stamps
  - Versioned state (\`ScrollHandle\`, \`ListState\`)
  - Ambient window input (\`Window::mouse_position\`, \`Window::modifiers\`, \`Window::capslock\`)
  - Painted \`Hitbox\` hover state
- **Five Execution Paths** per view:
  1. **Reused**: unchanged dependencies & bounds/mask/style/opacity/hover -> copy last frame hitbox/dispatch/listener/primitive ranges + nested subtree records.
  2. **Spliced**: own dependencies unchanged, nested child dirty -> copy prefix/suffix stretches and rebuild only dirty child inline.
  3. **Built at retained layout**: dependencies unchanged but bounds/inherited text style/opacity moved -> re-render at kept Taffy nodes.
  4. **Prebuilt**: splice fell back after child asked for new layout -> reuse already-built child without double render.
  5. **Built**: full downstream rebuild while recording new dependencies.

### 2. Persistent Taffy Nodes & Text Carry/Replay (\`fast/layout.rs\`, \`fast/layout_key.rs\`, \`fast/text.rs\`)
- Taffy nodes survive across frames keyed by 64-bit path/index hash; style/children/measure are rewritten ONLY when fingerprint differs (debug builds assert full structural equality on fingerprint match).
- **Text Carry**: identical text + runs + text style transfers last frame's measurement unchanged (color-only changes patch decorations in place).
- **Text Replay**: changed text re-measures against the node's recorded Taffy constraint log; if resulting sizes match, ancestor Taffy caches remain valid.
- **Additional Frame Caches**: Uniform bounds grid (\`fast/bounds_tree.rs\` replaying unchanged primitive orders), shape-relative path tessellation cache (2048 shapes / 16 MiB LRU in \`fast/path_cache.rs\`), per-run glyph shaping (\`fast/glyphs.rs\`), replayable AccessKit event log (\`fast/a11y.rs\`).

### 3. GPU Tile Scroll Layers & Native Composition (\`fast/layers/\`, \`fast/composition.rs\`, \`fast/dynamic_textures.rs\`)
- Active on WGPU (Linux), Metal (macOS), and Direct3D 11 (Windows). Scroll container rasterizes content into cached tiles (\`Composite\` / \`Repaint\` with 2-viewport overscan, 64 MB LRU tile budget) after scrolling 2 consecutive frames.
- \`hover_freeze\`: suppresses hover invalidation for 100 ms during active wheel scrolling under a stationary pointer.
- Automatic \`Bypass\` when pixel parity cannot be guaranteed: non-opaque background (gradient/radius/blur), rasterized paths covered by content, focused text input, anchored/deferred overlays, active animations (\`RETRY_AFTER_INELIGIBLE_FRAMES\`), or frequent content churn (>= 8 of last 16 frames).
- \`dynamic_textures\` + \`WgpuDynamicTexture\`: zero-copy shared-queue frame updates (video/remote desktop/maps) without blowing up the glyph/sprite atlas.
- \`composition\` (Zed PR #62379 model): embeds native OS webviews/surfaces (\`WKWebView\`, \`WebView2\`, Wayland subsurfaces, X11 overlays) between GPUI content and translucent GPUI menus/popovers/dialogs.

## Mandatory Application & Debug Rules

- Keep \`render()\`, \`prepaint()\`, and \`paint()\` pure of gratuitous state writes: notifying an entity or calling \`cx.update_global\` / \`cx.global_mut\` every frame breaks retention for every reader.
- Mutate entity state only through \`entity.update(cx, ...)\` (never hidden \`Rc<RefCell>\` without \`cx.notify()\`).
- Scroll via \`ScrollHandle\` or \`ListState\` rather than ad-hoc offset fields inside views.
- Runtime verification switches (under \`test-support\`):
  - \`GPUI_VIEW_RETENTION=0\` — disables view retention (renders every frame from scratch).
  - \`GPUI_SCROLL_LAYERS=0\` — disables scroll tile layers.
  - \`GPUI_A11Y_ACTIVE=1\` — forces AccessKit tree generation for benchmarks/oracles.
- Oracle suites (\`oracle.rs\`, \`layers_oracle.rs\`, \`gpui_perf --release -- --headless --verify\`) prove byte-identical frame output between retained and from-scratch draws.

## Fast Core Modules (${coreModules.length})

${formatFast(coreModules)}

## Fast Scroll Layer Modules (${layerModules.length})

${formatFast(layerModules)}

## Oracle & Test Suite (${testFiles.length} Files)

${testFiles.map((t) => `\`${t}\``).join(" · ")}

## Upstream Hook Constraints (\`docs/upstream-sync.md\`)

- New performance code goes strictly in \`src/fast/\`; upstream files hold only minimal hooks referencing \`fast\` or \`fast_\`.
- \`script/check-upstream\` budgets: <= 8 added lines per hunk, <= 40 added / <= 20 removed lines per upstream file (unless allowlisted), zero glob imports (\`fast::*\` or \`super::*\` inside \`fast/\`).
- Compat shim (\`compat/README.md\`): aliases \`gpui-pre*\` snapshots onto \`gpui-fast\` using \`extern crate gpui_kit as gpui;\`.
`;

  return { content, fastModules: modules.length, fastTests: testFiles.length };
}

function buildUnificationMatrixMd(aphrodyRoot: string): string {
  const lockRaw = readSafe(join(aphrodyRoot, "assets", "os", "upstream_sync_lock.toml"));
  return `# Aphrody GPUI Unification & Interop Matrix

> Single unified stack in \`aphrody\`: **Zed \`crates/gpui\`** + **\`gpui_wgpu\`** + **\`gpui-kit 0.10.0\`** + **\`nsh 0.6.0\`** + **\`gpui-fast\`** patterns.

## 1. API Bridge Decisions (Single Source of Truth)

| Seam | Zed GPUI | GPUI Kit 0.10.0 / NSH 0.6.0 | Aphrody Resolution |
| :--- | :--- | :--- | :--- |
| Vector Path type | Non-generic \`gpui::Path\` | Generic \`gpui::Path<Pixels>\` | \`pub struct Path<T = Pixels>\` in [\`crates/gpui/src/path_builder.rs\`](crates/gpui/src/path_builder.rs) + \`Path::translate(&self, Point<Pixels>)\` |
| Blanket \`IntoElement\` | \`impl<T: Element> IntoElement for T\` | \`#[cfg(not(feature = "gpui-fast"))] impl IntoElement\` | Enable \`default = ["gpui-fast"]\` across \`gpui-base\`, \`gpui-component\`, \`gpui-kit\` |
| Window Layer API | \`window.paint_layer(\|window\| ...)\` (1 arg) | Older 2-arg \`window.paint_layer(bounds, \|cx\| ...)\` | Update call sites (\`scrollbar.rs\`, \`shimmer.rs\`) to 1-arg closure |
| LSP types version | Zed \`lsp-types\` (\`0.95.1\`, no inline completion) | \`lsp-types 0.97.0\` (\`features = ["proposed"]\`) | Workspace \`lsp_types_kit = { package = "lsp-types", version = "0.97", features = ["proposed"] }\` + \`extern crate lsp_types_kit as lsp_types;\` |
| Text Rope / Markdown | Zed \`rope\` | \`ropey 2.0.0-beta.1\` + \`markdown 1.0\` (\`serde\`) | Workspace \`ropey_kit\` + \`markdown-rs\` aliases in \`gpui-base\` / \`gpui-component\` / \`nsh-base\` |
| Taffy \`0.15\` (\`vendor/taffy\`) | \`CacheTree::cache_get(&self, ...)\` | Older \`&mut self\` + raw \`Rect<f32>\` overflow | Update \`nsh-core\` to \`&self\`, \`ScrollableOverflow::new(rect, Point { x: false, y: false })\`, method accessors \`.left()\`/\`.right()\` |
| Linux Portal \`ashpd\` | Workspace \`ashpd 0.13.5\` (generic settings) | Typed \`ReducedMotion\` enum | Query \`"org.freedesktop.appearance"\`, \`"reduced-motion"\` as \`u32 == 1\` via \`Settings\` |
| WGPU v30 Readback | \`get_mapped_range() -> Result<BufferView, MapRangeError>\` | Unwrapped slice in older \`wgpu\` | Pattern match \`if let Ok(data) = buffer.slice(..).get_mapped_range()\` in \`nsh-engine/src/shader.rs\` |
| Zero-\`mod.rs\` Rule | Flat module hierarchy | Nested \`#[path]\` pointing into \`mod.rs\` | Never use \`#[path = "..."]\` on parent modules that have nested child submodules without explicit \`#[path]\`; attach \`pub(crate) mod\` directly from directory parent (e.g. \`editor.rs\`) |
| Doc Comments vs \`extern crate\` | Crate-level \`//!\` must lead | \`extern crate\` before \`//!\` fails E0753 | Always place \`//!\` crate docs BEFORE any \`extern crate\` item |

## 2. Upstream Sync Automation

- Tooling: [\`tooling/bun/upstream-sync.ts\`](tooling/bun/upstream-sync.ts) + [\`.github/workflows/aphrody-upstream-sync.yml\`](.github/workflows/aphrody-upstream-sync.yml)
- Tracked lockfile (\`assets/os/upstream_sync_lock.toml\`):
\`\`\`toml
${lockRaw.trim().slice(0, 1400)}
\`\`\`
`;
}

function buildIndexMd(
  fastRoot: string | null,
  sourceBytes: number,
  counts: GpuiImportSummary["counts"],
): string {
  let fastHead = fastRoot ? "local-checkout" : "not-cloned";
  if (fastRoot && existsSync(join(fastRoot, ".git"))) {
    const res = Bun.spawnSync(["git", "-C", fastRoot, "rev-parse", "--short=9", "HEAD"], {
      stdout: "pipe",
      stderr: "ignore",
      stdin: "ignore",
    });
    if (res.exitCode === 0) fastHead = res.stdout.toString().trim() || fastHead;
  }

  return `# GPUI / GPUI Kit / GPUI Fast Brain Index

- Sources: Aphrody \`crates/gpui*\` + \`gpui-kit 0.10.0\` (${counts.baseModules} base + ${counts.kitComponentModules} component modules, ${counts.gpuiRefDocs} GPUI reference guides) + \`longbridge/gpui-fast\` (\`${fastHead}\`, ${counts.fastModules} \`fast/\` modules, ${counts.fastTests} test/oracle files).
- Total raw source corpus scanned: ${(sourceBytes / (1024 * 1024)).toFixed(2)} MiB.

## Brain Files

| File | Scope |
| :--- | :--- |
| \`INDEX.md\` | Master map, source stats, command router |
| \`GPUI_CORE.md\` | Core lifecycle, Context/Entity/Window/Element/Path APIs, SDK modularity boundaries, reference topics |
| \`GPUI_KIT.md\` | GPUI Kit 0.10.0 architecture seam, Coding Guides, component-family conventions, base + component module catalog |
| \`GPUI_FAST.md\` | Retained subtrees, splicing, dependency stamps, layout keys, text carry/replay, scroll tile layers, composition, oracle tests |
| \`UNIFICATION_MATRIX.md\` | Exact bridge fixes uniting Zed GPUI, GPUI Kit, NSH, Taffy, WGPU v30, and zero-\`mod.rs\` hygiene |

## Verification & Search Commands

| Task | Command |
| :--- | :--- |
| Refresh brain digests + FTS5 index | \`bun ~/.gemini/scripts/import-gpui-brain.ts && bun ~/.gemini/scripts/sync.ts\` |
| Query offline memory DB | \`bun ~/.gemini/scripts/learn.ts search "<terms>"\` |
| Check Aphrody GPUI/Kit/NSH workspace (on \`fr1\`) | \`cargo check -p gpui -p gpui-base -p gpui-component -p gpui-kit -p nsh-core -p nsh-base -p gpui_ui --features kit,nsh-full\` |
| Check modularity boundaries | \`cargo check -p gpui_ui --no-default-features && cargo check -p gpui_code --no-default-features\` |
| Disable GPUI Fast retention/layers at runtime | \`GPUI_VIEW_RETENTION=0 GPUI_SCROLL_LAYERS=0\` |
`;
}

export async function importGpuiBrain(opts: GpuiImportOptions = {}): Promise<GpuiImportSummary> {
  const outDir = resolve(opts.outDir ?? BRAIN_GPUI_DIR);
  const aphrodyRoot = opts.aphrodyRoot ? toSlash(resolve(opts.aphrodyRoot)) : discoverAphrodyRoot();
  if (
    !aphrodyRoot ||
    !existsSync(join(aphrodyRoot, "crates", "gpui")) ||
    !existsSync(join(aphrodyRoot, "crates", "gpui-kit"))
  ) {
    return {
      skipped: true,
      reason: "Aphrody GPUI/Kit source workspace not found; keeping existing brain/gpui/ output intact.",
      outDir,
      sourceBytes: 0,
      outputBytes: 0,
      compressionRatio: 1,
      filesWritten: [],
      counts: {
        gpuiRefDocs: 0,
        kitComponentModules: 0,
        baseModules: 0,
        fastModules: 0,
        fastTests: 0,
      },
    };
  }

  const fastRoot = discoverGpuiFastRoot(opts.fastRoot, aphrodyRoot);
  const gpuiStats = measureFiles(join(aphrodyRoot, "crates", "gpui", "src"), new Set([".rs"]));
  const baseStats = measureFiles(join(aphrodyRoot, "crates", "gpui-base", "src"), new Set([".rs"]));
  const compStats = measureFiles(join(aphrodyRoot, "crates", "gpui-component", "src"), new Set([".rs"]));
  const refStats = measureFiles(
    join(aphrodyRoot, ".agents", "plugins", "aphrody", "skills", "gpui-kit", "references"),
    new Set([".md"]),
  );
  const fastStats = fastRoot
    ? measureFiles(join(fastRoot, "crates", "gpui", "src", "fast"), new Set([".rs"]))
    : { count: 0, bytes: 0, files: [] };

  const sourceBytes =
    gpuiStats.bytes + baseStats.bytes + compStats.bytes + refStats.bytes + fastStats.bytes;

  const coreRes = buildGpuiCoreMd(aphrodyRoot);
  const kitRes = buildGpuiKitMd(aphrodyRoot);
  const fastRes = buildGpuiFastMd(fastRoot);
  const matrixMd = buildUnificationMatrixMd(aphrodyRoot);

  const counts: GpuiImportSummary["counts"] = {
    gpuiRefDocs: coreRes.refCount,
    kitComponentModules: kitRes.componentModules,
    baseModules: kitRes.baseModules,
    fastModules: fastRes.fastModules,
    fastTests: fastRes.fastTests,
  };

  const outputs: Record<string, string> = {
    "INDEX.md": buildIndexMd(fastRoot, sourceBytes, counts),
    "GPUI_CORE.md": coreRes.content,
    "GPUI_KIT.md": kitRes.content,
    "GPUI_FAST.md": fastRes.content,
    "UNIFICATION_MATRIX.md": matrixMd,
  };

  let outputBytes = 0;
  const filesWritten: string[] = [];
  const shouldWrite = opts.write ?? true;
  if (shouldWrite) mkdirSync(outDir, { recursive: true });
  for (const [name, content] of Object.entries(outputs)) {
    outputBytes += Buffer.byteLength(content, "utf8");
    if (shouldWrite && writeIfChanged(join(outDir, name), content)) {
      filesWritten.push(name);
    }
  }

  return {
    skipped: false,
    aphrodyRoot,
    fastRoot: fastRoot ?? undefined,
    outDir: toSlash(outDir),
    sourceBytes,
    outputBytes,
    compressionRatio: sourceBytes > 0 ? outputBytes / sourceBytes : 0,
    filesWritten,
    counts,
  };
}

if (import.meta.main) {
  let aphrodyRoot: string | undefined;
  let fastRoot: string | undefined;
  let outDir: string | undefined;
  for (let i = 2; i < Bun.argv.length; i++) {
    if (Bun.argv[i] === "--src" && Bun.argv[i + 1]) aphrodyRoot = Bun.argv[++i];
    else if (Bun.argv[i] === "--fast" && Bun.argv[i + 1]) fastRoot = Bun.argv[++i];
    else if (Bun.argv[i] === "--out" && Bun.argv[i + 1]) outDir = Bun.argv[++i];
  }
  const summary = await importGpuiBrain({ aphrodyRoot, fastRoot, outDir });
  console.log(JSON.stringify(summary, null, 2));
}
