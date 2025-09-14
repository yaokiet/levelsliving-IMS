"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedItems, setSelectedSupplier } from "@/app/_store/cartCheckoutSlice";
import type { RootState } from "@/app/_store/redux-store";

import { CartItemsList } from "@/components/ui/cart/cart-item-list";
import { SupplierSelectCard } from "@/components/ui/supplier/supplier-select-card";

import { CartItem } from "@/types/cart-item";
import { Supplier } from "@/types/supplier";

import { getCartItems, updateCartItemQty, removeCartItem } from "@/lib/api/cartApi";
import { getAllSuppliers } from "@/lib/api/supplierApi";

import debounce from "lodash/debounce";

export default function CartPage() {
    const dispatch = useDispatch();

    // Get persisted selections from Redux
    const persistedSelectedItems = useSelector((state: RootState) => state.cartCheckout.selectedItems);
    const persistedSelectedSupplier = useSelector((state: RootState) => state.cartCheckout.selectedSupplier);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<string | undefined>();

    // Debounced function to update cart item quantity
    const debouncedUpdateQty = useRef(
        debounce((id: string, qty: number) => {
            updateCartItemQty(id, qty);
        }, 1000)
    ).current;

    function fetchCartItems() {
        getCartItems().then(data => {
            setCartItems(data);
        }).catch(error => {
            console.error("Failed to fetch cart items:", error);
        });
    }

    function fetchSuppliers() {
        getAllSuppliers().then(data => {
            setSuppliers(data);
        }).catch(error => {
            console.error("Failed to fetch suppliers:", error);
        });
    }

    useEffect(() => {
        fetchCartItems();
        fetchSuppliers();
    }, []);

    useEffect(() => {
        // Set selectedIds from persisted selectedItems
        if (persistedSelectedItems && persistedSelectedItems.length > 0) {
            setSelectedIds(persistedSelectedItems.map(item => item.item_id));
        }
        // Set selectedSupplierId from persisted selectedSupplier
        if (persistedSelectedSupplier) {
            setSelectedSupplierId(String(persistedSelectedSupplier.id));
        }
    }, [persistedSelectedItems, persistedSelectedSupplier]);


    const handleQtyChange = (id: string, newQty: number) => {
        setCartItems(items =>
            items.map(item => item.item_id === id ? { ...item, quantity: newQty } : item)
        );
        debouncedUpdateQty(id, newQty);
    };

    const handleRemove = (id: string) => {
        removeCartItem(id).then(() => {
            setCartItems(items => items.filter(item => item.item_id !== id));
            setSelectedIds(ids => ids.filter(sid => sid !== id));
        }).catch(error => {
            console.error("Failed to remove cart item:", error);
        });
    };

    const handleSelect = (id: string, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((sid) => sid !== id)
        );
    };

    return (
        <div className="container mx-auto py-10 px-6">
            <div className="flex flex-col md:flex-row gap-5">
                <div className="w-full lg:w-8/12">
                    <CartItemsList
                        cartItems={cartItems}
                        onQtyChange={handleQtyChange}
                        onRemove={handleRemove}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                    />
                </div>
                <div className="w-full lg:w-4/12">
                    <SupplierSelectCard
                        suppliers={suppliers}
                        selectedSupplierId={selectedSupplierId}
                        onSelect={setSelectedSupplierId}
                        poDisabled={selectedIds.length === 0 || !selectedSupplierId}
                        onPOCreate={() => {
                            const selectedItems = cartItems.filter(item => selectedIds.includes(item.item_id));
                            const supplier = suppliers.find(s => s.id === Number(selectedSupplierId));
                            if (selectedItems.length && supplier) {
                                dispatch(setSelectedItems(selectedItems));
                                dispatch(setSelectedSupplier(supplier));
                            }
                        }}
                    />
                </div>
            </div>

        </div>
    );
}
