# Domain and documentation

How agents and skills consume this repo's domain documentation.

## Multiple contexts

This is a multi-context repo. Read `CONTEXT-MAP.md` at the repo root, then the
context files relevant to the task:

- `docs/context/product/CONTEXT.md`
- `docs/context/architecture/CONTEXT.md`
- `docs/context/design-system/CONTEXT.md`
- `docs/context/delivery/CONTEXT.md`

Then read the relevant ADRs in `docs/adr/`. If a file does not exist yet, proceed silently.

| Question | Authority |
|---|---|
| What does a term mean? | Root `GLOSSARY.md` |
| What is implemented? | Source, types/schema, tests and runtime evidence |
| What must this task deliver? | GitHub issue acceptance criteria and linked spec |
| Where should I look? | `CONTEXT-MAP.md` and the owning `docs/context/*/CONTEXT.md` |
| Why was this chosen? | `docs/adr/` and its `README.md` index |
| What is scheduled? | Open issues and any roadmap |
| What did a change finish? | PR description and linked issue |

A glossary term or planned screen does not prove a capability exists.
After implementation, inspect source rather than maintaining a second behavior mirror.
[The workflow](coding-workflow.md#decide) owns product/design artifacts and temporary plans.

## Glossary

`GLOSSARY.md` holds the canonical terms: plain definition, boundaries and avoided synonyms.
Use the same terms in code, issues, tests and user-facing copy where appropriate.
Skills that call their glossary `CONTEXT.md` write to `GLOSSARY.md` here; the
`docs/context/*/CONTEXT.md` files are context guides, not glossaries.

If a concept is in neither the glossary nor the context docs, either the language
is drifting or there is a documentation gap. Note the gap before inventing new
vocabulary. Update definitions when meaning changes; explain a material semantic
change in an ADR.

## Decisions

`docs/adr/README.md` is the decision index.
Number ADRs sequentially; use a short descriptive filename and collision-check first.
Record status, context, decision, alternatives and consequences.
Keep accepted ADRs as history; supersede with a new ADR and update the index.
Use issues for temporary scope and the PR for proof, rather than adding progress ADRs.

If work contradicts an existing ADR, surface the conflict explicitly instead of
silently overriding it. Example:

> Contradicts ADR-0003 (Tailwind/shadcn design system), but worth reopening because...

## Ownership and overviews

Keep business rules in the module that owns the concept (`src/features/*` or `src/lib/*`, not page files).
Cross boundaries through deliberate interfaces; keep framework/storage detail in adapters.
Update a context file when ownership or constraints change; avoid inventories of every field or function.
