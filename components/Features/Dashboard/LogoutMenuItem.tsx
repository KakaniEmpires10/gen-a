"use client"

import { useState } from "react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Loader2, LogOut, LogOutIcon } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function LogoutMenuItem() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogout = async () => {
        try {
            setIsLoading(true)

            await signOut({ redirect: false })

            router.push("/")
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Ini tetap di dalam dropdown */}
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault()
                    setOpen(true)
                }}
                className="text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive cursor-pointer"
            >
                <LogOutIcon className="size-4 mr-2" />
                Log out
            </DropdownMenuItem>

            {/* Ini di luar dropdown context */}
            <AlertDialog open={open} onOpenChange={(val) => !isLoading && setOpen(val)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Yakin ingin Logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan keluar dari sistem dan harus login lagi jika ingin masuk.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <Button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoading}
                            variant="destructive"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <LogOut />
                                    Logout
                                </>
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}