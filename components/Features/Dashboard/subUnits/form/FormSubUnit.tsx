"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { SubunitColor, SubunitColors, subUnitSchema } from "../subUnit.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, createInitialFile } from "@/lib/utils";
import TiptapEditor from "@/components/TiptapEditor/TiptapEditor";
import SubmitButton from "@/components/ui/SubmitButton";
import { addSubUnit, updateSubUnit } from "@/action/SubUnitAction";
import { uploadToCloudinaryClient } from "@/lib/cloudinary/image-uploader-client";
import { useRouter } from "next/navigation";
import { SubUnit } from "@prisma/client";

const FormSubUnit = ({ data }: { data?: SubUnit }) => {
    const router = useRouter();

    const maxSizeMB = 3
    const maxSize = maxSizeMB * 1024 * 1024

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
        accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/webp",
        maxSize,
        initialFiles: createInitialFile(data?.logo, "subunit-logo")
    });

    const previewUrl = files[0]?.preview || null;

    const form = useForm<z.infer<typeof subUnitSchema>>({
        resolver: zodResolver(subUnitSchema),
        defaultValues: {
            name: data?.name || "",
            description: data?.description || "",
            logo: data?.logo || "",
            abbreviation: data?.abbreviation || "",
            color: data?.primaryColor || "blue",
        },
    })

    async function onSubmit(values: z.infer<typeof subUnitSchema>) {
        const toastId = toast.loading(data ? "Meng-Update..." : "Menyimpan...");

        const uploadResult = await uploadToCloudinaryClient(files, toastId, "logos", true, data?.logo);

        if (!uploadResult.success) {
            toast.error(uploadResult.message as string || "Gagal mengupload logo", { id: toastId });
            return;
        }

        const finalValues = { ...values, logo: uploadResult.url || data?.logo };

        toast.loading(data ? "Meng-Update Sub-unit..." : "Menyimpan Sub-unit...", { id: toastId });
        
        const res = data ? await updateSubUnit(data.id, finalValues) : await addSubUnit(finalValues);

        if (!res || res.success == false) {
            toast.error(res.message || "Terjadi kesalahan, hubungi admin 🙏", { id: toastId });
            return;
        }

        toast.success(res.message, { id: toastId });

        mutate("/api/sub-units");
        toast.success(res.message, { id: toastId });

        form.reset();
        router.push("/dashboard/sub-units");
    }

    return (
        <Card>
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-center">Logo Sub Unit</h2>
                            <Separator className="mt-2 mb-4 w-44 h-0.5 rounded-full bg-primary mx-auto" />
                            <p className="text-xs text-center font-semibold text-muted-foreground mb-2">Upload Logo Sub-Unit untuk ditampilkan di aplikasi</p>
                            <div className="flex flex-col gap-2">
                                <div className="relative">
                                    {/* Drop area */}
                                    <div
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        data-dragging={isDragging || undefined}
                                        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-60 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]"
                                    >
                                        <input
                                            {...getInputProps()}
                                            className="sr-only"
                                            aria-label="Upload image file"
                                        />
                                        {previewUrl ? (
                                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                                <Image
                                                    src={previewUrl}
                                                    alt={files[0]?.file?.name || "Uploaded image"}
                                                    fill
                                                    className="mx-auto max-h-full rounded object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                                                <div
                                                    className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                                                    aria-hidden="true"
                                                >
                                                    <ImageIcon className="size-4 opacity-60" />
                                                </div>
                                                <p className="mb-1.5 text-sm font-medium">Letakkan Gambar Disini</p>
                                                <p className="text-muted-foreground text-xs">
                                                    SVG, PNG, or JPG (max. {maxSizeMB}MB)
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    type="button"
                                                    className="mt-4"
                                                    onClick={openFileDialog}
                                                >
                                                    <UploadIcon
                                                        className="-ms-1 size-4 opacity-60"
                                                        aria-hidden="true"
                                                    />
                                                    Pilih Gambar
                                                </Button>
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
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Sub-Unit</FormLabel>
                                        <FormDescription>
                                            Nama lengkap dari sub-unit ini
                                        </FormDescription>
                                        <FormControl>
                                            <Input placeholder="Public Health..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="abbreviation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Sub-Unit</FormLabel>
                                        <FormDescription>
                                            Singkatan dari sub-unit ini
                                        </FormDescription>
                                        <FormControl>
                                            <Input placeholder="PHI..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Warna Utama</FormLabel>
                                        <FormDescription>
                                            Pilih warna utama untuk sub-unit ini
                                        </FormDescription>
                                        <Select
                                            onValueChange={color => field.onChange(color)}
                                        >
                                            <FormControl>
                                                <SelectTrigger className={cn("text-white data-[placeholder]:text-white",SubunitColors[field.value as SubunitColor],
                                                    { "text-black": field.value === "white" })}>
                                                    <SelectValue placeholder={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Pilih Warna...</SelectLabel>
                                                    {Object.keys(SubunitColors).map(warna => (
                                                        <SelectItem key={warna} value={warna} className={cn("text-white my-1 focus:ring-2 focus:ring-black focus:dark:ring-white cursor-pointer focus-within:font-semibold focus:ring-inset focus:px-8 transition-all duration-300", SubunitColors[warna as SubunitColor],
                                                            {
                                                                "text-white": warna === "black",
                                                                "text-black": warna === "white"
                                                            })}>
                                                            {warna}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tentang Sub-unit</FormLabel>
                                    <FormDescription>
                                        Deskripsi singkat tentang sub-unit ini, bisa berisi visi, misi, atau informasi penting lainnya.
                                    </FormDescription>
                                    <FormControl>
                                        <TiptapEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Tuliskan Deskripsi Disini"
                                            error={!!form.formState.errors.description}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <SubmitButton form={form} isUpdate={!!data}/>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default FormSubUnit