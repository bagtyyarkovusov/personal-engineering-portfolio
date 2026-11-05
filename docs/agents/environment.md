# Environment

This guide owns tool use and permission boundaries.
[Local testing](local-testing.md) owns the project run/sign-in procedure.

## Machine-level

T3 Code and macOS are the reference harness examples. On another host, inspect
its available device, browser, delegation and secret tools and use their supported
equivalents; report missing capabilities and keep the permission boundaries below.
Outside T3, use plain CLI equivalents supported by the host.

### Devices

Use iOS Simulator or Android Emulator according to the ticket and project setup.
In T3, call `device_list`, then `device_open` with `hostId` and device `id`.
Use the returned `agent-device` command for every app launch/relaunch, deep link,
tap, text entry, alert, setting, snapshot, screenshot and recording.
Open the app before taking snapshots or input; inspect `help <command>` for options.
Use `device_screenshot` to look at the screen and refresh element refs after navigation.
Use neither `simctl`, `idb` nor `adb` for UI. Build/install tools may collect logs, forward
ports and perform operations unavailable through agent-device.
For a remote device, use the same tools; drive over SSH only when explicitly asked.
If a device tool fails, quote the error and follow its advice once.
If it still fails, report and stop device work. Never reuse or close another session.
Release only your own device session when finished.

### Browser and visuals

Use `preview_*` only when asked for browser work, including a named page or tab.
Start with `preview_status`, then `preview_open` if no tab can be automated.
Prefer snapshot locators. Switch browsers only when tools are absent, opening is
unsupported, the user asks, or two preview calls fail on one step; quote the error.
For public-page reading without a browser request, use fetch/search.
Close tabs you opened unless the user asked for them or uses them.
For requested visuals or trend/comparison charts, pass HTML to `html_preview`,
then `html_render`; do not start a server just to display them.
For an image intended for posting or use elsewhere, provide a PNG file and path.

### Delegation and background work

Ordinary coding needs no orchestration tools. Delegate only when the task or
applicable skill calls for it; obey a request to work without delegates.
Use native subagents for same-provider work with inherited settings that finishes
this turn. Use `delegate_task` for another provider, requested settings, a separate
checkout (`isolation: "worktree"`), background work, or an explicit tool request.
Call `orchestrator_capabilities` once before the first delegate; settings belong
in `target.options`. Let the tool create child worktrees.
Follow a delegate's returned `next`; never poll its status or sleep for it.
Start each delegate review/re-check as a new task; fix small findings yourself.
Cancel replaced or unneeded delegates with `task_cancel`, never by interrupting
the child thread. Given a thread ID, read it with `t3_thread_read` before answering
about it; reference the returned thread link.
Create top-level threads only when the founder asks for a new thread.
Use `t3_background_wait` for supported background-command completion.
[Models](models.md) owns model and effort selection.

### Local tools and secrets

Docker is the local dependency sandbox. Inspect existing containers, ports and
worktree ownership before starting another stack; stop only processes you own.
Use an isolated local database for destructive tests and disposable fixtures.
`gh` uses existing authentication; [GitHub operations](github-operations.md) owns usage.
For a configured project, use its hosting provider CLI or API for status/logs/metrics
and its mobile-build provider CLI or API for profiles; Railway and EAS are examples,
not defaults.
Inspect the selected project and environment before any remote command.
Use `request_secret` for secrets in T3; pass its secret reference to tools or request
file delivery for shell use. Outside T3, use the host's secure credential mechanism.
Keep credentials, tokens and personal data out of output, commits and screenshots.

## Permissions

Within authorized task scope, agents may inspect source and remote status/logs,
edit in their worktree, run local checks, build/install development apps, start or
stop their local processes, migrate/seed/reset isolated local test data, and rerun CI.
Do not destroy a shared Docker volume as if it were an isolated test database.
PR merge authorization follows the [delivery contract](coding-workflow.md#delivery-contract).

Ask the founder before:

- Production deploys or data deletion/resets outside the local stack.
- Any hosting or mobile-build provider settings/variables, new services or environments
  (including Railway, EAS, Vercel and Fly).
- Store submissions, paid services or billable infrastructure/builds, or legal commitments.
- Force-pushing another person's branch or closing another person's PR.
- Deleting shared Docker volumes or changing shared CI/protection settings.

Existing explicit authorization covers the named action; do not ask again.
Report host guard refusals through the rule in [AGENTS.md](../../AGENTS.md).

## Project-level

Kickoff fills this section from grilling; use `not used` for absent services.
Do not infer that these services exist from the machine tool list.

| Fact | Project value |
|---|---|
| Toolchain/config entry point | `package.json` scripts and `packageManager` (pnpm 9), `.nvmrc` (Node 20), `.npmrc`, `prisma/schema.prisma`, `prisma.config.ts` |
| Local services and port allocation | Docker Compose Postgres 16 on host port 5433 (shared volume `postgres_data`). Port 3005 is the root checkout's `pnpm dev` and its Next.js MCP. Worktrees use 3100 and up; see [local testing](local-testing.md#run-the-stack) |
| Hosting provider, project and services | Railway: the Next.js app from the `Dockerfile` plus Railway PostgreSQL. Inspect with `railway status` from a linked checkout |
| Staging URL | not used |
| Production URL | https://bagtyyar.dev |
| Mobile-build provider, project and profiles | not used |
| Simulator/device targets and app identifiers | not used; browser only (390 px and 1440 px viewports for UI proof) |
| Deployment triggers, migrations and rollback runbook | Manual `railway up` by the founder, only with explicit approval; the CI `RAILWAY_TOKEN` is invalid, so merges do not deploy. The container runs `prisma migrate deploy` before `node server.js`. `prisma/seed.ts` supplies the baseline content, but admin actions can also write production rows, and the seed deletes every Build Log entry. Check for admin-written rows and take a backup before any production reseed. Post-deploy checks and rollback: `docs/context/delivery/post-deploy-runbook.md` |
| CI lanes and required checks | `.github/workflows/ci.yml` on PRs and pushes to `main`: `quality` (Prisma validate, migrate deploy, seed, typecheck, unit tests, build, Docker build), `e2e`, `smoke-gate`, `a11y-gate`, `private-room-gate`. `main` has no branch protection, so none are enforced as required checks; treat all five as the merge gate |

