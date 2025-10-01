// tests/setup/auth.setup.spec.ts
import { test, chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const STORAGE_PATH = path.join('.auth', 'user.json');
const FRONTEND = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';

test('authenticate once and save storage state', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${FRONTEND}/login`);

  // Fill creds (use env in CI)
  await page.fill('#email', process.env.E2E_EMAIL ?? 'admin@admin.com');
  await page.fill('#password', process.env.E2E_PASSWORD ?? 'password');
  await page.click('button[type="submit"]');

  // Wait for dashboard/home
  await page.waitForURL(`${FRONTEND}/`);

  await expect(page.locator('body')).toContainText("Dashboard");

  // Persist cookies/localStorage for all other tests
  await fs.mkdir('.auth', { recursive: true });
  await context.storageState({ path: STORAGE_PATH });

  await browser.close();
});
