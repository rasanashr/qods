// Seed برای قیمت‌گذاری آگهی‌های نیازمندی‌ها
import { db } from "../src/lib/db";

const categories = [
  { category: "electronics", categoryLabel: "الکترونیک", freeDays: 7, featuredPrice: 80000, urgentPrice: 40000, featuredDays: 30, urgentDays: 14 },
  { category: "vehicles", categoryLabel: "وسایل نقلیه", freeDays: 7, featuredPrice: 120000, urgentPrice: 60000, featuredDays: 30, urgentDays: 14 },
  { category: "realestate", categoryLabel: "املاک", freeDays: 14, featuredPrice: 150000, urgentPrice: 80000, featuredDays: 45, urgentDays: 21 },
  { category: "home", categoryLabel: "لوازم خانگی", freeDays: 7, featuredPrice: 60000, urgentPrice: 30000, featuredDays: 30, urgentDays: 14 },
  { category: "services", categoryLabel: "خدمات", freeDays: 7, featuredPrice: 50000, urgentPrice: 25000, featuredDays: 30, urgentDays: 14 },
  { category: "jobs", categoryLabel: "استخدام", freeDays: 10, featuredPrice: 100000, urgentPrice: 50000, featuredDays: 30, urgentDays: 14 },
  { category: "personal", categoryLabel: "وسایل شخصی", freeDays: 7, featuredPrice: 40000, urgentPrice: 20000, featuredDays: 30, urgentDays: 14 },
  { category: "other", categoryLabel: "سایر", freeDays: 7, featuredPrice: 30000, urgentPrice: 15000, featuredDays: 30, urgentDays: 14 },
];

async function main() {
  console.log("🌱 شروع seed قیمت‌گذاری آگهی‌ها...\n");
  for (const c of categories) {
    const existing = await db.classifiedPricing.findUnique({ where: { category: c.category } });
    if (!existing) {
      await db.classifiedPricing.create({ data: c });
      console.log(`✅ ${c.categoryLabel} (${c.category}) ایجاد شد`);
    } else {
      console.log(`ℹ️  ${c.categoryLabel} از قبل موجود است`);
    }
  }
  console.log("\n🎉 seed کامل شد!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
