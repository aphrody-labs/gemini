# GPUI / GPUI Kit / GPUI Fast Knowledge Digest

Authoritative compacted references live in `~/.gemini/brain/gpui/` (`INDEX.md`, `GPUI_CORE.md`, `GPUI_KIT.md`, `GPUI_FAST.md`, `UNIFICATION_MATRIX.md`) and are FTS5-indexed in `~/.gemini/learning/memory.db`.

## Core Invariants

1. **GPUI Lifecycle & Ownership (`crates/gpui`)**:
   - Single-thread foreground pipeline: `request_layout` (`Render`) -> `prepaint` (`Hitbox` + dispatch) -> `paint` (`Scene`).
   - Hold `Entity<S>` in owning views and only `WeakEntity<T>` inside closures/async tasks (`cx.spawn`, `cx.listener`, `cx.observe`); keep returned `Task<R>` alive or `.detach()`.
   - Never mutate entities inside `render()`, and never notify entities or write globals (`cx.update_global`/`cx.global_mut`) during `prepaint`/`paint` unless state genuinely changed.

2. **GPUI Kit `0.10.0` Behavior/Skin Seam (`gpui-base` vs `gpui-component`)**:
   - `gpui-kit` re-exports `gpui::*`, `gpui_kit::{base, component, assets, platform}`, `init(cx)`, `open_window`, and `TestSupportExt`.
   - `gpui-base` owns behavior/focus/navigation/a11y/motion with zero hardcoded styling; `gpui-component` applies `cx.theme()` tokens; applications compose components without duplicating interaction state.
   - Controlled booleans (`Switch`, `Checkbox`, `Radio`) emit requested value via `.on_change(cx.listener(...))`; commands use `Button::on_click`; repeated items need domain-derived `ElementId`s.

3. **GPUI Fast (`0.1.17`) Retained Frame & Scroll Layer Rules**:
   - `gpui-fast` retains frames over GPUI's normal element tree without changing upstream public APIs: `ViewElement` picks `Reused`, `Spliced`, `Built at retained layout`, `Prebuilt`, or `Built` from tracked `dependencies` vs `own_dependencies` (entities, globals, `ScrollHandle`/`ListState`, ambient mouse/modifier state, hover hitboxes).
   - Persistent Taffy nodes use 64-bit style fingerprints + `Carry`/`Replay` text measurement logs.
   - Scroll layers (`Composite` / `Repaint` with 2-viewport overscan, 64 MB LRU tiles, 100 ms `hover_freeze`) require opaque backgrounds and `ScrollHandle`/`ListState`; non-opaque fills, paths, focused inputs, anchored popovers, or animations fall back automatically (`Bypass`).
   - Debug toggles under `test-support`: `GPUI_VIEW_RETENTION=0`, `GPUI_SCROLL_LAYERS=0`, `GPUI_A11Y_ACTIVE=1`.

4. **Aphrody Unification Seam**:
   - `gpui::Path<T = Pixels>` + `Path::translate(&self, Point<Pixels>)` serves both Zed and Kit call sites.
   - `default = ["gpui-fast"]` aligns Kit custom elements with Zed's blanket `impl<T: Element> IntoElement for T`.
   - `Window::paint_layer(|window| ...)` takes a single closure argument.
   - `lsp_types_kit = { package = "lsp-types", version = "0.97", features = ["proposed"] }` isolates Kit inline-completion types from Zed's `lsp-types 0.95.1`.
   - Zero `mod.rs` crates: avoid `#[path = "..."]` on parent modules with nested child dirs without explicit child `#[path]`; declare submodules directly from directory parents (and put `//!` crate docs before any `extern crate`).

## Commands

- Refresh brain & FTS5 index: `bun ~/.gemini/scripts/import-gpui-brain.ts && bun ~/.gemini/scripts/sync.ts`
- Search offline memory: `bun ~/.gemini/scripts/learn.ts search "<terms>"`
