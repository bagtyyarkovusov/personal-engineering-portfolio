import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  parseFrontmatter,
  computeReadingTimeMinutes,
  getAllPosts,
  getPublishedPosts,
  getPublishedPostBySlug,
} from "./loader";

const VALID_SOURCE = `---
title: Test Post
date: 2026-10-04
description: A test post.
slug: test-post
---

Hello world.
`;

describe("parseFrontmatter", () => {
  it("parses required fields and strips the block from the body", () => {
    const { frontmatter, body } = parseFrontmatter(VALID_SOURCE);
    expect(frontmatter).toEqual({
      title: "Test Post",
      date: "2026-10-04",
      description: "A test post.",
      slug: "test-post",
      draft: false,
    });
    expect(body).toBe("Hello world.");
  });

  it("parses the optional draft flag", () => {
    const source = VALID_SOURCE.replace(
      "slug: test-post",
      "slug: test-post\ndraft: true",
    );
    expect(parseFrontmatter(source).frontmatter.draft).toBe(true);
  });

  it("unquotes quoted scalar values", () => {
    const source = VALID_SOURCE.replace(
      "title: Test Post",
      'title: "Test: Post"',
    );
    expect(parseFrontmatter(source).frontmatter.title).toBe("Test: Post");
  });

  it("throws when the frontmatter block is missing", () => {
    expect(() => parseFrontmatter("# No frontmatter")).toThrow(
      /missing or malformed frontmatter/,
    );
  });

  it("throws when a required field is missing", () => {
    const source = VALID_SOURCE.replace("description: A test post.\n", "");
    expect(() => parseFrontmatter(source, "post.md")).toThrow(
      'post.md: frontmatter is missing "description"',
    );
  });

  it("throws on a malformed date", () => {
    const source = VALID_SOURCE.replace("date: 2026-10-04", "date: October 4");
    expect(() => parseFrontmatter(source)).toThrow(/must be YYYY-MM-DD/);
  });
});

describe("computeReadingTimeMinutes", () => {
  it("returns 1 minute for short bodies", () => {
    expect(computeReadingTimeMinutes("Just a few words.")).toBe(1);
  });

  it("rounds up at 200 words per minute", () => {
    const words = Array.from({ length: 401 }, () => "word").join(" ");
    expect(computeReadingTimeMinutes(words)).toBe(3);
  });

  it("ignores markdown syntax and code fences when counting", () => {
    const markdown = `## Heading\n\n\`\`\`ts\nconst x = 1;\n\`\`\`\n\n**bold** text`;
    expect(computeReadingTimeMinutes(markdown)).toBe(1);
  });
});

describe("loader directory queries", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "blog-loader-"));
    writeFileSync(
      path.join(dir, "older-post.md"),
      `---\ntitle: Older\ndate: 2026-01-01\ndescription: Older post.\nslug: older-post\n---\n\nOlder body.\n`,
    );
    writeFileSync(
      path.join(dir, "newer-post.md"),
      `---\ntitle: Newer\ndate: 2026-06-01\ndescription: Newer post.\nslug: newer-post\n---\n\nNewer body.\n`,
    );
    writeFileSync(
      path.join(dir, "draft-post.md"),
      `---\ntitle: Draft\ndate: 2026-09-01\ndescription: Draft post.\nslug: draft-post\ndraft: true\n---\n\nDraft body.\n`,
    );
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("getAllPosts returns every post newest first with reading time", () => {
    const posts = getAllPosts(dir);
    expect(posts.map((post) => post.slug)).toEqual([
      "draft-post",
      "newer-post",
      "older-post",
    ]);
    expect(posts[0].readingTimeMinutes).toBe(1);
  });

  it("getPublishedPosts excludes drafts", () => {
    expect(getPublishedPosts(dir).map((post) => post.slug)).toEqual([
      "newer-post",
      "older-post",
    ]);
  });

  it("getPublishedPostBySlug returns a published post", () => {
    expect(getPublishedPostBySlug("newer-post", dir)?.title).toBe("Newer");
  });

  it("getPublishedPostBySlug hides drafts and unknown slugs", () => {
    expect(getPublishedPostBySlug("draft-post", dir)).toBeUndefined();
    expect(getPublishedPostBySlug("nope", dir)).toBeUndefined();
  });

  it("throws when the slug does not match the file name", () => {
    writeFileSync(
      path.join(dir, "mismatch.md"),
      `---\ntitle: Mismatch\ndate: 2026-01-02\ndescription: Mismatch.\nslug: other\n---\n\nBody.\n`,
    );
    expect(() => getAllPosts(dir)).toThrow(/must match the file name/);
  });
});
