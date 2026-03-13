"use client"

import {
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"

export function NavDocuments({
  items,
}: {
  items: {
    title: string
    url: string
    active: string
    icon: LucideIcon
  }[]
}) {
  const currentSegments = useSelectedLayoutSegments()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Member Management</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={currentSegments.includes(item.active)} tooltip={item.title}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
