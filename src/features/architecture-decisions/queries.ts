import { prisma } from "@/lib/db/prisma";
import { buildVisibilityFilter } from "@/lib/publication/policy";

export type PublicArchitectureDecision = Awaited<
  ReturnType<typeof getPublishedPublicArchitectureDecisions>
>[number];

export async function getPublishedPublicArchitectureDecisions(projectId: string) {
  return prisma.architectureDecision.findMany({
    where: { projectId, ...buildVisibilityFilter("public") },
    orderBy: { order: "asc" },
  });
}
