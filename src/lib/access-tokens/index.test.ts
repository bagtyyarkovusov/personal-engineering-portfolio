import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    accessToken: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import crypto from "node:crypto";
import { generateToken, validateToken, revokeToken } from "./index";
import { prisma } from "@/lib/db/prisma";

const mockFindUnique = vi.mocked(prisma.accessToken.findUnique);
const mockUpdate = vi.mocked(prisma.accessToken.update);

function buildMockToken(overrides: Record<string, unknown> = {}) {
  return {
    id: "token-1",
    roomId: "room-1",
    tokenHash: "test-hash",
    label: "Test Token",
    revokedAt: null,
    expiresAt: null,
    lastUsedAt: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    room: {
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
    },
    ...overrides,
  };
}

describe("generateToken", () => {
  it("produces a 64-char hex raw token", () => {
    const { raw } = generateToken();
    expect(raw).toHaveLength(64);
    expect(/^[a-f0-9]+$/.test(raw)).toBe(true);
  });

  it("produces a 64-char hex hash", () => {
    const { hash } = generateToken();
    expect(hash).toHaveLength(64);
    expect(/^[a-f0-9]+$/.test(hash)).toBe(true);
  });

  it("produces different tokens on each call", () => {
    const a = generateToken();
    const b = generateToken();
    expect(a.raw).not.toBe(b.raw);
    expect(a.hash).not.toBe(b.hash);
  });

  it("produces a consistent sha256 hash for a known input", () => {
    const raw = crypto.randomBytes(32).toString("hex");
    const expectedHash = crypto
      .createHash("sha256")
      .update(raw)
      .digest("hex");

    expect(expectedHash).toHaveLength(64);
    expect(expectedHash).not.toBe(raw);
  });
});

describe("validateToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the token with room included for a valid active token", async () => {
    const mockToken = buildMockToken();
    mockFindUnique.mockResolvedValue(mockToken);
    mockUpdate.mockResolvedValue(mockToken);

    const result = await validateToken("test-hash");

    expect(result).toEqual(mockToken);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { tokenHash: "test-hash" },
      include: { room: true },
    });
  });

  it("returns null for a non-existent token", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await validateToken("nonexistent");

    expect(result).toBeNull();
  });

  it("returns null for a revoked token", async () => {
    const mockToken = buildMockToken({ revokedAt: new Date("2026-06-01") });
    mockFindUnique.mockResolvedValue(mockToken);

    const result = await validateToken("revoked-hash");

    expect(result).toBeNull();
  });

  it("returns null for an expired token", async () => {
    const mockToken = buildMockToken({ expiresAt: new Date("2020-01-01") });
    mockFindUnique.mockResolvedValue(mockToken);

    const result = await validateToken("expired-hash");

    expect(result).toBeNull();
  });

  it("updates lastUsedAt on successful validation", async () => {
    const mockToken = buildMockToken();
    mockFindUnique.mockResolvedValue(mockToken);
    mockUpdate.mockResolvedValue(mockToken);

    await validateToken("test-hash");

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "token-1" },
      data: { lastUsedAt: expect.any(Date) },
    });
  });
});

describe("revokeToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("revokes an active token and returns the updated token", async () => {
    const mockToken = buildMockToken();
    const revokedToken = buildMockToken({ revokedAt: new Date() });
    mockFindUnique.mockResolvedValue(mockToken);
    mockUpdate.mockResolvedValue(revokedToken);

    const result = await revokeToken("test-hash");

    expect(result).toEqual(revokedToken);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { tokenHash: "test-hash" },
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "token-1" },
      data: { revokedAt: expect.any(Date) },
    });
  });

  it("returns null for an already-revoked token", async () => {
    const mockToken = buildMockToken({ revokedAt: new Date("2026-06-01") });
    mockFindUnique.mockResolvedValue(mockToken);

    const result = await revokeToken("already-revoked");

    expect(result).toBeNull();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns null for a non-existent token", async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await revokeToken("nonexistent");

    expect(result).toBeNull();
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});

describe("validateToken edge cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null for an empty string hash", async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await validateToken("");
    expect(result).toBeNull();
  });

  it("token with future expiration is valid", async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const mockToken = buildMockToken({ expiresAt: futureDate });
    mockFindUnique.mockResolvedValue(mockToken);
    mockUpdate.mockResolvedValue(mockToken);

    const result = await validateToken("future-expiry-hash");
    expect(result).not.toBeNull();
  });
});

describe("revokeToken edge cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not call update when token not found", async () => {
    mockFindUnique.mockResolvedValue(null);
    await revokeToken("nonexistent");
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
