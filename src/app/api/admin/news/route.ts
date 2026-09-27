import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

export async function GET(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const where: Record<string, unknown> = {};
  if (search) where.title = { contains: search };

  const news = await db.newsItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ news });
}

export async function POST(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { title, excerpt } = body;
    if (!title || !excerpt) {
      return NextResponse.json(
        { error: "عنوان و خلاصه الزامی است" },
        { status: 400 }
      );
    }

    const news = await db.newsItem.create({
      data: {
        title: String(title),
        excerpt: String(excerpt),
        body: String(body.body || ""),
        category: String(body.category || "شهری"),
        timeAgo: String(body.timeAgo || "همین الان"),
        readTime: String(body.readTime || "۲ دقیقه"),
        emoji: String(body.emoji || "📰"),
        accent: String(body.accent || "bg-primary"),
        isPublished: body.isPublished !== false,
      },
    });

    await logAdminAction({
      adminId: session.id,
      action: "create",
      resource: "news",
      resourceId: news.id,
      detail: `ایجاد خبر: ${title}`,
    });

    return NextResponse.json({ success: true, news });
  } catch (e) {
    console.error("Create news error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
