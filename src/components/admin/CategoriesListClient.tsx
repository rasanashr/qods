"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminPageHeader, AdminBadge, EmptyState } from "./ui";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

type Category = {
  id: string;
  category: string;
  categoryLabel: string;
  freeDays: number;
  featuredPrice: number;
  urgentPrice: number;
  featuredDays: number;
  urgentDays: number;
  isActive: boolean;
  classifiedsCount: number;
};

export function CategoriesListClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const toggleActive = async (id: string, current: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/admin/classifieds/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !current } : c))
        );
      }
    } catch (e) {
      console.error("Toggle error:", e);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/classifieds/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "خطا در حذف");
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
        title="دسته‌بندی‌های آگهی"
        description={`${categories.length.toLocaleString("fa-IR")} دسته`}
        addHref="/admin/classifieds/categories/new"
        addLabel="افزودن دسته"
      />

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
        <p className="text-xs text-amber-800">
          💡 هر دسته قیمت‌گذاری جداگانه برای طرح رایگان، ویژه و فوری دارد. کاربر هنگام ثبت آگهی، این قیمت‌ها را می‌بیند.
        </p>
      </div>

      {categories.length === 0 ? (
        <EmptyState emoji="🏷️" title="دسته‌ای تعریف نشده" />
      ) : (
        <div className="space-y-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-card border border-border/70 rounded-xl p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold">{c.categoryLabel}</h3>
                    <AdminBadge color="bg-slate-100 text-slate-700">
                      {c.category}
                    </AdminBadge>
                    <AdminBadge
                      color={
                        c.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }
                    >
                      {c.isActive ? "فعال" : "غیرفعال"}
                    </AdminBadge>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {c.classifiedsCount.toLocaleString("fa-IR")} آگهی
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/classifieds/categories/${c.id}/edit`}
                    className="size-8 rounded-lg bg-muted hover:bg-muted/70 flex items-center justify-center"
                    aria-label="ویرایش"
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                  <button
                    onClick={() => toggleActive(c.id, c.isActive)}
                    disabled={togglingId === c.id}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                      c.isActive
                        ? "bg-slate-100 text-slate-600"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {togglingId === c.id ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : c.isActive ? (
                      "غیرفعال"
                    ) : (
                      "فعال"
                    )}
                  </button>
                  {confirmId === c.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                        className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded-lg"
                      >
                        {deletingId === c.id ? <Loader2 className="size-3 animate-spin" /> : "تأیید"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-[10px] text-muted-foreground px-1"
                      >
                        انصراف
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(c.id)}
                      disabled={c.classifiedsCount > 0}
                      className="size-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center disabled:opacity-40"
                      aria-label="حذف"
                      title={c.classifiedsCount > 0 ? "به دلیل وجود آگهی وابسته قابل حذف نیست" : "حذف"}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* قیمت‌گذاری */}
              <div className="mt-3 pt-2 border-t border-border/40 grid grid-cols-3 gap-2">
                <div className="bg-muted/40 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-muted-foreground">رایگان</div>
                  <div className="text-xs font-bold tabular-nums">{c.freeDays.toLocaleString("fa-IR")} روز</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-amber-700">ویژه</div>
                  <div className="text-xs font-bold tabular-nums">{c.featuredPrice.toLocaleString("fa-IR")} ت</div>
                  <div className="text-[9px] text-amber-700">{c.featuredDays.toLocaleString("fa-IR")} روز</div>
                </div>
                <div className="bg-rose-50 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-rose-700">فوری</div>
                  <div className="text-xs font-bold tabular-nums">{c.urgentPrice.toLocaleString("fa-IR")} ت</div>
                  <div className="text-[9px] text-rose-700">{c.urgentDays.toLocaleString("fa-IR")} روز</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
