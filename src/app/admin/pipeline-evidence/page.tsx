import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, ContentVisibility } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "@/components/admin/form-section";

export const metadata = { title: "Pipeline Evidence — Admin" };

async function createEvidence(formData: FormData) {
  "use server";
  const projectId = formData.get("projectId") as string;
  const label = formData.get("label") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const url = formData.get("url") as string;
  const status = formData.get("status") as ContentStatus;
  const visibility = formData.get("visibility") as ContentVisibility;
  const recordedAt = formData.get("recordedAt") as string;
  if (!projectId || !label) return;
  await prisma.pipelineEvidence.create({
    data: {
      projectId, label, description: description || null,
      category: category || "general", url: url || null,
      status, visibility,
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
    },
  });
  revalidatePath("/admin/pipeline-evidence");
}

async function updateEvidence(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const label = formData.get("label") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const url = formData.get("url") as string;
  const status = formData.get("status") as ContentStatus;
  const visibility = formData.get("visibility") as ContentVisibility;
  const recordedAt = formData.get("recordedAt") as string;
  if (!id || !label) return;
  await prisma.pipelineEvidence.update({
    where: { id },
    data: {
      label, description: description || null, category: category || "general",
      url: url || null, status, visibility,
      recordedAt: recordedAt ? new Date(recordedAt) : undefined,
    },
  });
  revalidatePath("/admin/pipeline-evidence");
}

export default async function AdminPipelineEvidencePage() {
  const evidence = await prisma.pipelineEvidence.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: { select: { id: true, title: true } } },
  });
  const projects = await prisma.project.findMany({ select: { id: true, title: true } });

  return (
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Pipeline Evidence</h1>
        <p className="text-sm text-muted-foreground">
          Curate CI/CD, testing, Docker, and deployment evidence. Published + public records appear on project pages.
        </p>
      </header>

      <FormSection title="New Evidence">
        <form action={createEvidence} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <Select name="projectId" required>
              <option value="">Select project...</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <Input name="label" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea name="description" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL (optional)</label>
            <Input name="url" type="url" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select name="category" defaultValue="general">
                <option value="testing">Testing</option>
                <option value="docker">Docker</option>
                <option value="ci">CI/CD</option>
                <option value="deployment">Deployment</option>
                <option value="general">General</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select name="status" defaultValue={ContentStatus.published}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Visibility</label>
              <Select name="visibility" defaultValue={ContentVisibility.public}>
                <option value="public">Public</option>
                <option value="privateRoom">Private Room</option>
                <option value="adminOnly">Admin Only</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Recorded At</label>
            <Input type="date" name="recordedAt" />
          </div>
          <Button type="submit">Add Evidence</Button>
        </form>
      </FormSection>

      <section className="space-y-3">
        <h2 className="font-serif text-xl tracking-tight">All Records ({evidence.length})</h2>
        {evidence.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pipeline evidence yet.</p>
        ) : (
          evidence.map((e) => (
            <details key={e.id} className="rounded-lg border border-border bg-card p-4">
              <summary className="cursor-pointer font-medium text-sm flex items-center gap-2">
                {e.label}
                <span className="text-xs text-muted-foreground">({e.project.title} &middot; {e.category})</span>
                <span className="ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-status-neutral text-status-neutral-foreground">
                  {e.status}
                </span>
              </summary>
              <form action={updateEvidence} className="mt-4 space-y-4">
                <input type="hidden" name="id" value={e.id} />
                <div>
                  <label className="block text-sm font-medium mb-1">Label</label>
                  <Input name="label" defaultValue={e.label} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea name="description" defaultValue={e.description ?? ""} rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <Input name="url" type="url" defaultValue={e.url ?? ""} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Select name="category" defaultValue={e.category}>
                      <option value="testing">Testing</option>
                      <option value="docker">Docker</option>
                      <option value="ci">CI/CD</option>
                      <option value="deployment">Deployment</option>
                      <option value="general">General</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select name="status" defaultValue={e.status}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Visibility</label>
                    <Select name="visibility" defaultValue={e.visibility}>
                      <option value="public">Public</option>
                      <option value="privateRoom">Private Room</option>
                      <option value="adminOnly">Admin Only</option>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Recorded At</label>
                  <Input type="date" name="recordedAt" defaultValue={e.recordedAt ? new Date(e.recordedAt).toISOString().split("T")[0] : ""} />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </details>
          ))
        )}
      </section>
    </main>
  );
}
