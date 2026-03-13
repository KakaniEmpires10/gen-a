"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { SubunitColor, SubunitColors } from "../subUnit.constant";
import TableButton from "./TableButton";
import { ColOrder } from "./ColButton";
import { SubUnit } from "@prisma/client";

export const columns: ColumnDef<SubUnit>[] = [
    {
        accessorKey: "order",
        header: "Urutan",
        cell: ({ row }) => {
            return <ColOrder row={row} />
        }
    },
    {
        accessorKey: "logo",
        header: "Logo",
        cell: ({ row }) => {
            return (
                <AspectRatio ratio={1 / 1}>
                    <Image className="rounded-full object-cover shadow-sm shadow-slate-800" src={row.getValue("logo")} alt="logo" fill sizes="40px" />
                </AspectRatio>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Nama Sub-Unit",
    },
    {
        accessorKey: "abbreviation",
        header: "Singkatan",
        cell: ({ row }) => (
            <div className="flex justify-center items-center font-semibold">{row.getValue("abbreviation")}</div>
        )
    },
    {
        accessorKey: "primaryColor",
        header: "Warna Utama",
        cell: ({ row }) => {
            const color = row.getValue("primaryColor")
            return (
                <div className="flex justify-center items-center">
                    <Badge variant="default" className={cn("size-5 p-0", SubunitColors[color as SubunitColor])}></Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Deskripsi",
        cell: ({ row }) => {
            const deskripsi: string = row.getValue("description");
            return (
                <div dangerouslySetInnerHTML={{ __html: deskripsi }}></div>
            )
        }
    },
    {
        id: "action",
        header: () => <div className="text-center">Action</div>,
        cell: ({ row }) => {
            return (
                <TableButton id={row.original.id} />
            )
        }
    },
];