---
name: ui-ux-pro-max
description: Unified UI/UX Pro Max design-system reasoning, accessibility (WCAG 4.5:1), layout hierarchy, and modern-web-guidance coherence for web, GPUI, and NSH apps.
---

# UI/UX Pro Max

Unified design-system checklist combining `nextlevelbuilder/ui-ux-pro-max-skill`, `GoogleChrome/modern-web-guidance-src` (`mwg_audit` / `web_guidance`), and Material 3 Expressive (`google-design`).

## Core Rules

1. **Design Tokens First**: Define palette, surface hierarchy, spacing scale, and typography pairing before writing components.
2. **Contrast & Accessibility (A11y)**: Enforce >= 4.5:1 text contrast, visible focus rings, keyboard navigation, and semantic landmarks.
3. **Layout & Density**: Use clear visual hierarchy, consistent 4px/8px spacing rhythm, and avoid generic card-soup or unaligned grids.
4. **Modern Web Coherence**: Prefer native CSS (Grid, Subgrid, Container Queries, `:has()`, OKLCH) and Baseline-supported APIs; verify with `mwg_audit` / `web_guidance` when available.
