"use client";

import { ColumnDef } from "@tanstack/react-table";
import TableButton from "./TableButton";
import { Badge } from "@/components/ui/badge";
import { Partners } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const columns: ColumnDef<Partners>[] = [
    {
        accessorKey: "id",
        header: "No.",
        cell: ({ row }) => {
            return <div>{row.index + 1}</div>
        }
    },
    {
        accessorKey: "image",
        header: "Logo Mitra",
        cell: ({ row }) => (
            <div className="size-12 relative">
                <Image fill className="object-cover object-center" src={row.getValue("image")} alt={`Photo ${row.getValue("name")}`} />
            </div>
        )
    },
    {
        accessorKey: "name",
        header: "Nama Mitra",
        cell: ({ row }) => (
            <>
                <p className="font-semibold capitalize">{row.getValue("name")}</p>
                <div className="flex flex-wrap gap-0.5">
                    <Badge variant="soft-destructive">{row.original.abbreviation}</Badge>
                    {row.original.website && (
                        <Link
                            href={row.original.website}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Badge variant="soft-success">website <ExternalLink className="size-3 ml-1" /></Badge>
                        </Link>
                    )}
                </div>
            </>
        )
    },
    {
        id: "action",
        header: () => <div className="text-center">Action</div>,
        cell: ({ row }) => {
            const data = row.original;
            return (
                <TableButton data={data} />
            )
        },
    },
];
