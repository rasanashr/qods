import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/user-auth";
import { db } from "@/lib/db";

// GET /api/user/sama137 — درخواست‌های کاربر
export async function GET(req: NextRequest) {
  try {
    const session = await requireUser();
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "";

    const where: Record<string, unknown> = { requesterId: session.id };
    if (status && status !== "all") where.status = status;

    const requests = await db.sama137Request.findMany({
      where,
      orderBy: { created_at: "desc" },
      take: 100,
    });

    return NextResponse.json({ requests });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Get sama requests error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// POST — ثبت درخواست جدید
export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();
    const body = await req.json();
    const {
      title, category, categoryLabel, emoji, description,
      address, district, priority, priorityLabel,
    } = body as Record<string, unknown>;

    if (!title || !description || !address || !category) {
      return NextResponse.json(
        { error: "عنوان، توضیحات، آدرس و دسته الزامی است" },
        { status: 400 }
      );
    }

    // تولید کد رهگیری یکتا
    const trackingCode = `۱۳۷-${Math.floor(Math.random() * 90000) + 10000}`;
    const now = new Date();
    const persianDate = now.toLocaleDateString("fa-IR");

    const timeline = JSON.stringify([
      { label: "ثبت درخواست", date: persianDate, done: true },
      { label: "در انتظار بررسی اولیه", date: "—", done: false },
      { label: "ارجاع به واحد مربوطه", date: "—", done: false },
      { label: "اعزام تیم", date: "—", done: false },
      { label: "تأیید تکمیل", date: "—", done: false },
    ]);

    const request = await db.sama137Request.create({
      data: {
        trackingCode,
        title: String(title),
        category: String(category),
        categoryLabel: String(categoryLabel || ""),
        emoji: String(emoji || "📋"),
        description: String(description),
        address: String(address),
        district: String(district || ""),
        status: "pending",
        statusLabel: "در انتظار بررسی",
        priority: String(priority || "medium"),
        priorityLabel: String(priorityLabel || "متوسط"),
        createdAt: persianDate,
        timeAgo: "همین الان",
        updatedAt: persianDate,
        attachments: JSON.stringify([]),
        timeline,
        requesterId: session.id,
      },
    });

    return NextResponse.json({ success: true, request });
  } catch (e) {
    if (e instanceof Error && (e.message === "UNAUTHORIZED" || e.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "احراز هویت نشده‌اید" }, { status: 401 });
    }
    console.error("Create sama request error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
