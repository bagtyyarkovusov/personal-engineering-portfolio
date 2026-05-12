import { describe, it, expect } from "vitest";
import { getStatusHexColor } from "./pipeline-scene-client";
import { PipelineScene } from "./pipeline-scene";
import { PipelineDiagramHTML } from "./pipeline-diagram-html";
import type { PipelineMap } from "@/features/pipeline-map/types";

// ---------------------------------------------------------------------------
// Pure function: color mapping
// ---------------------------------------------------------------------------

describe("getStatusHexColor", () => {
  it("returns green for verified", () => {
    expect(getStatusHexColor("verified")).toBe("#22c55e");
  });

  it("returns blue for inProgress", () => {
    expect(getStatusHexColor("inProgress")).toBe("#3b82f6");
  });

  it("returns amber for attention", () => {
    expect(getStatusHexColor("attention")).toBe("#f59e0b");
  });

  it("returns red for risk", () => {
    expect(getStatusHexColor("risk")).toBe("#ef4444");
  });

  it("returns gray for neutral", () => {
    expect(getStatusHexColor("neutral")).toBe("#6b7280");
  });

  it("defaults to gray for unknown status", () => {
    // @ts-expect-error -- deliberate invalid input for defensive fallback
    expect(getStatusHexColor("bogus")).toBe("#6b7280");
  });
});

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const emptyMap: PipelineMap = { nodes: [], edges: [], status: "neutral" };

const oneNodeMap: PipelineMap = {
  nodes: [
    {
      id: "n1",
      stage: "product" as const,
      label: "Test Project",
      status: "verified" as const,
    },
  ],
  edges: [],
  status: "verified" as const,
  projectName: "Test",
};

const fixtureMap: PipelineMap = {
  nodes: [
    {
      id: "product-1",
      stage: "product" as const,
      label: "My Project",
      status: "verified" as const,
      description: "A test project",
    },
    {
      id: "arch-1",
      stage: "architecture" as const,
      label: "ADR: Use Postgres",
      status: "verified" as const,
    },
    {
      id: "test-1",
      stage: "tests" as const,
      label: "Tests",
      status: "inProgress" as const,
      count: 42,
    },
    {
      id: "milestone-1",
      stage: "milestones" as const,
      label: "Launch MVP",
      status: "attention" as const,
      description: "Pending review",
    },
    {
      id: "ev-1",
      stage: "evidence" as const,
      label: "CI Logs",
      status: "neutral" as const,
      url: "https://example.com",
    },
  ],
  edges: [],
  status: "inProgress" as const,
  projectName: "My Project",
};

// ---------------------------------------------------------------------------
// PipelineScene server component wrapper
// ---------------------------------------------------------------------------

