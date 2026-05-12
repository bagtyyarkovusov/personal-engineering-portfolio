import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  /** Number of skeleton rows to render */
  rows?: number;
}

export function LoadingState({ rows = 4 }: LoadingStateProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-[30%]" />
          <Skeleton className="h-3 w-full" />
          {i % 2 === 0 && <Skeleton className="h-3 w-[70%]" />}
        </div>
      ))}
    </div>
  );
}

interface FormPendingStateProps {
  label?: string;
}

export function FormPendingState({ label = "Saving..." }: FormPendingStateProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
