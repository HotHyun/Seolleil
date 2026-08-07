import { defineConfig, devices } from "@playwright/test";

const remoteBaseURL = process.env.E2E_BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL;
const baseURL = remoteBaseURL ?? "http://127.0.0.1:3211";
const useRemoteTarget = Boolean(remoteBaseURL);

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: useRemoteTarget || process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command:
          "pnpm build && AUTH_SECRET=playwright-test-secret HOSTNAME=127.0.0.1 PORT=3211 node .next/standalone/server.js",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 300_000
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] }
    }
  ]
});
