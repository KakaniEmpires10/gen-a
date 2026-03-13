import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const subDepartment = await prisma.subDepartment.findMany({
      include: {
        head_member: {
          select: {
            name: true,
            image: true,
            email: true,
          },
        },
        members: {
          where: {
            AND: [
              { department_head: { is: null } },
              { sub_department_head: { is: null } },
              { sub_unit_head: { is: null } },
            ],
          },
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(subDepartment, { status: 200 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code == "P2024") {
        return NextResponse.json(
          { error: "Timed Out, Jaringan Lambat atau Terputus" },
          { status: 504 },
        );
      }

      if (err.code == "P1001") {
        return NextResponse.json(
          {
            error: "Tidak Terhubung ke Database, Jaringan Lambat atau Terputus",
          },
          { status: 503 },
        );
      }
    }

    console.error("Error fetching sub-departments:", (err as Error).message);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server dalam mengambil data sub-departemen",
      },
      { status: 500 },
    );
  }
};
