import { prisma } from "@/lib/db/prisma";

export default async function HealthPage() {
  const project = await prisma.project.findFirst({
    where: { status: "published" },
  });

  return (
    <main>
      <h1>OK</h1>
      <p>Personal Engineering Portfolio — Next.js App Router health slice.</p>
      {project ? (
        <p data-testid="seeded-project">
          Seeded project: <strong>{project.title}</strong>
        </p>
      ) : (
        <p data-testid="no-project">No published project found in database.</p>
      )}
    </main>
  );
}
