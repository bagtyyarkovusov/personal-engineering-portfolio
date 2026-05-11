export const metadata = { title: "Settings — Admin" };

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure admin preferences and site settings.
        </p>
      </header>
      <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Settings page coming soon.
      </div>
    </div>
  );
}
