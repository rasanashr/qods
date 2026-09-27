import { NextResponse } from "next/server";
import { getAdminSession } from "./admin-auth";
import { db } from "./db";

// Helper برای دریافت session ادمین یا خطای 401
export async function getAdminOrFail() {
  const session = await getAdminSession();
  if (!session) {
    return {
      error: NextResponse.json(
        { error: "احراز هویت نشده‌اید" },
        { status: 401 }
      ),
      session: null,
    };
  }
  // بررسی فعال بودن ادمین
  const admin = await db.adminUser.findUnique({
    where: { id: session.id },
    select: { isActive: true },
  });
  if (!admin || !admin.isActive) {
    return {
      error: NextResponse.json(
        { error: "حساب شما غیرفعال است" },
        { status: 403 }
      ),
      session: null,
    };
  }
  return { error: null, session };
}

// لاگ کردن اقدامات ادمین
export async function logAdminAction(params: {
  adminId: string;
  action: string;
  resource: string;
  resourceId?: string;
  detail?: string;
}) {
  try {
    await db.adminLog.create({ data: params });
  } catch (e) {
    console.error("Failed to log admin action:", e);
  }
}

// فرمت قیمت برای نمایش فارسی
export function formatPrice(num: number): string {
  return num.toLocaleString("fa-IR") + " ت";
}

// فرمت تاریخ شمسی ساده (بدون کتابخانه خارجی)
export function toPersianDate(date: Date = new Date()): string {
  try {
    return date.toLocaleDateString("fa-IR");
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

// تبدیل اعداد فارسی به انگلیسی
export function persianToEnglishDigits(input: string): string {
  return input.replace(/[۰-۹]/g, (d) =>
    String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))
  );
}
