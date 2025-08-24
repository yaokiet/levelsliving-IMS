import { test, expect } from '@playwright/test';

// Group all login-related tests together
test.describe('Login Form', () => {

  // Test Case 1: Successful Login Flow
  test('should allow a user to log in successfully and redirect', async ({ page }) => {
    // Mock the API call to simulate a successful login
    // This intercepts the network request and returns a fake user object
    await page.route('**/api/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: { id: '1', name: 'Admin User', email: 'admin@admin.com' },
      });
    });

    // 1. Navigate to the login page
    await page.goto('/login');

    // 2. Fill in the email and password fields using user-facing labels
    await page.getByLabel('Email').fill('admin@admin.com');
    await page.getByLabel('Password').fill('password');

    // 3. Click the login button
    await page.getByRole('button', { name: 'Login' }).click();

    // 4. Assert that the page has redirected to the homepage
    // The component's logic is `router.replace("/")` on success
    await expect(page).toHaveURL('/');
  });


  // Test Case 2: Failed Login Flow
  test('should display an error message with invalid credentials', async ({ page }) => {
    // Mock the API call to simulate a failed login (e.g., 401 Unauthorized)
    await page.route('**/api/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        json: { message: 'Invalid credentials' },
      });
    });

    // 1. Navigate to the login page
    await page.goto('/login');

    // 2. Fill in incorrect credentials
    await page.getByLabel('Email').fill('wrong@user.com');
    await page.getByLabel('Password').fill('wrongpassword');

    // 3. Click the login button
    await page.getByRole('button', { name: 'Login' }).click();

    // 4. Assert that the error message is visible on the page
    const errorMessage = page.getByText('Invalid credentials');
    await expect(errorMessage).toBeVisible();

    // 5. (Optional) Assert that the page did NOT redirect
    await expect(page).not.toHaveURL('/');
  });
});