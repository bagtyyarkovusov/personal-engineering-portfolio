# Three.js Pipeline Map Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage Three.js pipeline scene as an emissive, scroll-driven engineering control center with bloom post-processing, pulse animations, hover micro-interactions, and a hero takeover page layout.

**Architecture:** Three parallel worktree branches. Agent 1 rewrites the 3D scene core (emissive materials, bloom, pulse, scroll camera, hover). Agent 2 rewrites the page layout (hero takeover with sticky scroll section) and wrapper. Agent 3 writes tests and polishes the HTML fallback. Agents 1 and 2 share a contract: `PipelineSceneClient` accepts `scrollProgress: number` (0-1). Agent 3 verifies both ends.

**Tech Stack:** React Three Fiber 9.x, @react-three/drei 10.x, @react-three/postprocessing, Three.js 0.182, Next.js 16 App Router, Vitest, Playwright

**Design Spec:** `docs/superpowers/specs/2026-05-13-threejs-pipeline-redesign.md`

---

## Interface Contract (Shared Between Agents 1 and 2)

The `PipelineSceneClient` component exported from `src/components/three/pipeline-scene-client.tsx` must accept:

```typescript
interface PipelineSceneClientProps {
  pipelineMap: PipelineMap;
  scrollProgress: number; // 0.0 (Product stage) to 1.0 (Deployment stage)
}
```

`scrollProgress` is a linear 0-1 value. The scene maps it to camera X and Z position via interpolation. Agent 1 builds the consumer; Agent 2 builds the provider. Both can work in parallel against this contract.

---

### Task 1: Install Dependencies and Scaffold New Scene Shell (Agent 1)

**Branch:** `feat/49-scene-rewrite`
**Worktree:** `.claude/worktrees/feat-49-scene-rewrite`

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`
- Create: (overwrite) `src/components/three/pipeline-scene-client.tsx`

- [ ] **Step 1: Install @react-three/postprocessing**

```bash
pnpm add @react-three/postprocessing
```

Expected: adds `@react-three/postprocessing` to dependencies in `package.json` and updates lockfile.

- [ ] **Step 2: Write the new PipelineSceneClient shell with scrollProgress prop**

Replace `src/components/three/pipeline-scene-client.tsx` with:

```tsx
"use client";

