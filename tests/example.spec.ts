import { test, expect, request } from '@playwright/test';

test('login page is shown', async ({ page }) => {
  await page.goto('http://localhost:3000'); 

  await expect(page.locator('body')).toContainText('Login');
});

test('user can log in', async ({ page }) => {
  // Go to login page
  await page.goto('/login');

  // Fill email/username and password
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');

  // Click login button
  await page.click('button[type="submit"]');

  // Expect redirect to dashboard or home
  await expect(page.locator('body')).toContainText('Dashboard');
});