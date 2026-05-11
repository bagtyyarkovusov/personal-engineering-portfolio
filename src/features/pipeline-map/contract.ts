/**
 * Pipeline Map Contract -- transforms project / evidence data into a
 * {@link PipelineMap} that the Three.js scene can render.
 *
 * # Usage
 *
 * ```ts
 * import { buildPipelineMap } from "@/features/pipeline-map/contract";
 * import type { PipelineMapInput } from "@/features/pipeline-map/types";
 *
 * const input: PipelineMapInput = { project: { title: "...", slug: "...", ... } };
 * const map = buildPipelineMap(input);
 * ```
 *
 * The scene only ever imports `PipelineMap`, `PipelineNode`, and
 * `PipelineEdge` -- never Prisma types.
 */

import type { Status } from "@/design/statuses";

import type {
  PipelineEdge,
  PipelineMap,
  PipelineMapInput,
  PipelineNode,
} from "./types";
import { PipelineStage, PIPELINE_STAGES } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Map a content-status string from the database to a design-system Status.
 *
 * @param dbStatus - One of "published" | "draft" | "archived".
 */
export function mapStatus(dbStatus: string): Status {
  switch (dbStatus) {
    case "published":
      return "verified";
    case "draft":
      return "neutral";
    case "archived":
      return "neutral";
    default:
      return "neutral";
  }
}

/**
 * Compute an aggregate status for the pipeline by looking at all node statuses.
 *
 * - If any node is "risk"     => "risk"
 * - If any node is "attention" => "attention"
 * - If all nodes are "verified" => "verified"
 * - Otherwise                  => "neutral"
 */
function aggregateStatus(nodes: PipelineNode[]): Status {
  if (nodes.length === 0) return "neutral";

  const hasRisk = nodes.some((n) => n.status === ("risk" as Status));
  if (hasRisk) return "risk";

  const hasAttention = nodes.some((n) => n.status === ("attention" as Status));
  if (hasAttention) return "attention";

  const allVerified = nodes.every((n) => n.status === ("verified" as Status));
  if (allVerified) return "verified";

  return "neutral";
}

// ---------------------------------------------------------------------------
// Node factories
// ---------------------------------------------------------------------------

function buildProductNode(input: PipelineMapInput): PipelineNode {
  const project = input.project;
  return {
    id: `product-${project.slug}`,
    stage: PipelineStage.PRODUCT,
    label: project.title,
    status: mapStatus(project.status),
    description: `Project: ${project.title}`,
    date: project.startedAt
      ? new Date(project.startedAt).toISOString()
      : undefined,
    metadata: {
      visibility: project.visibility,
      completedAt: project.completedAt
        ? new Date(project.completedAt).toISOString()
        : undefined,
    },
  };
}

function buildArchitectureNodes(input: PipelineMapInput): PipelineNode[] {
  const adrs = input.architectureDecisions ?? [];
  if (adrs.length === 0) {
    return [
      {
        id: `architecture-${input.project.slug}`,
        stage: PipelineStage.ARCHITECTURE,
        label: "Architecture",
        status: mapStatus(input.project.status),
        description: "Architecture decisions recorded",
        count: 0,
      },
    ];
  }
  return adrs.map((adr, i) => ({
    id: `architecture-${adr.id}`,
    stage: PipelineStage.ARCHITECTURE,
    label: adr.title,
    status: mapStatus(adr.status),
    description: `ADR: ${adr.title}`,
    date: adr.decidedAt
      ? new Date(adr.decidedAt).toISOString()
      : undefined,
    metadata: { index: i },
  }));
}

function buildTestsNode(input: PipelineMapInput): PipelineNode {
  const buildLogs = input.buildLogEntries ?? [];
  return {
    id: `tests-${input.project.slug}`,
    stage: PipelineStage.TESTS,
    label: "Tests",
    status: buildLogs.some((l) => mapStatus(l.status) === ("verified" as Status))
      ? "verified"
      : mapStatus(input.project.status),
    description: `${buildLogs.length} build log entries`,
    count: buildLogs.length,
  };
}

function buildDockerNode(input: PipelineMapInput): PipelineNode {
  return {
    id: `docker-${input.project.slug}`,
    stage: PipelineStage.DOCKER,
    label: "Docker",
    status: mapStatus(input.project.status),
    description: "Containerized environment",
  };
}

function buildCiCdNode(input: PipelineMapInput): PipelineNode {
  const evidence = input.pipelineEvidence ?? [];
  const ciCdEvidence = evidence.filter(
    (e) => e.category === "ci_cd" || e.category === "ci/cd",
  );
  return {
    id: `cicd-${input.project.slug}`,
    stage: PipelineStage.CI_CD,
    label: "CI/CD",
    status:
      ciCdEvidence.length > 0
        ? "verified"
        : mapStatus(input.project.status),
    description: `${ciCdEvidence.length} CI/CD evidence items`,
    count: ciCdEvidence.length,
  };
}

