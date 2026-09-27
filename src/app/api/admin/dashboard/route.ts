import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail } from "@/lib/admin-utils";

// GET /api/admin/dashboard — آمار کلی داشبورد
export async function GET() {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

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
      take: 10,
      include: {
        admin: {
          select: { fullName: true, username: true },
        },
      },
    }),
  ]);

  return NextResponse.json({
    stats: {
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
    },
    pending: {
      properties: pendingProperties,
      lostFound: pendingLostFound,
      samaRequests: pendingSamaRequests,
      total: pendingProperties + pendingLostFound + pendingSamaRequests,
    },
    recent: {
      users: recentUsers,
      samaRequests: recentSamaRequests,
      logs: recentLogs,
    },
    session,
  });
}
