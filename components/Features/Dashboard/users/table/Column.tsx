"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import TableButton from "./TableButton"
import { Users } from "@prisma/client"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { getInitials } from "@/lib/utils"

// Helper function untuk role label
const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
        SUPERADMIN: "Super Admin",
        ADMIN: "Admin",
        PENULIS_BERITA: "Penulis Berita",
        ANGGOTA: "Anggota",
    }
    return roleMap[role] || role
}

// Helper function untuk role badge variant
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRoleBadgeVariant = (role: string): any => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const variantMap: Record<string, any> = {
        SUPERADMIN: "soft-warning",
        ADMIN: "soft-info",
        PENULIS_BERITA: "soft-indigo",
        ANGGOTA: "soft-success",
    }
    return variantMap[role] || "default"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getGenderBadgeVariant = (gender: string): any => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const variantMap: Record<string, any> = {
        MALE: "soft-info",
        FEMALE: "soft-pink",
    }
    return variantMap[gender] || "default"
}

export const columns: ColumnDef<Users>[] = [
    {
        accessorKey: "id",
        header: "No.",
        cell: ({ row }) => {
            return <div className="w-10">{row.index + 1}</div>
        },
    },
    {
        accessorKey: "image",
        header: "Profile",
        cell: ({ row }) => {
            const { name, gender, image } = row.original

            let defaultImg: string
            if (image) {
                defaultImg = image
            } else {
                defaultImg = gender === "FEMALE"
                    ? "/placeholder_female.png"
                    : "/placeholder_male.png"
            }

            return (
                <Avatar className="h-10 w-10">
                    <AvatarImage src={defaultImg} alt={name} />
                    <AvatarFallback className="font-semibold text-sm">
                        {getInitials(name)}
                    </AvatarFallback>
                </Avatar>
            )
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 pb-0"
                >
                    Nama
                    <ArrowUpDown className="ml-2 h-2 w-2" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const { name, username } = row.original
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{name}</span>
                    <span className="text-xs text-gray-500">@{username}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "role",
        header: "Peran",
        cell: ({ row }) => {
            const role = row.original.role
            return (
                <Badge variant={getRoleBadgeVariant(role)}>
                    {getRoleLabel(role)}
                </Badge>
            )
        },
    },
    {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => {
            const gender = row.original.gender
            return (
                <Badge variant={getGenderBadgeVariant(gender)} className="capitalize">
                    {gender === "MALE" ? "Laki-laki" : "Perempuan"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 pb-0"
                >
                    Terdaftar
                    <ArrowUpDown className="ml-2 h-2 w-2" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)
            return (
                <div className="flex flex-col text-sm">
                    <span>{format(date, "dd MMM yyyy", { locale: id })}</span>
                    <span className="text-xs text-gray-500">
                        {format(date, "HH:mm", { locale: id })}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 pb-0"
                >
                    Terakhir Update
                    <ArrowUpDown className="ml-2 h-2 w-2" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.original.updatedAt)
            return (
                <div className="flex flex-col text-sm">
                    <span>{format(date, "dd MMM yyyy", { locale: id })}</span>
                    <span className="text-xs text-gray-500">
                        {format(date, "HH:mm", { locale: id })}
                    </span>
                </div>
            )
        },
    },
    {
        id: "action",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const data = row.original
            const isSuperAdmin = data.role === "SUPERADMIN"

            if (!isSuperAdmin) {
                return (
                    <div className="flex justify-center">
                        <TableButton id={data.id} />
                    </div>
                )
            }
        },
    },
]