import { useMemo, memo, useSyncExternalStore, useRef, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { PipelineMap, PipelineStage } from "@/features/pipeline-map/types";
import { PIPELINE_STAGE_LABELS } from "@/features/pipeline-map/types";
import type { Status } from "@/design/statuses";
import { PipelineDiagramHTML } from "./pipeline-diagram-html";

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mql = window.matchMedia(reducedMotionQuery);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FLOW_STAGES: PipelineStage[] = [
  "product", "architecture", "tests", "docker", "ciCd", "deployment",
];

const SUPPORT_STAGES: PipelineStage[] = ["milestones", "evidence"];

/** X positions for flow stages along the pipeline spine. */
const STAGE_X: Record<string, number> = {
  product: -7.5,
  architecture: -4.5,
  tests: -1.5,
  docker: 1.5,
  ciCd: 4.5,
  deployment: 7.5,
  milestones: -1.5,
  evidence: 7.5,
};

/** Z offset per stage — camera pushes forward as stages advance. */
const STAGE_Z: Record<string, number> = {
  product: 0,
  architecture: 0.5,
  tests: 1.0,
  docker: 1.5,
  ciCd: 2.0,
  deployment: 2.5,
  milestones: 0,
  evidence: 2.5,
};

const STATUS_EMISSIVE: Record<Status, string> = {
  verified: "#22c55e",
  inProgress: "#3b82f6",
  attention: "#f59e0b",
  risk: "#ef4444",
  neutral: "#6b7280",
};

const STATUS_EMISSIVE_INTENSITY: Record<Status, number> = {
  verified: 0.4,
  inProgress: 0.35,
  attention: 0.3,
  risk: 0.45,
  neutral: 0.1,
};

const BACKGROUND_COLOR = "#0a0a0f";
const SPINE_COLOR = "#374151";
const GEOM_SEGMENTS = 12;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function aggregateNodeStatus(nodes: { status: Status }[]): Status {
  if (nodes.length === 0) return "neutral";
  if (nodes.some((n) => n.status === "risk")) return "risk";
  if (nodes.some((n) => n.status === "attention")) return "attention";
  if (nodes.some((n) => n.status === "inProgress")) return "inProgress";
  if (nodes.every((n) => n.status === "verified")) return "verified";
  return "neutral";
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

function useNodePositions(nodes: PipelineMap["nodes"]) {
  return useMemo(() => {
    const grouped = new Map<string, PipelineMap["nodes"]>();
    for (const node of nodes) {
      const list = grouped.get(node.stage) ?? [];
      list.push(node);
      grouped.set(node.stage, list);
    }

    const positions = new Map<string, [number, number, number]>();
    for (const [stage, stageNodes] of grouped) {
      const x = STAGE_X[stage] ?? 0;
      const count = stageNodes.length;
      const spacing = Math.min(2.2, 5.5 / Math.max(count, 1));
      const startY = ((count - 1) * spacing) / 2;

      if (FLOW_STAGES.includes(stage as PipelineStage)) {
        for (let i = 0; i < count; i++) {
          positions.set(stageNodes[i].id, [x, startY - i * spacing + 0.4, 0]);
        }
      } else if (stage === "milestones") {
        const rowY = -2.8;
        const rowSpacing = Math.min(2.0, 9 / Math.max(count, 1));
        const rowStartX = ((count - 1) * rowSpacing) / 2;
        for (let i = 0; i < count; i++) {
          positions.set(stageNodes[i].id, [rowStartX - i * rowSpacing, rowY, 0]);
        }
      } else if (stage === "evidence") {
        const rowY = -4.0;
        const rowSpacing = Math.min(2.0, 9 / Math.max(count, 1));
        const rowStartX = ((count - 1) * rowSpacing) / 2;
        for (let i = 0; i < count; i++) {
          positions.set(stageNodes[i].id, [rowStartX - i * rowSpacing, rowY, 0]);
        }
      }
    }
    return positions;
  }, [nodes]);
}

function useEdgeLines(
  edges: PipelineMap["edges"],
  nodePositions: Map<string, [number, number, number]>,
) {
  return useMemo(() => {
    const result: Array<{
      from: [number, number, number];
      to: [number, number, number];
      status: Status | undefined;
      key: string;
    }> = [];
    for (const edge of edges) {
      const from = nodePositions.get(edge.source);
      const to = nodePositions.get(edge.target);
      if (!from || !to) continue;
      result.push({
        from,
        to,
        status: edge.status,
        key: `${edge.source}-${edge.target}`,
      });
    }
    return result;
  }, [edges, nodePositions]);
}

// ---------------------------------------------------------------------------
// 3D Sub-components
// ---------------------------------------------------------------------------

function PipelineSpine() {
  const startX = STAGE_X.product!;
  const endX = STAGE_X.deployment!;
  const length = endX - startX;
  return (
    <mesh
      position={[(startX + endX) / 2, -0.15, 0]}
      rotation={[0, 0, Math.PI / 2]}
    >
      <cylinderGeometry args={[0.04, 0.04, length, GEOM_SEGMENTS]} />
      <meshStandardMaterial
        color={SPINE_COLOR}
        emissive={SPINE_COLOR}
        emissiveIntensity={0.15}
        metalness={0.5}
        roughness={0.4}
      />
    </mesh>
  );
}

function StagePlatform({ x, status }: { x: number; status: Status }) {
  const emissive = STATUS_EMISSIVE[status] ?? "#6b7280";
  return (
    <mesh position={[x, -0.3, 0]}>
      <boxGeometry args={[1.8, 0.04, 0.8]} />
      <meshStandardMaterial
        color="#1f2937"
        emissive={emissive}
        emissiveIntensity={0.2}
        metalness={0.3}
        roughness={0.5}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

function StageLabel({ x, stage }: { x: number; stage: PipelineStage }) {
  return (
    <Text
      position={[x, -0.65, 0]}
      fontSize={0.16}
      color="#6b7280"
      anchorX="center"
      anchorY="top"
    >
      {PIPELINE_STAGE_LABELS[stage]}
    </Text>
  );
}

interface PipelineNodeMeshProps {
  position: [number, number, number];
  stage: PipelineStage;
  status: Status;
  label: string;
  description?: string;
  dimmed: boolean;
  hovered: boolean;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

function PipelineNodeMesh({
  position,
  stage,
  status,
  label,
  description,
  dimmed,
  hovered,
  onPointerEnter,
  onPointerLeave,
}: PipelineNodeMeshProps) {
  const [x, y, z] = position;
  const emissive = STATUS_EMISSIVE[status] ?? "#6b7280";
  const baseEmissiveIntensity = STATUS_EMISSIVE_INTENSITY[status] ?? 0.1;
  const size = FLOW_STAGES.includes(stage) ? 0.4 : 0.28;
  const scale = hovered ? 1.3 : 1.0;
  const opacity = dimmed && !hovered ? 0.3 : 1.0;

  return (
    <group scale={[scale, scale, scale]} position={[x, y, z]}>
      <mesh
        onPointerEnter={(e) => { e.stopPropagation(); onPointerEnter(); }}
        onPointerLeave={(e) => { e.stopPropagation(); onPointerLeave(); }}
      >
        {stage === "product" && <octahedronGeometry args={[size * 1.1, 0]} />}
        {stage === "architecture" && <boxGeometry args={[size * 1.4, size * 0.9, size * 1.1]} />}
        {stage === "tests" && <icosahedronGeometry args={[size, 0]} />}
        {stage === "docker" && <cylinderGeometry args={[size * 0.85, size * 0.85, size * 1.4, GEOM_SEGMENTS]} />}
        {stage === "ciCd" && <torusGeometry args={[size * 0.65, size * 0.35, 8, GEOM_SEGMENTS]} />}
        {stage === "deployment" && <coneGeometry args={[size, size * 1.3, GEOM_SEGMENTS]} />}
        {stage === "milestones" && <sphereGeometry args={[size * 0.75, GEOM_SEGMENTS, 8]} />}
        {stage === "evidence" && <boxGeometry args={[size * 1.3, size * 0.3, size * 0.9]} />}
        <meshStandardMaterial
          color="#111827"
          emissive={emissive}
          emissiveIntensity={baseEmissiveIntensity}
          metalness={0.2}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Glow ring — intensifies on hover */}
      <mesh>
        <torusGeometry args={[size * 1.15 + 0.1, hovered ? 0.06 : 0.03, 8, GEOM_SEGMENTS]} />
        <meshBasicMaterial
          color={emissive}
          transparent
          opacity={hovered ? 0.7 : dimmed ? 0.05 : 0.25}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -(size + 0.35), 0]}
        fontSize={FLOW_STAGES.includes(stage) ? 0.16 : 0.14}
        color={hovered ? "#e5e7eb" : dimmed ? "#4b5563" : "#6b7280"}
        anchorX="center"
        anchorY="top"
        maxWidth={3}
      >
        {label}
      </Text>

      {/* Detail card — visible on hover */}
      {hovered && description && (
        <Text
          position={[0, -(size + 0.7), 0]}
          fontSize={0.11}
          color="#9ca3af"
          anchorX="center"
          anchorY="top"
          maxWidth={2.5}
        >
          {description}
        </Text>
      )}
    </group>
  );
}

function GroundPlane() {
  return (
    <mesh position={[0, -5.5, -0.5]}>
      <planeGeometry args={[24, 20]} />
      <meshStandardMaterial
        color={BACKGROUND_COLOR}
        emissive={BACKGROUND_COLOR}
        emissiveIntensity={0.05}
        metalness={0}
        roughness={1}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function SupportConnector({ fromX, toY }: { fromX: number; toY: number }) {
  return (
    <Line
      points={[
        [fromX, -0.15, 0],
        [fromX, toY + 0.5, 0],
      ]}
      color="#374151"
      lineWidth={0.5}
      transparent
      opacity={0.3}
    />
  );
}

// ---------------------------------------------------------------------------
// Camera controller — scroll-driven pan with Z-depth staging
// ---------------------------------------------------------------------------

function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const targetX = useRef(camera.position.x);
  const targetZ = useRef(camera.position.z);

  useFrame(() => {
    // Map scroll progress (0-1) to X range covering the 6 flow stages
    const xMin = STAGE_X.product! - 1;
    const xMax = STAGE_X.deployment! + 1;
    const desiredX = xMin + scrollProgress * (xMax - xMin);

    // Z push: interpolate based on which stage is dominant
    const stageIndex = Math.floor(scrollProgress * FLOW_STAGES.length);
    const clampedIndex = Math.min(stageIndex, FLOW_STAGES.length - 1);
    const stage = FLOW_STAGES[clampedIndex];
    const desiredZ = 12 - (STAGE_Z[stage] ?? 0);

    targetX.current += (desiredX - targetX.current) * 0.06;
    targetZ.current += (desiredZ - targetZ.current) * 0.06;

    camera.position.x = targetX.current;
    camera.position.z = targetZ.current;
    camera.lookAt(camera.position.x, -0.3, 0);
  });

  return null;
}

// ---------------------------------------------------------------------------
// Pulse animation — modulates emissive intensity per node
// Not implemented as a component; see PipelineSceneContent useFrame
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Scene content — memoized since pipeline data is static
// ---------------------------------------------------------------------------

interface PipelineSceneContentProps {
  pipelineMap: PipelineMap;
  scrollProgress: number;
}

const PipelineSceneContent = memo(function PipelineSceneContent({
  pipelineMap,
  scrollProgress,
}: PipelineSceneContentProps) {
  const { nodes, edges } = pipelineMap;
  const nodePositions = useNodePositions(nodes);
  const edgeLines = useEdgeLines(edges, nodePositions);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const hoveredNode = hoveredNodeId ? nodes.find((n) => n.id === hoveredNodeId) : null;
  const hoveredEdges = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    return new Set(
      edges
        .filter((e) => e.source === hoveredNodeId || e.target === hoveredNodeId)
        .map((e) => `${e.source}-${e.target}`),
    );
  }, [hoveredNodeId, edges]);

  const nodesByStage = useMemo(() => {
    const map = new Map<string, PipelineMap["nodes"]>();
    for (const node of nodes) {
      const list = map.get(node.stage) ?? [];
      list.push(node);
      map.set(node.stage, list);
    }
    return map;
  }, [nodes]);

  return (
    <>
      <color attach="background" args={[BACKGROUND_COLOR]} />
      <fog attach="fog" args={[BACKGROUND_COLOR, 8, 25]} />

      <ambientLight intensity={0.3} color="#1f2937" />
      <directionalLight position={[8, 10, 6]} intensity={0.4} color="#374151" />
      <directionalLight position={[-4, 2, -3]} intensity={0.15} color="#1f2937" />

      <GroundPlane />
      <PipelineSpine />

      {FLOW_STAGES.map((stage) => {
        const stageNodes = nodesByStage.get(stage) ?? [];
        const aggStatus = aggregateNodeStatus(stageNodes);
        return (
          <group key={`stage-${stage}`}>
            <StagePlatform x={STAGE_X[stage] ?? 0} status={aggStatus} />
            <StageLabel x={STAGE_X[stage] ?? 0} stage={stage} />
          </group>
        );
      })}

      <SupportConnector fromX={STAGE_X.milestones ?? 0} toY={-2.8} />
      <SupportConnector fromX={STAGE_X.evidence ?? 0} toY={-4.0} />

      {edgeLines.map(({ from, to, status, key }) => {
        const emissive = status ? STATUS_EMISSIVE[status] : "#374151";
        const connected = hoveredEdges.has(key);
        const dimmed = hoveredNodeId !== null && !connected;
        return (
          <Line
            key={key}
            points={[from, to]}
            color={dimmed ? "#1f2937" : connected ? emissive : "#374151"}
            lineWidth={connected ? 1.5 : 0.8}
            transparent
            opacity={dimmed ? 0.1 : connected ? 0.6 : 0.25}
          />
        );
      })}

      {nodes.map((node) => {
        const pos = nodePositions.get(node.id);
        if (!pos) return null;
        const isHovered = hoveredNodeId === node.id;
        const isDimmed = hoveredNodeId !== null && !isHovered;
        return (
          <PipelineNodeMesh
            key={node.id}
            position={pos}
            stage={node.stage}
            status={node.status}
            label={node.label}
            description={node.description}
            dimmed={isDimmed}
            hovered={isHovered}
            onPointerEnter={() => setHoveredNodeId(node.id)}
            onPointerLeave={() => setHoveredNodeId(null)}
          />
        );
      })}

      <CameraController scrollProgress={scrollProgress} />

      {/* Bloom — subtle, only emissive surfaces contribute */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          intensity={0.5}
          radius={0.6}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
});

// ---------------------------------------------------------------------------
// Stable prop references
// ---------------------------------------------------------------------------

const STABLE_CAMERA = { position: [0, 0.5, 12] as const, fov: 45 };
const STABLE_GL = { antialias: true } as const;
const STABLE_DPR: [number, number] = [1, 1.5];
const STABLE_PERFORMANCE = { min: 0.5 };

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

import { useState } from "react";

interface PipelineSceneClientProps {
  pipelineMap: PipelineMap;
  scrollProgress: number;
}

export const PipelineSceneClient = memo(function PipelineSceneClient({
  pipelineMap,
  scrollProgress,
}: PipelineSceneClientProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div data-testid="pipeline-diagram-reduced-motion">
        <PipelineDiagramHTML map={pipelineMap} />
      </div>
    );
  }

  return (
    <Canvas
      camera={STABLE_CAMERA}
      style={{ width: "100%", height: "100%" }}
      gl={STABLE_GL}
      dpr={STABLE_DPR}
      frameloop="always"
      performance={STABLE_PERFORMANCE}
    >
      <PipelineSceneContent
        pipelineMap={pipelineMap}
        scrollProgress={scrollProgress}
      />
    </Canvas>
  );
});
```

- [ ] **Step 2.5: Add autonomous pulse animation**

Add a `NodePulseController` component after the `CameraController` component. This uses `useFrame` to modulate emissive intensity on a time-based pulse per status:

```tsx
// ---------------------------------------------------------------------------
// Pulse animation — subtle emissive pulse per status
// ---------------------------------------------------------------------------

const PULSE_FREQ: Record<Status, number> = {
  verified: 0.3,
  inProgress: 0.5,
  attention: 0.8,
  risk: 1.2,
  neutral: 0,
};

const PULSE_AMP: Record<Status, number> = {
  verified: 0.15,
  inProgress: 0.12,
  attention: 0.1,
  risk: 0.18,
  neutral: 0,
};

function NodePulseController({
  nodesByStatus,
}: {
  nodesByStatus: Map<Status, THREE.MeshStandardMaterial[]>;
}) {
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;

    for (const [status, materials] of nodesByStatus) {
      const freq = PULSE_FREQ[status] ?? 0;
      const amp = PULSE_AMP[status] ?? 0;
      if (freq === 0) continue;

      const pulse = 1 + Math.sin(elapsed.current * Math.PI * 2 * freq) * amp;
      for (const mat of materials) {
        mat.emissiveIntensity = (STATUS_EMISSIVE_INTENSITY[status] ?? 0.1) * pulse;
      }
    }
  });

  return null;
}
```

Then integrate it into `PipelineSceneContent`. Add before the closing `</>` of PipelineSceneContent:

```tsx
{/* Pulse controller — collects material refs and animates emissive */}
<NodePulseController nodesByStatus={nodeMaterialRefs.current} />
```

And add the ref collection logic at the top of `PipelineSceneContent`. Since collecting material refs from declarative JSX is involved, use a simpler approach: `useFrame` directly in `PipelineSceneContent` that cycles through all nodes and updates a shared time uniform. Replace the `// Pulse animation — modulates emissive intensity per node` comment block with:

