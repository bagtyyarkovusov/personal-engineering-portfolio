# ADR 0006: Migration Baseline Reset and Discipline

## Status

Accepted

## Context

Production deployment on Railway failed because the database schema was incomplete. The root cause was a workflow split: local development used `prisma db push` (which bypasses migration history), while CI and production used `prisma migrate deploy` (which only applies committed migrations). Three tables (`ArchitectureDecision`, `PipelineEvidence`, `BuildLogEntry`) existed in `schema.prisma` but were absent from every migration file. The seed script crashed when it tried to `deleteMany()` on missing tables.

This violated the core principle that the CI/CD pipeline must own database schema evolution without manual intervention.

## Decision

1. **Baseline reset**: Delete the broken incremental migrations and replace them with a single `20260522092410_baseline` migration that captures the entire current schema.
2. **Dockerfile pre-start migration**: The production container runs `prisma migrate deploy` before `node server.js`, ensuring the schema is always correct before accepting traffic.
3. **Ban `db push` for schema changes**: `prisma migrate dev` is the only approved local workflow for schema evolution. Migrations are code and must be reviewed in PRs.
4. **Idempotent seed**: The existing seed script already uses `upsert`; no changes were needed beyond ensuring the schema exists first.

## Alternatives Considered

- **Fix existing migrations individually**: Edit each migration SQL to add the missing tables. Rejected because the migration history was already untrustworthy — a clean baseline is less error-prone and easier to reason about.
- **Squash with `migrate resolve`**: Baseline production with `prisma migrate resolve --applied` and create a diff migration. Rejected because production was already in a partially-migrated, broken state; a full reset is cleaner.
- **Keep `db push` for local prototyping**: Rejected because it was the direct cause of the drift. Local and production must share the same schema evolution path.

## Consequences

- Local development now requires `pnpm db:migrate` (alias for `prisma migrate dev`) instead of `prisma db push`.
- Every schema change produces a committed, reviewable SQL migration.
- Railway deployments are fully automatic: migrations run at container startup, then the server starts.
- The CI pipeline (`prisma validate` → `prisma migrate deploy` → `seed` → `typecheck` → `test` → `build`) now validates the exact same path that production uses.
