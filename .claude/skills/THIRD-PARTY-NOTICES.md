# Upstream skills

The kit vendors skills from these repositories, each pinned to one commit in `kit.json`. Unpatched copies are byte-identical to upstream; patched skills are intentionally divergent and carry a reason in kit.json. `node scripts/check.mjs --verify` enforces byte identity for unpatched copies, and CI runs it. Patched copies are compared file-by-file against their pinned upstream tree outside the manifest-declared `patchedFiles`. Each patch list is a unique safe relative path; edits, additions and deletions are permitted only at those paths, while every other upstream file must remain byte-identical. Undeclared files or edits fail verification. License and NOTICE files are listed with hashes in `kit.json`; `--verify` also checks immutable commit-pinned source URLs where recorded.

| Upstream | License | Skills |
|---|---|---|
| [t3dotgg/tstack](https://github.com/t3dotgg/tstack) | MIT ([text](licenses/t3dotgg-tstack.LICENSE)) | babysit-pr, council, file-pr, full-send, full-stop, leaving-pr-comments, modernize, sol-loop, takeover |
| [mattpocock/skills](https://github.com/mattpocock/skills) | MIT ([text](licenses/mattpocock-skills.LICENSE)) | core: grilling, grill-me, grill-with-docs, tdd, diagnosing-bugs, domain-modeling, prototype, to-spec, to-tickets, triage, retro, research, codebase-design, improve-codebase-architecture, handoff; extra: wizard, implement, wayfinder, teach, writing-for-agents, setup-pre-commit, git-guardrails-claude-code, to-questionnaire, wait-what, setup-ts-deep-modules |
| [wondelai/skills](https://github.com/wondelai/skills) | MIT ([text](licenses/wondelai-skills.LICENSE)) | ui: ux-heuristics, design-everyday-things, refactoring-ui, web-typography, lean-ux; mobile: ios-hig-design; extra: microinteractions, design-sprint |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 ([text](licenses/pbakaus-impeccable.LICENSE), [notice](licenses/pbakaus-impeccable.NOTICE.md)) | ui: impeccable |

Left out on purpose: Matt Pocock's `implement-spec` (one integration branch per spec; the kit ships each ticket as its own PR with `ship-tickets`), `setup-matt-pocock-skills` (`kickoff` does that setup), `code-review` (its name collides with Claude Code's built-in `/code-review`), `pr` (overlaps `file-pr`), and the other in-progress and course-authoring skills. `setup-ts-deep-modules` is
the deliberate in-progress exception, offered only as an optional extra.

## Updating

1. `node scripts/check.mjs --drift` lists skills that changed upstream since the pin.
2. Set the new commit in kit.json, run `node scripts/vendor.mjs <skill>...`, and re-apply any `patched` change by hand.
3. Run `node scripts/check.mjs --verify`, then open one PR per upstream.

## Local changes

Modified 2026-11-05: `grilling` uses plain Markdown rounds; `sol-loop` reviews
project acceptance, standards and UI evidence using project model policy; `council`
honors project member/model policy before upstream defaults. Their upstream
licenses remain in licenses/; kit.json records each patch. `to-spec` and
`to-tickets` route through project lifecycle/setup and the green small-PR contract
instead of excluded setup or integration-branch workflows.

`ship-tickets`, `product-design`, `release` and `product-review` are kit-owned
workflow skills. They compose the pinned upstreams and project guides.
