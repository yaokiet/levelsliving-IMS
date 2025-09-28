"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/api/userApi"; 
import type { User, UserFormState } from "@/types/user";

interface UserEditModalProps {
  user: User;
  onUpdated?: () => void | Promise<void>;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  hideLauncher?: boolean;
}

// Initialize form state with only the role
function initFormFromUser(user: User): UserFormState {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
    password: "",
    confirmPassword: "",
  };
}

export function UserEditModal({
  user,
  onUpdated,
  isOpen,
  setIsOpen,
  hideLauncher,
}: UserEditModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen ?? internalOpen;
  const setOpen = setIsOpen ?? setInternalOpen;

  const [form, setForm] = useState<UserFormState>(() => initFormFromUser(user));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Keep form in sync when the user changes externally
  useEffect(() => {
    setForm(initFormFromUser(user));
  }, [user]);

  // Reset errors and optionally reset form when dialog open changes
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        setError(null);
        setForm(initFormFromUser(user));
        setSubmitting(false);
      }
    },
    [user, setOpen]
  );

  // Derived flag: has anything changed?
  const initialForm = useMemo(() => initFormFromUser(user), [user]);
  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
  );

  // Validate the form state and build a payload
  const validateAndBuildPayload = (): {
    payload?: { role: string };
    message?: string;
  } => {
    const role = form.role.trim();

    if (!role) return { message: "Role is required." };

    const payload = { role };
    return { payload };
  };

  const onConfirm = async () => {
    setError(null);

    if (!isDirty) {
      return { status: 200 };
    }

    const { payload, message } = validateAndBuildPayload();
    if (!payload) {
      setError(message ?? "Please fix the errors in the form.");
      return { status: 400 };
    }

    try {
      setSubmitting(true);
      await updateUser(String(user.id), payload);
      await onUpdated?.();
      return { status: 200 };
    } catch (e: unknown) {
      const fallback = "An error occurred while updating the user.";
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
      <ReusableDialog
        open={open}
        onOpenChange={handleOpenChange}
        dialogTitle={`Edit User: ${user.name}`}
        dialogDescription="Update the user's role"
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
          {/* Only show the role field */}
          <div className="grid gap-2">
            <label htmlFor="user-role" className="text-sm font-medium">
              Role
            </label>
            <div>
              <Button
                variant="outline"
                className="w-full justify-between"
                disabled={submitting}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    role: prev.role === "admin" ? "user" : "admin",
                  }))
                }
              >
                {form.role === "admin" ? "Admin" : "User"}
              </Button>
            </div>
          </div>
        </div>
      </ReusableDialog>
    </>
  );
}