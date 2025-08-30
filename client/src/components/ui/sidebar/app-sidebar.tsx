"use client";

import * as React from "react";
import {
  Warehouse,
  GalleryVerticalEnd,
  Truck,
  Container,
  Gauge,
  Files,
  Users
} from "lucide-react";
import Link from "next/link";

import { NavInventory } from "@/components/ui/sidebar/nav-inventory";
import { NavUser } from "@/components/ui/sidebar/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { RootState } from "@/app/_store/redux-store";
import { useSelector } from "react-redux";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.auth.user);

  const menuItems = [
    {
      name: "Dashboard",
      url: "/",
      icon: Gauge,
    },
    {
      name: "Inventory",
      url: "/item-details",
      icon: Warehouse,
    },
    {
      name: "Reports",
      url: "/reports",
      icon: Files,
    },
    {
      name: "Suppliers",
      url: "/suppliers",
      icon: Container,
    },
    {
      name: "Orders",
      url: "/orders",
      icon: Truck,
    },
  ];

  // Add admin-only link if user is admin
  if (user?.role === "admin") {
    menuItems.push({
      name: "User Management",
      url: "/users",
      icon: Users,
    });
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Levels Living</span>
                  <span className="">IMS</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavInventory inventoryMenuItems={menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ?? { name: "user", email: "user@example.com" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
