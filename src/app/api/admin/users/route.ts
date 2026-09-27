import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// GET /api/admin/users — لیست همه کاربران سوپر اپ
export async function GET(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const blocked = url.searchParams.get("blocked"); // "true" | "false"
  const type = url.searchParams.get("type"); // "app" | "admin"

  if (type === "admin") {
    // لیست ادمین‌ها
    const admins = await db.adminUser.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ admins });
  }

  // لیست کاربران نهایی
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { phone: { contains: search } },
      { name: { contains: search } },
    ];
  }
  if (blocked === "true") where.isBlocked = true;
  if (blocked === "false") where.isBlocked = false;

  const users = await db.appUser.findMany({
    where,
    orderBy: { joinedAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ users });
}

// POST /api/admin/users — ایجاد ادمین جدید (فقط superadmin)
export async function POST(req: NextRequest) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  if (session.role !== "superadmin") {
    return NextResponse.json(
      { error: "شما اجازه ایجاد ادمین ندارید" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { username, password, fullName, role } = body as {
      username?: string;
      password?: string;
      fullName?: string;
      role?: string;
    };

    if (!username || !password || !fullName) {
      return NextResponse.json(
        { error: "نام کاربری، رمز عبور و نام کامل الزامی است" },
        { status: 400 }
      );
    }

    const existing = await db.adminUser.findUnique({
      where: { username: username.trim() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "این نام کاربری قبلاً استفاده شده است" },
        { status: 409 }
      );
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const admin = await db.adminUser.create({
      data: {
        username: username.trim(),
        passwordHash,
        fullName,
        role: role || "admin",
        isActive: true,
      },
    });

    await logAdminAction({
      adminId: session.id,
      action: "create",
      resource: "admin_user",
      resourceId: admin.id,
      detail: `ایجاد ادمین جدید: ${username}`,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        fullName: admin.fullName,
        role: admin.role,
      },
    });
  } catch (e) {
    console.error("Create admin error:", e);
    return NextResponse.json(
      { error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}
