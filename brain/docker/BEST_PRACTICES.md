# Reproducible & Scalable Docker Best Practices (Aphrody + Rose Griffon)

## 1. Reproducible & Fast Builds (`Dockerfile` + `docker-bake.hcl`)
- Always start every `Dockerfile` with `# syntax=docker/dockerfile:1.12` (or `1.7+`).
- Use `docker-bake.hcl` (`docker buildx bake`) for multi-target builds (`default`, `prod`, `tools`), centralized `RG_REGISTRY`/`TAG`, OCI annotations (`org.opencontainers.image.*`), and shared BuildKit caches.
- Order instructions by change frequency: lockfiles/manifests first (`--mount=type=bind` or dedicated `manifests` stage) before copying app source.
- Use `--mount=type=cache,target=...` (Bun/npm cache, Cargo registry/target, apt/apk with `sharing=locked`) so caches never inflate final layers.
- Use `--mount=type=secret,id=...` for build-time tokens/envs; NEVER bake secrets in `ARG`, `ENV`, or `COPY`.
- Pin base images to explicit versions or digests (`1.29-alpine`, `18-alpine`, `8-alpine`), never unpinned `:latest` in production.
- Keep `.dockerignore` strict: exclude `.git`, `node_modules`, `.next`, `.turbo`, `target`, `.env*`, `**/*.pem`, `tests`, `.claude`, `.gemini`, `.agents`.

## 2. Hardened Multi-Container Stacks (`compose.yaml`)
- Canonical filename is `compose.yaml` (never `docker-compose.yml`).
- Run runtime stages as non-root (`USER 1000:1000` / `USER bun`) aligned with host volume ownership.
- Enforce `security_opt: ["no-new-privileges:true"]`, `read_only: true` + `tmpfs: [/tmp]` where stateless, explicit `deploy.resources.limits.memory`, and `restart: unless-stopped`.
- Bind internal proxies/DBs strictly to `127.0.0.1` or private WireGuard mesh (`${RG_MESH_IP}`), never `0.0.0.0` behind Cloudflare/host nginx.
- Model dependencies cleanly with `depends_on: { svc: { condition: service_healthy } }` paired with explicit `healthcheck` (or `network_mode: "service:<app>"` curl sidecar for scratch/distroless images).

## 3. Destructive Guardrails & Multi-Host Hygiene
- Check `du -sh` and running dependents before pruning or deleting host dirs.
- Scope cleanups strictly by prefix/project (`rg-*`/`rosegriffon*` only — never unscoped `docker system prune -a --volumes` or cross-tenant containers like `shenron*`).
- Coordinate concurrent VPS builds/deploys via `flock` locks (`deploy.lock`) and `relay` session checks.
