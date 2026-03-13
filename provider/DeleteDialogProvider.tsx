"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { mutate } from "swr";

type DialogOptions = {
    id?: string | number;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    /** Fungsi async, bisa panggil server action */
    action?: (id?: string | number) => Promise<{ success: boolean; message: string }>;
    /** Optional: SWR mutate key */
    mutateKey?: string;
};

type DeleteDialogContextType = {
    openDialog: (options: DialogOptions) => void;
};

const DeleteDialogContext = createContext<DeleteDialogContextType | undefined>(undefined);

export function useDeleteDialog() {
    const ctx = useContext(DeleteDialogContext);
    if (!ctx) throw new Error("useDeleteDialog must be used inside provider");
    return ctx;
}

export function DeleteDialogProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<DialogOptions>({});

    const openDialog = (opts: DialogOptions) => {
        setOptions({
            title: opts.title ?? "Yakin Mau Menghapus Data Ini?",
            description:
                opts.description ??
                "Aksi ini tidak bisa di ulang kembali, tidak ada recycle bin dan tidak ada jin. Sekali hilang maka hilang selamanya",
            confirmText: opts.confirmText ?? "Hapus",
            cancelText: opts.cancelText ?? "Cancel",
            ...opts,
        });
        setOpen(true);
    };

    const handleDelete = async () => {
        if (!options.action) return;
        toast.promise(
            options.action(options.id).then((res) => {
                if (res.success && options.mutateKey) {
                    mutate(options.mutateKey);
                }
                return res;
            }),
            {
                loading: "Menghapus...",
                success: (data) => data.message,
                error: (err) => err.message || "Gagal Menghapus",
            }
        );
        setOpen(false);
    };

    return (
        <DeleteDialogContext.Provider value={{ openDialog }}>
            {children}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{options.title}</AlertDialogTitle>
                        <AlertDialogDescription>{options.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{options.cancelText}</AlertDialogCancel>
                        <AlertDialogAction
                            className={buttonVariants({ variant: "destructive" })}
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-1 h-4 w-4" /> {options.confirmText}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DeleteDialogContext.Provider>
    );
}
