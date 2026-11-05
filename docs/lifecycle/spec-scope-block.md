# Scope block for a spec

Paste the block below into `to-spec` output. Follow [scope](scope.md) when
filling it; the spec issue owns the accepted scope and acceptance criteria.

## Outcome and appetite

- Problem and target user: <link to validated problem>
- First-release outcome: <one completed user job>
- Appetite: <time budget, people, start date, decision date>
- Why this amount is worth spending: <value and constraint>
- Success signal: <observable behavior and review date>

## Boundaries

- Included: <minimum behavior needed for the outcome>
- Exclusions: <explicitly absent platforms, users, capabilities, or polish>
- Constraints: <compatibility, accessibility, privacy, operations>
- Essential states: <empty, loading, error, success, offline, denied, as applicable>
- Uncertainty: <bounded spike, question, deadline, and stop condition>

## Cut order

List optional scope from first to cut to last to cut. Keep the core outcome usable.

1. <optional depth to remove first; effect on acceptance criteria>
2. <next cut; remaining usable path>
3. <last optional cut before stopping to reconsider appetite>

## Stop and decide

- Stop trigger: <essential assumption fails or appetite expires>
- Decision owner: <founder>
- Options to bring: <smaller scope / stop / explicit new appetite>
- Deferred work: <separate issue links>

## Handoff checks

- [ ] Founder accepts the appetite and first-release outcome.
- [ ] Every included behavior has checkable acceptance criteria in the spec.
- [ ] Cuts preserve safety, accessibility, and the essential user outcome.
- [ ] `to-tickets` puts scaffold and uncertainty-reducing slices first.
- [ ] Each ticket names proof and a small-PR boundary under the coding workflow.
