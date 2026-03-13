import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  context: { params: { id: string } },
) => {
  const { id } = context.params;

  try {
    const subUnit = await prisma.subUnit.findFirst({ where: { id } });

    return NextResponse.json(subUnit, { status: 200 });
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
    console.error(
      "Error fetching sub-unit " + id + " : ",
      (err as Error).message,
    );

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server dalam mengambil data sub-unit",
      },
      { status: 500 },
    );
  }
};
