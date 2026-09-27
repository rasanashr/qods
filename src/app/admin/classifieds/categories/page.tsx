import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { CategoriesListClient } from "@/components/admin/CategoriesListClient";

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const categories = await db.classifiedPricing.findMany({
    orderBy: { categoryLabel: "asc" },
  });

  // تعداد آگهی‌های هر دسته
  const categoriesWithCount = await Promise.all(
    categories.map(async (c) => {
      const count = await db.classified.count({ where: { category: c.category } });
      return { ...c, classifiedsCount: count };
    })
  );

  return <CategoriesListClient initialCategories={categoriesWithCount as never} />;
}
