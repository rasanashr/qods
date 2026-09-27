import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail } from "@/lib/admin-utils";

// GET /api/admin/logs — آخرین لاگ‌ها
export async function GET() {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const logs = await db.adminLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      admin: {
        select: { fullName: true, username: true },
      },
    },
  });

  return NextResponse.json({ logs });
}
