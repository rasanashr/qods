import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/public/products-by-id?id=xxx
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id الزامی است" }, { status: 400 });
  }
  const product = await db.product.findUnique({
    where: { id },
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
  if (!product) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }
  const formatted = {
    ...product,
    price: product.price.toLocaleString("fa-IR") + " ت",
    originalPrice: product.originalPrice
      ? product.originalPrice.toLocaleString("fa-IR") + " ت"
      : undefined,
    features: product.features ? JSON.parse(product.features) : [],
    specs: product.specs ? JSON.parse(product.specs) : [],
  };
  return NextResponse.json({ product: formatted });
}
