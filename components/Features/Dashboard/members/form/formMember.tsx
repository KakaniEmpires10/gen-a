"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn, createInitialFile } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Calendar as CalendarIcon,
    CircleAlert,
    CircleUserRoundIcon,
    Facebook,
    Instagram,
    Linkedin,
    Loader2,
    RefreshCcw,
    Settings,
    TriangleAlert,
    XIcon
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import SubmitButton from "@/components/ui/SubmitButton"
import YearCalender from "@/components/ui/year-calendar"
import TiptapEditor from "@/components/TiptapEditor/TiptapEditor"
import { memberSchema } from "../member.constant"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useFileUpload } from "@/hooks/use-file-upload"
import { id } from "date-fns/locale"
import { useState } from "react"
import { Tag, TagInput } from 'emblor';
import useSWR, { mutate } from "swr"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { addMember, updateMember } from "@/action/MemberAction"
import toast from "react-hot-toast"
import { SocialItem, Socials } from "@/types/socialType"
import { Member, SubDepartment, SubUnit } from "@prisma/client"
import { uploadToCloudinaryClient } from "@/lib/cloudinary/image-uploader-client"

type MemberType = {
    id: string;
    name: string;
    abbreviation?: string;
    logo?: string;
}

type MemberDataType = Member & {
    subunit: Pick<SubUnit, "name"> | null,
    sub_department: Pick<SubDepartment, "name"> | null
}

