import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { ProductsList } from "@/components/admin/ProductsList";

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return <ProductsList products={products} />;
}
