# Admin Editing Slices Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add BuildLogEntry, ArchitectureDecision, and PipelineEvidence content types with public display components, seed data, and admin CRUD pages.

**Architecture:** Four agents run in parallel isolated git worktrees. Agents 1-3 each add one Prisma model + feature module + seed data + tests. Agent 4 creates admin CRUD pages that consume the models from agents 1 and 2. After all four complete, branches are merged sequentially (additive schema/seed changes), Prisma client is regenerated, and tests/build verify the result.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Prisma, PostgreSQL, Tailwind CSS, shadcn/ui, Vitest

---

## File Structure

```
# Agent 1 — Architecture Decision (#33)
CREATE  prisma/schema.prisma  (append ArchitectureDecision model)
CREATE  src/features/architecture-decisions/queries.ts
CREATE  src/features/architecture-decisions/architecture-decision-list.tsx
CREATE  src/features/architecture-decisions/queries.test.ts
MODIFY  src/app/(public)/work/[slug]/page.tsx
MODIFY  prisma/seed.ts

# Agent 2 — Pipeline Evidence (#34)
CREATE  prisma/schema.prisma  (append PipelineEvidence model)
CREATE  src/features/pipeline-evidence/queries.ts
CREATE  src/features/pipeline-evidence/pipeline-evidence-list.tsx
CREATE  src/features/pipeline-evidence/queries.test.ts
MODIFY  src/app/(public)/work/[slug]/page.tsx
MODIFY  prisma/seed.ts

# Agent 3 — Build Log Entries
CREATE  prisma/schema.prisma  (append BuildLogEntry model)
CREATE  src/features/build-logs/queries.ts
CREATE  src/features/build-logs/build-log-list.tsx
CREATE  src/features/build-logs/queries.test.ts
MODIFY  src/app/(public)/build-log/page.tsx
MODIFY  prisma/seed.ts

# Agent 4 — Admin Evidence Editing (#35)
CREATE  src/app/admin/architecture-decisions/page.tsx
CREATE  src/app/admin/pipeline-evidence/page.tsx
MODIFY  src/app/admin/page.tsx
```

---

### Task 1: Architecture Decision — Model, Feature, Seed, and Wiring (Agent 1)

**Branch:** `feat/33-architecture-decision-evidence`

**Files:**
- Create: `src/features/architecture-decisions/queries.ts`
- Create: `src/features/architecture-decisions/architecture-decision-list.tsx`
- Create: `src/features/architecture-decisions/queries.test.ts`
- Modify: `prisma/schema.prisma`
- Modify: `src/app/(public)/work/[slug]/page.tsx`
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Add ArchitectureDecision model to Prisma schema**

Append to end of `prisma/schema.prisma`:

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

- [ ] **Step 2: Push schema and regenerate client**

Run: `pnpm prisma db push && pnpm prisma generate`
Expected: No errors.

- [ ] **Step 3: Write queries**

Write `src/features/architecture-decisions/queries.ts`:

```typescript
import { prisma } from "@/lib/db/prisma";
import { buildVisibilityFilter } from "@/lib/publication/policy";

export type PublicArchitectureDecision = Awaited<
  ReturnType<typeof getPublishedPublicArchitectureDecisions>
>[number];

export async function getPublishedPublicArchitectureDecisions(projectId: string) {
  return prisma.architectureDecision.findMany({
    where: {
      projectId,
      ...buildVisibilityFilter("public"),
    },
    orderBy: { order: "asc" },
  });
}
```

- [ ] **Step 4: Write the failing test**

Write `src/features/architecture-decisions/queries.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { buildVisibilityFilter } from "@/lib/publication/policy";
import { ContentStatus, ContentVisibility } from "@prisma/client";

describe("buildVisibilityFilter for architecture decisions", () => {
  it("filters to published + public for the public surface", () => {
    const filter = buildVisibilityFilter("public");
    expect(filter).toEqual({
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    });
  });

  it("returns empty object for admin surface", () => {
    const filter = buildVisibilityFilter("admin");
    expect(filter).toEqual({});
  });

  it("filters to published + privateRoom for the privateRoom surface", () => {
    const filter = buildVisibilityFilter("privateRoom");
    expect(filter).toEqual({
      status: ContentStatus.published,
      visibility: ContentVisibility.privateRoom,
    });
  });
});
```

