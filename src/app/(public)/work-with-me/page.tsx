import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { JsonLd, breadcrumbListSchema } from "@/components/seo/json-ld";
import { AnimateIn } from "@/components/animation/animate-in";
import { AvailabilityBadge } from "@/components/ui/availability-badge";
import { ContactForm } from "@/features/contact/contact-form";

export const metadata: Metadata = {
  title: "Work With Me",
  description:
    "Start a hiring conversation or project inquiry with Bagtyyar. Full-stack and mobile product engineering with production-minded discipline.",
  alternates: { canonical: "/work-with-me" },
  openGraph: {
    title: "Work With Me | Bagtyyar",
    description:
      "Start a hiring conversation or project inquiry with Bagtyyar. Full-stack and mobile product engineering with production-minded discipline.",
    images: [{ url: "/og?title=Work%20With%20Me%20%7C%20Bagtyyar&description=Start%20a%20hiring%20conversation%20or%20project%20inquiry%20with%20Bagtyyar.%20Full-stack%20and%20mobile%20product%20engineering%20with%20production-minded%20discipline.", width: 1200, height: 630, alt: "Work With Me | Bagtyyar" }],
  },
  twitter: {
    title: "Work With Me | Bagtyyar",
    description:
      "Start a hiring conversation or project inquiry with Bagtyyar. Full-stack and mobile product engineering with production-minded discipline.",
    images: ["/og?title=Work%20With%20Me%20%7C%20Bagtyyar&description=Start%20a%20hiring%20conversation%20or%20project%20inquiry%20with%20Bagtyyar.%20Full-stack%20and%20mobile%20product%20engineering%20with%20production-minded%20discipline."],
  },
};

export default function WorkWithMePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-16 px-6 py-16 lg:px-8 lg:py-24">
      <JsonLd data={breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Work With Me", url: "/work-with-me" }])} />
      {/* Page title */}
      <AnimateIn animation="fade-up" duration={700}>
        <header className="space-y-4">
          <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl">
            Work With Me
          </h1>
          <p className="text-lg text-muted-foreground">
            Start a hiring conversation or project inquiry.
          </p>
          <AvailabilityBadge status="open" />
        </header>
      </AnimateIn>

      {/* Engagement paths */}
      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <section className="space-y-6">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            How to engage
          </h2>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-foreground">Engagement</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">Best For</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Project Sprint</td>
                  <td className="px-4 py-3 text-muted-foreground">MVP, major feature, or rewrite slice</td>
                  <td className="px-4 py-3 text-muted-foreground">Scoped after discovery</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Technical Audit</td>
                  <td className="px-4 py-3 text-muted-foreground">Codebase review + roadmap</td>
                  <td className="px-4 py-3 text-muted-foreground">Short, focused engagement</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Delivery Partnership</td>
                  <td className="px-4 py-3 text-muted-foreground">Ongoing product engineering and architecture</td>
                  <td className="px-4 py-3 text-muted-foreground">Milestone-based</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Full-time Contract</td>
                  <td className="px-4 py-3 text-muted-foreground">Deep embedded work</td>
                  <td className="px-4 py-3 text-muted-foreground">Based on role and scope</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            I scope each engagement around the work, risk, timeline, and level of ownership required.
          </p>
        </section>
      </AnimateIn>

      {/* Problems I solve */}
      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <section className="space-y-6">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            Problems I solve
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                You have an MVP that became unmaintainable and needs a disciplined rewrite
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                You need to ship a React Native app without hiring five mobile engineers
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                You want Docker + CI/CD but do not know where to start
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                You need to deploy in air-gapped or restricted environments
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                You need AI integrated into an existing system with production-grade reliability
              </span>
            </li>
          </ul>
        </section>
      </AnimateIn>

      {/* Best-fit reminder */}
      <AnimateIn animation="fade-up" duration={700} delay={100}>
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
      </AnimateIn>

      {/* What to expect */}
      <AnimateIn animation="fade-up" duration={700} delay={100}>
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
      </AnimateIn>

      {/* Contact form */}
      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl tracking-tight text-foreground">
              Get in touch
            </h2>
            <p className="text-muted-foreground">
              Send me a message with a short description of what you are building or
              hiring for. I typically respond within one business day.
            </p>
          </div>
          <ContactForm />
          <p className="text-center text-xs text-muted-foreground">
            Prefer email?{" "}
            <a
              href="mailto:contact@bagtyyar.dev?subject=Project%20or%20hiring%20inquiry"
              className="text-primary hover:underline"
            >
              contact@bagtyyar.dev
            </a>
          </p>
        </section>
      </AnimateIn>

      {/* Bottom link row */}
      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <footer className="border-t border-border pt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Review my work
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Read about how I work
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </footer>
      </AnimateIn>
    </main>
  );
}
