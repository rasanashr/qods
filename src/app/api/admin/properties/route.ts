import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// GET /api/admin/properties
export async function GET(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { location: { contains: search } },
    ];
  }
  if (status && status !== "all") where.status = status;

  const properties = await db.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ properties });
}

// POST /api/admin/properties
export async function POST(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { title, type, typeLabel, deal, dealLabel, area, price, location, district } = body;

    if (!title || !type || !deal || !price || !location) {
      return NextResponse.json(
        { error: "عنوان، نوع، نوع معامله، قیمت و مکان الزامی است" },
        { status: 400 }
      );
    }

    const property = await db.property.create({
      data: {
        title: String(title),
        type: String(type),
        typeLabel: String(typeLabel || ""),
        deal: String(deal),
        dealLabel: String(dealLabel || ""),
        area: Number(area || 0),
        rooms: Number(body.rooms || 0),
        floor: body.floor ? Number(body.floor) : null,
        totalFloors: body.totalFloors ? Number(body.totalFloors) : null,
        age: Number(body.age || 0),
        price: String(price),
        rent: body.rent ? String(body.rent) : null,
        location: String(location),
        district: String(district || ""),
        timeAgo: String(body.timeAgo || "همین الان"),
        emoji: String(body.emoji || "🏠"),
        features: body.features ? JSON.stringify(body.features) : null,
        hasParking: body.hasParking === true,
        hasElevator: body.hasElevator === true,
        hasBalcony: body.hasBalcony === true,
        status: String(body.status || "approved"),
        isPublished: true,
      },
    });

    await logAdminAction({
      adminId: session.id,
      action: "create",
      resource: "property",
      resourceId: property.id,
      detail: `ایجاد آگهی: ${title}`,
    });

    return NextResponse.json({ success: true, property });
  } catch (e) {
    console.error("Create property error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
