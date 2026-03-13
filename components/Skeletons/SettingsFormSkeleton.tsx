import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const SettingsFormSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Logo Upload Card */}
            <Card>
                <CardContent className="p-6">
                    <Skeleton className="h-7 w-40 mx-auto mb-2" /> {/* Title */}
                    <Separator className="mt-2 mb-4 w-44 h-0.5 rounded-full bg-muted mx-auto" />
                    <Skeleton className="h-4 w-96 mx-auto mb-2" /> {/* Description */}

                    {/* Upload Area */}
                    <div className="relative">
                        <div className="border border-dashed rounded-xl min-h-60 flex items-center justify-center p-4">
                            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                                <Skeleton className="size-11 rounded-full mb-2" /> {/* Icon */}
                                <Skeleton className="h-5 w-48 mb-1.5" /> {/* Main text */}
                                <Skeleton className="h-4 w-56 mb-4" /> {/* Sub text */}
                                <Skeleton className="h-9 w-32" /> {/* Button */}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Basic Information Card */}
            <Card>
                <CardContent className="p-6 space-y-8">
                    {/* Section Header */}
                    <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Separator className="w-32 h-0.5 rounded-full bg-muted" />
                    </div>

                    {/* Site Name & Org Name Grid */}
                    <div className="grid gap-4 items-end grid-cols-1 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" /> {/* Label */}
                            <Skeleton className="h-3 w-full" /> {/* Description */}
                            <Skeleton className="h-10 w-full" /> {/* Input */}
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" /> {/* Label */}
                            <Skeleton className="h-10 w-full" /> {/* Input */}
                        </div>
                    </div>

                    {/* Tagline */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" /> {/* Label */}
                        <Skeleton className="h-20 w-full" /> {/* Textarea */}
                    </div>

                    {/* About Text Editor */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-40" /> {/* Label */}
                        <Skeleton className="h-3 w-full max-w-2xl" /> {/* Description */}
                        <div className="border rounded-lg">
                            {/* Editor Toolbar */}
                            <div className="border-b p-2 flex gap-1">
                                {[...Array(12)].map((_, i) => (
                                    <Skeleton key={i} className="h-8 w-8" />
                                ))}
                            </div>
                            {/* Editor Content */}
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[95%]" />
                                <Skeleton className="h-4 w-[90%]" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Vision & Mission Card */}
            <Card>
                <CardContent className="p-6 space-y-8">
                    {/* Section Header */}
                    <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Separator className="w-24 h-0.5 rounded-full bg-muted" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Vision Column */}
                        <div className="space-y-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" /> {/* Label */}
                                <Skeleton className="h-3 w-48" /> {/* Description */}
                                <Skeleton className="h-10 w-full" /> {/* Input */}
                            </div>
                            <Skeleton className="h-9 w-24 mt-2" /> {/* Add Button */}
                        </div>

                        {/* Mission Column */}
                        <div className="space-y-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" /> {/* Label */}
                                <Skeleton className="h-3 w-48" /> {/* Description */}
                                <Skeleton className="h-10 w-full" /> {/* Input */}
                            </div>
                            <Skeleton className="h-9 w-24 mt-2" /> {/* Add Button */}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card>
                <CardContent className="p-6 space-y-8">
                    {/* Section Header */}
                    <div>
                        <Skeleton className="h-6 w-44 mb-2" />
                        <Separator className="w-32 h-0.5 rounded-full bg-muted" />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" /> {/* Label */}
                        <Skeleton className="h-20 w-full" /> {/* Textarea */}
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" /> {/* Label */}
                            <Skeleton className="h-10 w-full" /> {/* Input */}
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" /> {/* Label */}
                            <Skeleton className="h-10 w-full" /> {/* Input */}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Social Information Card */}
            <Card>
                <CardContent className="p-6 space-y-8">
                    {/* Section Header */}
                    <div>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Separator className="w-32 h-0.5 rounded-full bg-muted" />
                    </div>

                    {/* Social Media Grid (3 columns) */}
                    <div className="grid gap-y-8 gap-x-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {/* Facebook */}
                        <div className="flex flex-col gap-4 lg:gap-8">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" /> {/* Label with icon */}
                                <Skeleton className="h-10 w-full" /> {/* Input */}
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" /> {/* Label */}
                                <Skeleton className="h-10 w-full" /> {/* Input */}
                            </div>
                        </div>

                        {/* Instagram */}
                        <div className="flex flex-col gap-4 lg:gap-8">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" /> {/* Label with icon */}
                                <Skeleton className="h-10 w-full" /> {/* Input */}
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" /> {/* Label */}
                                <Skeleton className="h-10 w-full" /> {/* Input */}
                            </div>
                        </div>

                        {/* YouTube */}
                        <div className="flex flex-col gap-4 lg:gap-8">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" /> {/* Label with icon */}
                                <Skeleton className="h-10 w-full" /> {/* Input */}
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" /> {/* Label */}
                                <Skeleton className="h-10 w-full" /> {/* Input */}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    )
}

export default SettingsFormSkeleton