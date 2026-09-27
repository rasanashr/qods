import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/public/sama137-by-code?code=xxx
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "code الزامی است" }, { status: 400 });
  }
  const r = await db.sama137Request.findUnique({
    where: { trackingCode: code },
    select: {
      id: true,
      trackingCode: true,
      title: true,
      categoryLabel: true,
      emoji: true,
      description: true,
      address: true,
      district: true,
      status: true,
      statusLabel: true,
      priority: true,
      priorityLabel: true,
      createdAt: true,
      timeAgo: true,
      timeline: true,
      referenceUnit: true,
      assignedTo: true,
    },
  });
  if (!r) {
    return NextResponse.json({ error: "کد رهگیری یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({
    request: {
      ...r,
      timeline: r.timeline ? JSON.parse(r.timeline) : [],
    },
  });
}
