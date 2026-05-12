# Personal Engineering Portfolio

A personal-led, agency-ready engineering portfolio that proves delivery discipline end to end: maintainable architecture, full testing, Dockerized environments, CI/CD, deployment evidence, and transparent milestone visibility.

This project is the first case study in its own catalog — the portfolio proves the engineering system it describes.

## Context and Decisions

- **Master PRD**: [#1 — Tracer-bullet MVP and delivery workflow](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/1)
- **Architecture Decisions**: See [`docs/adr/`](./docs/adr/)
- **Domain Context**: See [`CONTEXT-MAP.md`](./CONTEXT-MAP.md) and [`docs/context/`](./docs/context/)
- **Agent Configuration**: See [`AGENTS.md`](./AGENTS.md)

## Prerequisites

- **Node.js**: `>=20.0.0` (managed via `.nvmrc`)
- **pnpm**: `>=9.0.0` (managed via `packageManager` field and `corepack`)

Install pnpm if you don't have it:

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
```

## Local Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment variables and fill in any placeholders
#    (GitHub OAuth is only needed for admin features)
cp .env.example .env.local

# 3. Start the local database
pnpm db:start

# 4. Verify the database accepts connections
pnpm db:verify

# 5. Run Prisma migrations
pnpm db:migrate

# 6. Seed the database with tracer-bullet data
pnpm db:seed

# 7. Run the development server
pnpm dev

# 8. Open http://localhost:3005
```

You should see the health slice with seeded data:

> **OK** — Personal Engineering Portfolio — Next.js App Router health slice.  
> Seeded project: **Personal Engineering Portfolio**

## Package Scripts

| Script | What it does | Status |
|--------|--------------|--------|
| `pnpm dev` | Starts the Next.js development server on port `3005` | ✅ Working |
| `pnpm build` | Creates an optimized production build | ✅ Working |
| `pnpm start` | Starts the production server | ✅ Working |
| `pnpm check` | Runs typechecking and unit tests | ✅ Working |
| `pnpm test` | Vitest unit tests (165 tests, 14 files) | ✅ Working |
| `pnpm test:e2e` | Playwright E2E smoke tests | ✅ Working |
| `pnpm test:e2e:a11y` | Runs WCAG 2.1 A/AA accessibility scans | ✅ Working |
| `pnpm test:e2e:smoke` | Runs public navigation and admin guard smoke tests | ✅ Working |
| `pnpm test:e2e:threejs` | Runs Three.js pipeline map render/fallback tests | ✅ Working |
| `pnpm test:e2e:private-room` | Runs private room E2E tests | ✅ Working |
| `pnpm format` | Formats code with Prettier | 🔄 Placeholder — see upcoming formatting issues |
| `pnpm format:check` | Checks formatting without writing | 🔄 Placeholder |
| `pnpm db:migrate` | Runs Prisma database migrations | ✅ Working |
| `pnpm db:seed` | Seeds the database with tracer-bullet data | ✅ Working |
| `pnpm db:studio` | Opens Prisma Studio for data inspection | ✅ Working |
| `pnpm db:validate` | Validates the Prisma schema | ✅ Working |
| `pnpm db:generate` | Generates the Prisma client from schema | ✅ Working |
| `pnpm db:start` | Starts the local Docker PostgreSQL service | ✅ Working |
| `pnpm db:stop` | Stops the local Docker PostgreSQL service | ✅ Working |
| `pnpm db:verify` | Checks that PostgreSQL accepts connections | ✅ Working |

## CI Quality Gate

Every push to `main` and every pull request runs a quality gate in GitHub Actions. The **quality** job verifies:

1. **Install** — dependencies installed from lockfile
2. **Prisma validate** — schema is valid
3. **Database migration** — migrations deploy cleanly against a fresh PostgreSQL container
4. **Seed** — tracer-bullet MVP seed data loads
5. **TypeScript (`pnpm typecheck`)** — strict mode, no type errors
6. **Unit tests (`pnpm test`)** — Vitest runs 165 tests across 14 test files covering access tokens, publication policy, markdown safety, auth guards, validations, design tokens, and feature queries
7. **Build (`pnpm build`)** — production Next.js build succeeds
8. **Docker build** — production image builds

Additional parallel gates run after the quality gate passes:

| Gate | What it verifies | Script |
|------|------------------|--------|
| E2E | Full Playwright end-to-end suite | `pnpm test:e2e` |
| Smoke | Public navigation and admin guard | `pnpm test:e2e:smoke` |
| Accessibility | WCAG 2.1 A/AA scans | `pnpm test:e2e:a11y` |
| Three.js | Pipeline map render/fallback | `pnpm test:e2e:threejs` |
| Private Room | Token validation and access | `pnpm test:e2e:private-room` |

CI configuration: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)

