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
