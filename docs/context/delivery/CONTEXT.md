# Delivery Context

## Delivery Principle

This portfolio must be built like a client product. Maintainability, testing, Dockerization, CI/CD, and deployment evidence are part of the product promise.

## Testing Strategy

Use:

- TypeScript strict mode
- linting and formatting
- Vitest for unit tests
- integration tests where practical
- Playwright for E2E smoke tests
- accessibility smoke checks
- Three.js render/fallback checks

Important flows:

- public homepage loads
- project page loads
- engineering system page loads
- admin route is protected
- owner can create or edit a project/milestone
- private room token displays read-only content
- invalid or revoked private room token fails safely

## CI Quality Gate

GitHub Actions is the quality gate.

CI should run:

- install
- lint
- typecheck
- unit tests
- Prisma validation or migration check
- build
- Playwright smoke tests

## Deployment

Railway is the deployment platform.

Recommended flow:

1. Push PR or branch.
2. GitHub Actions runs the quality gate.
3. Merge to main.
4. Railway deploys from main.
5. A post-deploy smoke check verifies the live URL.
6. Admin can record a `PipelineEvidence` snapshot for public trust proof.

V1 Railway expectations:

- Railway deploys from `main`
- GitHub Actions is the quality gate before merge and deploy
- Railway hosts the Next.js app
- Railway provides PostgreSQL or connects to the selected production PostgreSQL service
- environment variables live in Railway, not in the repo
- production deploy uses the Dockerfile once available
- first deployment can use the Railway-generated domain
- custom domain comes later
- post-deploy smoke checks should validate homepage, public project page, admin guard, and invalid private-room path

Railway configuration is HITL because it requires human access, secrets, and confirmation of the live deployment URL.

## Docker

Docker should support repeatable local and production-like execution.

The app should be deployable with a production Dockerfile compatible with Railway, while local development can use Compose for Postgres and supporting services.
