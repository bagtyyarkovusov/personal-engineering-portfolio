# Admin Editing Slices — Design

2026-05-11 | Parent: [#1](https://github.com/bagtyyarkovusov/personal-engineering-portfolio/issues/1)

## Summary

Add BuildLogEntry, ArchitectureDecision, and PipelineEvidence content types (Prisma models, public queries, display components, seed data) plus admin CRUD pages for ArchitectureDecision and PipelineEvidence. Executed by 4 sub-agents in parallel worktrees.

## Architecture

Each agent works in an isolated git worktree. Each content agent adds its Prisma model, feature module, and seed data independently. Agent 4 creates admin pages that consume the models from agents 1 and 2. Merges are additive (models appended to schema, entries appended to seed).

## Prisma Models

### BuildLogEntry (Agent 3)

```prisma
model BuildLogEntry {
  id          String            @id @default(cuid())
  projectId   String
  project     Project           @relation(fields: [projectId], references: [id], onDelete: Cascade)
  title       String
  body        String?
  occurredAt  DateTime          @default(now())
  status      ContentStatus     @default(draft)
  visibility  ContentVisibility @default(public)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@index([projectId])
  @@index([occurredAt])
}
```

### ArchitectureDecision (Agent 1)

```prisma
model ArchitectureDecision {
  id          String            @id @default(cuid())
  projectId   String
  project     Project           @relation(fields: [projectId], references: [id], onDelete: Cascade)
  title       String
  summary     String
  body        String?
  status      ContentStatus     @default(draft)
  visibility  ContentVisibility @default(public)
  order       Int               @default(0)
  decidedAt   DateTime?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@index([projectId])
}
```

### PipelineEvidence (Agent 2)

```prisma
model PipelineEvidence {
  id          String            @id @default(cuid())
  projectId   String
  project     Project           @relation(fields: [projectId], references: [id], onDelete: Cascade)
  label       String
  description String?
  category    String            @default("general")
  url         String?
  status      ContentStatus     @default(draft)
  visibility  ContentVisibility @default(public)
  recordedAt  DateTime          @default(now())
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@index([projectId])
}
```

## Feature Modules

Following existing patterns in `src/features/projects/` and `src/features/milestones/`:

```
src/features/
  architecture-decisions/
    queries.ts                       # getPublishedPublicArchitectureDecisions(projectId)
    architecture-decision-list.tsx   # public display component
  pipeline-evidence/
    queries.ts                       # getPublishedPublicPipelineEvidence(projectId)
    pipeline-evidence-list.tsx       # public display component
  build-logs/
    queries.ts                       # getPublishedPublicBuildLogEntries()
    build-log-list.tsx               # public display component
```

All queries use `buildVisibilityFilter("public")` from `src/lib/publication/policy.ts`.

## Agent Assignments

### Agent 1 — Architecture Decision (#33)

- Add `ArchitectureDecision` model to Prisma schema
- Create `src/features/architecture-decisions/queries.ts`
- Create `src/features/architecture-decisions/architecture-decision-list.tsx`
- Wire into `src/app/(public)/work/[slug]/page.tsx` as new section after milestones
- Seed 3 architecture decisions for car marketplace project
- Test: `src/features/architecture-decisions/queries.test.ts`

Seed data:
1. "Mobile-first with Flutter" — published, public
2. "Offline Docker deployment" — published, public
3. "Specification pattern for search" — published, public

### Agent 2 — Pipeline Evidence (#34)

- Add `PipelineEvidence` model to Prisma schema
- Create `src/features/pipeline-evidence/queries.ts`
- Create `src/features/pipeline-evidence/pipeline-evidence-list.tsx`
- Wire into `src/app/(public)/work/[slug]/page.tsx` as new section after architecture decisions
- Seed 3 evidence records for car marketplace
- Test: `src/features/pipeline-evidence/queries.test.ts`

Seed data:
1. "Docker build passes" — category: docker, published, public
2. "Backend unit tests passing — 200+ cases" — category: testing, published, public
3. "CI pipeline configured — GitHub Actions" — category: ci, published, public

### Agent 3 — Build Log Entries

- Add `BuildLogEntry` model to Prisma schema
- Create `src/features/build-logs/queries.ts`
- Create `src/features/build-logs/build-log-list.tsx`
- Wire into `src/app/(public)/build-log/page.tsx` — replace static placeholder with live data
- Seed 3 build log entries across portfolio and car marketplace projects
- Test: `src/features/build-logs/queries.test.ts`

Seed data:
1. "Project scaffold and design tokens landed" — portfolio, published, public
2. "Car marketplace project page with case study body" — car marketplace, published, public
3. "Auth.js owner login and admin route protection" — portfolio, published, public

### Agent 4 — Admin Evidence Editing (#35)

- Create `src/app/admin/architecture-decisions/page.tsx` — server component with list + create/edit forms via Server Actions
- Create `src/app/admin/pipeline-evidence/page.tsx` — same pattern
- Update admin dashboard (`src/app/admin/page.tsx`) with navigation links
- Admin sees all statuses/visibilities (no visibility filter)
- Forms support: title, summary/description, status, visibility, date fields, Markdown body
- Does NOT add Prisma models — uses models from agent 1 and 2

## Wiring Points

| Page | New Sections |
|------|-------------|
| `src/app/(public)/work/[slug]/page.tsx` | ArchitectureDecisionList, PipelineEvidenceList (after milestones) |
| `src/app/(public)/build-log/page.tsx` | BuildLogList replaces static placeholder |
| `src/app/admin/page.tsx` | Navigation links to new admin sections |
| `src/app/admin/architecture-decisions/page.tsx` | New admin CRUD page |
| `src/app/admin/pipeline-evidence/page.tsx` | New admin CRUD page |

## Merge Strategy

1. Each agent commits to their worktree branch
2. Merge Agent 1 first (ArchitectureDecision model + feature)
3. Merge Agent 2 (PipelineEvidence model + feature) — additive schema change
4. Merge Agent 3 (BuildLogEntry model + feature) — additive schema change
5. Merge Agent 4 last (admin pages) — needs models from 1 and 2, regenerate Prisma client
6. Run `pnpm prisma generate` and `pnpm prisma db push` on merged branch
7. Resolve any seed file conflicts (additive, all entries appended)
8. Run `pnpm test` and `pnpm build` to verify

## Acceptance Criteria

- Architecture decision records render on car marketplace project page
- Pipeline evidence records render on car marketplace project page
- Build log entries render on the Build Log page (replaces empty state when entries exist)
- Publication policy prevents draft/private/admin-only entries from rendering publicly
- Admin pages allow create/edit of architecture decisions and pipeline evidence
- Admin pages are gated by existing auth guard (AdminLayout)
- All new feature modules have passing tests
