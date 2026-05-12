import { PrismaClient, ContentStatus, ContentVisibility } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const portfolioData = {
    slug: "personal-engineering-portfolio",
    title: "Personal Engineering Portfolio",
    summary:
      "A production-minded portfolio that proves delivery discipline end to end — tests, Docker, CI/CD, architecture decisions, and transparent milestone visibility.",
    body: null,
    stack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Prisma",
      "PostgreSQL",
      "Auth.js",
      "Vitest",
      "Playwright",
      "Docker",
      "GitHub Actions",
    ],
    outcome:
      "The portfolio becomes its own case study — every visitor can inspect the engineering system that built the site.",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 0,
    startedAt: new Date("2025-01-01"),
    completedAt: null,
  };

  const portfolio = await prisma.project.upsert({
    where: { slug: portfolioData.slug },
    update: portfolioData,
    create: portfolioData,
  });
  console.log(`Seeded: ${portfolio.title}`);

  const carMarketplaceData = {
    slug: "car-marketplace",
    title: "Car Marketplace",
    summary:
      "A vehicle listing and transaction platform for the Turkmenistan market — Flutter mobile app with a NestJS API, real-time chat, and media pipeline.",
    body: `## Context

The goal was to build a vehicle marketplace tailored to local buying and selling patterns — supporting detailed listings with photos and video, seller profiles, real-time messaging, and subscription tiers.

## Engineering Decisions

- **Mobile-first**: Flutter for cross-platform mobile (iOS/Android) with GetX state management, rather than maintaining two native codebases.
- **API**: NestJS with TypeScript strict mode — modular domain structure with clear boundaries between posts, auth, chat, notifications, and media.
- **Query builder**: Specification pattern for post search/filtering, making complex queries composable and testable without raw SQL scattered through controllers.
- **ORM**: Sequelize with explicit migrations via sequelize-cli, rather than an auto-migration tool, so schema changes are reviewable.
- **Media pipeline**: Photo and video upload with fluent-ffmpeg processing, stored on-disk in a volume-mounted uploads directory.
- **Real-time**: WebSocket-based chat and push notifications via Firebase Cloud Messaging.
- **Auth**: OTP/SMS-based authentication with JWT refresh tokens — no password database to maintain.
- **Offline deployment**: Multi-stage Dockerfile that builds on a machine with internet, then produces a self-contained image for transfer to an offline Ubuntu server.

## Current State

The core marketplace flow is functional: listing creation with media, search and filtering, favorites, comments, real-time chat, and user profiles. The backend runs containerized with Docker Compose, healthchecks on both Postgres and API containers, and a migration/seed pipeline for reproducible environments.

Testing covers unit, integration, and e2e layers on the backend, plus unit and integration tests in Flutter.`,
    stack: [
      "Flutter",
      "Dart",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "Sequelize",
      "Firebase",
      "Docker",
      "GetX",
      "Socket.io",
    ],
    outcome:
      "Active build — core marketplace flow is functional with Flutter mobile frontend and containerized NestJS API. Iterating on seller verification and payment integration before public launch.",
    status: ContentStatus.published,
    visibility: ContentVisibility.public,
    order: 1,
    startedAt: new Date("2024-06-01"),
    completedAt: null,
  };

  const carMarketplace = await prisma.project.upsert({
    where: { slug: carMarketplaceData.slug },
    update: carMarketplaceData,
    create: carMarketplaceData,
  });
  console.log(`Seeded: ${carMarketplace.title}`);

  // --- Milestones for Car Marketplace ---
  // Delete existing milestones for this project and recreate for idempotency.

  await prisma.milestone.deleteMany({
    where: { projectId: carMarketplace.id },
  });

  const milestones = [
    {
      projectId: carMarketplace.id,
      title: "Core marketplace flow",
      description:
        "Listing creation with media upload, search and filtering, favorites, comments, and user profiles.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 0,
      targetDate: new Date("2024-09-01"),
      completedAt: new Date("2024-09-15"),
    },
    {
      projectId: carMarketplace.id,
      title: "Real-time chat and notifications",
      description:
        "WebSocket-based messaging between buyers and sellers with Firebase Cloud Messaging push notifications.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 1,
      targetDate: new Date("2024-11-01"),
      completedAt: new Date("2024-11-10"),
    },
    {
      projectId: carMarketplace.id,
      title: "Seller verification system",
      description:
        "Identity verification workflow for sellers including document upload, manual review queue, and verified badge.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 2,
      targetDate: new Date("2026-03-01"),
      completedAt: null,
    },
    {
      projectId: carMarketplace.id,
      title: "Payment gateway integration",
      description:
        "Local payment provider integration for in-app transactions, escrow, and payout processing.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 3,
      targetDate: new Date("2026-06-01"),
      completedAt: null,
    },
    {
      projectId: carMarketplace.id,
      title: "Public launch preparation",
      description:
        "App store listing, production hardening, load testing, and monitoring setup.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 4,
      targetDate: new Date("2026-09-01"),
      completedAt: null,
    },
  ];

  const createdMilestones = await prisma.milestone.createMany({
    data: milestones,
  });
  console.log(`Seeded ${createdMilestones.count} milestones for Car Marketplace`);

  // --- Architecture Decisions for Car Marketplace ---
  await prisma.architectureDecision.deleteMany({ where: { projectId: carMarketplace.id } });
  await prisma.architectureDecision.createMany({
    data: [
      {
        projectId: carMarketplace.id, title: "Mobile-first with Flutter",
        summary: "Flutter for cross-platform mobile (iOS/Android) with GetX state management, rather than maintaining two native codebases.",
        body: "Building separate native iOS and Android apps would double the mobile engineering surface. Flutter provides a single Dart codebase with platform-native rendering and a rich widget system.",
        status: ContentStatus.published, visibility: ContentVisibility.public, order: 0, decidedAt: new Date("2024-06-15"),
      },
      {
        projectId: carMarketplace.id, title: "Offline Docker deployment",
        summary: "Multi-stage Dockerfile that builds on an internet-connected machine, then produces a self-contained image for transfer to an offline Ubuntu server.",
        body: null,
        status: ContentStatus.published, visibility: ContentVisibility.public, order: 1, decidedAt: new Date("2024-07-01"),
      },
      {
        projectId: carMarketplace.id, title: "Specification pattern for search queries",
        summary: "Encapsulate each search filter as a composable specification object, making the search/filter API testable without raw SQL scattered through controllers.",
        body: null,
        status: ContentStatus.published, visibility: ContentVisibility.public, order: 2, decidedAt: new Date("2024-08-01"),
      },
    ],
  });
  console.log("Seeded 3 architecture decisions for Car Marketplace");

  // --- Pipeline Evidence for Car Marketplace ---
  await prisma.pipelineEvidence.deleteMany({ where: { projectId: carMarketplace.id } });
  await prisma.pipelineEvidence.createMany({
    data: [
      {
        projectId: carMarketplace.id, label: "Docker build passes",
        description: "Multi-stage Dockerfile builds successfully with production optimizations.",
        category: "docker", url: null,
        status: ContentStatus.published, visibility: ContentVisibility.public,
        recordedAt: new Date("2025-01-15"),
      },
      {
        projectId: carMarketplace.id, label: "Backend unit tests — 200+ cases passing",
        description: "NestJS service layer, controller, and utility tests pass consistently.",
        category: "testing", url: null,
        status: ContentStatus.published, visibility: ContentVisibility.public,
        recordedAt: new Date("2025-02-01"),
      },
      {
        projectId: carMarketplace.id, label: "CI pipeline configured — GitHub Actions",
        description: "Lint, typecheck, unit tests, and build steps run on every PR.",
        category: "ci", url: null,
        status: ContentStatus.published, visibility: ContentVisibility.public,
        recordedAt: new Date("2025-02-10"),
      },
    ],
  });
  console.log("Seeded 3 pipeline evidence records for Car Marketplace");

  // --- Private Room for Portfolio ---
  const crypto = await import("node:crypto");

  const portfolioRoom = await prisma.privateRoom.upsert({
    where: { slug: "portfolio-client-room" },
    update: {},
    create: {
      slug: "portfolio-client-room",
      projectId: portfolio.id,
      showMilestones: true,
      showUpdates: true,
      showArchitecture: true,
      showEvidence: true,
      showNextSteps: true,
      status: ContentStatus.published,
      visibility: ContentVisibility.privateRoom,
    },
  });
  console.log(`Seeded private room: ${portfolioRoom.slug}`);

  // Create a valid access token for the private room
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  await prisma.accessToken.upsert({
    where: { tokenHash },
    update: {},
    create: {
      tokenHash,
      roomId: portfolioRoom.id,
      label: "Demo client token",
    },
  });
  console.log(`Seeded access token for room (raw: ${rawToken.slice(0, 8)}...)`);

  // --- Fixed test tokens for E2E smoke tests ---
  const validTestRaw = "test-valid-token-00000000000000000000000000000000";
  const validTestHash = crypto.createHash("sha256").update(validTestRaw).digest("hex");

  await prisma.accessToken.upsert({
    where: { tokenHash: validTestHash },
    update: {},
    create: {
      tokenHash: validTestHash,
      roomId: portfolioRoom.id,
      label: "E2E test valid token",
    },
  });

  const revokedTestRaw = "test-revoked-token-00000000000000000000000000";
  const revokedTestHash = crypto.createHash("sha256").update(revokedTestRaw).digest("hex");

  await prisma.accessToken.upsert({
    where: { tokenHash: revokedTestHash },
    update: {},
    create: {
      tokenHash: revokedTestHash,
      roomId: portfolioRoom.id,
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
        projectId: portfolio.id,
        title: "Project scaffold and design tokens landed",
        body: "Next.js 16 App Router scaffold with TypeScript strict mode. Tailwind CSS and shadcn/ui configured. Semantic status tokens and design vocabulary established.",
        occurredAt: new Date("2026-05-01"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: carMarketplace.id,
        title: "Car marketplace project page with case study body",
        body: "Project page renders published project data with outcome-first layout. Safe Markdown module renders the case study body.",
        occurredAt: new Date("2026-05-05"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
      {
        projectId: portfolio.id,
        title: "Auth.js owner login and admin route protection",
        body: "GitHub OAuth configured for owner-only admin access. Server-side auth guard protects all /admin routes.",
        occurredAt: new Date("2026-05-08"),
        status: ContentStatus.published,
        visibility: ContentVisibility.public,
      },
    ],
  });
  console.log("Seeded 3 build log entries");
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
