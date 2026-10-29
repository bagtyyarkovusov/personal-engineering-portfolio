import { prisma } from "@/lib/db/prisma";
import { buildVisibilityFilter } from "@/lib/publication/policy";

export type PublicProject = Awaited<ReturnType<typeof getPublishedPublicProjects>>[number];

export async function getPublishedPublicProjects() {
  return prisma.project.findMany({
    where: buildVisibilityFilter("public"),
    orderBy: { order: "asc" },
  });
}

export async function getPublishedPublicProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: {
      slug,
      ...buildVisibilityFilter("public"),
    },
  });
}

export async function getAdminProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export type AdminProject = Awaited<ReturnType<typeof getAdminProjects>>[number];
