"use server";

import { registerSchema } from "@/components/Features/Dashboard/users/users.constant";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { Gender } from "@prisma/client";

export const addUser = async (values: z.infer<typeof registerSchema>) => {
  const result = registerSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "Ada field yang tidak terisi",
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { memberId, password, username, role } = result.data;

  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      return {
        success: false,
        message: "Member tidak ditemukan",
      };
    }

    if (member.userId) {
      return {
        success: false,
        message: "Member sudah memiliki akun",
      };
    }

    const hashPass = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        username,
        password: hashPass,
        role,

        // 🔥 DATA DIAMBIL DARI MEMBER
        name: member.name,
        email: member.email,
        gender: member.gender as Gender,
        image: member.image,

        Member: {
          connect: { id: member.id },
        },
      },
    });

    revalidateTag("users");

    return {
      success: true,
      message: "User berhasil dibuat",
    };
  } catch (err) {
    const error = err as Error & {
      code?: string;
      meta?: { target?: string[] };
    };

    // Prisma unique constraint
    if (error.code === "P2002") {
      const targetField = error.meta?.target?.[0] || "data";

      const fieldMap: Record<string, string> = {
        email: "Email",
        username: "Username",
      };

      return {
        success: false,
        message: `${fieldMap[targetField] || targetField} sudah digunakan`,
      };
    }

    console.error("Error creating user:", error);

    return {
      success: false,
      message: "Terjadi kesalahan saat membuat user",
    };
  }
};


export const updateUser = async ({
  id,
  values,
}: {
  id: string;
  values: z.infer<typeof registerSchema>;
}) => {
  if (!id) {
    return {
      success: false,
      message: "Id tidak ditemukan",
    };
  }

  const result = registerSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      message: "Ada field yang tidak terisi",
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { username, role } = result.data;

  try {
    await prisma.users.update({
      where: { id },
      data: {
        username,
        role,
      },
    });

    revalidateTag("users");

    return {
      success: true,
      message: "User berhasil diupdate",
    };
  } catch (err) {
    const error = err as Error & {
      code?: string;
      meta?: { target?: string[] };
    };

    if (error.code === "P2002") {
      const targetField = error.meta?.target?.[0] || "data";

      return {
        success: false,
        message: `${targetField} sudah digunakan`,
      };
    }

    console.error("Error updating user:", error);

    return {
      success: false,
      message: "User gagal diupdate (500)",
    };
  }
};


export const deleteUsers = async (id: string) => {
  if (!id) {
    return {
      success: false,
      message: "ID Tidak Terdeteksi",
    };
  }

  try {
    await prisma.users.delete({ where: { id } });

    revalidateTag("users");

    return {
      success: true,
      message: "User Berhasil Dihapus",
    };
  } catch (err) {
    console.log((err as Error).message);

    return {
      success: false,
      message: "User Gagal Dihapus (500)",
    };
  }
};
