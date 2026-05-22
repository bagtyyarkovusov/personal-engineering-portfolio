import { describe, it, expect } from "vitest";
import { z } from "zod";

// Mirror the schema from the API route for unit testing
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(200),
  inquiryType: z.enum(["hiring", "project", "consulting", "other"]),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

describe("Contact form validation", () => {
  it("accepts valid data", () => {
    const result = contactSchema.safeParse({
      name: "Test Client",
      email: "test@example.com",
      inquiryType: "project",
      message: "I need help building a SaaS MVP with React Native and NestJS.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = contactSchema.safeParse({
      name: "",
      email: "test@example.com",
      inquiryType: "project",
      message: "A valid message with enough characters.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({
      name: "Test",
      email: "not-an-email",
      inquiryType: "other",
      message: "A valid message with enough characters.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("rejects short message", () => {
    const result = contactSchema.safeParse({
      name: "Test",
      email: "test@example.com",
      inquiryType: "other",
      message: "Too short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message).toBeDefined();
    }
  });

  it("rejects invalid inquiry type", () => {
    const result = contactSchema.safeParse({
      name: "Test",
      email: "test@example.com",
      inquiryType: "spam",
      message: "A valid message with enough characters.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = contactSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.name).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.message).toBeDefined();
    }
  });
});
