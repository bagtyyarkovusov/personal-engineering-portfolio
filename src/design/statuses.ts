/**
 * Semantic status vocabulary for the design system.
 *
 * Status colors mean state, never decoration.
 * Reused across:
 *   - public project pages
 *   - admin dashboard
 *   - private rooms
 *   - pipeline evidence
 *   - Three.js system map
 */

export const Status = {
  VERIFIED: "verified",
  IN_PROGRESS: "inProgress",
  ATTENTION: "attention",
  RISK: "risk",
  NEUTRAL: "neutral",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export interface StatusConfig {
  /** Human-readable label */
  label: string;
  /** Short label for dense UI */
  labelShort: string;
  /** CSS variable name for the status color */
  cssVar: string;
  /** CSS variable name for the foreground color */
  cssVarForeground: string;
  /** Tailwind class for background color */
  bgClass: string;
  /** Tailwind class for text color */
  textClass: string;
  /** Combined Tailwind badge classes (bg + text) */
  badgeClass: string;
  /** Description of when this status applies */
  description: string;
}

export const statusConfig: Record<Status, StatusConfig> = {
  [Status.VERIFIED]: {
    label: "Verified",
    labelShort: "OK",
    cssVar: "--status-verified",
    cssVarForeground: "--status-verified-foreground",
    bgClass: "bg-status-verified",
    textClass: "text-status-verified",
    badgeClass: "bg-status-verified text-status-verified-foreground",
    description:
      "Passing tests, deployed, approved, production-ready, completed milestones",
  },
  [Status.IN_PROGRESS]: {
    label: "In Progress",
    labelShort: "Active",
    cssVar: "--status-in-progress",
    cssVarForeground: "--status-in-progress-foreground",
    bgClass: "bg-status-in-progress",
    textClass: "text-status-in-progress",
    badgeClass: "bg-status-in-progress text-status-in-progress-foreground",
    description: "Active build, current milestone, running pipeline, ongoing work",
  },
  [Status.ATTENTION]: {
    label: "Attention",
    labelShort: "Alert",
    cssVar: "--status-attention",
    cssVarForeground: "--status-attention-foreground",
    bgClass: "bg-status-attention",
    textClass: "text-status-attention",
    badgeClass: "bg-status-attention text-status-attention-foreground",
    description: "Blocked, needs review, pending decision, partial evidence",
  },
  [Status.RISK]: {
    label: "Risk",
    labelShort: "Error",
    cssVar: "--status-risk",
    cssVarForeground: "--status-risk-foreground",
    bgClass: "bg-status-risk",
    textClass: "text-status-risk",
    badgeClass: "bg-status-risk text-status-risk-foreground",
    description:
      "Failed checks, revoked access, invalid token, deployment failure",
  },
  [Status.NEUTRAL]: {
    label: "Neutral",
    labelShort: "Draft",
    cssVar: "--status-neutral",
    cssVarForeground: "--status-neutral-foreground",
    bgClass: "bg-status-neutral",
    textClass: "text-status-neutral",
    badgeClass: "bg-status-neutral text-status-neutral-foreground",
    description: "Draft, archived, unavailable, not started, metadata",
  },
} as const;

/** All status values as an array for iteration */
export const allStatuses: Status[] = Object.values(Status);

/** Get the config for a given status */
export function getStatusConfig(status: Status): StatusConfig {
  return statusConfig[status];
}

/** Resolve a status CSS variable value at runtime (for inline styles) */
export function getStatusColor(
  status: Status,
  type: "background" | "foreground" = "background"
): string {
  const config = statusConfig[status];
  return type === "background" ? config.cssVar : config.cssVarForeground;
}
