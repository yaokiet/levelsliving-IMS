"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedItems, setSelectedSupplier } from "@/app/_store/cartCheckoutSlice";
import type { RootState } from "@/app/_store/redux-store";

import { CartItemsList } from "@/components/ui/cart/cart-item-list";
import { SupplierSelectCard } from "@/components/ui/supplier/supplier-select-card";

import { CartItem } from "@/types/cart-item";
import { Supplier } from "@/types/supplier";

import { getCartItems, updateCartItemQty, removeCartItem, clearCart } from "@/lib/api/cartApi";
import { getAllSuppliers } from "@/lib/api/supplierApi";

import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
            persistedSelectedItems.forEach(item => {
                const exists = data.find(ci => ci.item_id === item.item_id);
                if (!exists) {
                    // If item no longer exists in cart, remove from persisted selection
                    dispatch(setSelectedItems(
                        persistedSelectedItems.filter(pi => pi.item_id !== item.item_id)
                    ));
                }
            });
        }).catch(error => {
            console.error("Failed to fetch cart items:", error);
        });
    }

    function fetchSuppliers() {
        getAllSuppliers().then(data => {
            setSuppliers(data)
            if (persistedSelectedSupplier) {
                const exists = data.find(s => s.id === persistedSelectedSupplier.id);
                if (!exists) {
                    // If supplier no longer exists, clear persisted selection
                    dispatch(setSelectedSupplier(null));
                }
            }
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
            dispatch(setSelectedItems(
                persistedSelectedItems.filter(item => item.item_id !== id)
            ));
        }).catch(error => {
            console.error("Failed to remove cart item:", error);
        });
    };

    const handleSelect = (id: string, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((sid) => sid !== id)
        );
        dispatch(setSelectedItems(
            checked
                ? [...persistedSelectedItems, cartItems.find(item => item.item_id === id)!]
                : persistedSelectedItems.filter(item => item.item_id !== id)
        ));
    };

    const handleSupplierSelect = (id: string) => {
        setSelectedSupplierId(id);
        const supplier = suppliers.find(s => s.id === Number(id));
        dispatch(setSelectedSupplier(supplier || null));
    }

    const handleClearCart = () => {
        // Clear cart items and selections
        confirm("Are you sure you want to clear the cart? This action cannot be undone.") && clearCart().then(() => {
            setCartItems([]);
            setSelectedIds([]);
            setSelectedSupplierId(undefined);
            dispatch(setSelectedItems([]));
            dispatch(setSelectedSupplier(null));
        }).catch(error => {
            console.error("Failed to clear cart:", error);
        });
    }

    return (
        <div className="container mx-auto py-10 px-6">
            {cartItems.length === 0 ? (
                <div className="text-center text-lg text-muted-foreground">Your cart is empty.</div>
            ) : (
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full lg:w-8/12">
                        <CartItemsList
                            cartItems={cartItems}
                            onQtyChange={handleQtyChange}
                            onRemove={handleRemove}
                            selectedIds={selectedIds}
                            onSelect={handleSelect}
                        />
                        <Button
                            className="mt-2 w-full"
                            variant={"destructive"}
                            onClick={handleClearCart}
                        >
                            <Trash2 className="w-5 h-5" />
                            Clear Cart
                        </Button>
                    </div>
                    <div className="w-full lg:w-4/12">
                        <SupplierSelectCard
                            suppliers={suppliers}
                            selectedSupplierId={selectedSupplierId}
                            onSelect={handleSupplierSelect}
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
            )}
        </div>
    );
}
