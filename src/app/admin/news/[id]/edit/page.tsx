import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const news = await db.newsItem.findUnique({ where: { id } });
  if (!news) redirect("/admin/news");
  return <NewsForm mode="edit" news={news} />;
}
