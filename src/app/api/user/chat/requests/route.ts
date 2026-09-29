import { NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";

// GET /api/user/chat/requests — لیست درخواست‌های چت در انتظار تأیید
// گفتگوهایی که initiatedBy برابر کاربر فعلی نیست و وضعیت pending است.
export async function GET() {
  try {
    const session = await requireUser();

    // گفتگوهایی که کاربر در آن‌ها participant2 (یعنی گیرندهٔ درخواست) است
    // یا به طور کلی، طرفی که initiatedBy او نیست و وضعیت pending است.
    const conversations = await db.conversation.findMany({
      where: {
        status: "pending",
        initiatedBy: { not: session.id },
        OR: [
          { participant1Id: session.id },
          { participant2Id: session.id },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        participant1: { select: { id: true, name: true, phone: true, chatId: true } },
        participant2: { select: { id: true, name: true, phone: true, chatId: true } },
      },
    });

    const items = conversations.map((c) => {
      const requester = c.participant1Id === session.id ? c.participant2 : c.participant1;
      return {
        id: c.id,
        createdAt: c.createdAt.toISOString(),
        requester: {
          id: requester.id,
          name: requester.name,
          phone: requester.phone,
          chatId: requester.chatId,
        },
      };
    });

    return NextResponse.json({ items });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("List chat requests error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
