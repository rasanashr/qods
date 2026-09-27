import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";

// GET /api/user/lost-found — موارد کاربر
export async function GET(req: NextRequest) {
  try {
    const session = await requireUser();
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "";

    const where: Record<string, unknown> = { ownerId: session.id };
    if (status && status !== "all") where.status_admin = status;

    const items = await db.lostFoundItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ items });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Get lost-found error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// POST /api/user/lost-found — ثبت مورد جدید
export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();
    const body = await req.json();
    const {
      title, status, category, categoryLabel, emoji,
      description, location, district, date, timeAgo,
      reward, contactName, contactType, tags,
    } = body as Record<string, unknown>;

    if (!title || !status || !description) {
      return NextResponse.json(
        { error: "عنوان، وضعیت و توضیحات الزامی است" },
        { status: 400 }
      );
    }

    if (!["lost", "found"].includes(String(status))) {
      return NextResponse.json(
        { error: "وضعیت باید lost یا found باشد" },
        { status: 400 }
      );
    }

    const item = await db.lostFoundItem.create({
      data: {
        title: String(title),
        status: String(status),
        category: String(category || "other"),
        categoryLabel: String(categoryLabel || "سایر"),
        emoji: String(emoji || "📦"),
        description: String(description),
        location: String(location || ""),
        district: String(district || ""),
        date: String(date || new Date().toLocaleDateString("fa-IR")),
        timeAgo: String(timeAgo || "همین الان"),
        reward: reward ? String(reward) : null,
        contactName: String(contactName || ""),
        contactType: String(contactType || "owner"),
        tags: tags ? JSON.stringify(tags) : null,
        status_admin: "pending", // منتظر تأیید ادمین
        ownerId: session.id,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Create lost-found error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
