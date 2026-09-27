import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return <ProductForm mode="create" />;
}
