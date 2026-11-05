---
name: product-review
description: Review product health, feedback, reliability and maintenance, then turn evidence into a small prioritized backlog.
---

# Product review

Use for a requested weekly review or on demand. Read PRODUCT.md, the latest spec,
AGENTS.md and docs/lifecycle/{feedback,observability,incidents,maintenance}.md.
Inspect the period the founder requested; otherwise state a seven-day window.
This skill does not itself schedule a recurring task or enable new tracking.

Read available activation/retention measures, support feedback, crash/error trends,
alert quality, incidents, failed releases and dependency/security reports.
Use authorized connected tools; inspect source/dashboard definitions before
interpreting a metric. Report observation time, denominators and known gaps.
Separate direct user evidence from assumptions. Do not copy customer/private data
into issues or infer success from small samples. No data means unknown.

Compare evidence with the accepted hypotheses and release success/stop criteria.
Identify the few highest-impact opportunities: painful user failures first,
reliability/security risks next, then measurable product improvements.
Use `triage` and the project's issue tracker to deduplicate and propose small
checkable tickets with priority, owner, proof, and the hypothesis they test.
Source/tests remain the implementation truth; avoid a parallel status document.

Show the concise findings and proposed next appetite/cut order to the founder.
Within authorized scope, create/update issues; obtain permission before customer
outreach, new analytics collection, paid services, production changes or non-local
data deletion. Do not send messages to users without explicit authorization.
Recommend `grilling`, `product-design`, `to-spec` or `ship-tickets` for the selected
work. A review or ticket recommendation does not authorize its merge or rollout.
