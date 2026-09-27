import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { BannerForm } from "@/components/admin/BannerForm";

export default async function NewBannerPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <BannerForm mode="create" />;
}
