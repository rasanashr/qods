import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

export async function GET(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  const priority = url.searchParams.get("priority") || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { trackingCode: { contains: search } },
      { address: { contains: search } },
    ];
  }
  if (status && status !== "all") where.status = status;
  if (priority && priority !== "all") where.priority = priority;

  const requests = await db.sama137Request.findMany({
    where,
    orderBy: { created_at: "desc" },
    take: 200,
  });

  return NextResponse.json({ requests });
}
