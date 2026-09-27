import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// GET /api/admin/classifieds/[id] — جزئیات یک آگهی
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const item = await db.classified.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true, phone: true, joinedAt: true },
      },
    },
  });

  if (!item) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  return NextResponse.json({ item });
}

// PATCH /api/admin/classifieds/[id] — تأیید/رد/ویرایش
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.classified.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};

    // ویرایش فیلدها
    for (const k of [
      "title", "categoryLabel", "description", "price", "location",
      "district", "timeAgo", "emoji", "contactName", "contactPhone",
    ]) {
      if (body[k] !== undefined) data[k] = String(body[k]);
    }
    if (body.category !== undefined) data.category = String(body.category);
    if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);

    // تغییر وضعیت
    if (body.status !== undefined) {
      data.status = String(body.status);
      if (body.status === "approved" && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
    }
    if (body.rejectionReason !== undefined) {
      data.rejectionReason = body.rejectionReason ? String(body.rejectionReason) : null;
    }

    const updated = await db.classified.update({ where: { id }, data });

    await logAdminAction({
      adminId: session.id,
      action:
        body.status === "approved" ? "approve"
        : body.status === "rejected" ? "reject"
        : "update",
      resource: "classified",
      resourceId: id,
      detail:
        body.status === "approved" ? `تأیید آگهی: ${existing.title}`
        : body.status === "rejected" ? `رد آگهی: ${existing.title}`
        : `به‌روزرسانی آگهی: ${existing.title}`,
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (e) {
    console.error("Update classified error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// DELETE /api/admin/classifieds/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.classified.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  await db.classified.delete({ where: { id } });
  await logAdminAction({
    adminId: session.id,
    action: "delete",
    resource: "classified",
    resourceId: id,
    detail: `حذف آگهی: ${existing.title}`,
  });

  return NextResponse.json({ success: true });
}
