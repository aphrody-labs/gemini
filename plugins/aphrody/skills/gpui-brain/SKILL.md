---
name: gpui-brain
description: Master router and offline knowledge index for GPUI Core (crates/gpui), GPUI Kit 0.10 (gpui-base / gpui-component / gpui-kit), GPUI Fast 0.1.17 (retained views, splicing, layout keys, text replay, GPU tile scroll layers, native window composition), and Aphrody's unification matrix. Use before building, porting, debugging, or optimizing GPUI/GPUI-Kit/NSH views.
---

# GPUI / GPUI Kit / GPUI Fast Master Brain

Query compacted, source-verified knowledge digests stored in `~/.gemini/brain/gpui/` and indexed in `~/.gemini/learning/memory.db`:

| File | Contents |
| :--- | :--- |
| `~/.gemini/brain/gpui/INDEX.md` | Crate map, corpus metrics, verification/search commands |
| `~/.gemini/brain/gpui/GPUI_CORE.md` | Frame lifecycle, Context/Entity/Window/Element/Path APIs, SDK modularity boundaries |
| `~/.gemini/brain/gpui/GPUI_KIT.md` | GPUI Kit 0.10.0 behavior/skin seam, Coding Guides, component-family conventions, module catalog |
| `~/.gemini/brain/gpui/GPUI_FAST.md` | Retained subtrees, splicing, dependency stamps, layout keys, text carry/replay, scroll layers, oracle tests |
| `~/.gemini/brain/gpui/UNIFICATION_MATRIX.md` | Zed GPUI <-> GPUI Kit <-> NSH <-> Taffy <-> WGPU v30 <-> zero-`mod.rs` resolution rules |

## Commands

```sh
# Search indexed GPUI / Kit / Fast knowledge offline
bun ~/.gemini/scripts/learn.ts search "retained subtree scroll layers"

# Refresh digests from local checkouts and rebuild FTS5 + GEMINI.md
bun ~/.gemini/scripts/import-gpui-brain.ts && bun ~/.gemini/scripts/sync.ts
```
