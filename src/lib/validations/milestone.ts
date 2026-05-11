import { z } from "zod";

export const milestoneFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).nullable().optional(),
  status: z.enum(["draft", "published", "archived"]),
  visibility: z.enum(["public", "privateRoom", "adminOnly"]),
  order: z.number().int().min(0).optional(),
  targetDate: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
});

export type MilestoneFormValues = z.infer<typeof milestoneFormSchema>;

export function validateMilestoneForm(data: unknown) {
  return milestoneFormSchema.safeParse(data);
}
