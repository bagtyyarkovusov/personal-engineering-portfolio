# Postmortem: <incident and date>

Follow [incidents](incidents.md). Describe conditions and decisions without blame.
Keep sensitive evidence in restricted storage and link a redacted summary.

## Summary and impact

- Incident / owner / review date: <links and names>
- User-visible failure: <what users could not do>
- Start / detected / mitigated / recovered: <timestamps with timezone>
- Affected users, requests, data, or money: <counts and uncertainty>
- Duration and scope: <platforms, regions, versions>
- Privacy/security/legal handoff, if relevant: <private reference>

## Timeline

| Time + timezone | Observation or decision | Evidence |
| --- | --- | --- |
| <time> | <first known symptom> | <dashboard or report> |
| <time> | <declaration and lead> | <incident log> |
| <time> | <authorized mitigation> | <decision and deployment> |
| <time> | <recovery verified> | <checks and stable window> |

## Mitigation and recovery

- What reduced impact: <action and observed effect>
- What failed or slowed recovery: <conditions, missing access, wrong assumptions>
- How integrity was verified: <queries, tests, reconciliation>
- User communication: <approved message links and timing>

## Root causes and contributing conditions

- Trigger: <event that exposed the failure>
- Mechanism: <how the system produced user harm>
- Contributing conditions: <design, process, safeguards, observability>
- Detection gaps: <why signals or tests missed it>
- What helped: <controls and decisions that reduced impact>

## Actions as issues

| Issue | Risk reduced | Owner | Due date | Verification |
| --- | --- | --- | --- | --- |
| <link> | <prevent/detect/recover> | <name> | <date> | <test or drill> |

- [ ] Link owned issues rather than leaving unassigned action bullets.
- [ ] Prioritize the smallest action that prevents or limits recurrence.
- [ ] Verify completed actions with a test or repeated drill; link the result.
- [ ] Founder reviews unresolved risk and any external/legal follow-up.
