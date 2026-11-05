# Personal Engineering Portfolio

This repo uses `AGENTS.md` as the canonical agent instruction file.
If another tool reads `CLAUDE.md`, it should follow the pointer there back to this file.

Read the request and acceptance criteria, then the owning source and tests.
This is a multi-context repo: start domain reading at [`CONTEXT-MAP.md`](CONTEXT-MAP.md); [domain guidance](docs/agents/domain.md)
explains document authority and vocabulary.
Configuration owns commands and versions; inspect it before running tools.
Follow the [delivery workflow](docs/agents/coding-workflow.md) for every change.

| When working on | Read before acting |
|---|---|
| Domain logic, ownership or documentation | [`CONTEXT-MAP.md`](CONTEXT-MAP.md), then [domain guidance](docs/agents/domain.md) and `docs/adr/` |
| Modules, behavior, tests or standards review | [Coding standards](docs/agents/coding-standards.md) |
| External dependency or service | [Documentation lookups](docs/agents/documentation-lookups.md) |
| Model choice, delegation or review effort | [Models and effort](docs/agents/models.md) |
| Running the stack, signing in or proving runtime behavior | [Local testing](docs/agents/local-testing.md) |
| Devices, browser, Docker, CI, hosting or deploys | [Environment](docs/agents/environment.md) |
| Issues, scope or readiness | [Issue tracker](docs/agents/issue-tracker.md) (GitHub Issues for `bagtyyarkovusov/personal-engineering-portfolio`) and [triage labels](docs/agents/triage-labels.md) |
| GitHub reads, writes or PR waits | [GitHub operations](docs/agents/github-operations.md) |
| Screens, navigation or user interactions | Affected source, tests, approved issue, `DESIGN.md` and the UI review requirements in the delivery workflow |
| Public copy, positioning or claims | `docs/context/product/CONTEXT.md`, including its HITL review gates |

## Skills and harness

Project skills live in `.claude/skills/`.
Track `.agents/skills` as a relative symlink to `../.claude/skills` for Codex.
Claude Code reads `.claude/skills`; Codex reads `.agents/skills`.
Open the installed `SKILL.md` manually when the host cannot discover a named skill.
Per-project kit skills must not also be global: personal skills can override them.
Only `kickoff` and unrelated personal skills stay global.
`.agent-kit.json` records the kit commit, installed skills and sets, chosen extras,
and the source kit commit for each applied template file.

T3 Code is the reference harness for the machine-level examples below. If another
host is used, follow its equivalent device, browser, delegation and secret tools;
the guide names the fallback and permission boundary in
[Environment](docs/agents/environment.md#machine-level).

Write only in your own worktree or `/tmp`. Preserve unrelated changes.
Report host guard refusals without retrying through another tool.

## Development Environment

- **Node**: 20 LTS (see `.nvmrc`). Use `nvm use` to switch.
- **Package manager**: pnpm 9.x (see `packageManager` in `package.json`). Corepack will auto-install the correct version.
- **Lockfile**: `pnpm-lock.yaml` — the single source of truth for dependencies.
- **Strictness**: `.npmrc` enforces `engine-strict=true` and `package-manager-strict=true` so mismatched environments fail fast.
- **Scripts**: All baseline scripts are defined in `package.json` and are fully wired (Next.js, Prisma, Vitest, Playwright). Only `format`/`format:check` still echo a placeholder and exit `0` — Prettier is not installed yet.

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

- Port 3005 runs the root checkout's `pnpm dev` and its Next.js MCP. Do not start or stop it; use the MCP there only for work in the root checkout.
- Assume local Postgres is already running; do not restart it.
- A worktree may start its own Next.js server on a free port of 3100 or above to verify its own change, using the existing local Postgres. Stop it when done. See [local testing](docs/agents/local-testing.md#run-the-stack).
- Never touch another session's server, and never run two heavy builds at once.
