import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// GET /api/admin/products — لیست محصولات
export async function GET(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { brand: { contains: search } },
    ];
  }
  if (category && category !== "all") {
    where.category = category;
  }

  const products = await db.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ products });
}

// POST /api/admin/products — ایجاد محصول جدید
export async function POST(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  try {
    const body = await req.json();
    const {
      name,
      brand,
      price,
      originalPrice,
      discount,
      emoji,
      rating,
      reviewCount,
      soldCount,
      installment,
      category,
      categoryLabel,
      description,
      features,
      specs,
      inStock,
      freeShipping,
    } = body as Record<string, unknown>;

    if (!name || !brand || !price || !category || !categoryLabel) {
      return NextResponse.json(
        { error: "نام، برند، قیمت، دسته و نام دسته الزامی است" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name: String(name),
        brand: String(brand),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        discount: discount ? Number(discount) : null,
        emoji: String(emoji || "📦"),
        rating: Number(rating || 0),
        reviewCount: Number(reviewCount || 0),
        soldCount: Number(soldCount || 0),
        installment: String(installment || ""),
        category: String(category),
        categoryLabel: String(categoryLabel),
        description: description ? String(description) : null,
        features: features ? JSON.stringify(features) : null,
        specs: specs ? JSON.stringify(specs) : null,
        inStock: inStock !== false,
        freeShipping: freeShipping === true,
        isPublished: true,
      },
    });

    await logAdminAction({
      adminId: session.id,
      action: "create",
      resource: "product",
      resourceId: product.id,
      detail: `ایجاد محصول: ${name}`,
    });

    return NextResponse.json({ success: true, product });
  } catch (e) {
    console.error("Create product error:", e);
    return NextResponse.json(
      { error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}
