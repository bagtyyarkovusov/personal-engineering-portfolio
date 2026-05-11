import { getContentCounts, StatCardGrid } from "@/features/admin/admin-overview";

export default async function AdminPage() {
  const counts = await getContentCounts();

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 p-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Summary of portfolio content and evidence.
        </p>
      </header>

      <StatCardGrid counts={counts} />
    </main>
  );
}
