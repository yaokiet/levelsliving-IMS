import { test, expect } from "@playwright/test"

// add item to cart, validate multiple child components 
// add item to cart and checkout (expect url to be pdf page)
// add items to cart and no matching supplier (button disabled)

test.describe.serial('purchase order flow', () => {
    const CART_URL = "http://localhost:3000/cart"
    const ITEM_DETAILS_URL = "http://localhost:3000/item-details"

    let parentItem: { name: string; sku: string; variant: string; type: string; qty: string; threshold: string };
    let childItem: { name: string; sku: string; variant: string; type: string; qty: string; threshold: string };

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

        childItem = {
            name: `child-${stamp}`,
            sku: `sku-child-${stamp}`,
            variant: 'ChildVariant',
            type: 'ChildType',
            qty: '50',
            threshold: '10',
        };
    });

    // // add item to cart, validate multiple child components 
    // test('create new item', async ({ page }) => {
    //     // create parent item

    //     // create child item

    //     // add child item to parent item

    //     // add parent item to cart, checking that child item is 



    // })

})