import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/public/banners?position=home_carousel|ad_banner
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const position = url.searchParams.get("position") || "";

  const where: Record<string, unknown> = { isActive: true };
  if (position) where.position = position;

  const banners = await db.banner.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      subtitle: true,
      cta: true,
      gradient: true,
      emoji: true,
      position: true,
      sortOrder: true,
    },
  });

  return NextResponse.json({ banners });
}
