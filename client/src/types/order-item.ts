import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import type { Item } from "./item";

export interface OrderItem {
    id: number,
    shopify_order_id: number,
    order_date: Timestamp,
    name: string,
    contact: number,
    street: string,
    unit: string,
    postal_code: string,
    subRows: Item[],
    status: string,
    // order_status: string,
}

// const mockItems: Item[] = [
//     {
//         id: 1,
//         sku: "SKU123",
//         type: "Product",
//         item_name: "Office Chair",
//         variant: "Black",
//         qty: 50,
//         threshold_qty: 5,
//     },
//     {
//         id: 2,
//         sku: "SKU124",
//         type: "Product",
//         item_name: "Standing Desk",
//         variant: "White",
//         qty: 30,
//         threshold_qty: 5,
//     },
//     {
//         id: 3,
//         sku: "SKU125",
//         type: "Product",
//         item_name: "Wireless Mouse",
//         variant: "Black",
//         qty: 100,
//         threshold_qty: 5,
//     },
//     {
//         id: 4,
//         sku: "SKU126",
//         type: "Product",
//         item_name: "27-inch Monitor",
//         variant: "Black",
//         qty: 20,
//         threshold_qty: 5,
//     },
//     {
//         id: 5,
//         sku: "SKU127",
//         type: "Product",
//         item_name: "Desk Lamp",
//         variant: "White",
//         qty: 15,
//         threshold_qty: 5,
//     }
// ];


export const mockOrderItems: OrderItem[] = [
    {
        id: 1,
        shopify_order_id: 1001,
        order_date: new Date("2024-08-01") as unknown as Timestamp,
        name: "Alice Tan",
        contact: 91234567,
        street: "123 Main St",
        unit: "#01-01",
        postal_code: "123456",
        status: "Pending",
        subRows: [
            {
                item_name: "Office Chair", variant: "Black", qty: 1,
                id: 5555,
                sku: "TEST1",
                type: "",
                threshold_qty: 0,
            },
            {
                item_name: "Standing Desk", variant: "White", qty: 1,
                id: 6666,
                sku: "TEST2",
                type: "",
                threshold_qty: 0,
            }
        ]
    },
    {
        id: 2,
        shopify_order_id: 1002,
        order_date: new Date("2024-08-02") as unknown as Timestamp,
        name: "Bob Lim",
        contact: 98765432,
        street: "456 Second St",
        unit: "#02-02",
        postal_code: "234567",
        status: "Pending",
        subRows: []
    },
    {
        id: 3,
        shopify_order_id: 1003,
        order_date: new Date("2024-08-03") as unknown as Timestamp,
        name: "Cheryl Ong",
        contact: 90011223,
        street: "789 Third St",
        unit: "#03-03",
        postal_code: "345678",
        status: "Pending",
        subRows: []
    },
    {
        id: 4,
        shopify_order_id: 1004,
        order_date: new Date("2024-08-04") as unknown as Timestamp,
        name: "David Lee",
        contact: 81239876,
        street: "101 Fourth St",
        unit: "#04-04",
        postal_code: "456789",
        status: "Completed",
        subRows: []
    },
    {
        id: 5,
        shopify_order_id: 1005,
        order_date: new Date("2024-08-05") as unknown as Timestamp,
        name: "Evelyn Goh",
        contact: 82345678,
        street: "202 Fifth St",
        unit: "#05-05",
        postal_code: "567890",
        status: "Cancelled",
        subRows: []
    }
];