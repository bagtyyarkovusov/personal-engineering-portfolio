import { z } from "zod";

export const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  summary: z.string().min(1, "Summary is required").max(500),
  body: z.string().max(50000).nullable().optional(),
  outcome: z.string().max(500).nullable().optional(),
  stack: z.array(z.string().max(50)).max(20).optional(),
  status: z.enum(["draft", "published", "archived"]),
  visibility: z.enum(["public", "privateRoom", "adminOnly"]),
  order: z.number().int().min(0).optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function validateProjectForm(data: unknown) {
  return projectFormSchema.safeParse(data);
}
