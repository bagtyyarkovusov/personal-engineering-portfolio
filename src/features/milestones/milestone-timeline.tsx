import type { PublicMilestone } from "@/features/milestones/queries";
import { getStatusConfig, Status } from "@/design/statuses";
import { ContentStatus } from "@prisma/client";

interface MilestoneTimelineProps {
  milestones: PublicMilestone[];
}

function mapMilestoneStatus(
  status: ContentStatus,
  completedAt: Date | null,
  targetDate: Date | null
): Status {
  if (completedAt != null) {
    return Status.VERIFIED;
  }
  if (status === ContentStatus.archived) {
    return Status.VERIFIED;
  }
  if (status === ContentStatus.published) {
    if (targetDate != null && new Date(targetDate) > new Date()) {
      return Status.NEUTRAL;
    }
    return Status.IN_PROGRESS;
  }
  return Status.NEUTRAL;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  if (milestones.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border pt-8">
      <h2 className="font-serif text-2xl tracking-tight text-foreground">
        Milestones
      </h2>

      <ol className="mt-6 space-y-6">
        {milestones.map((milestone, index) => {
          const statusKey = mapMilestoneStatus(
            milestone.status,
            milestone.completedAt,
            milestone.targetDate
          );
          const statusCfg = getStatusConfig(statusKey);
          const isLast = index === milestones.length - 1;

          return (
            <li key={milestone.id} className="relative pl-8">
              {/* Timeline connector line */}
              {!isLast && (
                <span
                  className="absolute left-[11px] top-4 block h-full w-px bg-border"
                  aria-hidden="true"
                />
              )}

              {/* Timeline dot */}
              <span
                className={`absolute left-0 top-1.5 block h-[22px] w-[22px] rounded-full border-2 ${statusCfg.bgClass} bg-background`}
                aria-hidden="true"
              >
                <span
                  className={`block h-2.5 w-2.5 rounded-full ${statusCfg.bgClass} mx-auto mt-[3px]`}
                />
              </span>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-foreground">
                    {milestone.title}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusCfg.badgeClass}`}
                  >
                    {statusCfg.labelShort}
                  </span>
                </div>

                {milestone.description && (
                  <p className="text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                )}

                {(milestone.targetDate || milestone.completedAt) && (
                  <p className="text-xs text-muted-foreground">
                    {milestone.completedAt
                      ? `Completed ${formatDate(milestone.completedAt)}`
                      : milestone.targetDate
                        ? `Target ${formatDate(milestone.targetDate)}`
                        : null}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
