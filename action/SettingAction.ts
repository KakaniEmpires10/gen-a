"use server";

import { siteSettingsSchema } from "@/components/Features/Dashboard/settings/setting.constant";
import {
  deleteFromCloudinary,
  getPublicIdFromUrl,
} from "@/lib/cloudinary/image-uploader";
import prisma from "@/lib/prisma";
import { Socials } from "@/types/socialType";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { unstable_cache as cache } from "next/cache";

export const getSiteSettings = cache(
  async () => {
    return prisma.siteSettings.findFirst();
  },
  ["settings"],
  { tags: ["settings"] },
);

export const updateSiteSettings = async (id: string, values: z.infer<typeof siteSettingsSchema>) => {
  const {
    instagramUrl,
    instagramName,
    facebookUrl,
    facebookName,
    youtubeUrl,
    youtubeName,
    ...rest
  } = values;

  const socialLinks: Socials = [
    {
      name: "instagram",
      link: instagramUrl,
      account: instagramName || "",
    },
    {
      name: "facebook",
      link: facebookUrl,
      account: facebookName || "",
    },
    {
      name: "youtube",
      link: youtubeUrl,
      account: youtubeName || "",
    },
  ];

  const data = {
    ...rest,
    missionText: rest.missionText.map(m => m.value),
    visionText: rest.visionText.map(v => v.value),
    socialLinks,
  };

  try {
    const existingSettingImg = await prisma.siteSettings.findUnique({
      where: { id },
      select: { logo: true },
    });
  
    if (!existingSettingImg) {
      return {
        success: false,
        message: "Setting tidak ditemukan (404)",
      };
    }

    const updatedSetting = await prisma.siteSettings.update({
      where: { id },
      data,
    });

    if(values.logo && existingSettingImg.logo && existingSettingImg.logo !== updatedSetting.logo) {
      const publicId = getPublicIdFromUrl(existingSettingImg.logo);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err =>
          console.error("Cloudinary Cleanup Failed:", err),
        );
      }
    }

    revalidateTag("settings");

    return {
      success: true,
      message: "Berhasil mengupdate setting",
    };
  } catch (error) {
    console.error(error);

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
      message: "Terjadi kesalahan server (500)",
    };
  }
};