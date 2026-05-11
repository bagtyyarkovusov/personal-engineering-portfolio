/**
 * Type definitions for the Three.js Pipeline Map data contract.
 *
 * This module defines the shapes that decouple the Three.js scene
 * from Prisma models. The scene only imports from this file and
 * {@link contract.ts} -- never from the database layer directly.
 *
 */

import type { Status } from "@/design/statuses";

// ---------------------------------------------------------------------------
// Pipeline stages
// ---------------------------------------------------------------------------

/** Canonical pipeline stages matching the engineering delivery system. */
export const PipelineStage = {
  PRODUCT: "product",
  ARCHITECTURE: "architecture",
  TESTS: "tests",
  DOCKER: "docker",
  CI_CD: "ciCd",
  DEPLOYMENT: "deployment",
  MILESTONES: "milestones",
  EVIDENCE: "evidence",
} as const;

export type PipelineStage =
  (typeof PipelineStage)[keyof typeof PipelineStage];

/** All pipeline stages in display order (top-to-bottom / left-to-right). */
export const PIPELINE_STAGES: readonly PipelineStage[] = [
  PipelineStage.PRODUCT,
  PipelineStage.ARCHITECTURE,
  PipelineStage.TESTS,
  PipelineStage.DOCKER,
  PipelineStage.CI_CD,
  PipelineStage.DEPLOYMENT,
  PipelineStage.MILESTONES,
  PipelineStage.EVIDENCE,
] as const;

/** Human-readable display labels for every stage. */
export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  [PipelineStage.PRODUCT]: "Product",
  [PipelineStage.ARCHITECTURE]: "Architecture",
  [PipelineStage.TESTS]: "Tests",
  [PipelineStage.DOCKER]: "Docker",
  [PipelineStage.CI_CD]: "CI/CD",
  [PipelineStage.DEPLOYMENT]: "Deployment",
  [PipelineStage.MILESTONES]: "Milestones",
  [PipelineStage.EVIDENCE]: "Evidence",
};

// ---------------------------------------------------------------------------
// Node / Edge / Map
// ---------------------------------------------------------------------------

/**
 * One node in the pipeline map.
 *
 * Every node belongs to exactly one {@link PipelineStage} and carries a
 * semantic {@link Status} so the scene can colour / style it consistently
 * with the rest of the design system.
 */
export interface PipelineNode {
  /** Unique identifier for this node (scoped to the map). */
  id: string;
  /** The pipeline layer this node represents. */
  stage: PipelineStage;
  /** Human-readable short label. */
  label: string;
  /** Current operational status (drives colour in the scene). */
  status: Status;
  /** Optional detail or description shown on hover / click. */
  description?: string;
  /** Optional link to related evidence, PR, or deployment URL. */
  url?: string;
  /** Optional numeric count (test count, milestone count, etc.). */
  count?: number;
  /** ISO-8601 date string or any date-related metadata. */
  date?: string;
  /**
   * Arbitrary metadata for the Three.js scene to consume.
   * Keeps the contract extensible without new type releases.
   */
  metadata?: Record<string, unknown>;
}

/**
 * A directed edge between two {@link PipelineNode nodes}.
 *
 * Edges represent flow, dependency, or data movement in the engineering
 * system (e.g. "tests feed into CI/CD", "CI/CD produces deployments").
 */
export interface PipelineEdge {
  /** Source node id. */
  source: string;
  /** Target node id. */
  target: string;
  /** Optional label describing the relationship. */
  label?: string;
  /** Optional status that colours this edge in the scene. */
  status?: Status;
  /** Arbitrary metadata for the scene to consume. */
  metadata?: Record<string, unknown>;
}

/**
 * The complete pipeline map for one project -- or for the entire engineering
 * system when the input aggregates multiple projects.
 *
 * This is the single data structure the Three.js scene renders. The scene
 * never touches Prisma types directly.
 */
export interface PipelineMap {
  /** Nodes in this map (order is layout hint only). */
  nodes: PipelineNode[];
  /** Edges connecting nodes. */
  edges: PipelineEdge[];
  /** Aggregate status of the pipeline. */
  status: Status;
  /** Project name (displayed as a title / label in the scene). */
  projectName?: string;
  /** Project slug for linking back to the project page. */
  projectSlug?: string;
}

// ---------------------------------------------------------------------------
// Contract input -- the "source" side of the transformation
// ---------------------------------------------------------------------------

/**
 * Decoupled input shape consumed by {@link PipelineMapContract}.
 *
 * This is the ONLY dependency the contract has on project / evidence data.
 * It mirrors the relevant fields from the Prisma models without importing
 * them, so the contract (and the Three.js scene) never couple to Prisma.
 *
 * The database layer is responsible for selecting / projecting its models
 * into this shape before calling the contract.
 */
export interface PipelineMapInput {
  project: {
    title: string;
    slug: string;
    status: string;
    visibility: string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
  };
  milestones?: Array<{
    id: string;
    title: string;
    status: string;
    targetDate?: Date | string | null;
    completedAt?: Date | string | null;
  }>;
  architectureDecisions?: Array<{
    id: string;
    title: string;
    status: string;
    decidedAt?: Date | string | null;
  }>;
  pipelineEvidence?: Array<{
    id: string;
    label: string;
    category: string;
    url?: string | null;
    status: string;
  }>;
  buildLogEntries?: Array<{
    id: string;
    title: string;
    status: string;
    occurredAt?: Date | string | null;
  }>;
}
