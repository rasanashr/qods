import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { LostFoundListClient } from "@/components/admin/LostFoundListClient";

export default async function AdminLostFoundPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const items = await db.lostFoundItem.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return <LostFoundListClient initialItems={items} />;
}
