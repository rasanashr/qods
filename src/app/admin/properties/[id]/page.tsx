import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { PropertyDetailClient } from "@/components/admin/PropertyDetailClient";

export default async function AdminPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const property = await db.property.findUnique({ where: { id } });
  if (!property) redirect("/admin/properties");

  return <PropertyDetailClient property={property} />;
}