export default function FormMember({ data }: { data?: MemberDataType }) {
    const router = useRouter()

    const interestData = data?.fieldOfInterest
        ? data.fieldOfInterest.split(",").map((item, i) => ({ id: String(i + 1), text: item }))
        : [];
    const skillsData = data?.skills
        ? data.skills.split(",").map((item, i) => ({ id: String(i + 1), text: item }))
        : [];

    const [openMembers, setOpenMembers] = useState(false)

    const [interest, setInterest] = useState<Tag[]>(interestData);
    const [activeInterestIndex, setActiveInterestIndex] = useState<number | null>(null);

    const [skill, setSkill] = useState<Tag[]>(skillsData);
    const [activeSkillIndex, setActiveSkillIndex] = useState<number | null>(null);

    const [selectedMemberType, setSelectedMemberType] = useState("subunit")

    const socials = data?.socials as Socials | [];

    const instagram: SocialItem = socials?.find((item) => item.name === "instagram") || { name: "instagram", account: "", link: "" };
    const facebook: SocialItem = socials?.find((item) => item.name === "facebook") || { name: "facebook", account: "", link: "" };
    const linkedIn: SocialItem = socials?.find((item) => item.name === "linkedIn") || { name: "linkedIn", account: "", link: "" };

    const form = useForm<z.infer<typeof memberSchema>>({
        resolver: zodResolver(memberSchema),
        defaultValues: {
            birthdate: data ? data.birthdate : new Date(2000, 0, 1),
            gender: data ? (data.gender as "MALE" | "FEMALE" | undefined) : "MALE",
            bio: data ? data.bio : "",
            education_level: data ? data.educationLevel : "SMA",
            education_title: data ? (data.educationTitle ?? "") : "",
            fieldOfInterest: data ? interestData : [],
            email: data ? data.email : "",
            name: data ? data.name : "",
            no_tel: data ? data.phoneNumber : "",
            skills: data ? skillsData : [],
            address: data ? data.address : "",
            domicile: data ? data.domicile : "",
            facebookName: facebook ? facebook.account : "",
            facebookUrl: facebook ? facebook.link : "",
            instagramName: instagram ? instagram.account : "",
            instagramUrl: instagram ? instagram.link : "",
            linkedInName: linkedIn ? linkedIn.account : "",
            linkedInUrl: linkedIn ? linkedIn.link : "",
            subUnitId: data && data.subUnitId ? data.subUnitId : "",
            departmentId: data && data.subDepartmentId ? data.subDepartmentId : "",
        },
    })

    const title = form.watch("education_level")

    const { data: memberTypeData, isLoading, error, mutate: refresh, isValidating } = useSWR<MemberType[] | []>(`/api/member-type/${selectedMemberType}`)

    const maxSizeMB = 4
    const maxSize = maxSizeMB * 1024 * 1024

    const [
        { files, isDragging },
        {
            removeFile,
            openFileDialog,
            getInputProps,
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
        },
    ] = useFileUpload({
        accept: "image/*",
        maxSize,
        initialFiles: createInitialFile(data?.image, "profile-member")
    })

    const previewUrl = files[0]?.preview || null

    async function onSubmit(values: z.infer<typeof memberSchema>) {
        const toastId = toast.loading(data ? "Meng-Update" : "Menyimpan...");

        const uploadResult = await uploadToCloudinaryClient(files, toastId, "profile", true, data?.image);

        if (!uploadResult.success) {
            toast.error("Gagal mengupload foto profil", { id: toastId });
            return;
        }

        const payload = {
            ...values,
            ...(uploadResult.url && { image: uploadResult.url })
        }

        toast.loading(data ? "Meng-Update Anggota..." : "Menyimpan Anggota...", { id: toastId });
        const res = data ? await updateMember(data.id, payload) : await addMember(payload);

        if (!res || !res.success) {
            toast.error(res?.message || "Terjadi kesalahan, hubungi admin 🙏", { id: toastId });
            return;
        }

        mutate("/api/members");
        toast.success(res.message, { id: toastId });
        form.reset();
        router.push("/dashboard/members");
    }

    return (
        <Card>
            <CardContent className="p-4 sm:p-6 pt-8 sm:pt-12 relative">
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                        <div className="relative w-fit">
                            <button
                                type="button"
                                className="border-primary hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-20 sm:size-24 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
                                onClick={openFileDialog}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                data-dragging={isDragging || undefined}
                                aria-label={previewUrl ? "Change image" : "Upload image"}
                            >
                                {previewUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        className="size-full object-cover"
                                        src={previewUrl}
                                        alt={files[0]?.file?.name || "Uploaded image"}
                                        width={96}
                                        height={96}
                                        style={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <div aria-hidden="true">
                                        <CircleUserRoundIcon className="size-6 sm:size-7 opacity-50" />
                                    </div>
                                )}
                            </button>
                            {previewUrl && (
                                <Button
                                    type="button"
                                    onClick={() => removeFile(files[0]?.id)}
                                    size="icon"
                                    className="border-background focus-visible:border-background absolute -top-1 -right-1 sm:top-0 sm:right-2 size-6 rounded-full border-2 shadow-none"
                                    aria-label="Remove image"
                                >
                                    <XIcon className="size-3.5" />
                                </Button>
                            )}
                            <input
                                {...getInputProps()}
                                id="profile-img"
                                className="sr-only"
                                aria-label="Upload image file"
                                tabIndex={-1}
                            />
                            <Label htmlFor="profile-img" className="text-sm sm:text-base">Upload Profile</Label>
                        </div>
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormMessage />
                                    <FormControl>
                                        <RadioGroup className="flex flex-wrap gap-2" defaultValue={field.value} onValueChange={field.onChange}>
                                            <div className="border-input relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none">
                                                <div className="flex items-center gap-2">
                                                    <RadioGroupItem
                                                        id="pria"
                                                        value="MALE"
                                                        className="after:absolute after:inset-0"
                                                    />
                                                    <Label htmlFor="pria">Pria</Label>
                                                </div>
                                            </div>
                                            <div className="border-input relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none">
                                                <div className="flex items-center gap-2">
                                                    <RadioGroupItem
                                                        id="wanita"
                                                        value="FEMALE"
                                                        className="after:absolute after:inset-0"
                                                    />
                                                    <Label htmlFor="wanita">Wanita</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-x-4 sm:gap-y-6 lg:gap-y-8 items-start">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="sm:col-span-2 lg:col-span-4">
                                        <FormLabel>Nama</FormLabel>
                                        <FormControl>
                                            <Input placeholder="namamu...." type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="sm:col-span-2 lg:col-span-4">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="example@gmail.com..." type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="no_tel"
                                render={({ field }) => (
                                    <FormItem className="sm:col-span-2 lg:col-span-4">
                                        <FormLabel>No. HP</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0823..." type="tel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="birthdate"
                                render={({ field }) => (
                                    <FormItem className="sm:col-span-2 lg:col-span-3">
                                        <FormLabel>Tanggal Lahir</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal transition-all",
                                                            "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
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
                                                    endDate={new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="education_level"
                                render={({ field }) => (
                                    <FormItem className="sm:col-span-1 lg:col-span-2">
                                        <FormLabel>Pendidikan</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Pendidikan Terakhir</SelectLabel>
                                                    <SelectItem value="SMP">SMP</SelectItem>
                                                    <SelectItem value="SMA">SMA</SelectItem>
                                                    <SelectItem value="D3">D3</SelectItem>
                                                    <SelectItem value="D4">D4</SelectItem>
                                                    <SelectItem value="S1">S1</SelectItem>
                                                    <SelectItem value="S2">S2</SelectItem>
                                                    <SelectItem value="S3">S3</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {title && (["S1", "S2", "S3"].includes(title)) ? (
                                <FormField
                                    control={form.control}
                                    name="education_title"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-1 lg:col-span-2">
                                            <FormLabel>Gelar</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Skep, S.Pd..." type="text" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : null}

                            <FormField
                                control={form.control}
                                name="fieldOfInterest"
                                render={({ field }) => (
                                    <FormItem className={cn(
                                        "sm:col-span-2",
                                        title && (["S1", "S2", "S3"].includes(title)) ? "lg:col-span-5" : "lg:col-span-7"
                                    )}>
                                        <FormLabel>Bidang Minat</FormLabel>
                                        <FormControl>
                                            <TagInput
                                                {...field}
                                                tags={interest}
                                                setTags={(newInterest) => {
                                                    setInterest(newInterest)
                                                    form.setValue('fieldOfInterest', newInterest as [Tag, ...Tag[]]);
                                                }}
                                                placeholder="Masukkan bidang minat..."
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
                                                activeTagIndex={activeInterestIndex}
                                                setActiveTagIndex={setActiveInterestIndex}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">Bidang yang diminati baik sejalan dengan pendidikan formal ataupun tidak <br /> (**Tekan <strong>Enter</strong> atau <strong>,</strong>)</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="skills"
                                render={({ field }) => (
                                    <FormItem className="sm:col-span-2 lg:col-span-12">
                                        <FormLabel>Skill</FormLabel>
                                        <FormDescription className="text-xs">Keahlian anda (**Tekan <strong>Enter</strong> atau <strong>,</strong>)</FormDescription>
                                        <FormControl>
                                            <TagInput
                                                {...field}
                                                tags={skill}
                                                setTags={(newSkill) => {
                                                    setSkill(newSkill)
                                                    form.setValue('skills', newSkill as [Tag, ...Tag[]]);
                                                }}
                                                placeholder="Tambah Skill Anda..."
                                                styleClasses={{
                                                    tagList: {
                                                        container: "gap-1",
                                                    },
                                                    input:
                                                        "rounded-md transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                                    tag: {
                                                        body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                                                        closeButton:
                                                            "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
                                                    },
                                                }}
                                                activeTagIndex={activeSkillIndex}
                                                setActiveTagIndex={setActiveSkillIndex}
                                                inlineTags={false}
                                                inputFieldPosition="top"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {data && (
                            <div className="space-y-2">
                                <Label>Jenis Keanggotaan</Label>
                                <p className="text-xs text-muted-foreground">Harap hanya menekan tombol <strong>Ganti Keanggotaan</strong> saat dibutuhkan karena masih terdapat potensial <strong>bug</strong> pada fitur ini</p>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                                    <Card className="py-2 px-4 w-full sm:w-fit text-sm font-bold capitalize">{data.position.toLocaleLowerCase()} {data.subunit ? data.subunit.name : data.sub_department?.name}</Card>
                                    <Button type="button" onClick={() => setOpenMembers(!openMembers)} variant="soft-secondary" size="sm" className="w-full sm:w-auto">
                                        Ganti Keanggotaan <Settings className="animate-spin ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {(data ? openMembers : true) && (
                            <div className="space-y-3 sm:space-y-4">
                                <div className="space-y-2">
                                    <Label className="block">Jenis Keanggotaan</Label>
                                    <div className="bg-input/50 inline-flex h-9 rounded-md p-1 w-full sm:w-auto overflow-x-auto">
                                        <RadioGroup
                                            value={selectedMemberType}
                                            onValueChange={(value) => {
                                                setSelectedMemberType(value);
                                                if (value === "subunit") {
                                                    form.setValue("departmentId", "");
                                                } else {
                                                    form.setValue("subUnitId", "");
                                                }
                                            }}
                                            className="group after:bg-background has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 relative inline-grid grid-cols-3 items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/3 after:rounded-sm after:shadow-xs after:transition-[transform,box-shadow] after:duration-500 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-focus-visible:after:ring-[3px] data-[state=subunit]:after:translate-x-0 data-[state=external]:after:translate-x-full data-[state=internal]:after:translate-x-[200%] min-w-full sm:min-w-0"
                                            data-state={selectedMemberType}
                                        >
                                            <label className="group-data-[state=external]:text-muted-foreground/70 group-data-[state=internal]:text-muted-foreground/70 relative z-10 inline-flex h-full min-w-[80px] cursor-pointer items-center justify-center px-3 sm:px-6 whitespace-nowrap transition-colors duration-300 select-none text-xs sm:text-sm">
                                                Subunit
                                                <RadioGroupItem id="subunit" value="subunit" className="sr-only" />
                                            </label>
                                            <label className="group-data-[state=subunit]:text-muted-foreground/70 group-data-[state=internal]:text-muted-foreground/70 relative z-10 inline-flex h-full min-w-[80px] cursor-pointer items-center justify-center px-3 sm:px-6 whitespace-nowrap transition-colors duration-300 select-none text-xs sm:text-sm">
                                                External
                                                <RadioGroupItem id="external" value="external" className="sr-only" />
                                            </label>
                                            <label className="group-data-[state=subunit]:text-muted-foreground/70 group-data-[state=external]:text-muted-foreground/70 relative z-10 inline-flex h-full min-w-[80px] cursor-pointer items-center justify-center px-3 sm:px-6 whitespace-nowrap transition-colors duration-300 select-none text-xs sm:text-sm">
                                                Internal
                                                <RadioGroupItem id="internal" value="internal" className="sr-only" />
                                            </label>
                                        </RadioGroup>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <Skeleton className="h-10 w-full" />
                                ) : error ? (
                                    <div role="alert" className="rounded-md flex justify-between items-center border border-destructive px-4 py-3 bg-destructive/10">
                                        <p className="text-xs text-destructive sm:text-sm">
                                            <CircleAlert
                                                className="mr-1 sm:mr-2 -mt-0.5 inline-flex size-5"
                                                aria-hidden="true"
                                            />
                                            {error.message}
                                        </p>
                                            <Button type="button" onClick={() => refresh()} variant="destructive" size="xs" className="inline-flex">
                                                {isValidating ? (
                                                    <>
                                                        <Loader2 className="animate-spin" /> Mencoba...
                                                    </>
                                                ) : (
                                                    <>
                                                        <RefreshCcw /> Coba Lagi
                                                    </>
                                                )}
                                            </Button>
                                    </div>
                                ) : Array.isArray(memberTypeData) && memberTypeData.length === 0 ? (
                                    <div role="alert" className="rounded-md border px-4 py-3">
                                        <p className="text-xs sm:text-sm">
                                            <TriangleAlert
                                                className="me-2 sm:me-3 -mt-0.5 inline-flex text-amber-500"
                                                size={16}
                                                aria-hidden="true"
                                            />
                                            Data jenis keanggotaan tidak ditemukan. Pastikan ada data yang tersedia.
                                        </p>
                                    </div>
                                ) : selectedMemberType === "subunit" ? (
                                    <FormField
                                        control={form.control}
                                        name="subUnitId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
                                                            <SelectValue placeholder="Pilih subunit" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
                                                        <SelectGroup>
                                                            <SelectLabel className="ps-2">Pilih Subunit...</SelectLabel>
                                                            {Array.isArray(memberTypeData) && memberTypeData.map((item: MemberType) => (
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
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="departmentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih departemen" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Departemen...</SelectLabel>
                                                            {Array.isArray(memberTypeData) && memberTypeData.map((item: MemberType) => (
                                                                <SelectItem key={item.id} value={item.id}>
                                                                    <span className="text-xs sm:text-sm">{item.name}</span>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alamat</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jl. Ahmad Yani, Ds...." type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="domicile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Domisili</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jl. Muhammad Jam, Ds...." type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tentang Anda</FormLabel>
                                    <FormDescription className="text-xs">
                                        Jelaskan tentang diri anda, pengalaman, atau apa yang ingin anda capai kedepannya untuk tampil di portfolio
                                    </FormDescription>
                                    <FormControl>
                                        <TiptapEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Tuliskan bio Disini"
                                            error={!!form.formState.errors.bio}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                                <FormField
                                    control={form.control}
                                    name="facebookName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex gap-1.5 items-end"><Facebook className="size-4" />Facebook</FormLabel>
                                            <FormControl>
                                                <Input placeholder="@name..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="facebookUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Link Facebook</FormLabel>
                                            <FormControl>
                                                <Input type="url" placeholder="https://facebook..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                                <FormField
                                    control={form.control}
                                    name="instagramName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex gap-1.5 items-end"><Instagram className="size-4" />Instagram</FormLabel>
                                            <FormControl>
                                                <Input placeholder="@name..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="instagramUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Link Instagram</FormLabel>
                                            <FormControl>
                                                <Input type="url" placeholder="https://instagram..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                                <FormField
                                    control={form.control}
                                    name="linkedInName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex gap-1.5 items-end"><Linkedin className="size-4" />LinkedIn</FormLabel>
                                            <FormControl>
                                                <Input placeholder="@name..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="linkedInUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Link LinkedIn</FormLabel>
                                            <FormControl>
                                                <Input type="url" placeholder="https://linkedin..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2 sm:pt-4">
                            <SubmitButton isUpdate={!!data} form={form} />
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}