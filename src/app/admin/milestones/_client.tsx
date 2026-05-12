"use client";

import { useActionState } from "react";
import { Milestone, X } from "lucide-react";
import { ContentStatus, ContentVisibility } from "@prisma/client";
import { EmptyState } from "@/components/admin/empty-state";
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
    <section className="rounded-lg border border-border bg-card p-6 space-y-4">
      <h2 className="font-serif text-xl tracking-tight">New Milestone</h2>
      <form action={formAction} className="space-y-4">
        <FieldError error={state.error} />

        <div>
          <label className="block text-sm font-medium mb-1">Project</label>
          <select
            name="projectId"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
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
          <FieldErrors fieldErrors={state.fieldErrors} field="title" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <FieldErrors fieldErrors={state.fieldErrors} field="description" />
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
          <FieldErrors fieldErrors={state.fieldErrors} field="order" />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? "Creating..." : "Create Milestone"}
        </button>
      </form>
    </section>
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
        <input
          name="title"
          defaultValue={milestone.title}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <FieldErrors fieldErrors={state.fieldErrors} field="title" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          defaultValue={milestone.description ?? ""}
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <FieldErrors fieldErrors={state.fieldErrors} field="description" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            defaultValue={milestone.status}
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
            defaultValue={milestone.visibility}
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
            defaultValue={toDateString(milestone.targetDate)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Completed At</label>
          <input
            type="date"
            name="completedAt"
            defaultValue={toDateString(milestone.completedAt)}
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
          defaultValue={milestone.order}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <FieldErrors fieldErrors={state.fieldErrors} field="order" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Changes"}
      </button>

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
