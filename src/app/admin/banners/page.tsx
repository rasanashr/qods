import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { BannersListClient } from "@/components/admin/BannersListClient";

export default async function AdminBannersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const banners = await db.banner.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  return <BannersListClient initialBanners={banners} />;
}
