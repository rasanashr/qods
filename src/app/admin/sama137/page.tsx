import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { GenericList } from "@/components/admin/GenericList";
import type { GenericItem } from "@/components/admin/GenericList";

export default async function AdminSama137Page() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const requests = await db.sama137Request.findMany({
    orderBy: { created_at: "desc" },
    take: 200,
  });

  const items: GenericItem[] = requests.map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: `${r.trackingCode} · ${r.priorityLabel} · ${r.address}`,
    emoji: r.emoji,
    badge: {
      label: r.statusLabel,
      color:
        r.status === "resolved"
          ? "bg-emerald-50 text-emerald-700"
          : r.status === "in-progress"
          ? "bg-amber-50 text-amber-700"
          : r.status === "pending"
          ? "bg-slate-100 text-slate-700"
          : r.status === "dispatched"
          ? "bg-sky-50 text-sky-700"
          : "bg-rose-50 text-rose-700",
    },
    detailHref: `/admin/sama137/${r.id}`,
  }));

  return (
    <GenericList
      items={items}
      title="درخواست‌های سامانه ۱۳۷"
      description={`${requests.length.toLocaleString("fa-IR")} درخواست`}
      emptyEmoji="📞"
      emptyTitle="درخواستی وجود ندارد"
      searchFields={["title", "subtitle"]}
      showViewAll
    />
  );
}
