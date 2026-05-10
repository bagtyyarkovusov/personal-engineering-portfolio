import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";

export default async function HealthPage() {
  const project = await prisma.project.findFirst({
    where: { status: "published" },
  });

  return (
    <main className="flex min-h-svh flex-col items-start justify-center gap-6 p-8">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl tracking-tight">OK</h1>
        <p className="text-muted-foreground">
          Personal Engineering Portfolio — Next.js App Router health slice.
        </p>
      </div>

      {project ? (
        <p data-testid="seeded-project">
          Seeded project: <strong>{project.title}</strong>
        </p>
      ) : (
        <p data-testid="no-project">No published project found in database.</p>
      )}

      <div className="flex items-center gap-4">
        <Button>Primary Action</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </main>
  );
}
