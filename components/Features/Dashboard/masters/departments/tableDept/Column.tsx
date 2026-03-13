"use client";

import { ColumnDef } from "@tanstack/react-table";
import TableButton from "./TableButton";
import { Badge } from "@/components/ui/badge";
import { Department, Member } from "@prisma/client";

export type TableDepartment = Department & {
    member: Pick<Member, "name">
};

export const columns: ColumnDef<TableDepartment>[] = [
    {
        accessorKey: "id",
        header: "No.",
        cell: ({ row }) => {
            return <div>{row.index + 1}</div>
        }
    },
    {
        accessorKey: "name",
        header: "Nama Departemen",
        cell: ({ row }) => <p className="font-semibold capitalize">{row.getValue("name")}</p>
    },
    {
        accessorKey: "description",
        header: "Deskripsi",
        cell: ({ row }) => (
            row.getValue("description") ? (
                <div dangerouslySetInnerHTML={{ __html: row.getValue("description") }}></div>
            ) : (
                <Badge variant="soft-warning">Tidak ada deskripsi</Badge>
            )
        )
    },
    {
        accessorKey: "member",
        header: "Ketua",
        cell: ({ row }) => <p className="font-semibold capitalize">
            {row.original.member ? row.original.member.name : <Badge variant="soft-destructive">Ketua Belum Diisi</Badge>}</p>
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
