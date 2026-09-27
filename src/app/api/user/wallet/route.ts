import { NextRequest, NextResponse } from "next/server";
import { requireUser, getUserWalletBalance, recordWalletTransaction } from "@/lib/user-auth";
import { db } from "@/lib/db";

// GET /api/user/wallet — موجودی و تراکنش‌ها
export async function GET(req: NextRequest) {
  try {
    const session = await requireUser();
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const balance = await getUserWalletBalance(session.id);

    const transactions = await db.walletTransaction.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
      select: {
        id: true,
        type: true,
        amount: true,
        balanceAfter: true,
        description: true,
        reference: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      balance,
      transactions: transactions.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Wallet GET error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// POST /api/user/wallet — شارژ کیف پول
// body: { amount: 50000, method?: "zarinpal" | "sandbox" }
export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();
    const body = await req.json();
    const { amount, method } = body as { amount?: number; method?: string };

    if (!amount || amount < 1000) {
      return NextResponse.json(
        { error: "حداقل مبلغ شارژ ۱٬۰۰۰ تومان است" },
        { status: 400 }
      );
    }

    // در محیط sandbox، شارژ مستقیم انجام می‌شود
    // در محیط تولید، اینجا باید به درگاه پرداخت هدایت شود
    const isSandbox = process.env.NODE_ENV !== "production" || method === "sandbox";

    if (!isSandbox) {
      return NextResponse.json(
        { error: "درگاه پرداخت هنوز فعال نیست" },
        { status: 501 }
      );
    }

    const result = await recordWalletTransaction({
      userId: session.id,
      type: "deposit",
      amount,
      description: `شارژ کیف پول ${amount.toLocaleString("fa-IR")} تومان`,
      reference: `sandbox-${Date.now()}`,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      newBalance: result.balance,
    });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Wallet POST error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
