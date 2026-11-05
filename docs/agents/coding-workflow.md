# Delivery workflow

## Delivery contract

Default: one issue = one PR from current `main`; review with `sol-loop`;
merge only on "full send" or founder approval.
Tightly related tickets may share one PR; identify each ticket and its proof.
Hide unfinished user-visible work behind feature flags.

PR size: no minimum. Target 100–500 changed lines, 1,000 soft ceiling;
above 1,000 the PR explains why it must stay together or it is split;
1,500–2,000 only as an explained exception.
Count tests/config/docs; report lockfiles, generated, vendored and pure moves separately.

Use this delivery-mode suggestion table only when the founder names no mode.
Suggest the mode before starting; a suggestion does not authorize a merge.
"full send" / "full stop" always wins.

| Work | Suggested mode |
|---|---|
| Small bug with repro / routine pattern | full-send |
| New user-facing behavior | plan then full-stop |
| Auth, payments, permissions, migrations | full-stop + founder inspects |
| Large/uncertain | spec + tickets first |

## Decide

Use `grilling` for an unclear goal, or `grill-with-docs` to settle gaps against
existing decisions. Ask rounds as plain Markdown in chat, never interactive forms.
For a new project, follow `kickoff` for the setup interview and skill invocation.
Use `research` for evidence and `prototype` for an uncertain interaction or state model.

New UI projects run `product-design` before specification. Use it before a large
UI feature too; its phases, founder sign-offs and artifact ownership live in the
`product-design` skill.

For existing UI and committed design artifacts, follow `product-design`'s adapter.
Read a composed skill's installed SKILL.md manually when the host cannot invoke it.

## Plan

Before specification or implementation, for UI and non-UI work, record the
[demand decision](../lifecycle/validation.md#exit), or an explicit applicability
exception with reason (for example, a maintenance fix without a demand question).
Accept the [scope](../lifecycle/scope.md#exit-and-revision) using the
[spec scope block](../lifecycle/spec-scope-block.md). Existing recorded decisions
may be linked; reopen them when assumptions change.
Use `to-spec`, then `to-tickets`; give each screen's states and behavior acceptance
criteria. Include applicable [P0 readiness](../lifecycle/README.md#priorities-and-owners)
work as tickets with proof before first users reach the capability; record N/A
with a reason. Link the owning checklists instead of copying them.
Make stack scaffolding the first tickets, with tokens/theme first for UI.
Kickoff applies the kit and grills; it does not scaffold the stack itself.
Use `triage` for incoming bugs and requests; follow the [issue tracker](issue-tracker.md).
Use the [issue tracker's dependency gate](issue-tracker.md#ticket-shape).
Keep scope inside the delivery contract above.

## Build

1. Create your own worktree and branch from fresh `origin/main`.
2. Read the issue, affected source/tests and the guides routed by
   [AGENTS.md](../../AGENTS.md).
3. Use `tdd` for behavior changes, `diagnosing-bugs` for failures, and
   `codebase-design` when choosing a module interface or seam.
4. Apply the [coding standards](coding-standards.md).
5. Put unrelated discoveries into follow-up issues instead of widening the diff.

## Prove

Run checks appropriate to the changed behavior and the configured CI lane.
For a behavior fix, demonstrate a focused regression test that fails without it.
For UI/runtime work, exercise the running app using [local testing](local-testing.md).
Check relevant empty, loading, failure and recovery states, not only success.
Put observed commands, results and limitations in the PR description.
Screenshots belong in the PR or issue; never commit evidence, receipts or review files.
Do not claim a check or runtime path you did not observe in this session.
A missing acceptance requirement remains blocked even if other checks pass.

## Review

Run `sol-loop` before filing or updating the PR.
One reviewer checks bugs, all issue acceptance criteria, the
[coding standards](coding-standards.md) and routed project guidance.
Unmet acceptance criteria are blockers; unrequested work is a should-fix finding.
For UI changes, include `impeccable critique`, `ux-heuristics` and
`design-everyday-things` findings against `DESIGN.md`, plus a simulator/browser screenshot.
Disclose unavailable skills and missing runtime evidence.
Use `council` for big decisions; use [models and effort](models.md) for both reviews.
Fix findings, rerun affected proof and re-review changed behavior.

## Ship

Use `file-pr` with the [PR template](../../.github/pull_request_template.md), then
`babysit-pr` to fix real CI and review findings.
`full-send` carries authorized work through merge; `full-stop` ends with a reviewable PR.
The merge gate is green required checks, finished review and an up-to-date branch.
[GitHub operations](github-operations.md#merge) owns merge mechanics and PR waits.
[Environment](environment.md#permissions) owns permission for external actions.
Remove your worktree and local branch after its PR merges.

For a spec issue, run `ship-tickets`; its task graph, concurrency, worktree,
full-send/full-stop and combined-review rules live in that skill. Use no
integration branch.

## Keep moving

Use `modernize` for stale PRs, `takeover` for existing work, and `handoff` when
another session must continue. Include issue, branch, proof, blockers and next action.
Use `retro` to turn repeated friction into a small workflow improvement.

## Lifecycle

Consult [Lifecycle](../lifecycle/README.md) for launch and operational readiness.
Release authorization follows the environment guide's permission boundaries.
