import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { RestaurantsList } from "@/components/admin/RestaurantsList";

export default async function AdminRestaurantsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const restaurants = await db.restaurant.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return <RestaurantsList initialRestaurants={restaurants} />;
}
