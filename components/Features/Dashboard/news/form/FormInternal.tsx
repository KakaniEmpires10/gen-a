"use client"

import { useState } from "react"
import { Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TiptapFullEditor } from "@/components/TiptapFullEditor/TiptapFullEditor"
import { TiptapFullscreenModal } from "@/components/TiptapFullEditor/TiptapFullscreenModal"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { newsFormSchema } from "../news.constant"

interface FormInternalProps {
    form: UseFormReturn<z.infer<typeof newsFormSchema>>
}

export default function FormInternal({ form }: FormInternalProps) {
    const [isFullscreen, setIsFullscreen] = useState(false)

    // watch hanya subscribe ke field "content" saja
    const contentValue = form.watch("content")

    return (
        <>
            <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem className="col-span-12">
                        <div className="flex items-center justify-between mb-1">
                            <FormLabel>Konten Berita</FormLabel>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs text-muted-foreground"
                                onClick={() => setIsFullscreen(true)}
                            >
                                <Maximize2 className="size-3.5" />
                                Fokus Menulis
                            </Button>
                        </div>
                        <FormDescription>
                            Tulis konten berita di sini, atau{" "}
                            <strong>klik Fokus Menulis</strong> untuk mode fullscreen.
                        </FormDescription>
                        <FormControl>
                            <TiptapFullEditor
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                className="rounded-md"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <TiptapFullscreenModal
                open={isFullscreen}
                onClose={() => setIsFullscreen(false)}
                value={contentValue ?? ""}
                onChange={(html) => form.setValue("content", html, { shouldDirty: true })}
            />
        </>
    )
}