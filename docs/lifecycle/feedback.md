# Analytics, feedback, and support · P1

Use real behavior and support requests to decide the next small improvement.
Choose a few useful events before adding dashboards or a large tracking plan.

## Checklist and proof

- [ ] Define activation as completing the product's core job.
  Proof: one event or query measures the completed outcome with a denominator.
- [ ] Define retention around the job's natural repeat interval.
  Proof: a cohort query states eligibility, time window, and return behavior.
- [ ] Select only events needed for an upcoming product decision.
  Proof: each event names the decision, owner, properties, and review date.
- [ ] Validate event delivery, deduplication, and environment separation.
  Proof: a staging flow emits the expected count without contaminating production.
- [ ] Review telemetry collection, consent, retention, and deletion requirements.
  Proof: the [security review](security.md) covers the selected provider and fields.
- [ ] Give users a reachable feedback/support channel.
  Proof: a test message reaches the owner and receives the expected acknowledgment.
- [ ] Define triage for bugs, feature requests, billing, and security reports.
  Proof: sample reports route to issues or the private incident path with owners.
- [ ] Set a response target the founder can sustain.
  Proof: support hours, escalation path, and backup owner are recorded.
- [ ] Hold a weekly review of activation, retention, and support themes.
  Proof: a dated issue records counts, sample size, interpretation, and one action.
- [ ] Close the loop with users after an authorized response or shipped fix.
  Proof: the support thread links the outcome without exposing private details.

## Weekly decision

Use the `product-review` skill for the review workflow; this file owns the
checkable evidence and founder handoff. The founder chooses continue, adjust, or
stop. Compare cohorts and
recent conversations; avoid treating tiny samples as reliable growth trends.

## Founder handoff

Apply the [authority rule](README.md#evidence-and-authority). Bring paid analytics,
new data collection, public commitments, refunds, and legal requests to the
founder. Agents draft user replies; sending messages requires authorization.

## Sources

- [Paul Graham: Do things that don't scale](https://paulgraham.com/ds.html)
- [DORA 2024 report](https://dora.dev/research/2024/dora-report/)
