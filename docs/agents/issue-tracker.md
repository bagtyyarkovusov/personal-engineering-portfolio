# Issue Tracker: GitHub

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

Repository: `bagtyyarkovusov/personal-engineering-portfolio`

## Conventions

- Create an issue: `gh issue create --title "..." --body "..."`
- Read an issue: `gh issue view <number> --comments`
- List issues: `gh issue list --state open --json number,title,body,labels,comments`
- Comment on an issue: `gh issue comment <number> --body "..."`
- Apply or remove labels: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`
- Close an issue: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v`. The `gh` CLI does this automatically when run inside this clone.

## Closure Rule

An issue may only be closed when **all** of the following are true:

1. The implementation commit(s) have landed on `main` and been pushed to `origin/main`.
2. The acceptance criteria checkboxes in the issue body are checked (`[x]`).
3. Any labels that no longer apply (e.g., `needs-triage`) are removed before or at closure.
4. The closure comment references the commit SHA or PR that merged the work.

No "local-only" closures. If the work is done on a branch but not yet on `main`, the issue stays open until merge.

## When A Skill Says "Publish To The Issue Tracker"

Create a GitHub issue.

## When A Skill Says "Fetch The Relevant Ticket"

Run `gh issue view <number> --comments`.
