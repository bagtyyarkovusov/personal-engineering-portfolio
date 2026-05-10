import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  /** Sanitized HTML string from renderMarkdown(). */
  html: string;
  className?: string;
}

/**
 * Render sanitized Markdown HTML inside a styled prose container.
 *
 * The `html` prop must already be sanitized (e.g. via renderMarkdown).
 * This component applies design-system typography and spacing classes
 * so Markdown output inherits the portfolio's visual language.
 */
export function MarkdownContent({ html, className }: MarkdownContentProps) {
  if (!html || html.trim().length === 0) {
    return null;
  }

  return (
    <div
      className={cn("prose", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
