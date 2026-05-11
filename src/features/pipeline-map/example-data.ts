/**
 * Static example payload for the pipeline map contract.
 *
 * This represents a fully-populated pipeline for the car marketplace
 * portfolio project.  It serves three purposes:
 *
 * 1. A **development reference** while building the Three.js scene
 *    (render this instead of hitting the database).
 * 2. A **type-safety check** -- the constant satisfies `PipelineMap`.
 * 3. A **test fixture**.
 */

import type { PipelineMap, PipelineMapInput } from "./types";

// ---------------------------------------------------------------------------
// Example input (what the database layer would produce)
// ---------------------------------------------------------------------------

export const exampleInput: PipelineMapInput = {
  project: {
    title: "Car Marketplace",
    slug: "car-marketplace",
    status: "published",
    visibility: "public",
    startedAt: new Date("2025-09-01"),
    completedAt: new Date("2026-03-15"),
  },
  milestones: [
    {
      id: "ms-1",
      title: "Initial Architecture & Setup",
      status: "published",
      targetDate: new Date("2025-10-01"),
      completedAt: new Date("2025-09-28"),
    },
    {
      id: "ms-2",
      title: "Core Listing Features",
      status: "published",
      targetDate: new Date("2025-11-15"),
      completedAt: new Date("2025-11-10"),
    },
    {
      id: "ms-3",
      title: "Search & Filtering",
      status: "published",
      targetDate: new Date("2025-12-20"),
      completedAt: new Date("2025-12-18"),
    },
    {
      id: "ms-4",
      title: "User Authentication & Profiles",
      status: "published",
      targetDate: new Date("2026-01-30"),
      completedAt: new Date("2026-01-25"),
    },
    {
      id: "ms-5",
      title: "Payment Integration",
      status: "draft",
      targetDate: new Date("2026-03-01"),
      completedAt: null,
    },
    {
      id: "ms-6",
      title: "Production Deployment",
      status: "draft",
      targetDate: new Date("2026-04-01"),
      completedAt: null,
    },
  ],
  architectureDecisions: [
    {
      id: "adr-1",
      title: "Monorepo with Turborepo",
      status: "published",
      decidedAt: new Date("2025-09-05"),
    },
    {
      id: "adr-2",
      title: "PostgreSQL with Prisma ORM",
      status: "published",
      decidedAt: new Date("2025-09-08"),
    },
    {
      id: "adr-3",
      title: "Next.js App Router with Server Components",
      status: "published",
      decidedAt: new Date("2025-09-10"),
    },
    {
      id: "adr-4",
      title: "Stripe for Payment Processing",
      status: "published",
      decidedAt: new Date("2026-02-01"),
    },
  ],
  pipelineEvidence: [
    {
      id: "ev-1",
      label: "Architecture Decision Records",
      category: "architecture",
      url: "https://github.com/example/car-mkp/tree/main/docs/adr",
      status: "published",
    },
    {
      id: "ev-2",
      label: "Unit Test Suite Results",
      category: "tests",
      url: "https://github.com/example/car-mkp/actions/runs/100",
      status: "published",
    },
    {
      id: "ev-3",
      label: "Docker Compose Configuration",
      category: "docker",
      url: "https://github.com/example/car-mkp/blob/main/docker-compose.yml",
      status: "published",
    },
    {
      id: "ev-4",
      label: "CI Pipeline Configuration",
      category: "ci_cd",
      url: "https://github.com/example/car-mkp/blob/main/.github/workflows/ci.yml",
      status: "published",
    },
    {
      id: "ev-5",
      label: "Production Deployment Log",
      category: "deployment",
      url: "https://car-marketplace.railway.app",
      status: "published",
    },
    {
      id: "ev-6",
      label: "E2E Test Recordings",
      category: "tests",
      url: "https://github.com/example/car-mkp/actions/runs/120",
      status: "draft",
    },
  ],
  buildLogEntries: [
    {
      id: "bl-1",
      title: "Initial project scaffold",
      status: "published",
      occurredAt: new Date("2025-09-01"),
    },
    {
      id: "bl-2",
      title: "Database schema and migrations",
      status: "published",
      occurredAt: new Date("2025-09-12"),
    },
    {
      id: "bl-3",
      title: "Listing CRUD API",
      status: "published",
      occurredAt: new Date("2025-10-05"),
    },
    {
      id: "bl-4",
      title: "Search implementation (full-text + filters)",
      status: "published",
      occurredAt: new Date("2025-11-20"),
    },
    {
      id: "bl-5",
      title: "Auth.js integration",
      status: "published",
      occurredAt: new Date("2026-01-05"),
    },
    {
      id: "bl-6",
      title: "Stripe checkout flow",
      status: "draft",
      occurredAt: new Date("2026-02-15"),
    },
  ],
};

