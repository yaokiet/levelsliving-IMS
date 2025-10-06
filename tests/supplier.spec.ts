import { test, expect } from "@playwright/test"

test.describe.serial('supplier flow', () => {
    const SUPPLIER_URL = "http://localhost:3000/suppliers"

    let supplier: { name: string; description: string; contactNumber: string; email: string };

    test.beforeAll(() => {
        const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 10); // YYYYMMDDHH
        supplier = {
            name: `test-${stamp}`,
            description: `Testing supplier profile`,
            contactNumber: '+65 9999 9999',
            email: 'testsupplier@gmail.com'
        };
    })
    // supplier creation 
    test('create new supplier', async ({ page }) => {
        await page.goto(SUPPLIER_URL)

        await page.getByRole('button', { name: /add supplier/i }).click();

        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible();

        await page.getByLabel('Name').fill(supplier.name);
        await page.getByLabel('Description').fill(supplier.description);
        await page.getByLabel('Contact Number').fill(supplier.contactNumber);
        await page.getByLabel('Email').fill(supplier.email);

        await page.getByRole('button', { name: /(add supplier)/i }).click();

        // await page.waitForLoadState('networkidle');
        await modal.waitFor({ state: 'hidden' });

        await page.getByPlaceholder('Search suppliers...').fill(supplier.name);
        await page.getByRole('button', { name: /search/i }).click();

        const row = page.getByRole('row', { name: new RegExp(`\\b${supplier.name}\\b`, 'i') });
        await expect(row).toBeVisible();
        await expect(row).toContainText(supplier.name);
        await expect(row).toContainText(supplier.description);
        await expect(row).toContainText(supplier.contactNumber);
        await expect(row).toContainText(supplier.email);
    })

    // supplier edit
    // WARNING, FRONTEND NOT FINISHED. FINISH TEST AFTER
    // test('edit supplier', async ({ page }) => {
    //     await page.goto(SUPPLIER_URL)

    //     await page.getByPlaceholder('Search suppliers...').fill(supplier.name);
    //     await page.getByRole('button', { name: /search/i }).click();

    //     const row = page.getByRole('row', { name: new RegExp(`\\b${supplier.name}\\b`, 'i') });
    // })

})


