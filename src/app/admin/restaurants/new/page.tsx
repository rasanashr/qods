import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { RestaurantForm } from "@/components/admin/RestaurantForm";

export default async function NewRestaurantPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <RestaurantForm mode="create" />;
}
