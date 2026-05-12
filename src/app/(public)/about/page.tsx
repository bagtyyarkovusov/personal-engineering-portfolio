import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Bagtyyar works — maintainability-first engineering, transparent delivery, and what to expect from a production-minded software engineer.",
  openGraph: {
    title: "About | Bagtyyar",
    description:
      "How Bagtyyar works — maintainability-first engineering, transparent delivery, and what to expect from a production-minded software engineer.",
    images: [{ url: "/og?title=About%20%7C%20Bagtyyar&description=How%20Bagtyyar%20works%20%E2%80%94%20maintainability-first%20engineering%2C%20transparent%20delivery%2C%20and%20what%20to%20expect%20from%20a%20production-minded%20software%20engineer.", width: 1200, height: 630, alt: "About | Bagtyyar" }],
  },
  twitter: {
    title: "About | Bagtyyar",
    description:
      "How Bagtyyar works — maintainability-first engineering, transparent delivery, and what to expect from a production-minded software engineer.",
    images: ["/og?title=About%20%7C%20Bagtyyar&description=How%20Bagtyyar%20works%20%E2%80%94%20maintainability-first%20engineering%2C%20transparent%20delivery%2C%20and%20what%20to%20expect%20from%20a%20production-minded%20software%20engineer."],
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-16 px-6 py-16 lg:px-8 lg:py-24">
      {/* Page title */}
      <header className="space-y-3">
        <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl">
          About
        </h1>
        <p className="text-lg text-muted-foreground">
          How I work, why maintainability matters, and what you can expect.
        </p>
      </header>

      {/* Section 1: How I work */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          How I work
        </h2>
        <p className="leading-relaxed text-foreground">
          I build full-stack and mobile products with the discipline of a team
          that plans to stay maintainable. That means{" "}
          <Link
            href="/engineering-system"
            className="text-primary underline underline-offset-4 transition-colors hover:text-foreground"
          >
            tests, Dockerized environments, CI/CD, architecture decisions, and
            transparent delivery
          </Link>{" "}
          — even on solo projects. I do this not because it is overhead, but
          because I have seen what happens when it is skipped.
        </p>
      </section>

      {/* Section 2: Why maintainability matters */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          Why maintainability matters
        </h2>
        <p className="leading-relaxed text-foreground">
          Software often becomes expensive and fragile when the original
          developer leaves and the next person has to guess at intent. I have
          taken over enough projects to know that the real cost is not the
          initial build — it is the handoff. I optimize for the engineer who
          will work on this after me, whether that is a client’s team, a future
          collaborator, or myself in six months.
        </p>
      </section>

      {/* Section 3: What you can expect */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          What you can expect
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="font-medium text-foreground">Reliability</dt>
            <dd className="text-sm text-muted-foreground">
              I do not promise what I cannot deliver.
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-foreground">Transparency</dt>
            <dd className="text-sm text-muted-foreground">
              Milestones, decisions, and blockages are visible.
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-foreground">
              Maintainable systems
            </dt>
            <dd className="text-sm text-muted-foreground">
              Code that another engineer can continue.
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="font-medium text-foreground">Delivery discipline</dt>
            <dd className="text-sm text-muted-foreground">
              Scope is managed, not silently expanded.
            </dd>
          </div>
        </dl>
      </section>

      {/* Section 4: Best-fit projects */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          Best-fit projects
        </h2>
        <p className="leading-relaxed text-foreground">
          The projects that work best with me:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
            <span className="text-foreground">
              Collaborative product builds where engineering decisions matter
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
            <span className="text-foreground">
              SaaS and B2B web and mobile applications
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
            <span className="text-foreground">
              Logistics, cargo tracking, and export-regulation-adjacent
              workflows
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
            <span className="text-foreground">
              AI integration into existing systems
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
            <span className="text-foreground">
              Local AI deployment for privacy-sensitive use cases
            </span>
          </li>
        </ul>
      </section>

      {/* Section 5: How I scale */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          How I scale
        </h2>
        <p className="leading-relaxed text-foreground">
          I lead every project personally. When a project needs more capacity or
          a specialized skill, I bring in trusted collaborators and stay
          accountable for the engineering standard. The structure is
          agency-ready underneath, but the work is personal-led.
        </p>
      </section>

      {/* Section 6: Bottom link row */}
      <footer className="border-t border-border pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Review my work
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/engineering-system"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            See my engineering system
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </footer>
    </main>
  );
}
