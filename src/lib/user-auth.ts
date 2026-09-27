import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const SECRET = new TextEncoder().encode(
  process.env.USER_JWT_SECRET ||
    "quds-user-secret-change-in-production-very-long"
);

const COOKIE_NAME = "quds_user_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 روز

export type UserSession = {
  id: string;
  phone: string;
  name: string | null;
};

// صدور توکن JWT برای کاربر
export async function signUserToken(payload: UserSession): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(SECRET);
}

export async function verifyUserToken(
  token: string
): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      id: payload.id as string,
      phone: payload.phone as string,
      name: (payload.name as string) || null,
    };
  } catch {
    return null;
  }
}

export async function setUserSession(payload: UserSession) {
  const token = await signUserToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getUserSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyUserToken(token);
}

export async function requireUser(): Promise<UserSession> {
  const session = await getUserSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  // بررسی فعال بودن کاربر
  const user = await db.appUser.findUnique({
    where: { id: session.id },
    select: { isBlocked: true },
  });
  if (!user || user.isBlocked) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

// تولید کد ۵ رقمی
export function generateOtpCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// ایجاد OTP در دیتابیس
export async function createOtpForPhone(phone: string): Promise<{
  code: string;
  expiresAt: Date;
}> {
  // حذف کدهای قبلی فعال برای این شماره
  await db.otpCode.updateMany({
    where: { phone, consumed: false },
    data: { consumed: true },
  });

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 دقیقه

  await db.otpCode.create({
    data: { phone, code, expiresAt },
  });

  return { code, expiresAt };
}

// تأیید OTP
export async function verifyOtp(
  phone: string,
  code: string
): Promise<boolean> {
  const otp = await db.otpCode.findFirst({
    where: {
      phone,
      code,
      consumed: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    // ثبت تلاش ناموفق
    return false;
  }

  // بررسی تعداد تلاش‌ها
  if (otp.attemptCount >= 5) {
    await db.otpCode.update({
      where: { id: otp.id },
      data: { consumed: true },
    });
    return false;
  }

  // افزایش شمارنده تلاش‌ها (در اینجا موفق بوده)
  await db.otpCode.update({
    where: { id: otp.id },
    data: { consumed: true },
  });

  return true;
}

// دریافت یا ایجاد کاربر بر اساس شماره موبایل
export async function findOrCreateUser(phone: string, name?: string) {
  const existing = await db.appUser.findUnique({ where: { phone } });
  if (existing) {
    // اگر نام داده شد و کاربر نام نداشت، آپدیت کنیم
    if (name && !existing.name) {
      return await db.appUser.update({
        where: { id: existing.id },
        data: { name },
      });
    }
    return existing;
  }
  // ایجاد کاربر جدید
  return await db.appUser.create({
    data: {
      phone,
      name: name || null,
      isVerified: true,
    },
  });
}

// محاسبه موجودی کیف پول کاربر
export async function getUserWalletBalance(userId: string): Promise<number> {
  const lastTx = await db.walletTransaction.findFirst({
    where: { userId, status: "completed" },
    orderBy: { createdAt: "desc" },
    select: { balanceAfter: true },
  });
  return lastTx?.balanceAfter ?? 0;
}

// ثبت تراکنش کیف پول
export async function recordWalletTransaction(params: {
  userId: string;
  type: "deposit" | "withdraw" | "spend" | "refund";
  amount: number; // مثبت برای واریز، منفی برای برداشت
  description?: string;
  reference?: string;
}): Promise<{ success: boolean; balance: number; error?: string }> {
  const { userId, type, amount, description, reference } = params;

  // محاسبه موجودی فعلی
  const currentBalance = await getUserWalletBalance(userId);

  if ((type === "withdraw" || type === "spend") && amount > currentBalance) {
    return {
      success: false,
      balance: currentBalance,
      error: "موجودی کیف پول کافی نیست",
    };
  }

  const newBalance = currentBalance + amount;
  if (newBalance < 0) {
    return {
      success: false,
      balance: currentBalance,
      error: "موجودی نمی‌تواند منفی شود",
    };
  }

  await db.walletTransaction.create({
    data: {
      userId,
      type,
      amount,
      balanceAfter: newBalance,
      description,
      reference,
      status: "completed",
    },
  });

  return { success: true, balance: newBalance };
}