Run: `pnpm vitest run src/features/architecture-decisions/queries.test.ts`
Expected: PASS (tests the publication policy, which already exists).

- [ ] **Step 5: Write display component**

Write `src/features/architecture-decisions/architecture-decision-list.tsx`:

```typescript
import { PublicArchitectureDecision } from "./queries";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { renderMarkdown } from "@/lib/markdown/renderer";

interface ArchitectureDecisionListProps {
  decisions: PublicArchitectureDecision[];
}

export async function ArchitectureDecisionList({
  decisions,
}: ArchitectureDecisionListProps) {
  if (decisions.length === 0) {
    return null;
  }

  const rendered = await Promise.all(
    decisions.map(async (d) => ({
      ...d,
      bodyHtml: d.body ? await renderMarkdown(d.body) : null,
    }))
  );

  return (
    <section className="border-t border-border pt-8">
      <h2 className="font-serif text-2xl tracking-tight text-foreground">
        Architecture Decisions
      </h2>
      <div className="mt-6 space-y-6">
        {rendered.map((decision) => (
          <article
            key={decision.id}
            className="rounded-lg border border-border bg-card p-6 space-y-3"
          >
            <header className="space-y-1">
              <h3 className="font-serif text-xl tracking-tight text-card-foreground">
                {decision.title}
              </h3>
              {decision.decidedAt && (
                <time
                  dateTime={decision.decidedAt.toISOString()}
                  className="text-xs text-muted-foreground"
                >
                  Decided{" "}
                  {new Date(decision.decidedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </time>
              )}
            </header>
            <p className="text-sm text-muted-foreground">{decision.summary}</p>
            {decision.bodyHtml && (
              <div className="pt-2">
                <MarkdownContent html={decision.bodyHtml} />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Wire into project page**

Modify `src/app/(public)/work/[slug]/page.tsx` — add imports and new section after `<MilestoneTimeline>`:

Add imports at top:
```typescript
import { getPublishedPublicArchitectureDecisions } from "@/features/architecture-decisions/queries";
import { ArchitectureDecisionList } from "@/features/architecture-decisions/architecture-decision-list";
```

Add after `<MilestoneTimeline milestones={milestones} />`:
```typescript
      {/* Architecture decision evidence */}
      <ArchitectureDecisionList
        decisions={await getPublishedPublicArchitectureDecisions(project.id)}
      />
```

- [ ] **Step 7: Add seed data**

In `prisma/seed.ts`, add after the milestones seeding block (before the private room section):

```typescript
  // --- Architecture Decisions for Car Marketplace ---
  await prisma.architectureDecision.deleteMany({
    where: { projectId: carMarketplace.id },
  });

  const archDecisions = [
    {
      projectId: carMarketplace.id,
      title: "Mobile-first with Flutter",
      summary:
        "Flutter for cross-platform mobile (iOS/Android) with GetX state management, rather than maintaining two native codebases.",
      body: `## Decision

Building separate native iOS and Android apps would double the mobile engineering surface. Flutter provides a single Dart codebase with platform-native rendering, a rich widget system, and a strong ecosystem for the features we need (camera, media, push notifications, real-time messaging).

## Alternatives Considered

- **React Native**: Strong ecosystem but bridge overhead and inconsistent UI across platforms were concerns for a media-heavy app.
- **Native (Swift/Kotlin)**: Best platform integration but would require two teams or significantly slower delivery for a small team.

## Consequences

- Single mobile codebase with shared business logic
- GetX for state management, routing, and dependency injection
- Platform channels for any native API not covered by plugins`,
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 0,
      decidedAt: new Date("2024-06-15"),
    },
    {
      projectId: carMarketplace.id,
      title: "Offline Docker deployment",
      summary:
        "Multi-stage Dockerfile that builds on an internet-connected machine, then produces a self-contained image for transfer to an offline Ubuntu server.",
      body: `## Decision

The production server has no internet access. We use a multi-stage Docker build: the first stage installs all dependencies and builds the application on a connected machine, then the second stage copies only the production artifacts into a minimal image that can be transferred offline.`,
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 1,
      decidedAt: new Date("2024-07-01"),
    },
    {
      projectId: carMarketplace.id,
      title: "Specification pattern for search queries",
      summary:
        "Encapsulate each search filter as a composable specification object, making the search/filter API testable without raw SQL scattered through controllers.",
      body: `## Decision

The marketplace needs complex filtering: make, model, year range, price range, location, body type, fuel type, transmission, and more. Rather than building query strings dynamically in controllers, each filter is a specification object that composes into a Sequelize query.`,
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 2,
      decidedAt: new Date("2024-08-01"),
    },
  ];

  await prisma.architectureDecision.createMany({
    data: archDecisions,
  });
  console.log(`Seeded ${archDecisions.length} architecture decisions for Car Marketplace`);
