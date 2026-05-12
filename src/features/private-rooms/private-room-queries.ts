import crypto from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { validateToken, isValidTokenFormat } from "@/lib/access-tokens";
import { buildVisibilityFilter } from "@/lib/publication/policy";

export async function getPrivateRoomData(rawToken: string) {
  if (!isValidTokenFormat(rawToken)) return null;
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const validated = await validateToken(tokenHash);
  if (!validated) return null;

  const room = validated.room;
  const visibilityFilter = buildVisibilityFilter("privateRoom");

  const project = await prisma.project.findFirst({
    where: { id: room.projectId, ...visibilityFilter },
    select: { id: true, slug: true, title: true, summary: true, outcome: true, stack: true, status: true, completedAt: true },
  });
  if (!project) return null;

  const milestones = room.showMilestones
    ? await prisma.milestone.findMany({
        where: { projectId: room.projectId, ...visibilityFilter },
        orderBy: { order: "asc" },
      })
    : [];

  const buildLogs = room.showUpdates
    ? await prisma.buildLogEntry.findMany({
        where: { projectId: room.projectId, ...visibilityFilter },
        orderBy: { occurredAt: "desc" },
        include: {
          project: { select: { id: true, slug: true, title: true } },
        },
      })
    : [];

  const architectureDecisions = room.showArchitecture
    ? await prisma.architectureDecision.findMany({
        where: { projectId: room.projectId, ...visibilityFilter },
        orderBy: { order: "asc" },
      })
    : [];

  const pipelineEvidence = room.showEvidence
    ? await prisma.pipelineEvidence.findMany({
        where: { projectId: room.projectId, ...visibilityFilter },
        orderBy: { recordedAt: "desc" },
      })
    : [];

  return {
    project,
    room: {
      id: room.id,
      slug: room.slug,
      showMilestones: room.showMilestones,
      showUpdates: room.showUpdates,
      showArchitecture: room.showArchitecture,
      showEvidence: room.showEvidence,
      showNextSteps: room.showNextSteps,
    },
    milestones,
    buildLogs,
    architectureDecisions,
    pipelineEvidence,
  };
}

export type PrivateRoomData = Awaited<ReturnType<typeof getPrivateRoomData>>;
