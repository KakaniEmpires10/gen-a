// app/dashboard/error.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, RefreshCw, MessageCircle, LayoutDashboard, FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SetPageTitle } from "@/components/Layouts/Dashboard/SetPageTitle"
import { Alert, AlertDescription } from "@/components/ui/alert"

type ErrorType = "database" | "network" | "timeout" | "not-found" | "unknown"

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string; type?: ErrorType }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error("Dashboard Error:", error)
    }, [error])

    function getErrorInfo(err: Error & { type?: ErrorType }): {
        title: string
        message: string
        suggestion: string
        type: ErrorType
        icon: React.ReactNode
        bgColor: string
    } {
        // Check for specific error types
        if (err.type === "not-found" || err.message.includes("NOT_FOUND")) {
            return {
                title: "Data Tidak Ditemukan",
                message: err.message,
                suggestion: "Periksa kembali atau kembali ke halaman sebelumnya.",
                type: "not-found",
                icon: <FileQuestion className="h-16 w-16 text-amber-600" strokeWidth={1.5} />,
                bgColor: "from-amber-50 to-orange-50 ring-amber-200/50"
            }
        }

        if (err.message.includes("P1001") || err.message.includes("Can't reach database server")) {
            return {
                title: "Koneksi Database Terputus",
                message: "Sistem tidak dapat terhubung ke database saat ini.",
                suggestion: "Pastikan koneksi internet Anda stabil, lalu coba lagi dalam beberapa saat.",
                type: "database",
                icon: <AlertCircle className="h-16 w-16 text-destructive" strokeWidth={1.5} />,
                bgColor: "from-red-50 to-rose-50 ring-red-200/50"
            }
        }

        if (err.message.includes("P2024") || err.message.includes("timeout")) {
            return {
                title: "Sistem Sedang Sibuk",
                message: "Koneksi timeout karena database sedang memproses permintaan lain.",
                suggestion: "Tunggu sebentar dan coba refresh halaman ini.",
                type: "timeout",
                icon: <AlertCircle className="h-16 w-16 text-orange-600" strokeWidth={1.5} />,
                bgColor: "from-orange-50 to-amber-50 ring-orange-200/50"
            }
        }

        if (err.message.includes("network") || err.message.includes("fetch failed")) {
            return {
                title: "Gangguan Koneksi",
                message: "Terjadi masalah dengan koneksi internet Anda.",
                suggestion: "Periksa koneksi internet dan coba lagi.",
                type: "network",
                icon: <AlertCircle className="h-16 w-16 text-blue-600" strokeWidth={1.5} />,
                bgColor: "from-blue-50 to-cyan-50 ring-blue-200/50"
            }
        }

        return {
            title: "Terjadi Kesalahan Sistem",
            message: "Maaf, terjadi kesalahan yang tidak terduga pada sistem.",
            suggestion: "Coba refresh halaman atau kembali ke dashboard.",
            type: "unknown",
            icon: <AlertCircle className="h-16 w-16 text-destructive" strokeWidth={1.5} />,
            bgColor: "from-red-50 to-rose-50 ring-red-200/50"
        }
    }

    const errorInfo = getErrorInfo(error)

    return (
        <>
            <SetPageTitle title={`Error - ${errorInfo.title}`} />
            <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-6">
                <div className="p-8 sm:p-12 max-w-2xl w-full">
                    {/* Icon Section */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full" />
                            <div className={`relative rounded-full bg-gradient-to-br ${errorInfo.bgColor} p-6 ring-1`}>
                                {errorInfo.icon}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-6 text-center">
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold tracking-wide text-gray-900 dark:text-gray-100">
                                {errorInfo.title}
                            </h1>
                            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                {errorInfo.message}
                            </p>
                        </div>

                        {/* Suggestion Box */}
                        <Alert variant="soft-destructive">
                            <MessageCircle className="size-4 mt-0.5 flex-shrink-0" />
                            <AlertDescription>
                                {errorInfo.suggestion}
                            </AlertDescription>
                        </Alert>

                        {/* Error Details (Development only) */}
                        {process.env.NODE_ENV === "development" && (
                            <Alert variant="outline" className="text-left">
                                <AlertDescription className="font-mono text-xs space-y-1">
                                    <p className="font-semibold text-sm mb-2">Debug Info:</p>
                                    <p>Message: {error.message}</p>
                                    {error.digest && <p>Digest: {error.digest}</p>}
                                    {error.stack && (
                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-xs font-semibold">Stack Trace</summary>
                                            <pre className="mt-2 text-[10px] overflow-x-auto">{error.stack}</pre>
                                        </details>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Error Digest (Production) */}
                        {process.env.NODE_ENV === "production" && error.digest && (
                            <div className="pt-2">
                                <p className="text-xs text-gray-400 font-mono">
                                    Error ID: {error.digest}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col justify-center sm:flex-row gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                <LayoutDashboard className="size-4" />
                                Kembali
                            </Button>

                            <Button
                                onClick={() => {
                                    reset()
                                    router.refresh()
                                }}
                                variant="default"
                            >
                                <RefreshCw className="size-4" />
                                Coba Lagi
                            </Button>
                        </div>
                    </div>

                    {/* Footer Help Text */}
                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                            Jika masalah terus berlanjut, silakan hubungi{" "}
                            <button
                                onClick={() => router.push("/dashboard/support")}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium hover:underline"
                            >
                                Tim Support
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}