```

- [ ] **Step 8: Run tests**

Run: `pnpm vitest run`
Expected: All tests pass.

- [ ] **Step 9: Commit**

```bash
git add prisma/schema.prisma src/features/architecture-decisions/ src/app/\(public\)/work/\[slug\]/page.tsx prisma/seed.ts
git commit -m "feat(#33): add ArchitectureDecision model with public queries, display, and seed data

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: Pipeline Evidence — Model, Feature, Seed, and Wiring (Agent 2)

**Branch:** `feat/34-pipeline-evidence`

**Files:**
- Create: `src/features/pipeline-evidence/queries.ts`
- Create: `src/features/pipeline-evidence/pipeline-evidence-list.tsx`
- Create: `src/features/pipeline-evidence/queries.test.ts`
- Modify: `prisma/schema.prisma`
- Modify: `src/app/(public)/work/[slug]/page.tsx`
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Add PipelineEvidence model to Prisma schema**

Append to end of `prisma/schema.prisma`:

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

- [ ] **Step 2: Push schema and regenerate client**

Run: `pnpm prisma db push && pnpm prisma generate`

- [ ] **Step 3: Write queries**

Write `src/features/pipeline-evidence/queries.ts`:

```typescript
import { prisma } from "@/lib/db/prisma";
import { buildVisibilityFilter } from "@/lib/publication/policy";

export type PublicPipelineEvidence = Awaited<
  ReturnType<typeof getPublishedPublicPipelineEvidence>
>[number];

export async function getPublishedPublicPipelineEvidence(projectId: string) {
  return prisma.pipelineEvidence.findMany({
    where: {
      projectId,
      ...buildVisibilityFilter("public"),
    },
    orderBy: { recordedAt: "desc" },
  });
}
```

- [ ] **Step 4: Write the test**

Write `src/features/pipeline-evidence/queries.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { buildVisibilityFilter } from "@/lib/publication/policy";
import { ContentStatus, ContentVisibility } from "@prisma/client";

describe("buildVisibilityFilter for pipeline evidence", () => {
  it("filters to published + public for the public surface", () => {
    const filter = buildVisibilityFilter("public");
    expect(filter).toEqual({
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    });
  });
});
```

Run: `pnpm vitest run src/features/pipeline-evidence/queries.test.ts`
Expected: PASS.

- [ ] **Step 5: Write display component**

Write `src/features/pipeline-evidence/pipeline-evidence-list.tsx`:

