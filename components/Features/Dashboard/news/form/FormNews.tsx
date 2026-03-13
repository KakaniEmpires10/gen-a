"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    Image as ImageIcon,
    UploadIcon,
    XIcon,
    AlertCircleIcon,
    CalendarIcon
} from "lucide-react"
import { cn, generateSlug } from "@/lib/utils"
import Image from "next/image"
import { newsFormSchema, Partner, Subunit, Tag, User } from "../news.constant"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import FormInternal from "./FormInternal"
import FormExternal from "./FormExternal"
import { useFileUpload } from "@/hooks/use-file-upload"
import { TagInput, Tag as TagInputType } from "emblor"
import SubmitButton from "@/components/ui/SubmitButton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import YearCalender from "@/components/ui/year-calendar"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { FormHeader } from "@/components/Layouts/Dashboard/FormHeader"
import { Session } from "next-auth"
import { Checkbox } from "@/components/ui/checkbox"
import { uploadToCloudinaryClient } from "@/lib/cloudinary/image-uploader-client"
import { addNews, updateNews } from "@/action/NewsAction"
import { mutate } from "swr"

interface FormNewsProps {
    newsId?: string
    initialData?: Partial<z.infer<typeof newsFormSchema>>
    tags: Tag[]
    partners: Partner[]
    subunits: Subunit[]
    authors: User[]
    session: Session | null
}

