"use client";

import { useState } from "react";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { deleteSupplier } from "@/lib/api/supplierApi"; // Create this API function
import { toast } from "sonner";

interface SupplierDeleteModalProps {
    supplierId: number; // ID of the supplier to delete
    supplierName: string; // Name of the supplier to display in the confirmation
    onDeleted?: () => void | Promise<void>; // Callback after successful deletion
    isOpen?: boolean; // Whether the modal is open
    setIsOpen?: (open: boolean) => void; // Function to toggle modal visibility
}

export function SupplierDeleteModal({
    supplierId,
    supplierName,
    onDeleted,
    isOpen,
    setIsOpen,
}: SupplierDeleteModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isOpen ?? internalOpen;
    const setOpen = setIsOpen ?? setInternalOpen;

    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleDelete = async () => {
        setError(null);

        try {
            setSubmitting(true);
            await deleteSupplier(supplierId); // Call the API to delete the supplier
            await onDeleted?.(); // Refresh the supplier list or perform other actions
            toast.success("Success!", {
                description: `Supplier ${supplierName} deleted successfully.`,
            });
            setOpen(false); // Close the modal after successful deletion
        } catch (e: unknown) {
            const fallback = "An error occurred while deleting the supplier.";
            const msg =
                e &&
                    typeof e === "object" &&
                    "message" in e &&
                    typeof (e as any).message === "string"
                    ? (e as any).message
                    : fallback;

            console.error(e);
            setError(msg || fallback);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ReusableDialog
            open={open}
            onOpenChange={setOpen}
            dialogTitle={`Delete Supplier: ${supplierName}`}
            dialogDescription="Are you sure you want to delete this supplier? This action cannot be undone."
            confirmButtonText={submitting ? "Deleting..." : "Delete"}
            cancelButtonText="Cancel"
            onConfirm={handleDelete}
        >
            <div className="grid gap-4">
                {error && (
                    <div className="text-red-500 text-sm mb-2" role="alert">
                        {error}
                    </div>
                )}
                <p>
                    This will permanently delete the supplier <strong>{supplierName}</strong>.
                </p>
            </div>
        </ReusableDialog>
    );
}