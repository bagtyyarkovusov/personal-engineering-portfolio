import { getPublishedPublicBuildLogEntries } from "@/features/build-logs/queries";
import { BuildLogList } from "@/features/build-logs/build-log-list";
import type { Metadata } from "next";
import { getStatusConfig, Status } from "@/design/statuses";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Build Log",
  description:
    "Active development rhythm and milestone progress for Bagtyyar's portfolio. Builds, refactors, and engineering decisions as they happen.",
  openGraph: {
    title: "Build Log | Bagtyyar",
    description:
      "Active development rhythm and milestone progress for Bagtyyar's portfolio. Builds, refactors, and engineering decisions as they happen.",
    images: [{ url: "/og?title=Build%20Log%20%7C%20Bagtyyar&description=Active%20development%20rhythm%20and%20milestone%20progress%20for%20Bagtyyar%27s%20portfolio.%20Builds%2C%20refactors%2C%20and%20engineering%20decisions%20as%20they%20happen.", width: 1200, height: 630, alt: "Build Log | Bagtyyar" }],
  },
  twitter: {
    title: "Build Log | Bagtyyar",
    description:
      "Active development rhythm and milestone progress for Bagtyyar's portfolio. Builds, refactors, and engineering decisions as they happen.",
    images: ["/og?title=Build%20Log%20%7C%20Bagtyyar&description=Active%20development%20rhythm%20and%20milestone%20progress%20for%20Bagtyyar%27s%20portfolio.%20Builds%2C%20refactors%2C%20and%20engineering%20decisions%20as%20they%20happen."],
  },
};

export default async function BuildLogPage() {
  const inProgressConfig = getStatusConfig(Status.IN_PROGRESS);
  const entries = await getPublishedPublicBuildLogEntries();

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
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
