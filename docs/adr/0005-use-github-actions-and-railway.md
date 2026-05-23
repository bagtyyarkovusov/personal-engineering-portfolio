# ADR 0005: Use GitHub Actions And Railway

## Status

Accepted

## Context

The portfolio must prove engineering discipline through testing, Dockerization, CI/CD, and deployment evidence. Railway is the preferred deployment platform.

## Decision

Use GitHub Actions as the CI quality gate and Railway as the deployment platform.

## Alternatives Considered

- Railway-only deployment checks
- Vercel deployment
- manual deployment
- self-managed infrastructure

## Consequences

GitHub Actions provides visible evidence for typechecking, tests, builds, and smoke checks.

Railway handles deployment and runtime hosting.

The public portfolio can later display curated pipeline evidence snapshots from this workflow.
