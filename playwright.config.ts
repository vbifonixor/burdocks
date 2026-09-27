import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: true,
  reporter: "list",
  testDir: "./tests/e2e",
  use: {
    browserName: "chromium",
    trace: "on-first-retry",
  },
});
