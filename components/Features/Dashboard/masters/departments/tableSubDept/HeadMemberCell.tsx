/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import toast from "react-hot-toast";
import { LoaderCircle, Pencil, PencilLine, UserPlus, X } from 'lucide-react';
import { deleteDeptHead, updateDeptHead } from "@/action/MasterAction";

type MemberInfo = {
    id: string;
    name: string;
    email: string;
    image: string | null;
};

type HeadMemberWithInfo = {
    name: string;
    image: string | null;
    email: string | null;
};

type HeadMemberCellProps = {
    subDepartmentId: string;
    subDepartmentName: string;
    headMemberId: string | null;
    headMemberInfo?: HeadMemberWithInfo | null;
};

/* --------------------------------------------------
   COMPONENT: MemberSelect  (agar tidak duplikasi)
-------------------------------------------------- */
function MemberSelect({
    members,
    error,
    isLoading,
    value,
    onChange,
    disabled,
}: {
    members: MemberInfo[] | undefined;
    error: any;
    isLoading: boolean;
    value: string;
    onChange: (val: string) => void;
    disabled: boolean;
}) {
    return (
        <div className="space-y-2">
            <Label>Anggota</Label>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger className="h-auto ps-2 text-left [&>span]:flex [&>span]:items-center [&>span]:gap-2">
                    <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        {isLoading && <SelectLabel>Memuat anggota...</SelectLabel>}
                        {error && <SelectLabel>Gagal memuat anggota</SelectLabel>}
                        {!isLoading && !error && members?.length === 0 && (
                            <SelectLabel>Belum ada anggota</SelectLabel>
                        )}

                        {!isLoading && !error && members && members.length > 0 && (
                            <>
                                <SelectLabel>Pilih Anggota</SelectLabel>
                                {members.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        <span className="flex items-center gap-2">
                                            {member.image ? (
                                                <Image
                                                    className="rounded-full object-cover size-10"
                                                    src={member.image || "/placeholder.svg"}
                                                    alt={member.name}
                                                    width={40}
                                                    height={40}
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span>
                                                <span className="block font-medium">{member.name}</span>
                                                <span className="block text-xs text-muted-foreground">
                                                    {member.email}
                                                </span>
                                            </span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </>
                        )}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

/* --------------------------------------------------
                 MAIN COMPONENT
-------------------------------------------------- */
export default function HeadMemberCell({
    subDepartmentId,
    subDepartmentName,
    headMemberId,
    headMemberInfo,
}: HeadMemberCellProps) {
    const [open, setOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState(
        headMemberId || ""
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: members, isLoading, error } = useSWR<MemberInfo[]>(
        open ? `/api/sub-departments/${subDepartmentId}/members` : null
    );

    useEffect(() => {
        if (open) {
            setSelectedMemberId(headMemberId || "");
        } else {
            setSelectedMemberId(headMemberId || "");
        }
    }, [open, headMemberId]);

    const handleSubmit = async () => {
        if (!selectedMemberId) return toast.error("Pilih anggota terlebih dahulu");

        setIsSubmitting(true);
        try {
            const res = await updateDeptHead(subDepartmentId, selectedMemberId);

            if (res.error) throw new Error(res.error);

            toast.success("Ketua berhasil disimpan");
            mutate("/api/sub-departments");
            setOpen(false);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemove = async () => {
        if (!headMemberId) return;

        setIsSubmitting(true);
        try {
            const res = await deleteDeptHead(subDepartmentId);

            if (res.error) throw new Error(res.error);

            toast.success("Ketua berhasil dihapus");
            mutate("/api/sub-departments");
            setOpen(false);
            setSelectedMemberId("");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    /* --------------------------------------------------
       VIEW: Belum ada ketua
    -------------------------------------------------- */
    if (!headMemberId || !headMemberInfo) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-muted transition-colors gap-1.5"
                    >
                        <UserPlus className="h-3 w-3" />
                        Atur Ketua
                    </Badge>
                </DialogTrigger>

                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Pilih Ketua</DialogTitle>
                        <DialogDescription>
                            Pilih ketua untuk Departemen {subDepartmentName}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <MemberSelect
                            members={members}
                            error={error}
                            isLoading={isLoading}
                            value={selectedMemberId}
                            onChange={setSelectedMemberId}
                            disabled={isSubmitting}
                        />
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSubmit} disabled={!selectedMemberId || isSubmitting}>
                            {isSubmitting ? <LoaderCircle className="animate-spin" /> : <PencilLine />} {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    /* --------------------------------------------------
       VIEW: Sudah ada ketua → tampilkan avatar + edit
    -------------------------------------------------- */
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 group cursor-pointer border bg-muted py-2 px-4 rounded-full transition-colors">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-border">
                        {headMemberInfo.image ? (
                            <Image
                                src={headMemberInfo.image || "/placeholder.svg"}
                                alt={headMemberInfo.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-xs font-semibold">
                                {headMemberInfo.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <p className="font-medium text-sm truncate">
                            {headMemberInfo.name}
                        </p>
                        <small className="text-muted-foreground">{headMemberInfo.email}</small>
                    </div>

                    <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Ubah Ketua</DialogTitle>
                    <DialogDescription>
                        Ubah ketua untuk Departemen {subDepartmentName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <MemberSelect
                        members={members}
                        error={error}
                        isLoading={isLoading}
                        value={selectedMemberId}
                        onChange={setSelectedMemberId}
                        disabled={isSubmitting}
                    />
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleRemove}
                        disabled={isSubmitting}
                        className="gap-1.5"
                    >
                        <X className="h-4 w-4" />
                        Hapus Ketua
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedMemberId || isSubmitting}
                    >
                        {isSubmitting ? <LoaderCircle className="animate-spin" /> : <PencilLine />} {isSubmitting ? "Mengubah..." : "Ubah"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}