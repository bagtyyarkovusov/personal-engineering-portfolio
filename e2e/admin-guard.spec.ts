import { test, expect } from "@playwright/test";

test.describe("Admin guard smoke tests", () => {
  const adminRoutes = [
    "/admin",
    "/admin/architecture-decisions",
    "/admin/pipeline-evidence",
  ];

  for (const route of adminRoutes) {
    test(`unauthenticated access to ${route} redirects to /login`, async ({
      page,
    }) => {
      // Use full URL to avoid baseURL resolution issues
      await page.goto(`http://localhost:3005${route}`);

      // The auth guard triggers a Next.js redirect, which Playwright follows.
      // We should land on the login page.
      await expect(page).toHaveURL(/\/login/);

      // Verify the login page is rendered (not a blank or broken page)
      await expect(
        page.getByRole("heading", { name: "Owner sign in" }),
      ).toBeVisible();

      // Verify admin-only content is NOT visible on the redirected page
      await expect(page.getByText("Admin Dashboard")).not.toBeVisible();
    });
  }

  test("unauthorized user sees the sign-in prompt, not admin content", async ({
    page,
  }) => {
    await page.goto("http://localhost:3005/admin");

    // Verify we're on the login page
    await expect(page).toHaveURL(/\/login/);

    // The login page explains the restriction
    await expect(
      page.getByText(
        "This area is restricted to the site owner. Sign in with GitHub to continue.",
      ),
    ).toBeVisible();

    // The sign-in button is present
    await expect(
      page.getByRole("button", { name: "Sign in with GitHub" }),
    ).toBeVisible();

    // Admin-specific strings must NOT appear on the login page
    await expect(
      page.getByText("Manage portfolio content and evidence."),
    ).not.toBeVisible();
  });
});
