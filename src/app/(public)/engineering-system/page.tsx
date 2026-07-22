import type { Metadata } from "next";
import Link from "next/link";
import { renderMarkdown } from "@/lib/markdown/renderer";
import { MarkdownContent } from "@/components/ui/markdown-content";
import { getStatusConfig, Status } from "@/design/statuses";
import { JsonLd, breadcrumbListSchema } from "@/components/seo/json-ld";
import { AnimateIn } from "@/components/animation/animate-in";

const PILLARS = [
  {
    title: "Testing Discipline",
    status: Status.VERIFIED,
    body: "Every project includes unit, integration, and end-to-end tests. TypeScript strict mode catches type-level regressions at build time. Vitest runs fast feedback on business logic, and Playwright smoke tests verify the public, admin, and private-room flows from the user's perspective.",
  },
  {
    title: "Dockerized Environments",
    status: Status.VERIFIED,
    body: "All services run in Docker — the database, the application, and CI steps. A single `docker compose up` starts a production-like environment with zero manual setup. The Dockerfile is multi-stage, producing the same image that Railway deploys to production.",
  },
  {
    title: "CI/CD Pipeline",
    status: Status.VERIFIED,
    body: "GitHub Actions is the quality gate: Prisma validation, migration checks, seed verification, typechecking, unit tests, production build, Docker build, smoke tests, private-room checks, and accessibility scans. Railway deploys the Dockerized Next.js standalone app from main after the gate passes.",
  },
  {
    title: "Maintainable Architecture",
    status: Status.VERIFIED,
    body: "The codebase uses feature-first organization with thin routes. Business logic lives in `src/features/*` or `src/lib/*`, not inside page files. Next.js App Router pages compose tested feature modules, keeping the surface area small and the behavior easy to change.",
  },
  {
    title: "Architecture Decision Records",
    status: Status.VERIFIED,
    body: "Every significant technical decision is documented as an ADR in `docs/adr/`. Each record describes the context, the decision, and the trade-offs — so a new engineer (or my future self) can understand why the system is shaped the way it is, not just what was built.",
  },
  {
    title: "Milestone Tracking",
    status: Status.IN_PROGRESS,
    body: "Projects ship in visible milestones — completed, current, and upcoming work is public. The Build Log captures dated progress updates, and private client rooms expose curated milestone views so clients always know where their project stands.",
  },
];

export const metadata: Metadata = {
  title: "Engineering System",
  description:
    "The repeatable engineering system behind every Bagtyyar project — testing, Docker, CI/CD, architecture decisions, and transparent milestone reporting.",
  alternates: { canonical: "/engineering-system" },
  openGraph: {
    title: "Engineering System | Bagtyyar",
    description:
      "The repeatable engineering system behind every Bagtyyar project — testing, Docker, CI/CD, architecture decisions, and transparent milestone reporting.",
    images: [{ url: "/og?title=Engineering%20System%20%7C%20Bagtyyar&description=The%20repeatable%20engineering%20system%20behind%20every%20Bagtyyar%20project%20%E2%80%94%20testing%2C%20Docker%2C%20CI%2FCD%2C%20architecture%20decisions%2C%20and%20transparent%20milestone%20reporting.", width: 1200, height: 630, alt: "Engineering System | Bagtyyar" }],
  },
  twitter: {
    title: "Engineering System | Bagtyyar",
    description:
      "The repeatable engineering system behind every Bagtyyar project — testing, Docker, CI/CD, architecture decisions, and transparent milestone reporting.",
    images: ["/og?title=Engineering%20System%20%7C%20Bagtyyar&description=The%20repeatable%20engineering%20system%20behind%20every%20Bagtyyar%20project%20%E2%80%94%20testing%2C%20Docker%2C%20CI%2FCD%2C%20architecture%20decisions%2C%20and%20transparent%20milestone%20reporting."],
  },
};

export default async function EngineeringSystemPage() {
  const overviewHtml = await renderMarkdown(
    "The differentiator is not feature delivery — it is **how** the work is delivered. This page describes the repeatable engineering system behind every project in this portfolio: testing, Docker, CI/CD, architecture decisions, Railway deployment, migration discipline, and transparent milestone reporting."
  );

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <JsonLd data={breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Engineering System", url: "/engineering-system" }])} />
      <AnimateIn animation="fade-up" duration={700}>
        <header className="space-y-2">
          <h1 className="font-serif text-4xl tracking-tight">
            Engineering System
          </h1>
          <p className="text-muted-foreground">
            How Bagtyyar builds and ships software with production-minded
            discipline.
          </p>
        </header>
      </AnimateIn>

      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <section className="space-y-4">
          <MarkdownContent html={overviewHtml} />
        </section>
      </AnimateIn>

      <section className="space-y-6">
        <AnimateIn animation="fade-up" duration={700} delay={100}>
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            Delivery Pillars
          </h2>
        </AnimateIn>

        <div className="grid gap-4">
          {PILLARS.map((pillar, index) => (
            <AnimateIn key={pillar.title} animation="fade-up" duration={700} delay={150 + index * 80}>
              <div className="rounded-lg border border-border bg-card p-6 space-y-3 transition-all duration-300 ease-[var(--ease-out-quart)] hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-medium text-card-foreground">
                    {pillar.title}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusConfig(pillar.status).badgeClass}`}
                  >
                    {getStatusConfig(pillar.status).labelShort}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <section className="rounded-lg border border-border bg-card p-6 space-y-3">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            Railway pipeline
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Production runs on Railway as a Docker container. The app uses
            Next.js standalone output, Railway-managed PostgreSQL, and runtime
            environment variables for secrets and canonical URLs. On startup,
            the container runs <code className="font-mono text-xs">prisma migrate deploy</code>{" "}
            before <code className="font-mono text-xs">node server.js</code>, so
            schema changes follow the same migration path in CI and production.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The current production domain is <code className="font-mono text-xs">bagtyyar.dev</code>.
            Railway owns deployment and runtime hosting; GitHub Actions owns
            the quality gate before code reaches main.
          </p>
        </section>
      </AnimateIn>

      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <section className="rounded-lg border border-border bg-card p-6 space-y-3">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            See it in action
          </h2>
          <p className="text-sm text-muted-foreground">
            The{" "}
            <Link
              href="/work"
              className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
            >
              Work
            </Link>{" "}
            page shows live projects built with this system. The{" "}
            <Link
              href="/build-log"
              className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
            >
              Build Log
            </Link>{" "}
            tracks active development as it happens.
          </p>
        </section>
      </AnimateIn>
    </main>
  );
}
