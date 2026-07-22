import { PrismaClient, ContentStatus, ContentVisibility } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean up old portfolio project if it exists (removed from portfolio)
  await prisma.project.deleteMany({
    where: { slug: "personal-engineering-portfolio" },
  });

  const autoTmData = {
    slug: "car-marketplace",
    title: "AutoTM",
    summary:
      "Turkmenistan's vehicle marketplace rewrite — an active Turborepo rebuild with Expo, NestJS bounded contexts, Prisma, and air-gapped deployment constraints.",
    body: `## Context

AutoTM is a vehicle listing and transaction platform built specifically for the Turkmenistan market. The original version was a Flutter mobile app with a stock NestJS API. The current rewrite is a ground-up rebuild of the product and delivery system: clearer domain boundaries, shared contracts, mobile-first listing workflows, and deployment constraints suitable for infrastructure inside Turkmenistan.

## Engineering Decisions

- **Monorepo**: Turborepo + pnpm workspaces with 7 apps and 5 shared packages. Shared Prisma schema, Zod contracts, and UI tokens consumed by every client.
- **Mobile**: Expo SDK 55 + React Native 0.83.6 with NativeWind v4 and React Native Reusables, replacing Flutter for better ecosystem access and team velocity.
- **API**: NestJS 11 on Fastify with Level 2 bounded contexts — pure TypeScript domain layer, one use-case per file, ports and adapters for cross-context communication.
- **ORM**: Prisma 7 with explicit migrations and a single schema file in \`packages/db\`, replacing Sequelize for type safety and reliable migrations.
- **Web**: Next.js 16 + Tailwind CSS v4 + shadcn/ui for both public site (auto.tm) and admin dashboard (admin.auto.tm).
- **Media pipeline**: MinIO (S3-compatible, self-hosted) + Sharp for variant generation, replacing Firebase Storage. Client-side compression is mandatory before upload.
- **Real-time**: Socket.IO 4 with Redis adapter for horizontal scaling, planned for S7 (buyer-seller chat).
- **Auth**: Phone OTP via a custom SMS gateway fleet (5–20 Android phones running a Kotlin agent) + JWT access tokens + bcrypt-hashed refresh tokens. Multi-device sessions capped at 10 with FIFO eviction.
- **Job queue**: BullMQ + Redis + dedicated NestJS worker app for async processing.
- **Hosting**: Fully air-gapped inside Turkmenistan — Docker Compose on self-hosted Ubuntu, Caddy reverse proxy with auto-TLS. No cloud dependencies.
- **Deployment**: Multi-service Docker images built via GitHub Actions (self-hosted runner), bundled into tarballs, and transferred to Turkmenistan via SCP/USB.

## Current State

**Phase 1 — Marketplace MVP**

- **S1 (Scaffold)**: Shipped — Turborepo structure, CI pipeline, Docker Compose dev environment.
- **S2 (Identity)**: Shipped — Phone OTP login, JWT sessions, multi-device cap, rate limiting, full test coverage.
- **S3 (Catalog)**: Shipped — Trilingual catalog seed data, read endpoints, FX rates, and shared contracts.
- **S4 (Listings CRUD)**: Current focus — Prisma schema and API use-cases are being wired to the mobile 7-step listing wizard, upload state machine, and listing lifecycle. Known gaps are tracked explicitly: autosave edge cases, orphan media cleanup, and public listing-detail route.
- **S5–S10**: Next — Search/filters, garage/dealership, chat, notifications, admin dashboard, production polish, and soft launch.

**Testing**: API, mobile, and SMS-gateway suites cover the shipped slices. CI remains the source of truth for regressions.

**Documentation**: 26 Architecture Decision Records, CONTEXT.md per workspace, sprint files with Definition of Done, and agent skill docs for mobile and TypeScript runtime boundaries.`,
    stack: [
      "Expo SDK 55",
      "React Native 0.83",
      "NativeWind v4",
      "NestJS 11",
      "Fastify",
      "Prisma 7",
      "PostgreSQL 16",
      "Redis 7",
      "BullMQ",
      "Next.js 16",
      "Tailwind CSS v4",
      "shadcn/ui",
      "MinIO",
      "Sharp",
      "Zod",
      "Socket.IO",
      "Turborepo",
      "Docker",
      "Caddy",
    ],
    outcome:
      "Active ground-up rewrite of Turkmenistan's vehicle marketplace. S1–S3 are shipped; S4 Listings CRUD is the current build slice. The architecture is designed for air-gapped deployment with no cloud dependency on the critical production path.",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 0,
    startedAt: new Date("2026-05-13"),
    completedAt: null,
  };

  const autoTm = await prisma.project.upsert({
    where: { slug: autoTmData.slug },
    update: autoTmData,
    create: autoTmData,
  });
  console.log(`Seeded: ${autoTm.title}`);

  // --- Portfolio Project (meta case study) ---
  const portfolioData = {
    slug: "personal-engineering-portfolio",
    title: "Personal Engineering Portfolio",
    summary:
      "The portfolio you are viewing — a live meta case study in delivery discipline, Railway deployment, GitHub Actions gates, Docker, Prisma migrations, and private client rooms.",
    body: `## Context

This portfolio is not just a website — it is a working demonstration of the engineering system it describes. Every claim on the homepage is backed by code, tests, deployment configuration, or public evidence. The build quality is part of the product.

## Engineering Decisions

- **Framework**: Next.js 16 App Router with TypeScript strict mode. Server components by default, client boundaries only where needed.
- **Styling**: Tailwind CSS v4 with OKLCH color space, custom design tokens, and shadcn/ui components. Editorial aesthetic — Instrument Serif headlines, IBM Plex Sans body, IBM Plex Mono metadata.
- **Database**: PostgreSQL with Prisma 7. Content status and visibility are separate concerns (draft/published/archived × public/privateRoom/adminOnly).
- **Auth**: Auth.js v5 beta with GitHub OAuth, owner-only access. No client accounts in v1.
- **Private Rooms**: Signed, revocable, SHA256-hashed tokens for read-only client project views. No passwords, no registration friction.
- **Testing**: 138 Vitest unit tests, Playwright E2E smoke tests, WCAG 2.1 AA accessibility scans — all in CI.
- **CI/CD**: GitHub Actions validates Prisma, migrations, seed data, typechecking, unit tests, production build, Docker image creation, smoke flows, accessibility, and private-room access.
- **Deployment**: Multi-stage Dockerfile, Next.js standalone output, Railway container deployment, Railway-managed PostgreSQL, and runtime environment variables for secrets and canonical URLs.
- **Migration discipline**: Production starts with \`prisma migrate deploy\` before \`node server.js\`, keeping local, CI, and Railway schema evolution on the same path.
- **Custom domain**: \`bagtyyar.dev\` is the canonical production URL, with Auth.js and SEO metadata configured through Railway variables.

## Outcomes

- **138 unit tests** across 14 test files covering access tokens, publication policy, markdown safety, auth guards, validations, and design tokens.
- **Railway production path** — Dockerized Next.js app, managed PostgreSQL, startup migrations, custom domain, and runtime env contract.
- **Accessibility-first** — automated axe-core scans on every PR, prefers-reduced-motion support, semantic HTML.
- **Transparent delivery** — build log, milestone tracking, architecture decisions, and pipeline evidence all visible to visitors.`,
    stack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS v4",
      "shadcn/ui",
      "Prisma 7",
      "PostgreSQL",
      "Auth.js",
      "Vitest",
      "Playwright",
      "Docker",
      "GitHub Actions",
      "Railway",
    ],
    outcome:
      "138 tests, GitHub Actions quality gates, WCAG 2.1 AA accessibility checks, Dockerized Railway deployment, startup Prisma migrations, custom domain configuration, and private client rooms. The portfolio proves the engineering system it describes.",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 1,
    startedAt: new Date("2026-05-10"),
    completedAt: null,
  };

  const portfolio = await prisma.project.upsert({
    where: { slug: portfolioData.slug },
    update: portfolioData,
    create: portfolioData,
  });
  console.log(`Seeded: ${portfolio.title}`);

  // --- myORL: client healthcare platform ---
  const myorlData = {
    slug: "myorl-ent-clinic",
    title: "MyORL — ENT Clinic Platform",
    summary:
      "Bilingual healthcare website for a private ENT surgical clinic in Athens — Next.js 16, Strapi 5 CMS, Meilisearch, fully deployed and serving patients.",
    body: `## Context

A private ENT (ear, nose, throat) surgical clinic in Athens needed a modern web presence: a bilingual (Greek/Russian) site with a condition encyclopedia, service and price pages, video content, and appointment booking — maintained by non-technical staff after handover. Client details are anonymized; the site is live and publicly reachable.

## Engineering Decisions

- **Frontend**: Next.js 16 App Router + React 19 + Tailwind CSS v4, bilingual routing (Greek/Russian), server components for fast first paint on clinic Wi-Fi and mobile data.
- **CMS**: Strapi 5 + PostgreSQL 18 so clinic staff edit encyclopedia entries, prices, and videos without touching code.
- **Search**: Meilisearch for instant, typo-tolerant search across conditions and treatments — patients rarely know exact medical spelling.
- **Migration**: Custom extraction tooling (\`myorl-migrate\`) to pull content out of the legacy MODX site into structured Strapi content types.
- **Infrastructure**: Docker Compose + Caddy locally; production deployed on Railway (frontend, Strapi, Postgres, and Meilisearch as separate services).
- **Testing**: Vitest + React Testing Library for components, Playwright for end-to-end flows including booking.

## Outcomes

- **Live in production**, serving real patients — bilingual content, search, and booking all operational.
- **314 commits** across frontend, CMS, and migration tooling.
- **Full handover**: the clinic edits its own content; no developer needed for routine updates.

[Visit the live site](https://nextjs-frontend-production-afcd.up.railway.app) · [Public repository](https://github.com/bagtyyarkovusov/myorl-pavlos)`,
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Strapi 5",
      "PostgreSQL 18",
      "Meilisearch",
      "Docker",
      "Caddy",
      "Vitest",
      "Playwright",
      "Railway",
    ],
    outcome:
      "Live bilingual healthcare platform for an Athens ENT clinic — Next.js 16 frontend, Strapi 5 CMS with full content handover, Meilisearch patient-facing search, and Playwright-tested booking flow. Deployed on Railway and serving real patients.",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 2,
    startedAt: new Date("2026-01-01"),
    completedAt: null,
  };

  const myorl = await prisma.project.upsert({
    where: { slug: myorlData.slug },
    update: myorlData,
    create: myorlData,
  });
  console.log(`Seeded: ${myorl.title}`);

  // --- Gonka: AI inference infrastructure ---
  const gonkaData = {
    slug: "gonka-ai-inference-infrastructure",
    title: "Gonka — AI Inference Infrastructure",
    summary:
      "Specified, deployed, and supported a 24-node GPU cluster (192× RTX 4080) serving open-weight LLMs on the Gonka decentralized AI inference network — plus an OpenAI-compatible API gateway built on top of it.",
    body: `## Context

[Gonka](https://gonka.ai) is a decentralized network for AI inference: hosts run GPU servers serving open-weight models and earn network tokens for verified compute. During the network's early phase, a host engaged me to take their operation from zero to production: hardware selection, procurement guidance (servers sourced from China), deployment, and ongoing operations — delivered with a 3-month support guarantee. Client identity and commercial figures are confidential.

## Scope Delivered

- **Hardware specification**: advised on server selection for a 24-node cluster, 8× RTX 4080 per node — **192 GPUs** in total — balancing inference throughput, memory bandwidth for large models, power, and cost.
- **Model serving**: deployed open-weight LLM inference at scale, including Qwen 235B-class instruction models, during the network's early development phase.
- **Operations**: node setup, network onboarding, monitoring, and a 3-month support engagement covering incident response and tuning.

## GonkaProvider — API gateway (own work, public)

On top of the infrastructure work, I built and open-sourced **GonkaProvider**: an OpenAI-compatible Express/TypeScript gateway that proxies chat completions to Gonka ML nodes via the signed \`gonka-openai\` client.

- Strict TypeScript + Zod validation across the boundary.
- SSE stream validation, reasoning and tool-call aggregation, multimodal normalization.
- ADRs, unit tests, and integration tests.
- Includes an upstream fix for a vLLM chunk-validation bug found while integrating.

## Outcomes

- **192-GPU inference operation** taken from hardware shopping list to revenue-earning production on a live decentralized network.
- **3-month guaranteed support** delivered to completion.
- **Public gateway codebase** demonstrating AI-integration engineering: streaming, validation, and provider abstraction.

[Public repository — GonkaProvider](https://github.com/bagtyyarkovusov/GonkaProvider)`,
    stack: [
      "GPU Infrastructure",
      "RTX 4080 Clusters",
      "Open-Weight LLMs",
      "Qwen",
      "vLLM",
      "Decentralized Inference",
      "Express",
      "TypeScript",
      "Zod",
      "SSE",
      "Docker",
      "Vitest",
    ],
    outcome:
      "24-node / 192-GPU inference cluster specified, deployed, and supported for 3 months on the Gonka decentralized AI network, serving Qwen 235B-class models — plus GonkaProvider, a public OpenAI-compatible API gateway with streaming validation and an upstream vLLM fix.",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 3,
    startedAt: new Date("2026-02-01"),
    completedAt: null,
  };

  const gonka = await prisma.project.upsert({
    where: { slug: gonkaData.slug },
    update: gonkaData,
    create: gonkaData,
  });
  console.log(`Seeded: ${gonka.title}`);

  // --- Milestones for AutoTM ---
  await prisma.milestone.deleteMany({
    where: { projectId: autoTm.id },
  });

  const milestones = [
    {
      projectId: autoTm.id,
      title: "M1 — Hello stack",
      description:
        "Turborepo monorepo scaffold, CI pipeline, Docker Compose dev environment, and local Postgres/Redis/MinIO services.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 0,
      targetDate: new Date("2026-05-14"),
      completedAt: new Date("2026-05-14"),
    },
    {
      projectId: autoTm.id,
      title: "M2 — I can log in",
      description:
        "Phone OTP authentication via custom SMS gateway, JWT access tokens, bcrypt-hashed refresh tokens, multi-device session cap with FIFO eviction, and rate limiting.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 1,
      targetDate: new Date("2026-05-16"),
      completedAt: new Date("2026-05-16"),
    },
    {
      projectId: autoTm.id,
      title: "M3 — I can browse cars",
      description:
        "Listings CRUD with mobile 7-step wizard, media upload state machine, catalog integration, and public listing discovery.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 2,
      targetDate: new Date("2026-05-30"),
      completedAt: null,
    },
    {
      projectId: autoTm.id,
      title: "M4 — I can search + save",
      description:
        "Full-text search, advanced filters, saved searches, and garage/dealership profiles.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 3,
      targetDate: new Date("2026-06-15"),
      completedAt: null,
    },
    {
      projectId: autoTm.id,
      title: "M5 — I can contact the seller",
      description:
        "Socket.IO real-time chat between buyers and sellers, message persistence, and read receipts.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 4,
      targetDate: new Date("2026-06-30"),
      completedAt: null,
    },
    {
      projectId: autoTm.id,
      title: "M6 — I get notified",
      description:
        "Push notifications via FCM/APNS, in-app notification center, and notification preferences.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 5,
      targetDate: new Date("2026-07-15"),
      completedAt: null,
    },
    {
      projectId: autoTm.id,
      title: "M7 — Admins run the place",
      description:
        "Admin dashboard with moderation queues, user management, analytics, and content administration.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 6,
      targetDate: new Date("2026-07-30"),
      completedAt: null,
    },
    {
      projectId: autoTm.id,
      title: "M8 — Soft launch",
      description:
        "App store submissions, production hardening, load testing, monitoring, and beta release to Turkmenistan market.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 7,
      targetDate: new Date("2026-08-15"),
      completedAt: null,
    },
  ];

  const createdMilestones = await prisma.milestone.createMany({
    data: milestones,
  });
  console.log(`Seeded ${createdMilestones.count} milestones for AutoTM`);

  // --- Architecture Decisions for AutoTM ---
  await prisma.architectureDecision.deleteMany({ where: { projectId: autoTm.id } });
  await prisma.architectureDecision.createMany({
    data: [
      {
        projectId: autoTm.id,
        title: "Level 2 bounded contexts with use-cases",
        summary:
          "NestJS on Fastify with pure TypeScript domain layer, one use-case per file, and ports/adapters for cross-context communication.",
        body: "Stock NestJS feature folders led to bloated services and tight coupling. Bounded contexts with explicit domain/application/infrastructure/presentation layers enforce clear boundaries between identity, catalog, listings, subscriptions, conversations, notifications, content, reports, and admin.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 0,
        decidedAt: new Date("2026-05-13"),
      },
      {
        projectId: autoTm.id,
        title: "Stack selection: NestJS + Prisma + Next.js + Expo",
        summary:
          "NestJS API, Prisma ORM, Next.js web, and Expo mobile. Replaced Flutter, Sequelize, and Firebase.",
        body: "Prisma provides type-safe migrations and a single schema source of truth. Expo + React Native gives better ecosystem access than Flutter for the team. Next.js handles both public site and admin dashboard.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 1,
        decidedAt: new Date("2026-05-13"),
      },
      {
        projectId: autoTm.id,
        title: "Turborepo + pnpm workspaces",
        summary:
          "Monorepo with 7 apps and 5 shared packages. Rejected Nx, Lerna, and multi-repo.",
        body: "Shared packages for Prisma schema (db), Zod contracts, UI tokens, tsconfig presets, and ESLint config. All clients consume the same types and validation rules.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 2,
        decidedAt: new Date("2026-05-13"),
      },
      {
        projectId: autoTm.id,
        title: "Fully air-gapped hosting in Turkmenistan",
        summary:
          "Self-hosted Ubuntu servers with Docker Compose, Caddy, and no cloud dependencies. Docker tarballs shipped via SCP/USB.",
        body: "Internet connectivity inside Turkmenistan is unreliable and foreign cloud providers have latency and compliance issues. Topology C: build on CI, bundle images, transfer to local servers.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 3,
        decidedAt: new Date("2026-05-13"),
      },
      {
        projectId: autoTm.id,
        title: "Phone OTP + JWT auth with custom SMS gateway",
        summary:
          "OTP via fleet of Android phones running a Kotlin agent. JWT access tokens + bcrypt-hashed refresh tokens. No password database.",
        body: "Local SMS providers are expensive and unreliable. A fleet of 5–20 Android phones with SIM cards provides a cost-effective, controllable OTP delivery system. Multi-device sessions capped at 10 with FIFO eviction.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 4,
        decidedAt: new Date("2026-05-13"),
      },
      {
        projectId: autoTm.id,
        title: "MinIO + Sharp media pipeline",
        summary:
          "Self-hosted MinIO for S3-compatible object storage. Sharp for server-side variant generation. Client-side compression mandatory.",
        body: "Replaces Firebase Storage. MinIO runs locally alongside the API. Sharp generates thumbnails and compressed variants on upload. Client compresses before upload to save bandwidth.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 5,
        decidedAt: new Date("2026-05-13"),
      },
    ],
  });
  console.log("Seeded 6 architecture decisions for AutoTM");

  // --- Pipeline Evidence for AutoTM ---
  await prisma.pipelineEvidence.deleteMany({ where: { projectId: autoTm.id } });
  await prisma.pipelineEvidence.createMany({
    data: [
      {
        projectId: autoTm.id,
        label: "Docker multi-stage build — 5 services",
        description:
          "API, web, admin, worker, and SMS-gateway containers build successfully with production optimizations and multi-stage Dockerfiles.",
        category: "docker",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-14"),
      },
      {
        projectId: autoTm.id,
        label: "API test suite — 63 specs passing",
        description:
          "Domain, application, and e2e layers tested. NestJS service layer, controller, and utility tests pass consistently in CI.",
        category: "testing",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-15"),
      },
      {
        projectId: autoTm.id,
        label: "Mobile test suite — 7 files passing",
        description:
          "Expo mobile app unit and integration tests covering components, hooks, and API client behavior.",
        category: "testing",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-16"),
      },
      {
        projectId: autoTm.id,
        label: "CI pipeline — GitHub Actions with self-hosted runner",
        description:
          "Lint, typecheck, test, and build steps run on every push and PR via self-hosted runner labeled tm-proxy.",
        category: "ci",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-14"),
      },
      {
        projectId: autoTm.id,
        label: "Prisma schema — 8 migrations applied",
        description:
          "Type-safe Prisma client generated from a single schema in packages/db. 8 migrations applied covering identity, catalog, listings, media, and exchange rates.",
        category: "architecture",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-14"),
      },
    ],
  });
  console.log("Seeded 5 pipeline evidence records for AutoTM");

  // --- Pipeline Evidence for Portfolio ---
  await prisma.pipelineEvidence.deleteMany({ where: { projectId: portfolio.id } });
  await prisma.pipelineEvidence.createMany({
    data: [
      {
        projectId: portfolio.id,
        label: "GitHub Actions quality gate",
        description:
          "Prisma validate, migration deploy, seed verification, typecheck, 138 Vitest unit tests, production build, Docker image verification, smoke checks, private-room checks, and accessibility scans run before code reaches production.",
        category: "ci",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-22"),
      },
      {
        projectId: portfolio.id,
        label: "Playwright E2E smoke tests — 4 suites",
        description:
          "Public navigation, admin guard, accessibility (axe-core), and private room flows tested across 4 dedicated CI gates.",
        category: "testing",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-22"),
      },
      {
        projectId: portfolio.id,
        label: "Multi-stage production Dockerfile",
        description:
          "Dockerfile uses deps, builder, and runner stages with Next.js standalone output. CI verifies the image, and the Railway container runs Prisma migrations before starting the Next.js server.",
        category: "docker",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-22"),
      },
      {
        projectId: portfolio.id,
        label: "Railway deployment with custom domain",
        description:
          "Railway hosts the Dockerized Next.js app, manages PostgreSQL, stores production environment variables, and serves the canonical bagtyyar.dev domain.",
        category: "deployment",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-22"),
      },
      {
        projectId: portfolio.id,
        label: "WCAG 2.1 AA accessibility compliance",
        description:
          "Automated axe-core scans on every PR. prefers-reduced-motion support, semantic HTML, and keyboard-navigable private room fallbacks.",
        category: "testing",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-22"),
      },
      {
        projectId: portfolio.id,
        label: "Private rooms with signed revocable tokens",
        description:
          "SHA256-hashed access tokens with explicit revocation. Invalid and revoked tokens fail safely without leaking project existence or content.",
        category: "architecture",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-22"),
      },
    ],
  });
  console.log("Seeded 6 pipeline evidence records for Portfolio");

  // --- Private Room for AutoTM ---
  const crypto = await import("node:crypto");

  const autoTmRoom = await prisma.privateRoom.upsert({
    where: { slug: "auto-tm-client-room" },
    update: {},
    create: {
      slug: "auto-tm-client-room",
      projectId: autoTm.id,
      showMilestones: true,
      showUpdates: true,
      showArchitecture: true,
      showEvidence: true,
      showNextSteps: true,
      status: ContentStatus.published,
      visibility: ContentVisibility.privateRoom,
    },
  });
  console.log(`Seeded private room: ${autoTmRoom.slug}`);

  // Create a valid access token for the private room
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  await prisma.accessToken.upsert({
    where: { tokenHash },
    update: {},
    create: {
      tokenHash,
      roomId: autoTmRoom.id,
      label: "Demo client token",
    },
  });
  console.log(`Seeded access token for room (raw: ${rawToken.slice(0, 8)}...)`);

  // --- Fixed test tokens for E2E smoke tests ---
  const validTestRaw = "8bc8dfdd568eead0d1f77ce7183193512c569e2e490d71a7581b2475427a70f7";
  const validTestHash = crypto.createHash("sha256").update(validTestRaw).digest("hex");

  await prisma.accessToken.upsert({
    where: { tokenHash: validTestHash },
    update: {},
    create: {
      tokenHash: validTestHash,
      roomId: autoTmRoom.id,
      label: "E2E test valid token",
    },
  });

  const revokedTestRaw = "4cdc25f2005814cde91d7d30655eea8d5849148b200b5ca795f8612286311ed6";
  const revokedTestHash = crypto.createHash("sha256").update(revokedTestRaw).digest("hex");

  await prisma.accessToken.upsert({
    where: { tokenHash: revokedTestHash },
    update: {},
    create: {
      tokenHash: revokedTestHash,
      roomId: autoTmRoom.id,
      label: "E2E test revoked token",
      revokedAt: new Date(),
    },
  });

  console.log(`Test valid token: ${validTestRaw}`);
  console.log(`Test revoked token: ${revokedTestRaw}`);

  // --- Build Log Entries ---
  await prisma.buildLogEntry.deleteMany({});
  await prisma.buildLogEntry.createMany({
    data: [
      {
        projectId: autoTm.id,
        title: "Turborepo monorepo scaffold with 7 apps and 5 packages",
        body: "Turbo.json pipeline configured with lint, typecheck, test, and build stages. Shared packages established for Prisma schema, Zod contracts, UI tokens, tsconfig, and ESLint config. Docker Compose dev environment with Postgres 16, Redis 7, and MinIO.",
        occurredAt: new Date("2026-05-13"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Prisma schema and 8 migrations applied",
        body: "Single schema file in packages/db covering identity, catalog, listings, media, exchange rates, and subscriptions. Type-safe client generated and consumed by API, worker, and SMS-gateway apps.",
        occurredAt: new Date("2026-05-14"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Identity context shipped — OTP login, JWT sessions, multi-device cap",
        body: "Phone OTP authentication via custom SMS gateway with 5-device fleet. JWT access tokens and bcrypt-hashed refresh tokens. Multi-device session cap at 10 with FIFO eviction. Rate limiting on OTP endpoints. Full domain + application + e2e test coverage.",
        occurredAt: new Date("2026-05-16"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Catalog context with trilingual seed data",
        body: "Read endpoints for Brand, Model, Color, BodyType, Region, City, EngineType, Transmission, and DriveType. Seed data in Turkmen, Russian, and English. FX rates table for currency conversion.",
        occurredAt: new Date("2026-05-18"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Listings mobile wizard — 7-step flow with upload state machine",
        body: "Expo mobile app listing creation wizard with step validation, media upload staging, and catalog integration. Prisma schema extended with ListingDraft, ListingMedia, and ExchangeRate. Known gaps documented: autosave edge cases, orphan cleanup, public listing-detail route pending.",
        occurredAt: new Date("2026-05-19"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
    ],
  });
  console.log("Seeded 5 build log entries for AutoTM");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
