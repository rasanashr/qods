import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/public/news
export async function GET() {
  const news = await db.newsItem.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      excerpt: true,
      body: true,
      category: true,
      timeAgo: true,
      readTime: true,
      emoji: true,
      accent: true,
    },
  });
  return NextResponse.json({ news });
}
