import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  validateTokenMock,
  findUniqueMock,
  findManyMilestonesMock,
  findManyBuildLogsMock,
  findManyArchitectureMock,
  findManyPipelineMock,
} = vi.hoisted(() => ({
  validateTokenMock: vi.fn(),
  findUniqueMock: vi.fn(),
  findManyMilestonesMock: vi.fn(),
  findManyBuildLogsMock: vi.fn(),
  findManyArchitectureMock: vi.fn(),
  findManyPipelineMock: vi.fn(),
}));

vi.mock("@/lib/access-tokens", () => ({
  validateToken: validateTokenMock,
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    project: { findUnique: (...args: unknown[]) => findUniqueMock(...args) },
    milestone: { findMany: (...args: unknown[]) => findManyMilestonesMock(...args) },
    buildLogEntry: { findMany: (...args: unknown[]) => findManyBuildLogsMock(...args) },
    architectureDecision: { findMany: (...args: unknown[]) => findManyArchitectureMock(...args) },
    pipelineEvidence: { findMany: (...args: unknown[]) => findManyPipelineMock(...args) },
  },
}));

import { getPrivateRoomData } from "./private-room-queries";

function buildMockRoom(overrides: Record<string, unknown> = {}) {
  return {
    id: "room-1",
    projectId: "project-1",
    slug: "test-room",
    showMilestones: true,
    showUpdates: true,
    showArchitecture: true,
    showEvidence: true,
    showNextSteps: true,
    status: "published" as const,
    visibility: "privateRoom" as const,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    ...overrides,
  };
}

function buildMockValidatedToken(roomOverrides: Record<string, unknown> = {}) {
  return {
    id: "token-1",
    roomId: "room-1",
    tokenHash: "hashed-token",
    label: "Test Token",
    revokedAt: null,
    expiresAt: null,
    lastUsedAt: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    room: buildMockRoom(roomOverrides),
  };
}

const mockProject = {
  id: "project-1",
  slug: "test-project",
  title: "Test Project",
  summary: "A test summary",
  outcome: "A test outcome",
  stack: ["React"],
  status: "published" as const,
  completedAt: null,
};

const mockMilestone = {
  id: "m-1",
  projectId: "project-1",
  title: "Milestone 1",
  description: "First milestone",
  status: "published" as const,
  visibility: "privateRoom" as const,
  order: 0,
  targetDate: null,
  completedAt: null,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

const mockBuildLog = {
  id: "bl-1",
  projectId: "project-1",
  title: "Build log 1",
  body: null,
  occurredAt: new Date("2025-06-01"),
  status: "published" as const,
  visibility: "privateRoom" as const,
  createdAt: new Date("2025-06-01"),
  updatedAt: new Date("2025-06-01"),
  project: { id: "project-1", slug: "test-project", title: "Test Project" },
};

const mockArchDecision = {
  id: "ad-1",
  projectId: "project-1",
  title: "Decision 1",
  summary: "First decision",
  body: null,
  status: "published" as const,
  visibility: "privateRoom" as const,
  order: 0,
  decidedAt: null,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

const mockPipelineEvidence = {
  id: "pe-1",
  projectId: "project-1",
  label: "Evidence 1",
  description: "Test evidence",
  category: "testing",
  url: null,
  status: "published" as const,
  visibility: "privateRoom" as const,
  recordedAt: new Date("2025-06-01"),
  createdAt: new Date("2025-06-01"),
  updatedAt: new Date("2025-06-01"),
};

describe("getPrivateRoomData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns room data for a valid token", async () => {
    validateTokenMock.mockResolvedValue(buildMockValidatedToken());
    findUniqueMock.mockResolvedValue(mockProject);
    findManyMilestonesMock.mockResolvedValue([mockMilestone]);
    findManyBuildLogsMock.mockResolvedValue([mockBuildLog]);
    findManyArchitectureMock.mockResolvedValue([mockArchDecision]);
    findManyPipelineMock.mockResolvedValue([mockPipelineEvidence]);

    const result = await getPrivateRoomData("valid-token");

    expect(result).not.toBeNull();
    expect(result!.project.title).toBe("Test Project");
    expect(result!.milestones).toHaveLength(1);
    expect(result!.buildLogs).toHaveLength(1);
    expect(result!.architectureDecisions).toHaveLength(1);
    expect(result!.pipelineEvidence).toHaveLength(1);
  });

  it("returns null for an invalid token", async () => {
    validateTokenMock.mockResolvedValue(null);

    const result = await getPrivateRoomData("invalid-token");

    expect(result).toBeNull();
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("returns null for a revoked token", async () => {
    validateTokenMock.mockResolvedValue(null);

    const result = await getPrivateRoomData("revoked-token");

    expect(result).toBeNull();
  });

  it("returns null for an expired token", async () => {
    validateTokenMock.mockResolvedValue(null);

    const result = await getPrivateRoomData("expired-token");

    expect(result).toBeNull();
  });

  it("includes milestones when showMilestones is true", async () => {
    validateTokenMock.mockResolvedValue(buildMockValidatedToken({ showMilestones: true }));
    findUniqueMock.mockResolvedValue(mockProject);
    findManyMilestonesMock.mockResolvedValue([mockMilestone]);
    findManyBuildLogsMock.mockResolvedValue([mockBuildLog]);
    findManyArchitectureMock.mockResolvedValue([mockArchDecision]);
    findManyPipelineMock.mockResolvedValue([mockPipelineEvidence]);

    const result = await getPrivateRoomData("valid-token");

    expect(result).not.toBeNull();
    expect(findManyMilestonesMock).toHaveBeenCalledTimes(1);
    expect(result!.milestones).toHaveLength(1);
  });

  it("excludes milestones when showMilestones is false", async () => {
    validateTokenMock.mockResolvedValue(buildMockValidatedToken({ showMilestones: false }));
    findUniqueMock.mockResolvedValue(mockProject);

    const result = await getPrivateRoomData("valid-token");

    expect(result).not.toBeNull();
    expect(findManyMilestonesMock).not.toHaveBeenCalled();
    expect(result!.milestones).toEqual([]);
  });

  it("all toggles off returns project with empty arrays", async () => {
    validateTokenMock.mockResolvedValue(
      buildMockValidatedToken({
        showMilestones: false,
        showUpdates: false,
        showArchitecture: false,
        showEvidence: false,
        showNextSteps: false,
      })
    );
    findUniqueMock.mockResolvedValue(mockProject);

    const result = await getPrivateRoomData("valid-token");

    expect(result).not.toBeNull();
    expect(findManyMilestonesMock).not.toHaveBeenCalled();
    expect(findManyBuildLogsMock).not.toHaveBeenCalled();
    expect(findManyArchitectureMock).not.toHaveBeenCalled();
    expect(findManyPipelineMock).not.toHaveBeenCalled();
    expect(result!.milestones).toEqual([]);
    expect(result!.buildLogs).toEqual([]);
    expect(result!.architectureDecisions).toEqual([]);
    expect(result!.pipelineEvidence).toEqual([]);
  });

  it("returns null if project is deleted", async () => {
    validateTokenMock.mockResolvedValue(buildMockValidatedToken());
    findUniqueMock.mockResolvedValue(null);

    const result = await getPrivateRoomData("valid-token");

    expect(result).toBeNull();
    expect(findUniqueMock).toHaveBeenCalledTimes(1);
  });
});
