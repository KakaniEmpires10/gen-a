"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { siteSettingsSchema } from "./setting.constant"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon, Facebook, ImageIcon, Instagram, MinusCircle, PlusCircle, UploadIcon, XIcon, Youtube } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { cn, createInitialFile } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { SocialItem, Socials } from "@/types/socialType"
import SubmitButton from "@/components/ui/SubmitButton"
import { updateSiteSettings } from "@/action/SettingAction"
import toast from "react-hot-toast"
import { SiteSettings } from "@prisma/client"
import { FormHeader } from "@/components/Layouts/Dashboard/FormHeader"
import { uploadToCloudinaryClient } from "@/lib/cloudinary/image-uploader-client"
import { TiptapMiniEditor } from "@/components/TiptapFullEditor/TiptapMiniEditor"

const FormSetting = ({ data }: { data: SiteSettings }) => {
  const maxSizeMB = 5
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
    initialFiles: createInitialFile(data.logo, "current-logo"),
  });

  const previewUrl = files[0]?.preview || null;

  const missions = data?.missionText.map((item) => ({ value: item }))
  const visions = data?.visionText.map((item) => ({ value: item }))

  const socials = data?.socialLinks as Socials | [];

  const instagram: SocialItem = socials?.find((item) => item.name === "instagram") || { name: "instagram", account: "", link: "" };
  const facebook: SocialItem = socials?.find((item) => item.name === "facebook") || { name: "facebook", account: "", link: "" };
  const youtube: SocialItem = socials?.find((item) => item.name === "youtube") || { name: "youtube", account: "", link: "" };

  const form = useForm<z.infer<typeof siteSettingsSchema>>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: data ? data.siteName : "",
      orgName: data ? data.orgName : "",
      aboutText: data ? data.aboutText ?? "" : "",
      tagline: data ? data.tagline ?? "" : "",
      missionText: data.missionText ? missions : [
        { value: "" }
      ],
      visionText: data.visionText ? visions : [
        { value: "" }
      ],
      address: data ? data.address ?? "" : "",
      contactEmail: data ? data.contactEmail ?? "" : "",
      contactPhone: data ? data.contactPhone ?? "" : "",
      facebookName: facebook ? facebook.account : "",
      facebookUrl: facebook ? facebook.link : "",
      instagramName: instagram ? instagram.account : "",
      instagramUrl: instagram ? instagram.link : "",
      youtubeName: youtube ? youtube.account : "",
      youtubeUrl: youtube ? youtube.link : ""
    },
  })

  const { fields: fieldsMission, append: appendMission, remove: removeMission } = useFieldArray({
    name: "missionText",
    control: form.control
  })

  const { fields: fieldsVision, append: appendVision, remove: removeVision } = useFieldArray({
    name: "visionText",
    control: form.control
  })

  async function onSubmit(values: z.infer<typeof siteSettingsSchema>) {
    const toastId = toast.loading("Meng-update...");

    const uploadResult = await uploadToCloudinaryClient(files, toastId, "logos", true, data.logo);

    if (!uploadResult.success) {
      toast.error(uploadResult.message as string || "Gagal mengupload logo", { id: toastId });
      return;
    }

    const payload = {
      ...values,
      ...(uploadResult.url && { logo: uploadResult.url })
    };

    toast.loading("Meng-update setting...", { id: toastId });
    const res = await updateSiteSettings(data.id, payload);

    if (!res || res.success == false) {
      toast.error(res.message || "Terjadi kesalahan, hubungi admin 🙏");
      return;
    }

    toast.success(res.message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <FormHeader isCenter title="Logo Aplikasi" />
            <p className="text-xs text-center font-semibold text-muted-foreground mb-2">Upload Logo Organisasi untuk ditampilkan di aplikasi</p>
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-8">
            <FormHeader title="Informasi Dasar" />

            <div className="grid gap-4 items-end grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Web</FormLabel>
                    <FormDescription>
                      Ini Akan menjadi nama website dan web app yang anda gunakan sekarang
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="gen-a..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orgName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Organisasi</FormLabel>
                    <FormControl>
                      <Input placeholder="Generasi Apa gitu..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Penggerak anak muda bangsa..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aboutText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tentang Organisasi</FormLabel>
                  <FormDescription>
                    Konten dari input ini akan ditampilkan di halaman depan dan halaman tentang kami
                  </FormDescription>
                  <FormControl>
                    <TiptapMiniEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Tuliskan Deskripsi Disini"
                      error={!!form.formState.errors.aboutText}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-8">
            <FormHeader title="Visi & Misi" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                {fieldsVision.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`visionText.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Visi
                        </FormLabel>
                        <FormDescription className={cn(index !== 0 && "sr-only")}>
                          Tambahkan Visi Organisasi ini
                        </FormDescription>
                        <div className="flex gap-4">
                          <FormControl>
                            <Input placeholder="Memandu Pemuda bangsa..." {...field} />
                          </FormControl>
                          {index != 0 && (
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeVision(index)}
                            >
                              <MinusCircle />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="soft-success"
                  size="sm"
                  className="mt-2"
                  onClick={() => appendVision({ value: "" })}
                >
                  <PlusCircle /> Visi
                </Button>
              </div>
              <div className="space-y-2">
                {fieldsMission.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`missionText.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Misi
                        </FormLabel>
                        <FormDescription className={cn(index !== 0 && "sr-only")}>
                          Tambahkan Misi Organisasi ini
                        </FormDescription>
                        <div className="flex gap-4">
                          <FormControl>
                            <Input placeholder="Mencapai indonesia emas 2045..." {...field} />
                          </FormControl>
                          {index != 0 && (
                            <Button
                              variant="soft-destructive"
                              size="icon"
                              onClick={() => removeMission(index)}
                            >
                              <MinusCircle />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="soft-success"
                  size="sm"
                  className="mt-2"
                  onClick={() => appendMission({ value: "" })}
                >
                  <PlusCircle /> Misi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-8">
            <FormHeader title="Informasi Kontak" />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Jl. Ahmad Yani..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="gena@gmail..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Telephone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="0852881..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-8">
            <FormHeader title="Informasi Sosial" />

            <div className="grid gap-y-8 gap-x-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-4 lg:gap-8">
                <FormField
                  control={form.control}
                  name="facebookName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex gap-1.5 items-center"><Facebook className="size-4" />Facebook</FormLabel>
                      <FormControl>
                        <Input placeholder="@gen-a..." {...field} />
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
              <div className="flex flex-col gap-4 lg:gap-8">
                <FormField
                  control={form.control}
                  name="instagramName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex gap-1.5 items-center"><Instagram className="size-4" />instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="@gen-a..." {...field} />
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
                      <FormLabel>Link instagram</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://instagram..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-4 lg:gap-8">
                <FormField
                  control={form.control}
                  name="youtubeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex gap-1.5 items-center"><Youtube className="size-4" />youtube</FormLabel>
                      <FormControl>
                        <Input placeholder="@gen-a..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link youtube</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://youtube..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <SubmitButton form={form} isUpdate />
        </div>
      </form>
    </Form>
  )
}

export default FormSetting