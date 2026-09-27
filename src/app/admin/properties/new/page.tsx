import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { PropertyForm } from "@/components/admin/PropertyForm";

export default async function NewPropertyPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <PropertyForm mode="create" />;
}
