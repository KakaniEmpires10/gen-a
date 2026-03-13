"use client";

import { ColumnDef } from "@tanstack/react-table";
import TableButton from "./TableButton";
import { Tags } from "@prisma/client";

export const columns: ColumnDef<Tags>[] = [
    {
        accessorKey: "id",
        header: "No.",
        cell: ({ row }) => {
            return <div>{row.index + 1}</div>
        }
    },
    {
        accessorKey: "name",
        header: "Nama Tags",
        cell: ({ row }) => <p className="font-semibold capitalize">{row.getValue("name")}</p>
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
