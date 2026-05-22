import Link from "next/link";
import { PublicBuildLogEntry } from "./queries";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { renderMarkdown } from "@/lib/markdown/renderer";

interface BuildLogListProps {
  entries: PublicBuildLogEntry[];
  showEmptyState?: boolean;
}

export async function BuildLogList({ entries, showEmptyState = false }: BuildLogListProps) {
  if (entries.length === 0) {
    if (!showEmptyState) return null;

    return (
      <section className="border-t border-border pt-8">
        <div className="mt-6 rounded-lg border border-border bg-card p-8 space-y-4">
          <div className="space-y-2">
            <p className="font-serif text-lg tracking-tight text-foreground">No updates yet</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Build log entries will appear here as development progresses.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const rendered = await Promise.all(
    entries.map(async (entry) => ({
      ...entry,
      bodyHtml: entry.body ? await renderMarkdown(entry.body) : null,
    }))
  );

  return (
    <section className="border-t border-border pt-8">
      <div className="space-y-4">
        {rendered.map((entry) => (
          <article key={entry.id} className="rounded-lg border border-border bg-card p-6 space-y-3">
            <header className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <time dateTime={entry.occurredAt.toISOString()}>
                  {new Date(entry.occurredAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </time>
                <span aria-hidden="true">·</span>
                <Link href={`/work/${entry.project.slug}`} className="hover:text-foreground transition-colors">
                  {entry.project.title}
                </Link>
              </div>
              <h3 className="font-serif text-xl tracking-tight text-card-foreground">{entry.title}</h3>
            </header>
            {entry.bodyHtml && <MarkdownContent html={entry.bodyHtml} />}
          </article>
        ))}
      </div>
    </section>
  );
}
