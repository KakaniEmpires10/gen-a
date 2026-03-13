"use server";

import { subUnitSchema } from "@/components/Features/Dashboard/subUnits/subUnit.constant";
import { deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary/image-uploader";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { unstable_cache as cache } from "next/cache";

export const getAllSubUnits = cache(async () => {
  return await prisma.subUnit.findMany({
    orderBy: { order: "asc" },
  });
}, ["sub-units"], { tags: ["sub-units"] });

export const getSubUnitById = cache(async (id: string) => {
  return await prisma.subUnit.findUnique({
    where: { id },
  });
}, ["sub-units-by-id"], { tags: ["sub-units"] });

export const addSubUnit = async (values: z.infer<typeof subUnitSchema>) => {
  if (!values.logo)
    return { success: false, message: "Logo tidak boleh kosong" };

  const lastOrder = await prisma.subUnit.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const nextOrder = (lastOrder?.order || 0) + 1;

  try {
    await prisma.subUnit.create({
      data: {
        name: values.name,
        description: values.description,
        primaryColor: values.color,
        logo: values.logo,
        abbreviation: values.abbreviation,
        order: nextOrder,
      },
    });

    revalidateTag("sub-units");

    return {
      success: true,
      message: "Sub-unit berhasil ditambahkan",
    };
  } catch (err) {
    console.log(err);

    const publicId = getPublicIdFromUrl(values.logo);
    if (publicId) {
      await deleteFromCloudinary(publicId).catch(err =>
        console.error("Cloudinary Cleanup Failed:", err),
      );
    }

    return {
      success: false,
      message: "Gagal menambahkan sub-unit (500)",
    };
  }
};

export const updateSubUnit = async (
  id: string,
  values: z.infer<typeof subUnitSchema>
) => {
  try {
    const existingSubUnitImg = await prisma.subUnit.findUnique({
      where: { id },
      select: { logo: true },
    });

    const updatedSubUnit = await prisma.subUnit.update({
      where: { id },
      data: {
        name: values.name,
        description: values.description,
        primaryColor: values.color,
        logo: values.logo,
        abbreviation: values.abbreviation,
      },
    });

    if (existingSubUnitImg && existingSubUnitImg.logo !== updatedSubUnit.logo) {
      const publicId = getPublicIdFromUrl(existingSubUnitImg.logo!);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err =>
          console.error("Cloudinary Cleanup Failed:", err)
        );
      }
    }

    revalidateTag("sub-units");

    return {
      success: true,
      message: "Sub-unit berhasil diperbaharui",
    };
  } catch (err) {
    console.log(err);

    if (values.logo) {
      const publicId = getPublicIdFromUrl(values.logo);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err =>
          console.error("Cloudinary Cleanup Failed:", err),
        );
      }
    }

    return {
      success: false,
      message: "Gagal menambahkan sub-unit (500)",
    };
  }
};

export const deleteSubUnit = async (id: string) => {
  if (!id) return { success: false, message: "ID tidak ditemukan" };

  
  try {
    const subUnit = await prisma.subUnit.findUnique({
      where: { id },
      select: { logo: true },
    });

    if(!subUnit) return { success: false, message: "Sub-unit tidak ditemukan" };

    await prisma.subUnit.delete({ where: { id } });

    if (subUnit.logo) {
      const publicId = getPublicIdFromUrl(subUnit.logo);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err =>
          console.error("Cloudinary Cleanup Failed:", err),
        );
      }
    }

    revalidateTag("sub-units");

    return {
      success: true,
      message: "Sub-unit berhasil dihapus",
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "Gagal menghapus sub-unit (500)",
    };
  }
};

export const reorderSubUnit = async (id: string, order: number) => {
  if (!id) return { success: false, message: "Sub-unit tidak ditemukan" };

  try {
    await prisma.subUnit.update({
      where: { id },
      data: {
        order,
      },
    });

    revalidateTag("sub-units");

    return {
      success: true,
      message: "Urutan sub-unit berhasil diupdate",
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "Gagal mengupdate urutan (500)",
    };
  }
};
