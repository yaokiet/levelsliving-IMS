// tests/setup/auth.setup.spec.ts
import { test, chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const STORAGE_PATH = path.join('.auth', 'user.json');
const FRONTEND = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000/';
const loginUrl = new URL('/login', FRONTEND).toString();

test('authenticate once and save storage state', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(loginUrl);

  // Fill creds (use env in CI)
  await page.getByLabel(/email/i).fill(process.env.E2E_EMAIL ?? 'admin@admin.com');
  await page.getByLabel(/password/i).fill(process.env.E2E_PASSWORD ?? 'password');

  // log in button
  await Promise.all([
    // For MPA or auth redirect:
    page.waitForURL((url) => !url.pathname.endsWith('/login'), { timeout: 15_000 }),
    page.getByRole('button', { name: /login/i }).click(),
  ]);

  await expect(page.locator('body')).toContainText("Dashboard");

  // Persist cookies/localStorage for all other tests
  await fs.mkdir('.auth', { recursive: true });
  await context.storageState({ path: STORAGE_PATH });

  await browser.close();
});
