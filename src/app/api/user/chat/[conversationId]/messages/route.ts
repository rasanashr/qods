import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";
import { encrypt, decrypt, containsUrl } from "@/lib/chat-crypto";

type Params = { params: Promise<{ conversationId: string }> };

// POST /api/user/chat/[conversationId]/messages — ارسال پیام جدید
// body: { content: string, messageType?: "text" | "image" }
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await requireUser();
    const { conversationId } = await params;
    const body = await req.json();
    const { content, messageType } = body as {
      content?: string;
      messageType?: string;
    };

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "محتوای پیام خالی است" }, { status: 400 });
    }

    const conv = await db.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        status: true,
        participant1Id: true,
        participant2Id: true,
      },
    });

    if (!conv) {
      return NextResponse.json({ error: "گفتگو یافت نشد" }, { status: 404 });
    }

    const isP1 = conv.participant1Id === session.id;
    const isP2 = conv.participant2Id === session.id;
    if (!isP1 && !isP2) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    if (conv.status !== "accepted") {
      return NextResponse.json(
        { error: "این گفتگو هنوز تأیید نشده است" },
        { status: 400 }
      );
    }

    const otherId = isP1 ? conv.participant2Id : conv.participant1Id;

    // بررسی اینکه آیا کاربر مقابل ما را بلاک کرده
    const blockedByOther = await db.chatBlock.findUnique({
      where: {
        blockerId_blockedId: { blockerId: otherId, blockedId: session.id },
      },
    });
    if (blockedByOther) {
      return NextResponse.json(
        { error: "امکان ارسال پیام وجود ندارد" },
        { status: 400 }
      );
    }

    const type = messageType === "image" ? "image" : "text";

    // برای متن، بررسی ارسال لینک
    if (type === "text" && containsUrl(content)) {
      return NextResponse.json(
        { error: "ارسال لینک مجاز نیست" },
        { status: 400 }
      );
    }

    // رمزنگاری محتوا
    const encrypted = encrypt(content);

    const msg = await db.message.create({
      data: {
        conversationId,
        senderId: session.id,
        content: encrypted,
        messageType: type,
        isRead: false,
      },
    });

    // به‌روزرسانی آخرین پیام گفتگو
    await db.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: msg.createdAt,
        lastMessageContent: encrypted,
        lastMessageSenderId: session.id,
      },
    });

    return NextResponse.json({
      id: msg.id,
      senderId: msg.senderId,
      content: type === "text" ? decrypt(msg.content) : msg.content,
      messageType: msg.messageType,
      isRead: msg.isRead,
      isReported: msg.isReported,
      createdAt: msg.createdAt.toISOString(),
    });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Send message error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
