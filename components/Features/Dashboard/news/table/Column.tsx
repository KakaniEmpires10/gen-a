"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { NewsWithRelations } from "../news.constant";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import TableButton from "./TableButton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

export const columns: ColumnDef<NewsWithRelations>[] = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => <span>{row.index + 1}</span>,
    },

    {
        id: "featuredImage",
        header: "Thumbnail",
        cell: ({ row }) => (
            <AspectRatio ratio={16 / 9}>
                {row.original.featuredImage ? (
                    <Image
                        className="rounded object-cover shadow-sm shadow-slate-800"
                        src={row.original.featuredImage}
                        alt="Featured Image..."
                        fill
                        sizes="33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex justify-center items-center text-white font-semibold">
                        NO
                    </div>
                )}
            </AspectRatio>
        )
    },

    {
        id: "jududl",
        header: "Judul",
        cell: ({ row }) => {
            const news = row.original;

            return (
                <p className="font-medium">{news.title}</p>
            );
        },
    },

    {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }) => {
            const type = row.original.type;

            return (
                <Badge variant={type === "INTERNAL" ? "default" : "secondary"}>
                    {type === "INTERNAL" ? "Internal" : "Eksternal"}
                </Badge>
            );
        },
    },

    {
        accessorKey: "users.name",
        header: "Author",
        cell: ({ row }) => row.original.users?.name ?? "-",
    },

    {
        id: "tags",
        header: "Tag",
        cell: ({ row }) => {
            const tags = row.original.news_tags;

            if (!tags?.length) return <span>-</span>;

            return (
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {tags.slice(0, 3).map((item) => (
                        <Badge key={item.tag.id} variant="outline">
                            {item.tag.name}
                        </Badge>
                    ))}
                    {tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                            +{tags.length - 3}
                        </span>
                    )}
                </div>
            );
        },
    },

    {
        accessorKey: "publishedAt",
        header: "Publish",
        cell: ({ row }) => {
            const date = row.original.publishedAt;
            return date
                ? format(new Date(date), "dd MMM yyyy", { locale: id })
                : "-";
        },
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;

            const variant =
                status === "PUBLISHED"
                    ? "default"
                    : status === "DRAFT"
                        ? "secondary"
                        : "outline";

            return <Badge variant={variant}>{status}</Badge>;
        },
    },

    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const news = row.original;

            return (
                <TableButton id={news.id} link={news.slug} isExternal={news.type === "EXTERNAL"} />
            );
        },
    },
];