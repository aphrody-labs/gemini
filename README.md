# gemini

Portable global configuration of the Gemini CLI / Antigravity for the Aphrody estate. It holds `GEMINI.md`, the settings and MCP templates, the hooks, the extension enablement and `scripts/install.ts`; it holds no path of a machine, no junction, no cache, no history and no trust list.

Setup on a machine: clone to `~/.gemini`, run `bun scripts/install.ts`. The script renders `settings.json` and `config/mcp_config.json` from the templates and links the plugins from `~/.claude/packages/*` (the single plugin source lives in the `claude` repository). Machine- and work-specific files (trusted folders, projects, installation id, history, logs) belong to the private `gemini-local` repository or stay untracked.
