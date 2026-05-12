import type { PipelineMap, PipelineStage } from "@/features/pipeline-map/types";
import { PIPELINE_STAGES, PIPELINE_STAGE_LABELS } from "@/features/pipeline-map/types";
import { getStatusConfig } from "@/design/statuses";
import type { Status } from "@/design/statuses";

// ---------------------------------------------------------------------------
// Pipeline flow order (the "spine" stages that form the delivery flow)
// ---------------------------------------------------------------------------

const FLOW_STAGES: PipelineStage[] = [
  "product",
  "architecture",
  "tests",
  "docker",
  "ciCd",
  "deployment",
];

const SUPPORT_STAGES: PipelineStage[] = ["milestones", "evidence"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function aggregateNodeStatus(nodes: { status: Status }[]): Status {
  if (nodes.length === 0) return "neutral";
  const hasRisk = nodes.some((n) => n.status === "risk");
  if (hasRisk) return "risk";
  const hasAttention = nodes.some((n) => n.status === "attention");
  if (hasAttention) return "attention";
  const hasInProgress = nodes.some((n) => n.status === "inProgress");
  if (hasInProgress) return "inProgress";
  const allVerified = nodes.every((n) => n.status === "verified");
  if (allVerified) return "verified";
  return "neutral";
}

function countByStatus(
  nodes: { status: Status }[],
  status: Status,
): number {
  return nodes.filter((n) => n.status === status).length;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StageDot({ status }: { status: Status }) {
  const cfg = getStatusConfig(status);
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-2 shrink-0 rounded-full ${cfg.bgClass}`}
    />
  );
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.badgeClass}`}
    >
      <span className={`size-1.5 rounded-full ${cfg.bgClass}`} />
      {cfg.label}
    </span>
  );
}

function FlowArrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`hidden shrink-0 text-border/60 md:block ${className ?? ""}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function FlowArrowDown({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`shrink-0 text-border/60 md:hidden ${className ?? ""}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3v10M3 8l5 5 5-5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Pipeline stage card (flow spine)
// ---------------------------------------------------------------------------

