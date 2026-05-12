import { ScrollText } from "lucide-react";
import { EmptyState } from "@/components/admin/empty-state";

export const metadata = { title: "Build Logs — Admin" };

export default function AdminBuildLogsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-8">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl tracking-tight">Build Logs</h1>
        <p className="text-sm text-muted-foreground">
          Document build processes, CI/CD runs, and deployment notes.
        </p>
      </header>
      <EmptyState
        icon={ScrollText}
        title="No build log entries yet"
        description="Create build log entries to document active development progress. Published entries appear on the public Build Log page."
        action={{ label: "Create Entry", href: "/admin/build-logs/new" }}
      />
    </div>
  );
}
