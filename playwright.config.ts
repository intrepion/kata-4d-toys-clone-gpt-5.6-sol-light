import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  timeout: 30_000,
  use: { ...devices['Desktop Chrome'], baseURL: 'http://127.0.0.1:4318', viewport: { width: 1280, height: 800 }, deviceScaleFactor: 0.5 },
  webServer: { command: 'npm run dev -- --port 4318', url: 'http://127.0.0.1:4318', reuseExistingServer: true },
});
