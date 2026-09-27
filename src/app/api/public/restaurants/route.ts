import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/public/restaurants
export async function GET() {
  const restaurants = await db.restaurant.findMany({
    where: { isPublished: true },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
    select: {
      id: true,
      name: true,
      category: true,
      categoryEmoji: true,
      coverGradient: true,
      description: true,
      rating: true,
      reviewCount: true,
      deliveryTime: true,
      deliveryFee: true,
      minOrder: true,
      tags: true,
      isOpen: true,
      featured: true,
      discount: true,
    },
  });

  const formatted = restaurants.map((r) => ({
    ...r,
    tags: r.tags ? JSON.parse(r.tags) : [],
  }));

  return NextResponse.json({ restaurants: formatted });
}
