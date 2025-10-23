"use client";

import { useState, useEffect } from "react";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { getAllSuppliers } from "@/lib/api/supplierApi";
import { linkSupplierToItem } from "@/lib/api/supplierItem";
import type { Item } from "@/types/item";
import type { Supplier } from "@/types/supplier";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LinkSupplierModalProps {
  item: Item;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess?: () => void | Promise<void>;
}

export function LinkSupplierModal({
  item,
  isOpen,
  setIsOpen,
  onSuccess,
}: LinkSupplierModalProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch suppliers when the modal is opened
  useEffect(() => {
    if (isOpen) {
      const fetchSuppliers = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getAllSuppliers();
          setSuppliers(data);
        } catch (e) {
          setError("Failed to load suppliers. Please try again.");
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchSuppliers();
    }
  }, [isOpen]);

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    if (!nextOpen) {
      // Reset state when closing
      setError(null);
      setSelectedSupplierId(null);
      setSubmitting(false);
    }
  };

  const onConfirm = async () => {
    if (!selectedSupplierId) {
      setError("Please select a supplier.");
      return { status: 400 };
    }
    setError(null);
    setSubmitting(true);

    try {
      await linkSupplierToItem(item.id, parseInt(selectedSupplierId, 10));
      await onSuccess?.();
      return { status: 200 };
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(msg);
      return { status: 500 };
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ReusableDialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      dialogTitle={`Link Supplier to: ${item.item_name}`}
      confirmButtonText={submitting ? "Linking..." : "Confirm Link"}
      onConfirm={onConfirm}
    >
      <div className="grid gap-4">
        {error && (
          <div className="text-red-500 text-sm" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div>Loading suppliers...</div>
        ) : (
          <ScrollArea className="h-72 w-full rounded-md border p-4">
            <RadioGroup
              value={selectedSupplierId ?? ""}
              onValueChange={setSelectedSupplierId}
            >
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <RadioGroupItem
                    value={supplier.id.toString()}
                    id={`supplier-${supplier.id}`}
                  />
                  <Label htmlFor={`supplier-${supplier.id}`}>
                    {supplier.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>
        )}
      </div>
    </ReusableDialog>
  );
}
