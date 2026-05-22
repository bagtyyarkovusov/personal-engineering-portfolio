import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/features/projects/project-card";
import { getPublishedPublicProjects } from "@/features/projects/queries";
import { SocialFooter } from "@/components/layout/social-footer";
import { AnimateIn } from "@/components/animation/animate-in";
import { AvailabilityBadge } from "@/components/ui/availability-badge";

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
      <section className="section-hero flex min-h-svh flex-col justify-center px-6 py-24 lg:px-16 lg:py-32">
        <div className="mx-auto w-full max-w-3xl space-y-10">
          <div className="space-y-6">
            <AnimateIn animation="fade-up" duration={700} delay={100}>
              <AvailabilityBadge status="open" />
            </AnimateIn>
            <AnimateIn animation="fade-up" duration={700} delay={150}>
              <h1
                data-testid="homepage-trust-claim"
                className="font-serif text-5xl leading-[1.05] tracking-tight text-foreground lg:text-6xl"
              >
                Production-minded software engineering, built to stay maintainable
                after launch.
              </h1>
            </AnimateIn>
            <AnimateIn animation="fade-up" duration={700} delay={300}>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground lg:text-lg">
                I build full-stack and mobile products with tests, Dockerized
                environments, CI/CD, architecture decisions, and transparent
                delivery.
              </p>
            </AnimateIn>
          </div>

          <AnimateIn animation="fade-up" duration={700} delay={400}>
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
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  Review My Engineering System
                  <ArrowRight className="size-4 text-primary transition-colors" />
                </Link>
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* About — photo + bio */}
      <section className="section-warm border-t border-border px-6 py-16 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
            <AnimateIn animation="scale-in" duration={700}>
              <div className="relative size-40 shrink-0 overflow-hidden rounded-lg md:size-56">
                <Image
                  src="/bagtyyar_profile.jpg"
                  alt="Bagtyyar Kovusov"
                  fill
                  sizes="(max-width: 768px) 160px, 224px"
                  className="object-cover transition-transform duration-500 ease-[var(--ease-out-quart)] hover:scale-105"
                />
              </div>
            </AnimateIn>
            <div className="space-y-5">
              <AnimateIn animation="fade-up" duration={700} delay={150}>
                <p className="font-serif text-2xl leading-relaxed text-foreground md:text-3xl">
                  I&rsquo;m Bagtyyar Kovusov. I think about what software
                  development and business look like in 2035 — and I build the
                  agentic systems to get us there.
                </p>
              </AnimateIn>
              <AnimateIn animation="fade-up" duration={700} delay={300}>
                <p className="text-base leading-relaxed text-muted-foreground">
                  As a solo engineer, I treat shipping speed and production
                  discipline as the same thing: better workflows, sharper
                  tooling, and a pipeline that doesn&rsquo;t cut corners.
                </p>
              </AnimateIn>
            </div>
          </div>
        </div>
      </section>

      {/* Featured work */}
      {flagshipProject && (
        <section className="section-cool border-t border-border px-6 py-16 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-3xl space-y-10">
            <AnimateIn animation="fade-up" duration={700}>
              <div className="space-y-2">
                <h2 className="font-serif text-3xl tracking-tight text-foreground">
                  Featured work
                </h2>
                <p className="text-base text-muted-foreground">
                  Projects built with the same discipline, shipped with evidence.
                </p>
              </div>
            </AnimateIn>

            <div className="space-y-10">
              <AnimateIn animation="fade-up" duration={700} delay={100}>
                <div data-testid="flagship-project">
                  <ProjectCard project={flagshipProject} />
                </div>
              </AnimateIn>

              {secondaryProjects.map((project, index) => (
                <AnimateIn
                  key={project.id}
                  animation="fade-up"
                  duration={700}
                  delay={200 + index * 100}
                >
                  <ProjectCard project={project} />
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Methodology teaser */}
      <section className="border-t border-border px-6 py-16 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-3xl space-y-6">
          <AnimateIn animation="fade-up" duration={700}>
            <h2 className="font-serif text-3xl tracking-tight text-foreground">
              How I work
            </h2>
          </AnimateIn>
          <AnimateIn animation="fade-up" duration={700} delay={150}>
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
          </AnimateIn>
          <AnimateIn animation="fade-up" duration={700} delay={300}>
            <Button asChild variant="outline" size="lg">
              <Link
                href="/engineering-system"
                className="inline-flex items-center gap-2"
              >
                Review My Engineering System
                <ArrowRight className="size-4 text-primary" />
              </Link>
            </Button>
          </AnimateIn>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="section-primary-tint border-t border-border px-6 py-16 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <AnimateIn animation="fade-up" duration={700}>
            <h2 className="font-serif text-3xl tracking-tight text-foreground">
              Ready to build something that lasts?
            </h2>
          </AnimateIn>
          <AnimateIn animation="fade-up" duration={700} delay={150}>
            <p className="text-base leading-relaxed text-muted-foreground">
              Let&rsquo;s talk about your project. I&rsquo;ll bring the
              discipline, you bring the vision.
            </p>
          </AnimateIn>
          <AnimateIn animation="fade-up" duration={700} delay={300}>
            <Button asChild size="lg">
              <Link href="/work-with-me">Work With Me</Link>
            </Button>
          </AnimateIn>
        </div>
      </section>

      <SocialFooter />
    </main>
  );
}
