import { NextResponse } from "next/server";
import { getUserSession, requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";
import { getUserWalletBalance } from "@/lib/user-auth";

// GET /api/user/me — اطلاعات کاربر فعلی + آمار کامل
export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await db.appUser.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      phone: true,
      name: true,
      isVerified: true,
      joinedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
  }

  // محاسبه آمار کامل
  const [
    classifiedCount,
    pendingClassifiedCount,
    lostFoundCount,
    pendingLostFoundCount,
    sama137Count,
    pendingSamaCount,
    ordersCount,
    walletBalance,
    recentVisits,
  ] = await Promise.all([
    db.classified.count({ where: { ownerId: user.id } }),
    db.classified.count({ where: { ownerId: user.id, status: "pending" } }),
    db.lostFoundItem.count({ where: { ownerId: user.id } }),
    db.lostFoundItem.count({ where: { ownerId: user.id, status_admin: "pending" } }),
    db.sama137Request.count({ where: { requesterId: user.id } }),
    db.sama137Request.count({ where: { requesterId: user.id, status: "pending" } }),
    db.order.count({ where: { userId: user.id } }),
    getUserWalletBalance(user.id),
    db.pageVisit.findMany({
      where: { userId: user.id },
      orderBy: { visitedAt: "desc" },
      take: 10,
      select: {
        id: true,
        path: true,
        title: true,
        visitedAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    authenticated: true,
    user: {
      ...user,
      joinedAt: user.joinedAt.toISOString(),
    },
    stats: {
      classifieds: classifiedCount,
      pendingClassifieds: pendingClassifiedCount,
      lostFound: lostFoundCount,
      pendingLostFound: pendingLostFoundCount,
      sama137: sama137Count,
      pendingSama: pendingSamaCount,
      orders: ordersCount,
      walletBalance,
    },
    recentVisits: recentVisits.map((v) => ({
      ...v,
      visitedAt: v.visitedAt.toISOString(),
    })),
  });
}

// PATCH /api/user/me — به‌روزرسانی پروفایل
export async function PATCH(req: Request) {
  try {
    const session = await requireUser();
    const body = await req.json();
    const { name } = body as { name?: string };

    if (name !== undefined && name.trim().length === 0) {
      return NextResponse.json({ error: "نام نمی‌تواند خالی باشد" }, { status: 400 });
    }

    const updated = await db.appUser.update({
      where: { id: session.id },
      data: name ? { name: name.trim() } : {},
      select: {
        id: true,
        phone: true,
        name: true,
        joinedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...updated,
        joinedAt: updated.joinedAt.toISOString(),
      },
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    if (e instanceof Error && e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "حساب شما مسدود است" }, { status: 403 });
    }
    console.error("Update user error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
