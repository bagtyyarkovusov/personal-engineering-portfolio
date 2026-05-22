import { prisma } from "@/lib/db/prisma";

/**
 * Aggregate content counts from Prisma for the admin Overview page.
 *
 * Returns an object with total and published counts for each content type.
 * Used directly in the server-rendered overview page.
 */
export interface ContentCounts {
  projects: { total: number; published: number };
  milestones: { total: number };
  buildLogs: { total: number };
  architectureDecisions: { total: number; published: number };
  pipelineEvidence: { total: number; published: number };
  privateRooms: { total: number };
  contactSubmissions: { total: number; unread: number };
}

export async function getContentCounts(): Promise<ContentCounts> {
  const [
    totalProjects,
    publishedProjects,
    totalMilestones,
    totalBuildLogs,
    totalDecisions,
    publishedDecisions,
    totalEvidence,
    publishedEvidence,
    totalPrivateRooms,
    totalContactSubmissions,
    unreadContactSubmissions,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "published" } }),
    prisma.milestone.count(),
    prisma.buildLogEntry.count(),
    prisma.architectureDecision.count(),
    prisma.architectureDecision.count({ where: { status: "published" } }),
    prisma.pipelineEvidence.count(),
    prisma.pipelineEvidence.count({ where: { status: "published" } }),
    prisma.privateRoom.count(),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { status: "new" } }),
  ]);

  return {
    projects: { total: totalProjects, published: publishedProjects },
    milestones: { total: totalMilestones },
    buildLogs: { total: totalBuildLogs },
    pipelineEvidence: {
      total: totalEvidence,
      published: publishedEvidence,
    },
    privateRooms: { total: totalPrivateRooms },
    architectureDecisions: { total: totalDecisions, published: publishedDecisions },
    contactSubmissions: {
      total: totalContactSubmissions,
      unread: unreadContactSubmissions,
    },
  };
}

interface StatCardProps {
  label: string;
  total: number;
  published?: number;
  icon?: React.ReactNode;
}

function StatCard({ label, total, published, icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="mt-0.5 font-serif text-2xl tracking-tight tabular-nums">
            {total}
          </p>
          {published !== undefined && (
            <p className="text-xs text-muted-foreground">
              {published} published
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardGridProps {
  counts: ContentCounts;
}

export function StatCardGrid({ counts }: StatCardGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Projects"
        total={counts.projects.total}
        published={counts.projects.published}
      />
      <StatCard
        label="Milestones"
        total={counts.milestones.total}
      />
      <StatCard
        label="Build Logs"
        total={counts.buildLogs.total}
      />
      <StatCard
        label="Architecture Decisions"
        total={counts.architectureDecisions.total}
        published={counts.architectureDecisions.published}
      />
      <StatCard
        label="Pipeline Evidence"
        total={counts.pipelineEvidence.total}
        published={counts.pipelineEvidence.published}
      />
      <StatCard
        label="Private Rooms"
        total={counts.privateRooms.total}
      />
      <StatCard
        label="Contact Submissions"
        total={counts.contactSubmissions.total}
        published={counts.contactSubmissions.unread}
      />
    </div>
  );
}
