export const metadata = { title: "Build Logs — Admin" };

export default function AdminBuildLogsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Build Logs</h1>
        <p className="text-sm text-muted-foreground">
          Document build processes, CI/CD runs, and deployment notes.
        </p>
      </header>
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Build log management coming soon.
      </div>
    </div>
  );
}
