import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GitCommitHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/features/projects/project-card";
import { getPublishedPublicProjects } from "@/features/projects/queries";
import { getLatestPublicBuildLogEntry } from "@/features/build-logs/queries";
import { formatPostDate, getPublishedPosts } from "@/content/blog/loader";
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
  const [projects, latestBuildLogEntry] = await Promise.all([
    getPublishedPublicProjects(),
    getLatestPublicBuildLogEntry(),
  ]);
  const flagshipProject = projects[0] ?? null;
  const secondaryProjects = projects.slice(1, 3);
  const latestPosts = getPublishedPosts().slice(0, 2);

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
                Web apps and AI features, engineered to survive production —
                not just the demo.
              </h1>
            </AnimateIn>
            <AnimateIn animation="fade-up" duration={700} delay={300}>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground lg:text-lg">
                I&apos;m a full-stack Next.js engineer for hire. I ship with
                tests, Docker, CI/CD, and honest progress tracking — and I can
                prove it: live client sites, public repositories, and a
                192-GPU AI inference deployment behind me.
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

          {/* Proof strip — verifiable evidence for buyers */}
          <AnimateIn animation="fade-up" duration={700} delay={500}>
            <dl
              data-testid="homepage-proof-strip"
              className="grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-3"
            >
              <div className="space-y-1">
                <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Live client work
                </dt>
                <dd className="text-sm text-foreground">
                  Bilingual healthcare platform serving patients in Athens
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  AI infrastructure
                </dt>
                <dd className="text-sm text-foreground">
                  24-node / 192-GPU inference cluster deployed &amp; supported
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Open by default
                </dt>
                <dd className="text-sm text-foreground">
                  Public repos, 141 tests, and CI gates you can inspect
                </dd>
              </div>
            </dl>
          </AnimateIn>

          {/* Now signal — latest build-log activity as proof of current work */}
          {latestBuildLogEntry && (
            <AnimateIn animation="fade-up" duration={700} delay={600}>
              <Link
                href="/build-log"
                data-testid="homepage-now-signal"
                className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <GitCommitHorizontal className="size-3.5 text-primary" />
                <span>
                  Last shipped ·{" "}
                  {new Date(latestBuildLogEntry.occurredAt).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "short", day: "numeric" },
                  )}{" "}
                  · {latestBuildLogEntry.project.title} —{" "}
                  {latestBuildLogEntry.title}
                </span>
              </Link>
            </AnimateIn>
          )}
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
                  I&rsquo;m Bagtyyar Kovusov. I build the kind of software
                  that&rsquo;s still maintainable a year after launch — and I
                  work in the open so you never have to take that on faith.
                </p>
              </AnimateIn>
              <AnimateIn animation="fade-up" duration={700} delay={300}>
                <p className="text-base leading-relaxed text-muted-foreground">
                  As a solo engineer, I treat shipping speed and production
                  discipline as the same thing: better workflows, sharper
                  tooling, and a pipeline that doesn&rsquo;t cut corners. You
                  get direct communication with the person writing your code —
                  no account managers, no handoffs.
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

            <AnimateIn animation="fade-up" duration={700} delay={400}>
              <Button asChild variant="outline" size="lg">
                <Link
                  href="/work"
                  data-testid="homepage-cta-view-all-work"
                  className="inline-flex items-center gap-2"
                >
                  View all projects
                  <ArrowRight className="size-4 text-primary" />
                </Link>
              </Button>
            </AnimateIn>
          </div>
        </section>
      )}

      {/* Latest writing */}
      {latestPosts.length > 0 && (
        <section className="border-t border-border px-6 py-16 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-3xl space-y-10">
            <AnimateIn animation="fade-up" duration={700}>
              <div className="space-y-2">
                <h2 className="font-serif text-3xl tracking-tight text-foreground">
                  Latest writing
                </h2>
                <p className="text-base text-muted-foreground">
                  Engineering notes on process, discipline, and shipping.
                </p>
              </div>
            </AnimateIn>

            <ul className="flex flex-col">
              {latestPosts.map((post, index) => (
                <li key={post.slug}>
                  <AnimateIn
                    animation="fade-up"
                    duration={700}
                    delay={100 + index * 100}
                  >
                    <div className="border-t border-border py-6">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group block transition-colors duration-200"
                      >
                        <h3 className="font-serif text-2xl tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {formatPostDate(post.date)}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {post.description}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                      >
                        Read
                        <ArrowRight className="size-4 text-primary transition-colors" />
                      </Link>
                    </div>
                  </AnimateIn>
                </li>
              ))}
            </ul>
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

    </main>
  );
}
