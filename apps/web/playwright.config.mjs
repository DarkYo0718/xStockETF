import { fileURLToPath } from "node:url";
import { defineConfig } from "@playwright/test";

const webDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "node node_modules/next/dist/bin/next dev -p 3000",
    cwd: webDir,
    gracefulShutdown: {
      signal: "SIGTERM",
      timeout: 5000
    },
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120000
  },
  use: {
    baseURL: "http://127.0.0.1:3000"
  }
});
