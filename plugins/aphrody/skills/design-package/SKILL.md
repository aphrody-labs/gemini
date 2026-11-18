---
name: design-package
description: Rebuild or refresh the Aphrody design package (Drive Doc, Feature-matrix Sheet, Slides deck, Figma file, roadmap calendar, hosting inventory, CI state) from this repository's docs and brand, using every connected MCP server. Use when docs/spec.md, docs/adr, docs/features.toml or brand/ change, or when asked to sync, refresh or publish the spec, roadmap, mockups or slides.
---

# Design package

The repository is the source of truth; Drive, Figma and Calendar are mirrors. This skill makes them match.

## Sources
`docs/spec.md`, `docs/architecture.md`, `docs/adr/*.md`, `docs/features.toml` (scope and proofs), `ay.toml`
(names, hosts, product references), `brand/` (palette, tokens, logo, character).

## Mirrors and the tools that own them
| Mirror | MCP server | Tools |
|---|---|---|
| Doc "ay — Spec, architecture and decisions" | Google Drive, Google Docs | create_file (text/markdown), update_doc, read_file_content |
| Sheet "ay — Feature matrix" (tabs Matrix, Inventory, Hosting) | Google Sheets | get_spreadsheet, update_values, update_spreadsheet |
| Deck "ay — Architecture and roadmap" | Google Slides (Drive for the first pptx upload) | read_presentation, update_presentation |
| Figma file "Aphrody" in team "ay" | Figma | skill://figma/figma-use first; create_session, use_figma, get_screenshot |
| Milestones "ay: <product> replica" | Google Calendar | search_events, create_event, update_event |
| Hosting inventory | cloudflare, vercel, aphrody:ovhcloud, hostinger | read-only list calls |
| CI state | github | workflow runs of aphrody-dev/ay and aphrody-labs/bun |
| Reference pages | claude-in-chrome (main session only) | navigate, get_page_text, screenshot |

The Drive folder "ay" holds the Doc, Sheet and Deck; its id and the file ids are recorded in `docs/mirrors.toml`
once created.

## Steps
1. If a reference in `ay.toml` [products] or `docs/features.toml` changed, re-read it in the browser with
   claude-in-chrome (main session: subagents have no browser) and update the matrix rows first; run
   `bun run check`.
2. Run the saved workflow: `Workflow({ name: "design-package", args: { repo, driveFolderId, docId, sheetId,
   slidesId, figmaFileKey, today } })`, with the ids from `docs/mirrors.toml`.
3. Read its `gaps` result; fix the sources (never the mirrors by hand) and run it again until `gaps` is empty.
4. Commit source changes on main after `bun run check`.

## Rules
- Mirrors never carry content the sources lack; fix the source, then republish.
- Hosting and CI steps are read-only.
- Every artifact is read back before it counts as published.
