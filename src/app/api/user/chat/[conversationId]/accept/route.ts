import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";

type Params = { params: Promise<{ conversationId: string }> };

// POST /api/user/chat/[conversationId]/accept — پذیرفتن درخواست چت
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

    // فقط کسی که درخواست را شروع نکرده می‌تواند آن را بپذیرد
    if (conv.initiatedBy === session.id) {
      return NextResponse.json(
        { error: "شما نمی‌توانید درخواست خودتان را بپذیرید" },
        { status: 400 }
      );
    }

    if (conv.status !== "pending") {
      return NextResponse.json(
        { error: "این درخواست قبلاً پردازش شده است" },
        { status: 400 }
      );
    }

    await db.conversation.update({
      where: { id: conversationId },
      data: { status: "accepted" },
    });

    return NextResponse.json({ success: true, status: "accepted" });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Accept chat error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
