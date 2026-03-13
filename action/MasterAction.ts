"use server";

import {
  departmentSchema,
  subDepartmentSchema,
} from "@/components/Features/Dashboard/masters/departments/departments.constant";
import { partnersSchema } from "@/components/Features/Dashboard/masters/partners/partners.constant";
import { deleteFromCloudinary, getPublicIdFromUrl } from "@/lib/cloudinary/image-uploader";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Action Tags
export const addTags = async (name: string) => {
  if (!name) {
    return {
      success: false,
      message: "field tidak diisi dengan lengkap",
    };
  }

  try {
    await prisma.tags.create({
      data: { name },
    });

    return {
      success: true,
      message: "Tag berhasil ditambahkan",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Gagal menambah tags (500)",
    };
  }
};

export const updateTags = async (id: string, name: string) => {
  if (!id) {
    return {
      success: false,
      message: "Id Tidak Ditemukan",
    };
  }

  if (!name) {
    return {
      success: false,
      message: "field tidak diisi dengan lengkap",
    };
  }

  try {
    await prisma.tags.update({
      where: {
        id,
      },
      data: { name },
    });

    return {
      success: true,
      message: "Tag berhasil ditambahkan",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Gagal menambah tags (500)",
    };
  }
};

export const deleteTags = async (id: string) => {
  if (!id) {
    return {
      success: false,
      message: "Id Tidak Ditemukan",
    };
  }

  try {
    await prisma.tags.delete({ where: { id } });

    return {
      success: true,
      message: "Tags Berhasil Dihapus",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Tags Gagal Dihapus (500)",
    };
  }
};

// Action Parters
export const addPartners = async (values: z.infer<typeof partnersSchema>) => {
  try {
    await prisma.partners.create({
      data: {
        name: values.name,
        abbreviation: values.abbr,
        image: values.img,
        website: values.website,
      },
    });

    return {
      success: true,
      message: "Mitra Berhasil Ditambahkan",
    };
  } catch (err) {
    console.log(err);

    if (values.img) {
      const publicId = getPublicIdFromUrl(values.img);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch(err =>
          console.error("Cloudinary Cleanup Failed:", err),
        );
      }
    }

    return {
      success: false,
      message: "Mitra Gagal Ditambahkan (500)",
    };
  }
};

export const updatePartners = async (
  id: string,
  values: z.infer<typeof partnersSchema>
) => {
  if (!id) {
    return {
      success: false,
      message: "Id Tidak Ditemukan",
    };
  }

  try {
    const existingPartnerImg = await prisma.partners.findUnique({
      where: { id },
      select: { image: true },
    });

    const updatedPartner = await prisma.partners.update({
      where: { id },
      data: {
        name: values.name,
        abbreviation: values.abbr,
        ...(values.img && { image: values.img }), 
        website: values.website || undefined,
      },
    });

    if (existingPartnerImg && existingPartnerImg.image !== updatedPartner.image) {
      const publicId = getPublicIdFromUrl(existingPartnerImg.image);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch((err) =>
          console.error("Cloudinary Cleanup Failed:", err)
        );
      }
    }

    return {
      success: true,
      message: "Mitra Berhasil Diperbaharui",
    };
  } catch (err) {
    console.log(err);

    if (values.img) {
      const publicId = getPublicIdFromUrl(values.img);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch((err) =>
          console.error("Cloudinary Cleanup Failed:", err)
        );
      }
    }

    return {
      success: false,
      message: "Mitra Gagal Diperbaharui (500)",
    };
  }
};

export const deletePartners = async (id: string) => {
  if (!id) return { success: false, message: "Id Tidak Ditemukan" };

  try {
    const partner = await prisma.partners.findUnique({
      where: { id },
      select: { image: true },
    });

    if (!partner) return { success: false, message: "Mitra tidak ditemukan" };

    await prisma.partners.delete({ where: { id } });

    if (partner.image) {
      const publicId = getPublicIdFromUrl(partner.image);
      if (publicId) {
          deleteFromCloudinary(publicId).catch(err =>
          console.error("Cloudinary Cleanup Failed:", err),
        );
      }
    }

    return {
      success: true,
      message: "Mitra Berhasil Dihapus",
    };
  } catch (err) {
    console.error("Delete Partner Error:", err);
    return {
      success: false,
      message: "Gagal menghapus mitra dari database",
    };
  }
};

