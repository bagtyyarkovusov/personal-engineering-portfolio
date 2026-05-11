# Admin + Auth Sprint Plan

**Date:** 2026-05-11
**Issues:** #22 (Auth.js), #23 (Admin protection), #36 (Private Room model)
**Parent:** #1 (PRD: Tracer-bullet MVP)

## Overview

Three parallel tasks establishing the admin identity layer, route protection, and private room data model. These are foundational for all subsequent content management and client visibility work.

## Task A: Auth.js Owner Login Shell (#22)

### Requirements
- Install and configure Auth.js v5 with GitHub OAuth provider
- Restrict sign-in to Bagtyyar's owner GitHub account only
- Create sign-in page at `/login` (or `/admin/login`)
- Create sign-out flow
- Validate required auth environment variables at boot (NEXTAUTH_SECRET, NEXTAUTH_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)
- Document auth setup in env example

### Acceptance Criteria
- [ ] Auth.js is configured with an owner login path
- [ ] Required auth environment variables are documented and validated
- [ ] Unauthenticated users can reach a login path without accessing admin content
- [ ] Human confirms provider/secrets strategy for the owner account

### Implementation Notes
- Use `next-auth` v5 (Next.js 16 compatible)
- Auth.js v5 uses `auth()`, `signIn()`, `signOut()` from `@/lib/auth` or similar
- File structure: `src/lib/auth/index.ts`, `src/lib/auth/config.ts`, `src/app/login/page.tsx`
- Read `.env.example` for existing auth variable placeholders
- Env validator at `src/lib/env/validator.ts` needs auth vars added

### Files to create/modify
- `src/lib/auth/config.ts` — Auth.js config with GitHub provider + owner allowlist
- `src/lib/auth/index.ts` — exports `auth`, `signIn`, `signOut`, `handlers`
- `src/app/api/auth/[...nextauth]/route.ts` — Auth.js API route handler
- `src/app/login/page.tsx` — sign-in page
- `src/lib/env/validator.ts` — add AUTH_* validation

## Task B: Protect Admin Routes Server-Side (#23)

### Requirements
- Create admin layout that checks authentication server-side
- Redirect unauthenticated users to login
- Prevent admin data from rendering to unauthenticated users
- Add a test covering blocked unauthenticated access

### Acceptance Criteria
- [ ] Unauthenticated access to admin pages is rejected or redirected
- [ ] Server-side admin mutations verify owner access before writing
- [ ] A smoke test or unit test covers blocked unauthenticated access
- [ ] No admin-only data is rendered to unauthenticated users

### Implementation Notes
- Depends on Task A providing the `auth()` function
- Build a guard/middleware that calls `auth()` and redirects if no session
- Use server-side checks (not just client-side)
- Admin layout at `src/app/admin/layout.tsx` should call auth check
- Test: verify unauthenticated request gets redirect/403

### Files to create/modify
- `src/app/admin/layout.tsx` — admin layout with auth guard
- `src/lib/auth/guard.ts` — reusable `requireAdmin()` helper
- `src/app/admin/page.tsx` — placeholder admin dashboard (redirect target)
- Tests for auth guard behavior (unit or integration)

## Task C: Private Room & Access Token Model (#36)

### Requirements
- Add PrivateRoom model to Prisma schema (linked to Project, section toggles)
- Add AccessToken model (token hash, revocation, optional expiry, linked to PrivateRoom)
- Generate migration
- Add seed data: one private room for the portfolio project with a valid token
- Token module: create, validate, revoke tokens using crypto

### Acceptance Criteria
- [ ] Schema supports a private room linked to a project
- [ ] Schema supports access token metadata and revocation state
- [ ] Room settings include section toggles for milestones, updates, architecture, evidence, and next steps
- [ ] No client-account or multi-tenant role system is introduced

### Implementation Notes
- PrivateRoom sections: showMilestones, showUpdates, showArchitecture, showEvidence, showNextSteps (boolean toggles)
- AccessToken: store hashed token (SHA-256), never plaintext
- Token generation: `crypto.randomBytes(32).toString('hex')`
- Follow existing Prisma patterns (ContentStatus, ContentVisibility enums)
- Seed: add PrivateRoom + AccessToken for the "personal-engineering-portfolio" project

### Files to create/modify
- `prisma/schema.prisma` — add PrivateRoom + AccessToken models
- `src/lib/access-tokens/index.ts` — token generation, validation, revocation
- `prisma/seed.ts` — add private room + token seed data
- Tests for token module
