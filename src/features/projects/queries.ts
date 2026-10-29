import { prisma } from "@/lib/db/prisma";
import { buildVisibilityFilter } from "@/lib/publication/policy";

const publicProjectOverrides: Record<
  string,
  { title?: string; order?: number }
> = {
  "tm-whatsapp": { title: "Tayyn Hyzmat", order: 1 },
  "myorl-ent-clinic": { order: 2 },
  "personal-engineering-portfolio": { order: 3 },
  "gonka-ai-inference-infrastructure": { order: 4 },
};

function presentPublicProject<T extends { slug: string; title: string; order?: number }>(
  project: T,
) {
  const override = publicProjectOverrides[project.slug];
  return {
    ...project,
    title: override?.title ?? project.title,
    order: override?.order ?? project.order,
  };
}

export type PublicProject = Awaited<ReturnType<typeof getPublishedPublicProjects>>[number];

export async function getPublishedPublicProjects() {
  const projects = await prisma.project.findMany({
    where: buildVisibilityFilter("public"),
    orderBy: { order: "asc" },
  });
  const hasOverrides = projects.some((project) => project.slug in publicProjectOverrides);
  if (!hasOverrides) return projects;
  return projects
    .map(presentPublicProject)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getPublishedPublicProjectBySlug(slug: string) {
  const project = await prisma.project.findFirst({
    where: {
      slug,
      ...buildVisibilityFilter("public"),
    },
  });
  return project && project.slug in publicProjectOverrides
    ? presentPublicProject(project)
    : project;
}

export async function getAdminProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export type AdminProject = Awaited<ReturnType<typeof getAdminProjects>>[number];
