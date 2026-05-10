export const metadata = {
  title: "Engineering System — Bagtyyar",
};

export default function EngineeringSystemPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl tracking-tight">
          Engineering System
        </h1>
        <p className="text-muted-foreground">
          How Bagtyyar builds and ships software with production-minded
          discipline.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-medium text-card-foreground">Coming soon</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A detailed overview of the development, testing, and deployment
          workflow that powers every project.
        </p>
      </section>
    </main>
  );
}
