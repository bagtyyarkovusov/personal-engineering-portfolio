import { PrismaClient, ContentStatus, ContentVisibility } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PUBLIC_DEMO_ROOM_TOKEN } from "../src/lib/demo-room";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const autoTmData = {
    slug: "car-marketplace",
    title: "AutoTM",
    summary:
      "Turkmenistan's vehicle marketplace rewrite — an active Turborepo rebuild with Expo, NestJS bounded contexts, Prisma, and phased cloud-first hosting ahead of a planned release.",
    body: `## Context

AutoTM is a vehicle listing and transaction platform built specifically for the Turkmenistan market. The original version was a Flutter mobile app with a stock NestJS API. The current rewrite is a ground-up rebuild of the product and delivery system: clearer domain boundaries, shared contracts, mobile-first listing workflows, and a hosting plan that starts on Railway and cuts over to infrastructure inside Turkmenistan once app-store approval lands.

## Engineering Decisions

- **Monorepo**: Turborepo + pnpm workspaces with 7 apps and 5 shared packages. Shared Prisma schema, Zod contracts, and UI tokens consumed by every client.
- **Mobile**: Expo SDK 55 + React Native 0.83.6 with NativeWind v4 and React Native Reusables, replacing Flutter for better ecosystem access and team velocity.
- **API**: NestJS 11 on Fastify with Level 2 bounded contexts — pure TypeScript domain layer, one use-case per file, ports and adapters for cross-context communication.
- **ORM**: Prisma 7 with explicit migrations and a single schema file in \`packages/db\`, replacing Sequelize for type safety and reliable migrations.
- **Web**: Next.js 16 + Tailwind CSS v4 + shadcn/ui for both public site (auto.tm) and admin dashboard (admin.auto.tm).
- **Media pipeline**: MinIO (S3-compatible) + Sharp for variant generation, replacing Firebase Storage. Client-side compression is mandatory before upload; the API enforces upload ownership before media can be adopted or deleted.
- **Real-time**: Socket.IO 4 with Redis adapter — shipped for buyer-seller chat with message persistence, read states, unread counts, and mute/report/block controls.
- **Auth**: Phone OTP via a custom SMS gateway fleet (5–20 Android phones running a Kotlin agent) + JWT access tokens + bcrypt-hashed refresh tokens. Sign-in codes are bound to their purpose; multi-device sessions are capped at 10 with FIFO eviction.
- **Job queue**: BullMQ + Redis + dedicated NestJS worker app for async processing.
- **Hosting**: Phased cloud-first (ADR-0039) — staging and production run on Railway until app-store verification, then cut over to infrastructure inside Turkmenistan. Every component is a plain Docker container with no provider-proprietary dependency.
- **Deployment**: Multi-service Docker images built via GitHub Actions, with disposable PR backends on Railway for review. The tarball transfer path (SCP/USB) is preserved for the post-approval cutover.

## Current State

**Marketplace MVP — feature-complete through Sprint 10, release preparation in progress**

- **S1 (Scaffold)**: Shipped — Turborepo structure, CI pipeline, Docker Compose dev environment.
- **S2 (Identity)**: Shipped — Phone OTP login, JWT sessions, multi-device cap, rate limiting, full test coverage.
- **S3 (Catalog)**: Shipped — Trilingual catalog seed data, read endpoints, FX rates, and shared contracts.
- **S4 (Listings)**: Shipped — 7-step sell wizard with chained Brand/Model/Year/Generation pickers, media upload state machine, drafts with a five-draft limit, and listing detail with owner and sold states.
- **Search and browse**: Shipped — search screen for brands, models, and years, full-screen search parameters, live result counts, popular-first multi-model filters, and favorites with active-only counts.
- **Chat**: Shipped — conversations with message persistence, read labels and day separators, quick replies, mute/report/block, unread counts on the Messages tab, and push deep-links back into the conversation.
- **Notifications**: Shipped — direct-message push eligibility and a notification center on Cabinet.
- **Admin and trust**: Shipped — staff moderation and report review, verified-phone seller signals, structured condition disclosure (Damaged + Known issues), and an inspection-interest pilot.
- **Release preparation**: Current focus — reviewer Android builds with public web links, legal and posting-rules pages, the account-deletion flow, contact phone confirmation, and the Android reviewer release handoff. CI gates and release bundles run on GitHub-hosted runners.

**Testing**: API, mobile, and SMS-gateway suites cover the shipped slices. CI remains the source of truth for regressions.

**Documentation**: 81 Architecture Decision Records, CONTEXT.md per workspace, sprint files with Definition of Done, a governed domain glossary, and agent skill docs for mobile and TypeScript runtime boundaries.`,
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
      "Railway",
    ],
    outcome:
      "540+ commits and 81 ADRs across five months of sprint-based delivery — marketplace features complete through Sprint 10, store release in planning.",
    repoUrl: "https://github.com/bagtyyarkovusov/auto.tm-rewrite",
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

  // --- TM-WhatsApp: encrypted messenger for Turkmenistan ---
  const tmWhatsAppData = {
    slug: "tm-whatsapp",
    title: "TM-WhatsApp",
    summary:
      "An early-stage WhatsApp-class messenger for Turkmenistan — Signal Protocol end-to-end encryption, designed for 2 Mbps networks, currently a scaffolded monorepo with the architecture decided and no end-user features shipped.",
    body: `## Context

The most-used chat app in Turkmenistan today is IMO — laggy and ad-stuffed — while WhatsApp itself is unreliable or blocked. TM-WhatsApp is a WhatsApp-class messenger designed from the ground up for the local community: fast, clean, and genuinely end-to-end encrypted, built to tolerate ~2 Mbps networks and restrictive NATs. It is a sister project to AutoTM and deliberately reuses its stack, OTP gateway, and deployment patterns.

## Engineering Decisions (12 accepted ADRs)

- **E2EE is real**: Signal Protocol for messages (ADR-0003), client-side-encrypted media with per-attachment AES-256 keys (ADR-0008), and user-held backup keys the operator cannot recover (ADR-0007). The server stores ciphertext and prekey bundles only — never plaintext, identity keys, or the contact graph.
- **Device-aware from day one (ADR-0006)**: account → N devices → prekey bundles; linked devices join via QR scan and signed approval, capped at roughly five per account.
- **Three transports, no overlap (ADR-0004)**: Socket.IO for chat and signaling, HTTPS/MinIO for media and backups, WebRTC for calls with a degradation ladder down to audio-only.
- **Auth (ADR-0009)**: phone-number identity (+993) with OTP delivered through the same SMS-gateway fleet pattern as AutoTM; per-device refresh tokens with rotation and sliding expiry.
- **Phased hosting (ADR-0001)**: Railway until App Store and Play approval, then lift-and-shift to infrastructure inside Turkmenistan; every backend component is a plain Docker container.
- **Monorepo**: pnpm + Turborepo with strict TypeScript — NestJS API, Expo mobile (iOS and Android from one codebase), and shared db, contracts, and crypto packages.

## Current State

Scaffolded; no end-user feature is complete. What exists: the founding ADR set and five-phase roadmap, health endpoints with shared Zod contracts and tests, initial device-aware Prisma models, a local Compose topology (Postgres 16, Redis 7, MinIO) proven by a CI smoke job, mobile UI design tokens and a component kit, and Turkmen/Russian/English localization foundations. OTP, messaging, contact discovery, calls, and release builds are not implemented yet.

[Public repository](https://github.com/bagtyyarkovusov/tm-whatsapp)`,
    stack: [
      "TypeScript",
      "NestJS",
      "Expo",
      "React Native",
      "Prisma",
      "PostgreSQL 16",
      "Redis 7",
      "MinIO",
      "Socket.IO",
      "WebRTC",
      "Signal Protocol",
      "Zod",
      "Turborepo",
      "Docker",
      "Railway",
    ],
    outcome:
      "Scaffolded monorepo with 12 accepted ADRs and E2EE (Signal Protocol) research complete — OTP, messaging, and calls are not implemented yet.",
    repoUrl: "https://github.com/bagtyyarkovusov/tm-whatsapp",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 1,
    startedAt: new Date("2026-07-19"),
    completedAt: null,
  };

  const tmWhatsApp = await prisma.project.upsert({
    where: { slug: tmWhatsAppData.slug },
    update: tmWhatsAppData,
    create: tmWhatsAppData,
  });
  console.log(`Seeded: ${tmWhatsApp.title}`);

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
- **Testing**: 141 Vitest unit tests, Playwright E2E smoke tests, WCAG 2.1 AA accessibility scans — all in CI.
- **CI/CD**: GitHub Actions validates Prisma, migrations, seed data, typechecking, unit tests, production build, Docker image creation, smoke flows, accessibility, and private-room access.
- **Deployment**: Multi-stage Dockerfile, Next.js standalone output, Railway container deployment, Railway-managed PostgreSQL, and runtime environment variables for secrets and canonical URLs.
- **Migration discipline**: Production starts with \`prisma migrate deploy\` before \`node server.js\`, keeping local, CI, and Railway schema evolution on the same path.
- **Custom domain**: \`bagtyyar.dev\` is the canonical production URL, with Auth.js and SEO metadata configured through Railway variables.

## Outcomes

- **141 unit tests** across 14 test files covering access tokens, publication policy, markdown safety, auth guards, validations, and design tokens.
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
      "141 unit tests and 5 CI gates on every merge, auto-deployed to production on Railway — the portfolio proves the engineering system it describes.",
    liveUrl: "https://bagtyyar.dev",
    repoUrl: "https://github.com/bagtyyarkovusov/personal-engineering-portfolio",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 2,
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

[Visit the live site](https://myorl.up.railway.app) · [Public repository](https://github.com/bagtyyarkovusov/myorl-pavlos)`,
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
      "Live in production serving real patients — bilingual Greek/Russian healthcare platform with full CMS handover to clinic staff.",
    liveUrl: "https://myorl.up.railway.app",
    repoUrl: "https://github.com/bagtyyarkovusov/myorl-pavlos",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 3,
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

