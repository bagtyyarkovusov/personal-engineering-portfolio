import { getPublishedPublicProjects } from "@/features/projects/queries";
import { ProjectCard } from "@/features/projects/project-card";

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects built with production-minded discipline — testing, Docker, CI/CD, and architecture decisions by Bagtyyar.",
  openGraph: {
    title: "Work | Bagtyyar",
    description:
      "Selected projects built with production-minded discipline — testing, Docker, CI/CD, and architecture decisions.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Work | Bagtyyar",
    description:
      "Selected projects built with production-minded discipline — testing, Docker, CI/CD, and architecture decisions.",
    images: ["/og-default.png"],
  },
};

export default async function WorkPage() {
  const projects = await getPublishedPublicProjects();

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl tracking-tight">Work</h1>
        <p className="text-muted-foreground">
          Selected projects built with production-minded discipline.
        </p>
      </header>

      {projects.length > 0 ? (
        <section className="flex flex-col gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      ) : (
        <p className="text-muted-foreground">
          No published projects yet. Check back as the portfolio grows.
        </p>
      )}
    </main>
  );
}
