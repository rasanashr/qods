"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminPageHeader, AdminBadge, EmptyState } from "./ui";
import {
  Plus,
  Pencil,
  Trash2,
  Search as SearchIcon,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type Owner = { id: string; name: string | null; phone: string };

type ClassifiedItem = {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  emoji: string;
  description: string;
  price: string;
  location: string;
  status: string;
  plan: string;
  isPaid: boolean;
  paidAmount: number;
  createdAt: string;
  owner: Owner | null;
};

const statusFilters = [
  { id: "all", label: "همه", emoji: "📋" },
  { id: "pending", label: "در انتظار", emoji: "⏳" },
  { id: "approved", label: "تأیید شده", emoji: "✅" },
  { id: "rejected", label: "رد شده", emoji: "❌" },
];

export function AdminClassifiedsListClient({ initialItems }: { initialItems: ClassifiedItem[] }) {
  const [items, setItems] = useState<ClassifiedItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = items.filter((it) => {
    if (statusFilter !== "all" && it.status !== statusFilter) return false;
    if (search) {
      const q = search;
      return (
        it.title.includes(q) ||
        it.description.includes(q) ||
        it.location.includes(q) ||
        it.categoryLabel.includes(q) ||
        it.owner?.phone.includes(q) ||
        it.owner?.name?.includes(q)
      );
    }
    return true;
  });

  const updateStatus = async (id: string, status: string) => {
    setActioningId(id);
    try {
      const res = await fetch(`/api/admin/classifieds/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, status } : it))
        );
      }
    } catch (e) {
      console.error("Update error:", e);
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActioningId(id);
    try {
      const res = await fetch(`/api/admin/classifieds/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it.id !== id));
      }
    } catch (e) {
      console.error("Delete error:", e);
    } finally {
      setActioningId(null);
      setConfirmId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="آگهی‌های نیازمندی‌ها"
        description={`${items.length.toLocaleString("fa-IR")} آگهی`}
        addHref="/admin/classifieds/categories"
        addLabel="مدیریت دسته‌بندی‌ها"
      />

      {/* آمار سریع */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-card border border-border/70 rounded-xl p-2 text-center">
          <div className="text-lg">{items.filter((i) => i.status === "pending").length.toLocaleString("fa-IR")}</div>
          <div className="text-[10px] text-muted-foreground">در انتظار</div>
        </div>
        <div className="bg-card border border-border/70 rounded-xl p-2 text-center">
          <div className="text-lg">{items.filter((i) => i.status === "approved").length.toLocaleString("fa-IR")}</div>
          <div className="text-[10px] text-muted-foreground">تأیید شده</div>
        </div>
        <div className="bg-card border border-border/70 rounded-xl p-2 text-center">
          <div className="text-lg">{items.filter((i) => i.status === "rejected").length.toLocaleString("fa-IR")}</div>
          <div className="text-[10px] text-muted-foreground">رد شده</div>
        </div>
        <div className="bg-card border border-border/70 rounded-xl p-2 text-center">
          <div className="text-lg">{items.filter((i) => i.isPaid).length.toLocaleString("fa-IR")}</div>
          <div className="text-[10px] text-muted-foreground">پولی</div>
        </div>
      </div>

      {/* فیلتر وضعیت */}
      <div className="mb-4 flex gap-1 bg-card border border-border rounded-xl p-1 overflow-x-auto no-scrollbar">
        {statusFilters.map((s) => (
          <button
            key={s.id}
            onClick={() => setStatusFilter(s.id)}
            className={`shrink-0 flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              statusFilter === s.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
            }`}
          >
            <span>{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* جستجو */}
      <div className="mb-4 relative">
        <SearchIcon className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی عنوان، توضیحات، شماره کاربر…"
          className="w-full bg-card border border-border rounded-xl py-2 pr-10 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* لیست */}
      {filtered.length === 0 ? (
        <EmptyState emoji="📋" title="آگهی‌ای یافت نشد" />
      ) : (
        <div className="space-y-2">
          {filtered.map((it) => (
            <div
              key={it.id}
              className="bg-card border border-border/70 rounded-xl p-3"
            >
              <div className="flex items-start gap-3">
                <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
                  {it.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/admin/classifieds/${it.id}`}
                      className="text-sm font-bold hover:text-primary truncate"
                    >
                      {it.title}
                    </Link>
                    {it.isPaid && (
                      <AdminBadge color="bg-amber-50 text-amber-700">
                        {it.plan === "featured" ? "ویژه" : "فوری"}
                      </AdminBadge>
                    )}
                    <AdminBadge
                      color={
                        it.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : it.status === "pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700"
                      }
                    >
                      {it.status === "approved" ? "تأیید شده" : it.status === "pending" ? "در انتظار" : "رد شده"}
                    </AdminBadge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {it.categoryLabel} · {it.location} · {it.price}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    {it.owner?.name || "بدون مالک"} · {it.owner?.phone}
                  </div>
                </div>
              </div>

              {/* دکمه‌های اقدام */}
              <div className="mt-3 pt-2 border-t border-border/40 flex items-center gap-2 flex-wrap">
                {it.status !== "approved" && (
                  <button
                    onClick={() => updateStatus(it.id, "approved")}
                    disabled={actioningId === it.id}
                    className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1"
                  >
                    {actioningId === it.id ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
                    تأیید
                  </button>
                )}
                {it.status !== "rejected" && (
                  <button
                    onClick={() => updateStatus(it.id, "rejected")}
                    disabled={actioningId === it.id}
                    className="text-[11px] font-bold bg-rose-50 text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1"
                  >
                    {actioningId === it.id ? <Loader2 className="size-3 animate-spin" /> : <XCircle className="size-3.5" />}
                    رد
                  </button>
                )}
                {it.status !== "pending" && (
                  <button
                    onClick={() => updateStatus(it.id, "pending")}
                    disabled={actioningId === it.id}
                    className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    بازگرداندن به انتظار
                  </button>
                )}
                <Link
                  href={`/admin/classifieds/${it.id}`}
                  className="text-[11px] font-bold bg-muted text-foreground px-2 py-1 rounded-lg hover:bg-muted/70 transition-colors flex items-center gap-1"
                >
                  جزئیات
                  <ChevronLeft className="size-3" />
                </Link>

                <div className="mr-auto flex items-center gap-1">
                  {confirmId === it.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(it.id)}
                        disabled={actioningId === it.id}
                        className="text-[11px] font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded-lg"
                      >
                        {actioningId === it.id ? <Loader2 className="size-3 animate-spin" /> : "تأیید حذف"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-[11px] text-muted-foreground px-2 py-1 rounded-lg"
                      >
                        انصراف
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmId(it.id)}
                      className="size-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center"
                      aria-label="حذف"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
