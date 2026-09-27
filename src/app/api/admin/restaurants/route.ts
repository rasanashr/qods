import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// GET /api/admin/restaurants
export async function GET(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { category: { contains: search } },
    ];
  }

  const restaurants = await db.restaurant.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ restaurants });
}

// POST /api/admin/restaurants
export async function POST(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { name, category, description, deliveryTime, minOrder } = body;
    if (!name || !category || !description) {
      return NextResponse.json(
        { error: "نام، دسته و توضیحات الزامی است" },
        { status: 400 }
      );
    }

    const restaurant = await db.restaurant.create({
      data: {
        name: String(name),
        category: String(category),
        categoryEmoji: String(body.categoryEmoji || "🍽️"),
        coverGradient: String(body.coverGradient || "from-orange-500 to-amber-600"),
        description: String(description),
        rating: Number(body.rating || 0),
        reviewCount: String(body.reviewCount || "0"),
        deliveryTime: String(deliveryTime || "۳۰-۴۵ دقیقه"),
        deliveryFee: String(body.deliveryFee || "رایگان"),
        minOrder: String(minOrder || "۱۰۰٬۰۰۰ ت"),
        tags: body.tags ? JSON.stringify(body.tags) : null,
        isOpen: body.isOpen !== false,
        featured: body.featured === true,
        discount: body.discount ? Number(body.discount) : null,
        isPublished: true,
      },
    });

    await logAdminAction({
      adminId: session.id,
      action: "create",
      resource: "restaurant",
      resourceId: restaurant.id,
      detail: `ایجاد رستوران: ${name}`,
    });

    return NextResponse.json({ success: true, restaurant });
  } catch (e) {
    console.error("Create restaurant error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
