import { test, expect } from "@playwright/test";

test.describe("Public navigation smoke tests", () => {
  test("homepage loads and shows the trust claim", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(
        "Production-minded software engineering, built to stay maintainable after launch.",
      ),
    ).toBeVisible();
  });

  test("navigate to /work shows the Work page", async ({ page }) => {
    await page.goto("/work");
    await expect(
      page.getByRole("heading", { name: "Work", exact: true }),
    ).toBeVisible();
  });

  test("navigate to /engineering-system shows the Engineering System page", async ({
    page,
  }) => {
    await page.goto("/engineering-system");
    await expect(
      page.getByRole("heading", { name: "Engineering System", exact: true }),
    ).toBeVisible();
  });

  test("navigate to /build-log shows the Build Log page", async ({ page }) => {
    await page.goto("/build-log");
    await expect(
      page.getByRole("heading", { name: "Build Log", exact: true }),
    ).toBeVisible();
  });

  test("navigate to /about shows the About page", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "About", exact: true }),
    ).toBeVisible();
  });

  test("navigate to /work-with-me shows the Work With Me page", async ({
    page,
  }) => {
    await page.goto("/work-with-me");
    await expect(
      page.getByRole("heading", { name: "Work With Me", exact: true }),
    ).toBeVisible();
  });
});
