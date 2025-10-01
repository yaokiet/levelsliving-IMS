import { test, expect, request } from '@playwright/test';

test('login page is shown', async ({ page }) => {
  await page.goto('http://localhost:3000'); 

  await expect(page.locator('body')).toContainText('Dashboard');
});