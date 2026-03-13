"use server";

import { memberSchema } from "@/components/Features/Dashboard/members/member.constant";
import { deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary/image-uploader";
import prisma from "@/lib/prisma";
import { SocialItem, Socials } from "@/types/socialType";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { unstable_cache as cache } from "next/cache";

export const getAllMembers = cache(async () => {
  return await prisma.member.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      gender: true,
      phoneNumber: true,
      image: true,
      address: true,
      birthdate: true,
      bio: true,
      educationTitle: true,
      educationLevel: true,
      socials: true,
      joinedAt: true,
      isActive: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      sub_department: {
        select: {
          id: true,
          name: true,
        },
      },
      subunit: {
        select: {
          id: true,
          name: true,
        },
      },
      department_head: {
        select: {
          id: true,
        },
      },
      sub_department_head: {
        select: {
          id: true,
        },
      },
      sub_unit_head: {
        select: {
          id: true,
        },
      },
      users: {
        select: {
          id: true,
          username: true,
          role: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });
}, ["members"], { tags: ["members"] } )

export const getMemberById = cache(
  async (id: string) => {
    return await prisma.member.findFirst({
      where: { id },
      include: {
        subunit: {
          select: { name: true },
        },
        sub_department: {
          select: { name: true },
        },
      },
    });
  },
  ["member-by-id"],
  { tags: ["members"] },
);

export const addMember = async (values: z.infer<typeof memberSchema>) => {
  const {
    address,
    bio,
    birthdate,
    domicile,
    education_level,
    email,
    facebookUrl,
    gender,
    instagramUrl,
    linkedInUrl,
    name,
    no_tel,
    skills,
    departmentId,
    education_title,
    facebookName,
    fieldOfInterest,
    image,
    instagramName,
    subUnitId,
    linkedInName,
  } = values;

  const instagram: SocialItem = {
    name: "instagram",
    link: instagramUrl,
    account: instagramName || "",
  };

  const facebook: SocialItem = {
    name: "facebook",
    link: facebookUrl,
    account: facebookName || "",
  };

  const linkedIn: SocialItem = {
    name: "linkedIn",
    link: linkedInUrl,
    account: linkedInName || "",
  };

  const socialLinks = [instagram, facebook, linkedIn] as Socials;

  try {
    await prisma.member.create({
      data: {
        name,
        image: image ? image : null,
        gender,
        address,
        bio,
        birthdate,
        domicile,
        email,
        educationLevel: education_level,
        educationTitle: education_title,
        fieldOfInterest:
          fieldOfInterest?.map(item => item.text).join(", ") || "",
        phoneNumber: no_tel,
        skills: skills.map(item => item.text).join(", ") || "",
        socials: socialLinks,
        subDepartmentId: departmentId || null,
        subUnitId: subUnitId || null
      },
    });

    revalidateTag("members");

    return {
        success: true,
        message: "Anggota Berhasil Disimpan"
    }
  } catch (err) {

    if (values.image) {
      const publicId = getPublicIdFromUrl(values.image);
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

      if (field === "email") {
        friendlyMessage = "Email sudah terdaftar";
      }

      if (field === "phone_number" || field === "phoneNumber") {
        friendlyMessage = "Nomor telepon sudah terdaftar";
      }

      return {
        success: false,
        message: friendlyMessage,
      };
    }

    console.error(err);

    return {
      success: false,
      message: "Gagal menambah anggota (500)",
    };
  }
};

export const updateMember = async (id: string, values: z.infer<typeof memberSchema>) => {
    const {
      address,
      bio,
      birthdate,
      domicile,
      education_level,
      email,
      facebookUrl,
      gender,
      instagramUrl,
      linkedInUrl,
      name,
      no_tel,
      skills,
      departmentId,
      education_title,
      facebookName,
      fieldOfInterest,
      image,
      instagramName,
      subUnitId,
      linkedInName,
    } = values;

    const instagram: SocialItem = {
      name: "instagram",
      link: instagramUrl,
      account: instagramName || "",
    };

    const facebook: SocialItem = {
      name: "facebook",
      link: facebookUrl,
      account: facebookName || "",
    };

    const linkedIn: SocialItem = {
      name: "linkedIn",
      link: linkedInUrl,
      account: linkedInName || "",
    };

    const socialLinks = [instagram, facebook, linkedIn] as Socials;

    try {
      const existingMemberImg = await prisma.member.findUnique({
        where: { id },
        select: { image: true },
      });

      const updatedMember = await prisma.member.update({
        where: { id },
        data: {
          name,
          ...(image && { image }),
          gender,
          address,
          bio,
          birthdate,
          domicile,
          email,
          educationLevel: education_level,
          educationTitle: education_title,
          fieldOfInterest:
            fieldOfInterest?.map(item => item.text).join(", ") || "",
          phoneNumber: no_tel,
          skills: skills.map(item => item.text).join(", ") || "",
          socials: socialLinks,
          subDepartmentId: departmentId,
          subUnitId: subUnitId ? subUnitId : null,
        },
      });

      if (existingMemberImg && existingMemberImg.image !== updatedMember.image) {
        const publicId = getPublicIdFromUrl(existingMemberImg.image!);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }

      revalidateTag("members");

      return {
        success: true,
        message: "Anggota Berhasil Di Update",
      };
    } catch (err) {

      if (values.image) {
        const publicId = getPublicIdFromUrl(values.image);
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

        if (field === "email") {
          friendlyMessage = "Email sudah terdaftar";
        }

        if (field === "phone_number" || field === "phoneNumber") {
          friendlyMessage = "Nomor telepon sudah terdaftar";
        }

        return {
          success: false,
          message: friendlyMessage,
        };
      }

      console.error(err);

      return {
        success: false,
        message: "Gagal Meng-Update anggota (500)",
      };
    }
}

export const deleteMember = async (id: string) => {
  if (!id) {
    return {
      success: false,
      message: "Id Tidak Terdeteksi"
    }
  }

  try {
    const memberImage = await prisma.member.findFirst({
      where: { id },
      select: { image: true }
    })

    await prisma.member.delete({
      where: { id },
    });

    if (memberImage?.image) {
      const publicId = getPublicIdFromUrl(memberImage.image);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err =>
          console.error("Cloudinary Cleanup Failed:", err),
        );
      }
    }

    revalidateTag("members");

    return {
      success: true,
      message: "Anggota berhasil dihapus",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Gagal menghapus anggota (500)",
    };
  }
}

export async function toggleMemberStatus(id: string, value: boolean) {
  try {
    await prisma.member.update({
      where: { id },
      data: { isActive: value },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}