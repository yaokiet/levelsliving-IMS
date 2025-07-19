"use client"

import {
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavInventory({
  inventoryMenuItems,
}: {
  inventoryMenuItems: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {inventoryMenuItems.map((item) => (
          <SidebarMenuItem
            key={item.name}
          >
            <SidebarMenuButton asChild className="px-4 py-6 text-lg font-light">
              <a href={item.url}>
                <item.icon className="!size-5" />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
