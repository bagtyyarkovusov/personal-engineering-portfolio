# Personal Engineering Portfolio

Bagtyyar's public portfolio and owner-only admin. It shows shipped work and how
it was built, so clients can judge whether to hire him. Terms are seeded from
`docs/context/architecture/CONTEXT.md` and `docs/context/product/CONTEXT.md`.

## Content

**Project**:
One piece of work shown on the site, with its own public page.
_Avoid_: Portfolio item, app

**Case study**:
The public page of a published Project: its context, role, decisions and proof.
_Avoid_: Project detail, write-up

**Milestone**:
A dated step in a Project's delivery.
_Avoid_: Phase, update

**Build Log entry**:
A short dated note about development progress, shown on the Build Log.
_Avoid_: Changelog, blog post

**Architecture decision**:
A recorded technical choice shown as part of a Project's content. Repository
ADRs in `docs/adr/` are a different thing.
_Avoid_: Decision log

**Pipeline evidence**:
A snapshot of CI and deploy results that the owner records as public proof.
_Avoid_: Build status

**Engineering System**:
The public page that explains how Bagtyyar plans, builds, tests and ships work.
_Avoid_: Process page

## Publishing

**Status**:
Where content is in its lifecycle: draft, published or archived.
_Avoid_: State

**Visibility**:
Who may see content: public, privateRoom or adminOnly. Visibility is separate
from Status.
_Avoid_: Access level

## Access

**Owner**:
Bagtyyar, the only person who can sign in to admin.
_Avoid_: Admin user, account

**Private room**:
A read-only client-facing view of a Project, opened with a signed link.
_Avoid_: Client portal, workspace

**Access token**:
The revocable secret in a Private room link.
_Avoid_: Password, invite code
