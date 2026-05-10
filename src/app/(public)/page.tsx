import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/features/projects/project-card";
import { getPublishedPublicProjects } from "@/features/projects/queries";

export const metadata = {
  title: "Bagtyyar — Production-minded engineering",
};

const pipelineStages = [
  { label: "Tests", description: "Unit, integration, E2E" },
  { label: "Docker", description: "Repeatable environments" },
  { label: "CI/CD", description: "GitHub Actions quality gate" },
  { label: "Architecture", description: "ADRs, thin routes, features" },
  { label: "Milestones", description: "Transparent delivery" },
];

function PipelineDiagram() {
  return (
    <div className="relative">
      {/* Vertical spine */}
      <div className="absolute left-[15px] top-3 bottom-3 w-px bg-border" />

      <div className="space-y-1">
        {pipelineStages.map((stage) => (
          <div key={stage.label} className="relative flex items-center gap-4 py-2">
            {/* Node on spine */}
            <div className="relative z-10 flex size-8 items-center justify-center rounded-full border border-border bg-background">
              <div className="size-2.5 rounded-full bg-status-verified" />
            </div>
            {/* Stage panel */}
            <div className="flex-1 rounded-lg border border-border bg-card/30 px-4 py-3">
              <div className="text-sm font-semibold text-card-foreground">
                {stage.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {stage.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const projects = await getPublishedPublicProjects();
  const flagshipProject = projects[0] ?? null;

  return (
    <main className="flex min-h-svh flex-col">
      {/* Hero — asymmetric editorial split */}
      <section className="grid min-h-svh grid-cols-1 lg:grid-cols-12">
        {/* Left: trust surface */}
        <div className="flex flex-col justify-center px-6 py-16 lg:col-span-7 lg:px-16 lg:py-24">
          <div className="max-w-2xl space-y-10">
            <div className="space-y-6">
              <h1
                data-testid="homepage-trust-claim"
                className="font-serif text-5xl leading-[1.05] tracking-tight text-foreground lg:text-6xl"
              >
                Production-minded software engineering, built to stay
                maintainable after launch.
              </h1>
              <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:text-lg">
                I build full-stack and mobile products with tests, Dockerized
                environments, CI/CD, architecture decisions, and transparent
                delivery.
              </p>
            </div>

            {/* CTAs */}
            <div
              data-testid="homepage-ctas"
              className="flex flex-wrap items-center gap-4"
            >
              <Button
                asChild
                size="lg"
                data-testid="homepage-cta-work-with-me"
              >
                <Link href="/work-with-me">Work With Me</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                data-testid="homepage-cta-engineering-system"
              >
                <Link
                  href="/engineering-system"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  Review My Engineering System
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Right: pipeline diagram */}
        <div className="flex flex-col justify-center px-6 py-8 lg:col-span-5 lg:px-10 lg:py-24">
          <div data-testid="pipeline-diagram">
            <PipelineDiagram />
          </div>
        </div>
      </section>

      {/* Featured work — left-anchored, no center snap */}
      {flagshipProject && (
        <section className="border-t border-border px-6 py-16 lg:px-16 lg:py-24">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl tracking-tight text-foreground">
                Featured work
              </h2>
              <p className="text-base text-muted-foreground">
                A recent project built with the same discipline.
              </p>
            </div>
            <div data-testid="flagship-project">
              <ProjectCard project={flagshipProject} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
