import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");
    const newsId = searchParams.get("newsId"); // For edit mode

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const existing = await prisma.news.findUnique({
      where: { slug },
      select: { id: true },
    });

    // If editing, exclude current news from validation
    if (existing && existing.id !== newsId) {
      return NextResponse.json({ available: false, exists: true });
    }

    return NextResponse.json({ available: true, exists: false });
  } catch (error) {
    console.error("Error validating slug:", error);
    return NextResponse.json(
      { error: "Gagal memvalidasi slug" },
      { status: 500 }
    );
  }
}