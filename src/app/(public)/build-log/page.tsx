import { getPublishedPublicBuildLogEntries } from "@/features/build-logs/queries";
import { BuildLogList } from "@/features/build-logs/build-log-list";
import { getStatusConfig, Status } from "@/design/statuses";

export const metadata = {
  title: "Build Log — Bagtyyar",
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
