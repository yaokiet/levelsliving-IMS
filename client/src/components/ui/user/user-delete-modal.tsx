"use client";

import { useState } from "react";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { deleteUser } from "@/lib/api/userApi"; 

interface UserDeleteModalProps {
    userId: string; // ID of the user to delete
    userName: string; // Name of the user to display in the confirmation
    onDeleted?: () => void | Promise<void>; // Callback after successful deletion
    isOpen?: boolean; // Whether the modal is open
    setIsOpen?: (open: boolean) => void; // Function to toggle modal visibility
}

export function UserDeleteModal({
    userId,
    userName,
    onDeleted,
    isOpen,
    setIsOpen,
}: UserDeleteModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isOpen ?? internalOpen;
    const setOpen = setIsOpen ?? setInternalOpen;

    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleDelete = async () => {
        setError(null);

        try {
            setSubmitting(true);
            await deleteUser(userId); // Call the API to delete the user
            await onDeleted?.(); // Refresh the table or perform other actions
            setOpen(false); // Close the modal after successful deletion
        } catch (e: unknown) {
            const fallback = "An error occurred while deleting the user.";
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
            dialogTitle={`Delete User: ${userName}`}
            dialogDescription="Are you sure you want to delete this user? This action cannot be undone."
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
                    This will permanently delete the user <strong>{userName}</strong>.
                </p>
            </div>
        </ReusableDialog>
    );
}