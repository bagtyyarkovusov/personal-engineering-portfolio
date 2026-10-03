import { describe, it, expect, vi, beforeEach } from "vitest";
import { ContentStatus, ContentVisibility } from "@prisma/client";

const findManyMock = vi.fn();
const findFirstMock = vi.fn();

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    buildLogEntry: {
      findMany: (...args: unknown[]) => findManyMock(...args),
      findFirst: (...args: unknown[]) => findFirstMock(...args),
    },
  },
}));

import {
  getPublishedPublicBuildLogEntries,
  getPublishedPublicBuildLogEntriesByProject,
  getLatestPublicBuildLogEntry,
} from "./queries";

describe("getPublishedPublicBuildLogEntries", () => {
  beforeEach(() => vi.clearAllMocks());

  it("queries published + public entries ordered by occurredAt desc", async () => {
    findManyMock.mockResolvedValue([]);
    await getPublishedPublicBuildLogEntries();
    const callArg = findManyMock.mock.calls[0][0];
    expect(callArg.where).toEqual({
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    });
    expect(callArg.orderBy).toEqual({ occurredAt: "desc" });
  });

  it("returns entries from Prisma", async () => {
    const entries = [{ id: "1", title: "Update" }];
    findManyMock.mockResolvedValue(entries);
    expect(await getPublishedPublicBuildLogEntries()).toBe(entries);
  });
});

describe("getLatestPublicBuildLogEntry", () => {
  beforeEach(() => vi.clearAllMocks());

  it("queries the most recent published + public entry with its project", async () => {
    findFirstMock.mockResolvedValue(null);
    await getLatestPublicBuildLogEntry();
    const callArg = findFirstMock.mock.calls[0][0];
    expect(callArg.where).toEqual({
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    });
    expect(callArg.orderBy).toEqual({ occurredAt: "desc" });
    expect(callArg.include).toEqual({
      project: { select: { id: true, slug: true, title: true } },
    });
  });

  it("returns null when no entries exist", async () => {
    findFirstMock.mockResolvedValue(null);
    expect(await getLatestPublicBuildLogEntry()).toBeNull();
  });

  it("returns the entry from Prisma", async () => {
    const entry = {
      id: "1",
      title: "Update",
      project: { id: "p1", slug: "test", title: "Test" },
    };
    findFirstMock.mockResolvedValue(entry);
    expect(await getLatestPublicBuildLogEntry()).toBe(entry);
  });
});

describe("getPublishedPublicBuildLogEntriesByProject", () => {
  beforeEach(() => vi.clearAllMocks());

  it("filters by projectId plus published + public", async () => {
    findManyMock.mockResolvedValue([]);
    await getPublishedPublicBuildLogEntriesByProject("project-123");
    const callArg = findManyMock.mock.calls[0][0];
    expect(callArg.where).toEqual({
      projectId: "project-123",
      status: ContentStatus.published,
      visibility: ContentVisibility.public,
    });
  });

  it("returns empty array when no entries found", async () => {
    findManyMock.mockResolvedValue([]);
    expect(await getPublishedPublicBuildLogEntriesByProject("empty")).toEqual([]);
  });

  it("returns entries with project include", async () => {
    const entries = [{ id: "1", title: "Update", project: { id: "p1", slug: "test", title: "Test" } }];
    findManyMock.mockResolvedValue(entries);
    expect(await getPublishedPublicBuildLogEntriesByProject("p1")).toBe(entries);
  });
});
