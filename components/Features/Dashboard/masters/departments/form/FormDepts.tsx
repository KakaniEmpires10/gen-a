import { useForm } from "react-hook-form"
import { departmentSchema, propsModalInsertDepts } from "../departments.constant"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { addDph, updateDph } from "@/action/MasterAction"
import { mutate } from "swr"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import SubmitButton from "@/components/ui/SubmitButton"
import { Textarea } from "@/components/ui/textarea"

const FormDepts = ({ open, onOpenChange, data }: propsModalInsertDepts) => {
    const form = useForm<z.infer<typeof departmentSchema>>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            name: data ? data.name : "",
            description: data ? data.description ?? "" : ""
        }
    })

    const handleSubmit = async (values: z.infer<typeof departmentSchema>) => {
        let res;

        if (data) {
            const id = data.id;

            res = await updateDph(id, values);
        } else {
            res = await addDph(values);
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
        mutate("/api/departments");

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
                                <Input placeholder="Masukkan Nama DPH..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Deskripsi</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Masukkan Deskripsi DPH..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <SubmitButton form={form} isUpdate={data ? true : false} />
                </div>
            </form>
        </Form>
    )
}

export default FormDepts