import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/chat-crypto";

// GET /api/user/chat/conversations — لیست گفتگوهای پذیرفته‌شده کاربر فعلی
export async function GET() {
  try {
    const session = await requireUser();

    // گفتگوهایی که کاربر در آن‌ها شرکت‌کننده است
    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { participant1Id: session.id },
          { participant2Id: session.id },
        ],
        status: "accepted",
      },
      orderBy: { lastMessageAt: "desc" },
      include: {
        participant1: { select: { id: true, name: true, phone: true, chatId: true } },
        participant2: { select: { id: true, name: true, phone: true, chatId: true } },
      },
    });

    const items = conversations.map((c) => {
      const isP1 = c.participant1Id === session.id;
      const other = isP1 ? c.participant2 : c.participant1;
      const lastContent = c.lastMessageContent
        ? decrypt(c.lastMessageContent)
        : "";
      return {
        id: c.id,
        status: c.status,
        lastMessageContent: lastContent,
        lastMessageSenderId: c.lastMessageSenderId,
        lastMessageAt: c.lastMessageAt.toISOString(),
        unreadCount: 0, // در ادامه محاسبه می‌شود
        otherUser: {
          id: other.id,
          name: other.name,
          phone: other.phone,
          chatId: other.chatId,
        },
      };
    });

    // شمارش پیام‌های خوانده‌نشده برای هر گفتگو
    const withUnread = await Promise.all(
      items.map(async (it) => {
        const unread = await db.message.count({
          where: {
            conversationId: it.id,
            senderId: { not: session.id },
            isRead: false,
          },
        });
        return { ...it, unreadCount: unread };
      })
    );

    return NextResponse.json({ items: withUnread });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("List conversations error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// POST /api/user/chat/conversations — شروع گفتگو با chatId طرف مقابل
// body: { chatId: string }
export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();
    const body = await req.json();
    const { chatId } = body as { chatId?: string };

    if (!chatId || !chatId.trim()) {
      return NextResponse.json({ error: "شناسه چت الزامی است" }, { status: 400 });
    }

    const normalized = chatId.trim().toLowerCase();

    // پیدا کردن کاربر مقابل با این chatId
    const otherUser = await db.appUser.findFirst({
      where: { chatId: normalized },
      select: { id: true, name: true, phone: true, chatId: true, isBlocked: true },
    });

    if (!otherUser) {
      return NextResponse.json({ error: "کاربری با این شناسه یافت نشد" }, { status: 404 });
    }

    if (otherUser.id === session.id) {
      return NextResponse.json({ error: "نمی‌توانید با خودتان گفتگو کنید" }, { status: 400 });
    }

    // بررسی بلاک بودن در هر دو جهت
    const block1 = await db.chatBlock.findUnique({
      where: {
        blockerId_blockedId: { blockerId: session.id, blockedId: otherUser.id },
      },
    });
    const block2 = await db.chatBlock.findUnique({
      where: {
        blockerId_blockedId: { blockerId: otherUser.id, blockedId: session.id },
      },
    });

    if (block1) {
      return NextResponse.json({ error: "شما این کاربر را بلاک کرده‌اید" }, { status: 400 });
    }
    if (block2) {
      return NextResponse.json({ error: "امکان ارتباط با این کاربر وجود ندارد" }, { status: 400 });
    }

    // بررسی اینکه آیا گفتگو از قبل وجود دارد (در هر دو جهت)
    const existing = await db.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: session.id, participant2Id: otherUser.id },
          { participant1Id: otherUser.id, participant2Id: session.id },
        ],
      },
      select: {
        id: true,
        status: true,
        initiatedBy: true,
      },
    });

    if (existing) {
      // اگر قبلاً حذف شده باشد، آن را مجدداً فعال کنیم
      if (existing.status === "deleted") {
        // اگر حذف توسط خود کاربر فعلی بوده و طرف مقابل هم در ابتدا درخواست کرده بود،
        // اجازهٔ بازفعال‌سازی نمی‌دهیم؛ یک گفتگوی جدید هم ایجاد نمی‌کنیم تا تاریخچه حفظ شود.
        return NextResponse.json({
          conversationId: existing.id,
          status: "deleted",
          existing: true,
          message: "این گفتگو پیش‌تر حذف شده است",
        });
      }
      // اگر بلاک یا پندینگ یا اکسپتد باشد، همان را برمی‌گردانیم
      return NextResponse.json({
        conversationId: existing.id,
        status: existing.status,
        existing: true,
      });
    }

    // ایجاد گفتگوی جدید با وضعیت pending
    const conv = await db.conversation.create({
      data: {
        participant1Id: session.id,
        participant2Id: otherUser.id,
        status: "pending",
        initiatedBy: session.id,
      },
    });

    return NextResponse.json({
      conversationId: conv.id,
      status: "pending",
      existing: false,
      message: "درخواست چت ارسال شد. منتظر تأیید طرف مقابل بمانید.",
    });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Create conversation error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
