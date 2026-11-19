---
name: english-i18n-generalist
description: English source baseline with pluggable project i18n and registry-driven generalist support across frameworks, languages, OSes, providers, and engines
type: feedback
---

- **English source baseline**: source language comes from project config and defaults to English (code, identifiers, comments, docs, commits, CLI output, skills). Chat replies match the user's language cleanly.
- **Pluggable i18n**: user-facing UI text uses the project's detected i18n library (`FormatJS`, `messageformat`/MF2, `i18next`, `Fluent`, `gettext`, `ARB`, `@angular/localize`, `Paraglide`). Supported locales are derived dynamically from the catalog files present (any BCP 47 tag), never fixed locale arrays. Machine translation uses any live-discovered `ai-os` model (local-first).
- **Generalist design**: never hardcode one framework, language, OS, provider, or engine as an exclusive pick. Model choices as registries plus manifest/environment detection (with user defaults such as Angular Material web, Compose Android, Flutter cross-platform as registry defaults rather than hard limits).
