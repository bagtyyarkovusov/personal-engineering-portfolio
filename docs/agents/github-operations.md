# GitHub operations

Use the installed `gh` CLI and existing authentication.
Confirm the target with `gh repo view --json nameWithOwner` against the
[issue tracker](issue-tracker.md); outside the checkout pass `--repo owner/repo`.
Check installed `--help` before using unfamiliar flags.

## Read and write

Read only the fields needed, but read the complete governing issue before implementation.

```bash
gh issue view <number> --json number,title,body,labels
gh issue view <number> --comments
gh issue list --state open --limit 30 --json number,title,labels
gh pr view <number> --json url,headRefOid,reviewDecision,mergeStateStatus
gh pr checks <number>
```

Read formal reviews, older governing comments and full criteria when relevant;
missing rows or bounded output do not prove completion.
Put exact multiline Markdown in a file under your worktree or `/tmp`.
Preview it before sending an authorized write:

```bash
gh issue create --title "<outcome>" --body-file /tmp/issue.md --label needs-triage
gh issue comment <number> --body-file /tmp/update.md
gh pr create --title "<outcome>" --body-file /tmp/pr.md
gh pr edit <number> --body-file /tmp/pr.md
```

Only send messages/comments when the task or an invoked skill authorizes them.
[Environment](environment.md#permissions) owns permissions for shared settings and other actions.

## PR linking and waits

In T3, call `link_pull_request` with the full URL as the next call after creating,
taking over or pushing a PR; link every stack layer. Report linking failures.
Use `watch_pull_request` when asked to monitor, or when authorized work still waits
on checks/reviews. Finish branch updates and pushes first, then watch and end the turn.
Use no sleep loops, `gh --watch`, status pollers or scheduled wakeups for PR waits.
Links and watches persist across pushes. Delegated children never watch.
Before final handback, unwatch PRs you watch with `unwatch_pull_request`.
Outside T3, use the host's supported asynchronous notification mechanism;
if none exists, report the pending state instead of claiming continuous monitoring.

## Merge

The [workflow](coding-workflow.md#ship) owns authorization and the merge gate.
Use squash merge (`gh pr merge <number> --squash --delete-branch`).
Never use `--admin` or bypass protection. Follow the
[workflow cleanup step](coding-workflow.md#ship) for local worktrees.

For new repositories, kickoff configures squash only, delete branch on merge,
allow auto-merge and linear history, with no required human approvals.
Add required `pr`/CI checks only once the first scaffold ticket creates CI.
If the GitHub plan forbids protection, explain the limitation and enforce the
workflow gate manually; do not claim GitHub enforces unavailable protection.
