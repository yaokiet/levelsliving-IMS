"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { updateSupplier } from "@/lib/api/supplierApi";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Supplier, SupplierUpdate } from "@/types/supplier";

interface SupplierEditModalProps {
    supplier: Supplier;
    onUpdated?: () => void | Promise<void>;
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
}

// Initialize form state from the supplier object
function initFormFromSupplier(supplier: Supplier): SupplierUpdate {
    return {
        name: supplier.name ?? "",
        email: supplier.email ?? "",
        contact_number: supplier.contact_number ?? "",
        description: supplier.description ?? "",
    };
}

export function SupplierEditModal({
    supplier,
    onUpdated,
    isOpen,
    setIsOpen,
}: SupplierEditModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isOpen ?? internalOpen;
    const setOpen = setIsOpen ?? setInternalOpen;

    const [form, setForm] = useState<SupplierUpdate>(() =>
        initFormFromSupplier(supplier)
    );
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Keep form in sync when the supplier changes externally
    useEffect(() => {
        setForm(initFormFromSupplier(supplier));
    }, [supplier]);

    // Reset errors and optionally reset form when dialog open changes
    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            setOpen(nextOpen);
            if (!nextOpen) {
                setError(null);
                setForm(initFormFromSupplier(supplier));
                setSubmitting(false);
            }
        },
        [supplier, setOpen]
    );

    // Validate the form state and build a payload
    const validateAndBuildPayload = (): {
        payload?: SupplierUpdate;
        message?: string;
    } => {
        const { name = "", email = "", contact_number = "" } = form;

        if (!name.trim()) return { message: "Name is required." };
        if (!email.trim()) return { message: "Email is required." };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return { message: "Please enter a valid email address." };
        }
        if (!contact_number.trim()) return { message: "Contact number is required." };

        const payload = { ...form };
        return { payload };
    };

    const onConfirm = async () => {
        setError(null);

        const { payload, message } = validateAndBuildPayload();
        if (!payload) {
            setError(message ?? "Please fix the errors in the form.");
            return { status: 400 };
        }

        try {
            setSubmitting(true);
            await updateSupplier(supplier.id, payload);
            await onUpdated?.();
            toast.success("Success!", {
                description: `Supplier ${form.name} updated successfully.`,
            });
            return { status: 200 };
        } catch (e: unknown) {
            const fallback = "An error occurred while updating the supplier.";
            const msg =
                e &&
                    typeof e === "object" &&
                    "message" in e &&
                    typeof (e as any).message === "string"
                    ? (e as any).message
                    : fallback;

            console.error(e);
            setError(msg || fallback);
            return { status: 500 };
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ReusableDialog
            open={open}
            onOpenChange={handleOpenChange}
            dialogTitle={`Edit Supplier: ${supplier.name}`}
            dialogDescription="Update the supplier's details below."
            confirmButtonText={submitting ? "Saving..." : "Save"}
            cancelButtonText="Cancel"
            onConfirm={onConfirm}
        >
            <div className="grid gap-4">
                {error && (
                    <div className="text-red-500 text-sm mb-2" role="alert">
                        {error}
                    </div>
                )}
                {/* Form Fields */}
                <div className="grid gap-3">
                    <Label htmlFor="supplier-name">
                        Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="supplier-name"
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Enter supplier name (required)"
                        required
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="supplier-email">
                        Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="supplier-email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="Enter email address (required)"
                        required
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="supplier-contact">
                        Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="supplier-contact"
                        type="text"
                        value={form.contact_number}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, contact_number: e.target.value }))
                        }
                        placeholder="Enter contact number (required)"
                        required
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="supplier-description">Description</Label>
                    <Input
                        id="supplier-description"
                        type="text"
                        value={form.description}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Enter supplier description"
                    />
                </div>
            </div>
        </ReusableDialog>
    );
}