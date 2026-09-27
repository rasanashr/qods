// آپدیت محصولات برای اضافه کردن bg
import { db } from "../src/lib/db";

const bgMap: Record<string, string> = {
  appliances: "bg-teal-50",
  kitchen: "bg-emerald-50",
  electronics: "bg-sky-50",
  "home-decor": "bg-amber-50",
  cleaning: "bg-rose-50",
};

async function main() {
  const products = await db.product.findMany();
  for (const p of products) {
    if (!p.bg || p.bg === "bg-muted") {
      const bg = bgMap[p.category] || "bg-muted";
      await db.product.update({
        where: { id: p.id },
        data: { bg },
      });
      console.log(`✅ آپدیت شد: ${p.name} -> ${bg}`);
    }
  }
  console.log("🎉 تمام");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
