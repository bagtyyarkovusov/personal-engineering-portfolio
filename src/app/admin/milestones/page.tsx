import { prisma } from "@/lib/db/prisma";
import { MilestoneManager } from "./_client";

export const metadata = { title: "Milestones — Admin" };

export default async function AdminMilestonesPage() {
  const milestones = await prisma.milestone.findMany({
    orderBy: [{ project: { title: "asc" } }, { order: "asc" }],
    include: { project: { select: { id: true, title: true } } },
  });

  const projects = await prisma.project.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  return <MilestoneManager milestones={milestones} projects={projects} />;
}
