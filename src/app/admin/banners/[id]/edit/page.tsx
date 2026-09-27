import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { BannerForm } from "@/components/admin/BannerForm";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const banner = await db.banner.findUnique({ where: { id } });
  if (!banner) redirect("/admin/banners");
  return <BannerForm mode="edit" banner={banner} />;
}
