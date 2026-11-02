import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd, breadcrumbListSchema } from "@/components/seo/json-ld";
import { AnimateIn } from "@/components/animation/animate-in";
import { ProjectVideo } from "@/components/media/project-video";
import { HireCta } from "@/components/layout/hire-cta";

const WORKFLOW_STEPS = [
  {
    title: "A ticket first",
    body: "Every task starts as a ticket with acceptance criteria, so we agree on done before any code.",
  },
  {
    title: "A prototype before UI",
    body: "Screens get a clickable prototype you can react to before I build them for real.",
  },
  {
    title: "Gates before merge",
    body: "Nothing merges without type checks, passing tests and my own review. I use AI coding agents every day, inside these gates.",
  },
];

const DESCRIPTION =
  "About Bagtyyar Kowusow, a full-stack engineer who builds web and mobile apps.";
const OG_IMAGE = `/og?title=${encodeURIComponent("About | Bagtyyar")}&description=${encodeURIComponent(DESCRIPTION)}`;

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Bagtyyar",
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "About | Bagtyyar" }],
  },
  twitter: {
    title: "About | Bagtyyar",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-16 px-6 py-16 lg:px-8 lg:py-24">
      <JsonLd data={breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "About", url: "/about" }])} />
      {/* Page title */}
      <AnimateIn animation="fade-up" duration={700}>
        <header className="space-y-3">
          <h1 className="font-serif text-4xl tracking-tight text-foreground lg:text-5xl">
            About
          </h1>
        </header>
      </AnimateIn>

      {/* Intro */}
      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <section className="grid gap-8 sm:grid-cols-[13rem_1fr] sm:items-start">
          <Image
            src="/bagtyyar_profile.jpg"
            alt="Bagtyyar Kowusow"
            width={1179}
            height={1546}
            preload
            sizes="(min-width: 640px) 208px, 60vw"
            className="aspect-[4/5] h-auto w-3/5 rounded-xl border border-border object-cover object-top sm:w-full"
          />
          <div className="space-y-4">
            <h2 className="font-serif text-2xl tracking-tight text-foreground">
              Who I am
            </h2>
            <p className="leading-relaxed text-foreground">
              I&apos;m Bagtyyar Kowusow, a full-stack engineer. I build mobile apps,
              web apps and the APIs behind them, mostly in TypeScript with React
              Native, Next.js and NestJS. My projects have tests, run in Docker
              and deploy through CI.{" "}
              <Link
                href="/engineering-system"
                className="text-primary underline underline-offset-4 transition-colors hover:text-muted-foreground"
              >
                Here&apos;s how.
              </Link>
            </p>
            <p className="leading-relaxed text-muted-foreground">
              I&apos;m based in China and work remotely. My day overlaps with
              European and Asian working hours.
            </p>
          </div>
        </section>
      </AnimateIn>

      <ProjectVideo videoKey="intro" />

      {/* How I work */}
      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <section aria-labelledby="how-i-work" className="space-y-6">
          <h2
            id="how-i-work"
            className="font-serif text-2xl tracking-tight text-foreground"
          >
            How I work
          </h2>
          <ol className="divide-y divide-border border-y border-border">
            {WORKFLOW_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-6"
              >
                <span className="font-mono text-xs text-muted-foreground sm:w-8 sm:pt-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="space-y-1 sm:flex-1">
                  <h3 className="text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </AnimateIn>

      {/* Work I take on */}
      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <section className="space-y-6">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            Work I take on
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
                Logistics and delivery apps
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                Adding AI to an existing product
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 inline-block size-1.5 rounded-full bg-primary" />
              <span className="text-foreground">
                Running LLMs on your own servers
              </span>
            </li>
          </ul>
          <HireCta className="pt-2" />
        </section>
      </AnimateIn>
    </main>
  );
}
