import { test, expect } from "@playwright/test";

test.describe("Public navigation smoke tests", () => {
  test("homepage loads and shows the intro", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Bagtyyar, full-stack engineer\./ }),
    ).toBeVisible();
  });

  test("main navigation has the four destinations", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const label of ["Work", "Writing", "About", "Contact"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("every public page ends with the contact block", async ({ page }) => {
    await page.goto("/work");
    await expect(
      page.getByRole("heading", { name: "Let’s work together." }),
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

  test("navigate to /resume shows the Resume page", async ({ page }) => {
    await page.goto("/resume");
    await expect(
      page.getByRole("heading", { name: "Bagtyýar Kowusow", exact: true }),
    ).toBeVisible();
    for (const section of [
      "Summary",
      "Selected Projects",
      "Engineering System Highlights",
      "Key Skills",
      "Experience",
      "Education",
      "Contact",
    ]) {
      await expect(
        page.getByRole("heading", { name: section, exact: true }),
      ).toBeVisible();
    }
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
