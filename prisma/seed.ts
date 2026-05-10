import { PrismaClient, ContentStatus, ContentVisibility } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const portfolio = await prisma.project.upsert({
    where: { slug: "personal-engineering-portfolio" },
    update: {},
    create: {
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
    },
  });
  console.log(`Seeded: ${portfolio.title}`);

  const carMarketplace = await prisma.project.upsert({
    where: { slug: "car-marketplace" },
    update: {},
    create: {
      slug: "car-marketplace",
      title: "Car Marketplace",
      summary:
        "A full-stack vehicle listing and transaction platform with real-time search, seller verification, and transparent pricing.",
      body: `## Context

The client needed a vehicle marketplace that could handle high-volume listings, verified seller profiles, and transparent pricing without the bloat of legacy automotive platforms.

## Engineering Decisions

- **Search**: PostgreSQL full-text search with ranked results, avoiding the operational overhead of Elasticsearch in v1.
- **Verification**: Multi-step seller identity verification with document upload and manual review queue.
- **Pricing**: Automated market-price suggestions based on comparable listings, updated nightly.
- **Mobile-first**: React Native companion app sharing the Next.js API surface.

## Outcome

Launched with 2,000+ verified listings in the first month. Search latency stayed under 150ms p95.`,
      stack: [
        "Next.js",
        "TypeScript",
        "PostgreSQL",
        "Prisma",
        "React Native",
        "Expo",
        "Stripe",
        "AWS S3",
      ],
      outcome:
        "2,000+ verified listings at launch. Search latency under 150ms p95.",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
      order: 1,
      startedAt: new Date("2024-06-01"),
      completedAt: new Date("2024-12-15"),
    },
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
