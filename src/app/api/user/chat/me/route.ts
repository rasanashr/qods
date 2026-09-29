import { NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";
import { generateChatId } from "@/lib/chat-crypto";

// GET /api/user/chat/me — شناسه چت کاربر فعلی
// اگر کاربر شناسه نداشت، یک شناسه جدید تولید و ذخیره می‌کنیم.
export async function GET() {
  try {
    const session = await requireUser();
    let user = await db.appUser.findUnique({
      where: { id: session.id },
      select: { id: true, chatId: true },
    });

    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    if (!user.chatId) {
      // تولید شناسه یکتا با تلاش مجدد در صورت تداخل
      let chatId = generateChatId();
      for (let i = 0; i < 5; i++) {
        const exists = await db.appUser.findUnique({
          where: { chatId },
          select: { id: true },
        });
        if (!exists) break;
        chatId = generateChatId();
      }
      await db.appUser.update({
        where: { id: user.id },
        data: { chatId },
      });
      user = { ...user, chatId };
    }

    return NextResponse.json({
      chatId: user.chatId,
      shareLink: `/chat/${user.chatId}`,
    });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Get chat me error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
