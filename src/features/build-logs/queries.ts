import { prisma } from "@/lib/db/prisma";
import { buildVisibilityFilter } from "@/lib/publication/policy";

export type PublicBuildLogEntry = Awaited<
  ReturnType<typeof getPublishedPublicBuildLogEntries>
>[number];

export async function getPublishedPublicBuildLogEntries() {
  return prisma.buildLogEntry.findMany({
    where: buildVisibilityFilter("public"),
    orderBy: { occurredAt: "desc" },
    include: {
      project: { select: { id: true, slug: true, title: true } },
    },
  });
}

export async function getPublishedPublicBuildLogEntriesByProject(projectId: string) {
  return prisma.buildLogEntry.findMany({
    where: {
      projectId,
      ...buildVisibilityFilter("public"),
    },
    orderBy: { occurredAt: "desc" },
    include: {
      project: { select: { id: true, slug: true, title: true } },
    },
  });
}
