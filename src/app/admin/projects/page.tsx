export const metadata = { title: "Projects — Admin" };

export default function AdminProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage portfolio projects.
        </p>
      </header>
      <div className="rounded-lg border border-border bg-card p-8 space-y-4">
        <p className="text-sm text-muted-foreground">
          Form validation module is ready.
        </p>
        <p className="text-sm text-muted-foreground">
          Full form implementation coming in #27.
        </p>
      </div>
    </div>
  );
}
