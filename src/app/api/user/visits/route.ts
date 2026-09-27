import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/user-auth";
import { db } from "@/lib/db";

// POST /api/user/visits — ثبت بازدید صفحه
// body: { path, title }
export async function POST(req: NextRequest) {
  try {
    const session = await getUserSession();
    const body = await req.json();
    const { path, title } = body as { path?: string; title?: string };

    if (!path) {
      return NextResponse.json({ error: "path الزامی است" }, { status: 400 });
    }

    // اگر کاربر وارد شده بود، در دیتابیس ذخیره می‌کنیم
    if (session) {
      // فقط ۵ بازدید آخر را نگه می‌داریم برای هر مسیر (برای جلوگیری از پر شدن دیتابیس)
      const existing = await db.pageVisit.findFirst({
        where: { userId: session.id, path },
        orderBy: { visitedAt: "desc" },
      });
      // اگر در ۳۰ دقیقه اخیر بازدید کرده، نگذاریم
      if (existing) {
        const diff = Date.now() - existing.visitedAt.getTime();
        if (diff < 30 * 60 * 1000) {
          return NextResponse.json({ success: true, skipped: true });
        }
      }

      await db.pageVisit.create({
        data: {
          userId: session.id,
          path,
          title: title || null,
        },
      });

      // فقط ۵۰ بازدید آخر را نگه می‌داریم
      const count = await db.pageVisit.count({ where: { userId: session.id } });
      if (count > 50) {
        const oldest = await db.pageVisit.findMany({
          where: { userId: session.id },
          orderBy: { visitedAt: "asc" },
          take: count - 50,
          select: { id: true },
        });
        await db.pageVisit.deleteMany({
          where: { id: { in: oldest.map((o) => o.id) } },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Track visit error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// GET — لیست سابقه بازدید
export async function GET() {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ visits: [] });
    }

    const visits = await db.pageVisit.findMany({
      where: { userId: session.id },
      orderBy: { visitedAt: "desc" },
      take: 20,
      select: {
        id: true,
        path: true,
        title: true,
        visitedAt: true,
      },
    });

    return NextResponse.json({
      visits: visits.map((v) => ({
        ...v,
        visitedAt: v.visitedAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("Get visits error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
