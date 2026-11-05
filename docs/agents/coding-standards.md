# Coding standards

Apply this baseline to changed code and tests; review through
[the workflow](coding-workflow.md#review).
Existing debt does not justify new violations or an unrelated rewrite.

## Modules

A module has an interface and an implementation: function, class, screen or package.
Prefer small interfaces that hide substantial complexity: deep modules.
Before extracting, name what callers no longer need to know.
If deleting a wrapper merely moves code with no lost abstraction, keep it inline.
Use `codebase-design` to choose a seam when a real dependency varies.
Inject storage, time, randomness and transport at those boundaries.
Keep domain decisions separate from rendering, framework and persistence details.
Use the owning module's public interface instead of importing its internals.

## Types and errors

Validate untrusted input at boundaries; types alone do not validate runtime data.
Keep internal types precise and make invalid states difficult to represent.
Represent expected errors explicitly and preserve useful diagnostic context.
Distinguish retryable failures from terminal ones; never silently swallow a failure.
Keep secrets and personal data out of diagnostics.

## Tests

Test through public interfaces and assert caller-visible outcomes.
Mock or fake system boundaries, not the repository's own collaborating modules.
Use realistic adapters/fakes at seams; cover a changed contract's relevant callers.
Prefer literal expected results to recomputing the implementation in the assertion.
Name the behavior; include failure and recovery paths that matter to acceptance.
Delete obsolete tests when the interface they tested is removed.
A test that survives deleting the behavior or breaks on harmless rearrangement needs review.

## Maintenance

Remove dead code, unused exports and obsolete compatibility layers within the change.
Keep one implementation for each rule; avoid speculative extension points.
Configuration owns formatting, lint, versions and test commands.
[Documentation lookups](documentation-lookups.md) governs external API evidence.

## Project additions

- Follow the ADRs in `docs/adr/`: Next.js App Router, Prisma with PostgreSQL, Tailwind with shadcn/ui, dark-only theme.
- Schema changes ship as committed Prisma migrations; see `AGENTS.md`.
- Visual decisions follow `DESIGN.md` and `docs/context/design-system/CONTEXT.md`.
- Public claims must match the founder's approved facts; public copy changes need founder approval (`docs/context/product/CONTEXT.md`).
