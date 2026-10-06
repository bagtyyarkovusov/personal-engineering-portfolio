import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Build-time loader for Markdown blog posts.
 *
 * Posts live as `*.md` files next to this module, with a flat YAML
 * frontmatter block:
 *
 *   ---
 *   title: ...
 *   date: YYYY-MM-DD
 *   description: ...
 *   slug: ...
 *   draft: true | false   (optional, defaults to false)
 *   ---
 *
 * The frontmatter grammar is intentionally a strict subset — flat
 * `key: value` pairs only — so no YAML dependency is needed.
 */

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

const WORDS_PER_MINUTE = 200;

export interface BlogFrontmatter {
  title: string;
  /** Publication date as an ISO `YYYY-MM-DD` string. */
  date: string;
  description: string;
  slug: string;
  draft: boolean;
}

export interface BlogPost extends BlogFrontmatter {
  /** Markdown body with the frontmatter block removed. */
  body: string;
  readingTimeMinutes: number;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

const REQUIRED_KEYS = ["title", "date", "description", "slug"] as const;

function parseScalar(raw: string): string | boolean {
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

/**
 * Parse a Markdown source string into validated frontmatter and body.
 * Throws on a missing block, unknown keys, or missing/invalid fields.
 */
export function parseFrontmatter(
  source: string,
  fileName = "<memory>",
): { frontmatter: BlogFrontmatter; body: string } {
  const match = FRONTMATTER_RE.exec(source);
  if (!match) {
    throw new Error(`${fileName}: missing or malformed frontmatter block`);
  }

  const [, block, body] = match;
  const data: Record<string, string | boolean> = {};

  for (const line of block.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf(":");
    if (separator === -1) {
      throw new Error(`${fileName}: invalid frontmatter line "${trimmed}"`);
    }
    const key = trimmed.slice(0, separator).trim();
    data[key] = parseScalar(trimmed.slice(separator + 1));
  }

  for (const key of REQUIRED_KEYS) {
    const value = data[key];
    if (typeof value !== "string" || value.length === 0) {
      throw new Error(`${fileName}: frontmatter is missing "${key}"`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date as string)) {
    throw new Error(
      `${fileName}: frontmatter "date" must be YYYY-MM-DD, got "${data.date}"`,
    );
  }

  return {
    frontmatter: {
      title: data.title as string,
      date: data.date as string,
      description: data.description as string,
      slug: data.slug as string,
      draft: data.draft === true,
    },
    body: body.trim(),
  };
}

/**
 * Estimate reading time in minutes from a Markdown body.
 * Markdown syntax is stripped before counting words.
 */
export function computeReadingTimeMinutes(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_[\]()\-]/g, " ");
  const words = text.split(/\s+/).filter((word) => /\w/.test(word)).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function loadPosts(dir: string): BlogPost[] {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const source = readFileSync(path.join(dir, file), "utf8");
      const { frontmatter, body } = parseFrontmatter(source, file);
      if (frontmatter.slug !== file.replace(/\.md$/, "")) {
        throw new Error(
          `${file}: frontmatter "slug" must match the file name`,
        );
      }
      return {
        ...frontmatter,
        body,
        readingTimeMinutes: computeReadingTimeMinutes(body),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Format a `YYYY-MM-DD` date for display, pinned to UTC to avoid TZ drift. */
export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** All posts, newest first, including drafts. */
export function getAllPosts(dir: string = BLOG_DIR): BlogPost[] {
  return loadPosts(dir);
}

/** Published (non-draft) posts, newest first. */
export function getPublishedPosts(dir: string = BLOG_DIR): BlogPost[] {
  return loadPosts(dir).filter((post) => !post.draft);
}

/** A single published post by slug, or undefined (also for drafts). */
export function getPublishedPostBySlug(
  slug: string,
  dir: string = BLOG_DIR,
): BlogPost | undefined {
  return getPublishedPosts(dir).find((post) => post.slug === slug);
}
