import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// GET /api/admin/sama137/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const request = await db.sama137Request.findUnique({ where: { id } });
  if (!request) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ request });
}

// PATCH /api/admin/sama137/[id] — تغییر وضعیت/اولویت
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.sama137Request.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};

    for (const k of ["status","statusLabel","priority","priorityLabel","referenceUnit","assignedTo"]) {
      if (body[k] !== undefined) data[k] = String(body[k]);
    }
    if (body.timeline !== undefined) data.timeline = JSON.stringify(body.timeline);
    if (body.updatedAt !== undefined) data.updatedAt = String(body.updatedAt);

    const updated = await db.sama137Request.update({ where: { id }, data });

    await logAdminAction({
      adminId: session.id,
      action: "update",
      resource: "sama137_request",
      resourceId: id,
      detail: `به‌روزرسانی درخواست ۱۳۷: ${existing.trackingCode}`,
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (e) {
    console.error("Update sama137 error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// DELETE /api/admin/sama137/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.sama137Request.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  await db.sama137Request.delete({ where: { id } });
  await logAdminAction({
    adminId: session.id,
    action: "delete",
    resource: "sama137_request",
    resourceId: id,
    detail: `حذف درخواست: ${existing.trackingCode}`,
  });
  return NextResponse.json({ success: true });
}
