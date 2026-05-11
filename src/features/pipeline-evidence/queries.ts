import { prisma } from "@/lib/db/prisma";
import { buildVisibilityFilter } from "@/lib/publication/policy";

export type PublicPipelineEvidence = Awaited<
  ReturnType<typeof getPublishedPublicPipelineEvidence>
>[number];

export async function getPublishedPublicPipelineEvidence(projectId: string) {
  return prisma.pipelineEvidence.findMany({
    where: { projectId, ...buildVisibilityFilter("public") },
    orderBy: { recordedAt: "desc" },
  });
}
