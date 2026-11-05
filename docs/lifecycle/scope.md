# Scope and appetite · P0

Set how much time the problem deserves before choosing the solution's depth.
Make cuts explicit so a deadline does not silently become a quality tradeoff.

## Checklist and proof

- [ ] Paste the [scope block](spec-scope-block.md) into the spec issue.
  Proof: the issue names appetite, outcome, exclusions, and ordered cuts.
- [ ] Express appetite as a time budget and a decision date.
  Proof: start and stop conditions are visible without estimating every task.
- [ ] Choose one end-to-end outcome for the first release.
  Proof: an acceptance scenario shows the user reaching that outcome.
- [ ] Separate essential behavior from optional depth and polish.
  Proof: each proposed cut preserves a usable path through the essential outcome.
- [ ] Name uncertainty that could consume the appetite.
  Proof: each unknown has a bounded spike, question, and stop condition.
- [ ] Define failure, offline, empty, and permission-denied behavior where relevant.
  Proof: acceptance criteria name the states needed for the chosen outcome.
- [ ] Order tickets so useful, testable slices land first.
  Proof: `to-tickets` output shows dependencies and scaffold tickets first.
- [ ] Review size and merge boundaries against the delivery workflow.
  Proof: each ticket identifies its proof and can ship through one small PR.

## Founder handoff

Apply the [authority rule](README.md#evidence-and-authority). Ask the founder to
choose the appetite and approve cuts that change the promised outcome. Bring a
smaller option before proposing more time, spend, or a new service.

## Exit and revision

- [ ] Record the accepted scope before implementation begins.
  Proof: a founder decision links the exact spec revision.
- [ ] Reopen the scope decision when an essential assumption fails.
  Proof: the issue states the new evidence and proposes cut, stop, or new appetite.
- [ ] Keep deferred work as separate issues rather than hidden acceptance criteria.
  Proof: the first-release criteria contain no unresolved optional commitments.

## Sources

- [Shape Up: Set boundaries](https://basecamp.com/shapeup/1.2-chapter-03)
- [Google: Small changelists](https://google.github.io/eng-practices/review/developer/small-cls.html)
