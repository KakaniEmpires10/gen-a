import { useForm } from "react-hook-form"
import { propsModalInsertSubDepts, subDepartmentSchema } from "../departments.constant"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import useSWR, { mutate } from "swr"
import { addDepartment, updateDepartment } from "@/action/MasterAction"
import SubmitButton from "@/components/ui/SubmitButton"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Department } from "@prisma/client"

const FormSubDepts = ({ open, onOpenChange, data }: propsModalInsertSubDepts) => {
    const form = useForm<z.infer<typeof subDepartmentSchema>>({
        resolver: zodResolver(subDepartmentSchema),
        defaultValues: {
            name: data ? data.name : "",
            description: data ? data.description ?? "" : "",
            departmentId: data ? data.departmentId : "",
        }
    })

    const { data: dph, isLoading, error } = useSWR<Pick<Department, "id" | "name">[]>('/api/departments');

    const handleSubmit = async (values: z.infer<typeof subDepartmentSchema>) => {
        let res;

        if (data) {
            const id = data.id;

            res = await updateDepartment(id, values);
        } else {
            res = await addDepartment(values);
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
        mutate("/api/sub-departments");

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
                                <Input placeholder="Masukkan Nama Departemen..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Departemen Terkait <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Dph" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        {isLoading && (
                                            <SelectLabel empty>
                                                Memuat data dph...
                                            </SelectLabel>
                                        )}
                                        {error && (
                                            <SelectLabel empty>
                                                Gagal memuat data dph
                                            </SelectLabel>
                                        )}
                                        {!isLoading && !error && dph && Array.isArray(dph) && dph.length === 0 && (
                                            <SelectLabel empty>
                                                Tidak ada departemen
                                            </SelectLabel>
                                        )}
                                        {!isLoading && !error && dph && Array.isArray(dph) && (
                                            <>
                                                {dph.length > 0 && (
                                                    <SelectLabel>Pilih DPH</SelectLabel>
                                                )}
                                                {dph.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </>
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormDescription>Departemen ini berada dibawah dph yang mana?</FormDescription>
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
                                <Textarea placeholder="Masukkan Deskripsi Departemen..." {...field} />
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

export default FormSubDepts