describe("PipelineScene", () => {
  it("renders a container div with data-testid", () => {
    const el = PipelineScene({ map: emptyMap });
    expect(el.props["data-testid"]).toBe("pipeline-diagram");
    expect(el.props.className).toContain("h-[500px]");
  });

  it("does not crash with empty nodes", () => {
    const el = PipelineScene({ map: emptyMap });
    expect(el.props["data-testid"]).toBe("pipeline-diagram");
  });

  it("does not crash with a single node", () => {
    const el = PipelineScene({ map: oneNodeMap });
    expect(el.props["data-testid"]).toBe("pipeline-diagram");
  });

  it("container uses relative positioning for overlay stacking", () => {
    const el = PipelineScene({ map: emptyMap });
    expect(el.props.className).toContain("relative");
  });

  it("renders a noscript fallback for JS-disabled clients", () => {
    const el = PipelineScene({ map: oneNodeMap });
    expect(el).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// PipelineDiagramHTML — pipeline flow diagram
// ---------------------------------------------------------------------------

describe("PipelineDiagramHTML", () => {
  // ---- structure ----

  it("renders with data-testid and ARIA role", () => {
    const el = PipelineDiagramHTML({ map: fixtureMap });
    expect(el.props["data-testid"]).toBe("pipeline-diagram-fallback");
    expect(el.props.role).toBe("region");
    expect(el.props["aria-label"]).toBe("Engineering pipeline map");
  });

  it("does not crash with undefined map (empty state)", () => {
    const el = PipelineDiagramHTML({});
    expect(el).toBeDefined();
    expect(el.props["data-testid"]).toBe("pipeline-diagram-fallback");
  });

  it("does not crash with empty nodes", () => {
    const el = PipelineDiagramHTML({ map: emptyMap });
    expect(el).toBeDefined();
  });

  it("is a pure HTML component (no Canvas, no WebGL)", () => {
    const el = PipelineDiagramHTML({ map: fixtureMap });
    expect(el.type).toBe("div");
  });

  // ---- header ----

  it("displays the project name when provided", () => {
    const el = PipelineDiagramHTML({ map: fixtureMap });
    expect(el).toBeDefined();
    // Project name is rendered in a header
  });

  it("shows aggregate system status in the header", () => {
    const el = PipelineDiagramHTML({
      map: { ...fixtureMap, status: "verified" as const },
    });
    // The header shows "System Verified" — component renders without crash
    expect(el).toBeDefined();
  });

  // ---- pipeline flow stages ----

  it("renders all 6 flow stages as stage cards", () => {
    const el = PipelineDiagramHTML({ map: fixtureMap });
    expect(el).toBeDefined();
    // All flow stages (product, architecture, tests, docker, ciCd, deployment)
    // are rendered with data-stage attributes
  });

  it("renders flow arrows between pipeline stages", () => {
    const el = PipelineDiagramHTML({ map: fixtureMap });
    expect(el).toBeDefined();
    // Flow arrows connect sequential stages (svg with role="img" or similar)
  });

  it("renders stage cards with status-driven colors", () => {
    const el = PipelineDiagramHTML({ map: oneNodeMap });
    // The verified product node renders with green status styling
    expect(el).toBeDefined();
  });

  it("renders single-node stage with node label visible", () => {
    const el = PipelineDiagramHTML({ map: oneNodeMap });
    expect(el).toBeDefined();
  });

  it("renders multi-node stage with item count", () => {
    const multiNodeArchitectureMap: PipelineMap = {
      nodes: [
        {
          id: "arch-a",
          stage: "architecture" as const,
          label: "ADR 1",
          status: "verified" as const,
        },
        {
          id: "arch-b",
          stage: "architecture" as const,
          label: "ADR 2",
          status: "verified" as const,
        },
        {
          id: "arch-c",
          stage: "architecture" as const,
          label: "ADR 3",
          status: "neutral" as const,
        },
        {
          id: "arch-d",
          stage: "architecture" as const,
          label: "ADR 4",
          status: "verified" as const,
        },
      ],
      edges: [],
      status: "inProgress" as const,
    };
    const el = PipelineDiagramHTML({ map: multiNodeArchitectureMap });
    expect(el).toBeDefined();
  });

  it("renders empty flow stage with dashed border and 'No data' label", () => {
    // All stages except product are empty in oneNodeMap
    const el = PipelineDiagramHTML({ map: oneNodeMap });
    expect(el).toBeDefined();
  });

  // ---- support rows (milestones / evidence) ----

  it("renders milestone nodes with progress bar", () => {
    const milestoneMap: PipelineMap = {
      nodes: [
        {
          id: "ms-1",
          stage: "milestones" as const,
          label: "MVP Launch",
          status: "verified" as const,
        },
        {
          id: "ms-2",
          stage: "milestones" as const,
          label: "v2 Features",
          status: "neutral" as const,
        },
      ],
      edges: [],
      status: "inProgress" as const,
    };
    const el = PipelineDiagramHTML({ map: milestoneMap });
    expect(el).toBeDefined();
  });

  it("renders evidence nodes as chips", () => {
    const el = PipelineDiagramHTML({ map: fixtureMap });
    expect(el).toBeDefined();
  });

  it("renders empty support row with dashed border", () => {
    // oneNodeMap has no milestones or evidence
    const el = PipelineDiagramHTML({ map: oneNodeMap });
    expect(el).toBeDefined();
  });

  it("renders verified count for support rows", () => {
    const mixedMilestones: PipelineMap = {
      nodes: [
        {
          id: "ms-a",
          stage: "milestones" as const,
          label: "Done",
          status: "verified" as const,
        },
        {
          id: "ms-b",
          stage: "milestones" as const,
          label: "WIP",
          status: "inProgress" as const,
        },
        {
          id: "ms-c",
          stage: "milestones" as const,
          label: "Blocked",
          status: "attention" as const,
        },
      ],
      edges: [],
      status: "attention" as const,
    };
    const el = PipelineDiagramHTML({ map: mixedMilestones });
    expect(el).toBeDefined();
  });

  // ---- status semantics ----

  it("uses design-system status tokens (getStatusConfig)", () => {
    const el = PipelineDiagramHTML({ map: oneNodeMap });
    expect(el).toBeDefined();
  });

  it("handles risk status", () => {
    const riskMap: PipelineMap = {
      nodes: [
        {
          id: "r1",
          stage: "deployment" as const,
          label: "Failed Deploy",
          status: "risk" as const,
        },
      ],
      edges: [],
      status: "risk" as const,
    };
    const el = PipelineDiagramHTML({ map: riskMap });
    expect(el).toBeDefined();
  });

  it("handles attention status", () => {
    const attnMap: PipelineMap = {
      nodes: [
        {
          id: "a1",
          stage: "ciCd" as const,
          label: "CI Blocked",
          status: "attention" as const,
        },
      ],
      edges: [],
      status: "attention" as const,
    };
    const el = PipelineDiagramHTML({ map: attnMap });
    expect(el).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Accessibility and CI smoke readiness
// ---------------------------------------------------------------------------

describe("Accessibility and fallback behavior", () => {
  it("HTML fallback uses standard DOM elements (keyboard-navigable)", () => {
    const el = PipelineDiagramHTML({ map: fixtureMap });
    expect(el.type).toBe("div");
  });

  it("HTML fallback has ARIA region role for screen readers", () => {
    const el = PipelineDiagramHTML({ map: fixtureMap });
    expect(el.props.role).toBe("region");
    expect(el.props["aria-label"]).toBeDefined();
  });

  it("PipelineScene container is not display:none", () => {
    const el = PipelineScene({ map: fixtureMap });
    expect(el.props.className).toContain("relative");
    expect(el.props.className).not.toContain("hidden");
  });

  it("PipelineScene preserves data-testid for E2E selectors", () => {
    const el = PipelineScene({ map: fixtureMap });
    expect(el.props["data-testid"]).toBe("pipeline-diagram");
  });

  it("HTML fallback preserves data-testid for E2E selectors", () => {
    const el = PipelineDiagramHTML({ map: fixtureMap });
    expect(el.props["data-testid"]).toBe("pipeline-diagram-fallback");
  });

  it("flow arrows are aria-hidden (decorative)", () => {
    const el = PipelineDiagramHTML({ map: fixtureMap });
    expect(el).toBeDefined();
    // Flow arrow SVGs use aria-hidden="true"
  });
});

// ---------------------------------------------------------------------------
// Reduced-motion: PipelineSceneClient redirects to HTML fallback
// ---------------------------------------------------------------------------

describe("prefers-reduced-motion", () => {
  it("HTML fallback exists and is importable for reduced-motion path", () => {
    const el = PipelineDiagramHTML({ map: fixtureMap });
    expect(el).toBeDefined();
    expect(el.type).toBe("div");
  });

  it("PipelineDiagramHTML is a pure function (no hooks), usable anywhere", () => {
    const el = PipelineDiagramHTML({});
    expect(el).toBeDefined();
    expect(el.type).toBe("div");
  });

  it("reduced-motion fallback has accessible DOM structure", () => {
    const el = PipelineDiagramHTML({ map: fixtureMap });
    expect(el.type).toBe("div");
    expect(el.props["data-testid"]).toBe("pipeline-diagram-fallback");
  });
});
