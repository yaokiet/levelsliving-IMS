import type { Item } from "./item";

export interface OrderItem {
    id: number,
    cust_name: string,
    order_date: string,
    cust_contact: number,
    order_qty: number,
    subRows: Item[],
    // Status
    // order_status: string,
}

const mockItems: Item[] = [
    {
        id: 1,
        sku: "SKU123",
        type: "Product",
        item_name: "Office Chair",
        variant: "Black",
        qty: 50,
        threshold_qty: 5
    },
    {
        id: 2,
        sku: "SKU124",
        type: "Product",
        item_name: "Standing Desk",
        variant: "White",
        qty: 30,
        threshold_qty: 5
    },
    {
        id: 3,
        sku: "SKU125",
        type: "Product",
        item_name: "Wireless Mouse",
        variant: "Black",
        qty: 100,
        threshold_qty: 5
    },
    {
        id: 4,
        sku: "SKU126",
        type: "Product",
        item_name: "27-inch Monitor",
        variant: "Black",
        qty: 20,
        threshold_qty: 5
    },
    {
        id: 5,
        sku: "SKU127",
        type: "Product",
        item_name: "Desk Lamp",
        variant: "White",
        qty: 15,
        threshold_qty: 5
    }
];


export const mockOrderItems: OrderItem[] = [
    {
        id: 1,
        cust_name: "Alice Tan",
        order_date: "2024-08-01",
        cust_contact: 91234567,
        order_qty: 3,
        subRows: [
            {
                item_name: "Office Chair", variant: "Black", qty: 1,
                id: 5555,
                sku: "TEST1",
                type: "",
                threshold_qty: 0
            },
            {
                item_name: "Standing Desk", variant: "White", qty: 1,
                id: 6666,
                sku: "TEST2",
                type: "",
                threshold_qty: 0
            }
        ]
    },
    {
        id: 2,
        cust_name: "Bob Lim",
        order_date: "2024-08-02",
        cust_contact: 98765432,
        order_qty: 1,
        subRows: []
    },
    {
        id: 3,
        cust_name: "Cheryl Ong",
        order_date: "2024-08-03",
        cust_contact: 90011223,
        order_qty: 2,
        subRows: []
    },
    {
        id: 4,
        cust_name: "David Lee",
        order_date: "2024-08-04",
        cust_contact: 81239876,
        order_qty: 5,
        subRows: []
    },
    {
        id: 5,
        cust_name: "Evelyn Goh",
        order_date: "2024-08-05",
        cust_contact: 82345678,
        order_qty: 4,
        subRows: []
    }
];