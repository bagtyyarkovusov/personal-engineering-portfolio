import { describe, it, expect, vi, beforeEach } from "vitest";

// Track redirect calls so we can assert against the login path.
const mockRedirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    mockRedirect(path);
    // next/navigation redirect() throws a special error that Next.js catches.
    // We mirror that so the assertion can catch it.
    throw new Error("NEXT_REDIRECT");
  },
}));

vi.mock("./auth", () => ({
  auth: vi.fn(),
}));

import { requireAdmin } from "./guard";
import { auth } from "./auth";

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
