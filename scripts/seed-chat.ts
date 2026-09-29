// Seed برای پیامرسان شبکه قدس
// - تنظیم chatId برای کاربران نمونه
// - ایجاد یک گفتگوی تأییدشده با چند پیام رمزنگاری‌شده
// - ایجاد یک درخواست چت در انتظار تأیید
//
// اجرا: bun run scripts/seed-chat.ts

import { db } from "../src/lib/db";
import { encrypt } from "../src/lib/chat-crypto";

async function upsertUserByPhone(phone: string, name: string, chatId: string) {
  const existing = await db.appUser.findUnique({ where: { phone } });
  if (existing) {
    // آپدیت chatId و name
    return await db.appUser.update({
      where: { id: existing.id },
      data: {
        name: existing.name || name,
        chatId,
        isVerified: true,
      },
    });
  }
  // ایجاد کاربر جدید
  return await db.appUser.create({
    data: { phone, name, chatId, isVerified: true },
  });
}

async function main() {
  console.log("🌱 شروع seed پیامرسان...\n");

  // ۱) کاربران نمونه
  const reza = await upsertUserByPhone("09123456789", "رضا نوری", "qd-reza123");
  const zahra = await upsertUserByPhone("09121112233", "زهرا کریمی", "qd-zahra456");
  const mohammad = await upsertUserByPhone("09124445566", "محمد رضایی", "qd-mohammad789");

  console.log(`✅ کاربران آماده شدند:
  • رضا نوری (09123456789) → ${reza.chatId}
  • زهرا کریمی (09121112233) → ${zahra.chatId}
  • محمد رضایی (09124445566) → ${mohammad.chatId}
`);

  // ۲) گفتگوی تأییدشده بین رضا و زهرا با ۵ پیام نمونه
  const existingConv = await db.conversation.findFirst({
    where: {
      OR: [
        { participant1Id: reza.id, participant2Id: zahra.id },
        { participant1Id: zahra.id, participant2Id: reza.id },
      ],
    },
  });

  let convId: string;
  if (existingConv) {
    // اگر قبلاً ایجاد شده، فقط آن را accepted کن
    await db.conversation.update({
      where: { id: existingConv.id },
      data: { status: "accepted" },
    });
    convId = existingConv.id;
    console.log(`ℹ️  گفتگوی رضا-زهرا از قبل وجود داشت (id: ${convId})`);
  } else {
    const conv = await db.conversation.create({
      data: {
        participant1Id: reza.id,
        participant2Id: zahra.id,
        status: "accepted",
        initiatedBy: reza.id,
      },
    });
    convId = conv.id;
    console.log(`✅ گفتگوی رضا-زهرا ایجاد شد (id: ${convId})`);
  }

  // بررسی تعداد پیام‌های موجود
  const msgCount = await db.message.count({ where: { conversationId: convId } });
  if (msgCount === 0) {
    const now = Date.now();
    const minute = 60 * 1000;

    const samples: { senderId: string; text: string; offsetMin: number }[] = [
      { senderId: reza.id, text: "سلام زهرا، حالت چطوره؟", offsetMin: 120 },
      { senderId: zahra.id, text: "سلام رضا، ممنون. شما خوبی؟", offsetMin: 115 },
      { senderId: reza.id, text: "منم خوبم. می‌خواستم در مورد جلسه فردا صحبت کنیم.", offsetMin: 90 },
      { senderId: zahra.id, text: "بله، حتما. کی و کجا جمع می‌شیم؟", offsetMin: 85 },
      { senderId: reza.id, text: "ساعت ۹ صبح، کافه قدس؟", offsetMin: 60 },
      { senderId: zahra.id, text: "عالیه. اونجا می‌بینمت.", offsetMin: 5 },
    ];

    let lastEncrypted = "";
    let lastSender = "";
    let lastAt = new Date();
    for (const s of samples) {
      const enc = encrypt(s.text);
      const m = await db.message.create({
        data: {
          conversationId: convId,
          senderId: s.senderId,
          content: enc,
          messageType: "text",
          isRead: true,
          createdAt: new Date(now - s.offsetMin * minute),
        },
      });
      lastEncrypted = enc;
      lastSender = s.senderId;
      lastAt = m.createdAt;
    }

    // به‌روزرسانی آخرین پیام گفتگو
    await db.conversation.update({
      where: { id: convId },
      data: {
        lastMessageAt: lastAt,
        lastMessageContent: lastEncrypted,
        lastMessageSenderId: lastSender,
      },
    });
    console.log(`✅ ${samples.length} پیام نمونه رمزنگاری و ایجاد شد`);
  } else {
    console.log(`ℹ️  پیام‌های نمونه از قبل موجودند (${msgCount} پیام)`);
  }

  // ۳) درخواست چت در انتظار تأیید از محمد به رضا
  const existingReq = await db.conversation.findFirst({
    where: {
      participant1Id: mohammad.id,
      participant2Id: reza.id,
      status: "pending",
    },
  });

  if (existingReq) {
    console.log(`ℹ️  درخواست چت محمد→رضا از قبل وجود دارد (id: ${existingReq.id})`);
  } else {
    // اگر قبلاً گفتگوی دیگری بین این دو وجود دارد و deleted نیست، یک pending جدید نساز
    const anyConv = await db.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: mohammad.id, participant2Id: reza.id },
          { participant1Id: reza.id, participant2Id: mohammad.id },
        ],
      },
    });
    if (anyConv) {
      // اگر وجود دارد و وضعیتش pending نیست، آن را pending کنیم
      await db.conversation.update({
        where: { id: anyConv.id },
        data: { status: "pending", initiatedBy: mohammad.id },
      });
      console.log(`✅ درخواست چت محمد→رضا روی گفتگوی موجود تنظیم شد (id: ${anyConv.id})`);
    } else {
      const req = await db.conversation.create({
        data: {
          participant1Id: mohammad.id,
          participant2Id: reza.id,
          status: "pending",
          initiatedBy: mohammad.id,
        },
      });
      console.log(`✅ درخواست چت محمد→رضا ایجاد شد (id: ${req.id})`);
    }
  }

  console.log("\n🎉 seed پیامرسان با موفقیت به پایان رسید.");
  console.log("💡 برای تست:");
  console.log("   • با شماره 09123456789 وارد شوید (رضا) → گفتگو با زهرا + درخواست از محمد");
  console.log("   • با شماره 09121112233 وارد شوید (زهرا) → گفتگو با رضا");
  console.log("   • با شماره 09124445566 وارد شوید (محمد) → گفتگوی pending با رضا");
}

main()
  .catch((e) => {
    console.error("❌ خطا در seed پیامرسان:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
