# Launch checklist: <release>

Copy into the release issue. Follow [release](release.md) for authority and gates.
Replace placeholders; mark absent platforms N/A with a reason.

## Candidate and recovery

- [ ] Name commit, build IDs, owner, target environments, and intended audience.
  Proof: <revision, immutable artifact IDs, release window>
- [ ] Link accepted scope, merged PRs, CI, QA/accessibility results, and the MVP
  testing decision.
  Proof: <links covering all acceptance criteria and the pre-production user test
  or an approved applicability exception>
- [ ] Run staging smoke: signup/login, core job, logout, and error recovery.
  Proof: <platforms, commands or screenshots, timestamp, results>
- [ ] Define schema → API → client order and old-client compatibility.
  Proof: <ordered steps and migration/contract test results>
- [ ] Rehearse rollback or forward recovery and check the latest restore rehearsal.
  Proof: <recovery command/procedure, staging result, backup timestamp>
- [ ] Name health thresholds, observer, stop conditions, and observation duration.
  Proof: <dashboards, alert test, incident-runbook link>

## Web and API · stack-specific: Next.js, Node, Railway

- [ ] Build the candidate using the project's configured production commands.
  Proof: <command results and artifact revision>
- [ ] Inspect target config, secrets references, domains, TLS, and dependencies.
  Proof: <redacted diff; no secret values>
- [ ] Verify readiness, auth, critical API routes, and caching after staging deploy.
  Proof: <smoke results including an existing user and a fresh user>
- [ ] Prepare the exact production deploy and recovery steps for authorization.
  Proof: <service/environment/revision, migration order, recovery limits>

## Mobile · stack-specific: Expo/EAS, iOS; adapt Android/store steps

- [ ] Choose OTA or new binary using native-code and runtime compatibility.
  Proof: <native dependency/config diff, runtimeVersion and update-channel match>
- [ ] Build a new binary for native changes or an incompatible runtime.
  Proof: <EAS profile, runtimeVersion, version/build numbers, build ID>
- [ ] Test a compatible OTA on its intended staging channel before publishing.
  Proof: <old/new build IDs, update ID, cold-start and core-flow results>
- [ ] Distribute the candidate through TestFlight, then prepare App Review.
  Proof: <TestFlight build/test outcome and submission metadata draft>
- [ ] Prepare equivalent internal testing/store checks for Android if shipped.
  Proof: <track, build ID, tester outcome, store metadata>
- [ ] Supply working reviewer credentials, access steps, and required demo data.
  Proof: <private credential reference and successful review-path rehearsal>
- [ ] Publish a reachable privacy policy and reconcile store privacy disclosures.
  Proof: <policy URL and SDK/data-inventory review>
- [ ] If accounts exist, verify in-app account deletion and stated retention limits.
  Proof: <test account deletion result and reviewer navigation steps>
- [ ] Check entitlements, permission prompts, purchase rules, and store metadata.
  Proof: <release-build checks and applicable policy decisions>
- [ ] Verify crash reporting, source maps/symbols, and release/update identification.
  Proof: <symbolicated deliberate staging error from the candidate>
- [ ] Document mobile mitigation: compatible OTA, flag, or replacement binary.
  Proof: <staging rehearsal; store timing and installed-client limits>

## Authorization and observation

- [ ] Obtain explicit founder approval for the exact production/store actions.
  Proof: <decision link, targets, revisions, and authorized bounds>
- [ ] Run only authorized actions; record deployed versions and submission state.
  Proof: <deployment/update/submission IDs; App Review approval is a separate state>
- [ ] Verify production core flow, errors, latency, crash rate, and payment state.
  Proof: <redacted observations with timestamp and deployed version>
- [ ] End the observation window with release / rollback / follow-up decision.
  Proof: <owner outcome and remaining issue links>
