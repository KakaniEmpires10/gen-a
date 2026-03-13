import Link from "next/link"
import { Home, LayoutDashboard } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
            <div className="mx-auto flex max-w-[600px] flex-col items-center justify-center space-y-4">
                <div className="text-[150px] font-bold bg-gradient-to-br from-yellow-400 to-yellow-500 text-transparent bg-clip-text sm:text-[200px]">
                    404
                </div>

                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Page Not Found</h1>
                <p className="text-muted-foreground">
                    Maaf, Halaman yang anda cari tidak dapat kami temukan di server atau memang tidak ada. Silahkan pilih salah satu navigasi dibawah <br />👇
                </p>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <Button asChild className="flex-1">
                        <Link href="/"><Home /> Halaman Utama</Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                        <Link href="/dashboard"><LayoutDashboard />Dashboard</Link>
                    </Button>
                </div>

                <div className="mt-8">
                    <p className="text-sm text-muted-foreground">
                        Butuh Bantuan?{" "}
                        <Link href="/contact" className="font-medium underline underline-offset-4">
                            Contact Support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
