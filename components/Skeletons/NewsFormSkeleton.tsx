"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function NewsFormSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* ===== Tipe Berita Section ===== */}
            <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-32 rounded-md" />
                    <Skeleton className="h-9 w-32 rounded-md" />
                </div>
                <Skeleton className="h-3 w-2/3" />
                <Separator />
            </div>

            {/* ===== Identitas Berita ===== */}
            <Card>
                <CardContent className="p-6 grid grid-cols-12 gap-4">
                    <Skeleton className="col-span-12 h-5 w-40" />

                    <div className="col-span-6 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    <div className="col-span-6 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    <div className="col-span-12 space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-72 w-full rounded-xl" />
                    </div>
                </CardContent>
            </Card>

            {/* ===== Konten Utama ===== */}
            <Card>
                <CardContent className="p-6 grid grid-cols-12 gap-4">
                    <Skeleton className="col-span-12 h-5 w-40" />

                    <div className="col-span-12 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-40 w-full rounded-md" />
                    </div>

                    <div className="col-span-12 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-24 w-full rounded-md" />
                    </div>
                </CardContent>
            </Card>

            {/* ===== Pengaturan Berita ===== */}
            <Card>
                <CardContent className="p-6 grid grid-cols-12 gap-4">
                    <Skeleton className="col-span-12 h-5 w-48" />

                    <div className="col-span-4 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    <div className="col-span-4 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    <div className="col-span-4 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    <div className="col-span-4 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    <div className="col-span-4 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>

                    <div className="col-span-4 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </CardContent>
            </Card>

            {/* ===== Submit Button ===== */}
            <div className="flex justify-end">
                <Skeleton className="h-10 w-40 rounded-md" />
            </div>
        </div>
    )
}