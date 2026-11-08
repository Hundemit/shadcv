import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
  webServer: [
    {
      command: "pnpm start --hostname 127.0.0.1 --port 3100",
      url: "http://127.0.0.1:3100",
      reuseExistingServer: false,
    },
  ],
});
