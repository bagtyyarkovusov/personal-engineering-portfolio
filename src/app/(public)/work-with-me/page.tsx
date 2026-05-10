import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export const metadata = {
  title: "Work With Me — Bagtyyar",
};

export default function WorkWithMePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-16 px-6 py-16 lg:px-8 lg:py-24">
      {/* Page title */}
      <header className="space-y-3">
        <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl">
          Work With Me
        </h1>
        <p className="text-lg text-muted-foreground">
          Start a hiring conversation or project inquiry.
        </p>
      </header>

      {/* Engagement paths */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          How to engage
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Hiring</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              I am open to full-time and contract engineering roles where
              production discipline and long-term maintainability matter.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Project collaboration</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              I lead new product builds from architecture to deployment. If you
              need a product engineer who treats testing and CI/CD as table
              stakes, we should talk.
            </p>
          </div>
        </div>
      </section>

      {/* Best-fit reminder */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          Best-fit work
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
            <span className="text-foreground">
              SaaS and B2B web and mobile applications
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
            <span className="text-foreground">
              Logistics, cargo tracking, and export-regulation-adjacent workflows
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

      {/* What to expect */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          What to expect
        </h2>
        <p className="leading-relaxed text-foreground">
          The first conversation is about scope, timeline, and whether we are a
          good fit. I do not pitch frameworks or promise features before
          understanding the problem. If we move forward, you will see
          milestones, architecture decisions, and transparent delivery from day
          one.
        </p>
      </section>

      {/* Contact action */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          Get in touch
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Send me an email with a short description of what you are building or
          hiring for. I typically respond within one business day.
        </p>
        <a
          href="mailto:injqqcj6963@hotmail.com?subject=Project%20or%20hiring%20inquiry"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Mail className="size-4" />
          Send an email
        </a>
      </section>

      {/* Bottom link row */}
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
            href="/about"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            Read about how I work
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </footer>
    </main>
  );
}
