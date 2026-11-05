# Incident runbook: <service>

Fill before first users. Follow [incidents](incidents.md) and the
[authority rule](README.md#evidence-and-authority). Keep secrets out of this page.

- Lead / backup: <founder contact / backup contact>
- Private coordination: <channel>; user updates: <approved status/support channel>
- Dashboards / logs / provider status: <links>
- Recovery / backups / flags: <procedure links>
- Exact preauthorized mitigation bounds, if any: <decision link or none>

## 1. Detect

- [ ] Confirm signal, affected flow, start time, region/platform, and version.
  Proof: <timestamped dashboard or report; redact personal data>
- [ ] Treat outage, data loss, suspected exposure, or incorrect billing as urgent.
  Proof: <impact summary and supporting observation>

## 2. Declare

- [ ] Notify founder, name one lead, and open a private incident record.
  Proof: <incident link, lead, severity/impact, next update time>
- [ ] Freeze unrelated changes and record the last known good revision.
  Proof: <decision log and deployment IDs>

## 3. Mitigate first

- [ ] Choose the smallest reversible action that reduces user harm.
  Proof: <proposed rollback/flag/traffic limit, target, expected effect, recovery>
- [ ] Obtain production authorization within the defined bounds, then act.
  Proof: <approval and command/result; preserve relevant evidence>

## 4. Communicate

- [ ] Draft known impact, current mitigation, user action, and next update time.
  Proof: <founder-approved message; authorized sender posts it>
- [ ] Route suspected breaches or legal notification deadlines to the founder.
  Proof: <private handoff; separate confirmed facts from hypotheses>

## 5. Recover

- [ ] Verify core flow, data integrity, and stable health for the agreed window.
  Proof: <test results and timed dashboard observations>
- [ ] Record recovery time, remaining risk, and authorized all-clear message.
  Proof: <lead decision and communication link>

## 6. Learn

- [ ] Fill the [postmortem](postmortem.md); create owned corrective-action issues.
  Proof: <timeline, impact, contributing causes, due dates, regression check>
