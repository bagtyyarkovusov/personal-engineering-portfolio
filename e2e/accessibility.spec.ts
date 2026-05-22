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
  testInfo: import("@playwright/test").TestInfo,
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

  testInfo.attach("axe-results", {
    body: JSON.stringify(results.violations, null, 2),
    contentType: "application/json",
  });

  if (minor.length > 0) {
    testInfo.annotations.push({
      type: "a11y-minor",
      description: `${label}: ${minor.length} minor violation(s) — ${minor.map((v) => v.id).join(", ")}`,
    });
  }

  if (serious.length > 0) {
    for (const v of serious) {
      testInfo.annotations.push({
        type: "a11y-failure",
        description: `${label}: ${v.impact} — ${v.id}: ${v.help} (${v.nodes.length} node(s))`,
      });
    }
  }

  expect
    .soft(serious, `Critical/serious a11y violations on ${label}`)
    .toEqual([]);
}

test.describe("Accessibility smoke scans", () => {
  const VALID_TOKEN = "8bc8dfdd568eead0d1f77ce7183193512c569e2e490d71a7581b2475427a70f7";

  test.describe("Public routes", () => {
    test("homepage (/) passes a11y scan", async ({ page }, testInfo) => {
      await page.goto("/");
      await checkA11y(page, testInfo, "/");
    });

    test("/work passes a11y scan", async ({ page }, testInfo) => {
      await page.goto("/work");
      await checkA11y(page, testInfo, "/work");
    });

    test("/engineering-system passes a11y scan", async ({ page }, testInfo) => {
      await page.goto("/engineering-system");
      await checkA11y(page, testInfo, "/engineering-system");
    });

    test("/build-log passes a11y scan", async ({ page }, testInfo) => {
      await page.goto("/build-log");
      await checkA11y(page, testInfo, "/build-log");
    });

    test("/about passes a11y scan", async ({ page }, testInfo) => {
      await page.goto("/about");
      await checkA11y(page, testInfo, "/about");
    });
  });

  test.describe("Admin guard redirect", () => {
    test("unauthorized /admin redirects to /login and login page passes a11y", async ({
      page,
    }, testInfo) => {
      await page.goto("http://localhost:3005/admin");

      // Wait for the login page heading (auto-waits for the redirect + render)
      await expect(
        page.getByRole("heading", { name: "Owner sign in" }),
      ).toBeVisible();

      // Verify the redirect actually happened
      expect(page.url()).toContain("/login");

      await checkA11y(page, testInfo, "/login (via admin redirect)");
    });
  });

  test.describe("Private room", () => {
    test("valid private room passes a11y scan", async ({ page }, testInfo) => {
      const response = await page.goto(`/rooms/${VALID_TOKEN}`);
      expect(response?.status()).toBe(200);

      // Wait for the key content to be visible before scanning
      await expect(
        page.getByRole("heading", {
          name: "AutoTM",
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.getByText("In Progress", { exact: true })).toBeVisible();

      await checkA11y(page, testInfo, `/rooms/${VALID_TOKEN}`);
    });
  });
});
