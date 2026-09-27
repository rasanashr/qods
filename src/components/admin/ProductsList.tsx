"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminPageHeader, AdminBadge, AdminButton, EmptyState } from "./ui";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import type { Product } from "@prisma/client";

export function ProductsList({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.includes(search) ||
      p.brand.includes(search) ||
      p.categoryLabel.includes(search)
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error("Delete error:", e);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="محصولات فروشگاه"
        description={`${products.length.toLocaleString("fa-IR")} محصول ثبت شده`}
        addHref="/admin/products/new"
        addLabel="افزودن محصول"
      />

      {/* جستجو */}
      <div className="mb-4 relative">
        <Search className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی محصول…"
          className="w-full bg-card border border-border rounded-xl py-2 pr-10 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* لیست */}
      {filtered.length === 0 ? (
        <EmptyState emoji="📦" title="محصولی یافت نشد" />
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-border/70 rounded-xl p-3 flex items-center gap-3"
            >
              <div className={`size-12 rounded-lg flex items-center justify-center text-2xl shrink-0 ${p.bg || "bg-muted"}`}>
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-sm font-bold hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  {p.discount && (
                    <AdminBadge color="bg-rose-50 text-rose-700">
                      ٪{p.discount.toLocaleString("fa-IR")} تخفیف
                    </AdminBadge>
                  )}
                  {!p.inStock && (
                    <AdminBadge color="bg-slate-100 text-slate-700">ناموجود</AdminBadge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {p.brand} · {p.categoryLabel}
                </div>
              </div>
              <div className="text-sm font-bold text-primary tabular-nums shrink-0">
                {p.price.toLocaleString("fa-IR")} ت
              </div>

              {confirmId === p.id ? (
                <div className="flex items-center gap-1">
                  <AdminButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                  >
                    {deletingId === p.id ? <Loader2 className="size-3 animate-spin" /> : "تأیید حذف"}
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmId(null)}
                  >
                    انصراف
                  </AdminButton>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="size-8 rounded-lg bg-muted hover:bg-muted/70 flex items-center justify-center"
                    aria-label="ویرایش"
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                  <button
                    onClick={() => setConfirmId(p.id)}
                    className="size-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center"
                    aria-label="حذف"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
