// components/Features/Dashboard/news/table/StatusDropdown.tsx
"use client"

import { useState, useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle2, Clock, Archive, ChevronDown, Loader2 } from "lucide-react"
import { updateNewsStatus } from "@/action/NewsAction"
import toast from "react-hot-toast"
import { NewsStatus } from "@prisma/client"

// ── Config ─────────────────────────────────────────────────────
const statusConfig = {
    PUBLISHED: {
        label: "Published",
        variant: "soft-success" as const,
        icon: CheckCircle2,
    },
    DRAFT: {
        label: "Draft",
        variant: "soft-warning" as const,
        icon: Clock,
    },
    ARCHIVED: {
        label: "Archived",
        variant: "muted" as const,
        icon: Archive,
    },
} satisfies Record<NewsStatus, { label: string; variant: string; icon: React.ElementType }>

const allStatuses = Object.entries(statusConfig) as [
    NewsStatus,
    (typeof statusConfig)[NewsStatus],
][]

// ── Component ──────────────────────────────────────────────────
interface StatusDropdownProps {
    id: string
    currentStatus: NewsStatus
}

export default function StatusDropdown({ id, currentStatus }: StatusDropdownProps) {
    const [status, setStatus] = useState<NewsStatus>(currentStatus)
    const [isPending, startTransition] = useTransition()

    const config = statusConfig[status]
    const Icon = isPending ? Loader2 : config.icon

    const handleChange = (next: NewsStatus) => {
        if (next === status) return

        startTransition(async () => {
            const prev = status
            setStatus(next) // optimistic

            const res = await updateNewsStatus(id, next)

            if (!res.success) {
                setStatus(prev) // rollback
                toast.error(res.message)
            } else {
                toast.success(res.message)
            }
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isPending}>
                <button className="focus:outline-none group" aria-label="Ubah status">
                    <Badge
                        variant={config.variant}
                        className="gap-1 cursor-pointer select-none pr-1.5 transition-opacity group-disabled:opacity-60"
                    >
                        <Icon className={`size-3 ${isPending ? "animate-spin" : ""}`} />
                        {config.label}
                        <ChevronDown className="size-3 opacity-60" />
                    </Badge>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Ubah status ke
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allStatuses.map(([key, cfg]) => {
                    const ItemIcon = cfg.icon
                    const isActive = key === status
                    return (
                        <DropdownMenuItem
                            key={key}
                            onSelect={() => handleChange(key)}
                            className="gap-2 cursor-pointer"
                            disabled={isActive}
                        >
                            <Badge
                                variant={cfg.variant}
                                className="gap-1 pointer-events-none"
                            >
                                <ItemIcon className="size-3" />
                                {cfg.label}
                            </Badge>
                            {isActive && (
                                <span className="ml-auto text-[10px] text-muted-foreground">
                                    aktif
                                </span>
                            )}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}