function FlowStageCard({
  stage,
  nodes,
}: {
  stage: PipelineStage;
  nodes: PipelineMap["nodes"];
}) {
  const status = aggregateNodeStatus(nodes);
  const cfg = getStatusConfig(status);
  const label = PIPELINE_STAGE_LABELS[stage];
  const hasNodes = nodes.length > 0;

  return (
    <div
      className={`group flex min-w-[120px] max-w-[160px] flex-col gap-1.5 rounded-lg border px-3.5 py-3 transition-colors ${
        hasNodes
          ? "border-border bg-card/60"
          : "border-dashed border-border/60 bg-card/30"
      }`}
      data-stage={stage}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex size-7 shrink-0 items-center justify-center rounded-full border ${
            hasNodes ? cfg.bgClass : "border-border/50 bg-transparent"
          }`}
        >
          <span
            className={`size-2 rounded-full ${
              hasNodes ? "bg-current" : cfg.bgClass
            }`}
          />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
          {label}
        </span>
      </div>

      {hasNodes ? (
        <div className="space-y-0.5">
          {nodes.length <= 3 ? (
            nodes.map((node) => (
              <div
                key={node.id}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <StageDot status={node.status} />
                <span className="truncate">{node.label}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium tabular-nums text-foreground">
                {nodes.length}
              </span>{" "}
              items
              <div className="mt-0.5 flex items-center gap-1">
                {countByStatus(nodes, "verified") > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[10px]">
                    <span
                      className={`size-1.5 rounded-full ${getStatusConfig("verified").bgClass}`}
                    />
                    {countByStatus(nodes, "verified")}
                  </span>
                )}
                {countByStatus(nodes, "inProgress") > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[10px]">
                    <span
                      className={`size-1.5 rounded-full ${getStatusConfig("inProgress").bgClass}`}
                    />
                    {countByStatus(nodes, "inProgress")}
                  </span>
                )}
                {countByStatus(nodes, "attention") > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[10px]">
                    <span
                      className={`size-1.5 rounded-full ${getStatusConfig("attention").bgClass}`}
                    />
                    {countByStatus(nodes, "attention")}
                  </span>
                )}
                {countByStatus(nodes, "neutral") > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[10px]">
                    <span
                      className={`size-1.5 rounded-full ${getStatusConfig("neutral").bgClass}`}
                    />
                    {countByStatus(nodes, "neutral")}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <span className="text-[11px] italic text-muted-foreground/60">
          No data
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Support row (milestones / evidence)
// ---------------------------------------------------------------------------

function SupportRow({
  stage,
  nodes,
}: {
  stage: PipelineStage;
  nodes: PipelineMap["nodes"];
}) {
  const label = PIPELINE_STAGE_LABELS[stage];
  const status = aggregateNodeStatus(nodes);
  const cfg = getStatusConfig(status);
  const verifiedCount = countByStatus(nodes, "verified");
  const totalCount = nodes.length;

  if (nodes.length === 0) {
    return (
      <div
        className="flex items-center gap-3 rounded-lg border border-dashed border-border/50 bg-card/20 px-4 py-3"
        data-stage={stage}
        data-support-row="true"
      >
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full border border-border/40">
            <span className="size-1.5 rounded-full bg-status-neutral" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            {label}
          </span>
        </div>
        <span className="text-[11px] italic text-muted-foreground/50">
          No {label.toLowerCase()} recorded
        </span>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-border bg-card/40 px-4 py-3"
      data-stage={stage}
      data-support-row="true"
    >
      {/* Row header */}
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex size-6 items-center justify-center rounded-full border ${cfg.bgClass}`}
          >
            <span className="size-1.5 rounded-full bg-current" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
            {label}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {verifiedCount}/{totalCount} verified
          </span>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="mb-2.5 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${cfg.bgClass}`}
            style={{ width: `${(verifiedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      {/* Node chips */}
      <div className="flex flex-wrap gap-1.5">
        {nodes.map((node) => {
          const nodeCfg = getStatusConfig(node.status);
          return (
            <span
              key={node.id}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-tight ${
                node.status === "verified"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : node.status === "inProgress"
                    ? "border-blue-200 bg-blue-50 text-blue-800"
                    : node.status === "attention"
                      ? "border-amber-200 bg-amber-50 text-amber-800"
                      : "border-gray-200 bg-gray-50 text-gray-600"
              }`}
            >
              <span className={`size-1.5 rounded-full ${nodeCfg.bgClass}`} />
              {node.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function PipelineDiagramHTML({ map }: { map?: PipelineMap }) {
  const nodes = map?.nodes ?? [];
  const projectName = map?.projectName;

  // Group nodes by stage
  const grouped = new Map<PipelineStage, PipelineMap["nodes"]>();
  for (const stage of PIPELINE_STAGES) {
    grouped.set(stage, []);
  }
  for (const node of nodes) {
    const list = grouped.get(node.stage);
    if (list) list.push(node);
  }

  const aggregateStatus = map?.status ?? "neutral";
  const cfg = getStatusConfig(aggregateStatus);

  return (
    <div
      className="select-none space-y-5"
      data-testid="pipeline-diagram-fallback"
      role="region"
      aria-label="Engineering pipeline map"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          {projectName && (
            <h3 className="truncate font-serif text-lg font-semibold tracking-tight text-foreground">
              {projectName}
            </h3>
          )}
          <p className="text-xs text-muted-foreground">
            Engineering delivery pipeline
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`size-2 rounded-full ${cfg.bgClass}`} />
          <span className="text-xs font-medium text-muted-foreground">
            System{" "}
            <span className="tabular-nums text-foreground">{cfg.label}</span>
          </span>
        </div>
      </div>

      {/* Main pipeline flow spine — horizontal on desktop, vertical on mobile */}
      <div className="flex flex-col items-center gap-1 md:flex-row md:gap-2">
        {FLOW_STAGES.map((stage, i) => {
          const stageNodes = grouped.get(stage) ?? [];
          const isLast = i === FLOW_STAGES.length - 1;
          return (
            <div
              key={stage}
              className="flex flex-col items-center gap-1 md:flex-row md:gap-2"
            >
              <FlowStageCard stage={stage} nodes={stageNodes} />
              {!isLast && (
                <>
                  <FlowArrow className="mx-0.5" />
                  <FlowArrowDown className="my-0.5" />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Supporting layers: milestones + evidence */}
      <div className="space-y-3">
        {SUPPORT_STAGES.map((stage) => {
          const stageNodes = grouped.get(stage) ?? [];
          return (
            <SupportRow key={stage} stage={stage} nodes={stageNodes} />
          );
        })}
      </div>
    </div>
  );
}
