import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";

// GET /api/user/lost-found/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireUser();
    const { id } = await params;
    const item = await db.lostFoundItem.findUnique({ where: { id } });
    if (!item || item.ownerId !== session.id) {
      return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// PATCH
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireUser();
    const { id } = await params;
    const existing = await db.lostFoundItem.findUnique({ where: { id } });
    if (!existing || existing.ownerId !== session.id) {
      return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    }
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    for (const k of [
      "title", "status", "category", "categoryLabel", "emoji",
      "description", "location", "district", "date", "timeAgo",
      "reward", "contactName", "contactType",
    ]) {
      if (body[k] !== undefined) data[k] = String(body[k]);
    }
    if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);
    // ویرایش → دوباره در صف تأیید
    data.status_admin = "pending";

    const updated = await db.lostFoundItem.update({ where: { id }, data });
    return NextResponse.json({ success: true, item: updated });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireUser();
    const { id } = await params;
    const existing = await db.lostFoundItem.findUnique({ where: { id } });
    if (!existing || existing.ownerId !== session.id) {
      return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    }
    await db.lostFoundItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
