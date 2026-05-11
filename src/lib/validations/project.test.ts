import { describe, it, expect } from "vitest";
import { validateProjectForm } from "./project";

describe("validateProjectForm", () => {
  it("accepts valid project data", () => {
    const result = validateProjectForm({
      title: "Test Project",
      slug: "test-project",
      summary: "A test project summary",
      status: "published",
      visibility: "public",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = validateProjectForm({
      title: "",
      slug: "test",
      summary: "ok",
      status: "draft",
      visibility: "adminOnly",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("title"))).toBe(true);
    }
  });

  it("rejects invalid slug format", () => {
    const result = validateProjectForm({
      title: "Test",
      slug: "INVALID SLUG!",
      summary: "ok",
      status: "draft",
      visibility: "adminOnly",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("slug"))).toBe(true);
    }
  });

  it("rejects unknown status value", () => {
    const result = validateProjectForm({
      title: "Test",
      slug: "test",
      summary: "ok",
      status: "not-a-real-status",
      visibility: "public",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = validateProjectForm({});
    expect(result.success).toBe(false);
  });
});
