import { getPublishedPublicBuildLogEntries } from "@/features/build-logs/queries";
import { BuildLogList } from "@/features/build-logs/build-log-list";
import { AnimateIn } from "@/components/animation/animate-in";
import type { Metadata } from "next";
import { JsonLd, breadcrumbListSchema } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";

const DESCRIPTION = "Dated updates from the projects I'm building.";
const OG_IMAGE = `/og?title=${encodeURIComponent("Build Log | Bagtyyar")}&description=${encodeURIComponent(DESCRIPTION)}`;

export async function generateMetadata(): Promise<Metadata> {
  const entries = await getPublishedPublicBuildLogEntries();
  const lastModified = entries[0]?.occurredAt ?? new Date();

  return {
    title: "Build Log",
    description: DESCRIPTION,
    alternates: { canonical: "/build-log" },
    openGraph: {
      title: "Build Log | Bagtyyar",
      description: DESCRIPTION,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Build Log | Bagtyyar" }],
    },
    twitter: {
      title: "Build Log | Bagtyyar",
      description: DESCRIPTION,
      images: [OG_IMAGE],
    },
    other: { "article:modified_time": lastModified.toISOString() },
  };
}

export default async function BuildLogPage() {
  const entries = await getPublishedPublicBuildLogEntries();

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <JsonLd data={breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Build Log", url: "/build-log" }])} />
      <AnimateIn animation="fade-up" duration={700}>
        <header className="space-y-3">
          <h1 className="font-serif text-4xl tracking-tight">Build Log</h1>
        </header>
      </AnimateIn>

      <BuildLogList entries={entries} showEmptyState />
    </main>
  );
}
