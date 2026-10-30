import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbListSchema } from "@/components/seo/json-ld";
import { AnimateIn } from "@/components/animation/animate-in";

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
        <section className="space-y-4">
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
        </section>
      </AnimateIn>
    </main>
  );
}
