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
  const existing = await db.banner.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    for (const k of ["title","subtitle","cta","gradient","emoji","position"]) {
      if (body[k] !== undefined) data[k] = String(body[k]);
    }
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;

    const updated = await db.banner.update({ where: { id }, data });
    await logAdminAction({
      adminId: session.id,
      action: "update",
      resource: "banner",
      resourceId: id,
      detail: `به‌روزرسانی بنر: ${existing.title}`,
    });
    return NextResponse.json({ success: true, banner: updated });
  } catch (e) {
    console.error("Update banner error:", e);
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
  const existing = await db.banner.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  await db.banner.delete({ where: { id } });
  await logAdminAction({
    adminId: session.id,
    action: "delete",
    resource: "banner",
    resourceId: id,
    detail: `حذف بنر: ${existing.title}`,
  });
  return NextResponse.json({ success: true });
}
