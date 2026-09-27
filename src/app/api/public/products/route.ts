import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/public/products
export async function GET() {
  const products = await db.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      brand: true,
      price: true,
      originalPrice: true,
      discount: true,
      emoji: true,
      rating: true,
      reviewCount: true,
      soldCount: true,
      installment: true,
      bg: true,
      category: true,
      categoryLabel: true,
      description: true,
      features: true,
      specs: true,
      inStock: true,
      freeShipping: true,
    },
  });

  // تبدیل price از Int به رشته فارسی برای حفظ سازگاری با UI
  const formatted = products.map((p) => ({
    ...p,
    price: p.price.toLocaleString("fa-IR") + " ت",
    originalPrice: p.originalPrice
      ? p.originalPrice.toLocaleString("fa-IR") + " ت"
      : undefined,
    features: p.features ? JSON.parse(p.features) : [],
    specs: p.specs ? JSON.parse(p.specs) : [],
  }));

  return NextResponse.json({ products: formatted });
}
