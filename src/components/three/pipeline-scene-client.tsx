"use client";

import { useMemo, memo, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
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

const STATUS_COLORS: Record<Status, string> = {
  verified: "#22c55e",
  inProgress: "#3b82f6",
  attention: "#f59e0b",
  risk: "#ef4444",
  neutral: "#6b7280",
};

const SPINE_COLOR = "#d1d5db";
const GROUND_COLOR = "#f3f4f6";

const GEOM_SEGMENTS = 12;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getStatusHexColor(status: Status): string {
  return STATUS_COLORS[status] ?? "#6b7280";
}

function aggregateNodeStatus(nodes: { status: Status }[]): Status {
  if (nodes.length === 0) return "neutral";
  if (nodes.some((n) => n.status === "risk")) return "risk";
  if (nodes.some((n) => n.status === "attention")) return "attention";
  if (nodes.some((n) => n.status === "inProgress")) return "inProgress";
  if (nodes.every((n) => n.status === "verified")) return "verified";
  return "neutral";
}

// ---------------------------------------------------------------------------
// Layout hooks
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
      color: string;
      key: string;
    }> = [];
    for (const edge of edges) {
      const from = nodePositions.get(edge.source);
      const to = nodePositions.get(edge.target);
      if (!from || !to) continue;
      result.push({
        from,
        to,
        color: edge.status ? getStatusHexColor(edge.status) : "#d1d5db",
        key: `${edge.source}-${edge.target}`,
      });
    }
    return result;
  }, [edges, nodePositions]);
}

// ---------------------------------------------------------------------------
// 3D sub-components
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
      <cylinderGeometry args={[0.05, 0.05, length, GEOM_SEGMENTS]} />
      <meshStandardMaterial
        color={SPINE_COLOR}
        metalness={0.3}
        roughness={0.6}
      />
    </mesh>
  );
}

