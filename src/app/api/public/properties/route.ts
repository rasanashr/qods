import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/public/properties
export async function GET() {
  const properties = await db.property.findMany({
    where: { isPublished: true, status: "approved" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      type: true,
      typeLabel: true,
      deal: true,
      dealLabel: true,
      area: true,
      rooms: true,
      floor: true,
      totalFloors: true,
      age: true,
      price: true,
      rent: true,
      location: true,
      district: true,
      timeAgo: true,
      emoji: true,
      features: true,
      hasParking: true,
      hasElevator: true,
      hasBalcony: true,
    },
  });

  // badgeColor را بر اساس deal/type محاسبه می‌کنیم
  const formatted = properties.map((p) => ({
    ...p,
    features: p.features ? JSON.parse(p.features) : [],
    badgeColor: getBadgeColor(p.type, p.deal),
  }));

  return NextResponse.json({ properties: formatted });
}

function getBadgeColor(type: string, deal: string): string {
  if (deal === "rent") {
    if (type === "apartment") return "bg-sky-50 text-sky-700";
    if (type === "villa") return "bg-emerald-50 text-emerald-700";
    if (type === "suite") return "bg-purple-50 text-purple-700";
    return "bg-sky-50 text-sky-700";
  }
  if (type === "apartment") return "bg-teal-50 text-teal-700";
  if (type === "villa") return "bg-emerald-50 text-emerald-700";
  if (type === "land") return "bg-lime-50 text-lime-700";
  if (type === "shop") return "bg-amber-50 text-amber-700";
  return "bg-teal-50 text-teal-700";
}
