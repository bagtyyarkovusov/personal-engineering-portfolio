import { prisma } from "@/lib/db/prisma";
import { ContentStatus, ContentVisibility } from "@prisma/client";

export type PublicProject = Awaited<ReturnType<typeof getPublishedPublicProjects>>[number];

export async function getPublishedPublicProjects() {
  return prisma.project.findMany({
    where: {
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    },
    orderBy: { order: "asc" },
  });
}
