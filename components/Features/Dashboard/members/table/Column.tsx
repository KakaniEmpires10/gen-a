"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { calculateAge } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FacebookIcon, GripHorizontalIcon, InstagramIcon, LinkedinIcon, XCircle } from "lucide-react";
import TableButton from "./TableButton";
import { Separator } from "@/components/ui/separator";
import { MemberWithRelation } from "../member.constant";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Socials } from "@/types/socialType";
import { StatusSwitch } from "./SwitchCell";
import toast from "react-hot-toast";

export const columns: ColumnDef<MemberWithRelation>[] = [
    {
        accessorKey: "id",
        header: "No.",
        cell: ({ row }) => {
            return <div>{row.index + 1}</div>
        }
    },
    {
        accessorKey: "image",
        header: "Profile",
        cell: ({ row }) => {
            const gender = row.original.gender;
            const image = row.original.image;
            let defaultImg;

            if (image) {
                defaultImg = image
            } else {
                if (gender == "FEMALE") {
                    defaultImg = "/placeholder_female.png"
                } else {
                    defaultImg = "/placeholder_male.png"
                }
            }

            return (
                <Avatar>
                    <AvatarImage src={defaultImg} />
                    <AvatarFallback className="font-semibold">NO</AvatarFallback>
                </Avatar>
            );
        },
    },
    {
        id: "name",
        header: "Nama",
        cell: ({ row }) => {
            const name = row.original.name;
            const degree = row.original.educationTitle;
            const education = row.original.educationLevel;
            const age = row.original.birthdate ? calculateAge(row.original.birthdate) : null
            const gender = row.original.gender;

            return (
                <div className="space-y-1">
                    <p className="font-semibold capitalize">{name}</p>
                    {gender === "MALE" ? (
                        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 dark:hover:bg-blue-900/50 dark:hover:text-blue-100 transition-colors">
                            Lk
                        </Badge>
                    ) : gender === "FEMALE" ? (
                        <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 dark:bg-rose-900/30 dark:text-rose-200 dark:hover:bg-rose-900/50 dark:hover:text-rose-100 transition-colors">
                            Pr
                        </Badge>
                    ) : (
                        <Badge variant="soft-secondary">-</Badge>
                    )}
                    <Badge variant="soft-success">{age} th</Badge>
                    <Badge variant="soft-secondary">{education}</Badge>
                    {degree && <Badge variant="soft-info">{degree}</Badge>}
                </div>
            )
        }
    },
    {
        id: "dept",
        header: "Departemen",
        cell: ({ row }) => {
            const m = row.original;

            let loc = "";
            let type = "";

            if (m.subunit) {
                loc = m.subunit.name;
                type = "Sub-Unit";
            } else if (m.sub_department) {
                loc = m.sub_department.name;
                type = "Departemen";
            } else if (m.department) {
                loc = m.department.name;
                type = "DPH";
            } else {
                loc = "-";
                type = "";
            }

            return (
                <div className="space-y-1">
                    <p className="font-semibold">{loc}</p>
                    {type && <Badge variant="soft-indigo">{type}</Badge>}
                </div>
            );
        }
    },
    {
        id: "role",
        header: "Jabatan",
        cell: ({ row }) => {
            const m = row.original;

            let role = "";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let variant: any = "soft-secondary";

            if (m.department_head) {
                role = "DPH";
                variant = "soft-indigo";
            } else if (m.sub_department_head) {
                role = "Ketua";
                variant = "soft-info";
            } else if (m.sub_unit_head) {
                role = "Ketua";
                variant = "soft-success";
            } else {
                role = m.position || "Anggota";
            }

            return <Badge variant={variant}>{role}</Badge>;
        }
    },
    {
        id: "contact",
        header: "Kontak",
        cell: ({ row }) => {
            return (
                <div className="space-y-1">
                    <p>{row.original.email ? row.original.email : <Badge variant="soft-destructive">Tidak ada email <XCircle className="inline mb-1"/></Badge>}</p>
                    <Separator />
                    <p>{row.original.phoneNumber ? row.original.phoneNumber : <Badge variant="soft-destructive">Tidak ada no. HP <XCircle className="inline mb-1"/></Badge>}</p>
                </div>
            )
        }
    },
    {
        id: "more",
        header: "More",
        cell: ({ row }) => {
            const data = row.original
            const socials: Socials = Array.isArray(data.socials) ? data.socials : [];
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost-primary" size="icon">
                            <GripHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" className="px-5 py-2 w-96 max-h-[500px] border-t-4 border-t-secondary overflow-y-scroll">
                        <DropdownMenuLabel>More...</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <ul>
                            <li className="p-3 text-sm gap-2 rounded-md my-2 bg-neutral-100 text-justify" dangerouslySetInnerHTML={{ __html: data.bio }}></li>
                            {/* <li className="p-2 text-sm flex item-center gap-2"><AwardIcon />Pendidikan</li>
                            <Separator className="mb-2" />
                            <li className="text-xs ml-10 mb-3">{data.pendidikan}</li> */}
                            {/* <li className="p-2 text-sm flex item-center gap-2"><BriefcaseIcon />Bidang</li>
                            <Separator className="mb-2" />
                            <li className="text-xs ml-10 mb-3">{data.bidang}</li> */}
                            {/* <li className="p-2 text-sm flex item-center gap-2"><FlameIcon />Keahlian</li>
                            <Separator className="mb-2" />
                            <li className="text-xs ml-10 mb-3">{data.keahlian}</li> */}
                            {/* <li className="p-2 text-sm flex item-center gap-2"><MailIcon />Email</li>
                            <Separator className="mb-2" />
                            <li className="text-xs ml-10 mb-3">{data.email}</li> */}
                            <li className="p-2 text-sm flex item-center gap-2"><InstagramIcon className="size-4" />Instagram</li>
                            <Separator className="mb-2" />
                            <li className="text-xs ml-10 mb-3">{socials[0]?.account || "-"}</li>
                            <li className="p-2 text-sm flex item-center gap-2"><FacebookIcon className="size-4" />Facebook</li>
                            <Separator className="mb-2" />
                            <li className="text-xs ml-10 mb-3">{socials[1]?.account || "-"}</li>
                            <li className="p-2 text-sm flex item-center gap-2"><LinkedinIcon className="size-4" />LinkedIn</li>
                            <Separator className="mb-2" />
                            <li className="text-xs ml-10 mb-3">{socials[2]?.account || "-"}</li>
                        </ul>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
    {
        id: "status",
        header: () => <center>Status</center>,
        cell: ({ row }) => (
            <StatusSwitch
                id={row.original.id}
                initial={row.original.isActive}
                showLabel={true}
                onSuccess={(newState) => {
                    toast.success(`Anggota Berhasil ${newState ? 'diaktifkan' : 'di-nonaktifkan'}`)
                }}
                onError={() => {
                    toast.error('Gagal mengubah status anggota')
                }}
            />
        )
    },
    {
        id: "action",
        header: () => <center>Action</center>,
        cell: ({ row }) => (
            <TableButton id={row.original.id} />
        ),
    },
];
