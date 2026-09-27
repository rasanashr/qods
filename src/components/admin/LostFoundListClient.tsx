"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminPageHeader, AdminBadge, EmptyState } from "./ui";
import { Plus, Pencil, Trash2, Search as SearchIcon, Loader2 } from "lucide-react";
import type { LostFoundItem } from "@prisma/client";

export function LostFoundListClient({ initialItems }: { initialItems: LostFoundItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = items.filter(
    (it) =>
      it.title.includes(search) ||
      it.location.includes(search) ||
      it.categoryLabel.includes(search)
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/lost-found/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it.id !== id));
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
        title="اشیاء گمشده"
        description={`${items.length.toLocaleString("fa-IR")} مورد`}
        addHref="/admin/lost-found/new"
        addLabel="افزودن مورد"
      />

      <div className="mb-4 relative">
        <SearchIcon className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی عنوان، دسته، مکان…"
          className="w-full bg-card border border-border rounded-xl py-2 pr-10 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🔍" title="موردی یافت نشد" />
      ) : (
        <div className="space-y-2">
          {filtered.map((it) => (
            <div
              key={it.id}
              className="bg-card border border-border/70 rounded-xl p-3 flex items-center gap-3"
            >
              <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
                {it.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/admin/lost-found/${it.id}/edit`}
                    className="text-sm font-bold hover:text-primary truncate"
                  >
                    {it.title}
                  </Link>
                  <AdminBadge
                    color={it.status === "lost" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}
                  >
                    {it.status === "lost" ? "گم‌شده" : "پیدا‌شده"}
                  </AdminBadge>
                  <AdminBadge
                    color={
                      it.status_admin === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : it.status_admin === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700"
                    }
                  >
                    {it.status_admin === "approved" ? "تأیید شده" : it.status_admin === "pending" ? "در انتظار" : "رد شده"}
                  </AdminBadge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                  {it.categoryLabel} · {it.location} · {it.date}
                  {it.reward ? ` · ${it.reward}` : ""}
                </div>
              </div>

              {confirmId === it.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(it.id)}
                    disabled={deletingId === it.id}
                    className="text-xs font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded-lg"
                  >
                    {deletingId === it.id ? <Loader2 className="size-3 animate-spin" /> : "تأیید حذف"}
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
                    href={`/admin/lost-found/${it.id}/edit`}
                    className="size-8 rounded-lg bg-muted hover:bg-muted/70 flex items-center justify-center"
                    aria-label="ویرایش"
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                  <button
                    onClick={() => setConfirmId(it.id)}
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
