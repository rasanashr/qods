// Seed برای داده‌های نمونه کاربر (سفارش‌ها + موجودی کیف پول)
import { db } from "../src/lib/db";

async function main() {
  console.log("🌱 شروع seed داده‌های نمونه کاربر...\n");

  // پیدا کردن کاربر نمونه با شماره 09123456789
  const user = await db.appUser.findUnique({ where: { phone: "09123456789" } });
  if (!user) {
    console.log("❌ کاربر 09123456789 یافت نشد. ابتدا seed اصلی را اجرا کنید.");
    return;
  }

  // ۱) شارژ اولیه کیف پول
  const existingTx = await db.walletTransaction.findFirst({
    where: { userId: user.id },
  });
  if (!existingTx) {
    await db.walletTransaction.create({
      data: {
        userId: user.id,
        type: "deposit",
        amount: 250000,
        balanceAfter: 250000,
        description: "هدیه عضویت",
        reference: "welcome-bonus",
        status: "completed",
      },
    });
    console.log("✅ موجودی کیف پول 250٬۰۰۰ تومان ایجاد شد");
  } else {
    console.log("ℹ️  تراکنش کیف پول از قبل موجود است");
  }

  // ۲) چند آگهی نمونه برای کاربر
  const existingClassifieds = await db.classified.count({
    where: { ownerId: user.id },
  });
  if (existingClassifieds === 0) {
    await db.classified.createMany({
      data: [
        {
          ownerId: user.id,
          title: "گاز شهری پلاستیکی",
          category: "home",
          categoryLabel: "لوازم خانگی",
          emoji: "🔥",
          description: "گاز شهری پلاستیکی نو، مناسب خانه.",
          price: "۱٫۸۵۰٫۰۰۰ ت",
          location: "میدان قدس",
          district: "مرکز شهر",
          timeAgo: "۲ روز پیش",
          isPaid: false,
          paidAmount: 0,
          plan: "free",
          status: "approved",
          badgeColor: "bg-emerald-50 text-emerald-700",
          tags: JSON.stringify(["گاز", "پلاستیکی"]),
        },
        {
          ownerId: user.id,
          title: "دوچرخه کوهستان ۲۱ سرعته",
          category: "vehicles",
          categoryLabel: "وسایل نقلیه",
          emoji: "🚲",
          description: "دوچرخه کوهستان دوچرخه ۲۱ سرعته، نو کم‌کارکرد.",
          price: "۶٫۲۰۰٫۰۰۰ ت",
          location: "بلوار امین",
          district: "شهرک قدس",
          timeAgo: "۵ ساعت پیش",
          isPaid: true,
          paidAmount: 120000,
          plan: "featured",
          status: "approved",
          badgeColor: "bg-orange-50 text-orange-700",
          tags: JSON.stringify(["دوچرخه", "کوهستان"]),
        },
        {
          ownerId: user.id,
          title: "موبایل سامسونگ A55",
          category: "electronics",
          categoryLabel: "الکترونیک",
          emoji: "📱",
          description: "گوشی موبایل سامسونگ A55 ظرفیت ۲۵۶ گیگابایت.",
          price: "۱۸٫۹۰۰٫۰۰۰ ت",
          location: "خیابان امام",
          district: "مرکز شهر",
          timeAgo: "دیروز",
          isPaid: false,
          paidAmount: 0,
          plan: "free",
          status: "pending",
          badgeColor: "bg-sky-50 text-sky-700",
          tags: JSON.stringify(["موبایل", "سامسونگ"]),
        },
      ],
    });
    console.log("✅ ۳ آگهی نمونه برای کاربر ایجاد شد");
  } else {
    console.log(`ℹ️  ${existingClassifieds} آگهی از قبل موجود است`);
  }

  // ۳) چند مورد اشیاء گمشده
  const existingLf = await db.lostFoundItem.count({ where: { ownerId: user.id } });
  if (existingLf === 0) {
    await db.lostFoundItem.create({
      data: {
        ownerId: user.id,
        title: "گواهینامه راننده",
        status: "lost",
        category: "documents",
        categoryLabel: "مدارک",
        emoji: "📄",
        description: "گواهینامه راننده به نام محمد رضایی گم شده است.",
        location: "میدان قدس",
        district: "مرکز شهر",
        date: "1404/06/22",
        timeAgo: "دیروز",
        reward: "۵۰۰٬۰۰۰ تومان پاداش",
        contactName: "رضا نوری",
        contactType: "owner",
        tags: JSON.stringify(["گواهینامه", "مدارک"]),
        status_admin: "approved",
      },
    });
    console.log("✅ مورد اشیاء گمشده نمونه ایجاد شد");
  }

  // ۴) چند سفارش نمونه فروشگاه
  const existingOrders = await db.order.count({ where: { userId: user.id } });
  if (existingOrders === 0) {
    // پیدا کردن محصول
    const product = await db.product.findFirst();
    if (product) {
      const order = await db.order.create({
        data: {
          userId: user.id,
          type: "product",
          status: "delivered",
          totalAmount: product.price,
          address: "شهرک قدس، خیابان مطهری، پلاک ۱۲",
          notes: "تحویل بعد از ساعت ۱۸ لطفاً",
          items: {
            create: [
              {
                productId: product.id,
                quantity: 1,
                price: product.price,
              },
            ],
          },
        },
      });
      console.log(`✅ سفارش نمونه فروشگاه ایجاد شد (کد: ${order.id.slice(-6)})`);
    }
  } else {
    console.log(`ℹ️  ${existingOrders} سفارش از قبل موجود است`);
  }

  console.log("\n🎉 seed کامل شد!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
