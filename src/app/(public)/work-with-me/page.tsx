export const metadata = {
  title: "Work With Me — Bagtyyar",
};

export default function WorkWithMePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl tracking-tight">Work With Me</h1>
        <p className="text-muted-foreground">
          Start a project or hiring conversation.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-medium text-card-foreground">Coming soon</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A clear path for hiring, project inquiries, and initial engagement.
        </p>
      </section>
    </main>
  );
}
