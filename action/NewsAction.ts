"use server";
import { auth } from "@/auth";
import { newsFormSchema } from "@/components/Features/Dashboard/news/news.constant";
import { deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary/image-uploader";
import prisma from "@/lib/prisma";
import { NewsStatus, Prisma } from "@prisma/client";
import { unstable_cache as cache, revalidateTag } from "next/cache";
import { z } from "zod";

export const getAllNews = cache(
  async () => {
    return await prisma.news.findMany({
      include: {
        users: true,
        news_tags: {
          include: {
            tag: true,
          },
        },
        PartnerOnNews: {
          include: {
            partners: true,
          },
        },
        subunit: true,
      },
      orderBy: { publishedAt: "desc" },
    });
  },
  ["news"],
  { tags: ["news"] },
);

export const getNewsById = cache(
  async (id: string) => {
    return await prisma.news.findUnique({
      where: { id },
      include: {
        users: true,
        news_tags: {
          include: {
            tag: true,
          },
        },
        PartnerOnNews: {
          include: {
            partners: true,
          },
        },
        subunit: true,
      },
    });
  },
  ["news-by-id"],
  { tags: ["news"] },
);

export const addNews = async (values: z.infer<typeof newsFormSchema>) => {
  const session = await auth();

  if (!session?.user) {
    if (values.featuredImage) {
      const publicId = getPublicIdFromUrl(values.featuredImage);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err =>
          console.error("Cloudinary Cleanup Failed:", err),
        );
      }
    }

    return {
      success: false,
      message: "Anda Tidak Memiliki Akses Untuk Melakukan Aksi Ini",
    };
  }

  const {
    authorId,
    partnerIds,
    publishedAt,
    subunitId,
    status,
    tagIds,
    title,
    type,
    content,
    excerpt,
    externalUrl,
    featuredImage,
    slug,
    sourceName,
  } = values;

  const tags =  tagIds?.map(tag => ({ id: tag.id, name: tag.text })) || [];
  const partners =
    partnerIds?.map(partner => ({ id: partner.id, name: partner.text })) || [];

  try {
    await prisma.news.create({
      data: {
        title,
        type,
        status,
        content,
        excerpt,
        externalUrl: externalUrl,
        featuredImage: featuredImage,
        slug: slug,
        sourceName: sourceName,
        publishedAt,
        authorId: authorId ?? session.user.id,
        subunitId: subunitId || null,
        news_tags: tags?.length
          ? {
              create: tags.map(tag => ({
                tag: {
                  connect: { id: tag.id },
                },
              })),
            }
          : undefined,

        PartnerOnNews: partners?.length
          ? {
              create: partners.map(partner => ({
                partners: {
                  connect: { id: partner.id },
                },
              })),
            }
          : undefined,
      },
    });

    revalidateTag("news");

    return {
      success: true,
      message: "Berita Berhasil Dibuat",
    };
  } catch (err) {

    if (values.featuredImage) {
      const publicId = getPublicIdFromUrl(values.featuredImage);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err =>
          console.error("Cloudinary Cleanup Failed:", err),
        );
      }
    }

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const field = (err.meta?.target as string[])?.[0];

      let friendlyMessage = "Data sudah digunakan";

      if (field === "slug") {
        friendlyMessage = "Slug sudah digunakan";
      }

      return {
        success: false,
        message: friendlyMessage,
      };
    }

    console.error(err);

    if (err instanceof Error) {
      return {
        success: false,
        message: err.message
      }
    }

    return {
      success: false,
      message: "Gagal menambah Berita (500)",
    };
  }
};

export const updateNews = async (
  id: string,
  values: z.infer<typeof newsFormSchema>,
) => {
  const {
    partnerIds,
    publishedAt,
    subunitId,
    status,
    tagIds,
    title,
    type,
    content,
    excerpt,
    externalUrl,
    featuredImage,
    slug,
    sourceName,
  } = values;

  const tags = tagIds?.map(tag => ({ id: tag.id, name: tag.text })) || [];
  const partners =
    partnerIds?.map(partner => ({ id: partner.id, name: partner.text })) || [];

  try {
    const existingNews = await prisma.news.findUnique({
      where: { id },
      select: { featuredImage: true },
    });

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title,
        type,
        status,
        content,
        excerpt,
        externalUrl: externalUrl || null,
        featuredImage: featuredImage || null,
        slug: slug,
        sourceName: sourceName || null,
        publishedAt,
        subunitId: subunitId || null,
        news_tags: {
          deleteMany: {},
          create: tags.map(tag => ({
            tag: {
              connect: { id: tag.id },
            },
          })),
        },

        PartnerOnNews: {
          deleteMany: {},
          create: partners.map(partner => ({
            partners: {
              connect: { id: partner.id },
            },
          })),
        },
      },
    });

    if (existingNews?.featuredImage && existingNews.featuredImage !== updatedNews.featuredImage) {
      const publicId = getPublicIdFromUrl(existingNews.featuredImage);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err =>
          console.error("Cloudinary Cleanup Failed:", err),
        );
      }
    }

    revalidateTag("news");

    return {
      success: true,
      message: "Berita Berhasil Diubah",
    };
  } catch (err) {
    if (values.featuredImage) {
      const publicId = getPublicIdFromUrl(values.featuredImage);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err =>
          console.error("Cloudinary Cleanup Failed:", err),
        );
      }
    }

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const field = (err.meta?.target as string[])?.[0];

      let friendlyMessage = "Data sudah digunakan";

      if (field === "slug") {
        friendlyMessage = "Slug sudah digunakan";
      }

      return {
        success: false,
        message: friendlyMessage,
      };
    }

    console.error(err);

    return {
      success: false,
      message: "Gagal mengubah Berita (500)",
    };
  }
};

export const updateNewsStatus = async (id: string, status: NewsStatus) => {
  if (!id) return { success: false, message: "Id tidak ditemukan" };

  try {
    await prisma.news.update({
      where: { id },
      data: { status },
    });

    revalidateTag("news");

    return {
      success: true,
      message: `Status diubah ke ${status.toLowerCase()}`,
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Gagal mengubah status (500)" };
  }
};

export const deleteNews = async (id: string) => {
  if (!id) {
    return {
      success: false,
      message: "Id Tidak Terdeteksi",
    };
  }

  try {
    const exisitingNews = await prisma.news.findUnique({
      where: { id },
      select: { featuredImage: true },
    });

    await prisma.news.delete({
      where: { id },
    });

    if (exisitingNews?.featuredImage) {
      const publicId = getPublicIdFromUrl(exisitingNews.featuredImage);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err =>
          console.error("Cloudinary Cleanup Failed:", err),
        );
      }
    }

    revalidateTag("news");
    return {
      success: true,
      message: "Berita Berhasil Dihapus",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Gagal Menghapus Berita (500)",
    };
  }
};
