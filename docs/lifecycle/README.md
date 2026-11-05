# Product lifecycle

Use this index when planning a product, preparing launch, or operating a service.
Read only the playbook for the stage at hand. Record decisions in the issue.

## Priorities and owners

- **P0**: complete before first users reach the affected capability.
- **P1**: complete soon after launch; assign an owner and due date at launch.
- **P2**: add later, when the trigger applies; track it as an issue.
- A P2 sunset plan becomes required before any retirement action.
- Mark an item N/A with a reason; an unchecked item is unfinished.

| Stage | Playbook | Priority | Driving skill or doc |
| --- | --- | --- | --- |
| Discovery | [Coding workflow](../agents/coding-workflow.md) | P0 | `grilling`, `product-design` |
| Demand validation | [Validation](validation.md) | P0 | product-design, research |
| Scope and appetite | [Scope](scope.md) | P0 | to-spec, to-tickets |
| Design | [Coding workflow](../agents/coding-workflow.md) | P0 | `product-design` |
| Architecture and data | [Architecture](architecture.md) | P0 | `to-spec`, `domain-modeling` |
| Build | [Coding workflow](../agents/coding-workflow.md) | P0 | `to-tickets`, `ship-tickets` |
| QA and accessibility | [QA](qa.md) | P0 | `ux-heuristics`, `impeccable`, project test commands |
| Pre-production MVP testing | [MVP testing](mvp-testing.md) | P0 | design-sprint (optional), QA and release |
| Security, privacy, payments | [Security](security.md) | P0 | `sol-loop`, threat and data review |
| Review and merge | [Coding workflow](../agents/coding-workflow.md) | P0 | `sol-loop`, `full-send`, `full-stop` |
| Release and deploy: web + mobile | [Release](release.md) | P0 | `release`, launch checklist |
| Backups and restore | [Backups](backups.md) | P0 | Restore rehearsal and provider docs |
| Observability and alerts | [Observability](observability.md) | P0 | `release`, service dashboards |
| Analytics, feedback, support | [Feedback](feedback.md) | P1 | `product-review` |
| Incidents | [Incidents](incidents.md) | P0 | Incident runbook and postmortem |
| Dependencies and maintenance | [Maintenance](maintenance.md) | P1 | Dependabot, dependency audit, `sol-loop` |
| Sunset | [Sunset](sunset.md) | P2 | Founder retirement decision and export rehearsal |

## Evidence and authority

Each checkbox names its proof. Record the command and result, test name,
redacted screenshot, or dashboard link and observation time in the issue or PR.
Keep transient receipts and prototypes out of commits. Source and tests own
implemented behavior; a completed checklist does not replace them.

[Environment permissions](../agents/environment.md#permissions) own authorization.
Each playbook identifies its specific handoff; prepare the exact change, target,
cost and recovery plan before requesting any missing authorization.

Use [environment guidance](../agents/environment.md) for project access and
T3 Code controls. Use [the coding workflow](../agents/coding-workflow.md) for
delivery and merge gates; these playbooks do not redefine them.

## Fill-in templates

- [Validation brief](validation-brief.md): one user and one painful job.
- [MVP testing](mvp-testing.md): the representative-user gate before production.
- [Spec scope block](spec-scope-block.md): paste into the to-spec issue.
- [Launch checklist](launch-checklist.md): web, API, and mobile release proof.
- [Incident runbook](incident-runbook.md): fill contacts before first users.
- [Postmortem](postmortem.md): record learning and link follow-up issues.

Core lifecycle gates are stack-neutral. The release, launch and environment
playbooks include clearly marked Next.js/Node/Railway and Expo/EAS examples; replace
those examples with the project's configured platforms, providers, commands and
settings. Mark an example N/A with a reason when its platform is absent.
