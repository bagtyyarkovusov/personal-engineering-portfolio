/**
 * Canonical design token export module.
 *
 * Tokens are defined in `src/app/globals.css` as CSS custom properties
 * and mapped to Tailwind via `@theme inline`. This module provides
 * TypeScript-level documentation and helper access.
 *
 * When adding new tokens, update BOTH:
 *   1. `src/app/globals.css` — CSS custom property + `@theme inline` mapping
 *   2. This file — TypeScript documentation and helpers
 */

/** Semantic surface tokens */
export const surfaceTokens = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  card: "var(--card)",
  "card-foreground": "var(--card-foreground)",
  popover: "var(--popover)",
  "popover-foreground": "var(--popover-foreground)",
} as const;

/** Semantic action tokens */
export const actionTokens = {
  primary: "var(--primary)",
  "primary-foreground": "var(--primary-foreground)",
  secondary: "var(--secondary)",
  "secondary-foreground": "var(--secondary-foreground)",
  muted: "var(--muted)",
  "muted-foreground": "var(--muted-foreground)",
  accent: "var(--accent)",
  "accent-foreground": "var(--accent-foreground)",
  destructive: "var(--destructive)",
  "destructive-foreground": "var(--destructive-foreground)",
} as const;

/** Structural tokens */
export const structuralTokens = {
  border: "var(--border)",
  input: "var(--input)",
  ring: "var(--ring)",
} as const;

/** Chart / data-viz tokens (map to status palette) */
export const chartTokens = {
  "chart-1": "var(--chart-1)",
  "chart-2": "var(--chart-2)",
  "chart-3": "var(--chart-3)",
  "chart-4": "var(--chart-4)",
  "chart-5": "var(--chart-5)",
} as const;

/** All token categories combined */
export const tokens = {
  ...surfaceTokens,
  ...actionTokens,
  ...structuralTokens,
  ...chartTokens,
} as const;

export type TokenName = keyof typeof tokens;

/** Resolve a token value at runtime (for inline styles) */
export function getToken(name: TokenName): string {
  return tokens[name];
}

/** Radius token */
export const radius = {
  sm: "calc(var(--radius) - 4px)",
  md: "calc(var(--radius) - 2px)",
  lg: "var(--radius)",
  xl: "calc(var(--radius) + 4px)",
} as const;
