# Security, privacy, and payments · P0

Review the exposed capability before first users or a change in risk.
Collect only necessary data and verify access and money movement at boundaries.

## Checklist and proof

- [ ] List assets, attackers, entry points, and likely abuse for the accepted scope.
  Proof: the issue maps each relevant threat to a control and verification.
- [ ] Select applicable ASVS requirements; record exclusions with reasons.
  Proof: a scoped checklist links tests for authentication, sessions, and access.
- [ ] Test authorization on every sensitive server operation.
  Proof: tests cover anonymous, wrong-user, wrong-role, and cross-tenant requests.
- [ ] Verify secrets stay server-side and out of repos, client bundles, and logs.
  Proof: secret scanning and redacted bundle/config inspections show no exposure.
- [ ] Test input limits, upload validation, rate limits, and safe error responses.
  Proof: rejection tests cover malformed, oversized, and repeated requests.
- [ ] Reconcile actual collection and retention with the proposed privacy notice.
  Proof: a data inventory includes SDKs, processors, logs, and deletion limits.
- [ ] If accounts exist, verify deletion, export, and session revocation paths.
  Proof: a test account completes deletion and the retention exceptions are stated.
- [ ] If payments exist, use provider-hosted collection where appropriate.
  Proof: the design identifies the provider boundary and stores no raw card data.
- [ ] Verify signed webhooks, retries, duplicate events, and out-of-order delivery.
  Proof: provider sandbox tests produce one fulfillment per paid order.
- [ ] Handle failed payments, refunds, disputes, and subscription state changes.
  Proof: sandbox scenarios reconcile local access with the provider's state.
- [ ] Review mobile store payment rules for the goods being sold.
  Proof: the launch issue records the applicable rule and proposed purchase path.

## Founder handoff

Apply the [authority rule](README.md#evidence-and-authority). Bring privacy and
terms text, consent choices, processor contracts, legal questions, production
credentials, billing activation, refunds, and deletion actions to the founder.
State unresolved risks clearly; a checklist is not legal advice or certification.
Use [incident response](incidents.md) for suspected exposure.

## Exit

- [ ] Close critical findings before enabling the affected capability.
  Proof: tests reproduce the original risk and pass with the control in place.
- [ ] Track residual findings with severity, owner, and deadline.
  Proof: linked issues record the founder's release decision where needed.

## Sources

- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [Stripe: Fulfill orders](https://docs.stripe.com/payments/checkout/fulfill-orders)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
