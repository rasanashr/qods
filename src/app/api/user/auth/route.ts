import { NextRequest, NextResponse } from "next/server";
import {
  createOtpForPhone,
  verifyOtp,
  findOrCreateUser,
  setUserSession,
  getUserSession,
  clearUserSession,
} from "@/lib/user-auth";

const PHONE_REGEX = /^09\d{9}$/;

// POST /api/user/auth — شماره موبایل → ارسال کد
// body: { action: "send_code" | "verify_code", phone, name?, code? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, phone, name, code } = body as {
      action?: string;
      phone?: string;
      name?: string;
      code?: string;
    };

    if (!phone || !PHONE_REGEX.test(phone.replace(/[^\d]/g, ""))) {
      return NextResponse.json(
        { error: "شماره موبایل نامعتبر است. مثال: 09123456789" },
        { status: 400 }
      );
    }

    const normalizedPhone = phone.replace(/[^\d]/g, "");

    if (action === "send_code") {
      const { code: generatedCode, expiresAt } = await createOtpForPhone(normalizedPhone);
      // در محیط تست (sandbox) کد را در response برمی‌گردانیم
      // در محیط تولید، این کد باید از طریق SMS ارسال شود
      const isSandbox = process.env.NODE_ENV !== "production" || process.env.OTP_SANDBOX === "true";
      return NextResponse.json({
        success: true,
        message: "کد تأیید ارسال شد",
        expiresIn: 120,
        ...(isSandbox ? { sandboxCode: generatedCode } : {}),
        expiresAt: expiresAt.toISOString(),
      });
    }

    if (action === "verify_code") {
      if (!code) {
        return NextResponse.json(
          { error: "کد تأیید الزامی است" },
          { status: 400 }
        );
      }

      const valid = await verifyOtp(normalizedPhone, code);
      if (!valid) {
        return NextResponse.json(
          { error: "کد واردشده صحیح یا منقضی شده است" },
          { status: 401 }
        );
      }

      // ایجاد یا پیدا کردن کاربر
      const user = await findOrCreateUser(normalizedPhone, name);

      await setUserSession({
        id: user.id,
        phone: user.phone,
        name: user.name,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          joinedAt: user.joinedAt,
        },
      });
    }

    return NextResponse.json(
      { error: "action نامعتبر است. باید send_code یا verify_code باشد" },
      { status: 400 }
    );
  } catch (e) {
    console.error("User auth error:", e);
    return NextResponse.json(
      { error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}

// GET /api/user/auth — دریافت session فعلی
export async function GET() {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}

// DELETE /api/user/auth — خروج
export async function DELETE() {
  await clearUserSession();
  return NextResponse.json({ success: true });
}
