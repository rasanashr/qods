import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";

// GET /api/user/sama137/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireUser();
    const { id } = await params;
    const request = await db.sama137Request.findUnique({ where: { id } });
    if (!request || request.requesterId !== session.id) {
      return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    }
    return NextResponse.json({ request });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// DELETE — فقط اگر pending باشد کاربر می‌تواند لغو کند
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireUser();
    const { id } = await params;
    const existing = await db.sama137Request.findUnique({ where: { id } });
    if (!existing || existing.requesterId !== session.id) {
      return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    }
    if (existing.status !== "pending") {
      return NextResponse.json(
        { error: "فقط درخواست‌های در انتظار قابل لغو هستند" },
        { status: 400 }
      );
    }
    await db.sama137Request.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
