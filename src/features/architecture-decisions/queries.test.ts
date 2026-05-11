import { describe, it, expect } from "vitest";
import { buildVisibilityFilter } from "@/lib/publication/policy";
import { ContentStatus, ContentVisibility } from "@prisma/client";

describe("buildVisibilityFilter for architecture decisions", () => {
  it("filters to published + public for the public surface", () => {
    expect(buildVisibilityFilter("public")).toEqual({
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    });
  });
  it("returns empty object for admin surface", () => {
    expect(buildVisibilityFilter("admin")).toEqual({});
  });
  it("filters to published + privateRoom for the privateRoom surface", () => {
    expect(buildVisibilityFilter("privateRoom")).toEqual({
      status: ContentStatus.published,
      visibility: ContentVisibility.privateRoom,
    });
  });
});
