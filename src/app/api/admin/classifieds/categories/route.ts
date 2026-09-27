import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// GET /api/admin/classifieds/categories — لیست همه دسته‌بندی‌ها
export async function GET() {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const categories = await db.classifiedPricing.findMany({
    orderBy: { categoryLabel: "asc" },
  });

  return NextResponse.json({ categories });
}

// POST /api/admin/classifieds/categories — ایجاد دسته‌بندی جدید
export async function POST(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { category, categoryLabel } = body;

    if (!category || !categoryLabel) {
      return NextResponse.json(
        { error: "کلید دسته و نام نمایشی الزامی است" },
        { status: 400 }
      );
    }

    // بررسی تکراری نبودن
    const existing = await db.classifiedPricing.findUnique({
      where: { category: String(category) },
    });
    if (existing) {
      return NextResponse.json(
        { error: "این کلید دسته قبلاً استفاده شده است" },
        { status: 409 }
      );
    }

    const created = await db.classifiedPricing.create({
      data: {
        category: String(category),
        categoryLabel: String(categoryLabel),
        freeDays: Number(body.freeDays) || 7,
        featuredPrice: Number(body.featuredPrice) || 50000,
        urgentPrice: Number(body.urgentPrice) || 25000,
        featuredDays: Number(body.featuredDays) || 30,
        urgentDays: Number(body.urgentDays) || 14,
        isActive: body.isActive !== false,
      },
    });

    await logAdminAction({
      adminId: session.id,
      action: "create",
      resource: "classified_category",
      resourceId: created.id,
      detail: `ایجاد دسته: ${categoryLabel} (${category})`,
    });

    return NextResponse.json({ success: true, category: created });
  } catch (e) {
    console.error("Create category error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
