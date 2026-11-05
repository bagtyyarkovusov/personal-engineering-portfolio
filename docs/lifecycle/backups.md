# Backups and restore · P0

Prove essential data can be recovered before accepting irreplaceable user data.
A configured backup is incomplete until a restore has been exercised.

## Checklist and proof

- [ ] Inventory durable stores, uploads, configuration, and external dependencies.
  Proof: a table names owner, location, backup method, and recovery dependency.
- [ ] Agree acceptable data loss and recovery time with the founder.
  Proof: the issue records RPO and RTO in plain time units for each critical store.
- [ ] Check backup schedule, retention, encryption, access, and failure alerts.
  Proof: redacted provider settings match the agreed recovery targets.
- [ ] Restore a recent backup into an isolated, access-restricted environment.
  Proof: a restore log names backup timestamp, target, duration, and result.
- [ ] Disable outgoing email, payments, webhooks, and jobs in the restore target.
  Proof: configuration inspection and sandbox tests show no live side effects.
- [ ] Verify integrity and an essential user flow against restored data.
  Proof: counts, constraints, sample reads, and smoke tests match expected values.
- [ ] Measure actual data loss and recovery time against the targets.
  Proof: timestamps show whether the rehearsal meets RPO and RTO.
- [ ] Document recovery order, access requirements, and who can authorize it.
  Proof: a second reader can follow the procedure without missing credentials.
- [ ] Set a recurring rehearsal and repeat after storage or schema changes.
  Proof: a dated maintenance issue names the next rehearsal and owner.
- [ ] Reconcile retention and deletion promises with backup expiry.
  Proof: the [data inventory](architecture.md) and privacy review state the limits.

## Stack-specific checks

- [ ] For Postgres/Railway, verify the chosen plan's restore and recovery features.
  Proof: current provider settings and a real isolated restore support the claims.
- [ ] Include object storage separately from the database if uploads live there.
  Proof: a restored record can retrieve its matching file and access policy.

## Founder handoff

Apply the [authority rule](README.md#evidence-and-authority). Obtain authorization
for paid backup tiers, copying production data, production restores, failover,
and non-local cleanup. Show the exact source, destination, exposure controls,
expected loss, and rollback plan before changing a live data store.

## Sources

- [Google SRE: Reliable product launches](https://sre.google/sre-book/reliable-product-launches/)
- [Google SRE: Incident response](https://sre.google/workbook/incident-response/)
