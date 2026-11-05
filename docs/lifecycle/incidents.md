# Incidents · P0

Restore user service quickly, then learn without blame.
Prepare contacts and recovery access before first users need them.

## Checklist and proof

- [ ] Fill the [one-page runbook](incident-runbook.md) with contacts and dashboards.
  Proof: each placeholder has a reachable owner or an explicit N/A reason.
- [ ] Define incident triggers and who can declare an incident.
  Proof: the runbook covers outage, data loss, suspected exposure, and billing harm.
- [ ] Choose a private coordination channel and a user communication path.
  Proof: a drill reaches the founder and identifies the authorized spokesperson.
- [ ] Confirm access to health, deployment, backup, and provider status information.
  Proof: access checks succeed without posting credentials in the issue.
- [ ] Rehearse a common failure in staging with one incident lead.
  Proof: the timeline shows detection, declaration, mitigation, and recovery checks.
- [ ] Prepare low-risk mitigation options before a live emergency.
  Proof: a staging exercise validates rollback, feature disablement, or traffic limits.
- [ ] Preserve relevant logs and timestamps with restricted access.
  Proof: a redacted timeline links evidence without copying sensitive payloads.
- [ ] Recover only after checking the user flow and data integrity.
  Proof: the incident issue records stable signals over an agreed window.
- [ ] Complete a [postmortem](postmortem.md) for material incidents.
  Proof: impact, contributing conditions, and follow-up issues have named owners.
- [ ] Verify the most valuable corrective action actually prevents recurrence.
  Proof: a regression test or repeated drill covers the original failure mode.

## During an incident

Follow the runbook. Mitigate impact before investigating every root cause.
Use one lead to track decisions, one timeline, and explicit update times.
If alone, the founder fills multiple roles and reduces coordination overhead.

## Founder handoff

Apply the [authority rule](README.md#evidence-and-authority). Escalate immediately
for production intervention, suspected breaches, user notification, data loss,
provider spend, or legal duties. Preauthorized actions must name their exact
bounds; an incident declaration alone does not authorize arbitrary changes.

## Sources

- [Google SRE: Incident response](https://sre.google/workbook/incident-response/)
- [Google SRE: Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)
