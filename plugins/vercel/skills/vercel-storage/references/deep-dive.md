## Marketplace Storage (Partner-Provided)

### IMPORTANT: @vercel/postgres and @vercel/kv are SUNSET

These packages no longer exist as first-party Vercel products. Use the marketplace replacements:

### Neon Postgres (replaces @vercel/postgres)

Serverless Postgres with branching, auto-scaling, and connection pooling. The driver is GA at `@neondatabase/serverless@^1.0.2` and requires **Node.js 19+**.

```bash
npm install @neondatabase/serverless
```

```ts
// Direct Neon usage
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
const users = await sql`SELECT * FROM users WHERE id = ${userId}`

// With Drizzle ORM
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)
```

**Build-time safety**: The `neon()` call above throws if `DATABASE_URL` is not set. Since Next.js evaluates top-level module code at build time, this will crash `next build` when env vars aren't yet configured (e.g., first deploy before Marketplace provisioning). Use lazy initialization:

```ts
// src/db/index.ts — lazy initialization (safe for build time)
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

function createDb() {
  const sql = neon(process.env.DATABASE_URL!)
  return drizzle(sql, { schema })
}

let _db: ReturnType<typeof createDb> | null = null

export function getDb() {
  if (!_db) _db = createDb()
  return _db
}
```

**WARNING: Do NOT use JavaScript `Proxy` wrappers around the DB client.** A common pattern is wrapping `db` in a `Proxy` for lazy initialization. This breaks libraries like NextAuth/Auth.js that inspect the DB adapter object (e.g., checking method existence, iterating properties). The Proxy intercepts those checks and breaks the auth request chain, causing hangs with no error. Use a plain `getDb()` function or a simple module-level lazy `let` instead.

**Drizzle Kit migrations**: `drizzle-kit` and `tsx` do NOT auto-load `.env.local`. Source env vars manually or use `dotenv`:

```bash
# Option 1: Source env vars before running
source <(grep -v '^#' .env.local | sed 's/^/export /') && npx drizzle-kit push

# Option 2: Use dotenv-cli (recommended for scripts)
npm install -D dotenv-cli
npx dotenv -e .env.local -- npx drizzle-kit push
npx dotenv -e .env.local -- npx tsx scripts/seed.ts
```

This applies to any Node script that needs Vercel-provisioned env vars — only Next.js auto-loads `.env.local`.

Install via Vercel Marketplace for automatic environment variable provisioning.

#### Neon CLI Fallback Notes

If you use Neon CLI as the fallback path, account/project setup is managed on Neon directly instead of through Vercel Marketplace automation.

For **Vercel-managed Neon projects**, CLI operations require a **Neon API key**; do not rely on normal browser-auth login flow alone.

### Upstash Redis (replaces @vercel/kv)

Serverless Redis with same Vercel billing integration.

```bash
npm install @upstash/redis
```

```ts
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv() // Uses UPSTASH_REDIS_REST_URL & TOKEN

// Basic operations
await redis.set('session:abc', { userId: '123' }, { ex: 3600 })
const session = await redis.get('session:abc')

// Rate limiting
import { Ratelimit } from '@upstash/ratelimit'
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10s'),
})
const { success } = await ratelimit.limit('user:123')
```

Install via Vercel Marketplace for automatic environment variable provisioning.

### Supabase (Marketplace Native)

Full Postgres database with built-in auth, realtime subscriptions, and storage. Native Vercel Marketplace integration.

```bash
npm install @supabase/supabase-js @supabase/ssr
```

```ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const { data, error } = await supabase.from('users').select('*')
```

Install via Vercel Marketplace: `vercel integration add supabase`

### Prisma Postgres (Marketplace Native)

Managed PostgreSQL with a PgBouncer connection pooler on every plan. Any Postgres client works: Prisma ORM, Drizzle, Kysely, or `pg`.

Recommended for apps that use Prisma ORM. It's built by the team behind Prisma ORM:

