import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { LostFoundForm } from "@/components/admin/LostFoundForm";

export default async function NewLostFoundPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <LostFoundForm mode="create" />;
}
