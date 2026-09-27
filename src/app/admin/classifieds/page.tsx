import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { AdminClassifiedsListClient } from "@/components/admin/AdminClassifiedsListClient";

export default async function AdminClassifiedsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const items = await db.classified.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      owner: { select: { id: true, name: true, phone: true } },
    },
  });

  return <AdminClassifiedsListClient initialItems={items as never} />;
}
