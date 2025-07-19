"use client"

import * as React from "react"
import {
  Warehouse,
  GalleryVerticalEnd,
  Truck,
  Container,
  Gauge,
  Files
} from "lucide-react"

import { NavInventory } from "@/components/ui/sidebar/nav-inventory"
import { NavUser } from "@/components/ui/sidebar/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  inventoryMenuItems: [
    {
      name: "Dashboard",
      url: "#",
      icon: Gauge,
    },
    {
      name: "Inventory",
      url: "#",
      icon: Warehouse,
    },
    {
      name: "Reports",
      url: "#",
      icon: Files,
    },
    {
      name: "Suppliers",
      url: "#",
      icon: Container,
    },
    {
      name: "Orders",
      url: "#",
      icon: Truck,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Levels Living</span>
                  <span className="">IMS</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavInventory inventoryMenuItems={data.inventoryMenuItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
