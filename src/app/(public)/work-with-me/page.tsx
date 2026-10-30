import type { Metadata } from "next";
import Link from "next/link";
import { Eye } from "lucide-react";
import { JsonLd, breadcrumbListSchema } from "@/components/seo/json-ld";
import { AnimateIn } from "@/components/animation/animate-in";
import { AvailabilityBadge } from "@/components/ui/availability-badge";
import { ContactForm } from "@/features/contact/contact-form";
import { Testimonials, type TestimonialQuote } from "@/components/testimonials";
import { PUBLIC_DEMO_ROOM_PATH } from "@/lib/demo-room";

const DESCRIPTION =
  "Hire Bagtyyar Kowusow for web and mobile projects. I reply within one business day.";
const OG_IMAGE = `/og?title=${encodeURIComponent("Work With Me | Bagtyyar")}&description=${encodeURIComponent(DESCRIPTION)}`;

export const metadata: Metadata = {
  title: "Work With Me",
  description: DESCRIPTION,
  alternates: { canonical: "/work-with-me" },
  openGraph: {
    title: "Work With Me | Bagtyyar",
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Work With Me | Bagtyyar" }],
  },
  twitter: {
    title: "Work With Me | Bagtyyar",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function WorkWithMePage() {
  const testimonials: TestimonialQuote[] = [];

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
            Tell me what you&apos;re building. I reply within one business day.
          </p>
          <AvailabilityBadge />
        </header>
      </AnimateIn>

      {/* Verifiable proof */}
      <AnimateIn animation="fade-up" duration={700} delay={50}>
        <section className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            Recent work
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                <Link href="/work/car-marketplace" className="text-primary underline underline-offset-4 hover:text-muted-foreground">
                  Carberk
                </Link>
                , a car marketplace live on Google Play.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                <a
                  href="https://myorl.up.railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4 hover:text-muted-foreground"
                >
                  MyORL
                </a>
                , a bilingual website for an ENT clinic in Athens. Live.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                A 24-server, 192-GPU{" "}
                <Link
                  href="/work/gonka-ai-inference-infrastructure"
                  className="text-primary underline underline-offset-4 hover:text-muted-foreground"
                >
                  inference cluster
                </Link>{" "}
                I specified and deployed for a Gonka network host, plus an
                OpenAI-compatible API gateway I open-sourced.
              </span>
            </li>
          </ul>
          <p className="text-sm">
            <Link
              href={PUBLIC_DEMO_ROOM_PATH}
              className="inline-flex items-center gap-1.5 text-primary underline-offset-4 transition-colors hover:underline"
            >
              <Eye className="size-3.5 shrink-0" aria-hidden="true" />
              View a sample client room
            </Link>
          </p>
        </section>
      </AnimateIn>

      {/* Testimonials — hidden until real quotes are collected */}
      <Testimonials quotes={testimonials} />

      {/* Engagement paths */}
      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <section className="space-y-6">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            Ways to hire me
          </h2>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-foreground">Option</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">What it covers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Fixed-scope project</td>
                  <td className="px-4 py-3 text-muted-foreground">An MVP, a feature or a rewrite</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Code review</td>
                  <td className="px-4 py-3 text-muted-foreground">A review of your codebase with a written plan</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Ongoing work</td>
                  <td className="px-4 py-3 text-muted-foreground">Continued development, billed by milestone</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Full-time contract</td>
                  <td className="px-4 py-3 text-muted-foreground">Joining your team</td>
                </tr>
              </tbody>
            </table>
          </div>
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
                You built a prototype with AI tools and it needs tests and a
                deploy pipeline before real users touch it
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                Your MVP got hard to change and needs a rewrite
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                You need one engineer for your mobile app and its backend
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                You need an LLM added to an existing product
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
            The first call covers scope, timeline and fit. If we go ahead, you
            can follow milestones and updates in a private project room.
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
          </div>
          <ContactForm />
        </section>
      </AnimateIn>
    </main>
  );
}
