# Context Map

This is a multi-context repo. Read the context that matches the work before changing code, docs, tests, or product behavior.

## Contexts

| Context | File | Use When |
| --- | --- | --- |
| Product | `docs/context/product/CONTEXT.md` | Positioning, target audience, MVP scope, public/private surfaces, and future agency direction |
| Architecture | `docs/context/architecture/CONTEXT.md` | App boundaries, data model, routing, backend decisions, and feature ownership |
| Design System | `docs/context/design-system/CONTEXT.md` | Visual language, Tailwind/shadcn usage, CSS boundaries, status tokens, and Three.js presentation |
| Delivery | `docs/context/delivery/CONTEXT.md` | Testing, Docker, GitHub Actions, Railway deployment, and release evidence |

## Architectural Decisions

System-wide architectural decision records live in `docs/adr/`.

Before making a decision that affects project structure, dependencies, deployment, authentication, persistence, testing, or design-system rules, read the relevant ADRs first.
