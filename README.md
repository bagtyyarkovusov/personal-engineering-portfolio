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

# 8. Open http://localhost:3000
```

You should see the health slice with seeded data:

> **OK** — Personal Engineering Portfolio — Next.js App Router health slice.  
> Seeded project: **Personal Engineering Portfolio**

## Package Scripts

| Script | What it does | Status |
|--------|--------------|--------|
| `pnpm dev` | Starts the Next.js development server | ✅ Working |
| `pnpm build` | Creates an optimized production build | ✅ Working |
| `pnpm start` | Starts the production server | ✅ Working |
| `pnpm check` | Runs linting and typechecking | 🔄 Placeholder — see [#51](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/51) |
| `pnpm test` | Runs unit tests with Vitest | 🔄 Placeholder — see upcoming test issues |
| `pnpm test:e2e` | Runs Playwright E2E smoke tests | 🔄 Placeholder — see upcoming E2E issues |
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
- Health slice at `/` confirming the app boots
- Dockerized local PostgreSQL with verified boot (`docker-compose.yml`, `pnpm db:start`)
- Runtime environment validation with failing test path (`src/lib/env/`)
- Prisma schema, initial migration, seeded data, and public read proof

### 🔄 Coming (Tracer-bullet MVP)
- Tailwind CSS and shadcn/ui baseline ([#8](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/8))
- Design tokens and status semantics ([#9](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/9))
- Public shell with real navigation ([#10](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/10))
- Admin dashboard with server-side auth protection ([#22](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/22), [#23](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/23))
- Private room access with signed, revocable tokens ([#36](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/36), [#37](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/37))
- GitHub Actions quality gate ([#51](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/51))
- Railway deployment from `main` ([#59](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/59))

## Development Conventions

- **Feature-first architecture**: Business logic lives in `src/features/`, not route files.
- **Thin routes**: Pages compose tested feature modules.
- **Design tokens**: Shared semantic colors and status mappings live in `src/design/`.
- **Safe Markdown**: Admin-authored content uses a sanitized Markdown pipeline (not MDX from the database).
- **Content status and visibility are separate**: Draft / published / archived controls publication; public / private-room / admin-only controls visibility.

## Environment Contract

Environment variables are documented and validated at runtime. The local/CI/production contract will be established in [#6](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/6). Production secrets are managed through Railway, never committed.

## License

Private — not open source.
