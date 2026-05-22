# Post-Deploy Smoke Check Runbook

> **When to run:** After every Railway deployment from `main`, or after any infrastructure change.

## Quick Check (2 minutes)

Run these checks against the live production URL immediately after a deploy.

### 1. Homepage loads

```bash
curl -s -o /dev/null -w "%{http_code}" https://$DEPLOY_DOMAIN/
```

**Expected:** `200`

**Verify visually:** Trust claim, availability badge, and CTAs render without layout shifts.

### 2. Public pages render

```bash
for path in /work /engineering-system /build-log /about /work-with-me; do
  echo -n "$path: "
  curl -s -o /dev/null -w "%{http_code}" "https://$DEPLOY_DOMAIN$path"
  echo
done
```

**Expected:** All return `200`.

### 3. Admin guard is enforced

```bash
curl -s -o /dev/null -w "%{http_code}" https://$DEPLOY_DOMAIN/admin
curl -s -o /dev/null -w "%{http_code}" https://$DEPLOY_DOMAIN/admin/projects
```

**Expected:** `307` redirect to `/login` (Next.js App Router uses 307 for internal redirects), or `200` on `/login` with GitHub sign-in prompt.

**Verify:** No admin content leaks in the response body.

### 4. Invalid private room fails safely

```bash
curl -s -o /dev/null -w "%{http_code}" "https://$DEPLOY_DOMAIN/room/invalid-token"
```

**Expected:** `404` or `410`. No project names, room IDs, or stack traces exposed.

### 5. Health endpoint

```bash
curl -s https://$DEPLOY_DOMAIN/api/health
```

**Expected:** `{"status":"healthy","checks":{"database":"connected"}}` with HTTP `200`.

If the health endpoint returns `503`, the application cannot reach PostgreSQL. Check `DATABASE_URL` in Railway immediately.

## Capturing Evidence

After a successful deploy, capture evidence for the portfolio's own pipeline evidence record:

1. **Screenshot the homepage** — proof that the latest build is live.
2. **Copy the Railway deploy log** — save the commit SHA and build duration.
3. **Run the quick checks above** — paste the output into a `PipelineEvidence` record.
4. **Record in admin:** `/admin` → Pipeline Evidence → New → category `deployment`.

Example evidence entry:

| Field | Value |
|-------|-------|
| Label | Railway deploy — commit `84e0baa` |
| Description | Zero-downtime deploy from main. All 5 smoke checks passed. Build time 3m 12s. |
| Category | `deployment` |
| URL | Railway deploy log link (admin-only) |
| Status | `published` |

## Scriptable Checks

A local script version is available at `scripts/smoke-check.sh`:

```bash
# Requires DEPLOY_DOMAIN environment variable
DEPLOY_DOMAIN=example.com ./scripts/smoke-check.sh
```

The script exits `0` only if all checks pass. It prints a JSON summary suitable for CI artifacts or evidence capture.

## What to Do If a Check Fails

1. **Do not panic.** Railway deployments are reversible via `railway rollback`.
2. **Check Railway dashboard logs** for application errors or migration failures.
3. **Verify DATABASE_URL** is reachable from the deployed container.
4. **Run the failing check locally** against `localhost:3005` to determine if the issue is code or infrastructure.
5. **Open an issue** if the failure is reproducible; hotfix via PR if urgent.

## Migration Failure Recovery

The production container runs `prisma migrate deploy && node server.js` on startup. If migrations fail:

1. **The container will crash-loop.** Railway will show repeated restart attempts.
2. **Do not restart the container blindly.** Check the logs first:
   ```bash
   railway logs --service portfolio
   ```
3. **Common causes:**
   - Migration file was edited after it was already applied (Prisma detects hash mismatch).
   - Database is unreachable (`DATABASE_URL` incorrect or network issue).
   - Migration contains destructive change that conflicts with existing data.
4. **Recovery steps:**
   - If the migration was never applied to production, revert the migration file in a hotfix PR and redeploy.
   - If the migration was partially applied, use `prisma migrate resolve` manually via Railway's shell access, then redeploy.
   - For data conflicts, restore from Railway's automated PostgreSQL backups before retrying.
5. **Prevention:**
   - Always run `prisma migrate dev` locally and verify the generated SQL before committing.
   - The CI `quality` job runs `prisma validate` and `prisma migrate deploy` against a fresh Postgres container on every PR.

## Playwright Trace Artifacts

When E2E tests fail in CI, Playwright traces are uploaded as GitHub Actions artifacts:

- **Config:** `trace: "on-first-retry"` in `playwright.config.ts`
- **Upload:** `actions/upload-artifact@v4` with `if: failure()`
- **Contents:** Each artifact contains `test-results/` with trace ZIPs, screenshots, and error context markdown.
- **How to view:** Download the artifact, unzip, and open `trace/index.html` in a browser or use `npx playwright show-trace trace.zip`.
- **Retention:** Artifacts are retained for 90 days by default (GitHub default).

## Security Notes

- Never paste real private room tokens into this runbook or evidence records.
- Never commit Railway tokens or `DATABASE_URL` values.
- The smoke check script only uses `GET` requests against public surfaces.
