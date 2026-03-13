import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const tags = await prisma.tags.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            news_tags: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(tags, { status: 200 });
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
    console.error("Error fetching Tags:", (err as Error).message);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan server dalam mengambil data tags",
      },
      { status: 500 },
    );
  }
};
