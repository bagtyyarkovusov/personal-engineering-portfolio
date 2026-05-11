import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage portfolio content and evidence.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/architecture-decisions"
          className="rounded-lg border border-border bg-card p-4 hover:bg-accent/40 transition-colors"
        >
          <h2 className="font-serif text-lg tracking-tight">Architecture Decisions</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Create and edit architecture decision records.
          </p>
        </Link>
        <Link
          href="/admin/pipeline-evidence"
          className="rounded-lg border border-border bg-card p-4 hover:bg-accent/40 transition-colors"
        >
          <h2 className="font-serif text-lg tracking-tight">Pipeline Evidence</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Curate CI/CD, testing, and deployment evidence.
          </p>
        </Link>
      </div>
    </main>
  );
}
