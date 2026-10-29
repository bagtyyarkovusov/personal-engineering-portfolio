import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { JsonLd, breadcrumbListSchema } from "@/components/seo/json-ld";
import { AnimateIn } from "@/components/animation/animate-in";
import { PUBLIC_DEMO_ROOM_PATH } from "@/lib/demo-room";

const PILLARS = [
  {
    title: "Tests",
    body: "Vitest covers the business logic and Playwright covers the public pages, admin login and client rooms. TypeScript runs in strict mode, so type errors fail the build.",
  },
  {
    title: "Docker",
    body: "The database, the app and the CI steps all run in Docker. One command starts the full stack locally, and Railway deploys the same multi-stage image to production.",
  },
  {
    title: "CI/CD",
    body: "GitHub Actions checks the schema, migrations, seed, types, unit tests, build, Docker image, end-to-end flows and accessibility on every pull request. Railway deploys main only after all of it passes.",
  },
  {
    title: "Code structure",
    body: "Business logic lives in feature modules, not in page files. Pages stay thin, so a change happens in one tested place.",
  },
  {
    title: "Written decisions",
    body: "Each significant technical decision gets a short written record: the context, the choice and the trade-offs. The next engineer can see why the code looks the way it does.",
  },
  {
    title: "Progress updates",
    body: "My larger projects have public milestones and a dated build log. Clients can also get a private link to their own project's milestones and updates.",
  },
];

const DESCRIPTION = "How I test, deploy and document the software I build.";
const OG_IMAGE = `/og?title=${encodeURIComponent("Engineering System | Bagtyyar")}&description=${encodeURIComponent(DESCRIPTION)}`;

export const metadata: Metadata = {
  title: "Engineering System",
  description: DESCRIPTION,
  alternates: { canonical: "/engineering-system" },
  openGraph: {
    title: "Engineering System | Bagtyyar",
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Engineering System | Bagtyyar" }],
  },
  twitter: {
    title: "Engineering System | Bagtyyar",
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default async function EngineeringSystemPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <JsonLd data={breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Engineering System", url: "/engineering-system" }])} />
      <AnimateIn animation="fade-up" duration={700}>
        <header className="space-y-2">
          <h1 className="font-serif text-4xl tracking-tight">
            Engineering System
          </h1>
        </header>
      </AnimateIn>

      <section className="space-y-6">
        <div className="grid gap-4">
          {PILLARS.map((pillar, index) => (
            <AnimateIn key={pillar.title} animation="fade-up" duration={700} delay={150 + index * 80}>
              <div className="rounded-lg border border-border bg-card p-6 space-y-3 transition-all duration-300 ease-[var(--ease-out-quart)] hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-sm">
                <h2 className="font-medium text-card-foreground">
                  {pillar.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <section>
          <p className="text-sm">
            <Link
              href={PUBLIC_DEMO_ROOM_PATH}
              className="inline-flex items-center gap-1.5 text-primary underline-offset-4 transition-colors hover:underline"
            >
              <Lock className="size-3.5 shrink-0" aria-hidden="true" />
              View a sample client room
            </Link>
          </p>
        </section>
      </AnimateIn>
    </main>
  );
}
