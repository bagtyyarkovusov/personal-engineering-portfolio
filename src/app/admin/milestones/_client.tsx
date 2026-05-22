"use client";

import { useActionState } from "react";
import { Milestone, X } from "lucide-react";
import { ContentStatus, ContentVisibility } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/admin/empty-state";
import { FormSection } from "@/components/admin/form-section";
import type { ActionResult } from "./actions";
import { createMilestone, updateMilestone } from "./actions";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProjectRef {
  id: string;
  title: string;
}

interface MilestoneRecord {
  id: string;
  projectId: string;
  project: ProjectRef;
  title: string;
  description: string | null;
  status: string;
  visibility: string;
  order: number;
  targetDate: Date | null;
  completedAt: Date | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toDateString(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="text-sm text-destructive flex items-center gap-1">
      <X className="size-3" />
      {error}
    </p>
  );
}

function FieldErrors({
  fieldErrors,
  field,
}: {
  fieldErrors?: Record<string, string[]>;
  field: string;
}) {
  const msgs = fieldErrors?.[field];
  if (!msgs || msgs.length === 0) return null;
  return (
    <ul className="mt-1 space-y-0.5">
      {msgs.map((msg, i) => (
        <li key={i} className="text-xs text-destructive flex items-center gap-1">
          <X className="size-2.5" />
          {msg}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Create form                                                        */
/* ------------------------------------------------------------------ */

function CreateForm({ projects }: { projects: ProjectRef[] }) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    createMilestone,
    { success: true },
  );

  return (
    <FormSection title="New Milestone">
      <form action={formAction} className="space-y-4">
        <FieldError error={state.error} />

        <div>
          <label className="block text-sm font-medium mb-1">Project</label>
          <Select name="projectId" required>
            <option value="">Select project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input name="title" required />
          <FieldErrors fieldErrors={state.fieldErrors} field="title" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea name="description" rows={3} />
          <FieldErrors fieldErrors={state.fieldErrors} field="description" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select name="status" defaultValue={ContentStatus.draft}>
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
          <div>
            <label className="block text-sm font-medium mb-1">Target Date</label>
            <Input type="date" name="targetDate" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Completed At</label>
            <Input type="date" name="completedAt" />
          </div>
        </div>

        <div className="max-w-xs">
          <label className="block text-sm font-medium mb-1">Order</label>
          <Input type="number" name="order" min={0} defaultValue={0} />
          <FieldErrors fieldErrors={state.fieldErrors} field="order" />
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Milestone"}
        </Button>
      </form>
    </FormSection>
  );
}

/* ------------------------------------------------------------------ */
/*  Edit form (inside <details>)                                        */
/* ------------------------------------------------------------------ */

function EditForm({ milestone }: { milestone: MilestoneRecord }) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    updateMilestone,
    { success: true },
  );

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <input type="hidden" name="id" value={milestone.id} />
      <FieldError error={state.error} />

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input name="title" defaultValue={milestone.title} required />
        <FieldErrors fieldErrors={state.fieldErrors} field="title" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea name="description" defaultValue={milestone.description ?? ""} rows={3} />
        <FieldErrors fieldErrors={state.fieldErrors} field="description" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select name="status" defaultValue={milestone.status}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Visibility</label>
          <Select name="visibility" defaultValue={milestone.visibility}>
            <option value="public">Public</option>
            <option value="privateRoom">Private Room</option>
            <option value="adminOnly">Admin Only</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target Date</label>
          <Input type="date" name="targetDate" defaultValue={toDateString(milestone.targetDate)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Completed At</label>
          <Input type="date" name="completedAt" defaultValue={toDateString(milestone.completedAt)} />
        </div>
      </div>

      <div className="max-w-xs">
        <label className="block text-sm font-medium mb-1">Order</label>
        <Input type="number" name="order" min={0} defaultValue={milestone.order} />
        <FieldErrors fieldErrors={state.fieldErrors} field="order" />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </Button>

      {state.success && !state.error && (
        <p className="text-xs text-green-600">Saved successfully.</p>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Main client component                                              */
/* ------------------------------------------------------------------ */

interface MilestoneManagerProps {
  milestones: MilestoneRecord[];
  projects: ProjectRef[];
}

export function MilestoneManager({
  milestones,
  projects,
}: MilestoneManagerProps) {
  const milestonesByProject = new Map<string, MilestoneRecord[]>();
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
          Create and manage project milestones. Published + public milestones
          appear on public project pages and in private rooms via the milestone
          timeline.
        </p>
      </header>

      <CreateForm projects={projects} />

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
                      <span className="ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-status-neutral text-status-neutral-foreground">
                        {m.status}
                      </span>
                    </summary>
                    <EditForm milestone={m} />
                  </details>
                ))}
              </div>
            ),
          )
        )}
      </section>
    </main>
  );
}
