export const metadata = {
  title: "Build Log — Bagtyyar",
};

export default function BuildLogPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl tracking-tight">Build Log</h1>
        <p className="text-muted-foreground">
          Active development rhythm and milestone progress.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-medium text-card-foreground">Coming soon</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Dated progress updates, milestone completions, and pipeline evidence
          as the portfolio evolves.
        </p>
      </section>
    </main>
  );
}
