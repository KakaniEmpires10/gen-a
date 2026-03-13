import {
  Activity,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Session } from "next-auth"
import { LogoutMenuItem } from "./Features/Dashboard/LogoutMenuItem"

export function NavUser({ session }: { session: Session }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between gap-4 hover:bg-muted p-2 rounded-lg transition-colors duration-200">
        <MoreVerticalIcon className="ml-auto size-3" />
        <div className="text-left text-sm leading-tight">
          <span className="block truncate font-medium capitalize">{session?.user?.name}</span>
          <span className="block text-xs text-muted-foreground lowercase">
            {session?.user?.role}
          </span>
        </div>
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={session?.user?.image ? session?.user?.image : "/placeholder_male.png"} alt="user" />
          <AvatarFallback className="rounded-lg bg-gray-600 text-white">CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={session?.user?.image ? session?.user?.image : "/placeholder_male.png"} alt="user" />
              <AvatarFallback className="rounded-lg">0</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium capitalize">{session?.user?.name}</span>
              <span className="text-xs text-muted-foreground lowercase">
                {session?.user?.role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserCircleIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Activity />
            Activity
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
