# Official Docker AI Coding Agent Skills (`github.com/docker/skills`)

| Skill ID | Version | Status | Scope |
| :--- | :--- | :--- | :--- |
| `docker-agent-config` | `0.1.3` | stable | Use this skill when creating or editing an agent.yaml (or .yml/.hcl) configuration file for Docker Agent (cagent), including defining agents |
| `docker-agent-deploy` | `0.1.1` | stable | Use this skill when exposing a Docker Agent as a server (MCP, HTTP API, A2A, ACP, or OpenAI-compatible chat), distributing an agent via an O |
| `docker-agent-run` | `0.1.2` | stable | Use this skill when running a Docker Agent with `docker agent run`, choosing a safety/approval mode, using the `--sandbox` isolation flag, s |
| `docker-build-strategies` | `0.1.3` | stable | Use this skill when writing, reviewing, or optimizing Dockerfiles, even if the user just says their image is too large, their build is slow, |
| `docker-compose-patterns` | `0.1.3` | stable | Use this skill when creating, modifying, or debugging Docker Compose configurations, even if the user just says they need to wire services t |
| `docker-destructive-guardrails` | `0.1.0` | stable | Use this skill before running, or recommending, any Docker command that deletes, wipes, resets, or otherwise irreversibly changes state — ev |
| `docker-docs` | `0.2.0` | stable | Use this skill to answer questions about any Docker product from current official Docker documentation instead of memory, even if the user j |
| `docker-project-foundations` | `0.2.3` | stable | Use this skill when setting up, initializing, or Dockerizing a project, even if the user doesn't explicitly mention Docker but describes a n |
| `docker-sandboxes-kits` | `1.0.4` | stable | >- |
| `docker-sandboxes-lifecycle` | `0.1.1` | stable | Use this skill when creating, running, reattaching to, listing, stopping, or removing Docker Sandboxes (the standalone `sbx` CLI that runs A |
| `docker-sandboxes-network-credentials` | `0.1.1` | stable | Use this skill when configuring what a Docker Sandboxes (`sbx`) sandbox can reach on the network or which credentials it authenticates with, |

## Workflow Triggers & Guardrails

### `docker-agent-config` (stable)
Use this skill when creating or editing an agent.yaml (or .yml/.hcl) configuration file for Docker Agent (cagent), including defining agents, models/providers, built-in or MCP toolsets, multi-agent teams with sub_agents. Even if the user just says they want to "build an AI agent with Docker", "make a coding agent config", "add a tool to my agent", or "set up a team of agents", this skill applies. Covers agent properties (model, instruction, toolsets, sub_agents, fallback), the models/providers sections, built-in toolsets (filesystem, shell, think, todo, memory, fetch), MCP toolset references, and named commands.
- The user is creating, editing, or reviewing an `agent.yaml`/`agent.yml`/`agent.hcl` file.
- The user wants to add a tool/toolset, an MCP server, or a sub-agent to an agent config.
- The user wants to choose or configure a model/provider (OpenAI, Anthropic, Google, Bedrock, Docker Model Runner, custom endpoint) for an age
- The user wants a multi-agent "team" with a coordinator delegating to specialists.

### `docker-agent-deploy` (stable)
Use this skill when exposing a Docker Agent as a server (MCP, HTTP API, A2A, ACP, or OpenAI-compatible chat), distributing an agent via an OCI registry with `docker agent share`, or measuring agent quality with `docker agent eval`. Even if the user just says they want to "turn my agent into an MCP server", "let Claude Desktop use my agent", "publish my agent to Docker Hub", "push my agent like an image", or "test my agent in CI", this skill applies. Covers `serve mcp/api/a2a/acp/chat` listen addresses and auth flags, `share push/pull`, eval session JSON format, scoring metrics, and the `--baseline` regression gate.
- The user wants an agent reachable over MCP, an OpenAI-compatible chat endpoint, a plain HTTP API, or A2A/ACP.
- The user wants to publish an agent to Docker Hub (or any OCI registry) or pull one someone else published.
- The user wants automated evaluations (regression tests) for an agent, or wants to gate CI on eval results.
- The task is authoring the agent.yaml itself (models, toolsets, sub_agents) — use `docker-agent-config`.

### `docker-agent-run` (stable)
Use this skill when running a Docker Agent with `docker agent run`, choosing a safety/approval mode, using the `--sandbox` isolation flag, setting up aliases, or troubleshooting a run (missing credentials, worktrees). Even if the user just says they want to "run my agent", "make my agent auto-approve tool calls", "run this agent safely", or "why can't my agent see my API key", this skill applies. Covers `--safety` (strict/balanced/restricted/autonomous), `--yolo`, `--sandbox` and its network allowlist, `--worktree`, `docker agent alias`, and `docker agent doctor`.
- The user wants to run an agent interactively or headlessly (`--exec`).
- The user is choosing or debugging `--safety`, `--yolo`, or approval behavior for tool calls.
- The user wants to isolate an agent's shell/filesystem access with `--sandbox`, or hit a sandbox network-policy error.
- The user wants a reusable shortcut (`docker agent alias`), a scoped git worktree (`--worktree`), or is debugging credentials/model availabil

### `docker-build-strategies` (stable)
Use this skill when writing, reviewing, or optimizing Dockerfiles, even if the user just says their image is too large, their build is slow, or they need to harden a container for production. Covers multi-stage builds, layer caching, .dockerignore, non-root users, and image size optimization.
- Creating a new Dockerfile for any language or framework
- Optimizing an existing Dockerfile for size, speed, or security
- Reviewing a Dockerfile for best-practice compliance
- Adding a `.dockerignore` file to a project

### `docker-compose-patterns` (stable)
Use this skill when creating, modifying, or debugging Docker Compose configurations, even if the user just says they need to wire services together, add a database to their stack, or set up a local development environment with multiple containers. Covers service definitions, health checks, dependency ordering, volumes, networks, environment variables, and development overrides.
- Creating a new `compose.yaml` for a project
- Adding or modifying services in an existing Compose file
- Setting up development overrides with `compose.override.yaml`
- Debugging service startup ordering or connectivity issues

### `docker-destructive-guardrails` (stable)
Use this skill before running, or recommending, any Docker command that deletes, wipes, resets, or otherwise irreversibly changes state — even if the user just says to "clean up", "clear the cache", "start fresh", "wipe everything", "nuke it", "reset", "force remove", or "tear down" Docker resources. Covers generic Docker CLI destructive operations not owned by a more specific skill — `docker rm`, `docker rm -f`, `docker container prune`, `docker kill`, `docker system prune`, `docker rmi`/`docker image rm`, `docker image prune -a`, `docker network rm`, `docker network prune`, `docker builder prune`, `docker buildx rm`, `docker context rm`, and standalone (non-Compose) `docker volume rm`/`docker volume prune`. Also indexes destructive commands owned by other Docker skills (Compose, sandbox, Desktop). Core rule — state exactly what will be lost and get explicit confirmation first, except narrow, low-friction Tier 1 container cleanup.
- The user asks to "clean up", "clear the cache", "start fresh", "wipe everything", "nuke it", "reset", "force remove", or "tear down" Docker 
- The agent is considering `docker rm`, `docker rm -f`, `docker container prune`, `docker kill`, `docker stop`, `docker system prune`, `docker
- The user wants a cross-product overview of destructive commands across Docker skills
- The destructive command in question is Compose-specific (`docker compose down -v`, `docker compose rm -v`, `docker volume rm`/`docker volume

### `docker-docs` (stable)
Use this skill to answer questions about any Docker product from current official Docker documentation instead of memory, even if the user just asks "how do I…", "does Docker support…", "what's the flag for…", or "is this still the right way" about Docker. Covers Docker Desktop, Engine, Build/Buildx/Build Cloud, Compose, Hub, Scout, Docker Hardened Images (DHI), Offload, Testcontainers, Docker Sandboxes (`sbx`, local and cloud sandboxes, Sandboxes API/SDK), Docker Agentic Platform, Docker Agent, MCP Catalog/Toolkit/Gateway, Model Runner, Gordon, and account, admin, security, and billing docs. Searches with the `search_docker_docs` MCP tool when available and otherwise falls back to `docs.docker.com/llms.txt` and per-page Markdown.
- The user asks how a Docker product works, which command, flag, setting, or
- The answer depends on facts that change between releases: CLI syntax, new
- The user names a Docker product or alias you can't place with certainty,
- Another Docker skill's guidance may be stale, or the user asks for a

### `docker-project-foundations` (stable)
Use this skill when setting up, initializing, or Dockerizing a project, even if the user doesn't explicitly mention Docker but describes a need for containerized local development, adding a database or cache dependency, or running services without host-level installs. Covers Dockerfile, compose.yaml, and .dockerignore creation with Docker best practices.
- A user asks you to set up, initialize, or Dockerize a project
- A project needs an initial `Dockerfile`, `compose.yaml`, or `.dockerignore` and does not have one
- A user wants to add a service dependency (database, cache, message queue) to a project
- A user asks how to run or develop a project locally and Docker is available

### `docker-sandboxes-kits` (stable)
>-
- **Legacy v2 `spec.yaml` kits (`schemaVersion: "2"`, `kind: sandbox`) are
- **`sbx kit validate` is not a conformance check.** The v0.50.1 code supplies
- Do not carry v2 vocabulary into v3: `name`, `sandbox:`,
- This skill is experimental. The source calls the schema-3 grammar

### `docker-sandboxes-lifecycle` (stable)
Use this skill when creating, running, reattaching to, listing, stopping, or removing Docker Sandboxes (the standalone `sbx` CLI that runs AI coding agents in isolated microVMs), even if the user just says they want to "run claude in a sandbox", "isolate an agent from my repo", "give an agent its own git clone", or "clean up old sandboxes". Covers `sbx run`/`sbx create` (including the built-in agents claude, codex, cursor, devin, docker-agent, gemini, opencode, shell), workspace bind-mount vs `--clone` isolation, additional read-only workspaces, reattaching by `--name`, `sbx ls`/`stop`/`rm`/`prune`, `sbx exec`, `sbx cp`, and `sbx ports`.
- The user wants to start, reattach to, stop, or remove a local `sbx` sandbox.
- The user wants an agent to work on a repository without giving it a
- The user wants extra read-only (or write-restricted) workspaces mounted
- The user is copying files between host and sandbox, publishing a sandbox

### `docker-sandboxes-network-credentials` (stable)
Use this skill when configuring what a Docker Sandboxes (`sbx`) sandbox can reach on the network or which credentials it authenticates with, even if the user just says they want to "let the agent call an internal API", "block all network access", "give the agent a GitHub token", or "use a private registry image for a sandbox". Covers `sbx policy init/allow/deny/ls/inspect/log/check/rm network` (global and per-sandbox egress rules, deny-over-allow precedence) and `sbx secret set/set-custom/ls/rm/import` (service secrets, dynamic secrets via --ref/--command, and registry pull credentials with their host-pulls-only-by-default injection scope).
- The user wants to allow, deny, or inspect which hosts a sandbox (or all
- The user wants to give an agent an API key, OAuth token, or other service
- The user wants to pull a private template image or kit from a registry
- The user is debugging a blocked network request or a credential that
