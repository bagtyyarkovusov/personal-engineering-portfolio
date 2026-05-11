import { PublicPipelineEvidence } from "./queries";
import { getStatusConfig, Status } from "@/design/statuses";

const CATEGORY_LABELS: Record<string, string> = {
  testing: "Testing", docker: "Docker", ci: "CI/CD", deployment: "Deployment", general: "General",
};

interface PipelineEvidenceListProps {
  evidence: PublicPipelineEvidence[];
}

export function PipelineEvidenceList({ evidence }: PipelineEvidenceListProps) {
  if (evidence.length === 0) return null;

  return (
    <section className="border-t border-border pt-8">
      <h2 className="font-serif text-2xl tracking-tight text-foreground">Pipeline Evidence</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {evidence.map((item) => {
          const statusConfig = getStatusConfig(Status.VERIFIED);
          return (
            <div key={item.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm text-card-foreground">{item.label}</h3>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.badgeClass}`}>
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </span>
              </div>
              {item.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <time dateTime={item.recordedAt.toISOString()}>
                  {new Date(item.recordedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </time>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View</a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
