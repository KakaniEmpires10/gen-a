import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const MemberFormSkeleton = () => {
    return (
        <Card>
            <CardContent className="p-4 sm:p-6 pt-8 sm:pt-12 relative">
                {/* Decorative Wave Header */}
                <div
                    className="absolute top-0 left-0 w-full overflow-hidden rotate-180"
                    style={{ lineHeight: 0 }}
                >
                    <svg
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                        className="block h-[80px] sm:h-[150px] md:h-[270px]"
                        style={{
                            width: 'calc(243% + 1.3px)',
                        }}
                    >
                        <path
                            d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z"
                            className="fill-primary"
                        />
                    </svg>
                </div>

                <div className="space-y-6 sm:space-y-8">
                    {/* Profile Image Upload */}
                    <div className="relative w-fit">
                        <Skeleton className="size-20 sm:size-24 rounded-full" />
                        <Skeleton className="h-4 w-24 mt-2" /> {/* Label */}
                    </div>

                    {/* Gender Radio Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-12 w-20" /> {/* Pria */}
                        <Skeleton className="h-12 w-20" /> {/* Wanita */}
                    </div>

                    {/* Personal Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-x-4 sm:gap-y-6 lg:gap-y-8 items-start">
                        {/* Name */}
                        <div className="sm:col-span-2 lg:col-span-4 space-y-2">
                            <Skeleton className="h-4 w-16" /> {/* Label */}
                            <Skeleton className="h-10 w-full" /> {/* Input */}
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-2 lg:col-span-4 space-y-2">
                            <Skeleton className="h-4 w-16" /> {/* Label */}
                            <Skeleton className="h-10 w-full" /> {/* Input */}
                        </div>

                        {/* Phone */}
                        <div className="sm:col-span-2 lg:col-span-4 space-y-2">
                            <Skeleton className="h-4 w-20" /> {/* Label */}
                            <Skeleton className="h-10 w-full" /> {/* Input */}
                        </div>

                        {/* Birthdate */}
                        <div className="sm:col-span-2 lg:col-span-3 space-y-2">
                            <Skeleton className="h-4 w-28" /> {/* Label */}
                            <Skeleton className="h-10 w-full" /> {/* Date Picker */}
                        </div>

                        {/* Education Level */}
                        <div className="sm:col-span-1 lg:col-span-2 space-y-2">
                            <Skeleton className="h-4 w-24" /> {/* Label */}
                            <Skeleton className="h-10 w-full" /> {/* Select */}
                        </div>

                        {/* Education Title */}
                        <div className="sm:col-span-1 lg:col-span-2 space-y-2">
                            <Skeleton className="h-4 w-16" /> {/* Label */}
                            <Skeleton className="h-10 w-full" /> {/* Input */}
                        </div>

                        {/* Field of Interest */}
                        <div className="sm:col-span-2 lg:col-span-5 space-y-2">
                            <Skeleton className="h-4 w-28" /> {/* Label */}
                            <Skeleton className="h-20 w-full rounded-md" /> {/* Tag Input */}
                            <Skeleton className="h-3 w-full" /> {/* Description */}
                        </div>

                        {/* Skills */}
                        <div className="sm:col-span-2 lg:col-span-12 space-y-2">
                            <Skeleton className="h-4 w-16" /> {/* Label */}
                            <Skeleton className="h-3 w-full max-w-xs" /> {/* Description */}
                            <Skeleton className="h-32 w-full rounded-md" /> {/* Tag Input */}
                        </div>
                    </div>

                    {/* Membership Type Section */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-40" /> {/* Label */}
                            <div className="inline-flex h-9 rounded-md p-1 w-full sm:w-auto bg-muted">
                                <Skeleton className="h-7 w-24" />
                                <Skeleton className="h-7 w-24 ml-1" />
                                <Skeleton className="h-7 w-24 ml-1" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-full" /> {/* Select dropdown */}
                    </div>

                    {/* Address Fields */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" /> {/* Label */}
                            <Skeleton className="h-10 w-full" /> {/* Input */}
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" /> {/* Label */}
                            <Skeleton className="h-10 w-full" /> {/* Input */}
                        </div>
                    </div>

                    {/* Bio Editor */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" /> {/* Label */}
                        <Skeleton className="h-3 w-full max-w-3xl" /> {/* Description */}
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

                    {/* Social Media Grid (3 columns) */}
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {/* Facebook */}
                        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
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
                        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" /> {/* Label with icon */}
                                <Skeleton className="h-10 w-full" /> {/* Input */}
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" /> {/* Label */}
                                <Skeleton className="h-10 w-full" /> {/* Input */}
                            </div>
                        </div>

                        {/* LinkedIn */}
                        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
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

                    {/* Submit Button */}
                    <div className="flex justify-end pt-2 sm:pt-4">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MemberFormSkeleton