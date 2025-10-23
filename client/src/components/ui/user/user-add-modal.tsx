"use client";

import { useCallback, useMemo, useState } from "react";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { Button } from "@/components/ui/button";
import { createNewUser } from "@/lib/api/userApi";
import { UserFormFields } from "./user-form-fields";
import type { UserCreate, UserFormState } from "@/types/user";
import { toast } from "sonner";

function initEmptyForm(): UserFormState {
    return {
        name: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
    };
}

interface UserAddModalProps {
    onCreated?: () => void | Promise<void>;
    dialogTitle?: string;
    buttonName?: string;
    confirmButtonText?: string;
}

export function UserAddModal({
    onCreated,
    dialogTitle,
    buttonName,
    confirmButtonText,
}: UserAddModalProps) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<UserFormState>(() => initEmptyForm());
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleOpenChange = useCallback((nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            setError(null);
            setForm(initEmptyForm());
            setSubmitting(false);
        }
    }, []);

    const validateForm = useMemo(() => {
        const { name, email, role, password, confirmPassword } = form;

        if (!name.trim() || !email.trim() || !role.trim() || !password.trim()) {
            return { valid: false, message: "All fields are required." };
        }

        if (password !== confirmPassword) {
            return { valid: false, message: "Passwords do not match." };
        }

        return { valid: true, message: null };
    }, [form]);

    const onConfirm = async () => {
        const { valid, message } = validateForm;

        if (!valid) {
            setError(message);
            return;
        }

        setError(null);

        const payload: UserCreate = {
            name: form.name.trim(),
            email: form.email.trim(),
            role: form.role.trim(),
            password: form.password.trim(),
        };

        try {
            setSubmitting(true);
            await createNewUser(payload);
            await onCreated?.();
            toast.success("Success!", {
                description: `User ${form.name} added successfully.`,
            });
            return { status: 200 };
        } catch (e: unknown) {
            const fallback = "An error occurred while creating the user.";
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
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                {buttonName ?? "Create User"}
            </Button>

            <ReusableDialog
                open={open}
                onOpenChange={handleOpenChange}
                dialogTitle={dialogTitle ?? "Create New User"}
                dialogDescription="Fill in the details to create a new user"
                confirmButtonText={confirmButtonText ?? "Create User"}
                cancelButtonText="Cancel"
                onConfirm={onConfirm}
                confirmButtonDisabled={!validateForm.valid || submitting} // Disable button if form is invalid
            >
                <div className="grid gap-4">
                    {error && (
                        <div className="text-red-500 text-sm mb-2" role="alert">
                            {error}
                        </div>
                    )}
                    <UserFormFields
                        form={form}
                        setForm={setForm}
                        submitting={submitting}
                        isOpen={open}
                    />
                </div>
            </ReusableDialog>
        </>
    );
}