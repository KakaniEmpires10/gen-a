"use client"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DashboardMenu } from "./Layouts/NavList"
import LogoSidebar from "./logo-sidebar"
import { getSiteSettings } from "@/action/SettingAction"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  sitedata?: Awaited<ReturnType<typeof getSiteSettings>>
}

export function AppSidebar({ sitedata, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoSidebar sitedata={sitedata} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={DashboardMenu.navMain} />
        <NavDocuments items={DashboardMenu.documents} />
        <NavSecondary items={DashboardMenu.navSecondary} />
      </SidebarContent>
    </Sidebar>
  )
}