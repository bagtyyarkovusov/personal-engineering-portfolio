import { describe, expect, it } from "vitest";
import {
  getFallbackProjectSitemapEntries,
  PUBLIC_PROJECT_FALLBACK_SLUGS,
} from "./sitemap-data";

describe("public project sitemap fallback", () => {
  it("contains every current public case study", () => {
    const lastModified = new Date("2026-11-06T00:00:00.000Z");

    expect(getFallbackProjectSitemapEntries(lastModified)).toEqual(
      PUBLIC_PROJECT_FALLBACK_SLUGS.map((slug) => ({
        slug,
        updatedAt: lastModified,
      })),
    );
  });

  it("does not expose archived or admin-only projects", () => {
    expect(PUBLIC_PROJECT_FALLBACK_SLUGS).not.toContain(
      "gonka-ai-inference-infrastructure",
    );
    expect(PUBLIC_PROJECT_FALLBACK_SLUGS).not.toContain("tm-whatsapp");
  });
});
