import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { AxeResults } from "axe-core";

/** Known shadcn/ui rules that fire on intentional theme choices. Disabled
 * here so the smoke test focuses on structural/behavioural a11y issues. */
const SHADCN_DISABLED_RULES = ["color-contrast"];

/**
 * Run an axe accessibility scan with WCAG A/AA rules and only fail on
 * critical or serious violations. Minor/moderate issues (common with
 * shadcn/ui and Next.js internals) are logged but do not cause failure.
 */
async function checkA11y(
  page: import("@playwright/test").Page,
  label: string,
) {
  const results: AxeResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .disableRules(SHADCN_DISABLED_RULES)
    .analyze();

  const serious = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
  const minor = results.violations.filter(
    (v) => v.impact !== "critical" && v.impact !== "serious",
  );

  // Log minor/moderate issues for awareness but don't fail
  if (minor.length > 0) {
    console.log(
      `[${label}] ${minor.length} minor/moderate violation(s) (not failing):`,
      minor.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
      })),
    );
  }

  expect
    .soft(serious, `Critical/serious a11y violations on ${label}`)
    .toEqual([]);
}

test.describe("Accessibility smoke scans", () => {
  const VALID_TOKEN = "test-valid-token-00000000000000000000000000000000";

  test.describe("Public routes", () => {
    test("homepage (/) passes a11y scan", async ({ page }) => {
      await page.goto("/");
      await checkA11y(page, "/");
    });

    test("/work passes a11y scan", async ({ page }) => {
      await page.goto("/work");
      await checkA11y(page, "/work");
    });

    test("/engineering-system passes a11y scan", async ({ page }) => {
      await page.goto("/engineering-system");
      await checkA11y(page, "/engineering-system");
    });

    test("/build-log passes a11y scan", async ({ page }) => {
      await page.goto("/build-log");
      await checkA11y(page, "/build-log");
    });

    test("/about passes a11y scan", async ({ page }) => {
      await page.goto("/about");
      await checkA11y(page, "/about");
    });
  });

  test.describe("Admin guard redirect", () => {
    test("unauthorized /admin redirects to /login and login page passes a11y", async ({
      page,
    }) => {
      await page.goto("http://localhost:3005/admin");

      // Wait for the login page heading (auto-waits for the redirect + render)
      await expect(
        page.getByRole("heading", { name: "Owner sign in" }),
      ).toBeVisible();

      // Verify the redirect actually happened
      expect(page.url()).toContain("/login");

      await checkA11y(page, "/login (via admin redirect)");
    });
  });

  test.describe("Private room", () => {
    test("valid private room passes a11y scan", async ({ page }) => {
      const response = await page.goto(`/rooms/${VALID_TOKEN}`);
      expect(response?.status()).toBe(200);

      // Wait for the key content to be visible before scanning
      await expect(
        page.getByRole("heading", {
          name: "Personal Engineering Portfolio",
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.getByText("In Progress")).toBeVisible();

      await checkA11y(page, `/rooms/${VALID_TOKEN}`);
    });
  });
});
