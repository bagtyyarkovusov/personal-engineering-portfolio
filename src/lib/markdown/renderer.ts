import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

/**
 * Safe Markdown rendering pipeline.
 *
 * Transforms Markdown source into sanitized HTML using:
 *   remark-parse → remark-rehype → rehype-sanitize → rehype-stringify
 *
 * rehype-sanitize uses a default GitHub-like schema that strips:
 *   - <script>, <style>, <iframe> and other dangerous tags
 *   - Event handlers (onclick, onerror, etc.)
 *   - javascript: URLs
 *   - Unknown protocols and raw HTML attributes
 *
 * The returned HTML is safe to render via dangerouslySetInnerHTML.
 *
 * @param source Raw Markdown string.
 * @returns Sanitized HTML string. Returns empty string for null/undefined/whitespace-only input.
 */
export async function renderMarkdown(source: string | null | undefined): Promise<string> {
  if (!source || source.trim().length === 0) {
    return "";
  }

  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(source);

  return String(result);
}
