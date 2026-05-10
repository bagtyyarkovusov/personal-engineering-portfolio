# Domain Docs

How engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before Exploring

Read `CONTEXT-MAP.md` at the repo root, then read the context files relevant to the task:

- `docs/context/product/CONTEXT.md`
- `docs/context/architecture/CONTEXT.md`
- `docs/context/design-system/CONTEXT.md`
- `docs/context/delivery/CONTEXT.md`

Then read relevant ADRs in `docs/adr/`.

If a file does not exist yet, proceed silently.

## Vocabulary

When naming product concepts, features, tests, issue titles, refactor proposals, or architecture notes, use the terms defined in the relevant context file.

If the concept does not exist in the context docs yet, either the language is drifting or the project has a documentation gap. Note the gap before inventing new vocabulary.

## ADR Conflicts

If work contradicts an existing ADR, surface the conflict explicitly instead of silently overriding it.

Example:

> Contradicts ADR-0003 (Tailwind/shadcn design system), but worth reopening because...
