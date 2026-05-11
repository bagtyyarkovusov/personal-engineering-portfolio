import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, ContentVisibility } from "@prisma/client";

export const metadata = { title: "Architecture Decisions — Admin" };

async function createDecision(formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const body = formData.get("body") as string;
  const projectId = formData.get("projectId") as string;
  const status = formData.get("status") as ContentStatus;
  const visibility = formData.get("visibility") as ContentVisibility;
  const decidedAt = formData.get("decidedAt") as string;
  if (!title || !summary || !projectId) return;
  await prisma.architectureDecision.create({
    data: {
      title, summary, body: body || null, projectId, status, visibility, order: 0,
      decidedAt: decidedAt ? new Date(decidedAt) : null,
    },
  });
  revalidatePath("/admin/architecture-decisions");
}

async function updateDecision(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const body = formData.get("body") as string;
  const status = formData.get("status") as ContentStatus;
  const visibility = formData.get("visibility") as ContentVisibility;
  const decidedAt = formData.get("decidedAt") as string;
  if (!id || !title || !summary) return;
  await prisma.architectureDecision.update({
    where: { id },
    data: {
      title, summary, body: body || null, status, visibility,
      decidedAt: decidedAt ? new Date(decidedAt) : null,
    },
  });
  revalidatePath("/admin/architecture-decisions");
}

export default async function AdminArchitectureDecisionsPage() {
  const decisions = await prisma.architectureDecision.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: { select: { id: true, title: true } } },
  });
  const projects = await prisma.project.findMany({ select: { id: true, title: true } });

  return (
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Architecture Decisions</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage architecture decision records. Published + public records appear on project pages.
        </p>
      </header>

      <section className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="font-serif text-xl tracking-tight">New Decision</h2>
        <form action={createDecision} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <select name="projectId" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="">Select project...</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <input name="summary" required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Body (Markdown)</label>
            <textarea name="body" rows={4} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" defaultValue={ContentStatus.published} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Visibility</label>
              <select name="visibility" defaultValue={ContentVisibility.public} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                <option value="public">Public</option>
                <option value="privateRoom">Private Room</option>
                <option value="adminOnly">Admin Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Decided At</label>
              <input type="date" name="decidedAt" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Create Decision
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl tracking-tight">All Records ({decisions.length})</h2>
        {decisions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No architecture decisions yet.</p>
        ) : (
          decisions.map((d) => (
            <details key={d.id} className="rounded-lg border border-border bg-card p-4">
              <summary className="cursor-pointer font-medium text-sm flex items-center gap-2">
                {d.title}
                <span className="text-xs text-muted-foreground">({d.project.title})</span>
                <span className="ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-status-neutral text-status-neutral-foreground">
                  {d.status}
                </span>
              </summary>
              <form action={updateDecision} className="mt-4 space-y-4">
                <input type="hidden" name="id" value={d.id} />
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input name="title" defaultValue={d.title} required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Summary</label>
                  <input name="summary" defaultValue={d.summary} required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Body</label>
                  <textarea name="body" defaultValue={d.body ?? ""} rows={4} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select name="status" defaultValue={d.status} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Visibility</label>
                    <select name="visibility" defaultValue={d.visibility} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                      <option value="public">Public</option>
                      <option value="privateRoom">Private Room</option>
                      <option value="adminOnly">Admin Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Decided At</label>
                    <input type="date" name="decidedAt" defaultValue={d.decidedAt ? new Date(d.decidedAt).toISOString().split("T")[0] : ""} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
                  </div>
                </div>
                <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Save Changes
                </button>
              </form>
            </details>
          ))
        )}
      </section>
    </main>
  );
}
