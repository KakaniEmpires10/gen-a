"use client"

import { toggleMemberStatus } from "@/action/MemberAction"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"

interface StatusSwitchProps {
    id: string
    initial: boolean
    showLabel?: boolean
    showTooltip?: boolean
    variant?: "default" | "success" | "destructive"
    size?: "default" | "sm" | "lg"
    className?: string
    activeLabel?: string
    inactiveLabel?: string
    onSuccess?: (newState: boolean) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: (error: any) => void
}

export function StatusSwitch({
    id,
    initial,
    showLabel = false,
    showTooltip = true,
    variant = "success",
    size = "default",
    className,
    activeLabel = "Aktif",
    inactiveLabel = "Nonaktif",
    onSuccess,
    onError,
}: StatusSwitchProps) {
    const [isPending, startTransition] = useTransition()
    const [state, setState] = useState(initial)
    const [showSuccess, setShowSuccess] = useState(false)

    function onChange(value: boolean) {
        // Optimistic update UI
        setState(value)

        startTransition(async () => {
            try {
                const res = await toggleMemberStatus(id, value)

                if (!res.success) {
                    // Revert if failed
                    setState(!value)
                    onError?.(new Error("Gagal memperbarui status"))
                } else {
                    // Show success indicator briefly
                    setShowSuccess(true)
                    setTimeout(() => setShowSuccess(false), 1500)
                    onSuccess?.(value)
                }
            } catch (error) {
                // Revert on error
                setState(!value)
                onError?.(error)
            }
        })
    }

    const SwitchComponent = (
        <div className={cn("relative inline-flex", className)}>
            <Switch
                checked={state}
                onCheckedChange={onChange}
                disabled={isPending}
                variant={variant}
                size={size}
                className={cn(
                    "mx-auto transition-all",
                    showSuccess && "ring-2 ring-success ring-offset-2"
                )}
            />
            {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                </div>
            )}
            {showSuccess && (
                <div className="absolute -top-1 -right-1">
                    <CheckCircle2 className="h-3 w-3 text-success fill-success-foreground animate-in zoom-in-50" />
                </div>
            )}
        </div>
    )

    if (showLabel) {
        return (
            <div className="flex items-center justify-center gap-2">
                {showTooltip ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>{SwitchComponent}</TooltipTrigger>
                            <TooltipContent showArrow className="dark">
                                <p className="text-xs">
                                    Klik untuk {state ? "Menonaktifkan" : "Mengaktifkan"}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    SwitchComponent
                )}
                <Badge
                    variant={state ? "soft-success" : "soft-destructive"}
                    className="min-w-[70px] justify-center text-xs font-medium transition-all"
                >
                    {isPending ? (
                        <div className="flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            {state ? (
                                <CheckCircle2 className="h-3 w-3" />
                            ) : (
                                <XCircle className="h-3 w-3" />
                            )}
                            <span>{state ? activeLabel : inactiveLabel}</span>
                        </div>
                    )}
                </Badge>
            </div>
        )
    }

    if (showTooltip) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{SwitchComponent}</TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">
                            {state ? activeLabel : inactiveLabel}
                            {!isPending && ` - Klik untuk ${state ? "Menonaktifkan" : "Mengaktifkan"}`}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return SwitchComponent
}