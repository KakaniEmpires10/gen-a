import { useForm } from "react-hook-form"
import { propsModalInsert, tagsSchema } from "../tags.constant"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { mutate } from "swr"
import { addTags, updateTags } from "@/action/MasterAction"
import SubmitButton from "@/components/ui/SubmitButton"

const FormTags = ({ open, onOpenChange, data }: propsModalInsert) => {
    const form = useForm<z.infer<typeof tagsSchema>>({
        resolver: zodResolver(tagsSchema),
        defaultValues: {
            name: data ? data.name : ""
        }
    })

    const handleSubmit = async (values: z.infer<typeof tagsSchema>) => {
        let res;

        if (data) {
            const id = data.id;

            res = await updateTags(id, values.name);
        } else {
            res = await addTags(values.name);
        }

        if (!res) {
            toast.error("terjadi kesalahan, hubungi admin 🙏");
            return
        }

        if (!res.success) {
            toast.error(res.message);
            return
        }

        toast.success(res.message);

        form.reset();
        mutate("/api/tags");

        onOpenChange(!open);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan Nama tags..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <SubmitButton form={form} />
                </div>
            </form>
        </Form>
    )
}

export default FormTags