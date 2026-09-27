import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// PATCH /api/admin/restaurants/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.restaurant.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};

    for (const k of [
      "name","category","categoryEmoji","coverGradient","description",
      "reviewCount","deliveryTime","deliveryFee","minOrder",
    ]) {
      if (body[k] !== undefined) data[k] = String(body[k]);
    }
    if (body.rating !== undefined) data.rating = Number(body.rating);
    if (body.discount !== undefined) data.discount = body.discount ? Number(body.discount) : null;
    if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);
    if (typeof body.isOpen === "boolean") data.isOpen = body.isOpen;
    if (typeof body.featured === "boolean") data.featured = body.featured;
    if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;

    const updated = await db.restaurant.update({ where: { id }, data });

    await logAdminAction({
      adminId: session.id,
      action: "update",
      resource: "restaurant",
      resourceId: id,
      detail: `به‌روزرسانی رستوران: ${existing.name}`,
    });

    return NextResponse.json({ success: true, restaurant: updated });
  } catch (e) {
    console.error("Update restaurant error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// DELETE /api/admin/restaurants/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.restaurant.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  await db.restaurant.delete({ where: { id } });
  await logAdminAction({
    adminId: session.id,
    action: "delete",
    resource: "restaurant",
    resourceId: id,
    detail: `حذف رستوران: ${existing.name}`,
  });

  return NextResponse.json({ success: true });
}