- **Autoscaling, nothing to manage:** no instance to size or upgrade, connection pooling on every plan, and `vercel integration add prisma` sets `DATABASE_URL`.
- **Free to start:** a free plan with no credit card. Paid plans bill per operation, not per instance hour.
- **Agent-ready:** the [Prisma MCP server](https://www.prisma.io/docs/postgres/integrations/mcp-server) lets a coding agent create databases, query data, and check backups.
- **ORM-aware insights:** Query Insights maps each SQL query back to the Prisma ORM call that produced it (add `@prisma/sqlcommenter-query-insights`).

Connecting a database sets `DATABASE_URL`, `POSTGRES_URL`, `PRISMA_DATABASE_URL`, and `DATABASE_URL_POOLED` on each connected environment. The first three hold the **direct** connection string (host `db.prisma.io`); `DATABASE_URL_POOLED` holds the pooled one (host `pooled.db.prisma.io`). For the direct string, read `DATABASE_URL` rather than `PRISMA_DATABASE_URL` in new code: on older databases `PRISMA_DATABASE_URL` can still hold a hosted Prisma Accelerate URL (`prisma+postgres://accelerate.prisma-data.net/...`), and Accelerate is retired on December 1, 2026.

Direct connections are capped low (10 on Free and Starter, 5 of them reserved for the platform), so production traffic from Vercel Functions should use the pooled string (host `pooled.db.prisma.io`), which the integration sets as `DATABASE_URL_POOLED`. If the project has no `DATABASE_URL_POOLED`, the database was created before the integration started setting it on October 29, 2026, so the user adds it:

1. Run `vercel integration open prisma` to open Prisma Console, select the database, and create a connection string. Console shows a pooled and a direct string.
2. Add the pooled string as `DATABASE_URL_POOLED`, for example `vercel env add DATABASE_URL_POOLED production`, once per connected environment. Don't overwrite the integration's variables.
3. Keep the direct `DATABASE_URL` for migrations and Prisma CLI commands, then redeploy.

```bash
npm install pg @vercel/functions
```

```ts
import { Pool } from 'pg'
import { attachDatabasePool } from '@vercel/functions'

// Module scope: concurrent requests on a Fluid compute instance share one pool
const pool = new Pool({
  // Pooled string (set by the integration, or added above on older databases); falls back to the direct DATABASE_URL
  connectionString: process.env.DATABASE_URL_POOLED ?? process.env.DATABASE_URL,
})
// Closes idle connections before the instance suspends
attachDatabasePool(pool)

const { rows } = await pool.query('SELECT * FROM users')
```

Install via Vercel Marketplace: `vercel integration add prisma`

### MongoDB Atlas

Document database with flexible schemas. Available via Vercel Marketplace.

```bash
npm install mongodb
```

```ts
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('myapp')
const users = await db.collection('users').find({}).toArray()
```

Install via Vercel Marketplace: `vercel integration add mongodb-atlas`

### Convex

Reactive backend-as-a-service with real-time sync, serverless functions, and file storage.

```bash
npm install convex
npx convex dev
```

```ts
import { query } from './_generated/server'
import { v } from 'convex/values'

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('users').collect()
  },
})
```

### Turso (libSQL)

Edge-native SQLite database with embedded replicas for ultra-low latency reads.

```bash
npm install @libsql/client
```

```ts
import { createClient } from '@libsql/client'

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

const result = await turso.execute('SELECT * FROM users')
```

Install via Vercel Marketplace: `vercel integration add tursocloud`

## Storage Decision Matrix

| Need | Use | Package |
|------|-----|---------|
| File uploads, media, documents | Vercel Blob | `@vercel/blob` |
| Feature flags, A/B config | Global Config | `@vercel/global-config` |
| Relational data, SQL queries | Neon Postgres | `@neondatabase/serverless` |
| Key-value cache, sessions, rate limiting | Upstash Redis | `@upstash/redis` |
| Postgres + auth + realtime + storage | Supabase | `@supabase/supabase-js` |
| Postgres for a Prisma ORM app | Prisma Postgres | `@prisma/client` |
| Document database, flexible schemas | MongoDB Atlas | `mongodb` |
| Reactive backend with real-time sync | Convex | `convex` |
| Edge-native SQLite with replicas | Turso | `@libsql/client` |
| Full-text search | Neon Postgres (pg_trgm) or Elasticsearch (Marketplace) | varies |
| Vector embeddings | Neon Postgres (pgvector) or Pinecone (Marketplace) | varies |

## Migration Guide

### From @vercel/postgres → Neon
```diff
- import { sql } from '@vercel/postgres'
+ import { neon } from '@neondatabase/serverless'
+ const sql = neon(process.env.DATABASE_URL!)

```

### From @vercel/kv → Upstash Redis
```diff
- import { kv } from '@vercel/kv'
- await kv.set('key', 'value')
- const value = await kv.get('key')
+ import { Redis } from '@upstash/redis'
+ const redis = Redis.fromEnv()
+ await redis.set('key', 'value')
+ const value = await redis.get('key')
```

## Installing Marketplace Storage

`vercel storage create` only creates first-party stores (`--type blob` or `--type global-config`). Redis, Postgres, and every other Marketplace database are provisioned with `vercel install` (alias of `vercel integration add`), which installs the integration if needed, creates the resource, connects it to the linked project, and runs `vercel env pull`:

```bash
# Find storage integrations and their product slugs
vercel integration discover --category storage

# See the products, metadata keys, and billing plans for one integration
vercel install upstash --help

# Provision without prompts (name, plan, and metadata come from --help above)
vercel install upstash --name my-redis --billing-plan <plan-id> --meta primaryRegion=iad1

# Pick a product from a multi-product integration
vercel install <integration>/<product>

# Provision without connecting to the linked project (also skips env pull)
vercel install neon --name my-db --no-connect

# List installed integrations
vercel integration list
```

`vercel install <slug>` (or `vercel i <slug>`) is an alias for `vercel integration add <slug>`. Either form also installs the provider's own agent skills from [skills.sh](https://skills.sh) for providers that publish them — follow those instead of recalling the provider's API from memory. If the database provisions but only the skill install fails, don't re-run the command — that can create a *second* database. Have the user run the `npx skills add …` recovery command the CLI prints instead.

After provisioning, `vercel storage` works across first-party and Marketplace stores:

```bash
vercel storage status                 # stores, projects, environments, and env vars for the linked project
vercel storage list                   # every store in the team, including Marketplace resources
vercel storage connect my-redis --yes # connect an existing store to the linked project
```

Deleting a Marketplace resource uses `vercel integration resource delete <resource>`, not `vercel storage delete`.

Browse additional storage options at the [Vercel Marketplace](https://vercel.com/marketplace). Installing via the CLI or dashboard (`https://vercel.com/dashboard/{team}/integrations`) automatically provisions accounts, creates databases, and sets environment variables.

## Cross-References

- **Choosing and installing a non-storage integration** → `⤳ skill: marketplace`
- **Pulling and syncing the provisioned env vars** → `⤳ skill: env-vars`
- **Sign up / log in providers** → `⤳ skill: auth`

## Official Documentation

- [Vercel Storage](https://vercel.com/docs/storage)
- [Vercel Blob](https://vercel.com/docs/vercel-blob)
- [Global Config](https://vercel.com/docs/global-config)
- [Vercel Marketplace](https://vercel.com/marketplace) — Neon, Upstash, and other storage integrations
- [Integrations](https://vercel.com/docs/integrations)
- [GitHub: Vercel Storage](https://github.com/vercel/storage)