```typescript
import { PublicPipelineEvidence } from "./queries";
import { getStatusConfig, Status } from "@/design/statuses";

const CATEGORY_LABELS: Record<string, string> = {
  testing: "Testing",
  docker: "Docker",
  ci: "CI/CD",
  deployment: "Deployment",
  general: "General",
};

interface PipelineEvidenceListProps {
  evidence: PublicPipelineEvidence[];
}

export function PipelineEvidenceList({ evidence }: PipelineEvidenceListProps) {
  if (evidence.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border pt-8">
      <h2 className="font-serif text-2xl tracking-tight text-foreground">
        Pipeline Evidence
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {evidence.map((item) => {
          const statusConfig = getStatusConfig(Status.VERIFIED);

          return (
            <div
              key={item.id}
              className="rounded-lg border border-border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm text-card-foreground">
                  {item.label}
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.badgeClass}`}
                >
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </span>
              </div>

              {item.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <time dateTime={item.recordedAt.toISOString()}>
                  {new Date(item.recordedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Wire into project page**

Modify `src/app/(public)/work/[slug]/page.tsx` — add imports and new section after `<ArchitectureDecisionList>`:

Add imports at top:
```typescript
import { getPublishedPublicPipelineEvidence } from "@/features/pipeline-evidence/queries";
import { PipelineEvidenceList } from "@/features/pipeline-evidence/pipeline-evidence-list";
```

Add after `<ArchitectureDecisionList>`:
```typescript
      {/* Pipeline evidence */}
      <PipelineEvidenceList
        evidence={await getPublishedPublicPipelineEvidence(project.id)}
      />
```

- [ ] **Step 7: Add seed data**

In `prisma/seed.ts`, add after the architecture decisions seeding block:

```typescript
  // --- Pipeline Evidence for Car Marketplace ---
  await prisma.pipelineEvidence.deleteMany({
    where: { projectId: carMarketplace.id },
  });

  const pipelineEvidence = [
    {
      projectId: carMarketplace.id,
      label: "Docker build passes",
      description:
        "Multi-stage Dockerfile builds successfully with production optimizations — image size reduced to 180MB.",
      category: "docker",
      url: null,
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      recordedAt: new Date("2025-01-15"),
    },
    {
      projectId: carMarketplace.id,
      label: "Backend unit tests — 200+ cases passing",
      description:
        "NestJS service layer, controller, and utility tests pass consistently. Coverage includes auth, post search, chat, and media processing.",
      category: "testing",
      url: null,
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      recordedAt: new Date("2025-02-01"),
    },
    {
      projectId: carMarketplace.id,
      label: "CI pipeline configured — GitHub Actions",
      description:
        "Lint, typecheck, unit tests, and build steps run on every PR. Main branch is protected.",
      category: "ci",
      url: null,
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      recordedAt: new Date("2025-02-10"),
    },
  ];

  await prisma.pipelineEvidence.createMany({
    data: pipelineEvidence,
  });
  console.log(`Seeded ${pipelineEvidence.length} pipeline evidence records for Car Marketplace`);
```

- [ ] **Step 8: Run tests**

Run: `pnpm vitest run`
Expected: All tests pass.

- [ ] **Step 9: Commit**

```bash
git add prisma/schema.prisma src/features/pipeline-evidence/ src/app/\(public\)/work/\[slug\]/page.tsx prisma/seed.ts
git commit -m "feat(#34): add PipelineEvidence model with public queries, display, and seed data

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: Build Log Entries — Model, Feature, Seed, and Wiring (Agent 3)

**Branch:** `feat/31-build-log-entries`

**Files:**
- Create: `src/features/build-logs/queries.ts`
- Create: `src/features/build-logs/build-log-list.tsx`
- Create: `src/features/build-logs/queries.test.ts`
- Modify: `prisma/schema.prisma`
- Modify: `src/app/(public)/build-log/page.tsx`
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Add BuildLogEntry model to Prisma schema**

Append to end of `prisma/schema.prisma`:

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

- [ ] **Step 2: Push schema and regenerate client**

Run: `pnpm prisma db push && pnpm prisma generate`

- [ ] **Step 3: Write queries**

Write `src/features/build-logs/queries.ts`:

```typescript
import { prisma } from "@/lib/db/prisma";
import { buildVisibilityFilter } from "@/lib/publication/policy";

export type PublicBuildLogEntry = Awaited<
  ReturnType<typeof getPublishedPublicBuildLogEntries>
>[number];

export async function getPublishedPublicBuildLogEntries() {
  return prisma.buildLogEntry.findMany({
    where: buildVisibilityFilter("public"),
    orderBy: { occurredAt: "desc" },
    include: {
      project: {
        select: { id: true, slug: true, title: true },
      },
    },
  });
}
```

- [ ] **Step 4: Write the test**

Write `src/features/build-logs/queries.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { buildVisibilityFilter } from "@/lib/publication/policy";
import { ContentStatus, ContentVisibility } from "@prisma/client";

describe("buildVisibilityFilter for build log entries", () => {
  it("filters to published + public for the public surface", () => {
    const filter = buildVisibilityFilter("public");
    expect(filter).toEqual({
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    });
  });
});
```

Run: `pnpm vitest run src/features/build-logs/queries.test.ts`
Expected: PASS.

- [ ] **Step 5: Write display component**

Write `src/features/build-logs/build-log-list.tsx`:

```typescript
import Link from "next/link";
import { PublicBuildLogEntry } from "./queries";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { renderMarkdown } from "@/lib/markdown/renderer";

interface BuildLogListProps {
  entries: PublicBuildLogEntry[];
}

export async function BuildLogList({ entries }: BuildLogListProps) {
  if (entries.length === 0) {
    return (
      <section className="rounded-lg border border-border bg-card p-8 space-y-4">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            No updates yet
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Build log entries will appear here as development progresses.
            Check back for milestone completions and pipeline evidence.
          </p>
        </div>
      </section>
    );
  }

  const rendered = await Promise.all(
    entries.map(async (entry) => ({
      ...entry,
      bodyHtml: entry.body ? await renderMarkdown(entry.body) : null,
    }))
  );

  return (
    <div className="space-y-4">
      {rendered.map((entry) => (
        <article
          key={entry.id}
          className="rounded-lg border border-border bg-card p-6 space-y-3"
        >
          <header className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={entry.occurredAt.toISOString()}>
                {new Date(entry.occurredAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden="true">·</span>
              <Link
                href={`/work/${entry.project.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {entry.project.title}
              </Link>
            </div>
            <h3 className="font-serif text-xl tracking-tight text-card-foreground">
              {entry.title}
            </h3>
          </header>
          {entry.bodyHtml && (
            <MarkdownContent html={entry.bodyHtml} />
          )}
        </article>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Wire into Build Log page**

Modify `src/app/(public)/build-log/page.tsx` — replace the static "Ready for updates" section with live data.

Replace the existing `EXPECTED_UPDATES` constant and the "What to expect" grid section. Keep the page header. Replace the static state section with:

```typescript
import { getPublishedPublicBuildLogEntries } from "@/features/build-logs/queries";
import { BuildLogList } from "@/features/build-logs/build-log-list";
```

And replace the JSX after the header paragraph with:

```typescript
      <BuildLogList entries={await getPublishedPublicBuildLogEntries()} />
```

Remove the `EXPECTED_UPDATES` constant and the "What to expect" section entirely.

- [ ] **Step 7: Add seed data**

In `prisma/seed.ts`, add after pipeline evidence seeding block. Need to reference the portfolio project (already seeded earlier):

```typescript
  // --- Build Log Entries ---
  await prisma.buildLogEntry.deleteMany({});

  const buildLogEntries = [
    {
      projectId: portfolio.id,
      title: "Project scaffold and design tokens landed",
      body: "Next.js 16 App Router scaffold with TypeScript strict mode. Tailwind CSS and shadcn/ui configured. Semantic status tokens and design vocabulary established across the codebase.",
      occurredAt: new Date("2026-05-01"),
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    },
    {
      projectId: carMarketplace.id,
      title: "Car marketplace project page with case study body",
      body: "Project page renders published project data with outcome-first layout. Safe Markdown module renders the case study body. Milestone timeline shows published milestones with active/completed status.",
      occurredAt: new Date("2026-05-05"),
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    },
    {
      projectId: portfolio.id,
      title: "Auth.js owner login and admin route protection",
      body: "GitHub OAuth configured for owner-only admin access. Server-side auth guard protects all `/admin` routes. Login page with sign-in button and error handling.",
      occurredAt: new Date("2026-05-08"),
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    },
  ];

  await prisma.buildLogEntry.createMany({
    data: buildLogEntries,
  });
  console.log(`Seeded ${buildLogEntries.length} build log entries`);
```

- [ ] **Step 8: Run tests**

Run: `pnpm vitest run`
Expected: All tests pass.

- [ ] **Step 9: Commit**

```bash
git add prisma/schema.prisma src/features/build-logs/ src/app/\(public\)/build-log/page.tsx prisma/seed.ts
git commit -m "feat(#31): add BuildLogEntry model with public queries, display, and seed data

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: Admin Evidence Editing Pages (Agent 4)

**Branch:** `feat/35-admin-evidence-editing`

**Files:**
- Create: `src/app/admin/architecture-decisions/page.tsx`
- Create: `src/app/admin/pipeline-evidence/page.tsx`
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: Create admin architecture decisions page**

Write `src/app/admin/architecture-decisions/page.tsx`:

```typescript
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, ContentVisibility } from "@prisma/client";

export const metadata = {
  title: "Architecture Decisions — Admin",
};

async function createDecision(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const body = formData.get("body") as string;
  const projectId = formData.get("projectId") as string;
  const status = formData.get("status") as ContentStatus;
  const visibility = formData.get("visibility") as ContentVisibility;
  const decidedAt = formData.get("decidedAt") as string;

  if (!title || !summary || !projectId) return;

  await prisma.architectureDecision.create({
    data: {
      title,
      summary,
      body: body || null,
      projectId,
      status,
      visibility,
      order: 0,
      decidedAt: decidedAt ? new Date(decidedAt) : null,
    },
  });

  revalidatePath("/admin/architecture-decisions");
}

async function updateDecision(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const body = formData.get("body") as string;
  const status = formData.get("status") as ContentStatus;
  const visibility = formData.get("visibility") as ContentVisibility;
  const decidedAt = formData.get("decidedAt") as string;

  if (!id || !title || !summary) return;

  await prisma.architectureDecision.update({
    where: { id },
    data: {
      title,
      summary,
      body: body || null,
      status,
      visibility,
      decidedAt: decidedAt ? new Date(decidedAt) : null,
    },
  });

  revalidatePath("/admin/architecture-decisions");
}

export default async function AdminArchitectureDecisionsPage() {
  const decisions = await prisma.architectureDecision.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: { select: { id: true, title: true } } },
  });

  const projects = await prisma.project.findMany({
    select: { id: true, title: true },
  });

  return (
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Architecture Decisions</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage architecture decision records. Published + public
          records appear on project pages.
        </p>
      </header>

      {/* Create Form */}
      <section className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="font-serif text-xl tracking-tight">New Decision</h2>
        <form action={createDecision} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <select
              name="projectId"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Select project...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="title"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <input
              name="summary"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Body (Markdown)</label>
            <textarea
              name="body"
              rows={4}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                defaultValue={ContentStatus.published}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Visibility</label>
              <select
                name="visibility"
                defaultValue={ContentVisibility.public}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="public">Public</option>
                <option value="privateRoom">Private Room</option>
                <option value="adminOnly">Admin Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Decided At</label>
              <input
                type="date"
                name="decidedAt"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create Decision
          </button>
        </form>
      </section>

      {/* Existing Records */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl tracking-tight">
          All Records ({decisions.length})
        </h2>
        {decisions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No architecture decisions yet.
          </p>
        ) : (
          decisions.map((d) => (
            <details
              key={d.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <summary className="cursor-pointer font-medium text-sm flex items-center gap-2">
                {d.title}
                <span className="text-xs text-muted-foreground">
                  ({d.project.title})
                </span>
                <span className="ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-status-neutral text-status-neutral-foreground">
                  {d.status}
                </span>
              </summary>
              <form action={updateDecision} className="mt-4 space-y-4">
                <input type="hidden" name="id" value={d.id} />
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    name="title"
                    defaultValue={d.title}
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Summary</label>
                  <input
                    name="summary"
                    defaultValue={d.summary}
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Body</label>
                  <textarea
                    name="body"
                    defaultValue={d.body ?? ""}
                    rows={4}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      name="status"
                      defaultValue={d.status}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Visibility</label>
                    <select
                      name="visibility"
                      defaultValue={d.visibility}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="public">Public</option>
                      <option value="privateRoom">Private Room</option>
                      <option value="adminOnly">Admin Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Decided At</label>
                    <input
                      type="date"
                      name="decidedAt"
                      defaultValue={
                        d.decidedAt
                          ? new Date(d.decidedAt).toISOString().split("T")[0]
                          : ""
                      }
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </form>
            </details>
          ))
        )}
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Create admin pipeline evidence page**

Write `src/app/admin/pipeline-evidence/page.tsx`:

```typescript
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, ContentVisibility } from "@prisma/client";

export const metadata = {
  title: "Pipeline Evidence — Admin",
};

async function createEvidence(formData: FormData) {
  "use server";

  const projectId = formData.get("projectId") as string;
  const label = formData.get("label") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const url = formData.get("url") as string;
  const status = formData.get("status") as ContentStatus;
  const visibility = formData.get("visibility") as ContentVisibility;
  const recordedAt = formData.get("recordedAt") as string;

  if (!projectId || !label) return;

  await prisma.pipelineEvidence.create({
    data: {
      projectId,
      label,
      description: description || null,
      category: category || "general",
      url: url || null,
      status,
      visibility,
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
    },
  });

  revalidatePath("/admin/pipeline-evidence");
}

async function updateEvidence(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const label = formData.get("label") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const url = formData.get("url") as string;
  const status = formData.get("status") as ContentStatus;
  const visibility = formData.get("visibility") as ContentVisibility;
  const recordedAt = formData.get("recordedAt") as string;

  if (!id || !label) return;

  await prisma.pipelineEvidence.update({
    where: { id },
    data: {
      label,
      description: description || null,
      category: category || "general",
      url: url || null,
      status,
      visibility,
      recordedAt: recordedAt ? new Date(recordedAt) : undefined,
    },
  });

  revalidatePath("/admin/pipeline-evidence");
}

export default async function AdminPipelineEvidencePage() {
  const evidence = await prisma.pipelineEvidence.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: { select: { id: true, title: true } } },
  });

  const projects = await prisma.project.findMany({
    select: { id: true, title: true },
  });

  return (
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Pipeline Evidence</h1>
        <p className="text-sm text-muted-foreground">
          Curate CI/CD, testing, Docker, and deployment evidence. Published +
          public records appear on project pages.
        </p>
      </header>

      {/* Create Form */}
      <section className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="font-serif text-xl tracking-tight">New Evidence</h2>
        <form action={createEvidence} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <select
              name="projectId"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Select project...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <input
              name="label"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows={2}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL (optional)</label>
            <input
              name="url"
              type="url"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                defaultValue="general"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="testing">Testing</option>
                <option value="docker">Docker</option>
                <option value="ci">CI/CD</option>
                <option value="deployment">Deployment</option>
                <option value="general">General</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                defaultValue={ContentStatus.published}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Visibility</label>
              <select
                name="visibility"
                defaultValue={ContentVisibility.public}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="public">Public</option>
                <option value="privateRoom">Private Room</option>
                <option value="adminOnly">Admin Only</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Recorded At</label>
            <input
              type="date"
              name="recordedAt"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Add Evidence
          </button>
        </form>
      </section>

      {/* Existing Records */}
      <section className="space-y-3">
        <h2 className="font-serif text-xl tracking-tight">
          All Records ({evidence.length})
        </h2>
        {evidence.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pipeline evidence yet.
          </p>
        ) : (
          evidence.map((e) => (
            <details
              key={e.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <summary className="cursor-pointer font-medium text-sm flex items-center gap-2">
                {e.label}
                <span className="text-xs text-muted-foreground">
                  ({e.project.title} · {e.category})
                </span>
                <span className="ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-status-neutral text-status-neutral-foreground">
                  {e.status}
                </span>
              </summary>
              <form action={updateEvidence} className="mt-4 space-y-4">
                <input type="hidden" name="id" value={e.id} />
                <div>
                  <label className="block text-sm font-medium mb-1">Label</label>
                  <input
                    name="label"
                    defaultValue={e.label}
                    required
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={e.description ?? ""}
                    rows={2}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <input
                    name="url"
                    type="url"
                    defaultValue={e.url ?? ""}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      name="category"
                      defaultValue={e.category}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="testing">Testing</option>
                      <option value="docker">Docker</option>
                      <option value="ci">CI/CD</option>
                      <option value="deployment">Deployment</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      name="status"
                      defaultValue={e.status}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Visibility</label>
                    <select
                      name="visibility"
                      defaultValue={e.visibility}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="public">Public</option>
                      <option value="privateRoom">Private Room</option>
                      <option value="adminOnly">Admin Only</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Recorded At</label>
                  <input
                    type="date"
                    name="recordedAt"
                    defaultValue={
                      e.recordedAt
                        ? new Date(e.recordedAt).toISOString().split("T")[0]
                        : ""
                    }
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </form>
            </details>
          ))
        )}
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Update admin dashboard with navigation links**

Modify `src/app/admin/page.tsx`:

```typescript
import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage portfolio content and evidence.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/architecture-decisions"
          className="rounded-lg border border-border bg-card p-4 hover:bg-accent/40 transition-colors"
        >
          <h2 className="font-serif text-lg tracking-tight">
            Architecture Decisions
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Create and edit architecture decision records.
          </p>
        </Link>
        <Link
          href="/admin/pipeline-evidence"
          className="rounded-lg border border-border bg-card p-4 hover:bg-accent/40 transition-colors"
        >
          <h2 className="font-serif text-lg tracking-tight">
            Pipeline Evidence
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Curate CI/CD, testing, and deployment evidence.
          </p>
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify admin pages are auth-gated**

The `src/app/admin/layout.tsx` already calls `requireAdmin()`, so all routes under `/admin/*` are protected automatically. No additional gate needed.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/
git commit -m "feat(#35): add admin CRUD pages for architecture decisions and pipeline evidence

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: Merge and Verify

After all four agents complete, run the merge on main.

- [ ] **Step 1: Merge Agent 1**

```bash
git merge feat/33-architecture-decision-evidence
```

Expected: Clean or minor conflict in `prisma/schema.prisma` (additive). Accept both additions.

- [ ] **Step 2: Merge Agent 2**

```bash
git merge feat/34-pipeline-evidence
```

Expected: Conflict in `prisma/schema.prisma` (two model additions at the same location), `prisma/seed.ts` (both appending to seed), and `src/app/(public)/work/[slug]/page.tsx` (both adding sections). Resolve by keeping all additions.

- [ ] **Step 3: Merge Agent 3**

```bash
git merge feat/31-build-log-entries
```

Expected: Conflict in `prisma/schema.prisma` (additive) and `prisma/seed.ts` (additive). Resolve by keeping all additions.

- [ ] **Step 4: Merge Agent 4**

```bash
git merge feat/35-admin-evidence-editing
```

Expected: Conflict only in `src/app/admin/page.tsx` (Agent 4 replaces the placeholder content). Accept Agent 4's version.

- [ ] **Step 5: Regenerate Prisma client and push schema**

```bash
pnpm prisma db push
pnpm prisma generate
```

- [ ] **Step 6: Run seed**

```bash
pnpm tsx prisma/seed.ts
```

Expected: Seeds all new data without errors.

- [ ] **Step 7: Run full test suite**

```bash
pnpm vitest run
```

Expected: All tests pass.

- [ ] **Step 8: Run typecheck**

```bash
pnpm tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 9: Commit merge**

```bash
git add -A
git commit -m "merge: admin editing slices — ArchitectureDecision, PipelineEvidence, BuildLogEntry

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 6: Cleanup

- [ ] **Step 1: Delete worktree branches (keep only main)**

```bash
git branch -D feat/33-architecture-decision-evidence
git branch -D feat/34-pipeline-evidence
git branch -D feat/31-build-log-entries
git branch -D feat/35-admin-evidence-editing
```

- [ ] **Step 2: Remove worktree directories**

Remove any `.claude/worktrees/` entries from this session.

- [ ] **Step 3: Delete plan and spec files**

```bash
rm docs/superpowers/specs/2026-05-11-admin-editing-slices-design.md
rm docs/superpowers/plans/2026-05-11-admin-editing-slices-plan.md
```

Also remove any other plan/spec files in `docs/superpowers/` and the `plans/` directory if they exist:

```bash
rm -rf docs/superpowers/specs/ docs/superpowers/plans/ plans/
```

- [ ] **Step 4: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove implementation plans and specs after merge"
```
