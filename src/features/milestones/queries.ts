import { prisma } from "@/lib/db/prisma";
import { buildVisibilityFilter } from "@/lib/publication/policy";

export type PublicMilestone = Awaited<
  ReturnType<typeof getPublishedPublicMilestones>
>[number];

export async function getPublishedPublicMilestones(projectId: string) {
  return prisma.milestone.findMany({
    where: {
      projectId,
      ...buildVisibilityFilter("public"),
    },
    orderBy: { order: "asc" },
  });
}
