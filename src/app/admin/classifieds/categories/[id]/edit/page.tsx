import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const category = await db.classifiedPricing.findUnique({ where: { id } });
  if (!category) redirect("/admin/classifieds/categories");
  return <CategoryForm mode="edit" category={category} />;
}
