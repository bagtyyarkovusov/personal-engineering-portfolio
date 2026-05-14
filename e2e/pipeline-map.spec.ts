import { test, expect } from "@playwright/test";

test.describe("Homepage section smoke tests", () => {
  test("homepage trust claim is visible", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator('[data-testid="homepage-trust-claim"]'),
    ).toBeVisible();
  });

  test("homepage CTAs are visible", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator('[data-testid="homepage-ctas"]'),
    ).toBeVisible();
  });

  test('"Work With Me" CTA links to /work-with-me', async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator('[data-testid="homepage-cta-work-with-me"]'),
    ).toHaveAttribute("href", "/work-with-me");
  });

  test('"Review My Engineering System" CTA links to /engineering-system', async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.locator('[data-testid="homepage-cta-engineering-system"]'),
    ).toHaveAttribute("href", "/engineering-system");
  });

  test("about section is visible with photo", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "About" }),
    ).toBeVisible();
    await expect(
      page.getByAltText("Bagtyyar Kovusov"),
    ).toBeVisible();
  });

  test("featured work section is visible", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Featured work" }),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="flagship-project"]'),
    ).toBeVisible();
  });

  test("methodology teaser links to engineering system", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "How I work" }),
    ).toBeVisible();
  });

  test("secondary CTA section links to /work-with-me", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Ready to build something that lasts?" }),
    ).toBeVisible();
  });

  test("social footer links are present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[aria-label="GitHub"]')).toBeVisible();
    await expect(page.locator('a[aria-label="LinkedIn"]')).toBeVisible();
    await expect(page.locator('a[aria-label="Instagram"]')).toBeVisible();
  });
});
