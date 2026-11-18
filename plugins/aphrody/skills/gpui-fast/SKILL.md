---
name: gpui-fast
description: Master engineering reference for GPUI Fast (longbridge/gpui-fast) retained-mode frame reuse, view splicing, dependency tracking, persistent Taffy layout keys, text measurement Carry/Replay, GPU tile scroll layers, dynamic GPU textures, and native window composition in GPUI / GPUI Kit / Aphrody.
---

# GPUI Fast: Retained Frames & Scroll Layers

GPUI Fast speeds up immediate-mode GPUI frames (-73% to -94% main-thread CPU in `gpui_perf`) while preserving exact pixel-for-pixel equivalence to drawing from scratch.

## Architecture Mechanics

1. **Retained Subtrees (`fast/retained.rs`, `fast/dependencies.rs`, `fast/splice.rs`)**:
   - Tracks every `Entity<V: Render>` / `AnyView` by `GlobalElementId` (cached hash + full path equality).
   - Separates `dependencies` (full subtree) from `own_dependencies` (view outside nested views): Entities read/updated/notified, globals (`cx.global`, `cx.has_global`), versioned `ScrollHandle` / `ListState`, ambient `mouse_position` / `modifiers` / `capslock`, and hitbox hover states.
   - Picks 1 of 5 paths per frame: **Reused**, **Spliced** (copies prefix/suffix ranges around dirty nested view), **Built at retained layout**, **Prebuilt**, or **Built**.
2. **Retained Taffy Layout & Text Replay (`fast/layout.rs`, `fast/layout_key.rs`, `fast/text.rs`)**:
   - Reuses Taffy nodes across frames by 64-bit layout key; mutates Taffy only when style/children fingerprints differ.
   - Text leaves **Carry** measurements when text/runs/style match and **Replay** the recorded Taffy constraint log when text changes so unchanged widths never dirty parent containers.
   - Keeps uniform bounds grid (`bounds_tree.rs`), shape-relative path tessellation LRU (`2048` shapes / `16 MiB` in `path_cache.rs`), glyph runs (`glyphs.rs`), and replayable AccessKit logs (`a11y.rs`).
3. **Scroll Layers & Composition (`fast/layers/`, `fast/dynamic_textures.rs`, `fast/composition.rs`)**:
   - Rasterizes opaque scrolling `div` containers and virtual lists into GPU tile textures (`64 MiB` cache, `2` viewports overscan, `100 ms` `hover_freeze`).
   - Bypasses automatically for non-opaque backgrounds (gradients/rounded clips), paths, focused text inputs, deferred popovers, active animations, or frequent churn (`>= 8/16` frames).
   - Exposes `WgpuDynamicTexture` (shared-queue zero-copy frame uploads) and `WindowComposition` native surface layering.

## Rules Every View Must Obey

- **Never** mutate unrelated entities or write globals / call `cx.notify()` during `render()`, `prepaint()`, or `paint()` unless the underlying value genuinely changed.
- **Always** mutate view state via `entity.update(cx, ...)` (not unnotified `Rc<RefCell>`), use domain-derived `ElementId`s, and scroll via `ScrollHandle` / `ListState`.
- **Debug / Oracle flags** (`test-support`): `GPUI_VIEW_RETENTION=0`, `GPUI_SCROLL_LAYERS=0`, `GPUI_A11Y_ACTIVE=1`; in UI unit tests call `window.refresh()` before `window.draw(cx)` when testing side-channel render effects.
- **Full digested reference**: read `~/.gemini/brain/gpui/GPUI_FAST.md` or run `bun ~/.gemini/scripts/learn.ts search "<topic>"`.
