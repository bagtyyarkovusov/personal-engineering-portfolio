import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRedirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    mockRedirect(path);
    throw new Error("NEXT_REDIRECT");
  },
}));

vi.mock("./config", () => ({
  auth: vi.fn(),
}));

import { requireAdmin } from "./guard";
import { auth } from "./config";

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /login when there is no session", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("redirects to /login when session has no user object", async () => {
    vi.mocked(auth).mockResolvedValue({} as never);

    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("returns the session when authenticated", async () => {
    const session = {
      user: { email: "bagtyyar@example.com", name: "Bagtyyar", image: null },
    };
    vi.mocked(auth).mockResolvedValue(session);

    const result = await requireAdmin();

    expect(result).toEqual(session);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
