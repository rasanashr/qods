import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

export async function GET(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [{ title: { contains: search } }, { location: { contains: search } }];
  }
  if (status && status !== "all") where.status_admin = status;

  const items = await db.lostFoundItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { title, status, category, description, location } = body;
    if (!title || !status || !description) {
      return NextResponse.json(
        { error: "عنوان، وضعیت و توضیحات الزامی است" },
        { status: 400 }
      );
    }

    const item = await db.lostFoundItem.create({
      data: {
        title: String(title),
        status: String(status),
        category: String(category || "other"),
        categoryLabel: String(body.categoryLabel || "سایر"),
        emoji: String(body.emoji || "📦"),
        description: String(description),
        location: String(location || ""),
        district: String(body.district || ""),
        date: String(body.date || ""),
        timeAgo: String(body.timeAgo || "همین الان"),
        reward: body.reward ? String(body.reward) : null,
        contactName: String(body.contactName || ""),
        contactType: String(body.contactType || "owner"),
        tags: body.tags ? JSON.stringify(body.tags) : null,
        status_admin: String(body.status_admin || "approved"),
        isPublished: true,
      },
    });

    await logAdminAction({
      adminId: session.id,
      action: "create",
      resource: "lost_found",
      resourceId: item.id,
      detail: `ایجاد مورد اشیاء گمشده: ${title}`,
    });

    return NextResponse.json({ success: true, item });
  } catch (e) {
    console.error("Create lost-found error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
