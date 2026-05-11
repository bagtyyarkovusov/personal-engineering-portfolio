import { PublicArchitectureDecision } from "./queries";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { renderMarkdown } from "@/lib/markdown/renderer";

interface ArchitectureDecisionListProps {
  decisions: PublicArchitectureDecision[];
}

export async function ArchitectureDecisionList({ decisions }: ArchitectureDecisionListProps) {
  if (decisions.length === 0) return null;

  const rendered = await Promise.all(
    decisions.map(async (d) => ({
      ...d,
      bodyHtml: d.body ? await renderMarkdown(d.body) : null,
    }))
  );

  return (
    <section className="border-t border-border pt-8">
      <h2 className="font-serif text-2xl tracking-tight text-foreground">Architecture Decisions</h2>
      <div className="mt-6 space-y-6">
        {rendered.map((decision) => (
          <article key={decision.id} className="rounded-lg border border-border bg-card p-6 space-y-3">
            <header className="space-y-1">
              <h3 className="font-serif text-xl tracking-tight text-card-foreground">{decision.title}</h3>
              {decision.decidedAt && (
                <time dateTime={decision.decidedAt.toISOString()} className="text-xs text-muted-foreground">
                  Decided {new Date(decision.decidedAt).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                </time>
              )}
            </header>
            <p className="text-sm text-muted-foreground">{decision.summary}</p>
            {decision.bodyHtml && <div className="pt-2"><MarkdownContent html={decision.bodyHtml} /></div>}
          </article>
        ))}
      </div>
    </section>
  );
}