export default function FormNews({ newsId, initialData, tags: tagsData, partners: partnersData, subunits, authors, session }: FormNewsProps) {
    const router = useRouter()

    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
    const [slugChecking, setSlugChecking] = useState(false)
    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)

    const [tags, setTags] = useState<TagInputType[]>([]);
    const [activeTagsIndex, setActiveTagsIndex] = useState<number | null>(null);
    const [partners, setPartners] = useState<TagInputType[]>([]);
    const [activePartnersIndex, setActivePartnersIndex] = useState<number | null>(null);

    const maxSizeMB = 4
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
        maxSize
    });

    const previewUrl = files[0]?.preview || null;

    // Check if user is admin/superadmin
    const isAdminOrSuperadmin =
        session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN"

    const form = useForm<z.infer<typeof newsFormSchema>>({
        resolver: zodResolver(newsFormSchema),
        defaultValues: initialData || {
            type: "INTERNAL",
            status: "DRAFT",
            tagIds: [],
            partnerIds: [],
            title: "",
            content: "",
            excerpt: "",
            externalUrl: "",
            sourceName: "",
            authorId: session?.user?.id,
            subunitId: "",
            featuredImage: "",
            publishedAt: new Date(),
        },
    })

    const watchType = form.watch("type")
    const watchTitle = form.watch("title")
    const watchSlug = form.watch("slug")

    const tagsAutoComplete = tagsData ? tagsData.map(item => ({ id: item.id, text: item.name })) : [];
    const partnerAutoComplete = partnersData ? partnersData.map(item => ({ id: item.id, text: item.abbreviation })) : [];

    // AUTO GENERATE SLUG
    useEffect(() => {
        if (newsId) return

        if (!isSlugManuallyEdited) {
            const slug = generateSlug(watchTitle || "")
            form.setValue("slug", slug)
            setSlugAvailable(null)
        }
    }, [watchTitle, isSlugManuallyEdited, form, newsId])

    // VALIDATE SLUG (DEBOUNCED)
    useEffect(() => {
        if (!watchSlug || newsId) return

        const controller = new AbortController()
        setSlugChecking(true)

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `/api/news/validate-slug?slug=${watchSlug}&newsId=${newsId ?? ""}`,
                    { signal: controller.signal }
                )
                const data = await res.json()
                setSlugAvailable(data.available)
            } catch {
                setSlugAvailable(null)
            } finally {
                setSlugChecking(false)
            }
        }, 500)

        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [watchSlug, newsId])

    const onSubmit = async (values: z.infer<typeof newsFormSchema>) => {
        if (!isAdminOrSuperadmin) {
            values.authorId = session?.user?.id
        }

        if (!slugAvailable && !newsId) {
            toast.error("Slug sudah digunakan, silakan ubah judul")
            return
        }

        if (!files.length) {
            toast.error("Gambar thumbnail wajib diunggah")
            return
        }

        const toastId = toast.loading(newsId ?  "Meng-update..." : "Menyimpan...");

        const uploadResult = await uploadToCloudinaryClient(files, toastId, "berita", true);

        if (!uploadResult.success) {
            toast.error("Gagal mengupload foto thumbnail", { id: toastId });
            return;
        }

        if (uploadResult.url) {
            values = { ...values, featuredImage: uploadResult.url };
        }

        toast.loading(newsId ? "Mengupdate berita..." : "Menyimpan berita...")

        const res = newsId ? await updateNews(newsId, values) : await addNews(values);

        if (!res || res.success == false) {
            toast.error(res.message || "Terjadi kesalahan, hubungi admin 🙏", { id: toastId });
            return;
        }

        toast.success(res.message, { id: toastId });

        mutate("/api/news");

        form.reset();
        router.push("/dashboard/news");
    }

    return (
        <div className="space-y-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <Label className="block mt-4">Tipe Berita</Label>
                            <div className="bg-input/50 inline-flex h-9 rounded-md p-1 w-full sm:w-auto overflow-x-auto">
                                <RadioGroup
                                    value={watchType}
                                    onValueChange={(value) => {
                                        form.setValue("type", value as "INTERNAL" | "EXTERNAL");
                                    }}
                                    className="group after:bg-background has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 relative inline-grid grid-cols-2 items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-sm after:shadow-xs after:transition-[transform,box-shadow] after:duration-500 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-focus-visible:after:ring-[3px] data-[state=external]:after:translate-x-0 data-[state=internal]:after:translate-x-full min-w-full sm:min-w-0"
                                    data-state={watchType.toLowerCase()}
                                >
                                    <label className="group-data-[state=internal]:text-muted-foreground/70 relative z-10 inline-flex h-full min-w-[80px] cursor-pointer items-center justify-center px-3 sm:px-6 whitespace-nowrap transition-colors duration-300 select-none text-xs sm:text-sm">
                                        External
                                        <RadioGroupItem id="external" value="EXTERNAL" className="sr-only" />
                                    </label>
                                    <label className="group-data-[state=external]:text-muted-foreground/70 relative z-10 inline-flex h-full min-w-[80px] cursor-pointer items-center justify-center px-3 sm:px-6 whitespace-nowrap transition-colors duration-300 select-none text-xs sm:text-sm">
                                        Internal
                                        <RadioGroupItem id="internal" value="INTERNAL" className="sr-only" />
                                    </label>
                                </RadioGroup>
                            </div>
                        </div>
                        <div>
                            <h6 className="font-bold text-muted-foreground text-sm">Note: </h6>
                            {watchType === "INTERNAL" ? (
                                <p className="text-xs text-muted-foreground">
                                    Berita yang akan ditulis sendiri dan ditayangkan di web ini kepada khalayak publik.
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    Berita akan mengarah ke URL eksternal (ex. Detik, Berita Aceh, dll). Pastikan untuk mengisi link dan deskripsi singkatnya.
                                </p>
                            )}
                            <Separator className="mt-2" />
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-6 grid grid-cols-12 gap-4">
                            <FormHeader title="Identitas Berita" isColumn />
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="col-span-12">
                                        <FormLabel>Judul Berita</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan judul berita..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* SLUG INPUT */}
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-4">
                                        <FormLabel>URL Artikel</FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center gap-1">

                                                <Input
                                                    {...field}
                                                    onChange={(e) => {
                                                        setIsSlugManuallyEdited(true)
                                                        field.onChange(generateSlug(e.target.value))
                                                    }}
                                                    className={cn(
                                                        slugAvailable === false && "border-destructive",
                                                        slugAvailable === true && "border-success"
                                                    )}
                                                    placeholder="judul-artikel-anda"
                                                />

                                                {/* AUTO RESET */}
                                                {isSlugManuallyEdited && (
                                                    <Button
                                                        type="button"
                                                        size="xs"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setIsSlugManuallyEdited(false)
                                                            form.setValue("slug", generateSlug(watchTitle || ""))
                                                        }}
                                                    >
                                                        Auto
                                                    </Button>
                                                )}

                                                {/* STATUS ICON */}
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                    {slugChecking && <Loader2 className="h-4 w-4 animate-spin" />}
                                                    {!slugChecking && slugAvailable === true && (
                                                        <CheckCircle2 className="h-4 w-4 text-success" />
                                                    )}
                                                    {!slugChecking && slugAvailable === false && (
                                                        <AlertCircle className="h-4 w-4 text-destructive" />
                                                    )}
                                                </div>
                                            </div>
                                        </FormControl>

                                        <FormDescription>
                                            {slugAvailable === false && (
                                                <span className="text-destructive">Slug sudah digunakan</span>
                                            )}
                                            {slugAvailable === true && (
                                                <span className="text-success">Slug tersedia</span>
                                            )}
                                            {slugAvailable === null && (
                                                <span>Akan dibuat otomatis dari judul</span>
                                            )}
                                        </FormDescription>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* URL PREVIEW (RIGHT) */}
                            <div className="col-span-12 lg:col-span-8">
                                <Label className="mb-2 block">Preview URL</Label>

                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 rounded-lg border bg-muted/40 px-4 py-1.5">

                                    {/* Browser dots */}
                                    <div className="flex items-center gap-2 mt-1 md:mt-0">
                                        <span className="size-3 rounded-full bg-red-400" />
                                        <span className="size-3 rounded-full bg-yellow-400" />
                                        <span className="size-3 rounded-full bg-green-400" />
                                    </div>

                                    {/* URL */}
                                    <div className="text-sm font-mono break-all">
                                        <span className="text-muted-foreground">
                                            {process.env.NEXT_PUBLIC_BASE_URL}/news/
                                        </span>
                                        <span className="font-semibold">
                                            {watchSlug || "judul-artikel-anda"}
                                        </span>
                                    </div>

                                </div>
                            </div>

                            <div className="flex flex-col gap-2 col-span-12">
                                <Label htmlFor="feature-img">Thumbnail</Label>
                                <p className="text-xs text-muted-foreground">Upload Cover Image untuk berita yang akan di publish</p>
                                <div className="relative">
                                    {/* Drop area */}
                                    <div
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        data-dragging={isDragging || undefined}
                                        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-72 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]"
                                    >
                                        <input
                                            {...getInputProps()}
                                            className="sr-only"
                                            aria-label="Upload image file"
                                            id="feature-img"
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
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 grid grid-cols-12 gap-4">
                            <FormHeader title="Konten Utama" isColumn />
                            {watchType === "INTERNAL" ? (
                                <FormInternal form={form} />
                            ) : (
                                <FormExternal form={form} />
                            )
                            }
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 grid grid-cols-12 gap-4">
                            <FormHeader title="Pengaturan Berita" isColumn />
                            <FormField
                                control={form.control}
                                name="tagIds"
                                render={({ field }) => (
                                    <FormItem className='col-span-12 lg:col-span-6'>
                                        <FormLabel>Tag Berita</FormLabel>
                                        <FormControl>
                                            <TagInput
                                                {...field}
                                                tags={tags}
                                                setTags={(newTags) => {
                                                    setTags(newTags)
                                                    form.setValue('tagIds', newTags as [TagInputType, ...TagInputType[]]);
                                                }}
                                                placeholder="Masukkan tag berita..."
                                                styleClasses={{
                                                    inlineTagsContainer:
                                                        "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1",
                                                    input: "w-full min-w-[80px] shadow-none px-2 h-7",
                                                    tag: {
                                                        body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                                                        closeButton:
                                                            "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                                                    },
                                                }}
                                                activeTagIndex={activeTagsIndex}
                                                setActiveTagIndex={setActiveTagsIndex}
                                                enableAutocomplete={true}
                                                restrictTagsToAutocompleteOptions={true}
                                                autocompleteOptions={tagsAutoComplete}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">(** Tekan <strong>Enter</strong> atau <strong>,</strong>)</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {partnersData && partnersData.length > 0 && (
                                <FormField
                                    control={form.control}
                                    name="partnerIds"
                                    render={({ field }) => (
                                        <FormItem className='col-span-12 lg:col-span-6'>
                                            <FormLabel>Partner</FormLabel>
                                            <FormControl>
                                                <TagInput
                                                    {...field}
                                                    tags={partners}
                                                    setTags={(newTags) => {
                                                        setPartners(newTags)
                                                        form.setValue('partnerIds', newTags as [TagInputType, ...TagInputType[]]);
                                                    }}
                                                    placeholder="Masukkan tag berita..."
                                                    styleClasses={{
                                                        inlineTagsContainer:
                                                            "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1",
                                                        input: "w-full min-w-[80px] shadow-none px-2 h-7",
                                                        tag: {
                                                            body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                                                            closeButton:
                                                                "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                                                        },
                                                    }}
                                                    activeTagIndex={activePartnersIndex}
                                                    setActiveTagIndex={setActivePartnersIndex}
                                                    enableAutocomplete={true}
                                                    restrictTagsToAutocompleteOptions={true}
                                                    autocompleteOptions={partnerAutoComplete}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">Jika Berita ini berkolaborasi dengan instansi eksternal</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {isAdminOrSuperadmin && authors && (
                                <FormField
                                    control={form.control}
                                    name="authorId"
                                    render={({ field }) => (
                                        <FormItem className="col-span-12 lg:col-span-4">
                                            <FormLabel>Penulis</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih penulis" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {authors.map((author) => (
                                                        <SelectItem key={author.id} value={author.id}>
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage src={author.image || undefined} />
                                                                    <AvatarFallback className="text-[10px] tracking-wider font-semibold bg-indigo-100 text-indigo-800">
                                                                        {author.name.substring(0, 2).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                {author.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Sebagai admin, Anda bisa memilih penulis lain
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {subunits && subunits.length > 0 && (
                                <FormField
                                    control={form.control}
                                    name="subunitId"
                                    render={({ field }) => (
                                        <FormItem className="col-span-12 lg:col-span-4">
                                            <FormLabel>Subunit</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                                <FormControl>
                                                    <SelectTrigger className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
                                                        <SelectValue placeholder="Pilih subunit" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
                                                    <SelectGroup>
                                                        <SelectLabel className="ps-2">Pilih Subunit...</SelectLabel>
                                                        {Array.isArray(subunits) && subunits.map((item: Subunit) => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                <Image
                                                                    className="size-5 rounded"
                                                                    src={item.logo || "/Logo_GEN-A_mini.png"}
                                                                    alt={`logo ${item.name}`}
                                                                    width={20}
                                                                    height={20}
                                                                />
                                                                <span className="truncate text-xs sm:text-sm">{item.name} (<strong>{item.abbreviation}</strong>)</span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Subunit Terkait jika ada
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="publishedAt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-4 self-start">
                                        <FormLabel>Tanggal Publish</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full h-10 text-left font-normal transition-all",
                                                            "hover:bg-accent hover:text-accent-foreground",
                                                            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            <span className="truncate">{format(field.value, "PPP", { locale: id })}</span>
                                                        ) : (
                                                            <span>Pilih Tanggal</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50 shrink-0" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <YearCalender
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    today={new Date()}
                                                    startDate={new Date(1950, 0, 1)}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="flex items-start space-x-1 rounded-md border p-4 bg-card">
                                <FormControl>
                                    <Checkbox
                                        className="mt-0.5"
                                        checked={field.value === "PUBLISHED"}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked ? "PUBLISHED" : "DRAFT")
                                        }}
                                    />
                                </FormControl>

                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Publish Sekarang
                                    </FormLabel>

                                    <FormDescription>
                                        Jika dicentang, artikel akan langsung tampil ke publik.
                                        Jika tidak, artikel disimpan sebagai draft.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* SUBMIT BUTTON */}
                    <div className="flex justify-end">
                        <SubmitButton form={form} />
                    </div>
                </form>
            </Form>
        </div>
    )
}