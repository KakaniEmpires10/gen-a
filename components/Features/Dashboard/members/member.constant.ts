import { Member, Prisma } from "@prisma/client";
import { z } from "zod";

export type propsModals = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type propsModalInsert = propsModals & { data?: Member };

export type MemberWithRelation = Prisma.MemberGetPayload<{
  include: {
    department: true;
    sub_department: true;
    subunit: true;
    department_head: true;
    sub_department_head: true;
    sub_unit_head: true;
  };
}>;

export type MemberResponse = MemberWithRelation[];

export const memberSchema = z
  .object({
    name: z.string().min(1, { message: "Nama wajib diisi" }),
    gender: z.enum(["MALE", "FEMALE"], {
      required_error: "Jenis kelamin wajib diisi",
      invalid_type_error: "Jenis kelamin harus berupa pria atau wanita",
    }),
    email: z
      .string()
      .min(1, { message: "Email wajib diisi" })
      .email({ message: "Format email tidak valid" }),
    no_tel: z.string().min(1, { message: "Nomor telepon wajib diisi" }),
    birthdate: z.coerce.date(),
    education_level: z
      .string()
      .min(1, { message: "pendidikan terakhir wajib diisi" }),
    education_title: z.string().optional(),
    fieldOfInterest: z
      .array(
        z.object({
          id: z.string(),
          text: z.string(),
        })
      )
      .optional(),
    skills: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    ),
    subUnitId: z.string().optional(),
    departmentId: z.string().optional(),
    bio: z
      .string()
      .min(1, { message: "Bio wajib diisi setidaknya sedikit saja" }),
    address: z.string().min(1, { message: "Alamat wajib diisi" }),
    domicile: z.string().min(1, { message: "Domisili wajib diisi" }),
    image: z.any().optional(),
    facebookName: z.string().optional(),
    instagramName: z.string().optional(),
    linkedInName: z.string().optional(),
    facebookUrl: z
      .string()
      .url({ message: "Masukkan url yang valid" })
      .or(z.literal("")),
    instagramUrl: z
      .string()
      .url({ message: "Masukkan url yang valid" })
      .or(z.literal("")),
    linkedInUrl: z
      .string()
      .url({ message: "Masukkan url yang valid" })
      .or(z.literal("")),
  })
  .refine(
    data => {
      if (["S1", "S2", "S3"].includes(data.education_level)) {
        return data.education_title && data.education_title.trim() !== "";
      }
      return true;
    },
    {
      message: "Gelar Wajib diisi",
      path: ["education_title"],
    }
  );
