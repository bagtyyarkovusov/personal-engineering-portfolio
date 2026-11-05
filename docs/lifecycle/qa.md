# QA and accessibility · P0

Prove the accepted user outcome works across supported surfaces and failure states.
Use automated checks for repeatable behavior and direct interaction for usability.

## Checklist and proof

- [ ] Map every acceptance criterion to a test or explicit manual check.
  Proof: the issue or PR links results for all criteria, including failure cases.
- [ ] Run the project's configured type, lint, build, and relevant test commands.
  Proof: report command names, exit status, and any skipped checks with reasons.
- [ ] Exercise the core flow using a fresh account and realistic empty data.
  Proof: a redacted screenshot and observed result show the end-to-end outcome.
- [ ] Test loading, retry, validation, offline, denied permissions, and expired auth.
  Proof: named tests or a manual matrix show recoverable feedback for each state.
- [ ] Test keyboard navigation, focus order, visible focus, labels, and errors.
  Proof: a walkthrough reaches every web control without a pointer or focus trap.
- [ ] Test screen-reader names, reading order, and status announcements.
  Proof: record platform, reader, flow, and findings from direct interaction.
- [ ] Check contrast, text resizing, reduced motion, and touch target usability.
  Proof: measured values and screenshots cover supported themes and text sizes.
- [ ] Run an automated accessibility scan where supported; inspect findings.
  Proof: scan output links fixes or reasoned exceptions; manual checks still pass.
- [ ] Review the flow with `ux-heuristics`, `design-everyday-things`, and `impeccable`.
  Proof: findings refer to DESIGN.md and show resolved blocking usability issues.

## Stack-specific checks

- [ ] For Next.js, smoke-test the production build and narrow/wide viewports.
  Proof: the configured build passes and critical routes render with correct data.
- [ ] For Expo, test the release-like build on supported iOS/Android versions.
  Proof: device/build identifiers and screenshots show the same core scenario.

Use [environment guidance](../agents/environment.md) for T3 Code device and
browser controls. Keep test credentials and personal data out of screenshots.

## Founder handoff

Apply the [authority rule](README.md#evidence-and-authority). Bring failed
acceptance criteria, accessibility exclusions, and supported-platform cuts to the
founder before release; show impact and a concrete fix or scope reduction.

## Sources

- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google SRE: Reliable product launches](https://sre.google/sre-book/reliable-product-launches/)
