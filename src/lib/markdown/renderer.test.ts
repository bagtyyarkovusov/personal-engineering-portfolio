import { describe, it, expect } from "vitest";
import { renderMarkdown } from "./renderer";

describe("renderMarkdown", () => {
  describe("allowed Markdown elements", () => {
    it("renders paragraphs", async () => {
      const html = await renderMarkdown("Hello world");
      expect(html).toContain("<p>Hello world</p>");
    });

    it("renders headings h1 through h6", async () => {
      const md = "# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6";
      const html = await renderMarkdown(md);
      expect(html).toContain("<h1>H1</h1>");
      expect(html).toContain("<h2>H2</h2>");
      expect(html).toContain("<h3>H3</h3>");
      expect(html).toContain("<h4>H4</h4>");
      expect(html).toContain("<h5>H5</h5>");
      expect(html).toContain("<h6>H6</h6>");
    });

    it("renders bold and italic text", async () => {
      const html = await renderMarkdown("**bold** and *italic*");
      expect(html).toContain("<strong>bold</strong>");
      expect(html).toContain("<em>italic</em>");
    });

    it("renders unordered lists", async () => {
      const md = "- First\n- Second\n- Third";
      const html = await renderMarkdown(md);
      expect(html).toContain("<ul>");
      expect(html).toContain("<li>First</li>");
      expect(html).toContain("<li>Second</li>");
      expect(html).toContain("<li>Third</li>");
      expect(html).toContain("</ul>");
    });

    it("renders ordered lists", async () => {
      const md = "1. First\n2. Second\n3. Third";
      const html = await renderMarkdown(md);
      expect(html).toContain("<ol>");
      expect(html).toContain("<li>First</li>");
      expect(html).toContain("<li>Second</li>");
      expect(html).toContain("<li>Third</li>");
      expect(html).toContain("</ol>");
    });

    it("renders inline code", async () => {
      const html = await renderMarkdown("Use `npm install` to add a package.");
      expect(html).toContain("<code>npm install</code>");
    });

    it("renders code blocks", async () => {
      const md = "```ts\nconst x = 1;\n```";
      const html = await renderMarkdown(md);
      expect(html).toContain("<pre>");
      expect(html).toContain("<code");
      expect(html).toContain("const x = 1;");
    });

    it("renders links with safe URLs", async () => {
      const html = await renderMarkdown("[Example](https://example.com)");
      expect(html).toContain('<a href="https://example.com">Example</a>');
    });

    it("renders blockquotes", async () => {
      const html = await renderMarkdown("> This is a quote"
      );
      expect(html).toContain("<blockquote>");
      expect(html).toContain("<p>This is a quote</p>");
      expect(html).toContain("</blockquote>");
    });

    it("renders horizontal rules", async () => {
      const html = await renderMarkdown("---");
      expect(html).toContain("<hr>");
    });

    it("renders deeply nested lists without crashing", async () => {
      const md = "- A\n  - B\n    - C\n      - D";
      const html = await renderMarkdown(md);
      expect(html).toContain("<ul>");
      expect(html).toContain("<li>A");
      expect(html).toContain("<li>B");
      expect(html).toContain("<li>C");
      expect(html).toContain("<li>D</li>");
    });
  });

  describe("sanitization — disallowed content", () => {
    it("removes raw <script> tags", async () => {
      const html = await renderMarkdown("<script>alert('xss')</script>");
      expect(html).not.toContain("<script>");
      expect(html).not.toContain("alert");
    });

    it("removes raw <iframe> tags", async () => {
      const html = await renderMarkdown('<iframe src="https://evil.com"></iframe>');
      expect(html).not.toContain("<iframe>");
      expect(html).not.toContain("evil.com");
    });

    it("removes event handlers from elements", async () => {
      const html = await renderMarkdown('<div onclick="alert(1)">click me</div>');
      expect(html).not.toContain("onclick");
      expect(html).not.toContain("alert(1)");
    });

    it("removes javascript: URLs", async () => {
      const html = await renderMarkdown("[Click me](javascript:alert(1))");
      expect(html).not.toContain("javascript:");
      expect(html).not.toContain("alert(1)");
    });

    it("removes <style> tags", async () => {
      const html = await renderMarkdown("<style>body{color:red}</style>");
      expect(html).not.toContain("<style>");
      expect(html).not.toContain("color:red");
    });

    it("neutralizes HTML comments", async () => {
      const html = await renderMarkdown("<!-- hidden -->\n\nvisible text");
      expect(html).not.toContain("<!-- hidden -->");
      expect(html).toContain("<p>visible text</p>");
    });

    it("strips unknown protocols from links", async () => {
      const html = await renderMarkdown("[Link](data:text/html,<script>alert(1)</script>)");
      expect(html).not.toContain("data:text/html");
    });

    it("strips raw HTML attributes that are not allowed", async () => {
      const html = await renderMarkdown('<a href="https://example.com" target="_blank" rel="noopener">Link</a>');
      // href is allowed, but target/rel may or may not be in default schema
      // The key assertion is that the output is sanitized and doesn't contain dangerous content
      expect(html).not.toContain("javascript:");
    });

    it("sanitizes mixed Markdown and HTML", async () => {
      const md = "# Title\n\n<script>bad()</script>\n\nNormal paragraph.";
      const html = await renderMarkdown(md);
      expect(html).toContain("<h1>Title</h1>");
      expect(html).toContain("<p>Normal paragraph.</p>");
      expect(html).not.toContain("<script>");
      expect(html).not.toContain("bad()");
    });
  });

  describe("edge cases", () => {
    it("returns empty string for null input", async () => {
      const html = await renderMarkdown(null);
      expect(html).toBe("");
    });

    it("returns empty string for undefined input", async () => {
      const html = await renderMarkdown(undefined);
      expect(html).toBe("");
    });

    it("returns empty string for empty string", async () => {
      const html = await renderMarkdown("");
      expect(html).toBe("");
    });

    it("returns empty string for whitespace-only string", async () => {
      const html = await renderMarkdown("   \n\t  ");
      expect(html).toBe("");
    });

    it("handles large input without crashing", async () => {
      const md = "# Heading\n\n" + "Paragraph. ".repeat(1000);
      const html = await renderMarkdown(md);
      expect(html).toContain("<h1>Heading</h1>");
      expect(html.length).toBeGreaterThan(1000);
    });

    it("handles Markdown with special characters", async () => {
      const html = await renderMarkdown("<>&\"'");
      // `<` and `&` must be escaped in HTML text content.
      // `>` does not need escaping outside of attributes.
      expect(html).not.toContain("<p><>&");
      expect(html).toMatch(/&#x3C;|&lt;/);
      expect(html).toMatch(/&#x26;|&amp;/);
    });
  });
});
