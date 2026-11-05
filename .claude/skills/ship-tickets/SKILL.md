---
name: ship-tickets
description: Deliver a spec's ticket graph as small PRs to main, with full-send or full-stop.
---

# Ship tickets

Read the spec issue, all child tickets, dependencies and later founder corrections.
Read AGENTS.md and docs/agents/{coding-workflow,models,environment}.md.
Use the project's configured tracker. A missing criterion or contradictory graph
needs clarification before dependent work starts; investigate facts yourself.

## Mode and graph

Carry the founder's explicit mode into every ticket. `full-send` authorizes merging
every ticket that passes the merge gate, including auth, payments, permissions,
migrations, data deletion and concurrency. Give those areas the model effort in
models.md. It does not authorize production deploys or other external actions
outside the environment guide. `full-stop` parks every PR for founder approval.
Without an explicit mode, suggest one using the workflow; a suggestion grants no
merge permission.

Keep a small ledger in the thread: ticket, blockers, owner/task, branch, PR,
proof, review and merge state. Source and tests own implemented behavior.
Before dispatch, fetch main and record its SHA as the fixed starting base in the
ledger. Preserve it through every merge so the final review covers the whole run.
Use at most three concurrent implementation delegates unless the founder changes
the limit. One ticket owns one small PR from current main. Tightly related tickets
may share a PR only under the project's delivery contract. Use no integration branch.

A ticket is unblocked when its required changes are on main, not merely in a PR.
On full-stop, continue independent tickets while parked PRs wait; dependent tickets
wait for merge. Check for cycles, already merged work and overlapping ownership.

## Dispatch

Use the environment's delegation procedure and model settings. In T3, discover
capabilities once, then `delegate_task` with `isolation: "worktree"`; the tool owns
checkout creation. Never create a child's checkout in a shell or its task prompt.
Do not substitute another provider/model if the selected one is unavailable.
Outside T3, use the harness's isolated agent support; if unavailable, run tickets
sequentially in your own worktree and disclose the limitation.

Each child gets the issue/spec, exact acceptance and exclusions, mode, base,
owned paths, required proof, applicable guidance, and known dependency decisions.
Tell it to implement, prove, run `sol-loop`, file a real PR and address findings.
Authorize a child to start a review delegate only when the harness permits it.
When nested review is unavailable, the child stops after proof/commit and the
parent obtains independent review before shipping. Children never watch PRs.
The agent creating, taking over or pushing a PR must link it immediately as its
next tool call, following `docs/agents/github-operations.md#pr-linking-and-waits`.
Parent owns merge decisions and watches; children report PR URL, head SHA and
checks/reviews in their final line. Preserve contributor credit.

Follow each delegate's returned `next`. In T3, completion wakes the parent:
end the turn instead of polling, sleeping or launching a replacement.
Every new review/re-check is a fresh task. Cancel a replaced or unneeded task.
Do not edit a running child's owned paths.

## Integrate

On completion, inspect the actual diff, acceptance, proof and review. Resolve real
findings before asking for approval. Rebase a ready ticket onto current main;
prove any conflict resolution and re-review changed behavior. Link every PR you
create/take over/push with the host's PR linking tool.

Apply `full-send` or `full-stop`, `file-pr` and `babysit-pr` to each result.
Parent watches when an authorized merge still waits on checks/reviews; end the
turn after starting the watcher. A wake is news, not approval. Never poll CI.
Merge only when required checks pass, review covers the current diff, main is
current, all acceptance holds, and branch protection allows it. Never bypass it.
An available watcher is not an excuse to park a PR whose gate already passes.

After each merge, remove that ticket's owned worktree, refresh main and dispatch
newly unblocked tickets. Stop the affected ticket on failed proof or an unresolved
conflict; explain the concrete blocker. Continue independent work when safe.

## Finish

Run the configured cross-ticket checks and exercise the combined critical flows.
Get a final `sol-loop` pass, or `council` when requested, over the combined result
against the spec. Explicitly pass the recorded starting SHA as the review base
and review its diff to final HEAD; do not recompute a merge-base against current
main, which would hide already merged work. Fix findings as small tracked PRs, rather than reopening merged
branches. Report each PR/merge, proof, important decisions and parked/blocked work.
Call completion only when all requested acceptance holds. Unwatch active PRs when
handing work back, following the host's procedure.
