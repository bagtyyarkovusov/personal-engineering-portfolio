"use client";

import { cn } from "@/lib/utils";

export type AvailabilityStatus = "open" | "limited" | "booked";

/* Single source of truth for the site-wide availability signal. */
export const CURRENT_AVAILABILITY: AvailabilityStatus = "open";

interface AvailabilityBadgeProps {
  status?: AvailabilityStatus;
  className?: string;
}

export const availabilityConfig: Record<
  AvailabilityStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  open: {
    label: "Open to projects",
    dot: "bg-status-verified",
    bg: "bg-status-verified/10",
    text: "text-status-verified",
  },
  limited: {
    label: "Limited availability, book a call",
    dot: "bg-status-attention",
    bg: "bg-status-attention/10",
    text: "text-status-attention",
  },
  booked: {
    label: "Fully booked, join the waitlist",
    dot: "bg-status-risk",
    bg: "bg-status-risk/10",
    text: "text-status-risk",
  },
};

export function AvailabilityBadge({
  status = CURRENT_AVAILABILITY,
  className,
}: AvailabilityBadgeProps) {
  const c = availabilityConfig[status];
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
