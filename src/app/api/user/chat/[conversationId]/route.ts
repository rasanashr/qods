import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/chat-crypto";

type Params = { params: Promise<{ conversationId: string }> };

// GET /api/user/chat/[conversationId] — جزئیات گفتگو + همهٔ پیام‌ها (رمزگشایی شده)
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireUser();
    const { conversationId } = await params;

    const conv = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participant1: { select: { id: true, name: true, phone: true, chatId: true } },
        participant2: { select: { id: true, name: true, phone: true, chatId: true } },
      },
    });

    if (!conv) {
      return NextResponse.json({ error: "گفتگو یافت نشد" }, { status: 404 });
    }

    // بررسی اینکه کاربر در این گفتگو شرکت‌کننده است
    const isP1 = conv.participant1Id === session.id;
    const isP2 = conv.participant2Id === session.id;
    if (!isP1 && !isP2) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const otherUser = isP1 ? conv.participant2 : conv.participant1;

    // فقط گفتگوهای accepted اجازهٔ مشاهده دارند (مگر pending برای ابتدای کار)
    if (conv.status !== "accepted" && conv.status !== "pending") {
      return NextResponse.json(
        { error: "این گفتگو در دسترس نیست", status: conv.status },
        { status: 400 }
      );
    }

    // دریافت همهٔ پیام‌ها به ترتیب زمانی
    const messages = await db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    // علامت‌گذاری پیام‌های دریافتی به‌عنوان خوانده‌شده
    await db.message.updateMany({
      where: {
        conversationId,
        senderId: { not: session.id },
        isRead: false,
      },
      data: { isRead: true },
    });

    const decryptedMessages = messages.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      content: m.messageType === "text" ? decrypt(m.content) : m.content,
      messageType: m.messageType,
      isRead: m.isRead,
      isReported: m.isReported,
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json({
      conversation: {
        id: conv.id,
        status: conv.status,
        initiatedBy: conv.initiatedBy,
        lastMessageAt: conv.lastMessageAt.toISOString(),
        createdAt: conv.createdAt.toISOString(),
      },
      messages: decryptedMessages,
      otherUser,
      currentUserId: session.id,
    });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Get conversation error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// DELETE /api/user/chat/[conversationId] — حذف گفتگو (تغییر وضعیت به deleted)
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await requireUser();
    const { conversationId } = await params;

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

    await db.conversation.update({
      where: { id: conversationId },
      data: { status: "deleted" },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Delete conversation error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
