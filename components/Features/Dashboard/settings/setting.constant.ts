import { z } from "zod";

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, { message: "Nama Web tidak boleh kosong." }),
  orgName: z
    .string()
    .min(1, { message: "Nama organisasi tidak boleh kosong." }),
  tagline: z.string().optional(),
  logo: z.any().optional(),
  aboutText: z.string().optional(),
  visionText: z.array(z.object({ value: z.string() }), {
    required_error: "Setidaknya harus ada satu yang diisi",
  }),
  missionText: z.array(z.object({ value: z.string() }), {
    required_error: "Setidaknya harus ada satu yang diisi",
  }),
  contactEmail: z
    .string()
    .min(1, { message: "Email Wajib Diisi" })
    .email({ message: "Format email tidak valid" }),
  address: z.string().min(1, { message: "Alamat Wajib Diisi" }),
  contactPhone: z.string().optional(),
  facebookName: z.string().optional(),
  instagramName: z.string().optional(),
  youtubeName: z.string().optional(),
  facebookUrl: z.string().url({ message: "Masukkan url yang valid" }).or(z.literal('')),
  instagramUrl: z.string().url({ message: "Masukkan url yang valid" }).or(z.literal('')),
  youtubeUrl: z.string().url({ message: "Masukkan url yang valid" }).or(z.literal('')),
});
