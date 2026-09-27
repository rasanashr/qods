import { NextRequest, NextResponse } from "next/server";
import { requireUser, recordWalletTransaction } from "@/lib/user-auth";
import { db } from "@/lib/db";

const CATEGORIES = [
  "electronics", "vehicles", "realestate", "home",
  "services", "jobs", "personal", "other",
];

// GET /api/user/classifieds — آگهی‌های کاربر فعلی
export async function GET(req: NextRequest) {
  try {
    const session = await requireUser();
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "";

    const where: Record<string, unknown> = { ownerId: session.id };
    if (status && status !== "all") where.status = status;

    const items = await db.classified.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ items });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Get classifieds error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// POST /api/user/classifieds — ثبت آگهی جدید
// body: { title, category, description, price, location, district?, plan, contactName?, contactPhone?, tags? }
export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();
    const body = await req.json();
    const {
      title, category, description, price, location,
      district, plan, contactName, contactPhone, tags, emoji,
    } = body as Record<string, unknown>;

    // اعتبارسنجی
    if (!title || !category || !description || !price || !location) {
      return NextResponse.json(
        { error: "عنوان، دسته، توضیحات، قیمت و مکان الزامی است" },
        { status: 400 }
      );
    }

    if (!CATEGORIES.includes(String(category))) {
      return NextResponse.json(
        { error: "دسته‌بندی نامعتبر است" },
        { status: 400 }
      );
    }

    const planType = (plan as string) || "free";
    if (!["free", "featured", "urgent"].includes(planType)) {
      return NextResponse.json(
        { error: "طرح نامعتبر است. یکی از free، featured یا urgent" },
        { status: 400 }
      );
    }

    // دریافت قیمت‌گذاری
    const pricing = await db.classifiedPricing.findUnique({
      where: { category: String(category) },
    });
    if (!pricing) {
      return NextResponse.json(
        { error: "قیمت‌گذاری برای این دسته تنظیم نشده است" },
        { status: 500 }
      );
    }

    let paidAmount = 0;
    let days = pricing.freeDays;

    if (planType === "featured") {
      paidAmount = pricing.featuredPrice;
      days = pricing.featuredDays;
    } else if (planType === "urgent") {
      paidAmount = pricing.urgentPrice;
      days = pricing.urgentDays;
    }

    // اگر پولی است، از کیف پول کم کنیم
    if (paidAmount > 0) {
      const result = await recordWalletTransaction({
        userId: session.id,
        type: "spend",
        amount: -paidAmount,
        description: `پرداخت برای آگهی ${planType === "featured" ? "ویژه" : "فوری"}`,
        reference: `classified-${Date.now()}`,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "خطا در پرداخت از کیف پول" },
          { status: 400 }
        );
      }
    }

    // ایجاد آگهی
    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const classified = await db.classified.create({
      data: {
        title: String(title),
        category: String(category),
        categoryLabel: pricing.categoryLabel,
        emoji: String(emoji || "📦"),
        description: String(description),
        price: String(price),
        location: String(location),
        district: district ? String(district) : null,
        timeAgo: "همین الان",
        badgeColor: getBadgeColor(String(category)),
        tags: tags ? JSON.stringify(tags) : null,
        contactName: contactName ? String(contactName) : null,
        contactPhone: contactPhone ? String(contactPhone) : null,
        isPaid: paidAmount > 0,
        paidAmount,
        plan: planType,
        status: "pending", // منتظر تأیید ادمین
        expiresAt,
      },
    });

    // اتصال به مالک
    await db.classified.update({
      where: { id: classified.id },
      data: { ownerId: session.id },
    });

    return NextResponse.json({
      success: true,
      classified: await db.classified.findUnique({
        where: { id: classified.id },
      }),
      paidAmount,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
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
