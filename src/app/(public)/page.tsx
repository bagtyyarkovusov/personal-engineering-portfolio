import { prisma } from "@/lib/db/prisma";

export const metadata = {
  title: "Bagtyyar — Production-minded engineering",
};

export default async function HomePage() {
  const project = await prisma.project.findFirst({
    where: { status: "published" },
  });

  return (
    <main className="flex min-h-svh flex-col items-start justify-center gap-6 p-8">
      <div className="max-w-xl space-y-3">
        <h1 className="font-serif text-4xl tracking-tight">
          Production-minded engineering
        </h1>
        <p className="text-muted-foreground">
          Built to stay maintainable after launch. Full-stack and mobile
          products with tests, Dockerized environments, CI/CD, architecture
          decisions, and transparent delivery.
        </p>
      </div>

      {project ? (
        <p data-testid="seeded-project" className="text-sm text-muted-foreground">
          System check:{" "}
          <span className="font-medium text-status-verified">OK</span> — seeded
          project <strong className="text-foreground">{project.title}</strong>{" "}
          loaded.
        </p>
      ) : (
        <p data-testid="no-project" className="text-sm text-muted-foreground">
          System check: no published project found in database.
        </p>
      )}
    </main>
  );
}
