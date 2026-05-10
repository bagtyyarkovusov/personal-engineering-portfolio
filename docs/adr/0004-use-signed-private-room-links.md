# ADR 0004: Use Signed Private Room Links

## Status

Accepted

## Context

The MVP needs read-only client visibility without building a full client account system. Clients should be able to view curated progress, milestones, architecture notes, and evidence with minimal friction.

## Decision

Use signed private links for v1 private rooms.

Private rooms are read-only, token-protected, and revocable from admin.

## Alternatives Considered

- full client accounts
- password-protected pages
- public hidden URLs
- no private rooms in v1

## Consequences

Signed links keep v1 simple and useful.

Server-side token validation is mandatory. Invalid, expired, or revoked tokens must fail without exposing project existence.

Later versions can add magic links, client accounts, comments, approvals, file uploads, and audit trails.
