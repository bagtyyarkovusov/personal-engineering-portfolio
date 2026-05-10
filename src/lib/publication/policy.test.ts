import { describe, it, expect } from "vitest";
import { ContentStatus, ContentVisibility } from "@prisma/client";
import { isVisibleOn, buildVisibilityFilter } from "./policy";

describe("isVisibleOn", () => {
  describe("admin surface", () => {
    it("sees draft + public", () => {
      expect(
        isVisibleOn("admin", {
          status: ContentStatus.draft,
          visibility: ContentVisibility.public,
        })
      ).toBe(true);
    });

    it("sees published + public", () => {
      expect(
        isVisibleOn("admin", {
          status: ContentStatus.published,
          visibility: ContentVisibility.public,
        })
      ).toBe(true);
    });

    it("sees archived + adminOnly", () => {
      expect(
        isVisibleOn("admin", {
          status: ContentStatus.archived,
          visibility: ContentVisibility.adminOnly,
        })
      ).toBe(true);
    });

    it("sees all status and visibility combinations", () => {
      const statuses = Object.values(ContentStatus);
      const visibilities = Object.values(ContentVisibility);

      for (const status of statuses) {
        for (const visibility of visibilities) {
          expect(isVisibleOn("admin", { status, visibility })).toBe(true);
        }
      }
    });
  });

  describe("public surface", () => {
    it("shows published + public", () => {
      expect(
        isVisibleOn("public", {
          status: ContentStatus.published,
          visibility: ContentVisibility.public,
        })
      ).toBe(true);
    });

    it("hides published + privateRoom", () => {
      expect(
        isVisibleOn("public", {
          status: ContentStatus.published,
          visibility: ContentVisibility.privateRoom,
        })
      ).toBe(false);
    });

    it("hides published + adminOnly", () => {
      expect(
        isVisibleOn("public", {
          status: ContentStatus.published,
          visibility: ContentVisibility.adminOnly,
        })
      ).toBe(false);
    });

    it("hides draft + public", () => {
      expect(
        isVisibleOn("public", {
          status: ContentStatus.draft,
          visibility: ContentVisibility.public,
        })
      ).toBe(false);
    });

    it("hides archived + public", () => {
      expect(
        isVisibleOn("public", {
          status: ContentStatus.archived,
          visibility: ContentVisibility.public,
        })
      ).toBe(false);
    });
  });

  describe("privateRoom surface", () => {
    it("shows published + privateRoom", () => {
      expect(
        isVisibleOn("privateRoom", {
          status: ContentStatus.published,
          visibility: ContentVisibility.privateRoom,
        })
      ).toBe(true);
    });

    it("hides published + public", () => {
      expect(
        isVisibleOn("privateRoom", {
          status: ContentStatus.published,
          visibility: ContentVisibility.public,
        })
      ).toBe(false);
    });

    it("hides published + adminOnly", () => {
      expect(
        isVisibleOn("privateRoom", {
          status: ContentStatus.published,
          visibility: ContentVisibility.adminOnly,
        })
      ).toBe(false);
    });

    it("hides draft + privateRoom", () => {
      expect(
        isVisibleOn("privateRoom", {
          status: ContentStatus.draft,
          visibility: ContentVisibility.privateRoom,
        })
      ).toBe(false);
    });

    it("hides archived + privateRoom", () => {
      expect(
        isVisibleOn("privateRoom", {
          status: ContentStatus.archived,
          visibility: ContentVisibility.privateRoom,
        })
      ).toBe(false);
    });
  });
});

describe("buildVisibilityFilter", () => {
  it("returns empty filter for admin", () => {
    expect(buildVisibilityFilter("admin")).toEqual({});
  });

  it("returns published + public filter for public surface", () => {
    expect(buildVisibilityFilter("public")).toEqual({
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    });
  });

  it("returns published + privateRoom filter for privateRoom surface", () => {
    expect(buildVisibilityFilter("privateRoom")).toEqual({
      status: ContentStatus.published,
      visibility: ContentVisibility.privateRoom,
    });
  });
});
