import { z } from "zod";

export type propsModals = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export type propsModalDelete = propsModals & { id: string };

export type MemberOption = {
  id: string;
  name: string;
  email: string;
  gender: string;
  image?: string | null;
};

export const registerSchema = z.object({
  memberId: z.string().min(1, { message: "Member wajib dipilih" }),
  username: z.string().min(1, { message: "Username wajib diisi" }),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(6, { message: "Password minimal 6 karakter" })
    .regex(/^(?=.*[A-Z])(?=.*\d)/, {
      message: "Password harus memiliki minimal 1 huruf kapital dan 1 angka",
    }),

  role: z
    .enum(["SUPERADMIN", "ADMIN", "PENULIS_BERITA", "ANGGOTA"], {
      message: "Role tidak valid",
    })
});