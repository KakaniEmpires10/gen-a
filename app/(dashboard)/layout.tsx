import { getSiteSettings } from "@/action/SettingAction"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import DynamicBreadcrumb from "@/components/ui/dynamic-breadcrumb"
import { SidebarInset } from "@/components/ui/sidebar"
import DashboardProvider from "@/provider/DashboardProvider"
import { DeleteDialogProvider } from "@/provider/DeleteDialogProvider"

const DashboardLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const siteData = await getSiteSettings();

    return (
        <DashboardProvider>
            <AppSidebar sitedata={siteData} variant="floating" />
            <SidebarInset>
                <DeleteDialogProvider>
                    <SiteHeader />
                    <DynamicBreadcrumb />
                    <section className="px-2 pb-4 flex flex-col gap-4 md:gap-6 lg:px-4 min-w-0 w-full">
                        {children}
                    </section>
                    <SiteFooter />
                </DeleteDialogProvider>
            </SidebarInset>
        </DashboardProvider>
    )
}

export default DashboardLayout