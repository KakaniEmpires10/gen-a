import { Department, SubDepartment } from "@prisma/client";
import { z } from "zod";

export type propsModals = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type MemberSelect = {
  name: string;
  image: string | null;
  email: string;
};

export type propsModalInsertDepts = propsModals & { data?: Department };
export type propsModalInsertSubDepts = propsModals & { data?: SubDepartment };
export type propsModalDelete = propsModals & { id: string };

export const departmentSchema = z.object({
  name: z.string().min(1, { message: "Nama DPH Wajib Diisi" }),
  description: z.string().optional(),
  headMemberId: z.string().optional()
});

export const subDepartmentSchema = z.object({
  name: z.string().min(1, { message: "Nama Departemen Wajib Diisi" }),
  description: z.string().optional(),
  departmentId: z.string().min(1, { message: "Harus Isi Departemen Terkait" }),
});