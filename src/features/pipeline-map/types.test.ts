/**
 * Tests for the Pipeline Map data contract.
 *
 * Covers:
 * - Type-level conformance (example data satisfies types)
 * - Contract produces correct node/edge structure
 * - Edge cases (empty input, missing optional fields)
 */

import { describe, it, expect } from "vitest";

import type { PipelineMap, PipelineMapInput } from "./types";
import {
  PipelineStage,
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABELS,
} from "./types";
import { buildPipelineMap, mapStatus, defaultContract } from "./contract";
import { exampleInput, examplePipelineMap } from "./example-data";

// ---------------------------------------------------------------------------
// Type-level conformance (compile-time checks)
// ---------------------------------------------------------------------------

// Compile-time checks via const assignment. These will error if the types
// become incompatible.
const _examplePipelineMapType: PipelineMap = examplePipelineMap;
const _exampleInputType: PipelineMapInput = exampleInput;

describe("types", () => {
  // -----------------------------------------------------------------------
  // Constants
  // -----------------------------------------------------------------------

  it("defines all expected pipeline stages", () => {
    expect(PIPELINE_STAGES).toEqual([
      PipelineStage.PRODUCT,
      PipelineStage.ARCHITECTURE,
      PipelineStage.TESTS,
      PipelineStage.DOCKER,
      PipelineStage.CI_CD,
      PipelineStage.DEPLOYMENT,
      PipelineStage.MILESTONES,
      PipelineStage.EVIDENCE,
    ]);
  });

  it("provides a display label for every stage", () => {
    for (const stage of PIPELINE_STAGES) {
      expect(PIPELINE_STAGE_LABELS[stage]).toBeTypeOf("string");
      expect(PIPELINE_STAGE_LABELS[stage].length).toBeGreaterThan(0);
    }
  });

  // -----------------------------------------------------------------------
  // Example data type checks
  // -----------------------------------------------------------------------

  it("example pipeline map has the correct shape", () => {
    // Top-level fields
    expect(examplePipelineMap).toHaveProperty("nodes");
    expect(examplePipelineMap).toHaveProperty("edges");
    expect(examplePipelineMap).toHaveProperty("status");
    expect(examplePipelineMap).toHaveProperty("projectName");
    expect(examplePipelineMap).toHaveProperty("projectSlug");

    // Status must be a valid status value
    expect(["verified", "inProgress", "attention", "risk", "neutral"]).toContain(
      examplePipelineMap.status,
    );
  });

  it("example pipeline map contains all node types", () => {
    const stagesInNodes = new Set(
      examplePipelineMap.nodes.map((n) => n.stage),
    );
    for (const stage of PIPELINE_STAGES) {
      expect(stagesInNodes.has(stage)).toBe(true);
    }
  });

  it("every node has required fields", () => {
    for (const node of examplePipelineMap.nodes) {
      expect(node).toHaveProperty("id");
      expect(node).toHaveProperty("stage");
      expect(node).toHaveProperty("label");
      expect(node).toHaveProperty("status");
      expect(["verified", "inProgress", "attention", "risk", "neutral"]).toContain(
        node.status,
      );
    }
  });

  it("every edge references existing nodes", () => {
    const nodeIds = new Set(examplePipelineMap.nodes.map((n) => n.id));
    for (const edge of examplePipelineMap.edges) {
      expect(nodeIds.has(edge.source)).toBe(true);
      expect(nodeIds.has(edge.target)).toBe(true);
    }
  });

  // -----------------------------------------------------------------------
  // Example input shape checks
  // -----------------------------------------------------------------------

  it("example input includes project fields", () => {
    expect(exampleInput.project.title).toBe("Car Marketplace");
    expect(exampleInput.project.slug).toBe("car-marketplace");
    expect(exampleInput.project.status).toBe("published");
  });

  it("example input includes milestones", () => {
    expect(exampleInput.milestones).toBeDefined();
    expect(exampleInput.milestones!.length).toBeGreaterThan(0);
  });

  it("example input includes architecture decisions", () => {
    expect(exampleInput.architectureDecisions).toBeDefined();
    expect(exampleInput.architectureDecisions!.length).toBeGreaterThan(0);
  });

  it("example input includes pipeline evidence", () => {
    expect(exampleInput.pipelineEvidence).toBeDefined();
    expect(exampleInput.pipelineEvidence!.length).toBeGreaterThan(0);
  });

  it("example input includes build log entries", () => {
    expect(exampleInput.buildLogEntries).toBeDefined();
    expect(exampleInput.buildLogEntries!.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// mapStatus
// ---------------------------------------------------------------------------

describe("mapStatus", () => {
  it("maps published -> verified", () => {
    expect(mapStatus("published")).toBe("verified");
  });

  it("maps draft -> neutral", () => {
    expect(mapStatus("draft")).toBe("neutral");
  });

  it("maps archived -> neutral", () => {
    expect(mapStatus("archived")).toBe("neutral");
  });

  it("maps unknown status -> neutral", () => {
    expect(mapStatus("unknown")).toBe("neutral");
    expect(mapStatus("")).toBe("neutral");
  });
});

// ---------------------------------------------------------------------------
// buildPipelineMap
// ---------------------------------------------------------------------------

describe("buildPipelineMap", () => {
  it("builds a PipelineMap from example input", () => {
    const map = buildPipelineMap(exampleInput);

    expect(map).toHaveProperty("nodes");
    expect(map).toHaveProperty("edges");
    expect(map).toHaveProperty("status");
    expect(map.projectName).toBe("Car Marketplace");
    expect(map.projectSlug).toBe("car-marketplace");
  });

  it("creates a product node", () => {
    const map = buildPipelineMap(exampleInput);
    const productNodes = map.nodes.filter(
      (n) => n.stage === PipelineStage.PRODUCT,
    );
    expect(productNodes).toHaveLength(1);
    expect(productNodes[0].label).toBe("Car Marketplace");
  });

  it("creates architecture nodes for each ADR", () => {
    const map = buildPipelineMap(exampleInput);
    const archNodes = map.nodes.filter(
      (n) => n.stage === PipelineStage.ARCHITECTURE,
    );
    expect(archNodes).toHaveLength(exampleInput.architectureDecisions!.length);
    expect(archNodes[0].label).toBe("Monorepo with Turborepo");
  });

  it("creates milestone nodes", () => {
    const map = buildPipelineMap(exampleInput);
    const msNodes = map.nodes.filter(
      (n) => n.stage === PipelineStage.MILESTONES,
    );
    expect(msNodes).toHaveLength(exampleInput.milestones!.length);
  });

  it("creates evidence nodes", () => {
    const map = buildPipelineMap(exampleInput);
    const evNodes = map.nodes.filter(
      (n) => n.stage === PipelineStage.EVIDENCE,
    );
    expect(evNodes).toHaveLength(exampleInput.pipelineEvidence!.length);
  });

  it("creates tests node with build log count", () => {
    const map = buildPipelineMap(exampleInput);
    const testNodes = map.nodes.filter(
      (n) => n.stage === PipelineStage.TESTS,
    );
    expect(testNodes).toHaveLength(1);
    expect(testNodes[0].count).toBe(exampleInput.buildLogEntries!.length);
  });

  it("creates docker, ci/cd, and deployment nodes", () => {
    const map = buildPipelineMap(exampleInput);

    const dockerNodes = map.nodes.filter(
      (n) => n.stage === PipelineStage.DOCKER,
    );
    expect(dockerNodes).toHaveLength(1);

    const cicdNodes = map.nodes.filter(
      (n) => n.stage === PipelineStage.CI_CD,
    );
    expect(cicdNodes).toHaveLength(1);

    const deployNodes = map.nodes.filter(
      (n) => n.stage === PipelineStage.DEPLOYMENT,
    );
    expect(deployNodes).toHaveLength(1);
  });

  it("computes aggregate status correctly (neutral when draft items exist)", () => {
    const map = buildPipelineMap(exampleInput);

    // Example data has draft milestones + draft evidence, so the aggregate
    // should be "neutral" (not all nodes are verified but none are risk/attention).
    expect(map.status).toBe("neutral");
  });

  // -----------------------------------------------------------------------
  // Edge cases
  // -----------------------------------------------------------------------

  it("handles minimal input (project only)", () => {
    const minimal: PipelineMapInput = {
      project: {
        title: "Minimal Project",
        slug: "minimal",
        status: "draft",
        visibility: "adminOnly",
      },
    };

    const map = buildPipelineMap(minimal);

    // Should still create nodes for every stage
    const stagesPresent = new Set(map.nodes.map((n) => n.stage));
    for (const stage of PIPELINE_STAGES) {
      expect(stagesPresent.has(stage)).toBe(true);
    }

    // Should have no edges when there's only one of each stage
    // (product -> architecture, etc. edges still exist)
    expect(map.nodes.length).toBeGreaterThanOrEqual(PIPELINE_STAGES.length);
    expect(map.status).toBe("neutral");
  });

  it("handles empty arrays for optional fields", () => {
    const input: PipelineMapInput = {
      project: {
        title: "Empty Arrays",
        slug: "empty-arrays",
        status: "published",
        visibility: "public",
      },
      milestones: [],
      architectureDecisions: [],
      pipelineEvidence: [],
      buildLogEntries: [],
    };

    const map = buildPipelineMap(input);

    // Every stage should still be present (with default/fallback nodes)
    const stagesPresent = new Set(map.nodes.map((n) => n.stage));
    for (const stage of PIPELINE_STAGES) {
      expect(stagesPresent.has(stage)).toBe(true);
    }

    // Architecture should have a fallback node
    const archNodes = map.nodes.filter(
      (n) => n.stage === PipelineStage.ARCHITECTURE,
    );
    expect(archNodes).toHaveLength(1);
    expect(archNodes[0].description).toBe("Architecture decisions recorded");

    // Milestones should have a fallback node
    const msNodes = map.nodes.filter(
      (n) => n.stage === PipelineStage.MILESTONES,
    );
    expect(msNodes).toHaveLength(1);
    expect(msNodes[0].count).toBe(0);

    // Evidence should have a fallback node
    const evNodes = map.nodes.filter(
      (n) => n.stage === PipelineStage.EVIDENCE,
    );
    expect(evNodes).toHaveLength(1);
    expect(evNodes[0].count).toBe(0);

    // Tests should still have a node (build logs empty)
    const testNodes = map.nodes.filter(
      (n) => n.stage === PipelineStage.TESTS,
    );
    expect(testNodes).toHaveLength(1);
    expect(testNodes[0].count).toBe(0);
  });

  it("handles undefined optional fields", () => {
    const input: PipelineMapInput = {
      project: {
        title: "No Optional Fields",
        slug: "no-optional",
        status: "published",
        visibility: "public",
      },
    };

    const map = buildPipelineMap(input);

    expect(map.nodes.length).toBeGreaterThanOrEqual(PIPELINE_STAGES.length);
    expect(map.projectName).toBe("No Optional Fields");
  });

  it("handles null date fields", () => {
    const input: PipelineMapInput = {
      project: {
        title: "Null Dates",
        slug: "null-dates",
        status: "published",
        visibility: "public",
        startedAt: null,
        completedAt: null,
      },
    };

    const map = buildPipelineMap(input);

    const productNode = map.nodes.find(
      (n) => n.stage === PipelineStage.PRODUCT,
    );
    expect(productNode).toBeDefined();
    expect(productNode!.date).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// defaultContract interface
// ---------------------------------------------------------------------------

describe("defaultContract", () => {
  it("implements PipelineMapContract", () => {
    const map = defaultContract.build(exampleInput);
    expect(map).toHaveProperty("nodes");
    expect(map).toHaveProperty("edges");
    expect(map.nodes.length).toBeGreaterThan(0);
  });

  it("produces the same output as buildPipelineMap", () => {
    const fromContract = defaultContract.build(exampleInput);
    const fromFunction = buildPipelineMap(exampleInput);

    expect(fromContract.nodes).toEqual(fromFunction.nodes);
    expect(fromContract.edges).toEqual(fromFunction.edges);
    expect(fromContract.status).toEqual(fromFunction.status);
  });
});

// ---------------------------------------------------------------------------
// PipelineMap type: optional fields don't break the shape
// ---------------------------------------------------------------------------

describe("PipelineMap shape invariants", () => {
  it("accepts a map without optional top-level fields", () => {
    const map: PipelineMap = {
      nodes: [],
      edges: [],
      status: "neutral",
    };
    expect(map.projectName).toBeUndefined();
    expect(map.projectSlug).toBeUndefined();
  });

  it("accepts a node without optional fields", () => {
    const map: PipelineMap = {
      nodes: [
        {
          id: "test",
          stage: PipelineStage.TESTS,
          label: "Tests",
          status: "neutral",
        },
      ],
      edges: [],
      status: "neutral",
    };
    expect(map.nodes[0].description).toBeUndefined();
    expect(map.nodes[0].url).toBeUndefined();
    expect(map.nodes[0].count).toBeUndefined();
    expect(map.nodes[0].date).toBeUndefined();
    expect(map.nodes[0].metadata).toBeUndefined();
  });

  it("accepts an edge without optional fields", () => {
    const map: PipelineMap = {
      nodes: [
        { id: "a", stage: PipelineStage.PRODUCT, label: "A", status: "verified" },
        { id: "b", stage: PipelineStage.ARCHITECTURE, label: "B", status: "verified" },
      ],
      edges: [{ source: "a", target: "b" }],
      status: "verified",
    };
    expect(map.edges[0].label).toBeUndefined();
    expect(map.edges[0].status).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Edge generation
// ---------------------------------------------------------------------------

describe("edge generation", () => {
  it("connects stages in sequence for full input", () => {
    const map = buildPipelineMap(exampleInput);
    expect(map.edges.length).toBeGreaterThan(0);

    // Verify there's a product->architecture connection
    const hasProductArch = map.edges.some(
      (e) =>
        e.source.startsWith("product-") &&
        e.target.startsWith("architecture-"),
    );
    expect(hasProductArch).toBe(true);

    // Verify there's an architecture->tests connection
    const hasArchTests = map.edges.some(
      (e) =>
        e.source.startsWith("architecture-") && e.target.startsWith("tests-"),
    );
    expect(hasArchTests).toBe(true);
  });

  it("creates evidence edges from their categorised stage", () => {
    const map = buildPipelineMap(exampleInput);
    // Architecture evidence should have an edge from architecture nodes
    const archEvidenceEdges = map.edges.filter(
      (e) =>
        e.target === "evidence-ev-1" && e.source.startsWith("architecture-"),
    );
    expect(archEvidenceEdges.length).toBeGreaterThan(0);
  });
});
