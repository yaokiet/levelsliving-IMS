"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/app/_store/redux-store";
import { CartItem } from "@/types/cart-item";

export default function CheckoutPage() {
    const selectedItems = useSelector((state: RootState) => state.cartCheckout.selectedItems);
    const selectedSupplier = useSelector((state: RootState) => state.cartCheckout.selectedSupplier);

    return (
        <div className="container mx-auto py-10 px-6">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Selected Supplier</h2>
                {selectedSupplier ? (
                    <div>
                        <div className="font-medium">{selectedSupplier.name}</div>
                        {selectedSupplier.description && (
                            <div className="text-sm text-muted-foreground">{selectedSupplier.description}</div>
                        )}
                    </div>
                ) : (
                    <div className="text-muted-foreground">No supplier selected.</div>
                )}
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2">Selected Items</h2>
                {selectedItems && selectedItems.length > 0 ? (
                    <ul className="space-y-2">
                        {selectedItems.map((item: CartItem) => (
                            <li key={item.item_id} className="border rounded p-2">
                                <div className="font-medium">{item.item_name}</div>
                                <div className="text-sm">SKU: {item.sku}</div>
                                {item.variant && <div className="text-xs">Variant: {item.variant}</div>}
                                <div className="text-sm">Qty: {item.quantity}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-muted-foreground">No items selected.</div>
                )}
            </div>
        </div>
    );
}
