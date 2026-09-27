import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminOrFail, logAdminAction } from "@/lib/admin-utils";

// GET /api/admin/products/[id] — یک محصول
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

// PATCH /api/admin/products/[id] — به‌روزرسانی
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    for (const key of [
      "name",
      "brand",
      "emoji",
      "installment",
      "category",
      "categoryLabel",
      "description",
    ]) {
      if (body[key] !== undefined) data[key] = String(body[key]);
    }
    for (const key of ["price", "originalPrice", "discount", "reviewCount", "soldCount"]) {
      if (body[key] !== undefined) data[key] = Number(body[key]);
    }
    if (body.rating !== undefined) data.rating = Number(body.rating);
    if (body.features !== undefined) data.features = JSON.stringify(body.features);
    if (body.specs !== undefined) data.specs = JSON.stringify(body.specs);
    if (typeof body.inStock === "boolean") data.inStock = body.inStock;
    if (typeof body.freeShipping === "boolean") data.freeShipping = body.freeShipping;
    if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;

    const updated = await db.product.update({ where: { id }, data });

    await logAdminAction({
      adminId: session.id,
      action: "update",
      resource: "product",
      resourceId: id,
      detail: `به‌روزرسانی محصول: ${existing.name}`,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (e) {
    console.error("Update product error:", e);
    return NextResponse.json(
      { error: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, session } = await getAdminOrFail();
  if (authError || !session) return authError!;

  const { id } = await params;
  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
  }

  await db.product.delete({ where: { id } });
  await logAdminAction({
    adminId: session.id,
    action: "delete",
    resource: "product",
    resourceId: id,
    detail: `حذف محصول: ${existing.name}`,
  });

  return NextResponse.json({ success: true });
}
