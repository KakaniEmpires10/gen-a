import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Query params
    const noUser = searchParams.get("noUser") === "true";
    const search = searchParams.get("search") || "";
    const simple = searchParams.get("simple") === "true";

    const members = await prisma.member.findMany({
      where: {
        // Filter member yang belum punya user account
        ...(noUser && {
          users: null,
        }),
        // Search filter
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
      },

      select: simple
        ? {
            // Data minimal untuk form register
            id: true,
            name: true,
            email: true,
            gender: true,
            image: true,
          }
        : {
            // Data lengkap untuk list member
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

    return NextResponse.json(members, { status: 200 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code == "P2024") {
        return NextResponse.json(
          { error: "Timed Out, Jaringan Lambat atau Terputus" },
          { status : 504 }
        )
      }

      if (err.code == "P1001") {
        return NextResponse.json(
          { error: "Tidak Terhubung ke Database, Jaringan Lambat atau Terputus" },
          { status: 503 }
        );
      }
    }

    console.error("Error fetching members:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server dalam mengambil data anggota" },
      { status: 500 }
    );
  }
}