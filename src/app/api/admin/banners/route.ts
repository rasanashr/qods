import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

export async function GET(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const url = new URL(req.url);
  const position = url.searchParams.get("position") || "";
  const where: Record<string, unknown> = {};
  if (position) where.position = position;

  const banners = await db.banner.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ banners });
}

export async function POST(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { title } = body;
    if (!title) {
      return NextResponse.json({ error: "عنوان الزامی است" }, { status: 400 });
    }

    const banner = await db.banner.create({
      data: {
        title: String(title),
        subtitle: String(body.subtitle || ""),
        cta: String(body.cta || ""),
        gradient: String(body.gradient || "from-primary to-primary/80"),
        emoji: String(body.emoji || "✨"),
        position: String(body.position || "home_carousel"),
        isActive: body.isActive !== false,
        sortOrder: Number(body.sortOrder || 0),
      },
    });

    await logAdminAction({
      adminId: session.id,
      action: "create",
      resource: "banner",
      resourceId: banner.id,
      detail: `ایجاد بنر: ${title}`,
    });

    return NextResponse.json({ success: true, banner });
  } catch (e) {
    console.error("Create banner error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
