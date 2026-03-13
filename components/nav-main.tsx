"use client"

import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    active: string
    icon?: LucideIcon
  }[]
}) {
  const currentSegments = useSelectedLayoutSegments()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main Management</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                isActive={
                  item.url === "/dashboard"
                  ? currentSegments.length === 1
                  : currentSegments.includes(item.active)
                }
                asChild
                tooltip={item.title}
                >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
