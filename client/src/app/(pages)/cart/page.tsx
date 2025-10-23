"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedItems,
  setSelectedSupplier,
} from "@/app/_store/cartCheckoutSlice";
import type { RootState } from "@/app/_store/redux-store";

import { CartItemsList } from "@/components/ui/cart/cart-item-list";
import { SupplierSelectCard } from "@/components/ui/supplier/supplier-select-card";

import { CartItem } from "@/types/cart-item";
import { Supplier } from "@/types/supplier";

import {
  getCartItems,
  updateCartItemQty,
  removeCartItem,
  clearCart,
} from "@/lib/api/cartApi";
import { getSuppliersByItemIds } from "@/lib/api/supplierApi";

import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const dispatch = useDispatch();

  const persistedSelectedItems = useSelector(
    (state: RootState) => state.cartCheckout.selectedItems
  );
  const persistedSelectedSupplier = useSelector(
    (state: RootState) => state.cartCheckout.selectedSupplier
  );

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // --- MODIFIED ---: Standardized on string array for selected IDs
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<
    string | undefined
  >();

  const debouncedUpdateQty = useRef(
    debounce((id: string, qty: number) => {
      updateCartItemQty(id, qty);
    }, 1000)
  ).current;

  // --- MODIFIED ---: Accepts string[], but converts to number[] for the API call
  const debouncedFetchSuppliers = useCallback(
    debounce((itemIds: string[]) => {
      const numericIds = itemIds.map((id) => Number(id));
      getSuppliersByItemIds(numericIds)
        .then((data) => {
          setSuppliers(data);
          const currentSupplierStillValid = data.some(
            (s) => String(s.id) === selectedSupplierId
          );
          if (!currentSupplierStillValid) {
            setSelectedSupplierId(undefined);
            dispatch(setSelectedSupplier(null));
          }
        })
        .catch((error) => {
          console.error("Failed to fetch suppliers for items:", error);
          setSuppliers([]);
        });
    }, 500),
    [selectedSupplierId, dispatch]
  );

  useEffect(() => {
    getCartItems()
      .then((data) => {
        setCartItems(data);
      })
      .catch((error) => {
        console.error("Failed to fetch cart items:", error);
      });
  }, []);

  useEffect(() => {
    if (persistedSelectedItems && persistedSelectedItems.length > 0) {
      // --- MODIFIED ---: Convert numeric IDs from Redux to strings for local state
      setSelectedItemIds(
        persistedSelectedItems.map((item) => String(item.item_id))
      );
    } else {
      setSelectedItemIds([]);
    }

    if (persistedSelectedSupplier) {
      setSelectedSupplierId(String(persistedSelectedSupplier.id));
    } else {
      setSelectedSupplierId(undefined);
    }
  }, [persistedSelectedItems, persistedSelectedSupplier]);

  useEffect(() => {
    if (selectedItemIds.length > 0) {
      debouncedFetchSuppliers(selectedItemIds);
    } else {
      setSuppliers([]);
      setSelectedSupplierId(undefined);
      dispatch(setSelectedSupplier(null));
    }
  }, [selectedItemIds, debouncedFetchSuppliers, dispatch]);

  // --- MODIFIED ---: Simplified logic by comparing strings directly
  const handleQtyChange = (id: string, newQty: number) => {
    setCartItems((items) =>
      items.map((item) =>
        String(item.item_id) === id ? { ...item, quantity: newQty } : item
      )
    );
    debouncedUpdateQty(id, newQty);
  };

  // --- MODIFIED ---: Simplified logic by comparing strings directly
  const handleRemove = (id: string) => {
    removeCartItem(id)
      .then(() => {
        setCartItems((items) =>
          items.filter((item) => String(item.item_id) !== id)
        );
        dispatch(
          setSelectedItems(
            persistedSelectedItems.filter((item) => String(item.item_id) !== id)
          )
        );
      })
      .catch((error) => {
        console.error("Failed to remove cart item:", error);
      });
  };

  // --- MODIFIED ---: Simplified logic by comparing strings directly
  const handleSelect = (id: string, checked: boolean) => {
    const selectedItem = cartItems.find((item) => String(item.item_id) === id)!;
    if (!selectedItem) return;

    dispatch(
      setSelectedItems(
        checked
          ? [...persistedSelectedItems, selectedItem]
          : persistedSelectedItems.filter((item) => String(item.item_id) !== id)
      )
    );
  };

  const handleSupplierSelect = (id: string) => {
    const supplier = suppliers.find((s) => s.id === Number(id));
    dispatch(setSelectedSupplier(supplier || null));
  };

  const handleClearCart = () => {
    if (
      confirm(
        "Are you sure you want to clear the cart? This action cannot be undone."
      )
    ) {
      clearCart()
        .then(() => {
          setCartItems([]);
          setSuppliers([]);
          dispatch(setSelectedItems([]));
          dispatch(setSelectedSupplier(null));
        })
        .catch((error) => {
          console.error("Failed to clear cart:", error);
        });
    }
  };

  return (
    <div className="container mx-auto py-10 px-6">
      {cartItems.length === 0 ? (
        <div className="text-center text-lg text-muted-foreground">
          Your cart is empty.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full lg:w-8/12">
            <CartItemsList
              cartItems={cartItems}
              onQtyChange={handleQtyChange}
              onRemove={handleRemove}
              selectedIds={selectedItemIds}
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
              poDisabled={selectedItemIds.length === 0 || !selectedSupplierId}
              onPOCreate={() => {
                const selectedItems = cartItems.filter((item) =>
                  selectedItemIds.includes(String(item.item_id))
                );
                const supplier = suppliers.find(
                  (s) => s.id === Number(selectedSupplierId)
                );
                if (selectedItems.length && supplier) {
                  dispatch(setSelectedItems(selectedItems));
                  dispatch(setSelectedSupplier(supplier));
                }
              }}
              hasSelectedItems={selectedItemIds.length > 0}
            />
          </div>
        </div>
      )}
    </div>
  );
}