function buildDeploymentNode(input: PipelineMapInput): PipelineNode {
  const evidence = input.pipelineEvidence ?? [];
  const deployEvidence = evidence.filter(
    (e) => e.category === "deployment",
  );
  return {
    id: `deployment-${input.project.slug}`,
    stage: PipelineStage.DEPLOYMENT,
    label: "Deployment",
    status:
      deployEvidence.length > 0
        ? "verified"
        : mapStatus(input.project.status),
    description: `${deployEvidence.length} deployment evidence items`,
    count: deployEvidence.length,
  };
}

function buildMilestonesNodes(input: PipelineMapInput): PipelineNode[] {
  const milestones = input.milestones ?? [];
  if (milestones.length === 0) {
    return [
      {
        id: `milestones-${input.project.slug}`,
        stage: PipelineStage.MILESTONES,
        label: "Milestones",
        status: mapStatus(input.project.status),
        description: "No milestones recorded",
        count: 0,
      },
    ];
  }
  return milestones.map((m) => ({
    id: `milestone-${m.id}`,
    stage: PipelineStage.MILESTONES as PipelineStage,
    label: m.title,
    status: mapStatus(m.status),
    date: m.targetDate ? new Date(m.targetDate).toISOString() : undefined,
    description: m.completedAt
      ? `Completed: ${new Date(m.completedAt).toLocaleDateString()}`
      : "In progress",
    metadata: { milestoneId: m.id },
  }));
}

function buildEvidenceNodes(input: PipelineMapInput): PipelineNode[] {
  const evidence = input.pipelineEvidence ?? [];
  if (evidence.length === 0) {
    return [
      {
        id: `evidence-${input.project.slug}`,
        stage: PipelineStage.EVIDENCE,
        label: "Evidence",
        status: mapStatus(input.project.status),
        description: "No pipeline evidence recorded",
        count: 0,
      },
    ];
  }
  return evidence.map((e) => ({
    id: `evidence-${e.id}`,
    stage: PipelineStage.EVIDENCE,
    label: e.label,
    status: mapStatus(e.status),
    description: `Category: ${e.category}`,
    url: e.url ?? undefined,
    metadata: { category: e.category },
  }));
}

// ---------------------------------------------------------------------------
// Edge building
// ---------------------------------------------------------------------------

/**
 * The standard set of edges connecting pipeline stages in sequence.
 *
 *   Product -> Architecture -> Tests -> Docker -> CI/CD -> Deployment
 *
 * Milestones and Evidence are reachable from Product (they are not in the
 * linear flow).
 */
export const DEFAULT_STAGE_ORDER: PipelineStage[] = [
  PipelineStage.PRODUCT,
  PipelineStage.ARCHITECTURE,
  PipelineStage.TESTS,
  PipelineStage.DOCKER,
  PipelineStage.CI_CD,
  PipelineStage.DEPLOYMENT,
];

/**
 * Build sequential edges that connect every node in the `from` stage to
 * every node in the `to` stage.  When a stage has multiple nodes, each
 * source node connects to the first "representative" target node and
 * subsequent targets fan out from the last source node.
 *
 * This keeps the edge count manageable when milestones or evidence have
 * many items.
 */
