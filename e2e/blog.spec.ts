import { test, expect } from "@playwright/test";

test.describe("Blog smoke tests", () => {
  test("blog index loads and lists the first post", async ({ page }) => {
    await page.goto("/blog");
    await expect(
      page.getByRole("heading", { name: "Blog", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: /How I run AI-assisted PRs without shipping slop code/,
      }),
    ).toBeVisible();
  });

  test("blog post renders title and body", async ({ page }) => {
    await page.goto("/blog/ai-assisted-prs-without-slop");
    await expect(
      page.getByRole("heading", {
        name: "How I run AI-assisted PRs without shipping slop code",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The actual workflow", exact: true }),
    ).toBeVisible();
  });
});
