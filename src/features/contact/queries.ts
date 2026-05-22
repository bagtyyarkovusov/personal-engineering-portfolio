import { prisma } from "@/lib/db/prisma";

export async function getContactSubmissions() {
  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getContactSubmissionCounts() {
  const [total, unread] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { status: "new" } }),
  ]);
  return { total, unread };
}

export async function markContactSubmissionAsRead(id: string) {
  return prisma.contactSubmission.update({
    where: { id },
    data: { status: "read" },
  });
}

export async function archiveContactSubmission(id: string) {
  return prisma.contactSubmission.update({
    where: { id },
    data: { status: "archived" },
  });
}
