# Documentation lookups

Check current official documentation before adding or changing an external dependency,
service integration, platform API or deployment assumption.
Internal behavior comes from repository evidence, as [domain guidance](domain.md) explains.

## Procedure

1. Find the installed version in the lockfile/config, or the proposed target version.
2. Read version-matched official docs, installed types and release notes.
   For hosted services, check current documentation and the relevant changelog.
3. For upgrades, check migration notes, engines, peer compatibility and platform constraints.
4. Verify the exact API with typecheck, focused tests or a safe runtime check.

Use search to find official sources; summaries, blogs and forum answers are leads.
Prefer versioned docs or the provider's `llms.txt` when available.
Do not use a remembered API shape as proof of compatibility.

## Record

In the PR proof, name the version, official URL and what the lookup established.
For upgrades, include compatibility checks and migration requirements.
Say `not applicable` for an internal-only change.
If docs disagree with installed types/runtime, report the discrepancy and resolve it
before relying on the behavior. Avoid adding an integration on an unverified assumption.