function buildStageEdges(
  nodes: PipelineNode[],
  fromStage: PipelineStage,
  toStage: PipelineStage,
  defaultLabel?: string,
): PipelineEdge[] {
  const fromNodes = nodes.filter((n) => n.stage === fromStage);
  const toNodes = nodes.filter((n) => n.stage === toStage);
  if (fromNodes.length === 0 || toNodes.length === 0) return [];

  const edges: PipelineEdge[] = [];

  for (let fi = 0; fi < fromNodes.length; fi++) {
    // First from-node connects to all to-nodes (hub-and-spoke)
    if (fi === 0) {
      for (const to of toNodes) {
        edges.push({
          source: fromNodes[0].id,
          target: to.id,
          label: defaultLabel,
        });
      }
    } else {
      // Subsequent from-nodes connect only to the last to-node
      edges.push({
        source: fromNodes[fi].id,
        target: toNodes[toNodes.length - 1].id,
        label: defaultLabel,
      });
    }
  }

  return edges;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build a complete {@link PipelineMap} from project/source data.
 *
 * This is the primary entry point for the contract.  It creates nodes for
 * every pipeline stage (including child nodes for milestones and evidence),
 * wires up default edges, and computes an aggregate status.
 *
 * @param input - Decoupled project / evidence data (not Prisma models).
 * @returns A fully-populated PipelineMap ready for the Three.js scene.
 */
export function buildPipelineMap(input: PipelineMapInput): PipelineMap {
  const nodes: PipelineNode[] = [
    buildProductNode(input),
    ...buildArchitectureNodes(input),
    buildTestsNode(input),
    buildDockerNode(input),
    buildCiCdNode(input),
    buildDeploymentNode(input),
    ...buildMilestonesNodes(input),
    ...buildEvidenceNodes(input),
  ];

  const edges = buildAllEdges(nodes, input);

  return {
    nodes,
    edges,
    status: aggregateStatus(nodes),
    projectName: input.project.title,
    projectSlug: input.project.slug,
  };
}

/**
 * Compute all default edges for a set of nodes.
 *
 * Exported separately so consumers can customise the edge set while still
 * using the standard stage connection logic.
 */
export function buildAllEdges(
  nodes: PipelineNode[],
  input: PipelineMapInput,
): PipelineEdge[] {
  const edges: PipelineEdge[] = [];

  // Linear flow: Product -> Architecture -> Tests -> Docker -> CI/CD -> Deployment
  for (let i = 0; i < DEFAULT_STAGE_ORDER.length - 1; i++) {
    const from = DEFAULT_STAGE_ORDER[i];
    const to = DEFAULT_STAGE_ORDER[i + 1];
    edges.push(...buildStageEdges(nodes, from, to));
  }

  // Milestones and Evidence connect from Product
  edges.push(...buildStageEdges(nodes, PipelineStage.PRODUCT, PipelineStage.MILESTONES));
  edges.push(
    ...buildStageEdges(
      nodes,
      PipelineStage.PRODUCT,
      PipelineStage.EVIDENCE,
      "proves",
    ),
  );

  // Evidence also connects from the stage it belongs to
  const evidenceOf = categorizeEvidence(input);
  for (const [stage, evidenceIds] of evidenceOf) {
    const stageNodes = nodes.filter((n) => n.stage === stage);
    const evidenceNodes = nodes.filter((n) =>
      evidenceIds.includes(
        n.id.replace("evidence-", ""),
      ),
    );
    if (stageNodes.length > 0 && evidenceNodes.length > 0) {
      for (const sn of stageNodes) {
        for (const en of evidenceNodes) {
          edges.push({
            source: sn.id,
            target: en.id,
            label: "evidenced by",
          });
        }
      }
    }
  }

  return edges;
}

/**
 * Categorise pipeline evidence by which stage it belongs to.
 */
function categorizeEvidence(
  input: PipelineMapInput,
): Map<PipelineStage, string[]> {
  const map = new Map<PipelineStage, string[]>();
  for (const evidence of input.pipelineEvidence ?? []) {
    const stage = evidenceCategoryToStage(evidence.category);
    const ids = map.get(stage) ?? [];
    ids.push(evidence.id);
    map.set(stage, ids);
  }
  return map;
}

/**
 * Map an evidence category string to the pipeline stage it represents.
 */
function evidenceCategoryToStage(category: string): PipelineStage {
  switch (category.toLowerCase().replace(/[/\s]/g, "_")) {
    case "architecture":
      return PipelineStage.ARCHITECTURE;
    case "test":
    case "tests":
      return PipelineStage.TESTS;
    case "docker":
    case "container":
      return PipelineStage.DOCKER;
    case "ci_cd":
    case "ci/cd":
    case "ci":
    case "cd":
      return PipelineStage.CI_CD;
    case "deployment":
    case "deploy":
      return PipelineStage.DEPLOYMENT;
    case "milestone":
    case "milestones":
      return PipelineStage.MILESTONES;
    case "evidence":
    case "general":
    default:
      return PipelineStage.EVIDENCE;
  }
}

// ---------------------------------------------------------------------------
// Contract interface (for dependency injection / testability)
// ---------------------------------------------------------------------------

/**
 * Interface that defines the contract between the database layer and the
 * Three.js scene.
 *
 * Implementations transform project/evidence data (supplied as a
 * {@link PipelineMapInput}) into a {@link PipelineMap} that the scene
 * renders.  This keeps the scene decoupled from Prisma.
 *
 * The default implementation is {@link buildPipelineMap} as a standalone
 * function; use this interface when you want DI or a mock in tests.
 */
export interface PipelineMapContract {
  /** Build a {@link PipelineMap} from the given input. */
  build(input: PipelineMapInput): PipelineMap;
}

/**
 * Default contract implementation that delegates to {@link buildPipelineMap}.
 */
export const defaultContract: PipelineMapContract = {
  build: buildPipelineMap,
};
