import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function NewNewsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <NewsForm mode="create" />;
}
