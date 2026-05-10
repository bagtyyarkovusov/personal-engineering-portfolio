import { notFound } from "next/navigation";
import { getPublishedPublicProjectBySlug } from "@/features/projects/queries";
import { renderMarkdown } from "@/lib/markdown/renderer";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { getStatusConfig } from "@/design/statuses";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedPublicProjectBySlug(slug);
  if (!project) {
    return { title: "Not Found" };
  }
  return {
    title: `${project.title} — Bagtyyar`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedPublicProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const bodyHtml = project.body ? await renderMarkdown(project.body) : null;
  const isActiveBuild = project.completedAt == null;

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-4xl tracking-tight text-foreground">
            {project.title}
          </h1>
          {isActiveBuild && (
            <span
              data-testid="active-build-badge"
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusConfig("inProgress").badgeClass}`}
            >
              Active build
            </span>
          )}
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

      {/* Outcome first — proof before process */}
      {project.outcome && (
        <section className="border-t border-border pt-8">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            Outcome
          </h2>
          <p className="mt-2 text-base text-foreground">{project.outcome}</p>
        </section>
      )}

      {/* Engineering proof immediately after */}
      {bodyHtml && (
        <section className="border-t border-border pt-8">
          <MarkdownContent html={bodyHtml} />
        </section>
      )}
    </main>
  );
}
