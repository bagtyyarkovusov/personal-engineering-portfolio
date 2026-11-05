# Local testing

This is the executable local runbook. [Environment](environment.md) owns device,
browser, secrets and permission rules; do not duplicate those tool instructions here.

## Prepare

- Install dependencies with the configured package manager: `pnpm install --frozen-lockfile`.
- Create ignored local environment files from: copy `.env.example` to `.env.local`; GitHub OAuth values are only needed for admin sign-in.
- Start dependencies and apply local migrations/seeds: `pnpm db:start` if Postgres is not already up (check `docker ps` first), then `pnpm db:migrate` for schema changes, `pnpm db:generate` and `pnpm db:seed`. Never `prisma db push`.
- Check existing processes and ports against Environment's project-level table.

Keep local configuration pointed at isolated development services.
Never copy production data into a local fixture without explicit authorization.

## Run the stack

Start from your own worktree using: the root checkout's server on port 3005 is shared; do not start or stop it. To verify a worktree change, run `pnpm exec next dev --port 3100` (or `pnpm build && pnpm exec next start --port 3100` for prod-like checks) on a free port of 3100 or above, using the existing local Postgres. Stop it when done, and never run two heavy builds at once.
Confirm readiness using: `curl -s -o /dev/null -w "%{http_code}" http://localhost:<port>/api/health` returns `200`; `pnpm db:verify` for Postgres.
Record which process serves which worktree; a running server may serve another checkout.
Use background execution supported by the harness and keep logs under `/tmp`.

## Sign in

Local test account roles and safe provisioning: one owner account; there are no other roles.
Sign-in flow and local-only code/credential retrieval: GitHub OAuth restricted to `AUTH_OWNER_GITHUB_ID`; set `AUTH_URL` to the port you run on.
Admin or privileged test flow: `/admin` requires the owner GitHub sign-in; without it, verify only that admin routes redirect to `/login`.
Describe secret retrieval, never secret values. Use synthetic accounts.
Keep sessions when safe instead of repeatedly consuming rate-limited sign-in codes.

## Simulator or emulator flow

Preferred platform, target and app identifier come from Environment's device setup.
Build/install and development-server connection: not used.
Navigation to the test surface: not used.
Native rebuild triggers for this stack: not used.
Mark this section not used when there is no native app.

## Proof

The [delivery workflow](coding-workflow.md#prove) owns required evidence.
Project-specific acceptance checks and runtime proof: `pnpm typecheck`, `pnpm test`, `pnpm build`, and Playwright against your port with `PLAYWRIGHT_BASE_URL=http://localhost:<port> pnpm test:e2e` (projects: smoke, a11y, private-room). UI changes also need screenshots at 390 px and 1440 px. Public copy follows the HITL gate in `docs/context/product/CONTEXT.md`.
Include accessibility, error recovery and target platform coverage where applicable.
For documentation-only changes, check links, placeholders and independence.
Report unavailable environments and exactly which behavior remains unobserved.

## Finish

Project cleanup and generated-file caveats: remove `.next/`, `test-results/` and `playwright-report/` output from your worktree if needed; never commit screenshots or receipts; leave the shared Postgres volume and the port 3005 server alone.
Stop only processes started by your session and release only your device/browser sessions.
Inspect `git diff` for generated noise before committing.
Leave shared services in their previous state unless the task authorized a change.
