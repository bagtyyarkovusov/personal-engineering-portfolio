import { notFound } from "next/navigation";
import { getPublishedPublicProjectBySlug } from "@/features/projects/queries";
import { getPublishedPublicMilestones } from "@/features/milestones/queries";
import { getPublishedPublicArchitectureDecisions } from "@/features/architecture-decisions/queries";
import { ArchitectureDecisionList } from "@/features/architecture-decisions/architecture-decision-list";
import { MilestoneTimeline } from "@/features/milestones/milestone-timeline";
import { renderMarkdown } from "@/lib/markdown/renderer";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { JsonLd, breadcrumbListSchema, projectSchema } from "@/components/seo/json-ld";
import { AnimateIn } from "@/components/animation/animate-in";

export const dynamic = "force-dynamic";
import { getStatusConfig } from "@/design/statuses";
import { getPublishedPublicPipelineEvidence } from "@/features/pipeline-evidence/queries";
import { PipelineEvidenceList } from "@/features/pipeline-evidence/pipeline-evidence-list";
import { getPublishedPublicBuildLogEntriesByProject } from "@/features/build-logs/queries";
import { BuildLogList } from "@/features/build-logs/build-log-list";

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
    title: project.title,
    description: project.summary || undefined,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: `${project.title} | Bagtyyar`,
      description:
        project.summary ||
        `A production-minded project by Bagtyyar.`,
      images: [{ url: `/og?title=${encodeURIComponent(`${project.title} | Bagtyyar`)}&description=${encodeURIComponent(project.summary || `A production-minded project by Bagtyyar.`)}`, width: 1200, height: 630, alt: `${project.title} | Bagtyyar` }],
    },
    twitter: {
      title: `${project.title} | Bagtyyar`,
      description:
        project.summary ||
        `A production-minded project by Bagtyyar.`,
      images: [`/og?title=${encodeURIComponent(`${project.title} | Bagtyyar`)}&description=${encodeURIComponent(project.summary || `A production-minded project by Bagtyyar.`)}`],
    },
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
  const milestones = await getPublishedPublicMilestones(project.id);
  const buildLogEntries = await getPublishedPublicBuildLogEntriesByProject(project.id);
  const architectureDecisions = await getPublishedPublicArchitectureDecisions(project.id);
  const pipelineEvidence = await getPublishedPublicPipelineEvidence(project.id);

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <JsonLd data={breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Work", url: "/work" }, { name: project.title, url: `/work/${project.slug}` }])} />
      <JsonLd data={projectSchema({ title: project.title, summary: project.summary, slug: project.slug, updatedAt: project.updatedAt })} />

      <AnimateIn animation="fade-up" duration={700}>
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
                  className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors duration-200 hover:border-primary/15"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </header>
      </AnimateIn>

      {/* Outcome first — proof before process */}
      {project.outcome && (
        <AnimateIn animation="fade-up" duration={700} delay={100}>
          <section className="border-t border-border pt-8">
            <h2 className="font-serif text-2xl tracking-tight text-foreground">
              Outcome
            </h2>
            <p className="mt-2 text-base text-foreground">{project.outcome}</p>
          </section>
        </AnimateIn>
      )}

      {/* Engineering proof immediately after */}
      {bodyHtml && (
        <AnimateIn animation="fade-up" duration={700} delay={100}>
          <section className="border-t border-border pt-8">
            <MarkdownContent html={bodyHtml} />
          </section>
        </AnimateIn>
      )}

      {/* Milestone timeline */}
      {milestones.length > 0 && (
        <AnimateIn animation="fade-up" duration={700} delay={100}>
          <MilestoneTimeline milestones={milestones} />
        </AnimateIn>
      )}

      {/* Architecture decisions */}
      {architectureDecisions.length > 0 && (
        <AnimateIn animation="fade-up" duration={700} delay={100}>
          <ArchitectureDecisionList decisions={architectureDecisions} />
        </AnimateIn>
      )}

      {/* Pipeline evidence */}
      {pipelineEvidence.length > 0 && (
        <AnimateIn animation="fade-up" duration={700} delay={100}>
          <PipelineEvidenceList evidence={pipelineEvidence} />
        </AnimateIn>
      )}

      {/* Build Log */}
      {buildLogEntries.length > 0 && (
        <AnimateIn animation="fade-up" duration={700} delay={100}>
          <BuildLogList entries={buildLogEntries} />
        </AnimateIn>
      )}
    </main>
  );
}
