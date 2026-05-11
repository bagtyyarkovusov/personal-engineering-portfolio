import Link from "next/link";
import { PublicBuildLogEntry } from "./queries";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { renderMarkdown } from "@/lib/markdown/renderer";

interface BuildLogListProps {
  entries: PublicBuildLogEntry[];
}

export async function BuildLogList({ entries }: BuildLogListProps) {
  if (entries.length === 0) {
    return (
      <section className="rounded-lg border border-border bg-card p-8 space-y-4">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">No updates yet</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Build log entries will appear here as development progresses.
          </p>
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
  );
}
