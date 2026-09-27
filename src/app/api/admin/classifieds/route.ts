import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// GET /api/admin/classifieds — لیست همه آگهی‌ها با فیلتر
export async function GET(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const category = url.searchParams.get("category") || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { location: { contains: search } },
    ];
  }
  if (status && status !== "all") where.status = status;
  if (category && category !== "all") where.category = category;

  const items = await db.classified.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      owner: {
        select: { id: true, name: true, phone: true },
      },
    },
  });

  return NextResponse.json({ items });
}

// POST /api/admin/classifieds — ایجاد آگهی توسط ادمین (در صورت نیاز)
export async function POST(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { title, category, description, price, location } = body;

    if (!title || !category || !description || !price || !location) {
      return NextResponse.json(
        { error: "عنوان، دسته، توضیحات، قیمت و مکان الزامی است" },
        { status: 400 }
      );
    }

    // دریافت قیمت‌گذاری برای دسته
    const pricing = await db.classifiedPricing.findUnique({
      where: { category: String(category) },
    });
    if (!pricing) {
      return NextResponse.json(
        { error: "قیمت‌گذاری برای این دسته تنظیم نشده است" },
        { status: 400 }
      );
    }

    const item = await db.classified.create({
      data: {
        title: String(title),
        category: String(category),
        categoryLabel: pricing.categoryLabel,
        emoji: String(body.emoji || "📦"),
        description: String(description),
        price: String(price),
        location: String(location),
        district: body.district ? String(body.district) : null,
        timeAgo: "همین الان",
        badgeColor: getBadgeColor(String(category)),
        tags: body.tags ? JSON.stringify(body.tags) : null,
        contactName: body.contactName ? String(body.contactName) : null,
        contactPhone: body.contactPhone ? String(body.contactPhone) : null,
        isPaid: false,
        paidAmount: 0,
        plan: "free",
        status: "approved", // آگهی ادمین خودکار تأیید می‌شود
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + pricing.freeDays * 24 * 60 * 60 * 1000),
      },
    });

    await logAdminAction({
      adminId: session.id,
      action: "create",
      resource: "classified",
      resourceId: item.id,
      detail: `ایجاد آگهی: ${title}`,
    });

    return NextResponse.json({ success: true, item });
  } catch (e) {
    console.error("Create classified error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

function getBadgeColor(category: string): string {
  const map: Record<string, string> = {
    electronics: "bg-sky-50 text-sky-700",
    vehicles: "bg-orange-50 text-orange-700",
    realestate: "bg-teal-50 text-teal-700",
    home: "bg-purple-50 text-purple-700",
    services: "bg-amber-50 text-amber-700",
    jobs: "bg-emerald-50 text-emerald-700",
    personal: "bg-rose-50 text-rose-700",
    other: "bg-slate-100 text-slate-700",
  };
  return map[category] || "bg-slate-100 text-slate-700";
}
