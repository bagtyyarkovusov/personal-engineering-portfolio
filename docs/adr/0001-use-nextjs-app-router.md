# ADR 0001: Use Next.js App Router

## Status

Accepted

## Context

The portfolio needs public pages, private project rooms, owner-only admin routes, backend mutations, SEO-friendly case studies, and a maintainable path toward future agency-ready workflows.

## Decision

Use Next.js App Router as the application framework.

## Alternatives Considered

- Vite SPA with a separate backend
- Astro with API services
- Separate frontend and backend apps from day one

## Consequences

Next.js keeps public pages, admin routes, server actions, backend routes, and deployment in one coherent app for v1.

The project should keep routes thin and move business logic into feature modules so the app does not become route-file driven.
