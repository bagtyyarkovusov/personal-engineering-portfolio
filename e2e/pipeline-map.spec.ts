import { test, expect } from "@playwright/test";

test.describe("Pipeline map smoke tests", () => {
  test("pipeline diagram wrapper is present on the homepage", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.locator('[data-testid="pipeline-diagram"]'),
    ).toBeVisible();
  });

  test("pipeline map renders canvas or HTML fallback", async ({ page }) => {
    await page.goto("/");

    const diagram = page.locator('[data-testid="pipeline-diagram"]');
    // At least one rendering mode must be present inside the pipeline area:
    // the Three.js canvas, the Suspense/noscript HTML fallback, or the
    // reduced-motion HTML variant.
    await expect(
      diagram
        .locator("canvas")
        .or(diagram.locator('[data-testid="pipeline-diagram-fallback"]'))
        .or(
          diagram.locator('[data-testid="pipeline-diagram-reduced-motion"]'),
        ),
    ).toBeAttached();
  });

  test("known pipeline stage label visible in fallback HTML", async ({
    page,
  }) => {
    await page.goto("/");

    const fallback = page.locator('[data-testid="pipeline-diagram-fallback"]');
    const fallbackExists = (await fallback.count()) > 0;

    if (fallbackExists) {
      await expect(fallback.getByText("Architecture")).toBeVisible();
    }
  });

  test("reduced-motion fallback shows pipeline stage labels", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const reducedMotion = page.locator(
      '[data-testid="pipeline-diagram-reduced-motion"]',
    );
    await expect(reducedMotion).toBeVisible();
    await expect(
      reducedMotion.getByText("Architecture", { exact: true }),
    ).toBeVisible();
  });

  test("HTML fallback uses keyboard-accessible DOM elements", async ({
    page,
  }) => {
    await page.goto("/");

    const fallback = page.locator('[data-testid="pipeline-diagram-fallback"]');
    const fallbackExists = (await fallback.count()) > 0;

    if (fallbackExists) {
      await expect(fallback).toHaveAttribute("role", "region");
      await expect(fallback).toHaveAttribute(
        "aria-label",
        "Engineering pipeline map",
      );
    }
  });

  test("fallback data-testid or canvas present", async ({ page }) => {
    await page.goto("/");

    const diagram = page.locator('[data-testid="pipeline-diagram"]');
    await expect(
      diagram
        .locator('[data-testid="pipeline-diagram-fallback"]')
        .or(diagram.locator("canvas")),
    ).toBeAttached();
  });
});
