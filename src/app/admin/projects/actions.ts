"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { validateProjectForm } from "@/lib/validations/project";

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createProject(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    summary: formData.get("summary") as string,
    body: (formData.get("body") as string) || null,
    outcome: (formData.get("outcome") as string) || null,
    stack:
      ((formData.get("stack") as string) || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    status: formData.get("status") as string,
    visibility: formData.get("visibility") as string,
    order: formData.get("order")
      ? parseInt(formData.get("order") as string, 10)
      : 0,
  };

  const result = validateProjectForm(raw);
  if (!result.success) {
    const flattened = result.error.flatten();
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: flattened.fieldErrors as Record<string, string[]>,
    };
  }

  const { stack, ...validated } = result.data;

  await prisma.project.create({
    data: {
      ...validated,
      stack: stack ?? [],
      startedAt: formData.get("startedAt")
        ? new Date(formData.get("startedAt") as string)
        : null,
      completedAt: formData.get("completedAt")
        ? new Date(formData.get("completedAt") as string)
        : null,
    },
  });

  revalidatePath("/admin/projects");
  return { success: true };
}

export async function updateProject(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = formData.get("id") as string;
  if (!id) {
    return { success: false, error: "Missing project id." };
  }

  const raw = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    summary: formData.get("summary") as string,
    body: (formData.get("body") as string) || null,
    outcome: (formData.get("outcome") as string) || null,
    stack:
      ((formData.get("stack") as string) || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    status: formData.get("status") as string,
    visibility: formData.get("visibility") as string,
    order: formData.get("order")
      ? parseInt(formData.get("order") as string, 10)
      : 0,
  };

  const result = validateProjectForm(raw);
  if (!result.success) {
    const flattened = result.error.flatten();
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: flattened.fieldErrors as Record<string, string[]>,
    };
  }

  const { stack, ...validated } = result.data;

  await prisma.project.update({
    where: { id },
    data: {
      ...validated,
      stack: stack ?? [],
      startedAt: formData.get("startedAt")
        ? new Date(formData.get("startedAt") as string)
        : null,
      completedAt: formData.get("completedAt")
        ? new Date(formData.get("completedAt") as string)
        : null,
    },
  });

  revalidatePath("/admin/projects");
  return { success: true };
}
