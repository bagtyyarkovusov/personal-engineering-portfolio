import { describe, it, expect } from "vitest";
import { buildVisibilityFilter } from "@/lib/publication/policy";
import { ContentStatus, ContentVisibility } from "@prisma/client";

describe("buildVisibilityFilter for build log entries", () => {
  it("filters to published + public for the public surface", () => {
    expect(buildVisibilityFilter("public")).toEqual({
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    });
  });
});
