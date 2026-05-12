import { test, expect } from "@playwright/test";

test.describe("Private room smoke tests", () => {
  const VALID_TOKEN = "test-valid-token-00000000000000000000000000000000";
  const INVALID_TOKEN = "this-token-does-not-exist-in-database-for-e2e-test-0000";
  const REVOKED_TOKEN = "test-revoked-token-00000000000000000000000000";

  test("valid token path renders the private-room client view", async ({
    page,
  }) => {
    const response = await page.goto(`/rooms/${VALID_TOKEN}`);

    // Verify the page loaded successfully (not a 404)
    expect(response?.status()).toBe(200);

    // The project title should be visible
    await expect(
      page.getByRole("heading", {
        name: "Personal Engineering Portfolio",
        exact: true,
      }),
    ).toBeVisible();

    // Status badge should be visible (published + no completedAt = "In Progress")
    await expect(page.getByText("In Progress")).toBeVisible();

    // Stack tags should be visible
    await expect(page.getByText("Next.js 16")).toBeVisible();
    await expect(page.getByText("TypeScript")).toBeVisible();

    // Outcome section should be visible
    await expect(
      page.getByRole("heading", { name: "Outcome" }),
    ).toBeVisible();

    // Milestones section should be visible
    await expect(
      page.getByRole("heading", { name: "Milestones" }),
    ).toBeVisible();

    // Build Log section should be visible
    await expect(
      page.getByRole("heading", { name: "Build Log" }),
    ).toBeVisible();

    // Next Steps section should be visible
    await expect(
      page.getByRole("heading", { name: "Next Steps" }),
    ).toBeVisible();
  });

  test("invalid token path renders the safe failure state", async ({
    page,
  }) => {
    const response = await page.goto(`/rooms/${INVALID_TOKEN}`);

    // Should return 404 (notFound() is called when token is invalid)
    expect(response?.status()).toBe(404);

    // Must NOT expose any project information
    await expect(
      page.getByText("Personal Engineering Portfolio"),
    ).not.toBeVisible();

    // Must NOT reveal project stack or other sensitive content
    await expect(page.getByText("Next.js 16")).not.toBeVisible();
  });

  test("revoked token path renders the safe failure state", async ({
    page,
  }) => {
    const response = await page.goto(`/rooms/${REVOKED_TOKEN}`);

    // Should return 404 (notFound() is called when token is revoked)
    expect(response?.status()).toBe(404);

    // Must NOT expose any project information
    await expect(
      page.getByText("Personal Engineering Portfolio"),
    ).not.toBeVisible();

    // Must NOT reveal project stack or other sensitive content
    await expect(page.getByText("Next.js 16")).not.toBeVisible();
  });
});
