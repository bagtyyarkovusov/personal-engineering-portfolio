"use client";

import { useActionState } from "react";
import { FolderKanban, X } from "lucide-react";
import { ContentStatus, ContentVisibility } from "@prisma/client";
import { EmptyState } from "@/components/admin/empty-state";
import { type AdminProject } from "@/features/projects/queries";
import {
  type ActionResult,
  createProject,
  updateProject,
} from "./actions";

/* ------------------------------------------------------------------ */
/*  Create form                                                        */
/* ------------------------------------------------------------------ */

function CreateForm() {
  const [state, formAction, pending] = useActionState<
    ActionResult,
    FormData
  >(createProject, { success: true });

  if (state.success && state.error === undefined) {
    // Clear after successful submit — form resets to initial state
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6 space-y-4">
      <h2 className="font-serif text-xl tracking-tight">New Project</h2>
      <form action={formAction} className="space-y-4">
        <FieldError error={state.error} />

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
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            name="slug"
            required
            placeholder="my-project-slug"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <FieldErrors fieldErrors={state.fieldErrors} field="slug" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <input
            name="summary"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <FieldErrors fieldErrors={state.fieldErrors} field="summary" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Body (Markdown)</label>
          <textarea
            name="body"
            rows={5}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
          />
          <FieldErrors fieldErrors={state.fieldErrors} field="body" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Outcome</label>
          <textarea
            name="outcome"
            rows={3}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
          />
          <FieldErrors fieldErrors={state.fieldErrors} field="outcome" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Stack <span className="text-muted-foreground font-normal">(comma-separated)</span>
          </label>
          <input
            name="stack"
            placeholder="React, Next.js, PostgreSQL"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <FieldErrors fieldErrors={state.fieldErrors} field="stack" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Order</label>
          <input
            name="order"
            type="number"
            min={0}
            defaultValue={0}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <FieldErrors fieldErrors={state.fieldErrors} field="order" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Started At</label>
            <input
              type="date"
              name="startedAt"
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

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? "Creating..." : "Create Project"}
        </button>
      </form>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Edit form (one per project, inside a <details> element)             */
/* ------------------------------------------------------------------ */

function EditForm({ project }: { project: AdminProject }) {
  const [state, formAction, pending] = useActionState<
    ActionResult,
    FormData
  >(updateProject, { success: true });

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <input type="hidden" name="id" value={project.id} />
      <FieldError error={state.error} />

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          name="title"
          defaultValue={project.title}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <FieldErrors fieldErrors={state.fieldErrors} field="title" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          name="slug"
          defaultValue={project.slug}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <FieldErrors fieldErrors={state.fieldErrors} field="slug" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Summary</label>
        <input
          name="summary"
          defaultValue={project.summary}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <FieldErrors fieldErrors={state.fieldErrors} field="summary" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Body (Markdown)</label>
        <textarea
          name="body"
          defaultValue={project.body ?? ""}
          rows={5}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
        />
        <FieldErrors fieldErrors={state.fieldErrors} field="body" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Outcome</label>
        <textarea
          name="outcome"
          defaultValue={project.outcome ?? ""}
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
        />
        <FieldErrors fieldErrors={state.fieldErrors} field="outcome" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Stack <span className="text-muted-foreground font-normal">(comma-separated)</span>
        </label>
        <input
          name="stack"
          defaultValue={project.stack.join(", ")}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <FieldErrors fieldErrors={state.fieldErrors} field="stack" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Order</label>
        <input
          name="order"
          type="number"
          min={0}
          defaultValue={project.order}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <FieldErrors fieldErrors={state.fieldErrors} field="order" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Started At</label>
          <input
            type="date"
            name="startedAt"
            defaultValue={
              project.startedAt
                ? new Date(project.startedAt).toISOString().split("T")[0]
                : ""
            }
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Completed At</label>
          <input
            type="date"
            name="completedAt"
            defaultValue={
              project.completedAt
                ? new Date(project.completedAt).toISOString().split("T")[0]
                : ""
            }
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            defaultValue={project.status}
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
            defaultValue={project.visibility}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="public">Public</option>
            <option value="privateRoom">Private Room</option>
            <option value="adminOnly">Admin Only</option>
          </select>
        </div>
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
/*  Status badge                                                       */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-status-neutral text-status-neutral-foreground">
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Validation error helpers                                           */
/* ------------------------------------------------------------------ */

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
/*  Main client component                                              */
/* ------------------------------------------------------------------ */

export function ProjectManager({
  projects,
}: {
  projects: AdminProject[];
}) {
  if (projects.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
        <header className="space-y-1">
          <h1 className="font-serif text-3xl tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage portfolio projects.
          </p>
        </header>
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start building your portfolio. Projects appear on the public Work page when published."
        />
        <CreateForm />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage portfolio projects. Published + public projects appear
          on the public Work page.
        </p>
      </header>

      <CreateForm />

      <section className="space-y-3">
        <h2 className="font-serif text-xl tracking-tight">
          All Projects ({projects.length})
        </h2>
        {projects.map((project) => (
          <details
            key={project.id}
            className="rounded-lg border border-border bg-card p-4"
          >
            <summary className="cursor-pointer font-medium text-sm flex items-center gap-2">
              {project.title}
              <span className="text-xs text-muted-foreground">
                ({project.slug})
              </span>
              <StatusBadge status={project.status} />
            </summary>
            <EditForm project={project} />
          </details>
        ))}
      </section>
    </div>
  );
}
