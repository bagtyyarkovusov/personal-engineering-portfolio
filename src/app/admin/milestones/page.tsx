import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, ContentVisibility } from "@prisma/client";
import { Milestone } from "lucide-react";
import { EmptyState } from "@/components/admin/empty-state";
import { validateMilestoneForm } from "@/lib/validations/milestone";

export const metadata = { title: "Milestones — Admin" };

async function createMilestone(formData: FormData) {
  "use server";
  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as ContentStatus;
  const visibility = formData.get("visibility") as ContentVisibility;
  const order = formData.get("order") as string;
  const targetDate = formData.get("targetDate") as string;
  const completedAt = formData.get("completedAt") as string;

  if (!projectId) return;

  const result = validateMilestoneForm({
    title,
    description: description || null,
    status,
    visibility,
    order: order ? parseInt(order, 10) : undefined,
    targetDate: targetDate || null,
    completedAt: completedAt || null,
  });

  if (!result.success) return;

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
}

async function updateMilestone(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as ContentStatus;
  const visibility = formData.get("visibility") as ContentVisibility;
  const order = formData.get("order") as string;
  const targetDate = formData.get("targetDate") as string;
  const completedAt = formData.get("completedAt") as string;

  if (!id) return;

  const result = validateMilestoneForm({
    title,
    description: description || null,
    status,
    visibility,
    order: order ? parseInt(order, 10) : undefined,
    targetDate: targetDate || null,
    completedAt: completedAt || null,
  });

  if (!result.success) return;

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
}

function toDateString(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export default async function AdminMilestonesPage() {
  const milestones = await prisma.milestone.findMany({
    orderBy: [{ project: { title: "asc" } }, { order: "asc" }],
    include: { project: { select: { id: true, title: true } } },
  });
  const projects = await prisma.project.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  const milestonesByProject = new Map<string, (typeof milestones)[number][]>();
  for (const m of milestones) {
    const key = m.project.title;
    if (!milestonesByProject.has(key)) {
      milestonesByProject.set(key, []);
    }
    milestonesByProject.get(key)!.push(m);
  }

  return (
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Milestones</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage project milestones. Published + public milestones appear on public project pages
          and in private rooms via the milestone timeline.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="font-serif text-xl tracking-tight">New Milestone</h2>
        <form action={createMilestone} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <select
              name="projectId"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Select project...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="title"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                defaultValue={ContentStatus.draft}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Visibility</label>
              <select
                name="visibility"
                defaultValue={ContentVisibility.public}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="public">Public</option>
                <option value="privateRoom">Private Room</option>
                <option value="adminOnly">Admin Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Date</label>
              <input
                type="date"
                name="targetDate"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Completed At</label>
              <input
                type="date"
                name="completedAt"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="max-w-xs">
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              type="number"
              name="order"
              min={0}
              defaultValue={0}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create Milestone
          </button>
        </form>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-xl tracking-tight">
          All Milestones ({milestones.length})
        </h2>
        {milestones.length === 0 ? (
          <EmptyState
            icon={Milestone}
            title="No milestones yet"
            description="Create milestones to track project progress. Published milestones appear on public project pages and in private rooms."
          />
        ) : (
          Array.from(milestonesByProject.entries()).map(
            ([projectTitle, projectMilestones]) => (
              <div key={projectTitle} className="space-y-3">
                <h3 className="font-serif text-lg tracking-tight text-muted-foreground">
                  {projectTitle}
                </h3>
                {projectMilestones.map((m) => (
                  <details
                    key={m.id}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <summary className="cursor-pointer text-sm font-medium flex items-center gap-2">
                      {m.title}
                      <span
                        className="ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-status-neutral text-status-neutral-foreground"
                      >
                        {m.status}
                      </span>
                    </summary>
                    <form
                      action={updateMilestone}
                      className="mt-4 space-y-4"
                    >
                      <input type="hidden" name="id" value={m.id} />
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Title
                        </label>
                        <input
                          name="title"
                          defaultValue={m.title}
                          required
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          defaultValue={m.description ?? ""}
                          rows={3}
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Status
                          </label>
                          <select
                            name="status"
                            defaultValue={m.status}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Visibility
                          </label>
                          <select
                            name="visibility"
                            defaultValue={m.visibility}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                          >
                            <option value="public">Public</option>
                            <option value="privateRoom">Private Room</option>
                            <option value="adminOnly">Admin Only</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Target Date
                          </label>
                          <input
                            type="date"
                            name="targetDate"
                            defaultValue={toDateString(m.targetDate)}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Completed At
                          </label>
                          <input
                            type="date"
                            name="completedAt"
                            defaultValue={toDateString(m.completedAt)}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <div className="max-w-xs">
                        <label className="block text-sm font-medium mb-1">
                          Order
                        </label>
                        <input
                          type="number"
                          name="order"
                          min={0}
                          defaultValue={m.order}
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        Save Changes
                      </button>
                    </form>
                  </details>
                ))}
              </div>
            )
          )
        )}
      </section>
    </main>
  );
}
