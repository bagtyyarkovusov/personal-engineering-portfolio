import { describe, it, expect, vi, beforeEach } from "vitest";
import { ContentStatus, ContentVisibility } from "@prisma/client";

const findManyMock = vi.fn();
const findFirstMock = vi.fn();

vi.mock("@/lib/db/prisma", () => {
  return {
    prisma: {
      project: {
        findMany: (...args: unknown[]) => findManyMock(...args),
        findFirst: (...args: unknown[]) => findFirstMock(...args),
      },
    },
  };
});

import {
  getPublishedPublicProjects,
  getPublishedPublicProjectBySlug,
} from "./queries";

describe("getPublishedPublicProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries only published + public projects", async () => {
    findManyMock.mockResolvedValue([]);

    await getPublishedPublicProjects();

    expect(findManyMock).toHaveBeenCalledTimes(1);
    const callArg = findManyMock.mock.calls[0][0];
    expect(callArg.where).toEqual({
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    });
  });

  it("orders results by ascending order field", async () => {
    findManyMock.mockResolvedValue([]);

    await getPublishedPublicProjects();

    const callArg = findManyMock.mock.calls[0][0];
    expect(callArg.orderBy).toEqual({ order: "asc" });
  });

  it("returns the projects from Prisma", async () => {
    const seededProjects = [
      { id: "1", slug: "portfolio", title: "Portfolio", order: 0 },
      { id: "2", slug: "car-marketplace", title: "Car Marketplace", order: 1 },
    ];
    findManyMock.mockResolvedValue(seededProjects);

    const result = await getPublishedPublicProjects();

    expect(result).toBe(seededProjects);
  });
});

describe("getPublishedPublicProjectBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries by slug with published + public filter", async () => {
    findFirstMock.mockResolvedValue(null);
    const slug = "car-marketplace";

    await getPublishedPublicProjectBySlug(slug);

    expect(findFirstMock).toHaveBeenCalledTimes(1);
    const callArg = findFirstMock.mock.calls[0][0];
    expect(callArg.where).toEqual({
      slug,
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    });
  });

  it("returns the project when found", async () => {
    const project = {
      id: "2",
      slug: "car-marketplace",
      title: "Car Marketplace",
    };
    findFirstMock.mockResolvedValue(project);

    const result = await getPublishedPublicProjectBySlug("car-marketplace");

    expect(result).toBe(project);
  });

  it("returns null when no matching project exists", async () => {
    findFirstMock.mockResolvedValue(null);

    const result = await getPublishedPublicProjectBySlug("missing-project");

    expect(result).toBeNull();
  });
});
