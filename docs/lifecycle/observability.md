# Observability and alerts · P0

Make user-visible failures detectable and give the founder an actionable next step.
Start with a few signals tied to the critical flow.

## Checklist and proof

- [ ] Define success, error rate, latency, and availability for the critical flow.
  Proof: each signal has a query, threshold, observation window, and owner.
- [ ] Add structured errors and correlation identifiers across service boundaries.
  Proof: a staging failure can be traced from client symptom to server event.
- [ ] Check logs and telemetry for secrets and unnecessary personal data.
  Proof: a redacted sample shows useful context without tokens or sensitive bodies.
- [ ] Configure error/crash reporting and release identifiers.
  Proof: a deliberate staging error appears under the expected release and platform.
- [ ] Upload source maps or platform symbols for release builds.
  Proof: the deliberate error resolves to the expected source location.
- [ ] Monitor uptime externally and verify the critical dependency path.
  Proof: a controlled staging failure changes the probe result as expected.
- [ ] Watch saturation: database connections, storage, queue age, and resource use.
  Proof: dashboards expose the limits likely to break the first-release workload.
- [ ] Route actionable alerts to the named founder/on-call channel.
  Proof: a test notification arrives with service, impact, dashboard, and runbook.
- [ ] Set alert thresholds to avoid paging for isolated harmless events.
  Proof: staging tests distinguish a recoverable blip from sustained user impact.
- [ ] Set telemetry retention and a monthly cost limit.
  Proof: redacted settings show retention, sampling, and usage alerts.

## Stack-specific checks

- [ ] For Expo/Sentry, test crash reporting in the actual release-like build.
  Proof: stack traces resolve with the matching EAS release/update metadata.
- [ ] For Railway/Node, connect app errors with deployment and database metrics.
  Proof: one dashboard view identifies the version and affected dependency.

## Founder handoff

Apply the [authority rule](README.md#evidence-and-authority). Bring paid telemetry,
production instrumentation changes, sensitive-data collection, and alert routing
changes to the founder. Link [incident response](incidents.md) from every alert.

## Sources

- [Google SRE: Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Expo: Using Sentry](https://docs.expo.dev/guides/using-sentry/)
