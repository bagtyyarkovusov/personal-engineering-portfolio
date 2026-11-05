import { describe, expect, it } from "vitest";
import {
  getFallbackProjectSitemapEntries,
  PUBLIC_PROJECT_FALLBACK_SLUGS,
} from "./sitemap-data";

describe("public project sitemap fallback", () => {
  it("contains every current public case study", () => {
    const lastModified = new Date("2026-11-06T00:00:00.000Z");

    expect(getFallbackProjectSitemapEntries(lastModified)).toEqual([
      { slug: "car-marketplace", updatedAt: lastModified },
      { slug: "tayyn-hyzmat", updatedAt: lastModified },
      { slug: "myorl-ent-clinic", updatedAt: lastModified },
      {
        slug: "personal-engineering-portfolio",
        updatedAt: lastModified,
      },
    ]);
  });

  it("does not expose archived, admin-only, draft or private-room projects", () => {
    expect(PUBLIC_PROJECT_FALLBACK_SLUGS).not.toEqual(
      expect.arrayContaining([
        "gonka-ai-inference-infrastructure",
        "tm-whatsapp",
        "draft-project",
        "private-room-project",
      ]),
    );
  });
});
