import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { setAdminSession, getAdminSession, clearAdminSession } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json(
        { error: "نام کاربری و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    const admin = await db.adminUser.findUnique({
      where: { username: username.trim() },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: "نام کاربری یا رمز عبور نادرست است" },
        { status: 401 }
      );
    }

    const passwordValid = bcrypt.compareSync(password, admin.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: "نام کاربری یا رمز عبور نادرست است" },
        { status: 401 }
      );
    }

    // به‌روزرسانی آخرین ورود
    await db.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    await setAdminSession({
      id: admin.id,
      username: admin.username,
      fullName: admin.fullName,
      role: admin.role,
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
    console.error("Admin login error:", e);
    return NextResponse.json(
      { error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}

// دریافت session فعلی
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}

// خروج
export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
