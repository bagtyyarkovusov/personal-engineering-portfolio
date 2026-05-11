import { describe, it, expect } from "vitest";
import { validateMilestoneForm } from "./milestone";

describe("validateMilestoneForm", () => {
  it("accepts valid milestone data", () => {
    const result = validateMilestoneForm({
      title: "Core marketplace flow",
      status: "published",
      visibility: "public",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = validateMilestoneForm({
      title: "",
      status: "draft",
      visibility: "adminOnly",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields as null", () => {
    const result = validateMilestoneForm({
      title: "A milestone",
      description: null,
      targetDate: null,
      completedAt: null,
      status: "published",
      visibility: "public",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = validateMilestoneForm({
      title: "Test",
      status: "not-a-status",
      visibility: "public",
    });
    expect(result.success).toBe(false);
  });
});
