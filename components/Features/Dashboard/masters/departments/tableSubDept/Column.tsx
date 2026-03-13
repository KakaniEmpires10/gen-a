"use client";

import { ColumnDef } from "@tanstack/react-table";
import TableButton from "./TableButton";
import { Badge } from "@/components/ui/badge";
import { MembersAvatars } from "../modalSubDept/MembersAvatars";
import HeadMemberCell from "./HeadMemberCell";

export type MemberInfo = {
    name: string;
    image: string | null;
};

type HeadMemberInfo = {
    name: string;
    image: string | null;
    email: string | null;
};

export type TableSubDepartment = {
    id: string;
    departmentId: string;
    name: string;
    description: string | null;
    headMemberId: string | null;
    head_member?: HeadMemberInfo | null;
    members: MemberInfo[];
};

export const columns: ColumnDef<TableSubDepartment>[] = [
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
        id: "ketua",
        header: "Ketua",
        cell: ({ row }) => {
            return (
                <HeadMemberCell
                    subDepartmentId={row.original.id}
                    subDepartmentName={row.original.name}
                    headMemberId={row.original.headMemberId}
                    headMemberInfo={row.original.head_member}
                />
            );
        }
    },
    {
        id: "anggota",
        header: "Anggota",
        cell: ({ row }) => {
            const members = row.original.members;
            return <MembersAvatars members={members} subDepartmentName={row.getValue("name")} />;
        }
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
