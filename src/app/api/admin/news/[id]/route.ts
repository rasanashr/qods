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
  const existing = await db.newsItem.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    for (const k of ["title","excerpt","body","category","timeAgo","readTime","emoji","accent"]) {
      if (body[k] !== undefined) data[k] = String(body[k]);
    }
    if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;

    const updated = await db.newsItem.update({ where: { id }, data });
    await logAdminAction({
      adminId: session.id,
      action: "update",
      resource: "news",
      resourceId: id,
      detail: `به‌روزرسانی خبر: ${existing.title}`,
    });
    return NextResponse.json({ success: true, news: updated });
  } catch (e) {
    console.error("Update news error:", e);
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
  const existing = await db.newsItem.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  await db.newsItem.delete({ where: { id } });
  await logAdminAction({
    adminId: session.id,
    action: "delete",
    resource: "news",
    resourceId: id,
    detail: `حذف خبر: ${existing.title}`,
  });
  return NextResponse.json({ success: true });
}
