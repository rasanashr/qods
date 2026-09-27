import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { RestaurantForm } from "@/components/admin/RestaurantForm";

export default async function EditRestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const restaurant = await db.restaurant.findUnique({ where: { id } });
  if (!restaurant) redirect("/admin/restaurants");
  return <RestaurantForm mode="edit" restaurant={restaurant} />;
}
