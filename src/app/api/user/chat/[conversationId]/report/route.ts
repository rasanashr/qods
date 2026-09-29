import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";

type Params = { params: Promise<{ conversationId: string }> };

const REASONS = ["spam", "harassment", "inappropriate", "other"];

// POST /api/user/chat/[conversationId]/report — ریپورت گفتگو/کاربر
// body: { reason: string, description?: string }
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireUser();
    const { conversationId } = await params;
    const body = await req.json();
    const { reason, description } = body as {
      reason?: string;
      description?: string;
    };

    if (!reason || !REASONS.includes(reason)) {
      return NextResponse.json({ error: "دلیل نامعتبر است" }, { status: 400 });
    }

    const conv = await db.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, participant1Id: true, participant2Id: true },
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

    // ثبت ریپورت
    await db.chatReport.create({
      data: {
        reporterId: session.id,
        reportedUserId: otherId,
        conversationId,
        reason,
        description: description?.trim() || null,
        status: "pending",
      },
    });

    // علامت‌گذاری همهٔ پیام‌های کاربر مقابل به‌عنوان reported
    await db.message.updateMany({
      where: {
        conversationId,
        senderId: otherId,
      },
      data: { isReported: true },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Report chat error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
