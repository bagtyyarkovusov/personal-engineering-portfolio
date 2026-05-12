import { getPublishedPublicBuildLogEntries } from "@/features/build-logs/queries";
import { BuildLogList } from "@/features/build-logs/build-log-list";
import type { Metadata } from "next";
import { getStatusConfig, Status } from "@/design/statuses";
import { JsonLd, breadcrumbListSchema } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const entries = await getPublishedPublicBuildLogEntries();
  const lastModified = entries[0]?.occurredAt ?? new Date();

  return {
    title: "Build Log",
    description:
      "Active development rhythm and milestone progress for Bagtyyar's portfolio.",
    alternates: { canonical: "/build-log" },
    openGraph: {
      title: "Build Log | Bagtyyar",
      description:
        "Active development rhythm and milestone progress for Bagtyyar's portfolio.",
      images: [{ url: "/og-default.png", width: 1200, height: 630 }],
    },
    twitter: {
      title: "Build Log | Bagtyyar",
      description:
        "Active development rhythm and milestone progress for Bagtyyar's portfolio.",
      images: ["/og-default.png"],
    },
    other: { "article:modified_time": lastModified.toISOString() },
  };
}

export default async function BuildLogPage() {
  const inProgressConfig = getStatusConfig(Status.IN_PROGRESS);
  const entries = await getPublishedPublicBuildLogEntries();

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <JsonLd data={breadcrumbListSchema([{ name: "Home", url: "/" }, { name: "Build Log", url: "/build-log" }])} />
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-4xl tracking-tight">Build Log</h1>
          <span
            data-testid="build-log-status"
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${inProgressConfig.badgeClass}`}
          >
            {inProgressConfig.labelShort}
          </span>
        </div>
        <p className="text-muted-foreground">
          Active development rhythm and milestone progress — updated as the portfolio evolves.
        </p>
      </header>

      <BuildLogList entries={entries} showEmptyState />
    </main>
  );
}
