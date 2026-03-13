import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { newsFormSchema } from "../news.constant"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

const FormInternal = ({ form }: { form: UseFormReturn<z.infer<typeof newsFormSchema>> }) => {
    return (
        <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
                <FormItem className="col-span-12">
                    <FormLabel>Konten Berita</FormLabel>
                    <FormControl>
                        <Textarea
                            rows={12}
                            placeholder="Tulis konten berita di sini... (Nanti akan diganti dengan Tiptap Editor)"
                            {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        Editor Tiptap akan diintegrasikan setelah form selesai
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormInternal