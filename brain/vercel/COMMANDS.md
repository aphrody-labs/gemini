# Vercel Plugin Specialist Agents & Command Workflows

## Specialist Agents

### `ai-architect`

Specializes in architecting AI-powered applications on Vercel — choosing between AI SDK patterns, configuring providers, building agents, setting up durable workflows, and integrating MCP servers. Use when designing AI features, building chatbots, or creating agentic applications.
- Sections: AI Pattern Selection Tree | Model Selection Decision Tree | AI SDK Agent Class Patterns | AI Error Diagnostic Tree | Provider Strategy Decision Matrix | Architecture Patterns | Pattern 1: Simple Chat (Most Common) | Pattern 2: Agentic Chat

### `deployment-expert`

Specializes in Vercel deployment strategies, CI/CD pipelines, preview URLs, production promotions, rollbacks, environment variables, and domain configuration. Use when troubleshooting deployments, setting up CI/CD, or optimizing the deploy pipeline.
- Sections: Deployment Failure Diagnostic Tree | 1. Build Phase Failures | 2. Function Runtime Failures | 3. Environment Variable Issues | 4. Domain & DNS Configuration | 5. Rollback & Recovery | Deployment Strategy Decision Matrix | Common Build Error Quick Reference

### `performance-optimizer`

Specializes in optimizing Vercel application performance — Core Web Vitals, rendering strategies, caching, image optimization, font loading, edge computing, and bundle size. Use when investigating slow pages, improving Lighthouse scores, or optimizing loading performance.
- Sections: Server Performance Investigation | Core Web Vitals Reference | Core Web Vitals Diagnostic Trees | LCP (Largest Contentful Paint) — Target: < 2.5s | INP (Interaction to Next Paint) — Target: < 200ms | CLS (Cumulative Layout Shift) — Target: < 0.1 | Next.js Framework Reference | Performance Audit Checklist

## Workflow Commands

### `bootstrap`

Bootstrap a repository with Vercel-linked resources by running preflight checks, provisioning integrations, verifying env keys, and then executing db/dev startup commands safely.
- Sections: Preflight | Plan | Commands | 1. Link + local env template | 2. Provision Postgres | Prisma ORM projects | Preferred path (Vercel-managed Neon) | Fallback path 1 (Dashboard)

### `deploy`

Deploy the current project to Vercel. Pass "prod" or "production" as argument to deploy to production. Default is preview deployment.
- Sections: Preflight | Plan | Commands | Preview Deployment | Production Deployment (requires confirmation) | Verification | Deployment status (MCP) | 1. Inspect the Deployment

### `env`

Manage Vercel environment variables. Commands include list, pull, add, remove, and diff. Use to sync environment variables between Vercel and your local development environment.
- Sections: Preflight | Plan | Commands | "list" or "ls" or no arguments | "pull" | "add \<NAME\>" | "rm \<NAME\>" or "remove \<NAME\>" | "diff"

### `status`

Show the status of the current Vercel project — recent deployments, linked project info, and environment overview.
- Sections: Preflight | Plan | Commands | 1. Recent Deployments | 2. Latest Deployment Inspection | 3. Environment Variable Counts | 4. Domain Status | 5. Configuration Highlights
