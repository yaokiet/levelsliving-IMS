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
import { useRoleGuard } from "@/hooks/useRoleGuard";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, initialized } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const isAuthorized = useRoleGuard("admin"); 

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, initialized, router]);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !isAuthorized) return null; 

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