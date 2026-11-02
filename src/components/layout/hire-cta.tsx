import { ArrowUpRight } from "lucide-react";
import { HIRE_LINKS } from "@/lib/links";
import { cn } from "@/lib/utils";

const base =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/* The two hire paths, shown under the home intro and at the end of each case study. */
export function HireCta({ className }: { className?: string }) {
  return (
    <div
      data-testid="hire-cta"
      className={cn("flex flex-wrap items-center gap-3", className)}
    >
      <a
        href={HIRE_LINKS.upwork.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, "bg-primary text-primary-foreground hover:bg-primary/90")}
      >
        {HIRE_LINKS.upwork.label}
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>
      <a
        href={HIRE_LINKS.call.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, "border border-border text-foreground hover:bg-accent")}
      >
        {HIRE_LINKS.call.label}
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
