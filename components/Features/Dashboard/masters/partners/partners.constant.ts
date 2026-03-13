import { Partners } from "@prisma/client";
import { z } from "zod";

export type propsModals = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type PartnersForm = Omit<Partners, "website" | "createdAt" | "updatedAt"> & {
  website: string | null;
};

export type propsModalInsert = propsModals & { data?: PartnersForm };
export type propsModalDelete = propsModals & { id: string };

export const partnersSchema = z.object({
  name: z.string().min(1, { message: "Nama Mitra Wajib Diisi" }),
  abbr: z.string().min(1, { message: "Singkatan Mitra Wajib Diisi" }),
  website: z.string().url({ message: "Link harus berupa URL yang valid" }).optional().or(z.literal("")),
  img: z.any().optional()
})