## Stack (Accepted ADRs)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Auth.js (owner-only) |
| Private Rooms | Signed links (no client accounts in v1) |
| CI/CD | GitHub Actions |
| Deployment | Railway |
| Testing | Vitest (unit), Playwright (E2E) |

## What Is Implemented vs. Coming

### ✅ Implemented
- Runtime and package manager locked (`package.json`, `.nvmrc`, `.npmrc`)
- Next.js App Router scaffold with TypeScript strict mode
- Dockerized local PostgreSQL with verified boot (`docker-compose.yml`, `pnpm db:start`)
- Runtime environment validation with failing test path (`src/lib/env/`)
- Prisma schema with content status/visibility enums, migrations, and seeded data
- Public pages: `/`, `/about`, `/work`, `/work/[slug]`, `/build-log`, `/work-with-me`, `/engineering-system`, `/design-system`
- Three.js interactive pipeline map on homepage with accessible HTML fallback ([#49](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/49))
- Private rooms with signed, revocable tokens at `/rooms/[token]` ([#39](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/39))
- Admin dashboard with server-side auth protection (GitHub OAuth, owner-only)
- Multi-stage production Dockerfile (`Dockerfile`, `output: "standalone"`)
- GitHub Actions CI: 7 quality gates (typecheck, unit tests, build, Docker, E2E, smoke, a11y, Three.js, private-room) ([#52](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/52), [#57](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/57))

### 🔄 Coming
- Railway deployment from `main` with environment variable management ([#59](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/59))
- Pre-commit hooks (formatting, typecheck)
- Prettier formatting hooks (`pnpm format`, `pnpm format:check`)

## Development Conventions

- **Feature-first architecture**: Business logic lives in `src/features/`, not route files.
- **Thin routes**: Pages compose tested feature modules.
- **Design tokens**: Shared semantic colors and status mappings live in `src/design/`.
- **Safe Markdown**: Admin-authored content uses a sanitized Markdown pipeline (not MDX from the database).
- **Content status and visibility are separate**: Draft / published / archived controls publication; public / private-room / admin-only controls visibility.

## Known Issues

| Issue | Impact | Workaround |
|-------|--------|------------|
| **Prisma Studio `ERR_STREAM_UNABLE_TO_PIPE`** on Node.js 24+ | Cosmetic error logs in terminal when Studio UI loads. Studio remains fully functional. | Ignore the logs, or downgrade to Node 22 LTS if noise is disruptive. Tracked upstream at [prisma/studio#1479](https://github.com/prisma/studio/issues/1479). |

## Production Docker Build

The multi-stage `Dockerfile` produces a production image using Next.js standalone output mode:

```bash
# Build the production image (DATABASE_URL is a build arg — the
# build-aware env validator allows dummy URLs during build; real
# secrets are injected at runtime by Railway).
docker build \
  --build-arg DATABASE_URL="postgresql://localhost:5432/build" \
  -t portfolio .

# Run locally (requires a real DATABASE_URL and other env vars):
docker run \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  -e NEXTAUTH_URL="https://your-domain.com" \
  -e GITHUB_CLIENT_ID="..." \
  -e GITHUB_CLIENT_SECRET="..." \
  -e AUTH_OWNER_GITHUB_ID="..." \
  -p 3000:3000 \
  portfolio
```

### Stages

| Stage | Base | Purpose |
|-------|------|---------|
| `deps` | `node:20-alpine` | Install production dependencies |
| `builder` | `node:20-alpine` | Install all deps, generate Prisma client, compile TypeScript, build Next.js |
| `runner` | `node:20-alpine` | Minimal image: standalone output, static assets, Prisma schema. Runs as `nextjs` user on port 3000 |

### Railway Deployment

The `Dockerfile` is designed for Railway's container deployment path:

1. **Connect the repo** to a Railway project
2. **Set environment variables** in Railway's service dashboard: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `AUTH_OWNER_GITHUB_ID`
3. **Railway auto-detects** the Dockerfile and builds/deploys on push to `main`
4. **Database migrations** must run before the app starts — add a pre-deploy command in Railway's service settings: `pnpm exec prisma migrate deploy`

Railway injects environment variables at runtime, so the Docker image contains no secrets. The build-time `DATABASE_URL` arg is used only for Prisma client generation during the build step.

## Environment Contract

Environment variables are documented and validated at runtime. The local/CI/production contract is established in [`.env.example`](./.env.example). Production secrets are managed through Railway, never committed.

## License

Private — not open source.
