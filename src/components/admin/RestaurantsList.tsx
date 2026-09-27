"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminPageHeader, AdminBadge, EmptyState } from "./ui";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import type { Restaurant } from "@prisma/client";

export function RestaurantsList({
  initialRestaurants,
}: {
  initialRestaurants: Restaurant[];
}) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = restaurants.filter(
    (r) => r.name.includes(search) || r.category.includes(search)
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/restaurants/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRestaurants((prev) => prev.filter((r) => r.id !== id));
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
        title="رستوران‌ها"
        description={`${restaurants.length.toLocaleString("fa-IR")} رستوران`}
        addHref="/admin/restaurants/new"
        addLabel="افزودن رستوران"
      />

      <div className="mb-4 relative">
        <Search className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی رستوران…"
          className="w-full bg-card border border-border rounded-xl py-2 pr-10 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🍽️" title="رستورانی یافت نشد" />
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-card border border-border/70 rounded-xl p-3 flex items-center gap-3"
            >
              <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
                {r.categoryEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/restaurants/${r.id}/edit`}
                  className="text-sm font-bold hover:text-primary block truncate"
                >
                  {r.name}
                </Link>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {r.category} · {r.deliveryTime} · {r.minOrder}
                </div>
              </div>
              <div className="text-sm font-bold text-amber-600">
                ⭐ {r.rating.toLocaleString("fa-IR")}
              </div>
              {r.featured && (
                <AdminBadge color="bg-amber-50 text-amber-700">ویژه</AdminBadge>
              )}
              {r.discount && (
                <AdminBadge color="bg-rose-50 text-rose-700">
                  ٪{r.discount.toLocaleString("fa-IR")} تخفیف
                </AdminBadge>
              )}
              {!r.isOpen && (
                <AdminBadge color="bg-slate-100 text-slate-700">بسته</AdminBadge>
              )}

              {confirmId === r.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={deletingId === r.id}
                    className="text-xs font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded-lg"
                  >
                    {deletingId === r.id ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      "تأیید حذف"
                    )}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="text-xs text-muted-foreground px-2 py-1 rounded-lg"
                  >
                    انصراف
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/restaurants/${r.id}/edit`}
                    className="size-8 rounded-lg bg-muted hover:bg-muted/70 flex items-center justify-center"
                    aria-label="ویرایش"
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                  <button
                    onClick={() => setConfirmId(r.id)}
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