// Action Departments
export const addDph = async (values: z.infer<typeof departmentSchema>) => {
  try {
    await prisma.department.create({
      data: {
        name: values.name,
        description: values.description,
      },
    });

    return {
      success: true,
      message: "DPH Berhasil Ditambahkan",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "DPH Gagal Ditambahkan",
    };
  }
};

export const updateDph = async (
  id: string,
  values: z.infer<typeof departmentSchema>
) => {
  if (!id) return { success: false, message: "DPH Tidak Ditemukan" };

  try {
    await prisma.department.update({
      where: { id },
      data: {
        name: values.name,
        description: values.description,
      },
    });

    return {
      success: true,
      message: "DPH Berhasil Diupdate",
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "DPH Gagal Diupdate",
    };
  }
};

export const deleteDph = async (id: string) => {
  if (!id) return { success: false, message: "DPH Tidak Ditemukan" };

  try {
    await prisma.department.delete({
      where: { id },
    });

    return {
      success: true,
      message: "DPH Berhasil Dihapus",
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "DPH Gagal Dihapus",
    };
  }
};

export const addDepartment = async (
  values: z.infer<typeof subDepartmentSchema>
) => {
  try {
    await prisma.subDepartment.create({
      data: {
        name: values.name,
        description: values.description,
        departmentId: values.departmentId
      },
    });

    return {
      success: true,
      message: "Departemen Berhasil Ditambahkan",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Departemen Gagal Ditambahkan",
    };
  }
};

export const updateDepartment = async (
  id: string,
  values: z.infer<typeof subDepartmentSchema>
) => {
  if (!id) return { success: false, message: "Departemen Tidak Ditemukan" };

  try {
    await prisma.subDepartment.update({
      where: { id },
      data: {
        name: values.name,
        description: values.description,
        departmentId: values.departmentId
      },
    });

    return {
      success: true,
      message: "Departemen Berhasil Diupdate",
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "Departemen Gagal Diupdate",
    };
  }
};

export const updateDeptHead = async (subDeptId: string, memberId: string | null) => {
  try {
    // Validasi jika headMemberId diset
    if (memberId) {
      const member = await prisma.member.findUnique({
        where: { id: memberId },
        include: {
          department_head: true,
          sub_department_head: true,
          sub_unit_head: true,
        },
      });

      if (!member) {
        return {
          success: false,
          message: "Anggota tidak ditemukan",
          error: "MEMBER_NOT_FOUND",
        };
      }

      // Check jika member tidak aktif
      if (!member.isActive) {
        return {
          success: false,
          message: "Anggota tidak aktif",
          error: "MEMBER_INACTIVE",
        };
      }

      // Check jika member sudah jadi ketua di tempat lain
      if (member.department_head) {
        return {
          success: false,
          message: "Anggota sudah menjadi ketua departemen",
          error: "ALREADY_DEPARTMENT_HEAD",
        };
      }

      if (
        member.sub_department_head &&
        member.sub_department_head.id !== subDeptId
      ) {
        return {
          success: false,
          message: "Anggota sudah menjadi ketua sub departemen lain",
          error: "ALREADY_SUB_DEPARTMENT_HEAD",
        };
      }

      if (member.sub_unit_head) {
        return {
          success: false,
          message: "Anggota sudah menjadi ketua sub unit",
          error: "ALREADY_SUB_UNIT_HEAD",
        };
      }

      // Check jika member bukan bagian dari sub department ini
      if (member.subDepartmentId !== subDeptId) {
        return {
          success: false,
          message: "Anggota bukan bagian dari sub departemen ini",
          error: "MEMBER_NOT_IN_SUB_DEPARTMENT",
        };
      }
    }

    // Update sub department
    await prisma.subDepartment.update({
      where: { id: subDeptId },
      data: {
        headMemberId: memberId,
      },
    });

    return {
      success: true,
      message: memberId
        ? "Ketua berhasil diatur"
        : "Ketua berhasil dihapus",
    };
  } catch (error) {
    console.error("Error updating sub-department head:", error);
    return {
      success: false,
      message: "Gagal mengupdate ketua Departemen",
      error: (error as Error).message,
    };
  }
}

export const deleteDeptHead = async (subDeptId: string) => {
  return updateDeptHead(subDeptId, null);
}

export const deleteDept = async (id: string) => {
  if (!id) return { success: false, message: "Departemen Tidak Ditemukan" };

  try {
    await prisma.subDepartment.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Departemen Berhasil Dihapus",
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      message: "Departemen Gagal Dihapus",
    };
  }
};
