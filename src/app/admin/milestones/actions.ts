"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, ContentVisibility } from "@prisma/client";
import { validateMilestoneForm } from "@/lib/validations/milestone";

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createMilestone(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const projectId = formData.get("projectId") as string;

  if (!projectId) {
    return { success: false, error: "Please select a project." };
  }

  const raw = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    status: formData.get("status") as string,
    visibility: formData.get("visibility") as string,
    order: formData.get("order") ? parseInt(formData.get("order") as string, 10) : undefined,
    targetDate: (formData.get("targetDate") as string) || null,
    completedAt: (formData.get("completedAt") as string) || null,
  };

  const result = validateMilestoneForm(raw);
  if (!result.success) {
    const flattened = result.error.flatten();
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: flattened.fieldErrors as Record<string, string[]>,
    };
  }

  await prisma.milestone.create({
    data: {
      title: result.data.title,
      description: result.data.description,
      projectId,
      status: result.data.status as ContentStatus,
      visibility: result.data.visibility as ContentVisibility,
      order: result.data.order ?? 0,
      targetDate: result.data.targetDate ? new Date(result.data.targetDate) : null,
      completedAt: result.data.completedAt ? new Date(result.data.completedAt) : null,
    },
  });

  revalidatePath("/admin/milestones");
  return { success: true };
}

export async function updateMilestone(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, error: "Missing milestone id." };
  }

  const raw = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    status: formData.get("status") as string,
    visibility: formData.get("visibility") as string,
    order: formData.get("order") ? parseInt(formData.get("order") as string, 10) : undefined,
    targetDate: (formData.get("targetDate") as string) || null,
    completedAt: (formData.get("completedAt") as string) || null,
  };

  const result = validateMilestoneForm(raw);
  if (!result.success) {
    const flattened = result.error.flatten();
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: flattened.fieldErrors as Record<string, string[]>,
    };
  }

  await prisma.milestone.update({
    where: { id },
    data: {
      title: result.data.title,
      description: result.data.description,
      status: result.data.status as ContentStatus,
      visibility: result.data.visibility as ContentVisibility,
      order: result.data.order ?? 0,
      targetDate: result.data.targetDate ? new Date(result.data.targetDate) : null,
      completedAt: result.data.completedAt ? new Date(result.data.completedAt) : null,
    },
  });

  revalidatePath("/admin/milestones");
  return { success: true };
}
