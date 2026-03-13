import { useForm } from "react-hook-form"
import { propsModalInsert, partnersSchema } from "../partners.constant"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { mutate } from "swr"
import { addPartners, updatePartners } from "@/action/MasterAction"
import SubmitButton from "@/components/ui/SubmitButton"
import { useFileUpload } from "@/hooks/use-file-upload"
import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react"
import { uploadToCloudinaryClient } from "@/lib/cloudinary/image-uploader-client"
import { createInitialFile } from "@/lib/utils"

const FormPartners = ({ open, onOpenChange, data }: propsModalInsert) => {
    const maxSizeMB = 3
    const maxSize = maxSizeMB * 1024 * 1024 // 3MB default

    const [
        { files, isDragging, errors },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            getInputProps,
        },
    ] = useFileUpload({
        accept: "image/png,image/jpeg,image/jpg,image/webp",
        maxSize,
        initialFiles: createInitialFile(data?.image, "logo-partner")
    })

    const previewUrl = files[0]?.preview || null

    const form = useForm<z.infer<typeof partnersSchema>>({
        resolver: zodResolver(partnersSchema),
        defaultValues: {
            name: data ? data.name : "",
            abbr: data ? data.abbreviation : "",
            website: data ? data.website ?? "" : ""
        }
    })

    const handleSubmit = async (values: z.infer<typeof partnersSchema>) => {
        const toastId = toast.loading( data ? "Meng-Update..." : "Menyimpan...");

        const uploadResult = await uploadToCloudinaryClient(files, toastId, "logos", true, data?.image);

        if (!uploadResult.success) {
            toast.error(uploadResult.message as string || "Gagal mengupload logo", { id: toastId });
            return;
        }   

        const payload = {
            ...values,
            ...(uploadResult.url && { img: uploadResult.url })
        };

        toast.loading(data ? "Meng-Update Mitra..." : "Menyimpan Mitra...", { id: toastId });
        const res = data ? await updatePartners(data.id, payload) : await addPartners(payload);

        if (!res || res.success == false) {
            toast.error(res.message || "Terjadi kesalahan, hubungi admin 🙏", { id: toastId }); 
            return;
        }

        toast.success(res.message, { id: toastId });

        form.reset();
        mutate("/api/partners");

        onOpenChange(!open);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="flex flex-col gap-2">
                    <div className="relative">
                        {/* Drop area */}
                        <div
                            role="button"
                            onClick={openFileDialog}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            data-dragging={isDragging || undefined}
                            className="border-primary hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
                        >
                            <input
                                {...getInputProps()}
                                className="sr-only"
                                aria-label="Upload file"
                            />
                            {previewUrl ? (
                                <div className="absolute inset-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={previewUrl}
                                        alt={files[0]?.file?.name || "Uploaded image"}
                                        className="size-full object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                                    <div
                                        className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                                        aria-hidden="true"
                                    >
                                        <ImageUpIcon className="size-4 opacity-60" />
                                    </div>
                                    <p className="mb-1.5 text-sm font-medium">
                                        Tarik Logo Mitra Kemari
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Max size: {maxSizeMB}MB
                                    </p>
                                </div>
                            )}
                        </div>
                        {previewUrl && (
                            <div className="absolute top-4 right-4">
                                <button
                                    type="button"
                                    className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                                    onClick={() => removeFile(files[0]?.id)}
                                    aria-label="Remove image"
                                >
                                    <XIcon className="size-4" aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </div>

                    {errors.length > 0 && (
                        <div
                            className="text-destructive flex items-center gap-1 text-xs"
                            role="alert"
                        >
                            <AlertCircleIcon className="size-3 shrink-0" />
                            <span>{errors[0]}</span>
                        </div>
                    )}
                </div>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan Nama Mitra..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="abbr"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Singkatan <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan Singkatan Mitra..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <Input type="url" placeholder="Masukkan Website Mitra..." {...field} />
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

export default FormPartners