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
    title: "Carberk",
    summary:
      "Car marketplace for Turkmenistan by Alpha Motors, live on Google Play. Expo mobile app, NestJS and PostgreSQL API, real-time chat and admin moderation.",
    body: `## Context

Carberk, by Alpha Motors, is a car marketplace for Turkmenistan. The old version was a Flutter app on a stock NestJS API. The rewrite rebuilt the mobile app, API, admin and hosting from scratch.

![Carberk by Alpha Motors, a car marketplace for Turkmenistan](/carberk/feature-graphic.png)

## Decisions

- **Monorepo**: Turborepo + pnpm workspaces with 7 apps and 5 shared packages. Shared Prisma schema, Zod contracts, and UI tokens consumed by every client.
- **Mobile**: Expo SDK 55 + React Native 0.83.6 with NativeWind v4 and React Native Reusables, replacing Flutter.
- **API**: NestJS 11 on Fastify. Each area (sign-in, listings, chat, admin) is its own module with a plain TypeScript core.
- **ORM**: Prisma 7 with explicit migrations and a single schema file in \`packages/db\`, replacing Sequelize.
- **Web**: Next.js 16 + Tailwind CSS v4 + shadcn/ui for both public site (auto.tm) and admin dashboard (admin.auto.tm).
- **Media pipeline**: MinIO (S3-compatible) + Sharp for variant generation, replacing Firebase Storage. The app compresses photos before upload, and the API checks who owns a file before it can be attached or deleted.
- **Real-time**: Socket.IO 4 with a Redis adapter for buyer-seller chat: saved messages, read states, unread counts, and mute, report and block.
- **Auth**: Sign-in codes go out through a fleet of 5–20 Android phones running a Kotlin agent, because local SMS providers are expensive and unreliable. JWT access tokens, hashed refresh tokens, and up to 10 devices per account.
- **Job queue**: BullMQ + Redis + dedicated NestJS worker app for async processing.
- **Hosting**: Railway, with every service in a plain Docker container, so moving to servers inside Turkmenistan is a redeploy, not a rewrite.
- **Deployment**: Multi-service Docker images built via GitHub Actions, with disposable PR backends on Railway for review.

## Release

Live on Google Play in English, Russian and Turkmen, as an update to the existing Play listing.

What shipped:

- Phone sign-in with one-time codes and sessions on up to 10 devices.
- A 7-step sell flow with brand, model, year and generation pickers, photo upload and drafts.
- Search by brand, model and year, with live result counts and favorites.
- Buyer-seller chat with read labels, quick replies, mute, report and block, plus push notifications.
- Staff moderation, report review, verified-phone seller badges and condition disclosure.
- Legal pages, account deletion and the Google Play release.

## Now building

In progress since October 2026. None of this has shipped yet:

- **Car diagnostics center**: a staff workspace for one diagnostics center in Aşgabat, with versioned checklists, photo evidence, finalized reports that cannot be edited later, and stored PDFs. Buyer-private reports and seller-authorized public reports keep separate audiences.
- **Vehicle history by VIN**: a paid history lookup from established providers such as Carfax and AutoCheck, run through an operator queue with its own Support channel. No paid provider calls are made until rights and capacity are confirmed.
- **Dealer showrooms**: free business workspaces for approved dealerships. The business owns its inventory and enquiries, so a salesperson leaving does not take listings or customer chats with them.
- **Listing video**: an optional walkaround video of up to 90 seconds per listing, rolled out to testers first. Photos alone still allow publishing while a video is processing.
- **Aşgabat pilot**: a 20-user app pilot, measured in-house, run separately from the manual inspection trial.`,
    stack: [
      "React Native",
      "Expo SDK 55",
      "NestJS 11",
      "PostgreSQL 16",
      "Next.js 16",
      "Socket.IO",
      "Docker",
    ],
    outcome:
      "Live on Google Play. Built over five months, from first commit in May 2026 to the October release.",
    liveUrl: "https://play.google.com/store/apps/details?id=com.auto_tm.ynamly",
    repoUrl: "https://github.com/bagtyyarkovusov/auto.tm-rewrite",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 0,
    startedAt: new Date("2026-05-13"),
    completedAt: new Date("2026-10-09"),
  };

  const autoTm = await prisma.project.upsert({
    where: { slug: autoTmData.slug },
    update: autoTmData,
    create: autoTmData,
  });
  console.log(`Seeded: ${autoTm.title}`);

  // --- TM-WhatsApp: encrypted messenger for Turkmenistan (hidden until features ship) ---
  const tmWhatsAppData = {
    slug: "tm-whatsapp",
    title: "TM-WhatsApp",
    summary:
      "An early-stage WhatsApp-class messenger for Turkmenistan — Signal Protocol end-to-end encryption, designed for 2 Mbps networks, currently a scaffolded monorepo with the architecture decided and no end-user features shipped.",
    body: `## Context

The most-used chat app in Turkmenistan today is IMO — laggy and ad-stuffed — while WhatsApp itself is unreliable or blocked. TM-WhatsApp is a WhatsApp-class messenger designed from the ground up for the local community: fast, clean, and genuinely end-to-end encrypted, built to tolerate ~2 Mbps networks and restrictive NATs. It is a sister project to Carberk and deliberately reuses its stack, OTP gateway, and deployment patterns.

## Engineering Decisions (12 accepted ADRs)

- **E2EE is real**: Signal Protocol for messages (ADR-0003), client-side-encrypted media with per-attachment AES-256 keys (ADR-0008), and user-held backup keys the operator cannot recover (ADR-0007). The server stores ciphertext and prekey bundles only — never plaintext, identity keys, or the contact graph.
- **Device-aware from day one (ADR-0006)**: account → N devices → prekey bundles; linked devices join via QR scan and signed approval, capped at roughly five per account.
- **Three transports, no overlap (ADR-0004)**: Socket.IO for chat and signaling, HTTPS/MinIO for media and backups, WebRTC for calls with a degradation ladder down to audio-only.
- **Auth (ADR-0009)**: phone-number identity (+993) with OTP delivered through the same SMS-gateway fleet pattern as Carberk; per-device refresh tokens with rotation and sliding expiry.
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
    visibility: ContentVisibility.adminOnly,
    order: 5,
    startedAt: new Date("2026-07-19"),
    completedAt: null,
  };

  const tmWhatsApp = await prisma.project.upsert({
    where: { slug: tmWhatsAppData.slug },
    update: tmWhatsAppData,
    create: tmWhatsAppData,
  });
  console.log(`Seeded: ${tmWhatsApp.title}`);

  // --- Tayyn Hyzmat: delivery dispatch for a Turkmenistan operator ---
  const tayynData = {
    slug: "tayyn-hyzmat",
    title: "Tayyn Hyzmat",
    summary:
      "Delivery dispatch for a Turkmenistan operator: a web dashboard for dispatchers and an Android app for drivers, built for slow connections.",
    body: `## Context

Tayyn Hyzmat handles restaurant, flower and parcel deliveries in Aşgabat. Customers phone in orders. A dispatcher enters each one, and drivers in that region get a 20-second offer to claim it. The driver app is handed out to drivers directly rather than through Google Play.

## Decisions

- **Kept Vue.** The project started from the open-source OpenRide base. The client wanted something light and simple to run, so I upgraded it to Vue 3 with strict TypeScript and rebuilt the dispatcher and driver apps instead of rewriting in another framework.
- **Kept the familiar grid.** Many drivers are older and already knew a region-grid layout from the app they used before. The new driver home keeps that grid, with live order and driver counts per region.
- **Built for weak signal.** Socket.IO pushes order and count updates, lists refresh on reconnect, and the server rechecks every claim so two drivers can never take the same order.
- **Shifts survive a locked phone.** The Android app keeps a driver on shift in the background with a renewable 60-second lease, and drops them when GPS goes stale.

## Stack

Vue 3, Vite, TypeScript and shadcn-vue for the browser apps, Capacitor for Android, and an Express API with Prisma, PostgreSQL and Socket.IO. Everything ships as Docker images.

## Status

Internal pilot with one dispatcher and a small group of drivers.`,
    stack: [
      "Vue 3",
      "TypeScript",
      "shadcn-vue",
      "Capacitor",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Socket.IO",
      "Docker",
    ],
    outcome:
      "Internal pilot: phoned-in orders reach drivers in seconds, and each claim is checked on the server so no order is taken twice.",
    liveUrl: null,
    repoUrl: "https://github.com/bagtyyarkovusov/tayyn-hyzmat-project",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 1,
    startedAt: new Date("2026-10-15"),
    completedAt: null,
  };

  const tayyn = await prisma.project.upsert({
    where: { slug: tayynData.slug },
    update: tayynData,
    create: tayynData,
  });
  console.log(`Seeded: ${tayyn.title}`);

  // --- Portfolio Project (meta case study) ---
  const portfolioData = {
    slug: "personal-engineering-portfolio",
    title: "Personal engineering portfolio",
    summary:
      "This site: Next.js 16 on Railway, with GitHub Actions checks, Prisma migrations and private client rooms.",
    body: `## Context

The code, tests and CI config are public on GitHub.

## Decisions

- **Framework**: Next.js 16 App Router with TypeScript strict mode. Server components by default, client boundaries only where needed.
- **Styling**: Tailwind CSS v4 with OKLCH design tokens and shadcn/ui. Geist Sans and Geist Mono, dark only.
- **Database**: PostgreSQL with Prisma 7. Content status and visibility are separate concerns (draft/published/archived × public/privateRoom/adminOnly).
- **Auth**: Auth.js v5 beta with GitHub OAuth, owner-only access. No client accounts in v1.
- **Private Rooms**: Signed, revocable, SHA256-hashed tokens for read-only client project views.
- **Testing**: Vitest unit tests, Playwright end-to-end tests and axe accessibility scans, all in CI.
- **CI/CD**: GitHub Actions validates Prisma, migrations, seed data, typechecking, unit tests, production build, Docker image creation, smoke flows, accessibility, and private-room access.
- **Deployment**: Multi-stage Dockerfile, Next.js standalone output, Railway container deployment, Railway-managed PostgreSQL, and runtime environment variables for secrets and canonical URLs.
- **Migration discipline**: Production starts with \`prisma migrate deploy\` before \`node server.js\`, keeping local, CI, and Railway schema evolution on the same path.
- **Custom domain**: \`bagtyyar.dev\` is the canonical production URL, with Auth.js and SEO metadata configured through Railway variables.`,
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
      "Every merge passes five CI jobs before it deploys to Railway.",
    liveUrl: "https://bagtyyar.dev",
    repoUrl: "https://github.com/bagtyyarkovusov/personal-engineering-portfolio",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 3,
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
    title: "MyORL: ENT clinic platform",
    summary:
      "Bilingual website for a private ENT clinic in Athens, live and serving patients. Next.js 16, a Strapi 5 CMS the staff run themselves, and Meilisearch.",
    body: `## Context

A private ENT (ear, nose, throat) surgical clinic in Athens needed a modern web presence: a bilingual (Greek/Russian) site with a condition encyclopedia, service and price pages, video content, and appointment booking. Non-technical staff maintain it after handover.

## Decisions

- **Frontend**: Next.js 16 App Router + React 19 + Tailwind CSS v4, bilingual routing (Greek/Russian), server components for fast first paint on clinic Wi-Fi and mobile data.
- **CMS**: Strapi 5 + PostgreSQL 18 so clinic staff edit encyclopedia entries, prices, and videos without touching code.
- **Search**: Meilisearch for instant, typo-tolerant search across conditions and treatments, because patients rarely know the exact medical spelling.
- **Migration**: Custom extraction tooling (\`myorl-migrate\`) to pull content out of the legacy MODX site into structured Strapi content types.
- **Infrastructure**: Docker Compose + Caddy locally; production deployed on Railway (frontend, Strapi, Postgres, and Meilisearch as separate services).
- **Testing**: Vitest + React Testing Library for components, Playwright for end-to-end flows including booking.

[Visit the live site](https://myorl.up.railway.app) · [Public repository](https://github.com/bagtyyarkovusov/myorl-pavlos)`,
    stack: [
      "Next.js 16",
      "Strapi 5",
      "Meilisearch",
      "PostgreSQL 18",
      "Docker",
      "Railway",
    ],
    outcome:
      "Live in production. Clinic staff edit the Greek and Russian content themselves.",
    liveUrl: "https://myorl.up.railway.app",
    repoUrl: "https://github.com/bagtyyarkovusov/myorl-pavlos",
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
    title: "Gonka: AI inference infrastructure",
    summary:
      "Specified, deployed, and supported a 24-node GPU cluster (192× RTX 4080) serving open-weight LLMs on the Gonka decentralized AI inference network, plus an OpenAI-compatible API gateway built on top of it.",
    body: `## Context

[Gonka](https://gonka.ai) is a decentralized network for AI inference: hosts run GPU servers serving open-weight models and earn network tokens for verified compute. During the network's early phase, a host engaged me to take their operation from zero to production: hardware selection, procurement guidance (servers sourced from China), deployment, and ongoing operations, with a 3-month support guarantee. Client identity and commercial figures are confidential.

## Scope Delivered

- **Hardware specification**: advised on server selection for a 24-node cluster, 8× RTX 4080 per node, **192 GPUs** in total.
- **Model serving**: deployed open-weight LLM inference at scale, including Qwen 235B-class instruction models.
- **Operations**: node setup, network onboarding, monitoring, and a 3-month support engagement covering incident response and tuning.

## GonkaProvider: my open-source API gateway

On top of the infrastructure work, I built and open-sourced **GonkaProvider**: an OpenAI-compatible Express/TypeScript gateway that proxies chat completions to Gonka ML nodes via the signed \`gonka-openai\` client.

- Strict TypeScript + Zod validation across both external boundaries: client requests and upstream SSE chunks.
- OpenAI Responses API translation layer on top of chat completions, so both API families work against Gonka executors.
- Docker and docker-compose packaging for one-command deployment.
- Includes an upstream fix for a chunk-validation bug found while integrating: Gonka emits mid-stream errors as a bare string (\`{"error":"terminated"}\`) instead of an OpenAI-shaped object, which previously broke downstream clients' schema validation.

[GonkaProvider on GitHub](https://github.com/bagtyyarkovusov/GonkaProvider)`,
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
      "24 servers / 192× RTX 4080 GPUs taken from hardware list to revenue-earning production, plus a public OpenAI-compatible API gateway.",
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
      title: "Project setup",
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
      title: "Phone sign-in",
      description:
        "Sign-in with one-time codes sent through a custom SMS gateway, sessions on up to 10 devices, and rate limits.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 1,
      targetDate: new Date("2026-05-16"),
      completedAt: new Date("2026-05-16"),
    },
    {
      projectId: autoTm.id,
      title: "Selling a car",
      description:
        "The 7-step sell flow in the mobile app, photo upload, drafts, and listing detail with owner and sold states.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 2,
      targetDate: new Date("2026-06-27"),
      completedAt: new Date("2026-06-27"),
    },
    {
      projectId: autoTm.id,
      title: "Search and favorites",
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
      title: "Buyer-seller chat",
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
      title: "Notifications",
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
      title: "Admin and moderation",
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
      title: "Move hosting to Turkmenistan",
      description:
        "Move production from Railway to servers inside Turkmenistan.",
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
        "Audited the old MODX site and wrote tools to move its content into Strapi.",
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
        "Strapi 5 + PostgreSQL content types for pages, encyclopedia entries, services, prices, and media.",
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
      title: "Client fixes and handover",
      description:
        "Worked through the clinic's requirements list, published 23 Greek pages, and handed content editing to clinic staff.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 4,
      targetDate: new Date("2026-06-03"),
      completedAt: new Date("2026-06-03"),
    },
    {
      projectId: myorl.id,
      title: "Relaunch",
      description:
        "Relaunched at myorl.up.railway.app after the original hosting lapsed.",
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
        "Gateway layout under src/, Dockerfile and docker-compose, domain context documentation, three ADRs.",
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
        "Ongoing maintenance of the public GonkaProvider repository: tracking gonka-openai releases, vLLM executor behavior, and OpenAI API changes.",
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
  console.log("Seeded 0 architecture decisions for AutoTM");

  // --- Architecture Decisions for MyORL ---
  await prisma.architectureDecision.deleteMany({ where: { projectId: myorl.id } });
  await prisma.architectureDecision.createMany({
    data: [
      {
        projectId: myorl.id,
        title: "Strapi as the CMS, behind one gateway",
        summary:
          "Staff edit content in Strapi. The frontend reads it through one gateway, so CMS changes don't break pages.",
        body: null,
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
        body: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 1,
        decidedAt: new Date("2026-05-24"),
      },
      {
        projectId: myorl.id,
        title: "Redirects for old URLs",
        summary:
          "Legacy MODX URLs resolve through a dedicated Strapi content type instead of hard-coded redirect tables.",
        body: null,
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
          "One Express service exposes an OpenAI-style API and is the only client that talks to the Gonka network, so API keys and request signing live in one place.",
        body: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 0,
        decidedAt: new Date("2026-05-10"),
      },
      {
        projectId: gonka.id,
        title: "Always stream upstream for chat completions",
        summary:
          "The gateway always streams from Gonka, then either forwards the stream or assembles one response for clients that don't stream.",
        body: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        order: 1,
        decidedAt: new Date("2026-05-10"),
      },
      {
        projectId: gonka.id,
        title: "Multimodal payload normalization at the gateway",
        summary:
          "The gateway reorders and inlines images and video so clients can send any common format and avoid upstream 400 errors.",
        body: null,
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
        label: "Docker images for 5 services",
        description:
          "API, web, admin, worker and SMS-gateway services each build from a multi-stage Dockerfile.",
        category: "docker",
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
  console.log("Seeded 2 pipeline evidence records for AutoTM");

  // --- Pipeline Evidence for Portfolio ---
  await prisma.pipelineEvidence.deleteMany({ where: { projectId: portfolio.id } });
  await prisma.pipelineEvidence.createMany({
    data: [
      {
        projectId: portfolio.id,
        label: "GitHub Actions quality gate",
        description:
          "Prisma validate, migration deploy, seed verification, typecheck, Vitest unit tests, production build, Docker image verification, smoke checks, private-room checks, and accessibility scans run before code reaches production.",
        category: "ci",
        url: null,
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
        recordedAt: new Date("2026-05-22"),
      },
      {
        projectId: portfolio.id,
        label: "Playwright tests in 4 CI jobs",
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
        label: "Accessibility scans",
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
        label: "GonkaProvider on GitHub",
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
  console.log("Seeded 3 pipeline evidence records for Gonka");

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
        title: "Phone sign-in shipped",
        body: "Sign-in with one-time codes sent through a custom SMS gateway, sessions on up to 10 devices, and rate limits on code requests.",
        occurredAt: new Date("2026-05-16"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Car catalog in Turkmen, Russian and English",
        body: "Brands, models, colors, body types, regions and other lookup lists, plus exchange rates for price conversion.",
        occurredAt: new Date("2026-05-18"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "7-step sell flow in the mobile app",
        body: "Listing creation in the mobile app, with step validation, photo upload and catalog pickers.",
        occurredAt: new Date("2026-05-19"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Conversations API and seller chat list",
        body: "Open and list conversations use-cases landed in the API, followed by the seller conversation list on the mobile Chat tab.",
        occurredAt: new Date("2026-06-07"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Sprint 10: chat, message notifications and mobile polish",
        body: "Buyers and sellers can chat, and new messages trigger push notifications. Verified-phone seller badges and condition disclosure (damage and known issues) shipped in the same weeks.",
        occurredAt: new Date("2026-07-17"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Hosting plan: Railway first, Turkmenistan later",
        body: "Staging and production move to Railway until the app store approves the app, then to servers inside Turkmenistan. Everything stays in plain Docker containers, so the move is a redeploy. This replaces the original offline-only plan.",
        occurredAt: new Date("2026-07-20"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Sprint 11: test access for store reviewers",
        body: "Store reviewers get a sign-in bypass that is logged for audit, plus seeded demo data, so they can test the app without real listings.",
        occurredAt: new Date("2026-08-08"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Search screen and full-screen search parameters",
        body: "Search screen for brands, models, and years, then the full-screen search parameters form replacing the filter sheet. Listing detail gained owner and sold states. Results, filters and sorting now look the same on every screen.",
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
        body: "Messages list rows and conversation screens with mute, report, and block; unread count on the Messages tab; the notification center on Cabinet; contact phone confirmation API; and the Android reviewer release handoff documented for the planned store submission.",
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
        title: "Sell flow: preview, clear blockers and a contact phone step",
        body: "The check-and-publish step gained a preview with per-section Change links and named blockers instead of generic errors, and a new contact step lets the seller pick or confirm the contact phone bound to the listing.",
        occurredAt: new Date("2026-10-05T13:04:12Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Display names, generated avatars, and listing editing",
        body: "Every user gets a generated name and avatar, shown on Cabinet and Profile. Users can edit their display name, and sellers can edit a published listing section by section.",
        occurredAt: new Date("2026-10-05T18:17:39Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Account deletion made atomic; Turkmen copy and profile fixes",
        body: "Deleting an account now archives the user's listings in the same transaction, so a failure can't leave half-deleted data. Control characters are stripped from display names (NUL caused 500 errors), and Turkmen copy uses akkaunt everywhere.",
        occurredAt: new Date("2026-10-05T20:55:49Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Play Console submission pack prepared",
        body: "Store listing copy in RU, TK, and EN, Data safety answers and permissions cited to the code, app content answers, a reviewer access template, and the founder's Console checklist. That is the full submission pack for the Play release.",
        occurredAt: new Date("2026-10-05T21:05:48Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Privacy: credentials and search terms kept out of logs",
        body: "pino-http no longer logs Authorization, Cookie, or API-key headers, and query strings (including search terms) stay out of the request log. Purge deletes the user's sign-in code records and clears contact phones on kept listings, a job sweeps code records older than 30 days, and Android backup is disabled.",
        occurredAt: new Date("2026-10-05T21:39:25Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "EXIF and GPS stripped from stored images",
        body: "Listing photo originals carrying metadata or an orientation tag are re-encoded upright without it (within the 5 MB cap) before variants are built, and chat images are re-encoded the same way before another user can load them. Chat only accepts images uploaded for that conversation.",
        occurredAt: new Date("2026-10-05T22:53:09Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Store release wired to the existing Play app as version 2.0.0",
        body: "The new app ships as version 2.0.0, an update to the existing Play listing, with a build check that refuses a mismatched package name.",
        occurredAt: new Date("2026-10-05T23:38:57Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: autoTm.id,
        title: "Sign-in code logs redacted; Play submission decisions recorded",
        body: "Sign-in log lines now show only the last four digits of the phone number, and Google Play publishing from the command line was set up.",
        occurredAt: new Date("2026-10-06T11:18:01Z"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: myorl.id,
        title: "Search corpus seed and Strapi webhook lifecycle",
        body: "Loaded all content into Meilisearch. Strapi now reindexes a page whenever staff edit, unpublish or delete it, and Greek and Russian synonym lists improve matches.",
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
        body: "Site restored on a new Railway project after the original deployment lapsed.",
        occurredAt: new Date("2026-10-03"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: gonka.id,
        title: "GonkaProvider first commit: an OpenAI-compatible proxy",
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
        body: "All source modules converted to strict TypeScript with Zod validation at both external boundaries. validateUpstreamChunk now catches non-OpenAI-shaped SSE chunks at the seam. This fixes the bug where Gonka emits {\"error\":\"terminated\"} as a bare string, previously forwarded verbatim and breaking downstream clients' schema validation. 89 unit tests passing across 17 suites.",
        occurredAt: new Date("2026-05-11"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: gonka.id,
        title: "OpenAI Responses API translation layer and vLLM reference docs",
        body: "Added Responses API support (schemas, SSE, compaction, translation to chat completions) so both OpenAI API families work against Gonka executors, plus a vLLM Kimi K2 reference documenting how tool-call and reasoning parsing shapes what the gateway receives upstream.",
        occurredAt: new Date("2026-05-14"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
    ],
  });
  console.log("Seeded 19 build log entries for AutoTM");
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
