import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import NotifButton from "./NotifButton"
import DashboardTitle from "./Layouts/Dashboard/DashboardTitle"
import { auth } from "@/auth"
import { Skeleton } from "./ui/skeleton"

export async function SiteHeader() {
  const session = await auth()

  if (!session) {
    return (
      <Skeleton className="h-10 w-32 rounded-lg" />
    )
  }

  return (
      <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex justify-between py-2 mt-3 shrink-0 items-center gap-2 transition-[width,height] ease-linear mx-2 px-4 lg:px-6 lg:mx-4 shadow backdrop-blur rounded-lg">
        <div className="flex w-full items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <DashboardTitle />
        </div>
        <div className="flex gap-1 items-center">
          <NotifButton />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <NavUser session={session} />
        </div>
      </header>
  )
}
