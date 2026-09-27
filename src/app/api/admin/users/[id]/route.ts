import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// PATCH /api/admin/users/[id] — مسدود/آزاد کردن کاربر یا تغییر نام
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;

  try {
    const body = await req.json();
    const { action, name, isBlocked } = body as {
      action?: "block" | "unblock";
      name?: string;
      isBlocked?: boolean;
    };

    // اگر کاربر سوپر اپ است
    const appUser = await db.appUser.findUnique({ where: { id } });
    if (appUser) {
      const data: Record<string, unknown> = {};
      if (typeof isBlocked === "boolean") data.isBlocked = isBlocked;
      else if (action === "block") data.isBlocked = true;
      else if (action === "unblock") data.isBlocked = false;
      if (name !== undefined) data.name = name;

      const updated = await db.appUser.update({ where: { id }, data });

      await logAdminAction({
        adminId: session.id,
        action: action || "update",
        resource: "app_user",
        resourceId: id,
        detail: action
          ? action === "block"
            ? "مسدود کردن کاربر"
            : "آزاد کردن کاربر"
          : "به‌روزرسانی پروفایل",
      });

      return NextResponse.json({ success: true, user: updated });
    }

    // اگر ادمین است
    const admin = await db.adminUser.findUnique({ where: { id } });
    if (admin) {
      const data: Record<string, unknown> = {};
      if (typeof isBlocked === "boolean") data.isActive = !isBlocked;
      else if (action === "block") data.isActive = false;
      else if (action === "unblock") data.isActive = true;
      if (name !== undefined) data.fullName = name;

      const updated = await db.adminUser.update({
        where: { id },
        data,
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
          isActive: true,
        },
      });

      await logAdminAction({
        adminId: session.id,
        action: action || "update",
        resource: "admin_user",
        resourceId: id,
        detail: action
          ? action === "block"
            ? "غیرفعال کردن ادمین"
            : "فعال کردن ادمین"
          : "به‌روزرسانی ادمین",
      });

      return NextResponse.json({ success: true, user: updated });
    }

    return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
  } catch (e) {
    console.error("Update user error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  if (session.role !== "superadmin") {
    return NextResponse.json(
      { error: "فقط superadmin می‌تواند حذف کند" },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    // جلوگیری از حذف خود
    if (id === session.id) {
      return NextResponse.json(
        { error: "نمی‌توانید خودتان را حذف کنید" },
        { status: 400 }
      );
    }

    const appUser = await db.appUser.findUnique({ where: { id } });
    if (appUser) {
      await db.appUser.delete({ where: { id } });
      await logAdminAction({
        adminId: session.id,
        action: "delete",
        resource: "app_user",
        resourceId: id,
      });
      return NextResponse.json({ success: true });
    }

    const admin = await db.adminUser.findUnique({ where: { id } });
    if (admin) {
      await db.adminUser.delete({ where: { id } });
      await logAdminAction({
        adminId: session.id,
        action: "delete",
        resource: "admin_user",
        resourceId: id,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
  } catch (e) {
    console.error("Delete user error:", e);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}
