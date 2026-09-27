"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminPageHeader, AdminBadge, EmptyState } from "./ui";
import { Plus, Pencil, Trash2, Search as SearchIcon, Loader2 } from "lucide-react";
import type { Banner } from "@prisma/client";

export function BannersListClient({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = banners.filter(
    (b) => b.title.includes(search) || b.position.includes(search)
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
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
        title="بنرها و اسلایدرها"
        description={`${banners.length.toLocaleString("fa-IR")} بنر`}
        addHref="/admin/banners/new"
        addLabel="افزودن بنر"
      />

      <div className="mb-4 relative">
        <SearchIcon className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی عنوان…"
          className="w-full bg-card border border-border rounded-xl py-2 pr-10 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🖼️" title="بنری یافت نشد" />
      ) : (
        <div className="space-y-2">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="bg-card border border-border/70 rounded-xl p-3 flex items-center gap-3"
            >
              <div className={`size-12 rounded-lg bg-gradient-to-br ${b.gradient} flex items-center justify-center text-2xl shrink-0`}>
                {b.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/admin/banners/${b.id}/edit`}
                    className="text-sm font-bold hover:text-primary truncate"
                  >
                    {b.title}
                  </Link>
                  <AdminBadge
                    color={b.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}
                  >
                    {b.isActive ? "فعال" : "غیرفعال"}
                  </AdminBadge>
                  <AdminBadge color="bg-sky-50 text-sky-700">
                    {b.position === "home_carousel" ? "اسلایدر" : "بنر تبلیغاتی"}
                  </AdminBadge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                  {b.subtitle} · ترتیب: {b.sortOrder.toLocaleString("fa-IR")}
                </div>
              </div>

              {confirmId === b.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={deletingId === b.id}
                    className="text-xs font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded-lg"
                  >
                    {deletingId === b.id ? <Loader2 className="size-3 animate-spin" /> : "تأیید حذف"}
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
                    href={`/admin/banners/${b.id}/edit`}
                    className="size-8 rounded-lg bg-muted hover:bg-muted/70 flex items-center justify-center"
                    aria-label="ویرایش"
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                  <button
                    onClick={() => setConfirmId(b.id)}
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
