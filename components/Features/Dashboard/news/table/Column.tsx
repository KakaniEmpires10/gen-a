"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { NewsWithRelations } from "../news.constant"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import TableButton from "./TableButton"
import Image from "next/image"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import StatusDropdown from "./StatusDropDown"

// ── Author Avatar ──────────────────────────────────────────────
function AuthorAvatar({ name, image }: { name: string; image?: string | null }) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()

    return (
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 bg-blue-50 text-blue-700 flex items-center justify-center text-[10px] font-medium">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        width={24}
                        height={24}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    initials
                )}
            </div>
            <span className="text-xs text-foreground whitespace-nowrap">{name}</span>
        </div>
    )
}

// ── Thumbnail ──────────────────────────────────────────────────
function Thumbnail({ src }: { src?: string | null }) {
    return (
        <div className="relative w-[72px] h-10 rounded-md overflow-hidden shrink-0 bg-slate-800">
            {src ? (
                <Image
                    src={src}
                    alt="Thumbnail"
                    fill
                    sizes="72px"
                    className="object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-[9px] font-medium text-slate-500 tracking-wide">
                    NO IMAGE
                </div>
            )}
        </div>
    )
}

export const columns: ColumnDef<NewsWithRelations>[] = [
    {
        id: "no",
        header: "No. ",
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground tabular-nums">
                {row.index + 1}
            </span>
        ),
    },

    {
        id: "featuredImage",
        header: "Thumbnail",
        cell: ({ row }) => <Thumbnail src={row.original.featuredImage} />,
    },

    {
        id: "judul",
        header: "Judul",
        cell: ({ row }) => {
            const news = row.original
            return (
                <div className="flex flex-col gap-0.5 max-w-[260px]">
                    <p className="text-[13px] font-medium leading-snug line-clamp-2">
                        {news.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[220px]">
                        /{news.slug}
                    </p>
                </div>
            )
        },
    },

    {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }) => {
            const type = row.original.type
            return (
                <Badge variant={type === "INTERNAL" ? "soft-info" : "soft-indigo"}>
                    {type === "INTERNAL" ? "Internal" : "Eksternal"}
                </Badge>
            )
        },
    },

    {
        accessorKey: "users.name",
        header: "Author",
        cell: ({ row }) => {
            const user = row.original.users
            if (!user?.name) return <span className="text-muted-foreground">—</span>
            return <AuthorAvatar name={user.name} image={user.image} />
        },
    },

    {
        id: "tags",
        header: "Tag",
        cell: ({ row }) => {
            const tags = row.original.news_tags
            if (!tags?.length)
                return <span className="text-muted-foreground">—</span>

            return (
                <div className="flex flex-wrap gap-1 max-w-[160px]">
                    {tags.slice(0, 2).map((item) => (
                        <Badge key={item.tag.id} variant="outline" className="text-[10px]">
                            {item.tag.name}
                        </Badge>
                    ))}
                    {tags.length > 2 && (
                        <span className="text-[10px] text-muted-foreground self-center">
                            +{tags.length - 2}
                        </span>
                    )}
                </div>
            )
        },
    },

    {
        accessorKey: "publishedAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-4 pb-0"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Publish
                {column.getIsSorted() === "asc" ? (
                    <ArrowUp className="size-3" />
                ) : column.getIsSorted() === "desc" ? (
                    <ArrowDown className="size-3" />
                ) : (
                    <ArrowUpDown className="size-3 opacity-50" />
                )}
            </Button>
        ),
        sortingFn: "datetime",
        cell: ({ row }) => {
            const date = row.original.publishedAt
            return (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {date ? format(new Date(date), "dd MMM yyyy", { locale: id }) : "—"}
                </span>
            )
        },
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <StatusDropdown
                id={row.original.id}
                currentStatus={row.original.status}
            />
        ),
    },

    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const news = row.original
            const isExternal = news.type === "EXTERNAL"
            const link = isExternal ? news.externalUrl! : news.slug
            return (
                <TableButton id={news.id} link={link} isExternal={isExternal} />
            )
        },
    },
]