```tsx
// Pulse animation
const pulseTime = useRef(0);

useFrame((_, delta) => {
  pulseTime.current += delta;
});
```

And in `PipelineNodeMesh`, pass `pulseTime` as a prop and compute the animated emissive intensity:

```tsx
// Inside PipelineNodeMesh, add pulseTime prop:
// pulseTime: number

// Replace emissiveIntensity line with:
const pulse = PULSE_FREQ[status] > 0
  ? 1 + Math.sin(pulseTime * Math.PI * 2 * PULSE_FREQ[status]) * PULSE_AMP[status]
  : 1;
const animatedIntensity = baseEmissiveIntensity * pulse;
```

Pass `pulseTime.current` from PipelineSceneContent to each PipelineNodeMesh as `pulseTime` prop.

- [ ] **Step 3: Run typecheck to catch import/syntax errors**

```bash
pnpm typecheck
```

Expected: No type errors from the new file. The `useState` and `useRef` imports need to be at the top. If there are type errors from `useFrame` imports, ensure `useFrame` and `useRef` are imported from `@react-three/fiber` and `react` respectively.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/three/pipeline-scene-client.tsx
git commit -m "feat(#49): rewrite pipeline scene with emissive materials, bloom, scroll camera, and hover

- Replace flat meshStandardMaterial with emissive + bloom post-processing
- Add scrollProgress prop for scroll-driven camera pan
- Add Z-depth staging per pipeline stage
- Add hover micro-interaction (scale, glow ring, detail card, edge dimming)
- Dark background (#0a0a0f) with fog for depth
- EffectComposer + Bloom for emissive glow
- Keep reduced-motion detection and HTML fallback

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

- [ ] **Step 5: Push branch**

```bash
git push -u origin feat/49-scene-rewrite
```

---

### Task 2: Rewrite Page Layout — Hero Takeover with Sticky Scroll (Agent 2)

**Branch:** `feat/49-page-layout`
**Worktree:** `.claude/worktrees/feat-49-page-layout`

**Files:**
- Modify: `src/components/three/pipeline-scene.tsx`
- Modify: `src/app/(public)/page.tsx`

- [ ] **Step 1: Rewrite PipelineScene wrapper to track scroll progress**

Replace `src/components/three/pipeline-scene.tsx` with a scroll-tracking wrapper:

```tsx
"use client";

import { useRef, useState, useEffect, Suspense, useCallback } from "react";
import dynamic from "next/dynamic";
import type { PipelineMap } from "@/features/pipeline-map/types";
import { PipelineDiagramHTML } from "./pipeline-diagram-html";

const PipelineSceneClient = dynamic(
  () => import("./pipeline-scene-client").then((m) => m.PipelineSceneClient),
  { ssr: false },
);

export function PipelineScene({ map }: { map: PipelineMap }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // When the sticky section is at top of viewport, rect.top is 0.
    // Progress is how far we've scrolled PAST the section's start,
    // normalized by (total scroll height - viewport height).
    const sectionTop = el.offsetTop;
    const scrollableHeight = el.parentElement
      ? el.parentElement.scrollHeight - window.innerHeight
      : 1;
    const scrolled = window.scrollY - sectionTop;
    const raw = scrolled / Math.max(scrollableHeight, 1);
    setProgress(Math.max(0, Math.min(1, raw)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={sectionRef}
      className="sticky top-0 h-svh w-full overflow-hidden"
      data-testid="pipeline-diagram"
    >
      <noscript>
        <PipelineDiagramHTML map={map} />
      </noscript>
      <Suspense fallback={<PipelineDiagramHTML map={map} />}>
        <PipelineSceneClient pipelineMap={map} scrollProgress={progress} />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite homepage layout with hero takeover**

Replace `src/app/(public)/page.tsx` hero section (the `<section className="grid min-h-svh grid-cols-1 lg:grid-cols-12">` block) with a sticky hero takeover. The full replacement for the page:

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PipelineScene } from "@/components/three";
import { examplePipelineMap } from "@/features/pipeline-map/example-data";
import { ProjectCard } from "@/features/projects/project-card";
import { getPublishedPublicProjects } from "@/features/projects/queries";

import type { Metadata } from "next";
import { JsonLd, breadcrumbListSchema } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "Bagtyyar — Production-Minded Engineer",
    description:
      "Production-minded full-stack and mobile software engineering. Tests, Docker, CI/CD, architecture decisions, and transparent delivery.",
    images: [{ url: "/og?title=Bagtyyar&description=Production-minded%20full-stack%20and%20mobile%20software%20engineering", width: 1200, height: 630, alt: "Bagtyyar — Production-Minded Engineer" }],
  },
  twitter: {
    title: "Bagtyyar — Production-Minded Engineer",
    description:
      "Production-minded full-stack and mobile software engineering. Tests, Docker, CI/CD, architecture decisions, and transparent delivery.",
    images: ["/og?title=Bagtyyar&description=Production-minded%20full-stack%20and%20mobile%20software%20engineering"],
  },
};

export default async function HomePage() {
  const projects = await getPublishedPublicProjects();
  const flagshipProject = projects[0] ?? null;

  return (
    <main className="flex min-h-svh flex-col">
      <JsonLd data={breadcrumbListSchema([{ name: "Home", url: "/" }])} />

      {/* Hero takeover — Three.js pipeline fills viewport, trust claim overlaid */}
      <section className="relative" data-testid="homepage-hero">
        {/* Scroll spacer — creates the scroll distance for the pipeline pan */}
        <div style={{ height: "400vh" }} aria-hidden="true" />

        {/* Sticky pipeline — fills viewport, scroll drives camera */}
        <div className="absolute inset-0">
          <PipelineScene map={examplePipelineMap} />
        </div>

        {/* Trust claim overlay — positioned over the canvas */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-2xl px-6 lg:px-16">
            <div className="space-y-8">
              <div className="space-y-5">
                <h1
                  data-testid="homepage-trust-claim"
                  className="font-serif text-4xl leading-[1.08] tracking-tight text-white/90 lg:text-5xl"
                >
                  Production-minded software engineering, built to stay
                  maintainable after launch.
                </h1>
                <p className="max-w-md text-base leading-relaxed text-white/60 lg:text-lg">
                  I build full-stack and mobile products with tests, Dockerized
                  environments, CI/CD, architecture decisions, and transparent
                  delivery.
                </p>
              </div>

              {/* CTAs */}
              <div
                data-testid="homepage-ctas"
                className="pointer-events-auto flex flex-wrap items-center gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  data-testid="homepage-cta-work-with-me"
                  className="bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  <Link href="/work-with-me">Work With Me</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  data-testid="homepage-cta-engineering-system"
                >
                  <Link
                    href="/engineering-system"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white/90"
                  >
                    Review My Engineering System
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured work — left-anchored, no center snap */}
      {flagshipProject && (
        <section className="border-t border-border px-6 py-16 lg:px-16 lg:py-24">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl tracking-tight text-foreground">
                Featured work
              </h2>
              <p className="text-base text-muted-foreground">
                A recent project built with the same discipline.
              </p>
            </div>
            <div data-testid="flagship-project">
              <ProjectCard project={flagshipProject} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Run typecheck**

```bash
pnpm typecheck
```

Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/three/pipeline-scene.tsx src/app/\(public\)/page.tsx
git commit -m "feat(#49): implement hero takeover layout with scroll-driven pipeline

- PipelineScene wrapper now tracks scroll progress and passes to scene
- Hero section uses sticky position with scroll spacer (400vh)
- Trust claim and CTAs overlaid on top of Three.js canvas
- After pipeline completes, page scrolls into Work section
- Dark-over-light CTAs for visibility against dark canvas

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

- [ ] **Step 5: Push branch**

```bash
git push -u origin feat/49-page-layout
```

---

### Task 3: Update Tests and Verify (Agent 3)

**Branch:** `feat/49-tests`
**Worktree:** `.claude/worktrees/feat-49-tests`

**Files:**
- Modify: `src/components/three/pipeline-scene.test.tsx`
- Modify: `e2e/pipeline-map.spec.ts`
- Read: `src/components/three/pipeline-diagram-html.tsx`

- [ ] **Step 1: Update unit tests for new PipelineSceneClient API**

Read `src/components/three/pipeline-scene.test.tsx`. Update tests to account for:
- `scrollProgress` as a required prop on `PipelineSceneClient`
- No OrbitControls
- Dark background
- Hover state management

If the test file imports `PipelineSceneClient` directly, update the import and add `scrollProgress` to props. Since the scene renders inside a Canvas (which requires a browser environment), unit tests that try to render the full scene will need mock adjustments.

Run existing tests:

```bash
pnpm vitest run src/components/three/
```

Expected: Tests either pass or need updates for the new API. If tests fail with "scrollProgress is required", update mock props.

- [ ] **Step 2: Update E2E pipeline map tests**

Read `e2e/pipeline-map.spec.ts`. The current tests check for:
- Pipeline diagram wrapper present on homepage
- Canvas or HTML fallback attached to DOM
- Reduced-motion path shows HTML fallback
- HTML fallback has keyboard-accessible DOM elements

Update the selectors if needed:
- The wrapper now uses `className="sticky top-0 h-svh w-full"` with `data-testid="pipeline-diagram"`
- The homepage hero section now uses `data-testid="homepage-hero"`
- Trust claim overlay uses white text instead of foreground color

Verify the E2E smoke tests still work:

```bash
pnpm test:e2e:threejs
```

Expected: Tests pass with the new layout. If any selector has changed, update the test file.

- [ ] **Step 3: Verify HTML fallback accessibility**

The HTML fallback (`pipeline-diagram-html.tsx`) should already have proper ARIA attributes. Verify:

```bash
grep -n 'role\|aria-label\|aria-' src/components/three/pipeline-diagram-html.tsx
```

Expected: At minimum, the root element should have `role="region"` and `aria-label`. If missing, add:

```tsx
<section
  role="region"
  aria-label="Production pipeline diagram — accessible fallback"
>
```

- [ ] **Step 4: Run the full quality check locally**

```bash
pnpm typecheck && pnpm test && pnpm build
```

Expected: All pass. If build fails, investigate any SSR issues with the new client components.

- [ ] **Step 5: Commit**

```bash
git add src/components/three/pipeline-scene.test.tsx e2e/pipeline-map.spec.ts
git commit -m "test(#49): update tests for Three.js pipeline redesign

- Update unit test props for new PipelineSceneClient API
- Update E2E selectors for hero takeover layout
- Verify HTML fallback ARIA attributes

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

- [ ] **Step 6: Push branch**

```bash
git push -u origin feat/49-tests
```

---

## Supervisor Review Checklist

After all three branches are pushed:

### AC Coverage

| AC | What to verify | Which branch |
|----|---------------|--------------|
| Homepage renders Three.js pipeline map on supported clients | Canvas renders on homepage at `/` with dark background and emissive nodes | feat/49-scene-rewrite + feat/49-page-layout |
| Fallback HTML communicates pipeline when WebGL/reduced-motion | Emulate `prefers-reduced-motion: reduce`, verify HTML diagram shows all 6 flow stages | feat/49-scene-rewrite |
| Scene uses design/status semantics | Check nodes use `STATUS_EMISSIVE` colors (verified=#22c55e green, inProgress=#3b82f6 blue, etc.) not arbitrary hex values | feat/49-scene-rewrite |
| Human visual review confirms scene supports trust rather than decoration | Load homepage in browser, verify dark emissive aesthetic, scroll-driven pan, hover detail cards. Must not feel like a screensaver. | HITL — requires human |

### Merge Strategy

1. Merge `feat/49-scene-rewrite` first (core scene, no page dependencies)
2. Merge `feat/49-page-layout` second (depends on scene accepting scrollProgress)
3. Merge `feat/49-tests` last (verifies both)
4. Or: merge all three to an integration branch, resolve any conflicts, then merge to main

### Post-Merge Cleanup

- Remove scaffolding spec and plan files from `docs/superpowers/`
- Un-label `[DEFERRED]` from issue #49 if applicable
- Check all 4 acceptance criteria
- Close issue #49 with merge commit SHA
