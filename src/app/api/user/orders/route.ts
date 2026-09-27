import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";

// GET /api/user/orders — سفارش‌های کاربر (فروشگاه + غذا)
export async function GET(req: NextRequest) {
  try {
    const session = await requireUser();
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || ""; // "product" | "food"

    const where: Record<string, unknown> = { userId: session.id };
    if (type && type !== "all") where.type = type;

    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, emoji: true, brand: true },
            },
          },
        },
        restaurant: {
          select: { id: true, name: true, categoryEmoji: true },
        },
      },
    });

    return NextResponse.json({
      orders: orders.map((o) => ({
        ...o,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      })),
    });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Get orders error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
