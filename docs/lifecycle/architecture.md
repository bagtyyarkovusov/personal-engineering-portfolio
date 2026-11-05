# Architecture and data · P0

Choose the smallest structure that supports the accepted scope and recovery.
Record durable tradeoffs; let source and schemas describe the implementation.

## Checklist and proof

- [ ] Map user entry points, services, data stores, and third parties.
  Proof: the spec names each boundary and which component owns each write.
- [ ] Trace one successful request and one failure across those boundaries.
  Proof: a sequence or written trace names timeouts, retries, and user feedback.
- [ ] Define domain terms and ownership before adding shared abstractions.
  Proof: project domain docs resolve ambiguous names used in the spec.
- [ ] Inventory stored data, purpose, access, retention, and deletion behavior.
  Proof: the spec's data table includes logs, backups, analytics, and uploads.
- [ ] Identify trust boundaries and tenant or account isolation.
  Proof: negative tests deny cross-account reads and writes at the server boundary.
- [ ] Choose safe retry and concurrency behavior for side effects.
  Proof: a test repeats or races a request without duplicate durable effects.
- [ ] Plan schema rollout alongside old and new application versions.
  Proof: a migration rehearsal covers compatibility, rollout order, and recovery.
- [ ] Record consequential alternatives and why the simpler one is insufficient.
  Proof: an ADR links the spec and names the condition for reconsidering it.
- [ ] Set resource limits from the first-release workload.
  Proof: a representative test reports latency, query counts, and bottlenecks.

## Stack-specific checks

- [ ] For Postgres, inspect constraints, indexes, and representative query plans.
  Proof: migration tests and redacted `EXPLAIN` output support expected access paths.
- [ ] For a Node API and web/mobile clients, define API compatibility windows.
  Proof: a previous-client contract test passes against the proposed API.
- [ ] For Railway, document service dependencies and private/public exposure.
  Proof: a redacted configuration inspection matches the boundary map.

## Founder handoff

Apply the [authority rule](README.md#evidence-and-authority). Escalate production
migrations, new paid infrastructure, data residency choices, and irreversible
retention changes with the tested migration and recovery plan.

## Sources

- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [Google SRE: Reliable product launches](https://sre.google/sre-book/reliable-product-launches/)
