import { test, expect } from "@playwright/test";

test.describe("Private room smoke tests", () => {
  const VALID_TOKEN = "8bc8dfdd568eead0d1f77ce7183193512c569e2e490d71a7581b2475427a70f7";
  const INVALID_TOKEN = "f3f0f7930f6ad34e9ddb1cd5e8b375267dc5ab17f231cb677b6c1a079d4b3820";
  const REVOKED_TOKEN = "4cdc25f2005814cde91d7d30655eea8d5849148b200b5ca795f8612286311ed6";

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
      page.getByText("Outcome"),
    ).toBeVisible();

    // Milestones section should be visible
    await expect(
      page.getByRole("heading", { name: "Milestones" }),
    ).toBeVisible();

    // Updates section should be visible
    await expect(
      page.getByRole("heading", { name: "Updates" }),
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
