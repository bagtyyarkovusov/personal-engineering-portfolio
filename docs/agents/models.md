# Models and effort

This is the kit default; the project may override it explicitly here.
Keep model selection separate from the [delivery workflow](coding-workflow.md).

## Default model

Use Sol 6.1 (`gpt-6.1-sol`, Codex provider) for all agent work, including
implementation, research, `sol-loop` review and `babysit-pr` fixes.
Keep this version until the founder changes it.
Use Opus 5.5 (`claude-opus-5-5`) only for `council` or when the founder names it.
An Opus session delegates implementation, research and review to Sol through
`delegate_task`, rather than starting Opus subagents.
If Sol is unavailable, ask; never silently switch.

## Effort

| Work | Effort |
|---|---|
| Lookups, simple research, mechanical edits | `low` |
| Implementation, `sol-loop`, babysit fixes | `medium` |
| Auth, permissions, migrations, data deletion, payments, concurrency | `xhigh` |
| Council | `high` |

Sol uses `reasoningEffort`; Opus uses `effort`.
Use no max/ultra, Fast mode or priority tier unless asked.
Check available providers and options through the
[environment delegation procedure](environment.md#delegation-and-background-work).

## Council

Use these members at `high` effort:

- Sol 6.1: `gpt-6.1-sol`, Codex provider.
- Opus 5.5: `claude-opus-5-5`, Claude provider.
- Muse Wonder 1.0: `muse-wonder-1.0`, Muse Code provider.

If Opus or Muse is unavailable, run with reachable members and name the missing ones.
Sol is required; its unavailability follows the default-model rule above.

## Observed availability

Checked with `orchestrator_capabilities` on 2026-11-05; founder confirmed this policy.

- Sol 6.1 is reachable through the `codex_work` provider instance; the `codex`
  instance is disabled. `reasoningEffort` offers low to ultra.
- Opus 5.5 is reachable through `claudeAgent`; `effort` offers low to max.
- Muse Wonder 1.0 is reachable through the `muse` provider instance.

Re-check before a council or when a delegate fails to start.
Independent quality scoring of the public site uses a Sol delegate, not the
session that made the change.
