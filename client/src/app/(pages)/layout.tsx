"use client";

import "../globals.css";
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/topbar/theme-provider"
import { AppTopbar } from "@/components/ui/topbar/app-topbar";
import { useSelector } from "react-redux";
import { RootState } from "@/app/_store/redux-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null; // Or a spinner

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppTopbar />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}