import { Tags } from "@prisma/client";
import { z } from "zod";

export type propsModals = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type propsModalInsert = propsModals & { data?: Tags };
export type propsModalDelete = propsModals & { id: string };

export const tagsSchema = z.object({
  name: z.string().min(1, { message: "Nama Tag Wajib Diisi" })
})