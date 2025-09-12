"use client";

import { useEffect, useState } from "react";
import { CartItemsList } from "@/components/ui/cart/cart-item-list";
import { CartItem } from "@/types/cart-item";
import { getCartItems } from "@/lib/api/cartApi";

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    function fetchCartItems() {
        getCartItems().then(data => {
            setCartItems(data);
        }).catch(error => {
            console.error("Failed to fetch cart items:", error);
        });
    }

    useEffect(() => {
        fetchCartItems();
    }, []);

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
