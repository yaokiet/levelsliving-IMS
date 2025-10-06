import { test, expect } from "@playwright/test"


test.describe.serial('item flow', () => {
    const ITEM_DETAILS_URL = "http://localhost:3000/item-details"

    let item: { name: string; sku: string; variant: string; type: string; qty: string; threshold: string };

    test.beforeAll(() => {
        const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 10); // YYYYMMDDHH
        item = {
            name: `test-${stamp}`,
            sku: `sku-${stamp}`,
            variant: 'TestVariant',
            type: 'TestType',
            qty: '20',
            threshold: '5',
        };
    });

    // item creation 
    test('create new item', async ({ page }) => {
        await page.goto(ITEM_DETAILS_URL)

        await page.getByRole('button', { name: /add item/i }).click();

        await page.getByLabel('Item Name').fill(item.name);
        await page.getByLabel('Item SKU').fill(item.sku);
        await page.getByLabel('Variant').fill(item.variant);
        await page.getByLabel('Type').fill(item.type);
        await page.getByLabel('Quantity').fill(item.qty);
        await page.getByLabel('Threshold Qty').fill(item.threshold);

        await page.getByRole('button', { name: /(create item)/i }).click();

        await page.waitForLoadState('networkidle');

        await page.getByPlaceholder('Filter items by SKU').fill(item.sku);
        await page.getByRole('button', { name: /search/i }).click();

        const row = page.getByRole('row', { name: new RegExp(`\\b${item.sku}\\b`, 'i') });
        await expect(row).toBeVisible();
        await expect(row).toContainText(item.sku);
        await expect(row).toContainText(item.variant);
        await expect(row).toContainText(item.type);
        await expect(row).toContainText(item.qty);
        await expect(row).toContainText(item.threshold);
    })


    // item edit
    test('edit new item', async ({ page }) => {
        await page.goto(ITEM_DETAILS_URL)

        await page.getByPlaceholder('Filter items by SKU').fill(item.sku);
        await page.getByRole('button', { name: /search/i }).click();

        const row = page.getByRole('row', { name: new RegExp(`\\b${item.sku}\\b`, 'i') });
        await row.getByRole('button', { name: /open menu/i }).click();

        const edit = page.getByRole('menuitem', { name: /edit item/i });
        await expect(edit).toBeVisible();
        await edit.click();

        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible();

        const newSKU = `Updated ${Date.now()}`;

        await modal.getByLabel('Item SKU').fill(newSKU);
        await page.getByRole('button', { name: /(save)/i }).click();

        await page.waitForLoadState('networkidle');
        await modal.waitFor({ state: 'hidden' });

        await page.getByPlaceholder('Filter items by SKU').fill(newSKU);
        await page.getByRole('button', { name: /search/i }).click();

        const updatedRow = page.getByRole('row', { name: new RegExp(`\\b${newSKU}\\b`, 'i') });
        await expect(updatedRow).toBeVisible();
        await expect(updatedRow).toContainText(newSKU);
        await expect(updatedRow).toContainText(item.variant);
        await expect(updatedRow).toContainText(item.type);
        await expect(updatedRow).toContainText(item.qty);
        await expect(updatedRow).toContainText(item.threshold);

    })
})