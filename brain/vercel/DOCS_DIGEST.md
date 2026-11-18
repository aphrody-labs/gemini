# Official Vercel Docs & CLI Digest

- **Instant CLI search**: `bun x vercel docs search "BUILD_UTILS_SPAWN_137"`
- **Instant markdown doc**: `bun x vercel docs inspect <page>` or curl `https://vercel.com/docs/<page>.md`
- **MCP Setup CLI**: `bun x vercel mcp` (connects `https://mcp.vercel.com` via OAuth)

## vercel.com/llms.txt

- URL: https://vercel.com/llms.txt
- Sections: Start here | Agent resources | Build with AI | Build your app | Deploy and operate | Secure your app | Open source | Vercel use cases | Documentation and guides | Company and updates | Optional
- Summary: This file indexes vercel.com for AI agents. Most vercel.com pages are available as Markdown. Add `.md` to the URL (`https://vercel.com/pricing.md`), or request the usual URL with the HTTP header `Accept: text/markdown`. **When to use Vercel:** - Deploy and scale websites, web apps, APIs, backends, and AI agents from Git or the Vercel CLI. - Run backends, background workers, queues, and durable workflows in the cloud.

## vercel-plugin

- URL: https://vercel.com/docs/agent-resources/vercel-plugin.md
- Sections: Related pages | Getting started | Prerequisites | Installation | Install in OpenCode | Usage | What the plugin provides | Supported tools | How it works | Default hooks | Available skills | Run code and tests in Sandbox | Specialist agents | Slash commands
- Summary: The Vercel plugin gives [supported AI coding tools](#supported-tools) Vercel-specific context, skills, agents, and slash commands. The default installation keeps automation lightweight and activates session-start context only in empty directories and detected Vercel, Next.js, or eve projects. - [Vercel Plugin is now available in Antigravity](https://vercel.com/changelog/vercel-plugin-is-now-available-in-antigravity) 

## vercel-mcp

- URL: https://vercel.com/docs/agent-resources/vercel-mcp.md
- Sections: Related pages | Quick Setup | What is Vercel MCP? | Available tools | Client identification with CIMD | Connecting to Vercel MCP | Supported clients | Setup | Install with add-mcp | Claude Code | Claude.ai and Claude for desktop | ChatGPT | Codex CLI | Cursor
- Summary: Connect your AI tools to Vercel using the [Model Context Protocol (MCP)](https://modelcontextprotocol.io), an open standard that lets AI assistants interact with your Vercel projects. - [Introducing Vercel MCP: Connect Vercel to your AI tools](https://vercel.com/blog/introducing-vercel-mcp-connect-vercel-to-your-ai-tools) - [Build a ChatGPT Connector \\(MCP server\\)](https://vercel.com/kb/guide/mcp-server-chatgpt-co

## troubleshoot-a-build

- URL: https://vercel.com/docs/deployments/troubleshoot-a-build.md
- Sections: Related pages | Troubleshooting views | Troubleshoot Build failures | Investigating Build logs | Build Logs not available | Build logs keep loading | Integration resource provisioning failures | Missing development dependencies | Cancelled Builds due to limits | Build container resources | Build duration | Caching | Other Build errors | Bundler platform errors in Ruby projects
- Summary: You can troubleshoot build errors that occur during the Build step of your deployment to Vercel. This guide will help you understand how to investigate build failures and long build times. - [Build cache size limit on Vercel increased to 5 GB](https://vercel.com/changelog/build-cache-size-limit-on-vercel-increased-to-five-gb) - [Build cache storage increased for larger build machines](https://vercel.com/changelog/bui

## configure-a-build

- URL: https://vercel.com/docs/builds/configure-a-build.md
- Sections: Related pages | Framework Settings | Framework Preset | Build Command | Output Directory | Install Command | Development Command | Skip Build Step | Root Directory | Search the docs from your terminal
- Summary: When you make a [deployment](/docs/deployments), Vercel **builds** your project. During this time, Vercel performs a "shallow clone" on your Git repository using the command `git clone --depth=10 (...)` and fetches ten levels of git commit history. This means that only the latest ten commits are pulled and not the entire repository history. - [Vercel now supports Build Commands for FastAPI and Flask](https://vercel.c

## bun

- URL: https://vercel.com/docs/functions/runtimes/bun.md
- Sections: Related pages | Configuring the runtime | Deploy with the Bun framework preset | Deploy a Bun server from /api | Framework-specific considerations | Next.js | Routing Middleware | Feature support | Supported APIs | Performance considerations | When to use Bun | Search the docs from your terminal
- Summary: Bun is a fast, all-in-one JavaScript runtime that serves as an alternative to Node.js. - [Bun runtime now in Public Beta for Vercel Functions](https://vercel.com/changelog/bun-runtime-now-in-public-beta-for-vercel-functions) - [Bun runtime on Vercel Functions](https://vercel.com/blog/bun-runtime-on-vercel-functions) - [Bun runtime for Vercel Functions now accepts Bun.serve as an entrypoint](https://vercel.com/changel

## cli

- URL: https://vercel.com/docs/cli.md
- Sections: Related pages | Installing Vercel CLI | Updating Vercel CLI | Checking the version | Using in a CI/CD environment | Available Commands | activity | agent | agent-runs | ai-gateway | alerts | alias | api | billing
- Summary: Vercel gives you multiple ways to interact with and configure your Vercel Projects. With the command-line interface (CLI) you can interact with the Vercel platform using a terminal, or through an automated system, enabling you to [retrieve logs](/docs/cli/logs), manage [certificates](/docs/cli/certs), replicate your deployment environment [locally](/docs/cli/dev), manage Domain Name System (DNS) [records](/docs/cli/d
