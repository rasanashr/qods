"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminPageHeader, AdminBadge, EmptyState } from "./ui";
import { Plus, Pencil, Trash2, Search as SearchIcon, ChevronLeft, Loader2 } from "lucide-react";
import type { Property } from "@prisma/client";

export function PropertiesListClient({ initialProperties }: { initialProperties: Property[] }) {
  const [properties, setProperties] = useState(initialProperties);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = properties.filter(
    (p) =>
      p.title.includes(search) ||
      p.location.includes(search) ||
      p.district.includes(search) ||
      p.dealLabel.includes(search)
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
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
        title="آگهی‌های املاک"
        description={`${properties.length.toLocaleString("fa-IR")} آگهی`}
        addHref="/admin/properties/new"
        addLabel="افزودن آگهی"
      />

      <div className="mb-4 relative">
        <SearchIcon className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی عنوان، منطقه، نوع معامله…"
          className="w-full bg-card border border-border rounded-xl py-2 pr-10 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji="🏠" title="آگهی املاکی یافت نشد" />
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-border/70 rounded-xl p-3 flex items-center gap-3"
            >
              <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/admin/properties/${p.id}`}
                    className="text-sm font-bold hover:text-primary truncate"
                  >
                    {p.title}
                  </Link>
                  <AdminBadge
                    color={
                      p.status === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : p.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700"
                    }
                  >
                    {p.status === "approved" ? "تأیید شده" : p.status === "pending" ? "در انتظار" : "رد شده"}
                  </AdminBadge>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                  {p.dealLabel} · {p.location} · {p.price}
                  {p.rent ? ` · اجاره: ${p.rent}` : ""}
                </div>
              </div>

              {confirmId === p.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="text-xs font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded-lg"
                  >
                    {deletingId === p.id ? <Loader2 className="size-3 animate-spin" /> : "تأیید حذف"}
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
                    href={`/admin/properties/${p.id}/edit`}
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
