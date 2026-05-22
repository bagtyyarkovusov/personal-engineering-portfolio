"use client";

import { useState } from "react";
import { Plus, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateTokenFormProps {
  roomId: string;
  createTokenAction: (
    formData: FormData,
  ) => Promise<{ raw: string; label: string | null } | null>;
}

export function CreateTokenForm({
  roomId,
  createTokenAction,
}: CreateTokenFormProps) {
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(formData: FormData) {
    formData.set("roomId", roomId);
    const result = await createTokenAction(formData);
    if (result?.raw) {
      setRawToken(result.raw);
    }
  }

  async function copyToClipboard() {
    if (rawToken) {
      await navigator.clipboard.writeText(rawToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (rawToken) {
    return (
      <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-50 dark:bg-amber-950/20 p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Token Created - Copy it now
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              This token will not be shown again. Store it securely.
            </p>
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
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="mb-4 flex items-end gap-2">
      <div className="flex-1">
        <label className="block text-xs text-muted-foreground mb-1">
          Label (optional)
        </label>
        <Input
          name="label"
          placeholder="e.g., Stakeholder review"
        />
      </div>
      <Button type="submit" className="flex items-center gap-1">
        <Plus className="size-3.5" />
        Create Token
      </Button>
    </form>
  );
}
