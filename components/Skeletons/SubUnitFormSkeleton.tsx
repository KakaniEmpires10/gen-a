import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const SubUnitFormSkeleton = () => {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-8">
                    {/* Logo Upload Section */}
                    <div>
                        <Skeleton className="h-7 w-48 mx-auto mb-2" /> {/* Title */}
                        <Separator className="mt-2 mb-4 w-44 h-0.5 rounded-full bg-muted mx-auto" />
                        <Skeleton className="h-4 w-80 mx-auto mb-2" /> {/* Description */}

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
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" /> {/* Label */}
                            <Skeleton className="h-3 w-full" /> {/* Description */}
                            <Skeleton className="h-10 w-full" /> {/* Input */}
                        </div>

                        {/* Abbreviation Field */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" /> {/* Label */}
                            <Skeleton className="h-3 w-full" /> {/* Description */}
                            <Skeleton className="h-10 w-full" /> {/* Input */}
                        </div>

                        {/* Color Field */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" /> {/* Label */}
                            <Skeleton className="h-3 w-full" /> {/* Description */}
                            <Skeleton className="h-10 w-full" /> {/* Select */}
                        </div>
                    </div>

                    {/* Description Editor */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36" /> {/* Label */}
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
                                <Skeleton className="h-4 w-[85%]" />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SubUnitFormSkeleton