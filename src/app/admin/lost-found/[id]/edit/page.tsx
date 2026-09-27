import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { LostFoundForm } from "@/components/admin/LostFoundForm";

export default async function EditLostFoundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const item = await db.lostFoundItem.findUnique({ where: { id } });
  if (!item) redirect("/admin/lost-found");
  return <LostFoundForm mode="edit" item={item} />;
}
