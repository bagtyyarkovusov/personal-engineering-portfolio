"use client";

import { cn } from "@/lib/utils";

type AvailabilityStatus = "open" | "limited" | "booked";

interface AvailabilityBadgeProps {
  status?: AvailabilityStatus;
  className?: string;
}

const config: Record<
  AvailabilityStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  open: {
    label: "Open for projects — starting June 2026",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
  },
  limited: {
    label: "Limited availability — book a call",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-800",
  },
  booked: {
    label: "Fully booked — join waitlist",
    dot: "bg-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-800",
  },
};

export function AvailabilityBadge({
  status = "open",
  className,
}: AvailabilityBadgeProps) {
  const c = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
        c.bg,
        c.text,
        className
      )}
    >
      <span className={cn("size-2 animate-pulse rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}
