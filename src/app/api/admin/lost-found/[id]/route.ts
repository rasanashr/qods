import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.lostFoundItem.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    for (const k of [
      "title","status","category","categoryLabel","emoji","description",
      "location","district","date","timeAgo","reward","contactName",
      "contactType","status_admin",
    ]) {
      if (body[k] !== undefined) data[k] = String(body[k]);
    }
    if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);
    if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;

    const updated = await db.lostFoundItem.update({ where: { id }, data });
    await logAdminAction({
      adminId: session.id,
      action: body.status_admin === "approved" ? "approve" : body.status_admin === "rejected" ? "reject" : "update",
      resource: "lost_found",
      resourceId: id,
      detail: `به‌روزرسانی مورد: ${existing.title}`,
    });
    return NextResponse.json({ success: true, item: updated });
  } catch (e) {
    console.error("Update lost-found error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.lostFoundItem.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  await db.lostFoundItem.delete({ where: { id } });
  await logAdminAction({
    adminId: session.id,
    action: "delete",
    resource: "lost_found",
    resourceId: id,
    detail: `حذف مورد: ${existing.title}`,
  });
  return NextResponse.json({ success: true });
}
