// Seed script — ایجاد ادمین پیش‌فرض و داده‌های نمونه
// اجرا: bun run scripts/seed.ts

import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 شروع seed پایگاه داده شبکه قدس...\n");

  // ۱) ایجاد ادمین پیش‌فرض
  const adminExists = await db.adminUser.findFirst({
    where: { username: "admin" },
  });
  if (!adminExists) {
    const passwordHash = bcrypt.hashSync("admin123", 10);
    await db.adminUser.create({
      data: {
        username: "admin",
        passwordHash,
        fullName: "مدیر سیستم",
        role: "superadmin",
        isActive: true,
      },
    });
    console.log("✅ ادمین پیش‌فرض ایجاد شد:");
    console.log("   نام کاربری: admin");
    console.log("   رمز عبور: admin123\n");
  } else {
    console.log("ℹ️  ادمین از قبل موجود است.\n");
  }

  // ۲) ایجاد چند کاربر نمونه
  const users = [
    { phone: "09123456789", name: "رضا نوری" },
    { phone: "09121112233", name: "زهرا کریمی" },
    { phone: "09124445566", name: "محمد رضایی" },
  ];
  for (const u of users) {
    const exists = await db.appUser.findUnique({ where: { phone: u.phone } });
    if (!exists) {
      await db.appUser.create({
        data: {
          phone: u.phone,
          name: u.name,
          isVerified: true,
          isBlocked: false,
        },
      });
      console.log(`✅ کاربر ${u.name} ایجاد شد.`);
    }
  }
  console.log("");

  // ۳) ایجاد محصولات نمونه
  const sampleProducts = [
    {
      name: "ماشین لباسشویی ۸ کیلویی اینورتر",
      brand: "اسنوا",
      price: 24500000,
      originalPrice: 28000000,
      discount: 12,
      emoji: "🌀",
      rating: 4.7,
      reviewCount: 240,
      soldCount: 1200,
      installment: "۱۲ ماه قسطی",
      category: "appliances",
      categoryLabel: "لوازم خانگی",
      description:
        "ماشین لباسشویی ۸ کیلویی با موتور اینورتر کم‌مصرف و کم‌صدا، مجهز به ۱۲ برنامه شستشوی هوشمند.",
      features: JSON.stringify([
        "موتور اینورتر کم‌صدا",
        "۱۲ برنامه شستشو",
        "کلاس انرژی A+++",
        "سیستم ضد چروک",
      ]),
      specs: JSON.stringify([
        { label: "ظرفیت", value: "۸ کیلوگرم" },
        { label: "سرعت چرخش", value: "۱۴۰۰ دور در دقیقه" },
        { label: "کلاس انرژی", value: "A+++" },
      ]),
      inStock: true,
      freeShipping: true,
    },
    {
      name: "یخچال فریزر ساید‌بای‌ساید",
      brand: "پاکشوما",
      price: 68000000,
      originalPrice: 75000000,
      discount: 9,
      emoji: "❄️",
      rating: 4.8,
      reviewCount: 180,
      soldCount: 890,
      installment: "۲۴ ماه قسطی",
      category: "appliances",
      categoryLabel: "لوازم خانگی",
      description: "یخچال فریزر ساید‌بای‌ساید با ظرفیت ۶۰۰ لیتر.",
      features: JSON.stringify([
        "ظرفیت ۶۰۰ لیتر",
        "سیستم بدون برفک",
        "آبسردکن و یخ‌ساز",
      ]),
      specs: JSON.stringify([
        { label: "ظرفیت", value: "۶۰۰ لیتر" },
        { label: "کلاس انرژی", value: "A++" },
      ]),
      inStock: true,
      freeShipping: true,
    },
    {
      name: "مایکروویو ۳۰ لیتری گریل",
      brand: "سامسونگ",
      price: 13600000,
      emoji: "🍲",
      rating: 4.6,
      reviewCount: 210,
      soldCount: 1500,
      installment: "۶ ماه قسطی",
      category: "kitchen",
      categoryLabel: "آشپزخانه",
      description: "مایکروویو ۳۰ لیتری با قابلیت گریل و کانوکشن.",
      features: JSON.stringify(["ظرفیت ۳۰ لیتر", "قابلیت گریل", "۱۵ برنامه پخت"]),
      specs: JSON.stringify([{ label: "ظرفیت", value: "۳۰ لیتر" }]),
      inStock: true,
      freeShipping: true,
    },
  ];

  for (const p of sampleProducts) {
    const exists = await db.product.findFirst({ where: { name: p.name } });
    if (!exists) {
      await db.product.create({ data: p });
      console.log(`✅ محصول «${p.name}» ایجاد شد.`);
    }
  }
  console.log("");

  // ۴) ایجاد چند آگهی املاک نمونه
  const sampleProperties = [
    {
      title: "آپارتمان نوساز ۸۵ متری با امکانات کامل",
      type: "apartment",
      typeLabel: "آپارتمان",
      deal: "sale",
      dealLabel: "فروش",
      area: 85,
      rooms: 2,
      floor: 3,
      totalFloors: 6,
      age: 1,
      price: "۸٫۵ میلیارد ت",
      location: "منطقه ۳، قدس",
      district: "شهرک قدس",
      timeAgo: "۲ ساعت پیش",
      emoji: "🏢",
      features: JSON.stringify(["انباری", "پارکینگ", "آسانسور", "بالکن"]),
      hasParking: true,
      hasElevator: true,
      hasBalcony: true,
      status: "approved",
    },
    {
      title: "ویلای زیبا ۲۲۰ متری با حیاط بزرگ",
      type: "villa",
      typeLabel: "ویلا",
      deal: "sale",
      dealLabel: "فروش",
      area: 220,
      rooms: 4,
      totalFloors: 2,
      age: 3,
      price: "۲۸ میلیارد ت",
      location: "شهرک قدس، بلوار امین",
      district: "شهرک قدس",
      timeAgo: "۵ ساعت پیش",
      emoji: "🏡",
      features: JSON.stringify(["حیاط بزرگ", "پارکینگ دوگانه"]),
      hasParking: true,
      hasElevator: false,
      hasBalcony: true,
      status: "approved",
    },
  ];

  for (const p of sampleProperties) {
    const exists = await db.property.findFirst({ where: { title: p.title } });
    if (!exists) {
      await db.property.create({ data: p });
      console.log(`✅ آگهی املاک «${p.title}» ایجاد شد.`);
    }
  }
  console.log("");

  // ۵) ایجاد چند رستوران نمونه
  const sampleRestaurants = [
    {
      name: "رستوران سنتی اصغر قدس",
      category: "غذاهای ایرانی",
      categoryEmoji: "🟢",
      coverGradient: "from-emerald-500 via-teal-500 to-green-600",
      description: "بهترین چلوکباب و خورشت‌های اصیل ایرانی",
      rating: 4.8,
      reviewCount: "۱٫۲k",
      deliveryTime: "۳۰-۴۵ دقیقه",
      deliveryFee: "رایگان",
      minOrder: "۱۵۰٬۰۰۰ ت",
      tags: JSON.stringify(["چلوکباب", "خورشت", "سنتی"]),
      isOpen: true,
      featured: true,
      discount: 15,
    },
    {
      name: "پیتزا رنا",
      category: "پیتزا",
      categoryEmoji: "🍕",
      coverGradient: "from-orange-500 via-amber-500 to-yellow-600",
      description: "پیتزاهای ایتالیایی و مکزیکی",
      rating: 4.6,
      reviewCount: "۱٫۵k",
      deliveryTime: "۳۵-۵۰ دقیقه",
      deliveryFee: "رایگان",
      minOrder: "۲۵۰٬۰۰۰ ت",
      tags: JSON.stringify(["پپرونی", "چهار پنیر"]),
      isOpen: true,
      discount: 20,
    },
  ];

  for (const r of sampleRestaurants) {
    const exists = await db.restaurant.findFirst({ where: { name: r.name } });
    if (!exists) {
      await db.restaurant.create({ data: r });
      console.log(`✅ رستوران «${r.name}» ایجاد شد.`);
    }
  }
  console.log("");

  // ۶) ایجاد چند درخواست سامانه ۱۳۷ نمونه
  const sampleSamaRequests = [
    {
      trackingCode: "137-89010",
      title: "نظافت خیابان شهید عالمی",
      category: "cleaning",
      categoryLabel: "نظافت معابر",
      emoji: "🧹",
      description: "تجمع زباله و پسماند در حد فاصل خیابان شهید عالمی.",
      address: "خیابان شهید عالمی، حد فاصل کوچه ۱۲ تا ۱۴، قدس",
      district: "منطقه ۳",
      status: "in-progress",
      statusLabel: "در حال پیگیری",
      priority: "high",
      priorityLabel: "زیاد",
      createdAt: "1404/06/22",
      timeAgo: "۳ روز پیش",
      updatedAt: "1404/06/24",
      attachments: JSON.stringify([]),
      timeline: JSON.stringify([
        { label: "ثبت درخواست", date: "1404/06/22", done: true },
        { label: "بررسی اولیه", date: "1404/06/23", done: true },
        { label: "ارجاع به واحد نظافت", date: "1404/06/24", done: true },
        { label: "اعزام تیم نظافتی", date: "—", done: false },
      ]),
      referenceUnit: "واحد نظافت و خدمات شهری",
      assignedTo: "مهندس رضایی",
    },
    {
      trackingCode: "137-88923",
      title: "خرابی آسفالت خیابان قدس",
      category: "asphalt",
      categoryLabel: "آسفالت و معابر",
      emoji: "🛣️",
      description: "چاله‌های عمیق در آسفالت خیابان قدس.",
      address: "خیابان قدس، حد فاصل میدان امام حسن تا بلوار امین",
      district: "منطقه ۱",
      status: "in-progress",
      statusLabel: "در حال پیگیری",
      priority: "urgent",
      priorityLabel: "فوری",
      createdAt: "1404/06/20",
      timeAgo: "۵ روز پیش",
      updatedAt: "1404/06/24",
      attachments: JSON.stringify([]),
      timeline: JSON.stringify([
        { label: "ثبت درخواست", date: "1404/06/20", done: true },
        { label: "بررسی فنی", date: "1404/06/21", done: true },
        { label: "اولویت‌بندی فوری", date: "1404/06/21", done: true },
        { label: "اعزام تیم", date: "—", done: false },
      ]),
      referenceUnit: "واحد معابر و آسفالت",
      assignedTo: "مهندس کاظمی",
    },
  ];

  for (const r of sampleSamaRequests) {
    const exists = await db.sama137Request.findUnique({
      where: { trackingCode: r.trackingCode },
    });
    if (!exists) {
      await db.sama137Request.create({ data: r });
      console.log(`✅ درخواست ۱۳۷ «${r.title}» ایجاد شد.`);
    }
  }
  console.log("");

  // ۷) اخبار نمونه
  const sampleNews = [
    {
      title: "افتتاح فاز جدید مترو قدس در هفته آینده",
      excerpt:
        "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.",
      category: "شهری",
      timeAgo: "۲ ساعت پیش",
      readTime: "۳ دقیقه",
      emoji: "🚇",
      accent: "bg-teal-500",
    },
    {
      title: "آغاز پروژه بازآفرینی فضای سبز پارک ملت",
      excerpt: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.",
      category: "محیط زیست",
      timeAgo: "۵ ساعت پیش",
      readTime: "۲ دقیقه",
      emoji: "🌳",
      accent: "bg-emerald-500",
    },
  ];
  for (const n of sampleNews) {
    const exists = await db.newsItem.findFirst({ where: { title: n.title } });
    if (!exists) {
      await db.newsItem.create({ data: n });
      console.log(`✅ خبر «${n.title}» ایجاد شد.`);
    }
  }
  console.log("");

  // ۸) بنرهای اسلایدر نمونه
  const sampleBanners = [
    {
      title: "پرداخت آنلاین عوارض شهرداری",
      subtitle: "بدون مراجعه حضوری، در کمتر از یک دقیقه",
      cta: "پرداخت",
      gradient: "from-teal-600 via-emerald-600 to-green-700",
      emoji: "🏛️",
      position: "home_carousel",
      isActive: true,
      sortOrder: 1,
    },
    {
      title: "مسابقه بزرگ شبکه قدس",
      subtitle: "تا سقف ۵۰ میلیون ریال جایزه",
      cta: "شرکت در مسابقه",
      gradient: "from-amber-500 via-orange-500 to-rose-500",
      emoji: "🏆",
      position: "home_carousel",
      isActive: true,
      sortOrder: 2,
    },
    {
      title: "تخفیف ویژه پاییزه فروشگاه قدس",
      subtitle: "تا ۴۰٪ تخفیف روی لوازم خانگی",
      cta: "خرید کن",
      gradient: "from-orange-500 via-rose-500 to-pink-600",
      emoji: "🎉",
      position: "ad_banner",
      isActive: true,
      sortOrder: 1,
    },
  ];
  for (const b of sampleBanners) {
    const exists = await db.banner.findFirst({ where: { title: b.title } });
    if (!exists) {
      await db.banner.create({ data: b });
      console.log(`✅ بنر «${b.title}» ایجاد شد.`);
    }
  }

  console.log("\n🎉 seed کامل شد!");
  console.log("\n📋 اطلاعات ورود به پنل ادمین:");
  console.log("   آدرس: /admin/login");
  console.log("   نام کاربری: admin");
  console.log("   رمز عبور: admin123");
}

main()
  .catch((e) => {
    console.error("❌ خطا در seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
