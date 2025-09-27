"use client";

import React, { useEffect, useState } from "react";
import type { UserFormState } from "@/types/user";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UserFormFieldsProps {
    form: UserFormState;
    setForm: React.Dispatch<React.SetStateAction<UserFormState>>;
    submitting?: boolean;
    isOpen?: boolean; // Add this prop to track if the component is open
}

export function UserFormFields({ form, setForm, submitting, isOpen }: UserFormFieldsProps) {
    const [errors, setErrors] = useState<Partial<UserFormState>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof UserFormState, boolean>>>({});

    // Validate fields dynamically
    useEffect(() => {
        const newErrors: Partial<UserFormState> = {};

        if (!form.name.trim()) newErrors.name = "Name is required.";
        if (!form.email.trim()) newErrors.email = "Email is required.";
        if (!form.role.trim()) newErrors.role = "Role is required.";
        if (!form.password.trim()) newErrors.password = "Password is required.";
        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
    }, [form]);

    // Reset errors and touched state when the component is closed
    useEffect(() => {
        setTouched({});
        setErrors({});
    }, [isOpen]);

    const onChange =
        (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const onBlur = (key: keyof typeof form) => () => {
        setTouched((prev) => ({ ...prev, [key]: true }));
    };

    return (
        <>
            {/* Name */}
            <div className="grid gap-2">
                <label htmlFor="user-name" className="text-sm font-medium">
                    Name
                </label>
                <input
                    id="user-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange("name")}
                    onBlur={onBlur("name")}
                    className={`w-full border rounded px-2 py-1 ${touched.name && errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                    placeholder="e.g., John Doe"
                    autoComplete="off"
                    required
                    disabled={submitting}
                />
                {touched.name && errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
                <label htmlFor="user-email" className="text-sm font-medium">
                    Email
                </label>
                <input
                    id="user-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    onBlur={onBlur("email")}
                    className={`w-full border rounded px-2 py-1 ${touched.email && errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                    placeholder="e.g., john.doe@example.com"
                    autoComplete="off"
                    required
                    disabled={submitting}
                />
                {touched.email && errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                )}
            </div>

            {/* Role */}
            <div className="grid gap-2">
                <label htmlFor="user-role" className="text-sm font-medium">
                    Role
                </label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className={`w-full justify-between ${touched.role && errors.role ? "border-red-500" : "border-gray-300"
                                }`}
                            disabled={submitting}
                        >
                            {form.role ? (form.role === "admin" ? "Admin" : "User") : "Select Role"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() => setForm((prev) => ({ ...prev, role: "admin" }))}
                        >
                            Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setForm((prev) => ({ ...prev, role: "user" }))}
                        >
                            User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {touched.role && errors.role && (
                    <p className="text-red-500 text-sm">{errors.role}</p>
                )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
                <label htmlFor="user-password" className="text-sm font-medium">
                    Password
                </label>
                <input
                    id="user-password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={onChange("password")}
                    onBlur={onBlur("password")}
                    className={`w-full border rounded px-2 py-1 ${touched.password && errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                    placeholder="Enter password"
                    autoComplete="new-password"
                    required
                    disabled={submitting}
                />
                {touched.password && errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div className="grid gap-2">
                <label htmlFor="user-confirm-password" className="text-sm font-medium">
                    Confirm Password
                </label>
                <input
                    id="user-confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={onChange("confirmPassword")}
                    onBlur={onBlur("confirmPassword")}
                    className={`w-full border rounded px-2 py-1 ${touched.confirmPassword && errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    required
                    disabled={submitting}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
            </div>
        </>
    );
}