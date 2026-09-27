import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";

// GET /api/user/classifieds/[id] — یک آگهی کاربر
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireUser();
    const { id } = await params;
    const classified = await db.classified.findUnique({ where: { id } });
    if (!classified || classified.ownerId !== session.id) {
      return NextResponse.json({ error: "آگهی یافت نشد" }, { status: 404 });
    }
    return NextResponse.json({ classified });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Get classified error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// PATCH /api/user/classifieds/[id] — ویرایش آگهی
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireUser();
    const { id } = await params;
    const existing = await db.classified.findUnique({ where: { id } });
    if (!existing || existing.ownerId !== session.id) {
      return NextResponse.json({ error: "آگهی یافت نشد" }, { status: 404 });
    }

    // اگر آگهی رد شده باشد، بعد از ویرایش دوباره pending می‌شود
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};

    for (const k of ["title", "description", "price", "location", "district", "contactName", "contactPhone"]) {
      if (body[k] !== undefined) data[k] = String(body[k]);
    }
    if (body.emoji !== undefined) data.emoji = String(body.emoji);
    if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);

    // ویرایش، آگهی را دوباره در صف تأیید می‌گذارد
    data.status = "pending";
    data.rejectionReason = null;

    const updated = await db.classified.update({ where: { id }, data });

    return NextResponse.json({ success: true, classified: updated });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Update classified error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// DELETE /api/user/classifieds/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireUser();
    const { id } = await params;
    const existing = await db.classified.findUnique({ where: { id } });
    if (!existing || existing.ownerId !== session.id) {
      return NextResponse.json({ error: "آگهی یافت نشد" }, { status: 404 });
    }

    await db.classified.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Delete classified error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
