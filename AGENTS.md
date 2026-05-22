# Personal Engineering Portfolio

This repo uses `AGENTS.md` as the canonical agent instruction file.
If another tool reads `CLAUDE.md`, it should follow the pointer there back to this file.

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `bagtyyarkovusov/personal-engineering-portfolio`. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default five-label triage vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This is a multi-context repo. Start from `CONTEXT-MAP.md`, then read the relevant context docs under `docs/context/` and architectural decisions under `docs/adr/`. See `docs/agents/domain.md`.

## Development Environment
Next js mcp is running and conneted to your environment if you want to get context about the project on port 3005.
- **Node**: 20 LTS (see `.nvmrc`). Use `nvm use` to switch.
- **Package manager**: pnpm 9.x (see `packageManager` in `package.json`). Corepack will auto-install the correct version.
- **Lockfile**: `pnpm-lock.yaml` — the single source of truth for dependencies.
- **Strictness**: `.npmrc` enforces `engine-strict=true` and `package-manager-strict=true` so mismatched environments fail fast.
- **Scripts**: All baseline scripts are defined in `package.json`. Scripts for tools not yet installed (Next.js, Prisma, Vitest, Playwright, Prettier) currently echo a placeholder and exit `0`. This keeps the script interface stable while the tracer-bullet MVP is built slice by slice.




## Database & Migration Discipline

This project uses **Prisma Migrate** as the single source of truth for schema evolution. The local workflow and the CI/production pipeline must stay in perfect sync.

### Rules

1. **Never use `prisma db push` for schema changes.**
   - `db push` bypasses migration history. It creates drift between local and production.
   - Use `pnpm db:migrate` (which runs `prisma migrate dev`) for every schema change.

2. **Every schema change must be a committed migration.**
   - After editing `schema.prisma`, run `pnpm db:migrate` to generate the migration SQL.
   - Review the generated `.sql` file in the PR just like any other code change.
   - Do not hand-edit migration files unless you are resolving a conflict.

3. **Migrations are code — they live in version control.**
   - The `prisma/migrations/` directory is not optional.
   - If you reset the baseline, document it in an ADR.

4. **Production deploys run migrations automatically.**
   - The Dockerfile CMD runs `prisma migrate deploy && node server.js` before accepting traffic.
   - Railway deployments do not require manual migration runs.

5. **Seed script is idempotent.**
   - `prisma/seed.ts` uses `upsert` and scoped `deleteMany`.
   - It can be re-run safely after any migration.

### Local workflow

```bash
# 1. Edit schema.prisma
# 2. Generate migration (applies to local DB + creates SQL file)
pnpm db:migrate
# 3. Generate Prisma client
pnpm db:generate
# 4. Re-seed if needed
pnpm db:seed
```

### CI pipeline

The GitHub Actions workflow already validates this discipline:
1. `prisma validate`
2. `prisma migrate deploy`
3. `prisma/seed.ts`
4. `typecheck`, `test`, `build`

If any of these steps fail, the deploy is blocked.

## Rules
Dont run any dev server start commands for db and next js assume they are already running
use Next js MCP to debug always for debug next js related issues on port 3005. Not port 3000  