- Strict TypeScript + Zod validation across both external boundaries — client request bodies and upstream SSE chunks.
- SSE stream validation, reasoning and tool-call aggregation for thinking models, and multimodal normalization (remote media inlining, part reordering, empty-content handling).
- OpenAI Responses API translation layer on top of chat completions, so both API families work against Gonka executors.
- Three architecture decision records, 89 unit tests, and integration smoke suites (gateway, streaming, tools, vision).
- Docker and docker-compose packaging for one-command deployment.
- Includes an upstream fix for a chunk-validation bug found while integrating: Gonka emits mid-stream errors as a bare string (\`{"error":"terminated"}\`) instead of an OpenAI-shaped object, which previously broke downstream clients' schema validation.

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
      "24 servers / 192× RTX 4080 GPUs taken from hardware list to revenue-earning production — plus a public OpenAI-compatible API gateway.",
    repoUrl: "https://github.com/bagtyyarkovusov/GonkaProvider",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 4,
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
        "Listings CRUD with the mobile 7-step sell wizard, media upload state machine, drafts, and listing detail with owner and sold states.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 2,
      targetDate: new Date("2026-06-27"),
      completedAt: new Date("2026-06-27"),
    },
    {
      projectId: autoTm.id,
      title: "M4 — I can search + save",
      description:
        "Search screen for brands, models, and years; full-screen search parameters with live result counts; favorites with active-only filtering.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 3,
      targetDate: new Date("2026-09-30"),
      completedAt: new Date("2026-10-01"),
    },
    {
      projectId: autoTm.id,
      title: "M5 — I can contact the seller",
      description:
        "Buyer-seller chat over Socket.IO with message persistence, read labels, quick replies, mute/report/block, unread counts, and push deep-links into conversations.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 4,
      targetDate: new Date("2026-07-15"),
      completedAt: new Date("2026-07-17"),
    },
    {
      projectId: autoTm.id,
      title: "M6 — I get notified",
      description:
        "Direct-message push notifications with eligibility rules and an in-app notification center on Cabinet.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 5,
      targetDate: new Date("2026-09-30"),
      completedAt: new Date("2026-10-03"),
    },
    {
      projectId: autoTm.id,
      title: "M7 — Admins run the place",
      description:
        "Admin app with staff moderation, report review, audit UI, verified-phone seller signals, and inspection-interest management.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 6,
      targetDate: new Date("2026-07-11"),
      completedAt: new Date("2026-07-11"),
    },
    {
      projectId: autoTm.id,
      title: "M8 — Soft launch",
      description:
        "Reviewer Android builds, store submissions, production monitoring, and beta release — followed by the in-Turkmenistan hosting cutover once store approval lands (ADR-0039).",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 7,
      targetDate: new Date("2026-11-15"),
      completedAt: null,
    },
  ];

  const createdMilestones = await prisma.milestone.createMany({
    data: milestones,
  });
  console.log(`Seeded ${createdMilestones.count} milestones for AutoTM`);

  // --- Milestones for MyORL ---
  await prisma.milestone.deleteMany({
    where: { projectId: myorl.id },
  });

  const myorlMilestones = [
    {
      projectId: myorl.id,
      title: "Inception and MODX migration tooling",
      description:
        "Content audit of the legacy MODX site, custom extraction tooling, and slug parity mapping into structured Strapi content types.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 0,
      targetDate: new Date("2026-04-23"),
      completedAt: new Date("2026-04-23"),
    },
    {
      projectId: myorl.id,
      title: "Strapi 5 CMS and content model",
      description:
        "Strapi 5 + PostgreSQL content types for pages, encyclopedia entries, services, prices, and media; unified CmsGateway client and page normalizer on the frontend boundary.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 1,
      targetDate: new Date("2026-04-28"),
      completedAt: new Date("2026-04-28"),
    },
    {
      projectId: myorl.id,
      title: "Bilingual frontend with Meilisearch",
      description:
        "Greek/Russian Next.js frontend on Tailwind v4 tokens; full-site typo-tolerant search with bulk corpus seed, Strapi webhook reindexing, and bilingual synonym dictionaries.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 2,
      targetDate: new Date("2026-05-27"),
      completedAt: new Date("2026-05-27"),
    },
    {
      projectId: myorl.id,
      title: "Production launch on Railway",
      description:
        "Docker builds, ISR with per-locale sitemaps, security headers (CSP/HSTS), and production routing fixes; site live and serving patients.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 3,
      targetDate: new Date("2026-05-31"),
      completedAt: new Date("2026-05-31"),
    },
    {
      projectId: myorl.id,
      title: "Client remediation and content handover",
      description:
        "Remediation pass against the client's requirement documents; 23 published Greek pages; day-to-day content editing handed over to clinic staff.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 4,
      targetDate: new Date("2026-06-03"),
      completedAt: new Date("2026-06-03"),
    },
    {
      projectId: myorl.id,
      title: "Infrastructure rescue and relaunch",
      description:
        "Relaunched on the Railway project celebrated-abundance at myorl.up.railway.app after the original deployment lapsed; date-dependent appointment-picker tests pinned to a fixed system time.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 5,
      targetDate: new Date("2026-10-03"),
      completedAt: new Date("2026-10-03"),
    },
  ];

  const createdMyorlMilestones = await prisma.milestone.createMany({
    data: myorlMilestones,
  });
  console.log(`Seeded ${createdMyorlMilestones.count} milestones for MyORL`);

  // --- Milestones for Gonka ---
  await prisma.milestone.deleteMany({
    where: { projectId: gonka.id },
  });

  const gonkaMilestones = [
    {
      projectId: gonka.id,
      title: "Cluster specification and provisioning",
      description:
        "Hardware specification and procurement guidance for a 24-node cluster, 8× RTX 4080 per node (192 GPUs), followed by deployment and network onboarding on Gonka during the network's early phase.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 0,
      targetDate: new Date("2026-03-01"),
      completedAt: new Date("2026-03-01"),
    },
    {
      projectId: gonka.id,
      title: "First inference serving on the network",
      description:
        "Open-weight LLM inference (Qwen 235B-class instruction models) serving on the Gonka network from the provisioned cluster, with monitoring and operations in place.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 1,
      targetDate: new Date("2026-04-01"),
      completedAt: new Date("2026-04-01"),
    },
    {
      projectId: gonka.id,
      title: "GonkaProvider gateway prototype",
      description:
        "First public commit of GonkaProvider: a Node/Express gateway exposing an OpenAI-compatible API that proxies chat completions to Gonka ML nodes via the signed gonka-openai client.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 2,
      targetDate: new Date("2026-05-10"),
      completedAt: new Date("2026-05-10"),
    },
    {
      projectId: gonka.id,
      title: "Documented public release with Docker packaging",
      description:
        "Gateway layout under src/, Dockerfile and docker-compose, domain context documentation, three ADRs, and multimodal payload normalization for MCP/OpenCode tool rounds.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 3,
      targetDate: new Date("2026-05-10"),
      completedAt: new Date("2026-05-10"),
    },
    {
      projectId: gonka.id,
      title: "TypeScript + Zod hardening and Responses API support",
      description:
        "Full conversion to strict TypeScript with Zod validation at both boundaries, an upstream chunk-validation fix, 89 unit tests, and an OpenAI Responses API translation layer with vLLM/Kimi K2 reference documentation.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 4,
      targetDate: new Date("2026-05-14"),
      completedAt: new Date("2026-05-14"),
    },
    {
      projectId: gonka.id,
      title: "Gateway maintenance and upstream compatibility",
      description:
        "Ongoing maintenance of the public GonkaProvider repository: tracking gonka-openai releases, vLLM executor behavior, and OpenAI API surface drift.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 5,
      targetDate: null,
      completedAt: null,
    },
  ];

  const createdGonkaMilestones = await prisma.milestone.createMany({
    data: gonkaMilestones,
  });
  console.log(`Seeded ${createdGonkaMilestones.count} milestones for Gonka`);

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
          "Original charter: self-hosted Ubuntu servers with Docker Compose, Caddy, and no cloud dependencies. Superseded by phased cloud-first hosting in July 2026.",
        body: "Internet connectivity inside Turkmenistan is unreliable and foreign cloud providers have latency and compliance issues. The original plan (Topology C) was to build on CI, bundle images, and transfer to local servers. ADR-0039 later phased this: Railway first, in-TM cutover after store approval.",
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
        body: "Replaces Firebase Storage. MinIO runs alongside the API. Sharp generates thumbnails and compressed variants on upload. Client compresses before upload to save bandwidth.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 5,
        decidedAt: new Date("2026-05-13"),
      },
      {
        projectId: autoTm.id,
        title: "Phased cloud-first hosting (ADR-0039)",
        summary:
          "Staging and production run on Railway until App Store and Play verification complete; the fully in-Turkmenistan deployment remains a later phase.",
        body: "Shipping a reviewer build and passing store review requires reachable public endpoints, which the air-gapped topology could not provide. Every component remains a plain Docker container with no provider-proprietary features, so the post-approval cutover is a lift-and-shift, not a rewrite. Supersedes the original fully air-gapped charter.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 6,
        decidedAt: new Date("2026-07-20"),
      },
    ],
  });
  console.log("Seeded 7 architecture decisions for AutoTM");

  // --- Architecture Decisions for MyORL ---
  await prisma.architectureDecision.deleteMany({ where: { projectId: myorl.id } });
  await prisma.architectureDecision.createMany({
    data: [
      {
        projectId: myorl.id,
        title: "Strapi 5 as headless CMS with a semantic DTO boundary",
        summary:
          "Strapi 5 owns content; the Next.js frontend consumes it through a single CmsGateway and page normalizer, never leaking CMS shapes into components.",
        body: "Clinic staff need to edit content without a developer, and the legacy MODX schema could not be exposed directly to the frontend. A semantic DTO boundary (ADR-001) isolates Strapi schema changes from the UI and gave the migration tooling a stable target.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 0,
        decidedAt: new Date("2026-04-25"),
      },
      {
        projectId: myorl.id,
        title: "Full-site search via Meilisearch",
        summary:
          "Meilisearch indexes the bilingual encyclopedia and service pages; Strapi webhooks keep the index in sync on every content change.",
        body: "Patients rarely know exact medical spelling, and the content is bilingual Greek/Russian. Meilisearch (ADR-011) provides typo-tolerant instant search; a bulk corpus seed, webhook lifecycle with locale-scoped deletes, and curated synonym dictionaries keep results accurate in both languages.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 1,
        decidedAt: new Date("2026-05-24"),
      },
      {
        projectId: myorl.id,
        title: "URL-mapping content type for legacy redirects",
        summary:
          "Legacy MODX URLs resolve through a dedicated Strapi content type instead of hard-coded redirect tables.",
        body: "The old site had years of indexed URLs that could not break at launch. A URL-mapping content type (ADR-012) lets redirects be audited, edited, and versioned alongside content, and kept MODX slug parity verifiable during the cutover.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 2,
        decidedAt: new Date("2026-05-26"),
      },
    ],
  });
  console.log("Seeded 3 architecture decisions for MyORL");

  // --- Architecture Decisions for Gonka ---
  await prisma.architectureDecision.deleteMany({ where: { projectId: gonka.id } });
  await prisma.architectureDecision.createMany({
    data: [
      {
        projectId: gonka.id,
        title: "OpenAI-compatible gateway over Gonka",
        summary:
          "A dedicated Node + Express service exposes /health, /v1/models, and /v1/chat/completions; gonka-openai is the only client to the Gonka network, with client auth (GATEWAY_API_KEY) separated from chain auth (GONKA_PRIVATE_KEY).",
        body: "Gonka inference uses its own networking, request signing, and endpoint discovery, while standard tooling (OpenCode, generic OpenAI clients) expects a stable base URL, bearer auth, and OpenAI-shaped JSON/SSE. A dedicated gateway centralizes secrets and request shaping in one process instead of changing every client. Not a full OpenAI emulator — missing routes return 404. Recorded as ADR-0001 in the GonkaProvider repository.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 0,
        decidedAt: new Date("2026-05-10"),
      },
      {
        projectId: gonka.id,
        title: "Always stream upstream for chat completions",
        summary:
          "Every completion calls the Gonka upstream with stream: true; streaming clients get SSE forwarded as-is, non-streaming clients get a single aggregated chat.completion object built by collectStream.",
        body: "The configured model (Kimi K2-class) is a thinking model whose executor emits reasoning deltas alongside content, most naturally expressed as server-sent events. Running one upstream code path for both client modes keeps reasoning and incremental tool-call assembly consistent; non-streaming clients pay the cost of consuming the full stream before responding. Recorded as ADR-0002 in the GonkaProvider repository.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 1,
        decidedAt: new Date("2026-05-10"),
      },
      {
        projectId: gonka.id,
        title: "Multimodal payload normalization at the gateway",
        summary:
          "normalizeChatCompletionBody reorders media parts before text, fetches remote image/video URLs and inlines them as data URLs (size- and timeout-capped), maps alternate vision shapes, and replaces empty content with a placeholder.",
        body: "Clients send multimodal content in several shapes (image_url, image, input_image, video_url), and Gonka/vLLM executors often cannot fetch remote URLs, expect media parts before text, and reject empty content after tool loops. Normalizing at the gateway lets clients paste public image URLs and avoids surprise 400s, at the cost of the gateway acting as a bounded fetch proxy. Recorded as ADR-0003 in the GonkaProvider repository.",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 2,
        decidedAt: new Date("2026-05-10"),
      },
    ],
  });
  console.log("Seeded 3 architecture decisions for Gonka");

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
      {
        projectId: autoTm.id,
        label: "CI gates and release bundles on GitHub-hosted runners",
        description:
          "PR checks, CI on main, and release bundle builds moved to GitHub-hosted runners; disposable Railway PR backends stand up per pull request for review.",
        category: "ci",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-10-01"),
      },
    ],
  });
  console.log("Seeded 6 pipeline evidence records for AutoTM");

  // --- Pipeline Evidence for Portfolio ---
  await prisma.pipelineEvidence.deleteMany({ where: { projectId: portfolio.id } });
  await prisma.pipelineEvidence.createMany({
    data: [
      {
        projectId: portfolio.id,
        label: "GitHub Actions quality gate",
        description:
          "Prisma validate, migration deploy, seed verification, typecheck, 141 Vitest unit tests, production build, Docker image verification, smoke checks, private-room checks, and accessibility scans run before code reaches production.",
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

  // --- Pipeline Evidence for Gonka ---
  await prisma.pipelineEvidence.deleteMany({ where: { projectId: gonka.id } });
  await prisma.pipelineEvidence.createMany({
    data: [
      {
        projectId: gonka.id,
        label: "Public repository — GonkaProvider",
        description:
          "Full gateway source, tests, and documentation public on GitHub under bagtyyarkovusov/GonkaProvider.",
        category: "repository",
        url: "https://github.com/bagtyyarkovusov/GonkaProvider",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-10"),
      },
      {
        projectId: gonka.id,
        label: "Architecture decision records — 3 ADRs",
        description:
          "Gateway-over-Gonka design, always-stream-upstream completions, and multimodal normalization documented as ADRs in the repository.",
        category: "architecture",
        url: "https://github.com/bagtyyarkovusov/GonkaProvider/tree/main/docs/adr",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-10"),
      },
      {
        projectId: gonka.id,
        label: "Docker packaging with compose override for dev",
        description:
          "Root Dockerfile and docker-compose.yml for production-like runs; docker-compose.override.yml bind-mounts src/ for local development.",
        category: "docker",
        url: "https://github.com/bagtyyarkovusov/GonkaProvider/blob/main/Dockerfile",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-10"),
      },
      {
        projectId: gonka.id,
        label: "Unit and integration test suites",
        description:
          "89 unit tests across the gateway modules plus integration smoke suites for the HTTP API, SSE streaming, tool calls, and vision payloads.",
        category: "testing",
        url: "https://github.com/bagtyyarkovusov/GonkaProvider/tree/main/test",
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-11"),
      },
    ],
  });
  console.log("Seeded 4 pipeline evidence records for Gonka");

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

  // Public demo token — stable across seeds and linked from public pages
  // (/engineering-system and /work-with-me). Raw value: src/lib/demo-room.ts.
  const demoTokenHash = crypto
    .createHash("sha256")
    .update(PUBLIC_DEMO_ROOM_TOKEN)
    .digest("hex");

  await prisma.accessToken.upsert({
    where: { tokenHash: demoTokenHash },
    update: {},
    create: {
      tokenHash: demoTokenHash,
      roomId: autoTmRoom.id,
      label: "Public demo token (linked from public pages)",
    },
  });
  console.log("Seeded public demo token for room");

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
      {
        projectId: autoTm.id,
        title: "Conversations API and seller chat list",
        body: "Open and list conversations use-cases landed in the API, followed by the seller conversation list on the mobile Chat tab. Feed ranking moved behind a port with a chronological adapter and tightened test coverage.",
        occurredAt: new Date("2026-06-07"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Browse and listing read surfaces audited",
        body: "Mobile read surfaces, filtered feed query hooks, and the listing browse funnel were audited and drift-corrected; the S8a pass closed with the remaining web SSR work deferred explicitly.",
        occurredAt: new Date("2026-06-27"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Sprint 10 shipped — rich chat, direct-message notifications, mobile polish",
        body: "Rich chat between buyers and sellers, direct-message push eligibility folded into the notification pipeline, and a mobile polish pass. Sprint 10 closed with a retrospective; verified-phone seller signals and structured condition disclosure (Damaged plus Known issues) landed earlier in the same window.",
        occurredAt: new Date("2026-07-17"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "ADR-0039: phased cloud-first hosting",
        body: "Hosting decision revised: staging and production move to Railway until app-store verification completes, then cut over to infrastructure inside Turkmenistan. Components stay plain Docker containers so the cutover is a lift-and-shift. Supersedes the fully air-gapped charter.",
        occurredAt: new Date("2026-07-20"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Sprint 11 — deployable runtime contract and reviewer seed",
        body: "Established the deployable runtime contract and a durable MinIO contract, added a reviewer authentication bypass with durable audit, and shipped a reviewer scenario seed so store reviewers can exercise the app without real listings.",
        occurredAt: new Date("2026-08-08"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Governed domain glossary for delivery",
        body: "Established a governed AutoTM domain glossary and a glossary-aware shape-with-docs workflow, carrying canonical vocabulary through downstream delivery so code, specs, and reviews use the same terms.",
        occurredAt: new Date("2026-08-29"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Search screen and full-screen search parameters",
        body: "Search screen for brands, models, and years, then the full-screen search parameters form replacing the filter sheet. Listing detail gained owner and sold states; results filters, sort, and shared large cards standardized across surfaces.",
        occurredAt: new Date("2026-10-01"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Cabinet becomes the app menu; legal and account flows wired",
        body: "Cabinet replaced Settings as the app menu. Legal pages and posting rules are linked from Cabinet rows, the account-deletion flow explains consequences and schedules the purge, and language and theme pickers moved to bottom sheets.",
        occurredAt: new Date("2026-10-02"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Messages, notifications, and release handoff mapped",
        body: "Messages list rows and conversation screens with mute, report, and block; unread count on the Messages tab; the notification center on Cabinet; contact phone confirmation API (ADR-0081); and the Android reviewer release handoff documented for the planned store submission.",
        occurredAt: new Date("2026-10-03"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Sell wizard exit saves the draft; photos move to step 3",
        body: "The Sell wizard's close control now persists the in-progress draft instead of discarding it, and photo selection moved up to step 3 with continue-on-pick and upload failures listed under the grid.",
        occurredAt: new Date("2026-10-05T07:41:49Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "ADR-0082: an issue may carry up to three ordered slices",
        body: "Delivery-process decision recorded: a single issue can be decomposed into at most three ordered, independently mergeable slices, keeping PR scope reviewable without fragmenting the feature.",
        occurredAt: new Date("2026-10-05T10:02:41Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Sell wizard publish flow — preview, named blockers, contact phone step",
        body: "The check-and-publish step gained a preview with per-section Change links and named blockers instead of generic errors, and a new contact step lets the seller pick or confirm the contact phone bound to the listing.",
        occurredAt: new Date("2026-10-05T13:04:12Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Display names, generated avatars, and listing editing",
        body: "Every user gets a name number and avatar index shown on Cabinet and Profile, Display Name editing landed with a shared validation rule, and a published listing can now be edited from a section list instead of a single form.",
        occurredAt: new Date("2026-10-05T18:17:39Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Account deletion made atomic; Turkmen copy and profile fixes",
        body: "AccountDeletionUnitOfWork now runs the deletion schedule and the listing archive in one transaction, with refresh-session revocation outside it so failures stay retryable. Control characters are stripped from Display Names (NUL previously caused 500s), and every Turkmen account string uses akkaunt across mobile, web, legal pages, and email.",
        occurredAt: new Date("2026-10-05T20:55:49Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Play Console submission pack prepared",
        body: "Store listing copy in RU, TK, and EN, Data safety answers and permissions cited to the code, app content answers, a reviewer access template, and the founder's Console checklist — the full submission pack for the planned Play release.",
        occurredAt: new Date("2026-10-05T21:05:48Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Privacy hardening — credential redaction and data-handling decisions",
        body: "pino-http no longer logs Authorization, Cookie, or API-key headers, and query strings (including search terms) stay out of the request log. Purge deletes the user's sign-in code records and clears contact phones on kept listings, a job sweeps code records older than 30 days, and Android backup is disabled.",
        occurredAt: new Date("2026-10-05T21:39:25Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "EXIF and GPS stripped from stored images",
        body: "Listing photo originals carrying metadata or an orientation tag are re-encoded upright without it (within the 5 MB cap) before variants are built, and chat images are re-encoded the same way before another user can load them — a message is accepted only for an attachment key the presign issued for that conversation.",
        occurredAt: new Date("2026-10-05T22:53:09Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Store release wired to the existing Play app as version 2.0.0",
        body: "The EAS production profile builds as com.auto_tm.ynamly so the rewrite updates the existing Play listing, with version-code auto-increment and a validate:eas-env guard that refuses profile/package mismatches. The production build check now accepts autotm.bagtyyar.dev hosts, and the rewrite is named 2.0.0 against the existing app's 1.0.0 builds.",
        occurredAt: new Date("2026-10-05T23:38:57Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Sign-in code logs redacted; Play submission decisions recorded",
        body: "Sign-in code log lines now carry only the last four digits of the phone number, Google Play command-line publishing was researched and documented, the founder's 2026-10-06 decisions were recorded in the submission pack, and the DB seed guard gained a load-order probe plus typecheck coverage for packages/db/scripts.",
        occurredAt: new Date("2026-10-06T11:18:01Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: myorl.id,
        title: "Search corpus seed and Strapi webhook lifecycle",
        body: "Bulk-seeded the full search corpus into Meilisearch and wired Strapi webhooks so create, update, unpublish, and delete events reindex with locale-scoped deletes; bilingual synonym and stopword dictionaries added with sync tooling.",
        occurredAt: new Date("2026-05-24"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: myorl.id,
        title: "Production hardening for launch",
        body: "CSP and HSTS security headers, per-locale sitemap and static params, ISR on the home route, production routing fixes for slug pages, and mobile search and tab repairs ahead of go-live.",
        occurredAt: new Date("2026-05-31"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: myorl.id,
        title: "Relaunch at myorl.up.railway.app",
        body: "Site restored on the celebrated-abundance Railway project and verified live after the original deployment lapsed; appointment-picker tests pinned to a fixed system time to remove a date-dependent failure.",
        occurredAt: new Date("2026-10-03"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: gonka.id,
        title: "GonkaProvider initial commit — working OpenAI-compatible proxy",
        body: "First public commit of the gateway: an Express service proxying chat completions to Gonka ML nodes through the signed gonka-openai client, with an example consumer script.",
        occurredAt: new Date("2026-05-10"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: gonka.id,
        title: "Gateway layout, Docker packaging, and multimodal normalization",
        body: "Gateway implementation moved under src/ with a root shim, Dockerfile and compose added, and three ADRs written. Media normalization hardened for empty assistant/tool multimodal payloads from MCP/OpenCode tool rounds, eliminating a class of upstream 'content must not be empty' rejections.",
        occurredAt: new Date("2026-05-10"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: gonka.id,
        title: "TypeScript + Zod conversion with upstream chunk-validation fix",
        body: "All source modules converted to strict TypeScript with Zod validation at both external boundaries. validateUpstreamChunk now catches non-OpenAI-shaped SSE chunks at the seam — fixing the bug where Gonka emits {\"error\":\"terminated\"} as a bare string, previously forwarded verbatim and breaking downstream clients' schema validation. 89 unit tests passing across 17 suites.",
        occurredAt: new Date("2026-05-11"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: gonka.id,
        title: "OpenAI Responses API translation layer and vLLM reference docs",
        body: "Added a Responses API surface (schemas, SSE, compaction, translation to chat completions) so both OpenAI API families work against Gonka executors, plus a vLLM Kimi K2 reference documenting how tool-call and reasoning parsing shapes what the gateway receives upstream.",
        occurredAt: new Date("2026-05-14"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
    ],
  });
  console.log("Seeded 23 build log entries for AutoTM");
  console.log("Seeded 3 build log entries for MyORL");
  console.log("Seeded 4 build log entries for Gonka");
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
