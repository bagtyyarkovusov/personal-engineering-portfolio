import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { PipelineScene } from "@/components/three"; // DEFERRED — see issue #49
// import { examplePipelineMap } from "@/features/pipeline-map/example-data";
import { ProjectCard } from "@/features/projects/project-card";
import { getPublishedPublicProjects } from "@/features/projects/queries";

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  openGraph: {
    title: "Bagtyyar — Production-Minded Engineer",
    description:
      "Production-minded full-stack and mobile software engineering. Tests, Docker, CI/CD, architecture decisions, and transparent delivery.",
    images: [{ url: "/og?title=Bagtyyar&description=Production-minded%20full-stack%20and%20mobile%20software%20engineering", width: 1200, height: 630, alt: "Bagtyyar — Production-Minded Engineer" }],
  },
  twitter: {
    title: "Bagtyyar — Production-Minded Engineer",
    description:
      "Production-minded full-stack and mobile software engineering. Tests, Docker, CI/CD, architecture decisions, and transparent delivery.",
    images: ["/og?title=Bagtyyar&description=Production-minded%20full-stack%20and%20mobile%20software%20engineering"],
  },
};

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

        {/* Right: pipeline diagram — DEFERRED (issue #49)
             PipelineScene previously rendered here. The Three.js canvas
             is preserved in src/components/three/ for later completion. */}
        <div className="flex flex-col justify-center px-6 py-8 lg:col-span-5 lg:px-10 lg:py-24" />
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
