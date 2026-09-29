import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";

type Params = { params: Promise<{ conversationId: string }> };

// POST /api/user/chat/[conversationId]/block — بلاک کردن کاربر مقابل در این گفتگو
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireUser();
    const { conversationId } = await params;

    const conv = await db.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, status: true, participant1Id: true, participant2Id: true },
    });

    if (!conv) {
      return NextResponse.json({ error: "گفتگو یافت نشد" }, { status: 404 });
    }

    const isP1 = conv.participant1Id === session.id;
    const isP2 = conv.participant2Id === session.id;
    if (!isP1 && !isP2) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const otherId = isP1 ? conv.participant2Id : conv.participant1Id;

    // ثبت بلاک (اگر قبلاً ثبت نشده باشد)
    const existing = await db.chatBlock.findUnique({
      where: {
        blockerId_blockedId: { blockerId: session.id, blockedId: otherId },
      },
    });
    if (!existing) {
      await db.chatBlock.create({
        data: { blockerId: session.id, blockedId: otherId },
      });
    }

    // تغییر وضعیت گفتگو به blocked
    await db.conversation.update({
      where: { id: conversationId },
      data: { status: "blocked" },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Block user error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
