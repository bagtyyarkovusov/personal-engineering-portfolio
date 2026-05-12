import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3005",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "a11y",
      testMatch: ["accessibility.spec.ts"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "threejs",
      testMatch: ["pipeline-map.spec.ts"],
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
