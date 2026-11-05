# Dependencies and maintenance · P1

Keep routine updates small and identify security or operational drift early.
Move this work to P0 when a known exploitable issue threatens launch.

## Checklist and proof

- [ ] Enable the [Dependabot starter](../../.github/dependabot.yml) for this repo.
  Proof: configuration parses and the dashboard recognizes npm and Actions updates.
- [ ] Adapt the [audit starter](../../.github/workflows/dependency-audit.yml) to the stack.
  Proof: a manual run reports the production dependency audit as an artifact.
- [ ] Assign an owner to review the non-blocking audit report weekly.
  Proof: each finding is triaged as fix, investigate, or time-bounded exception.
- [ ] Treat audit execution failures separately from vulnerability findings.
  Proof: registry/network/config failures have an issue rather than a clean bill.
- [ ] Review grouped minor/patch updates and separate major-version work.
  Proof: each update PR passes project checks and relevant runtime smoke tests.
- [ ] Prioritize reachable vulnerabilities using exposure and available fixes.
  Proof: the issue names affected paths, severity, deadline, and mitigation.
- [ ] Check runtime, framework, database, and mobile SDK support windows.
  Proof: a dated issue schedules upgrades before the supported version expires.
- [ ] Review resource cost, quotas, certificates, domains, and credential expiry.
  Proof: dashboards/settings show owners and reminders before hard limits.
- [ ] Remove unused dependencies and retire stale feature flags deliberately.
  Proof: search and tests show no remaining consumer before removal.
- [ ] Rehearse backups and alert delivery on the dates set by their playbooks.
  Proof: link the latest [restore](backups.md) and [alert](observability.md) results.

## Stack-specific notes

The starters assume a root pnpm lockfile and GitHub Actions. Declare pnpm in
`packageManager` and Node in `.node-version` before enabling audit CI. A monorepo
with multiple independent lockfiles needs matching Dependabot entries and jobs.
Review advisories as well as the automated report; an audit is not a full review.

## Founder handoff

Apply the [authority rule](README.md#evidence-and-authority). Bring production
upgrades, paid plan changes, credential rotations affecting live services, and
accepted security risk to the founder. Use the regular delivery workflow for fixes.

## Sources

- [GitHub: Dependabot options](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference)
- [DORA 2024 report](https://dora.dev/research/2024/dora-report/)
