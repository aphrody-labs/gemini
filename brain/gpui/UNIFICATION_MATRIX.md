# Aphrody GPUI Unification & Interop Matrix

> Single unified stack in `aphrody`: **Zed `crates/gpui`** + **`gpui_wgpu`** + **`gpui-kit 0.10.0`** + **`nsh 0.6.0`** + **`gpui-fast`** patterns.

## 1. API Bridge Decisions (Single Source of Truth)

| Seam | Zed GPUI | GPUI Kit 0.10.0 / NSH 0.6.0 | Aphrody Resolution |
| :--- | :--- | :--- | :--- |
| Vector Path type | Non-generic `gpui::Path` | Generic `gpui::Path<Pixels>` | `pub struct Path<T = Pixels>` in [`crates/gpui/src/path_builder.rs`](crates/gpui/src/path_builder.rs) + `Path::translate(&self, Point<Pixels>)` |
| Blanket `IntoElement` | `impl<T: Element> IntoElement for T` | `#[cfg(not(feature = "gpui-fast"))] impl IntoElement` | Enable `default = ["gpui-fast"]` across `gpui-base`, `gpui-component`, `gpui-kit` |
| Window Layer API | `window.paint_layer(|window| ...)` (1 arg) | Older 2-arg `window.paint_layer(bounds, |cx| ...)` | Update call sites (`scrollbar.rs`, `shimmer.rs`) to 1-arg closure |
| LSP types version | Zed `lsp-types` (`0.95.1`, no inline completion) | `lsp-types 0.97.0` (`features = ["proposed"]`) | Workspace `lsp_types_kit = { package = "lsp-types", version = "0.97", features = ["proposed"] }` + `extern crate lsp_types_kit as lsp_types;` |
| Text Rope / Markdown | Zed `rope` | `ropey 2.0.0-beta.1` + `markdown 1.0` (`serde`) | Workspace `ropey_kit` + `markdown-rs` aliases in `gpui-base` / `gpui-component` / `nsh-base` |
| Taffy `0.15` (`vendor/taffy`) | `CacheTree::cache_get(&self, ...)` | Older `&mut self` + raw `Rect<f32>` overflow | Update `nsh-core` to `&self`, `ScrollableOverflow::new(rect, Point { x: false, y: false })`, method accessors `.left()`/`.right()` |
| Linux Portal `ashpd` | Workspace `ashpd 0.13.5` (generic settings) | Typed `ReducedMotion` enum | Query `"org.freedesktop.appearance"`, `"reduced-motion"` as `u32 == 1` via `Settings` |
| WGPU v30 Readback | `get_mapped_range() -> Result<BufferView, MapRangeError>` | Unwrapped slice in older `wgpu` | Pattern match `if let Ok(data) = buffer.slice(..).get_mapped_range()` in `nsh-engine/src/shader.rs` |
| Zero-`mod.rs` Rule | Flat module hierarchy | Nested `#[path]` pointing into `mod.rs` | Never use `#[path = "..."]` on parent modules that have nested child submodules without explicit `#[path]`; attach `pub(crate) mod` directly from directory parent (e.g. `editor.rs`) |
| Doc Comments vs `extern crate` | Crate-level `//!` must lead | `extern crate` before `//!` fails E0753 | Always place `//!` crate docs BEFORE any `extern crate` item |

## 2. Upstream Sync Automation

- Tooling: [`tooling/bun/upstream-sync.ts`](tooling/bun/upstream-sync.ts) + [`.github/workflows/aphrody-upstream-sync.yml`](.github/workflows/aphrody-upstream-sync.yml)
- Tracked lockfile (`assets/os/upstream_sync_lock.toml`):
```toml
# Consolidated Upstream Sync Lockfile (Zed + NSH + GPUI-Kit + Bun + WGPU + agent-browser + agent-desktop).
# Updated automatically by tooling/bun/upstream-sync.ts
synced_at = "2026-11-18T13:42:13.047Z"
zed_sha = "1043f4a86ab911a381d9bfe45cf6b36d3cdcc89a"
nsh_sha = "bc05657b7f742cbfdf6f1e1c977de9a75f37d9dd"
gpui_kit_sha = "67c329149eeeee52d79587e76ae80e9400df9fea"
agent_browser_sha = "9f62847e89712164a6d5ea823e8c700d5fd911cd"
agent_desktop_sha = "e8934a5e95e1d212c74ead95cd3e4701c04eca31"
sha256_stamp = "7ae68bff5fef7ead9d206cbda4b3a5811394ecd387649cf44093ad9888916b2d"
```
