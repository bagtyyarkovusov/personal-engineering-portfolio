# Product Context

## Product

This project is a personal-led, agency-ready engineering portfolio for Bagtyyar. It must establish trust with technical hiring managers, senior engineers, recruiters, and potential clients.

## Positioning

The portfolio should communicate:

> Unusually disciplined software engineering for products that need to survive production.

The public brand is personal-led. The underlying structure is agency-ready so the project can grow into client rooms, dashboards, approvals, team workflows, and managed delivery operations later.

## Core Offer

Full-stack and mobile product engineering from architecture to deployment.

The differentiator is not only feature delivery. The differentiator is a repeatable engineering delivery system:

- testing
- Dockerized environments
- CI/CD
- maintainable architecture
- architecture decision records
- transparent milestone reporting
- private read-only client visibility

## Homepage Direction

The homepage is the first trust surface. It should prove credibility within the first 10 seconds.

Lead with this trust claim:

> Production-minded software engineering, built to stay maintainable after launch.

Supporting line:

> I build full-stack and mobile products with tests, Dockerized environments, CI/CD, architecture decisions, and transparent delivery.

The first screen should feel like an asymmetric editorial command center:

- trust claim anchored left or top-left
- proof strip visible immediately
- Three.js system map as the dominant interactive object
- `Work With Me` and `Review My Engineering System` CTAs close to the trust claim
- visible hint of the next section below the fold
- no centered generic hero
- no marketing-style split hero card
- no stats-heavy hero metric block

Homepage proof strip:

- Tests
- Docker
- CI/CD
- Architecture
- Milestones

Primary CTA: `Work With Me`.

Technical CTA: `Review My Engineering System`.

## About Page Direction

The About page should primarily answer how Bagtyyar works. It is not a long biography.

Maintainability matters because Bagtyyar has seen projects become expensive and fragile when handoff is poor, core project quality is ignored, and clients are left frustrated by developers who only patch symptoms.

The About page should communicate:

- how Bagtyyar works
- why maintainability matters
- why tests, Docker, and CI/CD are used even on solo projects
- what clients and teams can expect
- how the personal-led, agency-ready model works
- what types of projects are the best fit

Trust promise:

- reliability
- transparency
- maintainable systems
- delivery discipline
- codebases another engineer can continue

Collaborator model:

> Bagtyyar leads the work personally. When a project needs more capacity or a specialized skill, trusted collaborators can join while Bagtyyar stays accountable for the engineering standard.

Best-fit work:

- teamwork and collaborative product projects
- personal businesses and new business ideas
- SaaS and B2B business applications
- mobile and web applications
- transport applications
- cargo tracking workflows
- export-regulation-adjacent workflows
- AI integration into existing systems
- local AI deployment

Avoid:

- generic "passionate developer" wording
- long life story
- vague tech-stack lists
- pretending to be a mature agency before that exists

## HITL Product Review Gates

Human-in-the-loop product review is required for homepage positioning and About page positioning.

For those issues, agents must produce a compact shape brief before implementation:

- purpose
- primary user
- content
- feeling
- constraints
- review artifact
- approval question

The human reviewer should answer with one of:

- `approved`
- `revise`
- `blocked`

Agents may not treat product copy or public positioning as approved until the human explicitly approves it.

## MVP Definition

Done means a visitor can trust Bagtyyar, and the system proves itself end to end.

The tracer-bullet MVP should include:

- public homepage with a Three.js production pipeline map
- car marketplace project page
- engineering system page
- protected admin route
- project and milestone editing from admin
- private signed project room for read-only client visibility
- invalid/revoked private room protection
- GitHub Actions quality gate
- Railway deployment path
- basic automated tests for public, admin guard, and private room flows

## Public Navigation

- Work
- Engineering System
- Build Log
- About
- Work With Me

## Private Rooms

Private rooms are read-only client-facing project spaces. They use signed links in v1, not client accounts.

Private rooms show curated updates by default, with optional technical evidence toggles.

Private-room sections:

- Status
- Milestones
- Updates
- Architecture
- Evidence
- Next Steps

## V1 Non-Goals

- no analytics dashboard
- no automation layer
- no comments
- no file uploads
- no client accounts
- no billing
- no multi-tenant agency roles
- no full project management clone

## Localization

The MVP is English-only.

Localization is a future product capability, not part of the first implementation issues. The likely future locales are Turkish and Russian.

English-first is intentional for v1 because the first trust surface must be polished, complete, and easy to review. Half-finished localization would weaken trust.

Future localization should support:

- localized public portfolio pages
- localized project/case-study content
- localized private-room client-facing copy where needed
- locale-aware SEO metadata
- clear fallback behavior when a translation is missing

Do not add localization work to the MVP implementation issues unless the project scope is explicitly reopened.
