"use client";

import { useState } from "react";
import { CartItemsList } from "@/components/ui/cart/cart-item-list";
import { CartItem } from "@/types/cart-item";

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            item_id: "1",
            item_name: "Wireless Mouse",
            sku: "WM-001",
            variant: "Black",
            quantity: 2,
        },
        {
            item_id: "2",
            item_name: "Mechanical Keyboard",
            sku: "MK-002",
            variant: "Blue Switches",
            quantity: 1,
        },
        {
            item_id: "3",
            item_name: "USB-C Cable",
            sku: "UC-003",
            variant: "1m",
            quantity: 3,
        },
    ]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleQtyChange = (id: string, newQty: number) => {
        setCartItems(items =>
            items.map(item => item.item_id === id ? { ...item, quantity: newQty } : item)
        );
    };

    const handleRemove = (id: string) => {
        setCartItems(items => items.filter(item => item.item_id !== id));
    };

    const handleSelect = (id: string, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((sid) => sid !== id)
        );
    };

    return (
        <div className="container mx-auto py-10 px-6">
            <CartItemsList
                cartItems={cartItems}
                onQtyChange={handleQtyChange}
                onRemove={handleRemove}
                selectedIds={selectedIds}
                onSelect={handleSelect}
            />
        </div>
    );
}
