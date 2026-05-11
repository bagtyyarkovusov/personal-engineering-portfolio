import { getStatusConfig, Status } from "@/design/statuses";

const EXPECTED_UPDATES = [
  {
    title: "Build completions",
    description: "When a feature branch merges and the CI pipeline passes, a dated entry will appear here.",
  },
  {
    title: "Milestone progress",
    description: "Completed, current, and upcoming milestones tracked against real project timelines.",
  },
  {
    title: "Pipeline evidence",
    description: "Curated test runs, Docker builds, typecheck results, and deployment records.",
  },
  {
    title: "Technical decisions",
    description: "Architecture Decision Records published as they are written and reviewed.",
  },
];

export const metadata = {
  title: "Build Log — Bagtyyar",
};

export default function BuildLogPage() {
  const inProgressConfig = getStatusConfig(Status.IN_PROGRESS);

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
          Active development rhythm and milestone progress — updated as the
          portfolio evolves.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-card p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-2.5 w-2.5 rounded-full ${inProgressConfig.bgClass}`}
            aria-hidden="true"
          />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Live
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            Ready for updates
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This page will display dated progress updates, milestone
            completions, and pipeline evidence as active development
            continues. The Build Log is part of the repeatable engineering
            delivery system — every significant change leaves a record here.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          What to expect
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {EXPECTED_UPDATES.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-card p-4 space-y-1.5"
            >
              <h3 className="font-medium text-sm text-card-foreground">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
