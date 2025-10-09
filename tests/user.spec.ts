import { test, expect } from "@playwright/test"

test.describe.serial('user flow', () => {
    const USER_URL = "http://localhost:3000/users"

    let user: { name: string; email: string; role: string; otherRole: string; password: string };

    test.beforeAll(() => {
        const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 10); // YYYYMMDDHH
        user = {
            name: `test-user-${stamp}`,
            email: `testuser@gmail.com`,
            role: 'user',
            otherRole: 'admin',
            password: `testPasswordfor-${stamp}`
        };
    })
    // user creation 
    test('create new user', async ({ page }) => {
        await page.goto(USER_URL)

        await page.getByRole('button', { name: /create user/i }).click();

        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible();

        await page.getByLabel('Name').fill(user.name);
        await page.getByLabel('Email').fill(user.email);
        const roleTrigger = page.getByRole('button', { name: /select role/i });
        await roleTrigger.click();
        const roleMenu = page.locator('[data-slot="dropdown-menu-content"][data-state="open"]');
        await expect(roleMenu).toBeVisible();
        await page.getByRole('menuitem', { name: RegExp(`^${user.role}$`, 'i') }).click();
        await page.locator('#user-password').fill(user.password);
        await page.locator('#user-confirm-password').fill(user.password);

        await page.getByRole('button', { name: /(create user)/i }).click();

        await modal.waitFor({ state: 'hidden' });

        await page.getByPlaceholder('Search users...').fill(user.name);
        await page.getByRole('button', { name: /search/i }).click();

        const row = page.getByRole('row', { name: new RegExp(`\\b${user.name}\\b`, 'i') });
        await expect(row).toBeVisible();
        await expect(row).toContainText(user.name);
        await expect(row).toContainText(user.email);
        await expect(row).toContainText(user.role);
    })

    // user edit
    test('edit user', async ({ page }) => {
        await page.goto(USER_URL)

        await page.getByPlaceholder('Search users...').fill(user.name);
        await page.getByRole('button', { name: /search/i }).click();

        const row = page.getByRole('row', { name: new RegExp(`\\b${user.name}\\b`, 'i') });
        await expect(row).toBeVisible();
        await expect(row).toContainText(user.name);
        await expect(row).toContainText(user.email);
        await expect(row).toContainText(user.role);

        await row.getByRole('button', { name: /open menu/i }).click();

        const edit = page.getByRole('menuitem', { name: /edit user/i });
        await expect(edit).toBeVisible();
        await edit.click();

        const modal = page.locator('[data-slot="dialog-content"][data-state="open"]').first();
        await expect(modal).toBeVisible();

        await modal.getByRole('button', { name: new RegExp(`^${user.role}$`, 'i') }).click();
        await modal.locator('[data-slot="dialog-footer"]')
            .getByRole('button', { name: /^Save$/ })
            .click();

        const updatedRow = page.getByRole('row', { name: new RegExp(`\\b${user.name}\\b`, 'i') });
        await expect(updatedRow).toBeVisible();
        await expect(updatedRow).toContainText(user.name);
        await expect(updatedRow).toContainText(user.email);
        await expect(updatedRow).toContainText(user.otherRole);
    })

})


