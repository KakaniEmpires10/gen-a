"use client"

import { registerSchema, propsModals, MemberOption } from "../Dashboard/users/users.constant"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown, LoaderCircle, Save } from "lucide-react"
import toast from "react-hot-toast"
import useSWR, { mutate } from "swr"
import { addUser } from "@/action/UserAction"
import { useState } from "react"
import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import RegisterUserSkeleton from "@/components/Skeletons/RegisterUserSkeleton"

const FormRegister = ({ onOpenChange }: propsModals) => {
  const { data: members, error, isLoading } = useSWR<MemberOption[]>("/api/members?noUser=true&simple=true")

  const [selectedMember, setSelectedMember] = useState<MemberOption | null>(null)
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      memberId: "",
      username: "",
      password: "",
      role: "ANGGOTA",
    },
  })

  const handleSubmit = async (values: z.infer<typeof registerSchema>) => {
    const toastId = toast.loading("Menyimpan...")

    try {
      const res = await addUser(values)

      if (!res.success) {
        throw new Error(res.message)
      }

      toast.success(res.message, { id: toastId })
      form.reset()
      setSelectedMember(null)
      mutate("/api/users")
      mutate("/api/members?noUser=true&simple=true")
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Terjadi kesalahan",
        { id: toastId }
      )
    }
  }

  if (isLoading) {
    return (
      <RegisterUserSkeleton />
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-6 max-w-sm text-center">
          <p className="text-destructive font-semibold mb-2">Gagal memuat data member</p>
          <p className="text-sm text-muted-foreground mb-4">
            Terjadi kesalahan saat mengambil data. Silakan coba lagi.
          </p>
          <Button onClick={() => mutate("/api/members?noUser=true&simple=true")} variant="soft-destructive" size="sm">
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Tidak ada member yang tersedia</p>
        <p className="text-sm mt-2">Semua member sudah memiliki akun user</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="memberId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Member <span className="text-xs text-red-500">*</span></FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? members.find((member) => member.id === field.value)?.name : "Pilih Member"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Cari member..." />
                    <CommandEmpty>Tidak ada member yang ditemukan</CommandEmpty>
                    <CommandList className="max-h-60">
                      <CommandGroup>
                        {members?.map((member) => (
                          <CommandItem
                            value={member.id}
                            key={member.id}
                            onSelect={() => {
                              form.setValue("memberId", member.id)
                              setSelectedMember(member)
                              setOpen(false)
                            }}
                            className="flex items-center gap-3 cursor-pointer px-2"
                          >
                            {member.image && (
                              <Image
                                src={member.image || "/placeholder.svg"}
                                alt={member.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{member.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* MEMBER PREVIEW */}
        {selectedMember && (
          <div className="mt-6 rounded-lg border border-border bg-gradient-to-br from-background to-muted/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row gap-4 p-4">
              {selectedMember.image && (
                <div className="flex-shrink-0">
                  <Image
                    src={selectedMember.image || "/placeholder.svg"}
                    alt={selectedMember.name}
                    width={120}
                    height={120}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border border-border"
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nama</p>
                  <p className="text-sm sm:text-base font-semibold text-foreground">{selectedMember.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</p>
                  <p className="text-sm text-foreground break-all">{selectedMember.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERNAME */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username <span className="text-xs text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Masukkan username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ROLE */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role <span className="text-xs text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="PENULIS_BERITA">Penulis Berita</SelectItem>
                  <SelectItem value="ANGGOTA">Anggota</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PASSWORD */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password <span className="text-xs text-red-500">*</span></FormLabel>
              <FormControl>
                <PasswordInput placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
          {form.formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : <Save />}
          {form.formState.isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </form>
    </Form>
  )
}

export default FormRegister