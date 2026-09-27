import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// PATCH /api/admin/classifieds/categories/[id] — ویرایش دسته
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.classifiedPricing.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};

    if (body.categoryLabel !== undefined) data.categoryLabel = String(body.categoryLabel);
    if (body.freeDays !== undefined) data.freeDays = Number(body.freeDays);
    if (body.featuredPrice !== undefined) data.featuredPrice = Number(body.featuredPrice);
    if (body.urgentPrice !== undefined) data.urgentPrice = Number(body.urgentPrice);
    if (body.featuredDays !== undefined) data.featuredDays = Number(body.featuredDays);
    if (body.urgentDays !== undefined) data.urgentDays = Number(body.urgentDays);
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;

    const updated = await db.classifiedPricing.update({ where: { id }, data });

    await logAdminAction({
      adminId: session.id,
      action: "update",
      resource: "classified_category",
      resourceId: id,
      detail: `به‌روزرسانی دسته: ${existing.categoryLabel}`,
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (e) {
    console.error("Update category error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// DELETE /api/admin/classifieds/categories/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.classifiedPricing.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  // بررسی اینکه آگهی‌ای به این دسته وابسته است
  const dependentClassifieds = await db.classified.count({
    where: { category: existing.category },
  });
  if (dependentClassifieds > 0) {
    return NextResponse.json(
      { error: `این دسته به ${dependentClassifieds.toLocaleString("fa-IR")} آگهی وابسته است و قابل حذف نیست` },
      { status: 400 }
    );
  }

  await db.classifiedPricing.delete({ where: { id } });
  await logAdminAction({
    adminId: session.id,
    action: "delete",
    resource: "classified_category",
    resourceId: id,
    detail: `حذف دسته: ${existing.categoryLabel}`,
  });

  return NextResponse.json({ success: true });
}
