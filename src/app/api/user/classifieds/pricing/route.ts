import { NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";

// GET /api/user/classifieds/pricing — دریافت قیمت‌گذاری همه دسته‌ها
export async function GET() {
  try {
    await requireUser();

    const pricing = await db.classifiedPricing.findMany({
      where: { isActive: true },
      orderBy: { categoryLabel: "asc" },
    });

    return NextResponse.json({ pricing });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Get pricing error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
