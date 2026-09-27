import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { AdminPageHeader, AdminBadge, EmptyState } from "@/components/admin/ui";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search as SearchIcon, ChevronLeft } from "lucide-react";
import { PropertiesListClient } from "@/components/admin/PropertiesListClient";

export default async function AdminPropertiesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const properties = await db.property.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return <PropertiesListClient initialProperties={properties} />;
}
