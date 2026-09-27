import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { NewsListClient } from "@/components/admin/NewsListClient";

export default async function AdminNewsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const news = await db.newsItem.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return <NewsListClient initialNews={news} />;
}
