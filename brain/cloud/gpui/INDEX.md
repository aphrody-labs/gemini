# GPUI / GPUI Kit / GPUI Fast Brain Index

- Sources: Aphrody `crates/gpui*` + `gpui-kit 0.10.0` (79 base + 70 component modules, 22 GPUI reference guides) + `longbridge/gpui-fast` (`2002081b4`, 55 `fast/` modules, 35 test/oracle files).
- Total raw source corpus scanned: 14.36 MiB.

## Brain Files

| File | Scope |
| :--- | :--- |
| `INDEX.md` | Master map, source stats, command router |
| `GPUI_CORE.md` | Core lifecycle, Context/Entity/Window/Element/Path APIs, SDK modularity boundaries, reference topics |
| `GPUI_KIT.md` | GPUI Kit 0.10.0 architecture seam, Coding Guides, component-family conventions, base + component module catalog |
| `GPUI_FAST.md` | Retained subtrees, splicing, dependency stamps, layout keys, text carry/replay, scroll tile layers, composition, oracle tests |
| `UNIFICATION_MATRIX.md` | Exact bridge fixes uniting Zed GPUI, GPUI Kit, NSH, Taffy, WGPU v30, and zero-`mod.rs` hygiene |

## Verification & Search Commands

| Task | Command |
| :--- | :--- |
| Refresh brain digests + FTS5 index | `bun ~/.gemini/scripts/import-gpui-brain.ts && bun ~/.gemini/scripts/sync.ts` |
| Query offline memory DB | `bun ~/.gemini/scripts/learn.ts search "<terms>"` |
| Check Aphrody GPUI/Kit/NSH workspace (on `fr1`) | `cargo check -p gpui -p gpui-base -p gpui-component -p gpui-kit -p nsh-core -p nsh-base -p gpui_ui --features kit,nsh-full` |
| Check modularity boundaries | `cargo check -p gpui_ui --no-default-features && cargo check -p gpui_code --no-default-features` |
| Disable GPUI Fast retention/layers at runtime | `GPUI_VIEW_RETENTION=0 GPUI_SCROLL_LAYERS=0` |
