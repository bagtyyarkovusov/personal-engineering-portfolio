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
    images: [{ url: "/og?title=Work%20%7C%20Bagtyyar&description=Selected%20projects%20built%20with%20production-minded%20discipline%20%E2%80%94%20testing%2C%20Docker%2C%20CI%2FCD%2C%20and%20architecture%20decisions.", width: 1200, height: 630, alt: "Work | Bagtyyar" }],
  },
  twitter: {
    title: "Work | Bagtyyar",
    description:
      "Selected projects built with production-minded discipline — testing, Docker, CI/CD, and architecture decisions.",
    images: ["/og?title=Work%20%7C%20Bagtyyar&description=Selected%20projects%20built%20with%20production-minded%20discipline%20%E2%80%94%20testing%2C%20Docker%2C%20CI%2FCD%2C%20and%20architecture%20decisions."],
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
