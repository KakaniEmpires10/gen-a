import { AlertCircle, BellRing } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const NotifButton = () => {
    const notifNum: number = 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                    <BellRing />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-2">
                {notifNum !== 0 ? (
                    <DropdownMenuGroup>
                        {Array.from({ length: notifNum }).map((_, i) => (
                            <DropdownMenuItem className="items-start" key={i}>
                                <AlertCircle className="mt-[3px]" />
                                <div className="flex flex-col">
                                    <p className="font-medium">Notification {i + 1}</p>
                                    <span className="truncate text-xs text-muted-foreground max-w-[200px]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium, distinctio!</span>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                ) : (
                    <p className="text-xs">No new notifications</p>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NotifButton