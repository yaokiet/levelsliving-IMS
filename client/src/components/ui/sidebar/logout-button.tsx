"use client";

import {
    LogOut,
} from "lucide-react";

import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { clearUser } from "@/app/_store/authSlice";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/authApi";

export function LogoutButton() {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async (event: Event) => {
        // 1. Prevent the default event behavior.
        event.preventDefault();

        // 2. Perform the logout logic.
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            // 3. Clear the user state.
            dispatch(clearUser());
            // 4. Navigate to the login page.
            router.replace("/login");
        }
    }

    return (
        <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
            <LogOut />
            Log out
        </DropdownMenuItem>
    );
}
