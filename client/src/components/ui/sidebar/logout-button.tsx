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

    async function handleLogout() {
        await logout();
        dispatch(clearUser());
        router.replace("/login");
    }

    return (
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut />
            Log out
        </DropdownMenuItem>
    );
}
