# ADR 0002: Use Prisma And PostgreSQL

## Status

Accepted

## Context

The app needs structured content, private room access tokens, milestones, build logs, architecture decisions, pipeline evidence, and future agency-ready data concepts.

## Decision

Use PostgreSQL as the database and Prisma as the schema, migration, and type-safe query layer.

## Alternatives Considered

- Supabase as the primary backend platform
- raw SQL only
- Drizzle ORM
- file-only content

## Consequences

Prisma and PostgreSQL support explicit schema design, migrations, type-safe access, and maintainable tests.

Supabase remains a future option if the product later needs hosted auth, storage, realtime features, or row-level-security-heavy workflows.
