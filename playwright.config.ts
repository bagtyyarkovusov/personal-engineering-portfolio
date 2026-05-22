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
      name: "smoke",
      testMatch: ["public-navigation.spec.ts", "admin-guard.spec.ts"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "a11y",
      testMatch: ["accessibility.spec.ts"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "private-room",
      testMatch: ["private-room.spec.ts"],
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
