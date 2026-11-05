import { test, expect } from "@playwright/test";

// Keep case studies covered even if sitemap generation loses database access.
const caseStudies = [
  "/work/car-marketplace",
  "/work/tayyn-hyzmat",
  "/work/myorl-ent-clinic",
  "/work/personal-engineering-portfolio",
];
let publicRoutes: string[];

test.beforeAll(async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  const sitemapRoutes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, url]) => new URL(url).pathname,
  );
  expect(sitemapRoutes).toContain("/");
  publicRoutes = [...new Set([...sitemapRoutes, ...caseStudies])];
  publicRoutes.push("/does-not-exist");
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`public routes do not overflow at ${width}px`, async ({ page }) => {
    // Each width checks the whole catalog, including published blog articles.
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const route of publicRoutes) {
      await test.step(route, async () => {
        const response = await page.goto(route, { waitUntil: "load" });
        expect(response?.status(), route).toBe(
          route === "/does-not-exist" ? 404 : 200,
        );
        await expect(page.getByRole("main")).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));

        expect(scrollWidth, `${route} at ${width}px`).toBeLessThanOrEqual(
          clientWidth,
        );
      });
    }
  });
}
