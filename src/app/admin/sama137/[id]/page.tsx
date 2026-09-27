import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { SamaDetailClient } from "@/components/admin/SamaDetailClient";

export default async function AdminSama137DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const request = await db.sama137Request.findUnique({ where: { id } });

  if (!request) {
    redirect("/admin/sama137");
  }

  return <SamaDetailClient request={request} />;
}
