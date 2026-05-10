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




## Rules
Dont run any dev server start commands for db and next js assume they are already running