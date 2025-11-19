"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/_store/redux-store";
import { CartItem } from "@/types/cart-item";
import { createPurchaseOrder } from "@/lib/api/purchaseOrderApi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { PurchaseOrderStatus } from "@/types/purchase-order";

export default function CheckoutPage() {
  const router = useRouter();
  const selectedItems = useSelector(
    (state: RootState) => state.cartCheckout.selectedItems
  );
  const selectedSupplier = useSelector(
    (state: RootState) => state.cartCheckout.selectedSupplier
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePO = async () => {
    if (!selectedSupplier || selectedItems.length === 0) {
      toast.error("Supplier and items must be selected before creating a PO.");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the payload for the API call
      const payload = {
        supplierId: selectedSupplier.id,
        status: PurchaseOrderStatus.Pending,
        // Get today's date in YYYY-MM-DD format
        order_date: new Date(),
      };

      const newPurchaseOrder = await createPurchaseOrder(
        payload.supplierId,
        payload.status,
        payload.order_date
      );

      toast.success(
        `Purchase Order #${newPurchaseOrder.id} created successfully!`
      );

      // Redirect to the new PO's detail page or a confirmation page
      router.push(`/purchase-orders/${newPurchaseOrder.id}`);
    } catch (error) {
      console.error("Failed to create Purchase Order:", error);
      toast.error(
        "An error occurred while creating the Purchase Order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl py-10 px-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Confirm Purchase Order
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Item Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                Review the items to be included in this purchase order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedItems && selectedItems.length > 0 ? (
                <ul className="space-y-4">
                  {selectedItems.map((item: CartItem, index) => (
                    <li key={String(item.item_id)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{item.item_name}</div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {item.sku}
                          </div>
                          {item.variant && (
                            <div className="text-xs text-muted-foreground">
                              Variant: {item.variant}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      {index < selectedItems.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No items selected for this order.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Supplier and Actions */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSupplier ? (
                <div className="space-y-2">
                  <div className="font-bold text-lg">
                    {selectedSupplier.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedSupplier.email}
                  </div>
                  <p className="text-sm">{selectedSupplier.description}</p>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  No supplier selected.
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full"
            onClick={handleCreatePO}
            disabled={
              isLoading || !selectedSupplier || selectedItems.length === 0
            }
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Confirm and Create PO"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
