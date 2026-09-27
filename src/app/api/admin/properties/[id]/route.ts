import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// PATCH /api/admin/properties/[id] — به‌روزرسانی یا تأیید/رد
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.property.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};

    // فیلدهای متنی
    for (const k of [
      "title","typeLabel","dealLabel","price","rent","location","district",
      "timeAgo","emoji","status",
    ]) {
      if (body[k] !== undefined) data[k] = String(body[k]);
    }
    // فیلدهای عددی
    for (const k of ["area","rooms","floor","totalFloors","age"]) {
      if (body[k] !== undefined) data[k] = Number(body[k]);
    }
    if (body.type !== undefined) data.type = String(body.type);
    if (body.deal !== undefined) data.deal = String(body.deal);
    if (body.features !== undefined) data.features = JSON.stringify(body.features);
    if (typeof body.hasParking === "boolean") data.hasParking = body.hasParking;
    if (typeof body.hasElevator === "boolean") data.hasElevator = body.hasElevator;
    if (typeof body.hasBalcony === "boolean") data.hasBalcony = body.hasBalcony;
    if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;

    const updated = await db.property.update({ where: { id }, data });

    await logAdminAction({
      adminId: session.id,
      action: body.status ? "approve" : "update",
      resource: "property",
      resourceId: id,
      detail:
        body.status === "approved"
          ? `تأیید آگهی: ${existing.title}`
          : body.status === "rejected"
          ? `رد آگهی: ${existing.title}`
          : `به‌روزرسانی آگهی: ${existing.title}`,
    });

    return NextResponse.json({ success: true, property: updated });
  } catch (e) {
    console.error("Update property error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// DELETE /api/admin/properties/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.property.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  await db.property.delete({ where: { id } });
  await logAdminAction({
    adminId: session.id,
    action: "delete",
    resource: "property",
    resourceId: id,
    detail: `حذف آگهی: ${existing.title}`,
  });

  return NextResponse.json({ success: true });
}
