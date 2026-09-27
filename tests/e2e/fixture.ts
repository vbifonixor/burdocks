import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { join } from "node:path";
import { test as base } from "@playwright/test";

type App = {
  adminEmail: string;
  adminPassword: string;
  url: string;
};

function getAvailablePort() {
  return new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        reject(new Error("Could not allocate a test port"));
        return;
      }

      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}

async function waitForServer(url: string) {
  const deadline = Date.now() + 10_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${url}/ping`);

      if (response.ok) {
        return;
      }
    } catch {
      // The process is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

export const test = base.extend<{ app: App }>({
  app: async ({ page: _page }, use, testInfo) => {
    const port = await getAvailablePort();
    const directory = join(
      process.cwd(),
      "test-results",
      `server-${testInfo.workerIndex}-${Date.now()}`,
    );
    const adminEmail = `admin-${testInfo.workerIndex}-${Date.now()}@example.com`;
    const adminPassword = "playwright-admin-password";
    const url = `http://127.0.0.1:${port}`;
    await mkdir(directory, { recursive: true });

    const processHandle = spawn(
      process.execPath,
      ["--import", "tsx", "server/index.ts"],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          AUTH_SECRET: "playwright-auth-secret-playwright-auth-secret",
          DATABASE_PATH: join(directory, "db.sqlite"),
          HOSTNAME: url,
          PORT: String(port),
          SU_EMAIL: adminEmail,
          SU_PASSWORD: adminPassword,
        },
        stdio: "ignore",
      },
    );

    try {
      await waitForServer(url);
      await use({ adminEmail, adminPassword, url });
    } finally {
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(resolve, 1_000);
        processHandle.once("exit", () => {
          clearTimeout(timeout);
          resolve();
        });
        processHandle.kill();
      });
      await rm(directory, { force: true, recursive: true });
    }
  },
});
