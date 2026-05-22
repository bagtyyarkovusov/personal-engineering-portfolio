"use client";

import { useState } from "react";

import { Mail, Archive, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ContactSubmission, ContactStatus, InquiryType } from "@prisma/client";

interface Props {
  submissions: ContactSubmission[];
}

const statusLabels: Record<ContactStatus, string> = {
  new: "New",
  read: "Read",
  archived: "Archived",
};

const statusVariants: Record<ContactStatus, "default" | "secondary" | "outline"> = {
  new: "default",
  read: "secondary",
  archived: "outline",
};

const inquiryLabels: Record<InquiryType, string> = {
  hiring: "Hiring",
  project: "Project",
  consulting: "Consulting",
  other: "Other",
};

export function ContactSubmissionManager({ submissions: initial }: Props) {
  const [submissions, setSubmissions] = useState(initial);
  const [filter, setFilter] = useState<ContactStatus | "all">("all");

  async function updateStatus(id: string, status: ContactStatus) {
    const res = await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    }
  }

  const filtered =
    filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 p-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl tracking-tight">Contact Submissions</h1>
          <p className="text-sm text-muted-foreground">
            {submissions.filter((s) => s.status === "new").length} new,{" "}
            {submissions.length} total
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "new", "read", "archived"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : statusLabels[f]}
            </Button>
          ))}
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border p-12 text-center text-muted-foreground">
          <Mail className="mx-auto mb-3 size-8 opacity-40" />
          <p className="font-medium">No submissions yet</p>
          <p className="text-sm">Inquiries from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className={`rounded-lg border p-5 transition-opacity ${
                s.status === "archived" ? "opacity-60" : ""
              } ${s.status === "new" ? "border-primary/30 bg-primary/[0.02]" : "border-border"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{s.name}</span>
                    <Badge variant={statusVariants[s.status]}>
                      {statusLabels[s.status]}
                    </Badge>
                    <Badge variant="outline">{inquiryLabels[s.inquiryType]}</Badge>
                  </div>
                  <a
                    href={`mailto:${s.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {s.email}
                  </a>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(new Date(s.createdAt))}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {s.message}
              </p>

              <div className="mt-4 flex gap-2">
                {s.status === "new" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(s.id, "read")}
                  >
                    <Eye className="mr-1.5 size-3.5" />
                    Mark as read
                  </Button>
                )}
                {s.status === "read" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(s.id, "new")}
                  >
                    <EyeOff className="mr-1.5 size-3.5" />
                    Mark as unread
                  </Button>
                )}
                {s.status !== "archived" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatus(s.id, "archived")}
                  >
                    <Archive className="mr-1.5 size-3.5" />
                    Archive
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatus(s.id, "read")}
                  >
                    <Eye className="mr-1.5 size-3.5" />
                    Restore
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
