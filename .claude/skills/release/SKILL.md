---
name: release
description: Prepare or execute an authorized web, API or mobile release using project readiness and rollback evidence.
---

# Release

Read AGENTS.md and the project's environment, deployment runbook and local testing
guides. Use docs/lifecycle/{release,launch-checklist,backups,observability,security}.md
for the affected capability. Follow actual repository configuration for commands.
If these guides are absent, inspect the deployment setup and draft the missing
project facts in the issue before calling the release ready.

Identify exact commit, platform, service, environment, trigger and release owner.
Check the release's acceptance, green configured CI, current review and migration
compatibility. Before any production authorization, require a recorded founder
proceed/revise/stop decision from pre-production MVP testing, or an approved
applicability exception in the release issue. Run staging smoke tests and critical success/failure flows.
For data changes, prove migration order, old-client compatibility, restore readiness
and rollback limits; a code revert may not reverse a destructive migration.
Inspect crash/source-map setup and the founder's actionable alert destination.

For mobile, distinguish an EAS update compatible with the installed runtime from
a new binary/native change. Verify channel/runtime/profile and supported old
clients. Prepare TestFlight testing, App Review credentials, privacy/account
deletion requirements and store metadata when applicable. Do not claim store
approval or immediate rollback; users can retain older binaries.

Prepare a concrete release packet in the issue: target artifact/commit, observed
proof, exact actions, migrations, rollout/rollback conditions, costs and owner.
Resolve reversible preparation first. Ask for authorization only for external
actions the environment guide gates and which the founder has not already
authorized. Full-send alone authorizes code delivery, not a production release.

Once authorized, execute only the named target/actions, verify production health
and critical flows, and record observed artifact/version plus rollback status.
If verification fails, use the authorized recovery plan; ask for any additional
gated action. Report what shipped and any remaining unverified path honestly.
