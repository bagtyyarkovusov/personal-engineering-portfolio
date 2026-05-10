# Architecture Context

## Architecture Direction

Build portfolio first, platform-shaped underneath.

The app should feel personal and custom publicly, while the backend model supports future client rooms and agency operations without forcing SaaS complexity into v1.

## Stack

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui
- Three.js with React Three Fiber
- PostgreSQL
- Prisma
- Auth.js
- safe Markdown rendering
- Vitest
- Playwright
- Docker
- GitHub Actions
- Railway

TanStack Query is intentionally excluded from v1. Add it later only when the app needs richer client-side server-state behavior such as polling, optimistic updates, comments, approvals, realtime activity, or complex cached views.

## Code Organization

Use feature-first organization with thin routes.

Expected structure:

```txt
src/
  app/
    (public)/
    admin/
    rooms/[token]/
    api/
    globals.css
  features/
    projects/
    milestones/
    build-logs/
    architecture-decisions/
    pipeline-evidence/
    private-rooms/
    engineering-system/
  components/
    ui/
    layout/
    three/
  design/
    tokens.ts
    statuses.ts
  lib/
    auth/
    db/
    markdown/
    access-tokens/
    validations/
```

Routes should compose feature modules. Business logic should live in `features/*` or `lib/*`, not inside page files.

## Core Data Concepts

- Project
- CaseStudy
- Milestone
- BuildLogEntry
- ArchitectureDecision
- PipelineEvidence
- PrivateRoom
- AccessToken

Future agency-ready concepts:

- Client
- Organization
- TeamMember
- Role
- ClientAccount
- Approval
- Comment
- Invoice
- FileAsset
- Notification

Do not implement future agency concepts until there is a concrete product need.

## Content Status And Visibility

Status and visibility are separate concerns.

Status values:

- draft
- published
- archived

Visibility values:

- public
- privateRoom
- adminOnly

Examples:

- `published + public`: visible on the public site
- `published + privateRoom`: visible in valid client rooms
- `draft + privateRoom`: visible only in admin
- `archived + public`: preserved but hidden from public pages

## Access Model

Admin access uses owner-only authentication.

V1 admin authentication uses Auth.js with GitHub OAuth, restricted to Bagtyyar's owner account.

Auth rules:

- admin is owner-only
- no client accounts in v1
- no email/password auth in v1
- no password database in v1
- access checks must happen server-side
- owner allowlist must restrict access by GitHub identity or verified owner email
- local, CI, and production auth environment variables must be documented
- production secrets live in Railway, not in the repo

Private room access uses signed private links in v1:

- no client account required
- read-only
- revocable token
- optional expiration later
- invalid or revoked tokens must not expose project existence

## Localization Architecture Posture

The MVP ships in English only, but implementation should avoid decisions that make Turkish or Russian localization expensive later.

Do:

- keep user-facing copy close to page or feature boundaries
- avoid embedding display strings inside deep business logic
- keep content models structured enough to support translated variants later
- keep route and metadata design compatible with future locale-aware pages
- treat missing translations as a future fallback-policy decision

Do not:

- introduce locale-prefixed routing in v1
- add translation management in v1
- add locale fields to every model before a concrete localization workflow exists
- include localization in the MVP issue set
