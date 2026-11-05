# Triage labels

`triage` assigns exactly one of these labels to each issue.
Native dependencies track blocking separately; see the [issue tracker](issue-tracker.md).

| Label | Meaning |
|---|---|
| `needs-triage` | Founder evaluation needed; default for incoming issues. |
| `needs-info` | Waiting on the reporter for details. |
| `ready-for-agent` | Fully specified; an agent can pick it up cold. |
| `ready-for-human` | Needs founder judgment, design or a sensitive decision. |
| `wontfix` | Will not be done. |

## Labels in this repository

All five labels already exist, with their own colors and descriptions. Leave them as they are.
Create a label only if it is missing, and never pass `--force`, which overwrites
existing labels. Follow [GitHub operations](github-operations.md) for repository selection.

```bash
gh label list --limit 100   # check first
gh label create <missing-label> --color <hex> --description "<meaning>"
```

Supplementary labels:

| Label | Meaning |
|---|---|
| `HITL` | Needs the founder's review or approval, including public copy and positioning (see the HITL gates in `docs/context/product/CONTEXT.md`). |
| `deferred` | Parked until further notice. |
| `Sandcastle` | Picked up by Sandcastle agent automation. |

## Change state

Remove the old triage label and add the new one in the same edit:

```bash
gh issue edit <number> --remove-label needs-triage --add-label ready-for-agent
```

A `wontfix` label records disposition; also close the issue with a reason.
Area/type labels may supplement these states but must not replace them.
