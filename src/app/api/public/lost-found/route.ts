import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/public/lost-found
export async function GET() {
  const items = await db.lostFoundItem.findMany({
    where: { isPublished: true, status_admin: "approved" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      category: true,
      categoryLabel: true,
      emoji: true,
      description: true,
      location: true,
      district: true,
      date: true,
      timeAgo: true,
      reward: true,
      contactName: true,
      contactType: true,
      tags: true,
    },
  });

  const formatted = items.map((it) => ({
    ...it,
    tags: it.tags ? JSON.parse(it.tags) : [],
    badgeColor:
      it.status === "lost"
        ? "bg-rose-50 text-rose-700"
        : "bg-emerald-50 text-emerald-700",
  }));

  return NextResponse.json({ items: formatted });
}
