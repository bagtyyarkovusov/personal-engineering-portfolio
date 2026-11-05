# Issue tracker

GitHub Issues on `bagtyyarkovusov/personal-engineering-portfolio` holds specs, tickets and bug reports.
Use [GitHub operations](github-operations.md) for CLI reads and writes.
Use [domain terms](domain.md) in titles and acceptance criteria.
Private repositories still require secret-safe issue bodies and screenshots.

## Ticket shape

`to-spec` writes the parent spec; `to-tickets` produces the dependency graph.
Each ticket describes a vertical slice a PR can finish under the
[delivery contract](coding-workflow.md#delivery-contract).
Write outcomes and acceptance criteria; avoid speculative implementation inventories.

```markdown
## Parent
#<spec issue>, or None.

## What to build
The behavior this ticket makes work, and for whom.

## Acceptance criteria
- [ ] Observable outcome.
- [ ] Failure/recovery outcome, when relevant.

## Blocked by
#<issue>, or None; omit when native dependency links record this.
```

For bugs, include reproduction, observed/expected behavior and relevant environment.
Include proof expectations and explicit exclusions when they constrain delivery.
Use native sub-issues/dependencies where available; otherwise preserve edges in the body.
Start only after all blocking tickets are resolved; a readiness label alone is insufficient.

## Intake

When a skill says "publish to the issue tracker", create a GitHub issue.
When it says "fetch the ticket", read its full criteria and governing discussion.
Use `triage` and exactly one [triage label](triage-labels.md).
Requests enter as issues; PRs show implementation and proof.
Close completed tickets through the PR closing reference, under the closure rule below.
For work declined without implementation, explain why and close as not planned.

## Closure Rule

An issue may only be closed when **all** of the following are true:

1. The implementation commit(s) have landed on `main` and been pushed to `origin/main`.
2. The acceptance criteria checkboxes in the issue body are checked (`[x]`).
3. Any labels that no longer apply (e.g., `needs-triage`) are removed before or at closure.
4. The closure comment references the commit SHA or PR that merged the work.
5. Any temporary implementation plan or spec files written during the work are removed and the removal committed. These files are scaffolding artifacts — keeping them pollutes the document architecture and confuses future AI context retrieval.

No "local-only" closures. If the work is done on a branch but not yet on `main`, the issue stays open until merge.
