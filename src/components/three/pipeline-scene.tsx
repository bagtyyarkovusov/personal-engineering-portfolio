"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { PipelineMap } from "@/features/pipeline-map/types";
import { PipelineDiagramHTML } from "./pipeline-diagram-html";

const PipelineSceneClient = dynamic(
  () => import("./pipeline-scene-client").then((m) => m.PipelineSceneClient),
  { ssr: false },
);

export function PipelineScene({ map }: { map: PipelineMap }) {
  return (
    <div className="relative h-[500px] w-full" data-testid="pipeline-diagram">
      <noscript>
        <PipelineDiagramHTML map={map} />
      </noscript>
      <Suspense fallback={<PipelineDiagramHTML map={map} />}>
        <PipelineSceneClient pipelineMap={map} />
      </Suspense>
    </div>
  );
}
