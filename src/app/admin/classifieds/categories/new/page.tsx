import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default async function NewCategoryPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <CategoryForm mode="create" />;
}
