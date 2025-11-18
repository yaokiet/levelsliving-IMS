"use client";

import { useState } from "react";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { toast } from "sonner";

interface StatusChangeModalProps {
    currentStatus: string; // Current status of the purchase order
    newStatus: string; // New status to change to
    onConfirm: () => void | Promise<void>; // Callback to execute on confirmation
    isOpen?: boolean; // Whether the modal is open
    setIsOpen?: (open: boolean) => void; // Function to toggle modal visibility
}

export function StatusChangeModal({
    currentStatus,
    newStatus,
    onConfirm,
    isOpen,
    setIsOpen,
}: StatusChangeModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isOpen ?? internalOpen;
    const setOpen = setIsOpen ?? setInternalOpen;

    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        try {
            setSubmitting(true);
            await onConfirm(); // Call the provided callback to change the status
            setOpen(false); // Close the modal after successful confirmation
        } catch (e: unknown) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ReusableDialog
            open={open}
            onOpenChange={setOpen}
            dialogTitle={`Change Status to ${newStatus}`}
            dialogDescription={`Are you sure you want to change the status from "${currentStatus}" to "${newStatus}"?`}
            confirmButtonText={submitting ? "Changing..." : "Confirm"}
            cancelButtonText="Cancel"
            onConfirm={handleConfirm}
        >
            <div className="grid gap-4">
                <p>
                    This will update the status of the purchase order to{" "}
                    <strong>{newStatus}</strong>. This action cannot be undone.
                </p>
            </div>
        </ReusableDialog>
    );
}