function StagePlatform({
  x,
  status,
}: {
  x: number;
  status: Status;
}) {
  return (
    <mesh position={[x, -0.3, 0]}>
      <boxGeometry args={[1.8, 0.06, 1.0]} />
      <meshStandardMaterial
        color={getStatusHexColor(status)}
        transparent
        opacity={0.25}
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
}

function StageLabel({
  x,
  stage,
}: {
  x: number;
  stage: PipelineStage;
}) {
  return (
    <Text
      position={[x, -0.7, 0]}
      fontSize={0.18}
      color="#9ca3af"
      anchorX="center"
      anchorY="top"
    >
      {PIPELINE_STAGE_LABELS[stage]}
    </Text>
  );
}

function PipelineNodeMesh({
  position,
  stage,
  status,
  label,
}: {
  position: [number, number, number];
  stage: PipelineStage;
  status: Status;
  label: string;
}) {
  const [x, y, z] = position;
  const color = getStatusHexColor(status);
  const isActive = status === "verified" || status === "inProgress";
  const size = FLOW_STAGES.includes(stage) ? 0.4 : 0.28;

  return (
    <group>
      <mesh position={[x, y, z]}>
        {stage === "product" && <octahedronGeometry args={[size * 1.1, 0]} />}
        {stage === "architecture" && <boxGeometry args={[size * 1.4, size * 0.9, size * 1.1]} />}
        {stage === "tests" && <icosahedronGeometry args={[size, 0]} />}
        {stage === "docker" && <cylinderGeometry args={[size * 0.85, size * 0.85, size * 1.4, GEOM_SEGMENTS]} />}
        {stage === "ciCd" && <torusGeometry args={[size * 0.65, size * 0.35, 8, GEOM_SEGMENTS]} />}
        {stage === "deployment" && <coneGeometry args={[size, size * 1.3, GEOM_SEGMENTS]} />}
        {stage === "milestones" && <sphereGeometry args={[size * 0.75, GEOM_SEGMENTS, 8]} />}
        {stage === "evidence" && <boxGeometry args={[size * 1.3, size * 0.3, size * 0.9]} />}
        <meshStandardMaterial
          color={color}
          metalness={0.15}
          roughness={0.55}
        />
      </mesh>

      {/* Active indicator ring — basic material avoids shadow overhead */}
      {isActive && (
        <mesh position={[x, y, z]}>
          <torusGeometry args={[size * 1.15 + 0.1, 0.04, 8, GEOM_SEGMENTS]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      )}

      <Text
        position={[x, y - (size + 0.35), z]}
        fontSize={FLOW_STAGES.includes(stage) ? 0.16 : 0.14}
        color="#6b7280"
        anchorX="center"
        anchorY="top"
        maxWidth={3}
      >
        {label}
      </Text>
    </group>
  );
}

function GroundPlane() {
  return (
    <mesh position={[0, -5.5, -0.5]}>
      <planeGeometry args={[24, 20]} />
      <meshStandardMaterial
        color={GROUND_COLOR}
        metalness={0}
        roughness={1}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

function SupportConnector({
  fromX,
  toY,
}: {
  fromX: number;
  toY: number;
}) {
  return (
    <Line
      points={[
        [fromX, -0.15, 0],
        [fromX, toY + 0.5, 0],
      ]}
      color="#e5e7eb"
      lineWidth={0.5}
      transparent
      opacity={0.4}
    />
  );
}

// ---------------------------------------------------------------------------
// Scene content — memoized since pipeline data is static
// ---------------------------------------------------------------------------

const PipelineSceneContent = memo(function PipelineSceneContent({
  pipelineMap,
}: {
  pipelineMap: PipelineMap;
}) {
  const { nodes, edges } = pipelineMap;
  const nodePositions = useNodePositions(nodes);
  const edgeLines = useEdgeLines(edges, nodePositions);

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
      {/* No shadows — shadows require a second render pass (shadow map)
          and provide minimal visual value for a pipeline diagram. */}
      <ambientLight intensity={0.55} color="#ffffff" />
      <directionalLight
        position={[8, 10, 6]}
        intensity={0.7}
      />
      <directionalLight
        position={[-4, 2, -3]}
        intensity={0.25}
        color="#e5e7eb"
      />

      <GroundPlane />
      <PipelineSpine />

      {FLOW_STAGES.map((stage) => {
        const stageNodes = nodesByStage.get(stage) ?? [];
        const x = STAGE_X[stage] ?? 0;
        const aggStatus = aggregateNodeStatus(stageNodes);
        return (
          <group key={`stage-${stage}`}>
            <StagePlatform x={x} status={aggStatus} />
            <StageLabel x={x} stage={stage} />
          </group>
        );
      })}

      <SupportConnector fromX={STAGE_X.milestones ?? 0} toY={-2.8} />
      <SupportConnector fromX={STAGE_X.evidence ?? 0} toY={-4.0} />

      {edgeLines.map(({ from, to, color, key }) => (
        <Line
          key={key}
          points={[from, to]}
          color={color}
          lineWidth={1.0}
          transparent
          opacity={0.35}
        />
      ))}

      {nodes.map((node) => {
        const pos = nodePositions.get(node.id);
        if (!pos) return null;
        return (
          <PipelineNodeMesh
            key={node.id}
            position={pos}
            stage={node.stage}
            status={node.status}
            label={node.label}
          />
        );
      })}

      <OrbitControls
        enableDamping={false}
        minDistance={5}
        maxDistance={18}
        maxPolarAngle={Math.PI / 1.6}
        target={[0, -0.5, 0]}
      />
    </>
  );
});

// ---------------------------------------------------------------------------
// Stable prop references — prevents R3F from reconfiguring the renderer
// on every React render
// ---------------------------------------------------------------------------

const STABLE_CAMERA = { position: [0, 0.5, 12] as const, fov: 45 };
const STABLE_GL = { antialias: true } as const;
const STABLE_DPR: [number, number] = [1, 1.5];
const STABLE_PERFORMANCE = { min: 0.5 };

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

interface PipelineSceneClientProps {
  pipelineMap: PipelineMap;
}

export const PipelineSceneClient = memo(function PipelineSceneClient({
  pipelineMap,
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
      frameloop="demand"
      performance={STABLE_PERFORMANCE}
    >
      <PipelineSceneContent pipelineMap={pipelineMap} />
    </Canvas>
  );
});
