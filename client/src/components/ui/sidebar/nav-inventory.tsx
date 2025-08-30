"use client"

import {
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()
  
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {inventoryMenuItems.map((item) => (
          <SidebarMenuItem
            key={item.name}
          >
            <SidebarMenuButton 
              asChild 
              className="px-4 py-6 text-lg font-light"
              isActive={pathname === item.url || (item.url !== "/" && pathname?.startsWith(item.url))}
            >
              <Link href={item.url}>
                <item.icon className="!size-5" />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
