"use client";

import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormSection } from "@/components/admin/form-section";

interface CreateRoomFormProps {
  createRoomAction: (formData: FormData) => Promise<{
    rawToken: string;
    tokenLabel: string | null;
  } | null>;
  projects: { id: string; title: string }[];
}

export function CreateRoomForm({
  createRoomAction,
  projects,
}: CreateRoomFormProps) {
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [tokenLabel, setTokenLabel] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await createRoomAction(formData);
    if (result?.rawToken) {
      setRawToken(result.rawToken);
      setTokenLabel(result.tokenLabel);
    }
  }

  async function copyToClipboard() {
    if (rawToken) {
      await navigator.clipboard.writeText(rawToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <FormSection title="New Private Room">

      {rawToken ? (
        <div className="rounded-md border border-amber-500/40 bg-amber-50 dark:bg-amber-950/20 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Room Created — Copy the access token now
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                This token will not be shown again. Share it with your client to
                grant read-only access to this private room.
              </p>
              {tokenLabel && (
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                  Label: {tokenLabel}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setRawToken(null)}
              className="shrink-0 rounded-md p-1 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-amber-950 px-3 py-2 text-sm font-mono break-all select-all">
              {rawToken}
            </code>
            <button
              type="button"
              onClick={copyToClipboard}
              className="shrink-0 rounded-md border border-amber-300 dark:border-amber-700 bg-white dark:bg-amber-950 p-2 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
          <form action={handleSubmit} className="pt-2">
            <input type="hidden" name="intent" value="dismiss" />
            <Button type="submit">Create Another Room</Button>
          </form>
        </div>
      ) : (
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <Select name="projectId" required>
              <option value="">Select project...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Slug{" "}
              <span className="text-xs text-muted-foreground">
                (used in the URL path, must be unique)
              </span>
            </label>
            <Input
              name="slug"
              required
              pattern="[a-z0-9-]+"
              title="Lowercase letters, numbers, and hyphens only"
              placeholder="e.g., client-review-q2"
            />
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Visible Sections</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                "showMilestones",
                "showUpdates",
                "showArchitecture",
                "showEvidence",
                "showNextSteps",
              ].map((name) => (
                <label key={name} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={name}
                    defaultChecked
                    className="rounded border-border bg-background"
                  />
                  {name.replace("show", "")}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select name="status" defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Visibility
              </label>
              <Select name="visibility" defaultValue="privateRoom">
                <option value="public">Public</option>
                <option value="privateRoom">Private Room</option>
                <option value="adminOnly">Admin Only</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Token Label{" "}
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </label>
              <Input name="tokenLabel" placeholder="e.g., Client token" />
            </div>
          </div>
          <Button type="submit">Create Room</Button>
        </form>
      )}
    </FormSection>
  );
}
