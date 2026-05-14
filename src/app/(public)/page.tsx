import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/features/projects/project-card";
import { getPublishedPublicProjects } from "@/features/projects/queries";
import { SocialFooter } from "@/components/layout/social-footer";

import type { Metadata } from "next";
import { JsonLd, breadcrumbListSchema } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "Bagtyyar — Production-Minded Engineer",
    description:
      "Production-minded full-stack and mobile software engineering. Tests, Docker, CI/CD, architecture decisions, and transparent delivery.",
    images: [
      {
        url: "/og?title=Bagtyyar&description=Production-minded%20full-stack%20and%20mobile%20software%20engineering",
        width: 1200,
        height: 630,
        alt: "Bagtyyar — Production-Minded Engineer",
      },
    ],
  },
  twitter: {
    title: "Bagtyyar — Production-Minded Engineer",
    description:
      "Production-minded full-stack and mobile software engineering. Tests, Docker, CI/CD, architecture decisions, and transparent delivery.",
    images: [
      "/og?title=Bagtyyar&description=Production-minded%20full-stack%20and%20mobile%20software%20engineering",
    ],
  },
};

export default async function HomePage() {
  const projects = await getPublishedPublicProjects();
  const flagshipProject = projects[0] ?? null;
  const secondaryProjects = projects.slice(1, 3);

  return (
    <main className="flex min-h-svh flex-col">
      <JsonLd data={breadcrumbListSchema([{ name: "Home", url: "/" }])} />

      {/* Hero — trust claim + CTAs */}
      <section className="flex min-h-svh flex-col justify-center px-6 py-24 lg:px-16 lg:py-32">
        <div className="mx-auto w-full max-w-3xl space-y-10">
          <div className="space-y-6">
            <h1
              data-testid="homepage-trust-claim"
              className="font-serif text-5xl leading-[1.05] tracking-tight text-foreground lg:text-6xl"
            >
              Production-minded software engineering, built to stay maintainable
              after launch.
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground lg:text-lg">
              I build full-stack and mobile products with tests, Dockerized
              environments, CI/CD, architecture decisions, and transparent
              delivery.
            </p>
          </div>

          <div
            data-testid="homepage-ctas"
            className="flex flex-wrap items-center gap-4"
          >
            <Button asChild size="lg" data-testid="homepage-cta-work-with-me">
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
      </section>

      {/* About — photo + bio */}
      <section className="border-t border-border px-6 py-16 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-start gap-8 md:flex-row md:gap-12">
            <div className="relative size-28 shrink-0 overflow-hidden rounded-lg md:size-32">
              <Image
                src="/bagtyyar_profile.jpg"
                alt="Bagtyyar Kovusov"
                fill
                sizes="(max-width: 768px) 112px, 128px"
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-4">
              <h2 className="font-serif text-3xl tracking-tight text-foreground">
                About
              </h2>
              <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
                <p>
                  I&rsquo;m Bagtyyar Kovusov. I think about what software
                  development and business look like in 2035 — and I build the
                  agentic systems to get us there.
                </p>
                <p>
                  As a solo engineer, I treat shipping speed and production
                  discipline as the same thing: better workflows, sharper
                  tooling, and a pipeline that doesn&rsquo;t cut corners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured work */}
      {flagshipProject && (
        <section className="border-t border-border px-6 py-16 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-3xl space-y-10">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl tracking-tight text-foreground">
                Featured work
              </h2>
              <p className="text-base text-muted-foreground">
                Projects built with the same discipline, shipped with evidence.
              </p>
            </div>

            <div className="space-y-10">
              <div data-testid="flagship-project">
                <ProjectCard project={flagshipProject} />
              </div>

              {secondaryProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Methodology teaser */}
      <section className="border-t border-border px-6 py-16 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="font-serif text-3xl tracking-tight text-foreground">
            How I work
          </h2>
          <div className="space-y-3 text-base leading-relaxed text-muted-foreground">
            <p>
              Every project I ship includes tests, Dockerized environments,
              CI/CD pipelines, and architecture decisions you can read. I
              don&rsquo;t just write code — I build systems that stay
              maintainable after I hand them off.
            </p>
            <p>
              Curious about the details? The engineering system behind this
              portfolio is fully transparent.
            </p>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link
              href="/engineering-system"
              className="inline-flex items-center gap-2"
            >
              Review My Engineering System
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="border-t border-border px-6 py-16 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h2 className="font-serif text-3xl tracking-tight text-foreground">
            Ready to build something that lasts?
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Let&rsquo;s talk about your project. I&rsquo;ll bring the
            discipline, you bring the vision.
          </p>
          <Button asChild size="lg">
            <Link href="/work-with-me">Work With Me</Link>
          </Button>
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
