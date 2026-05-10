export const metadata = {
  title: "About — Bagtyyar",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl tracking-tight">About</h1>
        <p className="text-muted-foreground">
          Personal-led, agency-ready engineering.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-medium text-card-foreground">Coming soon</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          How Bagtyyar works, why maintainability matters, and what clients and
          teams can expect from a production-minded engineering partner.
        </p>
      </section>
    </main>
  );
}