// ---------------------------------------------------------------------------
// Example output (what the contract produces -- the scene renders this)
// ---------------------------------------------------------------------------

/**
 * A static, pre-built PipelineMap for the car marketplace project.
 *
 * This is a snapshot of what the contract would produce from
 * {@link exampleInput}.  It satisfies the `PipelineMap` type so it can be
 * used as a development fixture without running the contract.
 */
export const examplePipelineMap = {
  nodes: [
    {
      id: "product-car-marketplace",
      stage: "product" as const,
      label: "Car Marketplace",
      status: "verified" as const,
      description: "Project: Car Marketplace",
      date: "2025-09-01T00:00:00.000Z",
      metadata: {
        visibility: "public",
        completedAt: "2026-03-15T00:00:00.000Z",
      },
    },
    // Architecture nodes
    {
      id: "architecture-adr-1",
      stage: "architecture" as const,
      label: "Monorepo with Turborepo",
      status: "verified" as const,
      description: "ADR: Monorepo with Turborepo",
      date: "2025-09-05T00:00:00.000Z",
      metadata: { index: 0 },
    },
    {
      id: "architecture-adr-2",
      stage: "architecture" as const,
      label: "PostgreSQL with Prisma ORM",
      status: "verified" as const,
      description: "ADR: PostgreSQL with Prisma ORM",
      date: "2025-09-08T00:00:00.000Z",
      metadata: { index: 1 },
    },
    {
      id: "architecture-adr-3",
      stage: "architecture" as const,
      label: "Next.js App Router with Server Components",
      status: "verified" as const,
      description: "ADR: Next.js App Router with Server Components",
      date: "2025-09-10T00:00:00.000Z",
      metadata: { index: 2 },
    },
    {
      id: "architecture-adr-4",
      stage: "architecture" as const,
      label: "Stripe for Payment Processing",
      status: "verified" as const,
      description: "ADR: Stripe for Payment Processing",
      date: "2026-02-01T00:00:00.000Z",
      metadata: { index: 3 },
    },
    // Tests node
    {
      id: "tests-car-marketplace",
      stage: "tests" as const,
      label: "Tests",
      status: "verified" as const,
      description: "6 build log entries",
      count: 6,
    },
    // Docker node
    {
      id: "docker-car-marketplace",
      stage: "docker" as const,
      label: "Docker",
      status: "verified" as const,
      description: "Containerized environment",
    },
    // CI/CD node
    {
      id: "cicd-car-marketplace",
      stage: "ciCd" as const,
      label: "CI/CD",
      status: "verified" as const,
      description: "1 CI/CD evidence items",
      count: 1,
    },
    // Deployment node
    {
      id: "deployment-car-marketplace",
      stage: "deployment" as const,
      label: "Deployment",
      status: "verified" as const,
      description: "1 deployment evidence items",
      count: 1,
    },
    // Milestone nodes
    {
      id: "milestone-ms-1",
      stage: "milestones" as const,
      label: "Initial Architecture & Setup",
      status: "verified" as const,
      date: "2025-10-01T00:00:00.000Z",
      description: "Completed: 9/28/2025",
      metadata: { milestoneId: "ms-1" },
    },
    {
      id: "milestone-ms-2",
      stage: "milestones" as const,
      label: "Core Listing Features",
      status: "verified" as const,
      date: "2025-11-15T00:00:00.000Z",
      description: "Completed: 11/10/2025",
      metadata: { milestoneId: "ms-2" },
    },
    {
      id: "milestone-ms-3",
      stage: "milestones" as const,
      label: "Search & Filtering",
      status: "verified" as const,
      date: "2025-12-20T00:00:00.000Z",
      description: "Completed: 12/18/2025",
      metadata: { milestoneId: "ms-3" },
    },
    {
      id: "milestone-ms-4",
      stage: "milestones" as const,
      label: "User Authentication & Profiles",
      status: "verified" as const,
      date: "2026-01-30T00:00:00.000Z",
      description: "Completed: 1/25/2026",
      metadata: { milestoneId: "ms-4" },
    },
    {
      id: "milestone-ms-5",
      stage: "milestones" as const,
      label: "Payment Integration",
      status: "neutral" as const,
      date: "2026-03-01T00:00:00.000Z",
      description: "In progress",
      metadata: { milestoneId: "ms-5" },
    },
    {
      id: "milestone-ms-6",
      stage: "milestones" as const,
      label: "Production Deployment",
      status: "neutral" as const,
      date: "2026-04-01T00:00:00.000Z",
      description: "In progress",
      metadata: { milestoneId: "ms-6" },
    },
    // Evidence nodes
    {
      id: "evidence-ev-1",
      stage: "evidence" as const,
      label: "Architecture Decision Records",
      status: "verified" as const,
      description: "Category: architecture",
      url: "https://github.com/example/car-mkp/tree/main/docs/adr",
      metadata: { category: "architecture" },
    },
    {
      id: "evidence-ev-2",
      stage: "evidence" as const,
      label: "Unit Test Suite Results",
      status: "verified" as const,
      description: "Category: tests",
      url: "https://github.com/example/car-mkp/actions/runs/100",
      metadata: { category: "tests" },
    },
    {
      id: "evidence-ev-3",
      stage: "evidence" as const,
      label: "Docker Compose Configuration",
      status: "verified" as const,
      description: "Category: docker",
      url: "https://github.com/example/car-mkp/blob/main/docker-compose.yml",
      metadata: { category: "docker" },
    },
    {
      id: "evidence-ev-4",
      stage: "evidence" as const,
      label: "CI Pipeline Configuration",
      status: "verified" as const,
      description: "Category: ci_cd",
      url: "https://github.com/example/car-mkp/blob/main/.github/workflows/ci.yml",
      metadata: { category: "ci_cd" },
    },
    {
      id: "evidence-ev-5",
      stage: "evidence" as const,
      label: "Production Deployment Log",
      status: "verified" as const,
      description: "Category: deployment",
      url: "https://car-marketplace.railway.app",
      metadata: { category: "deployment" },
    },
    {
      id: "evidence-ev-6",
      stage: "evidence" as const,
      label: "E2E Test Recordings",
      status: "neutral" as const,
      description: "Category: tests",
      url: "https://github.com/example/car-mkp/actions/runs/120",
      metadata: { category: "tests" },
    },
  ],
  edges: [
    // Product -> Architecture
    {
      source: "product-car-marketplace",
      target: "architecture-adr-1",
    },
    {
      source: "product-car-marketplace",
      target: "architecture-adr-2",
    },
    {
      source: "product-car-marketplace",
      target: "architecture-adr-3",
    },
    {
      source: "product-car-marketplace",
      target: "architecture-adr-4",
    },
    // Architecture -> Tests
    {
      source: "architecture-adr-4",
      target: "tests-car-marketplace",
    },
    // Tests -> Docker
    {
      source: "tests-car-marketplace",
      target: "docker-car-marketplace",
    },
    // Docker -> CI/CD
    {
      source: "docker-car-marketplace",
      target: "cicd-car-marketplace",
    },
    // CI/CD -> Deployment
    {
      source: "cicd-car-marketplace",
      target: "deployment-car-marketplace",
    },
    // Product -> Milestones
    {
      source: "product-car-marketplace",
      target: "milestone-ms-1",
    },
    {
      source: "product-car-marketplace",
      target: "milestone-ms-2",
    },
    {
      source: "product-car-marketplace",
      target: "milestone-ms-3",
    },
    {
      source: "product-car-marketplace",
      target: "milestone-ms-4",
    },
    {
      source: "product-car-marketplace",
      target: "milestone-ms-5",
    },
    {
      source: "product-car-marketplace",
      target: "milestone-ms-6",
    },
    // Product -> Evidence
    {
      source: "product-car-marketplace",
      target: "evidence-ev-1",
      label: "proves",
    },
    {
      source: "product-car-marketplace",
      target: "evidence-ev-2",
      label: "proves",
    },
    {
      source: "product-car-marketplace",
      target: "evidence-ev-3",
      label: "proves",
    },
    {
      source: "product-car-marketplace",
      target: "evidence-ev-4",
      label: "proves",
    },
    {
      source: "product-car-marketplace",
      target: "evidence-ev-5",
      label: "proves",
    },
    {
      source: "product-car-marketplace",
      target: "evidence-ev-6",
      label: "proves",
    },
  ],
  status: "verified" as const,
  projectName: "Car Marketplace",
  projectSlug: "car-marketplace",
} as const satisfies PipelineMap;
