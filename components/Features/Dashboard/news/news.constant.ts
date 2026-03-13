import { Prisma } from "@prisma/client";
import { z } from "zod";

export type Tag = {
  id: string;
  name: string;
  _count?: {
    news: number;
  };
};

export type Partner = {
  id: string;
  name: string;
  image: string | null;
  abbreviation: string;
  website: string | null;
};

export type Subunit = {
  id: string;
  name: string;
  abbreviation: string;
  logo: string | null;
};

export type User = {
  id: string;
  name: string;
  image: string | null;
};

export type NewsWithRelations = Prisma.NewsGetPayload<{
  include: {
    users: true;
    news_tags: {
      include: { tag: true };
    };
    gallery_items: true;
  };
}>;

export const newsFormSchema = z
  .object({
    title: z.string().min(1, "Judul wajib diisi"),
    type: z.enum(["INTERNAL", "EXTERNAL"]),
    status: z.enum(["DRAFT", "PUBLISHED"]),
    slug: z.string().min(1, "Slug wajib diisi"),

    // Arrays dengan default values
    tagIds: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    ),
    partnerIds: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    ),

    // Optional fields
    content: z.string().optional(),
    excerpt: z.string().optional(),
    externalUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
    sourceName: z.string().optional(),
    featuredImage: z.string().optional(),
    authorId: z.string().optional(),
    publishedAt: z.coerce.date(),
    subunitId: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    // Validation untuk INTERNAL news
    if (data.type === "INTERNAL") {
      if (!data.content || data.content.trim() === "") {
        ctx.addIssue({
          path: ["content"],
          message: "Konten wajib diisi untuk berita internal",
          code: "custom",
        });
      }
    }

    // Validation untuk EXTERNAL news
    if (data.type === "EXTERNAL") {
      if (!data.externalUrl || data.externalUrl.trim() === "") {
        ctx.addIssue({
          path: ["externalUrl"],
          message: "Link berita wajib diisi untuk berita eksternal",
          code: "custom",
        });
      }

      if (!data.excerpt || data.excerpt.trim() === "") {
        ctx.addIssue({
          path: ["excerpt"],
          message: "Deskripsi singkat wajib diisi untuk berita eksternal",
          code: "custom",
        });
      }
    }
  });
