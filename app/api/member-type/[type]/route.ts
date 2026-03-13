import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { type: string } },
) => {
  try {
    const { type } = params;

    if (!["subunit", "external", "internal"].includes(type)) {
      return NextResponse.json(
        { error: "Type tidak valid" },
        { status: 400 },
      );
    }

    if (type == "subunit") {
      const subUnit = await prisma.subUnit.findMany({
        select: {
          id: true,
          name: true,
          abbreviation: true,
          logo: true,
        },
      });

      return NextResponse.json(subUnit, { status: 200 });
    } else if (type == "external") {
      const external = await prisma.subDepartment.findMany({
        where: {
          department: { name: { contains: "eksternal", mode: "insensitive" } },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return NextResponse.json(external, { status: 200 });
    } else if (type == "internal") {
      const internal = await prisma.subDepartment.findMany({
        where: {
          department: { name: { contains: "internal", mode: "insensitive" } },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return NextResponse.json(internal, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 },
      );
    }
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
    console.log("failed to fetch member type data:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server dalam mengambil data member type" },
      { status: 500 },
    );
  }
};
