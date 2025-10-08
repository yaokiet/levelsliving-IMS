import { test, expect } from "@playwright/test"

// add item to cart and checkout (expect url to be pdf page)
// add items to cart and no matching supplier (button disabled)

// add item to cart, validate multiple child components 
test.describe.serial('purchase order flow', () => {
    const CART_URL = "http://localhost:3000/cart"
    const ITEM_DETAILS_URL = "http://localhost:3000/item-details"

    let parentItem: { name: string; sku: string; variant: string; type: string; qty: string; threshold: string };
    let childItem1: { name: string; sku: string; variant: string; type: string; qty: string; threshold: string; componentQuantity: string };
    let childItem2: { name: string; sku: string; variant: string; type: string; qty: string; threshold: string; componentQuantity: string };

    test.beforeAll(() => {
        const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 10); // YYYYMMDDHH
        parentItem = {
            name: `parent-${stamp}`,
            sku: `sku-parent-${stamp}`,
            variant: 'ParentVariant',
            type: 'ParentType',
            qty: '20',
            threshold: '5',
        };

        childItem1 = {
            name: `child-${stamp}`,
            sku: `sku-child-${stamp}`,
            variant: 'ChildVariant',
            type: 'ChildType',
            qty: '50',
            threshold: '10',
            componentQuantity: '67'
        };

        childItem2 = {
            name: `child-${stamp}-2`,
            sku: `sku-child2-${stamp}`,
            variant: 'ChildVariant2',
            type: 'ChildType2',
            qty: '60',
            threshold: '15',
            componentQuantity: '89'
        };
    });

    // add item to cart, validate multiple child components 
    test('create new item', async ({ page }) => {
        // create parent item
        await page.goto(ITEM_DETAILS_URL)
        await page.getByRole('button', { name: /add item/i }).click();

        const modal = page.getByRole('dialog');

        await page.getByLabel('Item Name').fill(parentItem.name);
        await page.getByLabel('Item SKU').fill(parentItem.sku);
        await page.getByLabel('Variant').fill(parentItem.variant);
        await page.getByLabel('Type').fill(parentItem.type);
        await page.getByLabel('Quantity').fill(parentItem.qty);
        await page.getByLabel('Threshold Qty').fill(parentItem.threshold);
        await page.getByRole('button', { name: /(create item)/i }).click();

        await modal.waitFor({ state: 'hidden' });

        await page.getByPlaceholder('Filter items by SKU').fill(parentItem.sku);
        await page.getByRole('button', { name: /search/i }).click();

        const parentRow = page.getByRole('row', { name: new RegExp(`\\b${parentItem.sku}\\b`, 'i') });

        // create child item 1 and 2
        await page.goto(ITEM_DETAILS_URL)
        await page.getByRole('button', { name: /add item/i }).click();

        await page.getByLabel('Item Name').fill(childItem1.name);
        await page.getByLabel('Item SKU').fill(childItem1.sku);
        await page.getByLabel('Variant').fill(childItem1.variant);
        await page.getByLabel('Type').fill(childItem1.type);
        await page.getByLabel('Quantity').fill(childItem1.qty);
        await page.getByLabel('Threshold Qty').fill(childItem1.threshold);
        await page.getByRole('button', { name: /(create item)/i }).click();

        await modal.waitFor({ state: 'hidden' });

        await page.getByRole('button', { name: /add item/i }).click();

        await page.getByLabel('Item Name').fill(childItem2.name);
        await page.getByLabel('Item SKU').fill(childItem2.sku);
        await page.getByLabel('Variant').fill(childItem2.variant);
        await page.getByLabel('Type').fill(childItem2.type);
        await page.getByLabel('Quantity').fill(childItem2.qty);
        await page.getByLabel('Threshold Qty').fill(childItem2.threshold);
        await page.getByRole('button', { name: /(create item)/i }).click();

        await modal.waitFor({ state: 'hidden' });

        // add child item 1 and 2 to parent item
        await page.getByPlaceholder('Filter items by SKU').fill(parentItem.sku);
        await page.getByRole('button', { name: /search/i }).click();

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            parentRow.getByRole('link', { name: parentItem.sku }).click(),
        ]);

        await expect(page.getByText(parentItem.sku)).toBeVisible();

        await page.getByRole('button', { name: /add child item/i }).click();

        const parentChildModal = page.getByRole('dialog');
        await expect(parentChildModal).toBeVisible();

        await parentChildModal.getByPlaceholder('Search by name or SKU...').fill(childItem1.name);

        const child1 = parentChildModal.locator('li', { hasText: childItem1.sku })
        await child1.getByRole('checkbox').click();
        await child1.getByLabel('Qty required').fill(childItem1.componentQuantity);

        const child2 = parentChildModal.locator('li', { hasText: childItem2.sku })
        await child2.getByRole('checkbox').click();
        await child2.getByLabel('Qty required').fill(childItem2.componentQuantity);

        await parentChildModal.locator('[data-slot="dialog-footer"]')
            .getByRole('button', { name: /^Add Selected$/ })
            .click();

        // add parent item to cart, checking that child item is populated
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            page.goto(ITEM_DETAILS_URL)
        ]);

        await page.getByPlaceholder('Filter items by SKU').fill(parentItem.sku);
        await page.getByRole('button', { name: /search/i }).click();

        await parentRow.getByRole('button', { name: /add to cart/i }).click();
        const addParentModal = page.getByRole('dialog');
        
        await expect(addParentModal).toContainText(childItem1.name);
        await expect(addParentModal).toContainText(childItem1.sku);
        await expect(modal.locator(`input[id^="qty-"]`).nth(1)).toHaveValue(childItem1.componentQuantity.toString());
        await expect(addParentModal).toContainText(childItem2.name);
        await expect(addParentModal).toContainText(childItem2.sku);
        await expect(modal.locator(`input[id^="qty-"]`).nth(0)).toHaveValue(childItem2.componentQuantity.toString());

        await addParentModal.locator('[data-slot="dialog-footer"]')
            .getByRole('button', { name: /add to cart/i })
            .click();

        await page.goto(CART_URL)

        const childCard1 = page.locator('[data-slot="card"]', { hasText: `SKU: ${childItem1.sku}` });
        await expect(childCard1).toContainText(childItem1.name);
        await expect(childCard1).toContainText(`SKU: ${childItem1.sku}`);
        await expect(childCard1.locator('input[type="number"]')).toHaveValue(childItem1.componentQuantity.toString());

        const childCard2 = page.locator('[data-slot="card"]', { hasText: `SKU: ${childItem2.sku}` });
        await expect(childCard2).toContainText(childItem2.name);
        await expect(childCard2).toContainText(`SKU: ${childItem2.sku}`);
        await expect(childCard2.locator('input[type="number"]')).toHaveValue(childItem2.componentQuantity.toString());

    })

})