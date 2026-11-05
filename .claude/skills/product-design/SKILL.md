---
name: product-design
description: Design a new UI product or substantial feature through an approved brief, research, structure, visual system and prototype.
---

# Product design

Read AGENTS.md, PRODUCT.md, DESIGN.md, existing source and the approved issue.
Inspect installed skills before invoking them. This workflow composes `grilling`,
`research`, `lean-ux`, `prototype`, `impeccable`, `ux-heuristics`,
`design-everyday-things`, `web-typography` and, for mobile, `ios-hig-design`.
Disclose missing tools/skills and offer a concrete manual route; do not invent
tool output, user research or approval. Existing UI inherits its identity;
use `impeccable document` to capture it. Rebrand only when asked.
Read composed skills' installed SKILL.md manually if the host cannot invoke them.
The artifact adapter below applies to every invoked skill, including existing-UI work.

Each phase ends with an explicit founder sign-off on the concrete artifact.
Record decisions in the spec issue or thread. Existing explicit sign-off counts;
elapsed time, no reply and general full-send permission do not choose a design.
Present the artifact before asking. Use plain Markdown rounds for grilling.

## 1. Brief

Grill the goal, first audience, painful job, constraints, success measures,
smallest release and exclusions. Use `impeccable init` to capture the accepted
product truth in root PRODUCT.md; follow its installed reference rather than
guessing a CLI command. Keep assumptions labeled. Get sign-off on the brief.

## 2. Research

Use `research` to inspect three to five relevant products or references. Explicitly
set its output path under /tmp; its default committed research file is overridden
by this workflow's artifact adapter.
Capture sources, screenshots where permitted, and specific borrow/avoid reasons.
Use `lean-ux` to turn uncertain assumptions into testable MVP hypotheses.
Keep research notes and transient evidence in the issue or /tmp, not committed
research files. Get sign-off on the implications and the hypotheses to test.

## 3. Structure

List must/should/won't features, screens, navigation and core user flows.
For each affected screen, cover empty, loading, error, success, offline and
permission-denied states, or explain why a state does not apply.
Use `prototype` to build a throwaway clickable grey-box HTML model before visuals.
Make the primary and recovery flows navigable. In T3, show the actual HTML with
`html_preview`, then `html_render`; do not start a server merely to display it.
Get sign-off on the screen/flow/state inventory and working structure.

## 4. Brand and system

Offer two or three style tiles using real sample content: palette, type,
icon style, sample components and voice. Founder selects the direction.
Follow `impeccable` to write root DESIGN.md: tokens and core buttons, inputs,
cards, lists, sheets and navigation. Use `web-typography`; apply native platform
guidance through `ios-hig-design` on mobile. Respect accessibility and licensing.
Get sign-off on the chosen visual system before the high-fidelity prototype.

## 5. Prototype, validate and hand off

Build clickable core flows in the chosen system, including the relevant states.
Show them through the environment's supported preview. Review with
`ux-heuristics`, `design-everyday-things` and `impeccable critique` against DESIGN.md.
Fix substantial findings and recheck the affected flows before handoff. Use
agent review, accessibility checks and the supported preview as the evidence for
these design phases; participant recruitment is not a prerequisite before an MVP
candidate exists.

Get sign-off on the final prototype, state behavior and remaining risks. Schedule
mvp-testing.md in the installed project lifecycle docs after the candidate is
usable and before any production authorization. design-sprint is an optional
method for that gate, not a required design phase. Never fabricate participants.
Follow `docs/agents/coding-workflow.md#plan` for the validation and scope gates.
Use `to-spec` to put screens, state behavior and acceptance in the spec issue,
then `to-tickets`; tokens/theme are the first scaffold ticket for new UI work.
Attach/link evidence using the tracker, with secrets and private data removed.

## Artifact adapter

Only root PRODUCT.md and DESIGN.md persist as committed design artifacts.
This overrides Impeccable init's `.impeccable` commit instructions and research's
default output location. Put transient research/configuration under /tmp; ignore
any required local tool cache or `.impeccable` artifacts before committing.
Extract durable decisions into PRODUCT.md/DESIGN.md instead of committing duplicate
design documents. Preserve existing project-owned artifacts unless their removal
is explicitly in scope.
Keep prototypes, style tiles, screen inventories, flows and state lists in /tmp
or the spec issue. Ignore tool-generated caches and receipts. After build,
source/tests establish behavior; update durable product/design decisions without
creating a second implementation mirror.
