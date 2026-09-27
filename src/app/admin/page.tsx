import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { DashboardClient } from "@/components/admin/DashboardClient";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [
    totalAppUsers,
    totalAdminUsers,
    totalProducts,
    totalProperties,
    totalLostFound,
    totalRestaurants,
    totalSamaRequests,
    totalNews,
    totalBanners,
    totalOrders,
    pendingProperties,
    pendingLostFound,
    pendingSamaRequests,
    recentUsers,
    recentSamaRequests,
    recentLogs,
  ] = await Promise.all([
    db.appUser.count(),
    db.adminUser.count(),
    db.product.count(),
    db.property.count(),
    db.lostFoundItem.count(),
    db.restaurant.count(),
    db.sama137Request.count(),
    db.newsItem.count(),
    db.banner.count(),
    db.order.count(),
    db.property.count({ where: { status: "pending" } }),
    db.lostFoundItem.count({ where: { status_admin: "pending" } }),
    db.sama137Request.count({ where: { status: "pending" } }),
    db.appUser.findMany({
      orderBy: { joinedAt: "desc" },
      take: 5,
      select: { id: true, name: true, phone: true, joinedAt: true, isBlocked: true },
    }),
    db.sama137Request.findMany({
      orderBy: { created_at: "desc" },
      take: 5,
      select: {
        id: true,
        trackingCode: true,
        title: true,
        status: true,
        statusLabel: true,
        priority: true,
        priorityLabel: true,
        created_at: true,
      },
    }),
    db.adminLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { admin: { select: { fullName: true, username: true } } },
    }),
  ]);

  return (
    <DashboardClient
      session={session}
      stats={{
        totalAppUsers,
        totalAdminUsers,
        totalProducts,
        totalProperties,
        totalLostFound,
        totalRestaurants,
        totalSamaRequests,
        totalNews,
        totalBanners,
        totalOrders,
      }}
      pending={{
        properties: pendingProperties,
        lostFound: pendingLostFound,
        samaRequests: pendingSamaRequests,
        total: pendingProperties + pendingLostFound + pendingSamaRequests,
      }}
      recent={{
        users: recentUsers.map((u) => ({
          ...u,
          joinedAt: u.joinedAt.toISOString(),
        })),
        samaRequests: recentSamaRequests.map((r) => ({
          ...r,
          created_at: r.created_at.toISOString(),
        })),
        logs: recentLogs.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString(),
        })),
      }}
    />
  );
}
