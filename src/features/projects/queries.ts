import { prisma } from "@/lib/db/prisma";
import { buildVisibilityFilter } from "@/lib/publication/policy";

export type PublicProject = Awaited<ReturnType<typeof getPublishedPublicProjects>>[number];

export async function getPublishedPublicProjects() {
  return prisma.project.findMany({
    where: buildVisibilityFilter("public"),
    orderBy: { order: "asc" },
  });
}
