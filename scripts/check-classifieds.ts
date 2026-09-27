import { db } from "../src/lib/db";

async function main() {
  const items = await db.classified.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      plan: true,
      isPaid: true,
      publishedAt: true,
      expiresAt: true,
      createdAt: true,
    },
  });
  console.log(`تعداد کل: ${items.length}`);
  for (const it of items) {
    console.log(`- ${it.title}`);
    console.log(`  status: ${it.status}`);
    console.log(`  plan: ${it.plan}, isPaid: ${it.isPaid}`);
    console.log(`  publishedAt: ${it.publishedAt}`);
    console.log(`  expiresAt: ${it.expiresAt}`);
    console.log(`  createdAt: ${it.createdAt}`);
    console.log("");
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
