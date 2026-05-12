import { ContentStatus } from "@prisma/client";
import { getStatusConfig, Status } from "@/design/statuses";
import type { PrivateRoomData } from "@/features/private-rooms/private-room-queries";
import { MilestoneTimeline } from "@/features/milestones/milestone-timeline";
import { BuildLogList } from "@/features/build-logs/build-log-list";
import { ArchitectureDecisionList } from "@/features/architecture-decisions/architecture-decision-list";
import { PipelineEvidenceList } from "@/features/pipeline-evidence/pipeline-evidence-list";

interface PrivateRoomViewProps {
  data: NonNullable<PrivateRoomData>;
}

function getProjectDesignStatus(status: ContentStatus, completedAt: Date | null): {
  label: string;
  badgeClass: string;
} {
  let designStatus: Status;
  if (completedAt) {
    designStatus = Status.VERIFIED;
  } else if (status === ContentStatus.published) {
    designStatus = Status.IN_PROGRESS;
  } else {
    designStatus = Status.NEUTRAL;
  }
  const config = getStatusConfig(designStatus);
  return { label: config.label, badgeClass: config.badgeClass };
}

export function PrivateRoomView({ data }: PrivateRoomViewProps) {
  const { project, room, milestones, buildLogs, architectureDecisions, pipelineEvidence } = data;
  const statusCfg = getProjectDesignStatus(project.status, project.completedAt ?? null);

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-4xl tracking-tight text-foreground">
            {project.title}
          </h1>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusCfg.badgeClass}`}
          >
            {statusCfg.label}
          </span>
        </div>
        <p className="text-base text-muted-foreground">{project.summary}</p>

        {project.stack.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
      </header>

      {project.outcome && (
        <section className="border-t border-border pt-8">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            Outcome
          </h2>
          <p className="mt-2 text-base text-foreground">{project.outcome}</p>
        </section>
      )}

      {room.showMilestones && (
        milestones.length > 0
          ? <MilestoneTimeline milestones={milestones} />
          : (
            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl tracking-tight text-foreground">Milestones</h2>
              <p className="mt-6 text-sm text-muted-foreground">No records shared yet.</p>
            </section>
          )
      )}

      {room.showArchitecture && (
        architectureDecisions.length > 0
          ? <ArchitectureDecisionList decisions={architectureDecisions} />
          : (
            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl tracking-tight text-foreground">Architecture Decisions</h2>
              <p className="mt-6 text-sm text-muted-foreground">No records shared yet.</p>
            </section>
          )
      )}

      {room.showEvidence && (
        pipelineEvidence.length > 0
          ? <PipelineEvidenceList evidence={pipelineEvidence} />
          : (
            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl tracking-tight text-foreground">Pipeline Evidence</h2>
              <p className="mt-6 text-sm text-muted-foreground">No records shared yet.</p>
            </section>
          )
      )}

      {room.showUpdates && (
        buildLogs.length > 0
          ? <BuildLogList entries={buildLogs} />
          : (
            <section className="border-t border-border pt-8">
              <h2 className="font-serif text-2xl tracking-tight text-foreground">Build Log</h2>
              <p className="mt-6 text-sm text-muted-foreground">No records shared yet.</p>
            </section>
          )
      )}

      {room.showNextSteps && (
        <section className="border-t border-border pt-8">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">Next Steps</h2>
          <p className="mt-6 text-sm text-muted-foreground">
            Interested in learning more? Get in touch to discuss next steps.
          </p>
        </section>
      )}
    </main>
  );
}
