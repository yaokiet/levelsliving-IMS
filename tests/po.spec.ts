import { test, expect } from "@playwright/test"

test.describe.serial('purchase order flow', () => {
    const CART_URL = "http://localhost:3000/cart"
    const ITEM_DETAILS_URL = "http://localhost:3000/item-details"
    const SUPPLIER_URL = "http://localhost:3000/suppliers"

    let parentItem: { name: string; sku: string; variant: string; type: string; qty: string; threshold: string };

    let childItem1: { name: string; sku: string; variant: string; type: string; qty: string; threshold: string; componentQuantity: string };
    let childItem2: { name: string; sku: string; variant: string; type: string; qty: string; threshold: string; componentQuantity: string };

    let supplier: { name: string; description: string; contactNumber: string; email: string };

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

        supplier = {
            name: `test-supplier-PO-${stamp}`,
            description: `Testing supplier profile for PO`,
            contactNumber: '+65 1111 1111',
            email: 'testsupplierPO@gmail.com'
        };
    });

    // add item to cart, validate multiple child components 
    test('create parent item made of 2 children, and add to cart', async ({ page }) => {
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

        const childItem1Line = addParentModal.locator('.grid.grid-cols-3.items-center.gap-4', {
            hasText: `SKU: ${childItem1.sku}`,
        });
        await expect(
            childItem1Line.getByRole('spinbutton')
        ).toHaveValue(childItem1.componentQuantity.toString());
        const childItem2Line = addParentModal.locator('.grid.grid-cols-3.items-center.gap-4', {
            hasText: `SKU: ${childItem2.sku}`,
        });
        await expect(
            childItem2Line.getByRole('spinbutton')
        ).toHaveValue(childItem2.componentQuantity.toString());

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

    // add items to cart and no suppliers available (button disabled)
    test('add items to cart without valid suppliers', async ({ page }) => {
        await page.goto(CART_URL)
        const poButton = page.getByRole('button', { name: /po creation/i });
        await expect(poButton).toBeDisabled();

        // add a new test supplier
        await page.goto(SUPPLIER_URL)

        await page.getByRole('button', { name: /add supplier/i }).click();

        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible();

        await page.getByLabel('Name').fill(supplier.name);
        await page.getByLabel('Description').fill(supplier.description);
        await page.getByLabel('Contact Number').fill(supplier.contactNumber);
        await page.getByLabel('Email').fill(supplier.email);

        await page.getByRole('button', { name: /(add supplier)/i }).click();

        // link child item 1 and child item 2 to new supplier
        await page.goto(ITEM_DETAILS_URL)

        await page.getByPlaceholder('Filter items by SKU').fill('sku-child');
        await page.getByRole('button', { name: /search/i }).click();

        const childItem1Row = page.getByRole('row', { name: new RegExp(`\\b${childItem1.sku}\\b`, 'i') });
        await childItem1Row.getByRole('button', { name: /open menu/i }).click();
        await page.getByRole('menuitem', { name: /link to supplier/i }).click();
        await modal.getByRole('radio', { name: supplier.name }).click();
        await modal.getByRole('button', { name: /confirm link/i }).click();

        await modal.waitFor({ state: 'hidden' });

        await page.getByPlaceholder('Filter items by SKU').fill('sku-child');
        await page.getByRole('button', { name: /search/i }).click();

        const childItem2Row = page.getByRole('row', { name: new RegExp(`\\b${childItem2.sku}\\b`, 'i') });
        await childItem2Row.getByRole('button', { name: /open menu/i }).click();
        await page.getByRole('menuitem', { name: /link to supplier/i }).click();
        await modal.getByRole('radio', { name: supplier.name }).click();
        await modal.getByRole('button', { name: /confirm link/i }).click();

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            page.goto(CART_URL)
        ]);
        await page.locator('[data-slot="card"]', { hasText: `SKU: ${childItem1.sku}` })
            .locator('[data-slot="checkbox"]')
            .click();
        await page.locator('[data-slot="card"]', { hasText: `SKU: ${childItem2.sku}` })
            .locator('[data-slot="checkbox"]')
            .click();
        const supplierCard = page.locator('[data-slot="card"]', { hasText: /select supplier/i });
        await supplierCard.getByRole('radio', { name: supplier.name }).click();

        await expect(poButton).toBeEnabled();
    })

    // add item to cart and checkout (expect url to be pdf page)
    test('add items to cart and checkout', async ({ page, context }) => {
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            page.goto(CART_URL)
        ]);
        const poButton = page.getByRole('button', { name: /po creation/i });
        await page.locator('[data-slot="card"]', { hasText: `SKU: ${childItem1.sku}` })
            .locator('[data-slot="checkbox"]')
            .click();
        await page.locator('[data-slot="card"]', { hasText: `SKU: ${childItem2.sku}` })
            .locator('[data-slot="checkbox"]')
            .click();
        const supplierCard = page.locator('[data-slot="card"]', { hasText: /select supplier/i });
        await supplierCard.getByRole('radio', { name: supplier.name }).click();

        await expect(poButton).toBeEnabled();

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            poButton.click()
        ]);

        const orderItemsCard = page.locator('[data-slot="card"]', { hasText: 'Order Items' });

        await expect(orderItemsCard).toContainText(childItem1.name);
        await expect(orderItemsCard).toContainText(`SKU: ${childItem1.sku}`);
        await expect(orderItemsCard).toContainText(`Variant: ${childItem1.variant}`);
        await expect(orderItemsCard).toContainText(`Qty: ${childItem1.componentQuantity}`);

        await expect(orderItemsCard).toContainText(childItem2.name);
        await expect(orderItemsCard).toContainText(`SKU: ${childItem2.sku}`);
        await expect(orderItemsCard).toContainText(`Variant: ${childItem2.variant}`);
        await expect(orderItemsCard).toContainText(`Qty: ${childItem2.componentQuantity}`);

        const supplierCardCheckout = page.locator('[data-slot="card"]', { hasText: 'Supplier Details' });
        await expect(supplierCardCheckout).toContainText(supplier.name);
        await expect(supplierCardCheckout).toContainText(supplier.email);
        await expect(supplierCardCheckout).toContainText(supplier.description);

        // validate checkout page details
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            await page.getByRole('button', { name: 'Confirm and Create PO' }).click()
        ]);

        await expect(page.getByRole('heading', { name: /purchase order/i })).toBeVisible();
        await expect(page.getByText(/PO #\d+/)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Print' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Download PDF' })).toBeVisible();

        await expect(page.locator('div.flex.justify-between', { hasText: 'Status:' })).toContainText('Submitted');

        await expect(page.getByText(supplier.name)).toBeVisible();
        await expect(page.getByText(supplier.description)).toBeVisible();
        await expect(page.getByText(supplier.description)).toBeVisible();
        await expect(page.getByText(supplier.contactNumber)).toBeVisible();

        // Items table — child 1 row
        let row = page.getByRole('row', { name: new RegExp(`\\b${childItem1.sku}\\b`) });
        await expect(row).toContainText(childItem1.sku);
        await expect(row).toContainText(childItem1.name);
        await expect(row).toContainText(childItem1.variant);
        await expect(row).toContainText(childItem1.componentQuantity);

        // Items table — child 2 row
        row = page.getByRole('row', { name: new RegExp(`\\b${childItem2.sku}\\b`) });
        await expect(row).toContainText(childItem2.sku);
        await expect(row).toContainText(childItem2.name);
        await expect(row).toContainText(childItem2.variant);
        await expect(row).toContainText(childItem2.componentQuantity);

        // Totals
        const total = String(Number(childItem1.componentQuantity) + Number(childItem2.componentQuantity));
        await expect(page.getByText(new RegExp(`Total Items:\\s*${total}\\b`))).toBeVisible();

        // --- ADDED: verify Print opens a popup and calls window.print() ---
        await context.addInitScript(() => {
            const orig = window.print;
            (window as any).__print_called = false;
            window.print = () => { (window as any).__print_called = true; try { orig?.(); } catch { } };
        });
        const [printPopup] = await Promise.all([
            page.waitForEvent('popup'),
            page.getByRole('button', { name: 'Print' }).click(),
        ]);
        await printPopup.waitForLoadState('domcontentloaded');
        const printed = await printPopup.evaluate(() => (window as any).__print_called === true);
        expect(printed).toBeTruthy();


    })


})