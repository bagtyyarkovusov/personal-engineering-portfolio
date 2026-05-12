# Branch Workflow and Definition of Done

## Branch Naming

All work must be developed on a feature branch. Use the following prefixes:

| Prefix | Use Case | Example |
| ------ | -------- | ------- |
| `feat/` | New features and enhancements | `feat/42-add-private-room` |
| `fix/` | Bug fixes | `fix/17-login-redirect-loop` |
| `chore/` | Maintenance, dependencies, tooling, CI | `chore/89-update-pnpm` |

Branch names use the GitHub issue number followed by a kebab-case slug describing the work:

```
<prefix>/<issue-number>-<short-description>
```

## Workflow

```
1.  Create branch  ──→  2. Implement  ──→  3. CI passes  ──→  4. PR to main  ──→  5. Merge
```

### 1. Create Branch

Branch from `main`. Include the issue number and a short slug:

```bash
git checkout main
git pull origin main
git checkout -b feat/42-add-private-room
```

### 2. Implement

Make changes on the branch. Commit messages should reference the issue number:

```bash
git commit -m "feat(#42): add signed private room links"
```

Use conventional commits where practical (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, etc.).

### 3. CI Quality Gate

Every push to a PR triggers the CI workflow defined in `.github/workflows/ci.yml`. The workflow runs two jobs sequentially:

**`quality` job** (runs first):
- `pnpm install --frozen-lockfile`
- Prisma client generation, schema validation, and database migration
- Database seed
- `pnpm typecheck` (TypeScript strict mode)
- `pnpm test` (unit + integration tests via Vitest)
- `pnpm build` (Next.js production build)
- `docker build` (verify the production Docker image is valid)

**`e2e` job** (runs after `quality` passes):
- `pnpm test:e2e` (Playwright E2E smoke tests)

Both jobs must pass before a PR can be merged.

### 4. Pull Request

Open a pull request against `main`. Include:

- A clear title referencing the GitHub issue
- A summary of changes
- Screenshots or screen recordings for UI changes

PRs are merged via the standard GitHub merge flow after CI passes.

### 5. Deploy

After merge, Railway automatically deploys from `main`. The deployment pipeline is:

```
main branch → CI passes → merge → Railway deploys from main
```

Railway configuration changes require human-in-the-loop (HITL) review because they involve access, secrets, and live deployment URLs.

---

## Issue Triage Workflow

Issues in the tracker follow a five-stage triage pipeline. The labels and their meanings are:

| Label | Stage | Meaning |
| ----- | ----- | ------- |
| `needs-triage` | Entry | Issue created; maintainer needs to evaluate and route it |
| `needs-info` | Awaiting input | More information is needed from the reporter before scoping |
| `ready-for-agent` | Agent-ready | Fully specified; can be picked up by an AFK agent |
| `ready-for-human` | Human-needed | Requires human judgment, access, or creative decision |
| `wontfix` | Closed | Will not be actioned |

### Triage Flow

```
needs-triage
    │
    ├──→ needs-info (reporter must clarify)
    │
    ├──→ ready-for-agent (fully specified, no human judgment needed)
    │
    ├──→ ready-for-human (requires human review or access)
    │
    └──→ wontfix (will not be actioned)
```

An issue stays in `needs-triage` until a maintainer assigns it to the appropriate next state. Only move to `ready-for-agent` when the acceptance criteria are concrete enough that an AFK agent can complete the work independently.

---

## Definition of Done

An issue may only be closed when all of the following are true:

1. **Implementation on main** -- The changes have been merged to `main` and pushed to `origin/main`. No local-only or branch-only closures.
2. **Acceptance criteria checked** -- All checkboxes in the issue body are marked `[x]`.
3. **Tests pass** -- All unit tests (Vitest) and E2E tests (Playwright) pass.
4. **TypeScript strict mode passes** -- `pnpm typecheck` produces zero errors.
5. **CI quality gate passes** -- The GitHub Actions workflow in `.github/workflows/ci.yml` completes successfully for the merged commit.
6. **Labels cleaned up** -- Triage labels that no longer apply (e.g., `needs-triage`, `ready-for-agent`) are removed before or at closure.
7. **Scaffolding artifacts removed** -- Any implementation plan or spec files written under `docs/superpowers/` or `plans/` during the work are removed and the removal is committed. These are scaffolding artifacts that pollute the document architecture and confuse future AI context retrieval.
8. **Closure comment references commit or PR** -- The closing comment on the issue includes the commit SHA or PR number that fulfilled the work.

---

## Human-in-the-Loop (HITL) Review Gates

Certain decisions require explicit human approval before implementation. Agents may not treat the following as approved until a human explicitly responds with `approved`:

- Homepage positioning and copy
- About page positioning and copy
- Design tokens (colors, typography, spacing, component primitives)
- Three.js pipeline map design
- Railway deployment configuration
- Shape-brief-gated product copy (as defined in `docs/context/product/CONTEXT.md`)

### HITL Process

For issues requiring HITL review, agents must produce a compact shape brief before implementation covering:

- purpose
- primary user
- content
- feeling
- constraints
- review artifact
- approval question

The reviewer responds with one of: `approved`, `revise`, or `blocked`.

See [`docs/context/product/CONTEXT.md`](../context/product/CONTEXT.md) for the full HITL Product Review Gates specification.
