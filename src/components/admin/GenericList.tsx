"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminPageHeader, AdminBadge, EmptyState } from "./ui";
import { Search, Trash2, Loader2, ChevronLeft } from "lucide-react";

export type GenericItem = {
  id: string;
  title: string;
  subtitle?: string;
  badge?: { label: string; color: string };
  emoji?: string;
  detailHref?: string;
};

export function GenericList({
  items,
  title,
  description,
  addHref,
  addLabel,
  emptyEmoji,
  emptyTitle,
  onDelete,
  searchFields = ["title"],
  showViewAll = false,
}: {
  items: GenericItem[];
  title: string;
  description?: string;
  addHref?: string;
  addLabel?: string;
  emptyEmoji?: string;
  emptyTitle?: string;
  onDelete?: (id: string) => Promise<void>;
  searchFields?: string[];
  showViewAll?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = search
    ? items.filter((i) =>
        searchFields.some(
          (f) =>
            i[f as keyof GenericItem]?.toString().includes(search)
        )
      )
    : items;

  return (
    <div>
      <AdminPageHeader
        title={title}
        description={description}
        addHref={addHref}
        addLabel={addLabel}
      />

      <div className="mb-4 relative">
        <Search className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو…"
          className="w-full bg-card border border-border rounded-xl py-2 pr-10 pl-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState emoji={emptyEmoji || "📦"} title={emptyTitle || "موردی یافت نشد"} />
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border/70 rounded-xl p-3 flex items-center gap-3"
            >
              {item.emoji && (
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
                  {item.emoji}
                </div>
              )}
              <div className="flex-1 min-w-0">
                {item.detailHref ? (
                  <Link href={item.detailHref} className="text-sm font-bold hover:text-primary block truncate">
                    {item.title}
                  </Link>
                ) : (
                  <div className="text-sm font-bold truncate">{item.title}</div>
                )}
                {item.subtitle && (
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {item.subtitle}
                  </div>
                )}
              </div>
              {item.badge && (
                <AdminBadge color={item.badge.color}>{item.badge.label}</AdminBadge>
              )}

              {onDelete && (
                <>
                  {confirmId === item.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={async () => {
                          setDeletingId(item.id);
                          await onDelete(item.id);
                          setDeletingId(null);
                          setConfirmId(null);
                        }}
                        disabled={deletingId === item.id}
                        className="text-xs font-bold bg-rose-50 text-rose-600 px-2 py-1 rounded-lg"
                      >
                        {deletingId === item.id ? (
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
                    <button
                      onClick={() => setConfirmId(item.id)}
                      className="size-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center"
                      aria-label="حذف"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </>
              )}
              {showViewAll && item.detailHref && (
                <Link
                  href={item.detailHref}
                  className="size-8 rounded-lg bg-muted hover:bg-muted/70 flex items-center justify-center"
                  aria-label="مشاهده"
                >
                  <ChevronLeft className="size-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
