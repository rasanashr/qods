import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { AdminClassifiedDetailClient } from "@/components/admin/AdminClassifiedDetailClient";

export default async function AdminClassifiedDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const item = await db.classified.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, phone: true, joinedAt: true } },
    },
  });

  if (!item) redirect("/admin/classifieds");

  return <AdminClassifiedDetailClient item={item as never} />;
}
