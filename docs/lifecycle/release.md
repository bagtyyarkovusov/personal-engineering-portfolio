# Release and deploy · P0

Move a known revision into users' hands with observable health and tested recovery.
Use this playbook for web/API deploys, mobile binaries, and over-the-air updates.

## Checklist and proof

- [ ] Open a release issue using the [launch checklist](launch-checklist.md).
  Proof: the issue names commit, environments, release owner, and intended users.
- [ ] Confirm delivery gates through the [coding workflow](../agents/coding-workflow.md).
  Proof: the merged revision has the required review and passing CI.
- [ ] Rehearse deployment in staging with representative data and configuration.
  Proof: staging build/deploy identifiers and smoke results match the candidate.
- [ ] Resolve schema, API, web, and mobile rollout order before production.
  Proof: the launch checklist gives ordered steps and compatibility evidence.
- [ ] Test recovery before requesting production authorization.
  Proof: staging rollback or forward-fix exercise restores the critical flow.
- [ ] Assign a release observer and measurable stop conditions.
  Proof: the issue links health dashboards, thresholds, and an observation window.
- [ ] Prepare the exact founder handoff for each production or store action.
  Proof: target, revision, migration plan, expected impact, and recovery are stated.
- [ ] After an authorized release, verify the critical flow and health signals.
  Proof: timestamped production observations identify the deployed version.
- [ ] Close the release only after its observation window passes.
  Proof: the owner records outcome, remaining issues, and any rollback decision.

## Stack-specific routing

- **Next.js/Node/Railway**: fill the web/API section of the launch checklist.
- **Expo/EAS**: fill the mobile section, including runtime compatibility.
- Store review and installed clients can outlive a server deploy; test old clients.
- A binary rollback usually requires another store release; prepare server flags
  or a compatible update as mitigation, with the same authorization rule.

## Founder handoff

Apply the [authority rule](README.md#evidence-and-authority). Production deploys,
production OTA publishing, Railway/EAS setting changes, store submissions, paid
capacity, and destructive migrations need explicit authorization. The `release`
skill owns this playbook's workflow; this file owns the checkable release evidence.

## Sources

- [Google SRE: Reliable product launches](https://sre.google/sre-book/reliable-product-launches/)
- [Apple TestFlight](https://developer.apple.com/testflight/)
- [Expo: EAS Update](https://docs.expo.dev/eas-update/introduction/)
