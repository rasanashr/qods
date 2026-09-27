import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/public/classifieds — آگهی‌های تأیید شده و منقضی‌نشده
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category") || "";

  const where: Record<string, unknown> = {
    status: "approved",
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
  };
  if (category && category !== "all") where.category = category;

  const items = await db.classified.findMany({
    where,
    orderBy: [
      { isPaid: "desc" }, // آگهی‌های پولی اول
      { publishedAt: "desc" },
    ],
    take: 100,
    select: {
      id: true,
      title: true,
      category: true,
      categoryLabel: true,
      emoji: true,
      description: true,
      price: true,
      location: true,
      district: true,
      timeAgo: true,
      badgeColor: true,
      tags: true,
      isPaid: true,
      plan: true,
      contactName: true,
      contactPhone: true,
      publishedAt: true,
    },
  });

  const formatted = items.map((it) => ({
    ...it,
    tags: it.tags ? JSON.parse(it.tags) : [],
    publishedAt: it.publishedAt?.toISOString() || null,
  }));

  return NextResponse.json({ items: formatted });
}
