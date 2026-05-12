import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRedirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    mockRedirect(path);
    throw new Error("NEXT_REDIRECT");
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() =>
    Promise.resolve(new Map([["x-invoke-path", "/admin/projects"]])),
  ),
}));

vi.mock("./config", () => ({
  auth: vi.fn(),
}));

import { requireAdmin } from "./guard";
import { auth } from "./config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAuth = auth as any as ReturnType<typeof vi.fn>;

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /login with callbackUrl when there is no session", async () => {
    mockAuth.mockResolvedValue(null);

    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith(
      `/login?callbackUrl=${encodeURIComponent("/admin/projects")}`,
    );
  });

  it("redirects to /login with callbackUrl when session has no user object", async () => {
    mockAuth.mockResolvedValue({} as never);

    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith(
      `/login?callbackUrl=${encodeURIComponent("/admin/projects")}`,
    );
  });

  it("returns the session when authenticated", async () => {
    const session = {
      user: { email: "bagtyyar@example.com", name: "Bagtyyar", image: null },
    };
    mockAuth.mockResolvedValue(session);

    const result = await requireAdmin();

    expect(result).toEqual(session);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("propagates auth() failures (e.g. database error)", async () => {
    mockAuth.mockRejectedValue(new Error("DB_CONNECTION_ERROR"));

    await expect(requireAdmin()).rejects.toThrow("DB_CONNECTION_ERROR");
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("accepts a session with minimal user properties", async () => {
    const session = { user: {} };
    mockAuth.mockResolvedValue(session);

    const result = await requireAdmin();

    expect(result).toEqual(session);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
