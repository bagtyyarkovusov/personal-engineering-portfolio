"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/admin/error-state";

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin page error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl p-8">
      <header className="space-y-1 mb-8">
        <h1 className="font-serif text-3xl tracking-tight">Admin</h1>
      </header>
      <ErrorState
        title="Failed to load this page"
        description={error.message || "An unexpected error occurred. Try again or check the server logs."}
        onRetry={reset}
      />
    </div>
  );
}
