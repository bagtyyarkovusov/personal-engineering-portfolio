# Plan: Issue #17 — Render Car Marketplace Active Case Study Page

## Context

The `/work/[slug]` route already resolves projects from the database via `getPublishedPublicProjectBySlug`. The seed data includes the `car-marketplace` project with a body, stack, and outcome. This issue turns the generic project page into an honest active case-study layout.

## Acceptance Criteria Checklist

- [x] Project detail route resolves the car marketplace slug from database data.
- [x] Page shows product outcome first and engineering proof immediately after.
- [x] Page marks the project as an active build rather than a finished product.
- [x] Missing or unpublished projects return a safe not-found state.

## Implementation Steps

### 1. Verify baseline behavior

Confirm the existing route already resolves `car-marketplace` from seed data and returns `notFound()` for missing/unpublished slugs. No changes needed for the fourth criterion — it already works.

### 2. Add active-build status indicator

The car marketplace seed has `completedAt: null` and `status: published`. This signals an active build.

- Add an `isActiveBuild` helper or inline check: `project.completedAt == null`.
- Render a visible "Active build" badge/tag near the project title.
- Use the design-system status tokens: `In Progress` color (restrained blue-teal) from `src/design/statuses.ts`.
- Do not imply the project is finished.

### 3. Reorder content: outcome first, engineering proof after

Current layout shows body (engineering decisions) before outcome. Reverse this:

1. Title + active-build badge + summary
2. Stack tags
3. **Outcome section** — `project.outcome`, rendered as plain text (not Markdown)
4. **Engineering proof section** — `project.body`, rendered through the safe Markdown pipeline (`renderMarkdown` + `MarkdownContent`)
5. Honest status note: if `completedAt` is null, add a small line explaining the project is actively being built or iterated.

### 4. Refine case-study typography and spacing

- Keep the editorial `font-serif` for the title.
- Use `max-w-3xl` container, consistent with other public pages.
- Separate major sections with `border-t border-border pt-8`.
- Ensure stack tags use the existing pill style.
- Avoid cards-inside-cards; use spacing and dividers.

### 5. Add a behavior-focused test

Add or extend a test in `src/features/projects/queries.test.ts` or create a lightweight page-level integration check that:

- Asserts `getPublishedPublicProjectBySlug('car-marketplace')` returns the seeded project.
- Asserts unpublished/draft projects are not returned publicly (already covered by publication policy tests, but verify no regression).

### 6. Run verification

- `pnpm dev` — navigate to `/work/car-marketplace`, confirm layout, badge, and content order.
- `pnpm test` — all existing tests pass.
- `pnpm typecheck` — no regressions.

## Out of Scope

- Milestone timeline (that is #28).
- Pipeline evidence slices (those are #33–#35).
- Three.js project nodes (that is #48–#50).
- Admin editing (those are #27, #29–#31).

## Unblocks

- #28: Add Milestone Schema With Seeded Public Timeline
