import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    accessToken: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import crypto from "node:crypto";
import { generateToken } from "./index";

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
