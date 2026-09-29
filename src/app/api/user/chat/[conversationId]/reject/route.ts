import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";

type Params = { params: Promise<{ conversationId: string }> };

// POST /api/user/chat/[conversationId]/reject — رد درخواست چت
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireUser();
    const { conversationId } = await params;

    const conv = await db.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, status: true, initiatedBy: true, participant1Id: true, participant2Id: true },
    });

    if (!conv) {
      return NextResponse.json({ error: "گفتگو یافت نشد" }, { status: 404 });
    }

    const isP1 = conv.participant1Id === session.id;
    const isP2 = conv.participant2Id === session.id;
    if (!isP1 && !isP2) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    if (conv.initiatedBy === session.id) {
      return NextResponse.json(
        { error: "شما نمی‌توانید درخواست خودتان را رد کنید" },
        { status: 400 }
      );
    }

    // حذف منطقی گفتگو
    await db.conversation.update({
      where: { id: conversationId },
      data: { status: "deleted" },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Reject chat error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
